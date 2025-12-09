import { Badge } from "@/components/ui/badge";

interface PaymentStatusBadgeProps {
  status: string;
}

// Mapeamento de status em inglês para português
const statusTranslation: Record<string, string> = {
  "PENDING": "Pendente",
  "RECEIVED": "Recebido",
  "CONFIRMED": "Confirmado",
  "OVERDUE": "Vencido",
  "REFUNDED": "Reembolsado",
  "RECEIVED_IN_CASH": "Recebido em Dinheiro",
  "REFUND_REQUESTED": "Reembolso Solicitado",
  "PARTIALLY_PAID": "Parcialmente Pago",
  "CANCELLED": "Cancelado",
};

const paymentStatusVariants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; className: string }> = {
  "Pendente": { variant: "outline", className: "border-yellow-500 text-yellow-700 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400" },
  "Recebido": { variant: "outline", className: "border-green-500 text-green-700 bg-green-50 dark:bg-green-900/20 dark:text-green-400" },
  "Confirmado": { variant: "outline", className: "border-green-500 text-green-700 bg-green-50 dark:bg-green-900/20 dark:text-green-400" },
  "Vencido": { variant: "destructive", className: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400" },
  "Reembolsado": { variant: "outline", className: "border-purple-500 text-purple-700 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-400" },
  "Recebido em Dinheiro": { variant: "outline", className: "border-green-500 text-green-700 bg-green-50 dark:bg-green-900/20 dark:text-green-400" },
  "Reembolso Solicitado": { variant: "outline", className: "border-orange-500 text-orange-700 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400" },
  "Pago": { variant: "outline", className: "border-green-500 text-green-700 bg-green-50 dark:bg-green-900/20 dark:text-green-400" },
  "Parcialmente Pago": { variant: "outline", className: "border-blue-500 text-blue-700 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400" },
  "Cancelado": { variant: "destructive", className: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400" }
};

export const PaymentStatusBadge = ({ status }: PaymentStatusBadgeProps) => {
  // Traduzir status em inglês para português
  const translatedStatus = statusTranslation[status] || status;
  const config = paymentStatusVariants[translatedStatus] || { variant: "outline" as const, className: "border-gray-500 text-gray-700 bg-gray-50" };
  
  return (
    <Badge variant={config.variant} className={config.className}>
      {translatedStatus}
    </Badge>
  );
};
