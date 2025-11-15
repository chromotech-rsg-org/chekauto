import { Badge } from "@/components/ui/badge";

interface PaymentStatusBadgeProps {
  status: string;
}

const paymentStatusVariants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; className: string }> = {
  "Pendente": { variant: "outline", className: "border-yellow-500 text-yellow-700 bg-yellow-50" },
  "Recebido": { variant: "outline", className: "border-green-500 text-green-700 bg-green-50" },
  "Confirmado": { variant: "outline", className: "border-green-500 text-green-700 bg-green-50" },
  "Vencido": { variant: "destructive", className: "bg-red-100 text-red-700" },
  "Reembolsado": { variant: "outline", className: "border-purple-500 text-purple-700 bg-purple-50" },
  "Recebido em Dinheiro": { variant: "outline", className: "border-green-500 text-green-700 bg-green-50" },
  "Reembolso Solicitado": { variant: "outline", className: "border-orange-500 text-orange-700 bg-orange-50" },
  "Pago": { variant: "outline", className: "border-green-500 text-green-700 bg-green-50" },
  "Parcialmente Pago": { variant: "outline", className: "border-blue-500 text-blue-700 bg-blue-50" },
  "Cancelado": { variant: "destructive", className: "bg-red-100 text-red-700" }
};

export const PaymentStatusBadge = ({ status }: PaymentStatusBadgeProps) => {
  const config = paymentStatusVariants[status] || { variant: "outline" as const, className: "" };
  
  return (
    <Badge variant={config.variant} className={config.className}>
      {status}
    </Badge>
  );
};
