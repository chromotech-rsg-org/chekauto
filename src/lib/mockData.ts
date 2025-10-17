// Mock data for administrative system (no backend)

export const mockStats = {
  totalSolicitacoes: 127,
  clientesAtivos: 43,
  produtos: 18,
  receita: 2847500.00
};

export const mockPerfis = [
  { 
    id: 1, 
    nome: "Administrador", 
    permissoes: ["Dashboard", "Usuários (todos)", "Perfis (todos)", "Produtos (todos)", "Clientes (todos)", "Solicitações (todos)", "Split (todos)"] 
  },
  { 
    id: 2, 
    nome: "Operador", 
    permissoes: ["Dashboard", "Solicitações (visualizar, editar)", "Clientes (visualizar)"] 
  },
  { 
    id: 3, 
    nome: "Visualizador", 
    permissoes: ["Dashboard (apenas visualizar)"] 
  },
  { 
    id: 4, 
    nome: "Gerente Comercial", 
    permissoes: ["Dashboard", "Clientes (todos)", "Produtos (visualizar)", "Solicitações (visualizar)"] 
  }
];

export const mockUsuarios = [
  {
    id: 1,
    nome: "João Silva",
    email: "joao.silva@chekauto.com",
    celular: "(11) 98765-4321",
    rua: "Av. Paulista",
    numero: "1000",
    bairro: "Bela Vista",
    complemento: "Sala 101",
    cep: "01310-100",
    cidade: "São Paulo",
    estado: "SP",
    perfil: "Administrador",
    foto: null
  },
  {
    id: 2,
    nome: "Maria Santos",
    email: "maria.santos@chekauto.com",
    celular: "(11) 97654-3210",
    rua: "Rua Augusta",
    numero: "2500",
    bairro: "Consolação",
    complemento: "",
    cep: "01412-100",
    cidade: "São Paulo",
    estado: "SP",
    perfil: "Operador",
    foto: null
  },
  {
    id: 3,
    nome: "Carlos Oliveira",
    email: "carlos.oliveira@chekauto.com",
    celular: "(11) 96543-2109",
    rua: "Av. Faria Lima",
    numero: "3500",
    bairro: "Itaim Bibi",
    complemento: "Conj. 42",
    cep: "04538-132",
    cidade: "São Paulo",
    estado: "SP",
    perfil: "Gerente Comercial",
    foto: null
  },
  {
    id: 4,
    nome: "Ana Paula Costa",
    email: "ana.costa@chekauto.com",
    celular: "(11) 95432-1098",
    rua: "Rua Oscar Freire",
    numero: "1200",
    bairro: "Jardins",
    complemento: "",
    cep: "01426-001",
    cidade: "São Paulo",
    estado: "SP",
    perfil: "Visualizador",
    foto: null
  },
  {
    id: 5,
    nome: "Pedro Henrique Alves",
    email: "pedro.alves@chekauto.com",
    celular: "(11) 94321-0987",
    rua: "Av. Brigadeiro Faria Lima",
    numero: "2000",
    bairro: "Jardim Paulistano",
    complemento: "Torre A",
    cep: "01451-000",
    cidade: "São Paulo",
    estado: "SP",
    perfil: "Operador",
    foto: null
  }
];

