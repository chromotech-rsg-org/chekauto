import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import * as XLSX from "xlsx";
import { toast } from "sonner";

interface ExportField {
  key: string;
  label: string;
}

interface ExportButtonProps {
  data: any[];
  fields: ExportField[];
  filename: string;
}

export function ExportButton({ data, fields, filename }: ExportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFields, setSelectedFields] = useState<string[]>(fields.map(f => f.key));

  const toggleField = (fieldKey: string) => {
    setSelectedFields(prev =>
      prev.includes(fieldKey)
        ? prev.filter(k => k !== fieldKey)
        : [...prev, fieldKey]
    );
  };

  const selectAll = () => {
    setSelectedFields(fields.map(f => f.key));
  };

  const deselectAll = () => {
    setSelectedFields([]);
  };

  const handleExport = () => {
    if (selectedFields.length === 0) {
      toast.error("Selecione pelo menos um campo para exportar");
      return;
    }

    // Filtrar dados apenas com campos selecionados
    const exportData = data.map(item => {
      const filtered: any = {};
      selectedFields.forEach(key => {
        const field = fields.find(f => f.key === key);
        if (field) {
          filtered[field.label] = item[key] ?? "";
        }
      });
      return filtered;
    });

    // Criar planilha
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Dados");

    // Download
    XLSX.writeFile(wb, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`);
    
    toast.success("Dados exportados com sucesso!");
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Exportar
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Exportar Dados</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={selectAll}>
              Selecionar Todos
            </Button>
            <Button variant="outline" size="sm" onClick={deselectAll}>
              Limpar Seleção
            </Button>
          </div>
          <div className="space-y-3">
            {fields.map((field) => (
              <div key={field.key} className="flex items-center space-x-2">
                <Checkbox
                  id={field.key}
                  checked={selectedFields.includes(field.key)}
                  onCheckedChange={() => toggleField(field.key)}
                />
                <Label
                  htmlFor={field.key}
                  className="text-sm font-normal cursor-pointer"
                >
                  {field.label}
                </Label>
              </div>
            ))}
          </div>
          <div className="text-sm text-muted-foreground">
            {selectedFields.length} campo{selectedFields.length !== 1 ? "s" : ""} selecionado{selectedFields.length !== 1 ? "s" : ""}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancelar
          </Button>
          <Button 
            className="bg-brand-yellow hover:bg-brand-yellow/90 text-black"
            onClick={handleExport}
          >
            <Download className="mr-2 h-4 w-4" />
            Exportar Excel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
