export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      cat_mmv: {
        Row: {
          carroceria: string | null
          categoria: string | null
          codigo_mmv_original: string | null
          codigo_mmv_transformada: string | null
          criado_em: string | null
          eixos: string | null
          id: string
          marca: string | null
          mmv_original: string | null
          mmv_transformada: string | null
          modelo_original: string | null
          modelo_transformado: string | null
          numero_cat: string | null
          numero_cct: string | null
          origem: string | null
          tipo_transformacao: string | null
          vencimento: string | null
          wmi: string | null
        }
        Insert: {
          carroceria?: string | null
          categoria?: string | null
          codigo_mmv_original?: string | null
          codigo_mmv_transformada?: string | null
          criado_em?: string | null
          eixos?: string | null
          id?: string
          marca?: string | null
          mmv_original?: string | null
          mmv_transformada?: string | null
          modelo_original?: string | null
          modelo_transformado?: string | null
          numero_cat?: string | null
          numero_cct?: string | null
          origem?: string | null
          tipo_transformacao?: string | null
          vencimento?: string | null
          wmi?: string | null
        }
        Update: {
          carroceria?: string | null
          categoria?: string | null
          codigo_mmv_original?: string | null
          codigo_mmv_transformada?: string | null
          criado_em?: string | null
          eixos?: string | null
          id?: string
          marca?: string | null
          mmv_original?: string | null
          mmv_transformada?: string | null
          modelo_original?: string | null
          modelo_transformado?: string | null
          numero_cat?: string | null
          numero_cct?: string | null
          origem?: string | null
          tipo_transformacao?: string | null
          vencimento?: string | null
          wmi?: string | null
        }
        Relationships: []
      }
      categorias: {
        Row: {
          atualizado_em: string | null
          codigo: string | null
          criado_em: string | null
          descricao: string | null
          id: string
          nome: string
          produtos_count: number | null
        }
        Insert: {
          atualizado_em?: string | null
          codigo?: string | null
          criado_em?: string | null
          descricao?: string | null
          id?: string
          nome: string
          produtos_count?: number | null
        }
        Update: {
          atualizado_em?: string | null
          codigo?: string | null
          criado_em?: string | null
          descricao?: string | null
          id?: string
          nome?: string
          produtos_count?: number | null
        }
        Relationships: []
      }
      cliente_consultas: {
        Row: {
          cliente_id: string
          consulta_id: string
          criado_em: string
          id: string
        }
        Insert: {
          cliente_id: string
          consulta_id: string
          criado_em?: string
          id?: string
        }
        Update: {
          cliente_id?: string
          consulta_id?: string
          criado_em?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cliente_consultas_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cliente_consultas_consulta_id_fkey"
            columns: ["consulta_id"]
            isOneToOne: false
            referencedRelation: "consultas_veiculos"
            referencedColumns: ["id"]
          },
        ]
      }
      clientes: {
        Row: {
          atualizado_em: string | null
          cpf_cnpj: string
          criado_em: string | null
          email: string | null
          endereco: Json | null
          id: string
          nome: string
          primeira_consulta_id: string | null
          status: string | null
          telefone: string | null
          ultima_interacao: string | null
        }
        Insert: {
          atualizado_em?: string | null
          cpf_cnpj: string
          criado_em?: string | null
          email?: string | null
          endereco?: Json | null
          id?: string
          nome: string
          primeira_consulta_id?: string | null
          status?: string | null
          telefone?: string | null
          ultima_interacao?: string | null
        }
        Update: {
          atualizado_em?: string | null
          cpf_cnpj?: string
          criado_em?: string | null
          email?: string | null
          endereco?: Json | null
          id?: string
          nome?: string
          primeira_consulta_id?: string | null
          status?: string | null
          telefone?: string | null
          ultima_interacao?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clientes_primeira_consulta_id_fkey"
            columns: ["primeira_consulta_id"]
            isOneToOne: false
            referencedRelation: "consultas_veiculos"
            referencedColumns: ["id"]
          },
        ]
      }
      codigos_erro_api: {
        Row: {
          cobranca: boolean
          codigo: number
          criado_em: string | null
          descricao: string
          id: string
        }
        Insert: {
          cobranca?: boolean
          codigo: number
          criado_em?: string | null
          descricao: string
          id?: string
        }
        Update: {
          cobranca?: boolean
          codigo?: number
          criado_em?: string | null
          descricao?: string
          id?: string
        }
        Relationships: []
      }
      configuracoes_sistema: {
        Row: {
          atualizado_em: string | null
          chave: string
          criado_em: string | null
          descricao: string | null
          id: string
          valor: string
        }
        Insert: {
          atualizado_em?: string | null
          chave: string
          criado_em?: string | null
          descricao?: string | null
          id?: string
          valor: string
        }
        Update: {
          atualizado_em?: string | null
          chave?: string
          criado_em?: string | null
          descricao?: string | null
          id?: string
          valor?: string
        }
        Relationships: []
      }
      consultas_veiculos: {
        Row: {
          ano_modelo: string | null
          atualizado_em: string | null
          chassi: string | null
          criado_em: string | null
          dados_completos: Json
          id: string
          marca: string | null
          modelo: string | null
          placa: string | null
          renavam: string | null
          tipo_consulta: string
          valor_consultado: string
        }
        Insert: {
          ano_modelo?: string | null
          atualizado_em?: string | null
          chassi?: string | null
          criado_em?: string | null
          dados_completos: Json
          id?: string
          marca?: string | null
          modelo?: string | null
          placa?: string | null
          renavam?: string | null
          tipo_consulta: string
          valor_consultado: string
        }
        Update: {
          ano_modelo?: string | null
          atualizado_em?: string | null
          chassi?: string | null
          criado_em?: string | null
          dados_completos?: Json
          id?: string
          marca?: string | null
          modelo?: string | null
          placa?: string | null
          renavam?: string | null
          tipo_consulta?: string
          valor_consultado?: string
        }
        Relationships: []
      }
      historico_splits: {
        Row: {
          criado_em: string | null
          id: string
          pagamento_id: string | null
          parceiro_id: string | null
          produto_id: string | null
          status: string | null
          valor: number
        }
        Insert: {
          criado_em?: string | null
          id?: string
          pagamento_id?: string | null
          parceiro_id?: string | null
          produto_id?: string | null
          status?: string | null
          valor: number
        }
        Update: {
          criado_em?: string | null
          id?: string
          pagamento_id?: string | null
          parceiro_id?: string | null
          produto_id?: string | null
          status?: string | null
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "historico_splits_pagamento_id_fkey"
            columns: ["pagamento_id"]
            isOneToOne: false
            referencedRelation: "pagamentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "historico_splits_parceiro_id_fkey"
            columns: ["parceiro_id"]
            isOneToOne: false
            referencedRelation: "parceiros"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "historico_splits_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
        ]
      }
      logs_consultas_infosimples: {
        Row: {
          ano_fabricacao: string | null
          ano_modelo: string | null
          api_conectou: boolean | null
          categoria: string | null
          chassi: string | null
          codigo_resposta: number | null
          combustivel: string | null
          cor: string | null
          criado_em: string | null
          endpoint: string | null
          erro: string | null
          erro_tipo: string | null
          id: string
          marca: string | null
          modelo: string | null
          parametros: Json
          placa: string | null
          renavam: string | null
          resposta: Json
          sucesso: boolean
          tempo_resposta: number | null
          tipo: string | null
          tipo_consulta: string
        }
        Insert: {
          ano_fabricacao?: string | null
          ano_modelo?: string | null
          api_conectou?: boolean | null
          categoria?: string | null
          chassi?: string | null
          codigo_resposta?: number | null
          combustivel?: string | null
          cor?: string | null
          criado_em?: string | null
          endpoint?: string | null
          erro?: string | null
          erro_tipo?: string | null
          id?: string
          marca?: string | null
          modelo?: string | null
          parametros: Json
          placa?: string | null
          renavam?: string | null
          resposta: Json
          sucesso: boolean
          tempo_resposta?: number | null
          tipo?: string | null
          tipo_consulta: string
        }
        Update: {
          ano_fabricacao?: string | null
          ano_modelo?: string | null
          api_conectou?: boolean | null
          categoria?: string | null
          chassi?: string | null
          codigo_resposta?: number | null
          combustivel?: string | null
          cor?: string | null
          criado_em?: string | null
          endpoint?: string | null
          erro?: string | null
          erro_tipo?: string | null
          id?: string
          marca?: string | null
          modelo?: string | null
          parametros?: Json
          placa?: string | null
          renavam?: string | null
          resposta?: Json
          sucesso?: boolean
          tempo_resposta?: number | null
          tipo?: string | null
          tipo_consulta?: string
        }
        Relationships: []
      }
      pagamentos: {
        Row: {
          asaas_payment_id: string
          atualizado_em: string | null
          criado_em: string | null
          dados_cliente: Json | null
          dados_produto: Json | null
          dados_veiculo: Json | null
          id: string
          invoice_url: string | null
          metodo_pagamento: string
          qr_code_copy_paste: string | null
          qr_code_pix: string | null
          status: string
          user_id: string | null
          valor: number
        }
        Insert: {
          asaas_payment_id: string
          atualizado_em?: string | null
          criado_em?: string | null
          dados_cliente?: Json | null
          dados_produto?: Json | null
          dados_veiculo?: Json | null
          id?: string
          invoice_url?: string | null
          metodo_pagamento: string
          qr_code_copy_paste?: string | null
          qr_code_pix?: string | null
          status?: string
          user_id?: string | null
          valor: number
        }
        Update: {
          asaas_payment_id?: string
          atualizado_em?: string | null
          criado_em?: string | null
          dados_cliente?: Json | null
          dados_produto?: Json | null
          dados_veiculo?: Json | null
          id?: string
          invoice_url?: string | null
          metodo_pagamento?: string
          qr_code_copy_paste?: string | null
          qr_code_pix?: string | null
          status?: string
          user_id?: string | null
          valor?: number
        }
        Relationships: []
      }
      parceiros: {
        Row: {
          ativo: boolean | null
          atualizado_em: string | null
          cpf_cnpj: string
          criado_em: string | null
          email: string | null
          id: string
          nome: string
          percentual_split: number | null
          telefone: string | null
        }
        Insert: {
          ativo?: boolean | null
          atualizado_em?: string | null
          cpf_cnpj: string
          criado_em?: string | null
          email?: string | null
          id?: string
          nome: string
          percentual_split?: number | null
          telefone?: string | null
        }
        Update: {
          ativo?: boolean | null
          atualizado_em?: string | null
          cpf_cnpj?: string
          criado_em?: string | null
          email?: string | null
          id?: string
          nome?: string
          percentual_split?: number | null
          telefone?: string | null
        }
        Relationships: []
      }
      perfis_permissoes: {
        Row: {
          atualizado_em: string | null
          criado_em: string | null
          id: string
          is_desenvolvedor: boolean | null
          nome: string
          permissoes: Json
        }
        Insert: {
          atualizado_em?: string | null
          criado_em?: string | null
          id?: string
          is_desenvolvedor?: boolean | null
          nome: string
          permissoes?: Json
        }
        Update: {
          atualizado_em?: string | null
          criado_em?: string | null
          id?: string
          is_desenvolvedor?: boolean | null
          nome?: string
          permissoes?: Json
        }
        Relationships: []
      }
      produto_aplicacoes: {
        Row: {
          atualizado_em: string | null
          criado_em: string | null
          descricao: string
          id: string
          ordem: number | null
          produto_id: string
          titulo: string
        }
        Insert: {
          atualizado_em?: string | null
          criado_em?: string | null
          descricao: string
          id?: string
          ordem?: number | null
          produto_id: string
          titulo: string
        }
        Update: {
          atualizado_em?: string | null
          criado_em?: string | null
          descricao?: string
          id?: string
          ordem?: number | null
          produto_id?: string
          titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: "produto_aplicacoes_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
        ]
      }
      produto_caracteristicas: {
        Row: {
          atualizado_em: string | null
          criado_em: string | null
          descricao: string
          id: string
          ordem: number | null
          produto_id: string
          titulo: string
        }
        Insert: {
          atualizado_em?: string | null
          criado_em?: string | null
          descricao: string
          id?: string
          ordem?: number | null
          produto_id: string
          titulo: string
        }
        Update: {
          atualizado_em?: string | null
          criado_em?: string | null
          descricao?: string
          id?: string
          ordem?: number | null
          produto_id?: string
          titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: "produto_caracteristicas_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
        ]
      }
      produto_faq: {
        Row: {
          atualizado_em: string | null
          criado_em: string | null
          id: string
          ordem: number | null
          pergunta: string
          produto_id: string
          resposta: string
        }
        Insert: {
          atualizado_em?: string | null
          criado_em?: string | null
          id?: string
          ordem?: number | null
          pergunta: string
          produto_id: string
          resposta: string
        }
        Update: {
          atualizado_em?: string | null
          criado_em?: string | null
          id?: string
          ordem?: number | null
          pergunta?: string
          produto_id?: string
          resposta?: string
        }
        Relationships: [
          {
            foreignKeyName: "produto_faq_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
        ]
      }
      produto_galeria: {
        Row: {
          criado_em: string | null
          foto_url: string
          id: string
          ordem: number | null
          produto_id: string
        }
        Insert: {
          criado_em?: string | null
          foto_url: string
          id?: string
          ordem?: number | null
          produto_id: string
        }
        Update: {
          criado_em?: string | null
          foto_url?: string
          id?: string
          ordem?: number | null
          produto_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "produto_galeria_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
        ]
      }
      produto_tipos: {
        Row: {
          criado_em: string | null
          id: string
          produto_id: string
          tipo_id: string
        }
        Insert: {
          criado_em?: string | null
          id?: string
          produto_id: string
          tipo_id: string
        }
        Update: {
          criado_em?: string | null
          id?: string
          produto_id?: string
          tipo_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "produto_tipos_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "produto_tipos_tipo_id_fkey"
            columns: ["tipo_id"]
            isOneToOne: false
            referencedRelation: "categorias"
            referencedColumns: ["id"]
          },
        ]
      }
      produtos: {
        Row: {
          apelido: string | null
          ativo: boolean | null
          atualizado_em: string | null
          categoria_id: string | null
          criado_em: string | null
          descricao: string | null
          foto_url: string | null
          id: string
          nome: string
          preco: number
        }
        Insert: {
          apelido?: string | null
          ativo?: boolean | null
          atualizado_em?: string | null
          categoria_id?: string | null
          criado_em?: string | null
          descricao?: string | null
          foto_url?: string | null
          id?: string
          nome: string
          preco: number
        }
        Update: {
          apelido?: string | null
          ativo?: boolean | null
          atualizado_em?: string | null
          categoria_id?: string | null
          criado_em?: string | null
          descricao?: string | null
          foto_url?: string | null
          id?: string
          nome?: string
          preco?: number
        }
        Relationships: [
          {
            foreignKeyName: "produtos_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categorias"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          updated_at: string
          username: string
        }
        Insert: {
          created_at?: string
          id: string
          updated_at?: string
          username: string
        }
        Update: {
          created_at?: string
          id?: string
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
      sistemas: {
        Row: {
          atualizado_em: string
          criado_em: string
          id: string
          nome: string
          senha: string | null
          url_edicao: string | null
          url_publicada: string | null
          usuario: string | null
        }
        Insert: {
          atualizado_em?: string
          criado_em?: string
          id?: string
          nome: string
          senha?: string | null
          url_edicao?: string | null
          url_publicada?: string | null
          usuario?: string | null
        }
        Update: {
          atualizado_em?: string
          criado_em?: string
          id?: string
          nome?: string
          senha?: string | null
          url_edicao?: string | null
          url_publicada?: string | null
          usuario?: string | null
        }
        Relationships: []
      }
      solicitacoes: {
        Row: {
          atualizado_em: string | null
          cliente_id: string | null
          consulta_veiculo_id: string | null
          criado_em: string | null
          dados_exibidos_cliente: Json | null
          dados_veiculo: Json | null
          id: string
          origem_consulta: string | null
          pagamento_id: string | null
          produto_id: string | null
          status: string | null
        }
        Insert: {
          atualizado_em?: string | null
          cliente_id?: string | null
          consulta_veiculo_id?: string | null
          criado_em?: string | null
          dados_exibidos_cliente?: Json | null
          dados_veiculo?: Json | null
          id?: string
          origem_consulta?: string | null
          pagamento_id?: string | null
          produto_id?: string | null
          status?: string | null
        }
        Update: {
          atualizado_em?: string | null
          cliente_id?: string | null
          consulta_veiculo_id?: string | null
          criado_em?: string | null
          dados_exibidos_cliente?: Json | null
          dados_veiculo?: Json | null
          id?: string
          origem_consulta?: string | null
          pagamento_id?: string | null
          produto_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "solicitacoes_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solicitacoes_consulta_veiculo_id_fkey"
            columns: ["consulta_veiculo_id"]
            isOneToOne: false
            referencedRelation: "consultas_veiculos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solicitacoes_pagamento_id_fkey"
            columns: ["pagamento_id"]
            isOneToOne: false
            referencedRelation: "pagamentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solicitacoes_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
        ]
      }
      splits: {
        Row: {
          criado_em: string | null
          id: string
          parceiro_id: string
          percentual: number
          produto_id: string
        }
        Insert: {
          criado_em?: string | null
          id?: string
          parceiro_id: string
          percentual: number
          produto_id: string
        }
        Update: {
          criado_em?: string | null
          id?: string
          parceiro_id?: string
          percentual?: number
          produto_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "splits_parceiro_id_fkey"
            columns: ["parceiro_id"]
            isOneToOne: false
            referencedRelation: "parceiros"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "splits_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      usuarios: {
        Row: {
          ativo: boolean | null
          atualizado_em: string | null
          auth_user_id: string | null
          criado_em: string | null
          email: string
          foto_url: string | null
          id: string
          nome: string
          perfil_id: string | null
          tema: string | null
        }
        Insert: {
          ativo?: boolean | null
          atualizado_em?: string | null
          auth_user_id?: string | null
          criado_em?: string | null
          email: string
          foto_url?: string | null
          id?: string
          nome: string
          perfil_id?: string | null
          tema?: string | null
        }
        Update: {
          ativo?: boolean | null
          atualizado_em?: string | null
          auth_user_id?: string | null
          criado_em?: string | null
          email?: string
          foto_url?: string | null
          id?: string
          nome?: string
          perfil_id?: string | null
          tema?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "usuarios_perfil_id_fkey"
            columns: ["perfil_id"]
            isOneToOne: false
            referencedRelation: "perfis_permissoes"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