export const mockProdutos = [
  {
    id: 1,
    nomeTecnico: "Tanque Combustível 15000L",
    nomeFantasia: "Tanque 15K Premium",
    codigo: "TCO-15000",
    foto: "/placeholder.svg",
    descricao: "Tanque para transporte de combustível com capacidade de 15.000 litros, fabricado em aço inoxidável de alta resistência. Ideal para transporte de diesel, gasolina e etanol.",
    preco: 45000.00,
    categoria: "Carroceria Sobre Chassis Tanque",
    caracteristicas: ["Aço inoxidável AISI 304", "Capacidade 15.000L", "3 compartimentos", "Sistema de válvulas automáticas", "Certificação INMETRO"]
  },
  {
    id: 2,
    nomeTecnico: "Tanque Combustível 30000L",
    nomeFantasia: "Tanque 30K Heavy Duty",
    codigo: "TCO-30000",
    foto: "/placeholder.svg",
    descricao: "Tanque de grande capacidade para transporte de combustível, com 30.000 litros. Estrutura reforçada para longas distâncias.",
    preco: 78000.00,
    categoria: "Carroceria Sobre Chassis Tanque",
    caracteristicas: ["Aço inoxidável AISI 316", "Capacidade 30.000L", "5 compartimentos", "Sistema anti-ondas", "Isolamento térmico"]
  },
  {
    id: 3,
    nomeTecnico: "Baú Refrigerado 8m",
    nomeFantasia: "Baú Frigo 8000",
    codigo: "BRF-8000",
    foto: "/placeholder.svg",
    descricao: "Baú refrigerado de 8 metros para transporte de cargas que necessitam controle de temperatura entre -25°C e +25°C.",
    preco: 52000.00,
    categoria: "Implemento Rodoviário",
    caracteristicas: ["8 metros de comprimento", "Isolamento em poliuretano", "Unidade refrigeradora Carrier", "Piso reforçado", "Portas traseiras com vedação"]
  },
  {
    id: 4,
    nomeTecnico: "Carroceria Graneleira 8m",
    nomeFantasia: "Graneleiro Pro 8000",
    codigo: "CGR-8000",
    foto: "/placeholder.svg",
    descricao: "Carroceria graneleira para transporte de grãos, rações e produtos agrícolas. Estrutura em aço carbono com sistema de descarga hidráulica.",
    preco: 38000.00,
    categoria: "Implemento Rodoviário",
    caracteristicas: ["8 metros de comprimento", "Aço carbono SAE 1020", "Sistema de descarga traseira", "Tampa superior", "Capacidade 20 toneladas"]
  },
  {
    id: 5,
    nomeTecnico: "Semirreboque Plataforma 13,5m",
    nomeFantasia: "Plataforma Max 13500",
    codigo: "SPL-13500",
    foto: "/placeholder.svg",
    descricao: "Semirreboque plataforma para transporte de cargas pesadas e equipamentos. Estrutura robusta com capacidade para até 30 toneladas.",
    preco: 65000.00,
    categoria: "Reboque/Semirreboque",
    caracteristicas: ["13,5 metros de comprimento", "Capacidade 30 toneladas", "Suspensão pneumática", "Rampas traseiras removíveis", "Sistema de amarração múltiplo"]
  },
  {
    id: 6,
    nomeTecnico: "Tanque Químico 12000L",
    nomeFantasia: "Tanque Químico 12K",
    codigo: "TQU-12000",
    foto: "/placeholder.svg",
    descricao: "Tanque especializado para transporte de produtos químicos perigosos, com revestimento interno resistente à corrosão.",
    preco: 58000.00,
    categoria: "Carroceria Sobre Chassis Tanque",
    caracteristicas: ["Aço inoxidável 316L", "Capacidade 12.000L", "Revestimento interno PTFE", "Sistema de segurança duplo", "Certificação ONU para produtos perigosos"]
  }
];

export const mockClientes = [
  {
    id: 1,
    nome: "Transportadora ABC Ltda",
    cpfCnpj: "12.345.678/0001-90",
    email: "contato@transportadoraabc.com.br",
    telefone: "(11) 3333-4444",
    cep: "01234-567",
    rua: "Av. Industrial",
    numero: "1500",
    bairro: "Distrito Industrial",
    complemento: "Galpão 3",
    cidade: "São Paulo",
    estado: "SP",
    associacao: "CENTRAL VAN SP",
    status: "Processado"
  },
  {
    id: 2,
    nome: "Logística Rápida S.A.",
    cpfCnpj: "23.456.789/0001-01",
    email: "contato@logisticarapida.com.br",
    telefone: "(11) 4444-5555",
    cep: "02345-678",
    rua: "Rua dos Transportes",
    numero: "800",
    bairro: "Vila Logística",
    complemento: "",
    cidade: "Guarulhos",
    estado: "SP",
    associacao: "SETCESP",
    status: "Concluído"
  },
  {
    id: 3,
    nome: "Frota Nacional Transportes",
    cpfCnpj: "34.567.890/0001-12",
    email: "fiscal@frotanacional.com.br",
    telefone: "(11) 5555-6666",
    cep: "03456-789",
    rua: "Rodovia Presidente Dutra",
    numero: "Km 215",
    bairro: "Centro",
    complemento: "Base Operacional",
    cidade: "São José dos Campos",
    estado: "SP",
    associacao: "NTC - Nacional",
    status: "Pendente"
  },
  {
    id: 4,
    nome: "João Pedro Silva - MEI",
    cpfCnpj: "123.456.789-00",
    email: "joaopedro.caminhoneiro@gmail.com",
    telefone: "(11) 96666-7777",
    cep: "04567-890",
    rua: "Rua das Flores",
    numero: "45",
    bairro: "Jardim América",
    complemento: "Casa",
    cidade: "Campinas",
    estado: "SP",
    associacao: "Autônomo",
    status: "Processado"
  },
  {
    id: 5,
    nome: "Expresso Sudeste Ltda",
    cpfCnpj: "45.678.901/0001-23",
    email: "atendimento@expressosudeste.com.br",
    telefone: "(21) 7777-8888",
    cep: "05678-901",
    rua: "Av. Brasil",
    numero: "5000",
    bairro: "Penha",
    complemento: "Galpão 1 e 2",
    cidade: "Rio de Janeiro",
    estado: "RJ",
    associacao: "CENTRAL VAN RJ",
    status: "Concluído"
  },
  {
    id: 6,
    nome: "Cargas Pesadas do Sul",
    cpfCnpj: "56.789.012/0001-34",
    email: "comercial@cargaspesadas.com.br",
    telefone: "(51) 8888-9999",
    cep: "06789-012",
    rua: "Rua Industrial Sul",
    numero: "2300",
    bairro: "Distrito Industrial",
    complemento: "",
    cidade: "Porto Alegre",
    estado: "RS",
    associacao: "SETCERGS",
    status: "Pendente"
  },
  {
    id: 7,
    nome: "Maria Cristina Transportes - MEI",
    cpfCnpj: "234.567.890-11",
    email: "mariacristina.transporte@outlook.com",
    telefone: "(11) 95555-4444",
    cep: "07890-123",
    rua: "Rua Sete de Setembro",
    numero: "120",
    bairro: "Centro",
    complemento: "",
    cidade: "Santos",
    estado: "SP",
    associacao: "Autônomo",
    status: "Concluído"
  }
];

