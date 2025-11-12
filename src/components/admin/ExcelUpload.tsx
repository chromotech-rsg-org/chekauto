import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, FileSpreadsheet, X, CheckCircle, AlertCircle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import * as XLSX from "xlsx";
import { toast } from "sonner";

interface ExcelUploadProps {
  onUpload: (data: any[]) => void;
}

export const ExcelUpload = ({ onUpload }: ExcelUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validar tipo de arquivo
    const validTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel"
    ];
    
    if (!validTypes.includes(selectedFile.type)) {
      setError("Formato de arquivo inválido. Por favor, envie um arquivo Excel (.xlsx ou .xls)");
      return;
    }

    setFile(selectedFile);
    setError("");
    parseExcel(selectedFile);
  };

  const parseExcel = (file: File) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        
        // Pegar a primeira planilha
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Converter para JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
        
        if (jsonData.length < 2) {
          setError("O arquivo está vazio ou não contém dados suficientes");
          return;
        }

        // Primeira linha são os cabeçalhos
        const headers = jsonData[0] as string[];
        setHeaders(headers);

        // Converter restante das linhas em objetos
        const rows = jsonData.slice(1, 6).map((row: any[]) => {
          const obj: any = {};
          headers.forEach((header, index) => {
            obj[header] = row[index] || "";
          });
          return obj;
        });

        setPreviewData(rows);
        toast.success("Arquivo carregado com sucesso! Revise os dados antes de importar.");
      } catch (err) {
        setError("Erro ao processar o arquivo. Verifique se o formato está correto.");
        console.error(err);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleRemoveFile = () => {
    setFile(null);
    setPreviewData([]);
    setHeaders([]);
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleImport = () => {
    if (previewData.length === 0) {
      toast.error("Nenhum dado para importar");
      return;
    }

    // Ler novamente o arquivo completo para importação
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        onUpload(jsonData);
      } catch (err) {
        toast.error("Erro ao importar dados");
        console.error(err);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="space-y-4 py-4">
      {/* Upload Area */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-brand-yellow transition-colors">
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileChange}
          className="hidden"
          id="excel-upload"
        />
        <label htmlFor="excel-upload" className="cursor-pointer">
          <div className="flex flex-col items-center gap-3">
            <div className="p-4 bg-muted rounded-full">
              <Upload className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <p className="font-semibold">Clique para selecionar ou arraste o arquivo</p>
              <p className="text-sm text-muted-foreground">Formatos aceitos: .xlsx, .xls</p>
            </div>
          </div>
        </label>
      </div>

      {/* Erro */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Arquivo Selecionado */}
      {file && !error && (
        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
          <div className="flex items-center gap-3">
            <FileSpreadsheet className="h-5 w-5 text-green-600" />
            <div>
              <p className="font-medium">{file.name}</p>
              <p className="text-sm text-muted-foreground">
                {(file.size / 1024).toFixed(2)} KB
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={handleRemoveFile}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Preview dos Dados */}
      {previewData.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <p className="font-semibold">Preview dos Dados (primeiras 5 linhas)</p>
          </div>
          
          <div className="border rounded-lg overflow-x-auto max-h-[300px] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {headers.map((header, index) => (
                    <TableHead key={index} className="whitespace-nowrap">
                      {header}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {previewData.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {headers.map((header, colIndex) => (
                      <TableCell key={colIndex} className="whitespace-nowrap">
                        {row[header]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <Alert>
            <AlertDescription>
              Os dados acima são apenas uma prévia. Ao confirmar, todos os registros do arquivo serão importados.
            </AlertDescription>
          </Alert>

          <Button
            onClick={handleImport}
            className="w-full bg-brand-yellow hover:bg-brand-yellow/90 text-black"
          >
            Confirmar Importação
          </Button>
        </div>
      )}
    </div>
  );
};
