import { toast } from "sonner";

export interface CepData {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

export async function buscarCep(cep: string): Promise<CepData | null> {
  const cepLimpo = cep.replace(/\D/g, '');
  
  if (cepLimpo.length !== 8) {
    toast.error("CEP inválido");
    return null;
  }

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
    const data = await response.json();

    if (data.erro) {
      toast.error("CEP não encontrado");
      return null;
    }

    return data;
  } catch (error) {
    toast.error("Erro ao buscar CEP");
    console.error("Erro ao buscar CEP:", error);
    return null;
  }
}