export const mockSolicitacoes = [
  {
    id: 1001,
    data: "2025-10-15",
    cliente: "Transportadora ABC Ltda",
    clienteId: 1,
    produto: "Tanque 15K Premium",
    produtoId: 1,
    placa: "ABC-1234",
    chassis: "9BW1234567890ABCD",
    renavam: "12345678901",
    categoria: "Caminhão",
    tipoCarroceria: "Tanque",
    status: "Pendente",
    metodoPagamento: "Boleto",
    valor: 45000.00,
    observacoes: ""
  },
  {
    id: 1002,
    data: "2025-10-14",
    cliente: "Logística Rápida S.A.",
    clienteId: 2,
    produto: "Baú Frigo 8000",
    produtoId: 3,
    placa: "XYZ-5678",
    chassis: "9BW5678901234EFGH",
    renavam: "23456789012",
    categoria: "Caminhão",
    tipoCarroceria: "Baú Frigorífico",
    status: "Em Análise",
    metodoPagamento: "Cartão de Crédito",
    valor: 52000.00,
    observacoes: "Cliente solicitou instalação express"
  },
  {
    id: 1003,
    data: "2025-10-13",
    cliente: "João Pedro Silva - MEI",
    clienteId: 4,
    produto: "Graneleiro Pro 8000",
    produtoId: 4,
    placa: "DEF-9012",
    chassis: "9BW9012345678IJKL",
    renavam: "34567890123",
    categoria: "Caminhão",
    tipoCarroceria: "Graneleira",
    status: "Aprovado",
    metodoPagamento: "Pix",
    valor: 38000.00,
    observacoes: ""
  },
  {
    id: 1004,
    data: "2025-10-12",
    cliente: "Expresso Sudeste Ltda",
    clienteId: 5,
    produto: "Plataforma Max 13500",
    produtoId: 5,
    placa: "GHI-3456",
    chassis: "9BW3456789012MNOP",
    renavam: "45678901234",
    categoria: "Semirreboque",
    tipoCarroceria: "Plataforma",
    status: "Concluído",
    metodoPagamento: "Transferência",
    valor: 65000.00,
    observacoes: "Entregue em 10/10/2025"
  },
  {
    id: 1005,
    data: "2025-10-11",
    cliente: "Frota Nacional Transportes",
    clienteId: 3,
    produto: "Tanque 30K Heavy Duty",
    produtoId: 2,
    placa: "JKL-7890",
    chassis: "9BW7890123456QRST",
    renavam: "56789012345",
    categoria: "Caminhão",
    tipoCarroceria: "Tanque",
    status: "Pendente",
    metodoPagamento: "Boleto",
    valor: 78000.00,
    observacoes: "Aguardando documentação adicional"
  },
  {
    id: 1006,
    data: "2025-10-10",
    cliente: "Maria Cristina Transportes - MEI",
    clienteId: 7,
    produto: "Tanque Químico 12K",
    produtoId: 6,
    placa: "MNO-2345",
    chassis: "9BW2345678901UVWX",
    renavam: "67890123456",
    categoria: "Caminhão",
    tipoCarroceria: "Tanque Químico",
    status: "Em Análise",
    metodoPagamento: "Pix",
    valor: 58000.00,
    observacoes: ""
  },
  {
    id: 1007,
    data: "2025-10-09",
    cliente: "Transportadora ABC Ltda",
    clienteId: 1,
    produto: "Baú Frigo 8000",
    produtoId: 3,
    placa: "PQR-6789",
    chassis: "9BW6789012345YZAB",
    renavam: "78901234567",
    categoria: "Caminhão",
    tipoCarroceria: "Baú Frigorífico",
    status: "Concluído",
    metodoPagamento: "Cartão de Crédito",
    valor: 52000.00,
    observacoes: "Cliente satisfeito, solicitou novo orçamento"
  },
  {
    id: 1008,
    data: "2025-10-08",
    cliente: "Cargas Pesadas do Sul",
    clienteId: 6,
    produto: "Plataforma Max 13500",
    produtoId: 5,
    placa: "STU-0123",
    chassis: "9BW0123456789CDEF",
    renavam: "89012345678",
    categoria: "Semirreboque",
    tipoCarroceria: "Plataforma",
    status: "Aprovado",
    metodoPagamento: "Transferência",
    valor: 65000.00,
    observacoes: "Instalação prevista para próxima semana"
  },
  {
    id: 1009,
    data: "2025-10-07",
    cliente: "Logística Rápida S.A.",
    clienteId: 2,
    produto: "Graneleiro Pro 8000",
    produtoId: 4,
    placa: "VWX-4567",
    chassis: "9BW4567890123GHIJ",
    renavam: "90123456789",
    categoria: "Caminhão",
    tipoCarroceria: "Graneleira",
    status: "Cancelado",
    metodoPagamento: "Boleto",
    valor: 38000.00,
    observacoes: "Cliente desistiu da compra"
  },
  {
    id: 1010,
    data: "2025-10-06",
    cliente: "João Pedro Silva - MEI",
    clienteId: 4,
    produto: "Tanque 15K Premium",
    produtoId: 1,
    placa: "YZA-8901",
    chassis: "9BW8901234567KLMN",
    renavam: "01234567890",
    categoria: "Caminhão",
    tipoCarroceria: "Tanque",
    status: "Concluído",
    metodoPagamento: "Pix",
    valor: 45000.00,
    observacoes: "Instalação concluída com sucesso"
  }
];

