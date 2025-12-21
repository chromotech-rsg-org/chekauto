import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertCircle, CheckCircle2, Clock, MinusCircle } from "lucide-react";

interface SplitStatusBadgeProps {
  status: string | null;
  erro?: string | null;
}

const splitStatusConfig: Record<string, { 
  label: string; 
  variant: "default" | "secondary" | "destructive" | "outline"; 
  className: string;
  icon: React.ReactNode;
}> = {
  "configurado": { 
    label: "Configurado", 
    variant: "outline", 
    className: "border-green-500 text-green-700 bg-green-50 dark:bg-green-900/20 dark:text-green-400",
    icon: <CheckCircle2 className="h-3 w-3 mr-1" />
  },
  "pendente": { 
    label: "Pendente", 
    variant: "outline", 
    className: "border-yellow-500 text-yellow-700 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400",
    icon: <Clock className="h-3 w-3 mr-1" />
  },
  "erro": { 
    label: "Erro", 
    variant: "destructive", 
    className: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400",
    icon: <AlertCircle className="h-3 w-3 mr-1" />
  },
  "nao_aplicavel": { 
    label: "N/A", 
    variant: "outline", 
    className: "border-gray-400 text-gray-500 bg-gray-50 dark:bg-gray-800/20 dark:text-gray-400",
    icon: <MinusCircle className="h-3 w-3 mr-1" />
  },
};

export const SplitStatusBadge = ({ status, erro }: SplitStatusBadgeProps) => {
  const statusKey = status || "nao_aplicavel";
  const config = splitStatusConfig[statusKey] || splitStatusConfig["nao_aplicavel"];
  
  const badge = (
    <Badge variant={config.variant} className={`${config.className} flex items-center`}>
      {config.icon}
      {config.label}
    </Badge>
  );
  
  // Se houver erro, mostrar tooltip com a mensagem
  if (status === "erro" && erro) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {badge}
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <p className="text-sm">{erro}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  return badge;
};
