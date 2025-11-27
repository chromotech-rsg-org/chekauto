import { supabase } from '@/integrations/supabase/client';

export interface ClienteData {
  id?: string;
  nome: string;
  cpf_cnpj?: string;
  telefone?: string;
  email?: string;
  endereco?: any;
  status?: 'lead' | 'cliente_ativo';
}

/**
 * Cria ou atualiza um cliente usando upsert
 */
export const criarOuAtualizarCliente = async (
  dados: ClienteData
): Promise<{ id: string; isNew: boolean } | null> => {
  try {
    if (!dados.cpf_cnpj) {
      console.error('CPF/CNPJ é obrigatório');
      return null;
    }

    // Se tem ID, é uma atualização
    if (dados.id) {
      const updateData: any = {
        nome: dados.nome,
        telefone: dados.telefone,
        email: dados.email,
        endereco: dados.endereco,
        status: dados.status,
        ultima_interacao: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('clientes')
        .update(updateData)
        .eq('id', dados.id);

      if (error) {
        console.error('Erro ao atualizar cliente:', error);
        throw new Error(error.message || 'Erro ao atualizar cliente');
      }

      return { id: dados.id, isNew: false };
    }

    // Se não tem ID, buscar se já existe pelo CPF/CNPJ
    const { data: clienteExistente } = await supabase
      .from('clientes')
      .select('id')
      .eq('cpf_cnpj', dados.cpf_cnpj)
      .maybeSingle();

    if (clienteExistente) {
      // Cliente existe - atualizar
      const updateData: any = {
        nome: dados.nome,
        telefone: dados.telefone,
        email: dados.email,
        endereco: dados.endereco,
        ultima_interacao: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('clientes')
        .update(updateData)
        .eq('id', clienteExistente.id);

      if (error) {
        console.error('Erro ao atualizar cliente:', error);
        throw new Error(error.message || 'Erro ao atualizar cliente');
      }

      return { id: clienteExistente.id, isNew: false };
    }

    // Cliente não existe - criar novo
    const insertData: any = {
      nome: dados.nome,
      cpf_cnpj: dados.cpf_cnpj,
      telefone: dados.telefone,
      email: dados.email,
      endereco: dados.endereco,
      status: dados.status || 'lead',
      ultima_interacao: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('clientes')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar cliente:', error);
      throw new Error(error.message || 'Erro ao criar cliente');
    }

    return { id: data.id, isNew: true };
  } catch (error: any) {
    console.error('Erro ao criar ou atualizar cliente:', error);
    throw error;
  }
};

/**
 * Busca cliente por CPF/CNPJ
 */
export const buscarClientePorCpf = async (
  cpfCnpj: string
): Promise<any | null> => {
  try {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .eq('cpf_cnpj', cpfCnpj)
      .maybeSingle();

    if (error) {
      console.error('Erro ao buscar cliente:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Erro ao buscar cliente:', error);
    return null;
  }
};

/**
 * Associa cliente a uma consulta de veículo
 */
export const associarClienteConsulta = async (
  clienteId: string,
  consultaId: string
): Promise<boolean> => {
  try {
    // Verifica se já tem primeira_consulta_id
    const { data: cliente } = await supabase
      .from('clientes')
      .select('primeira_consulta_id')
      .eq('id', clienteId)
      .single();

    // Se não tem primeira consulta, define esta como a primeira
    if (cliente && !cliente.primeira_consulta_id) {
      const { error } = await supabase
        .from('clientes')
        .update({
          primeira_consulta_id: consultaId,
          ultima_interacao: new Date().toISOString(),
        })
        .eq('id', clienteId);

      if (error) {
        console.error('Erro ao associar consulta ao cliente:', error);
        return false;
      }
    } else {
      // Apenas atualiza última interação
      const { error } = await supabase
        .from('clientes')
        .update({
          ultima_interacao: new Date().toISOString(),
        })
        .eq('id', clienteId);

      if (error) {
        console.error('Erro ao atualizar interação:', error);
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error('Erro ao associar cliente à consulta:', error);
    return false;
  }
};

/**
 * Atualiza status do cliente
 */
export const atualizarStatusCliente = async (
  clienteId: string,
  novoStatus: 'lead' | 'cliente_ativo'
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('clientes')
      .update({
        status: novoStatus,
        ultima_interacao: new Date().toISOString(),
      })
      .eq('id', clienteId);

    if (error) {
      console.error('Erro ao atualizar status do cliente:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    return false;
  }
};

/**
 * Registra interação do cliente
 */
export const registrarInteracao = async (clienteId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('clientes')
      .update({
        ultima_interacao: new Date().toISOString(),
      })
      .eq('id', clienteId);

    if (error) {
      console.error('Erro ao registrar interação:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erro ao registrar interação:', error);
    return false;
  }
};