export const mockSplits = [
  {
    id: 1,
    detalhes: "Split padrão para implementos rodoviários - carrocerias e tanques",
    percentuais: {
      chekauto: 70,
      cliente: 20,
      parceiros: [{ nome: "Despachante Express", valor: 10 }]
    },
    dataCriacao: "2025-09-01"
  },
  {
    id: 2,
    detalhes: "Split especial para reboques e semirreboques - inclui comissão de vendedor",
    percentuais: {
      chekauto: 60,
      cliente: 25,
      parceiros: [
        { nome: "Vendedor Regional", valor: 10 },
        { nome: "Despachante Santos", valor: 5 }
      ]
    },
    dataCriacao: "2025-09-15"
  },
  {
    id: 3,
    detalhes: "Split para produtos químicos - inclui certificação e despachante especializado",
    percentuais: {
      chekauto: 65,
      cliente: 15,
      parceiros: [
        { nome: "Certificadora INMETRO", valor: 12 },
        { nome: "Despachante Químicos", valor: 8 }
      ]
    },
    dataCriacao: "2025-10-01"
  },
  {
    id: 4,
    detalhes: "Split básico MEI - simplificado para microempreendedores individuais",
    percentuais: {
      chekauto: 75,
      cliente: 20,
      parceiros: [{ nome: "Despachante Local", valor: 5 }]
    },
    dataCriacao: "2025-10-05"
  }
];

export const mockChartData = {
  solicitacoesPorMes: [
    { mes: "Mai", total: 8 },
    { mes: "Jun", total: 12 },
    { mes: "Jul", total: 15 },
    { mes: "Ago", total: 18 },
    { mes: "Set", total: 22 },
    { mes: "Out", total: 10 }
  ],
  solicitacoesPorStatus: [
    { status: "Pendente", total: 3, fill: "#F0BA1D" },
    { status: "Em Análise", total: 2, fill: "#3B82F6" },
    { status: "Aprovado", total: 2, fill: "#10B981" },
    { status: "Concluído", total: 3, fill: "#6B7280" }
  ]
};
