// Sistema de Permissões Granulares
export type Permission = {
  dashboard: {
    view: boolean;
    viewStatsCard_solicitacoes: boolean;
    viewStatsCard_clientes: boolean;
    viewStatsCard_produtos: boolean;
    viewStatsCard_receita: boolean;
    viewChart_solicitacoesMes: boolean;
    viewChart_solicitacoesStatus: boolean;
    viewChart_pagamentoStatus: boolean;
    viewTable_ultimasSolicitacoes: boolean;
    viewTable_clientesRecentes: boolean;
  };
  usuarios: {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
  };
  perfis: {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
  };
  produtos: {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
  };
  categorias: {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
  };
  clientes: {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
  };
  solicitacoes: {
    view: boolean;
    edit: boolean;
  };
  split: {
    view: boolean;
    configure: boolean;
  };
  parceiros: {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
  };
  tabelaCatMmv: {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
    import: boolean;
  };
};

export const defaultPermissions: Permission = {
  dashboard: {
    view: false,
    viewStatsCard_solicitacoes: false,
    viewStatsCard_clientes: false,
    viewStatsCard_produtos: false,
    viewStatsCard_receita: false,
    viewChart_solicitacoesMes: false,
    viewChart_solicitacoesStatus: false,
    viewChart_pagamentoStatus: false,
    viewTable_ultimasSolicitacoes: false,
    viewTable_clientesRecentes: false,
  },
  usuarios: { view: false, create: false, edit: false, delete: false },
  perfis: { view: false, create: false, edit: false, delete: false },
  produtos: { view: false, create: false, edit: false, delete: false },
  categorias: { view: false, create: false, edit: false, delete: false },
  clientes: { view: false, create: false, edit: false, delete: false },
  solicitacoes: { view: false, edit: false },
  split: { view: false, configure: false },
  parceiros: { view: false, create: false, edit: false, delete: false },
  tabelaCatMmv: { view: false, create: false, edit: false, delete: false, import: false },
};

export const adminPermissions: Permission = {
  dashboard: {
    view: true,
    viewStatsCard_solicitacoes: true,
    viewStatsCard_clientes: true,
    viewStatsCard_produtos: true,
    viewStatsCard_receita: true,
    viewChart_solicitacoesMes: true,
    viewChart_solicitacoesStatus: true,
    viewChart_pagamentoStatus: true,
    viewTable_ultimasSolicitacoes: true,
    viewTable_clientesRecentes: true,
  },
  usuarios: { view: true, create: true, edit: true, delete: true },
  perfis: { view: true, create: true, edit: true, delete: true },
  produtos: { view: true, create: true, edit: true, delete: true },
  categorias: { view: true, create: true, edit: true, delete: true },
  clientes: { view: true, create: true, edit: true, delete: true },
  solicitacoes: { view: true, edit: true },
  split: { view: true, configure: true },
  parceiros: { view: true, create: true, edit: true, delete: true },
  tabelaCatMmv: { view: true, create: true, edit: true, delete: true, import: true },
};

export function hasPermission(
  permissions: Permission | undefined,
  module: keyof Permission,
  action: string
): boolean {
  if (!permissions) return false;
  const modulePermissions = permissions[module] as any;
  return modulePermissions?.[action] === true;
}
