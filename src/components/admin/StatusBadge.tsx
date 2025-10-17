import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: string;
}

const statusVariants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; className: string }> = {
  "Pendente": { variant: "outline", className: "border-yellow-500 text-yellow-700 bg-yellow-50" },
  "Em Análise": { variant: "outline", className: "border-blue-500 text-blue-700 bg-blue-50" },
  "Aprovado": { variant: "outline", className: "border-green-500 text-green-700 bg-green-50" },
  "Concluído": { variant: "secondary", className: "bg-gray-100 text-gray-700" },
  "Cancelado": { variant: "destructive", className: "bg-red-100 text-red-700" },
  "Processado": { variant: "outline", className: "border-blue-500 text-blue-700 bg-blue-50" }
};

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const config = statusVariants[status] || { variant: "outline" as const, className: "" };
  
  return (
    <Badge variant={config.variant} className={config.className}>
      {status}
    </Badge>
  );
};
