/**
 * ChekAuto Brand Constants
 * All brand colors, typography, and configuration values
 */

// Brand Colors (HSL format for Tailwind)
export const COLORS = {
  // Primary Brand Colors
  yellow: 'hsl(45, 89%, 53%)', // #F0BA1D
  black: 'hsl(0, 0%, 0%)', // #000000
  white: 'hsl(0, 0%, 100%)', // #FFFFFF
  
  // Secondary Colors
  grayLight: 'hsl(0, 0%, 93%)', // #EEEEEE
  grayText: 'hsl(0, 0%, 65%)', // #A6A6A6
  orange: 'hsl(28, 95%, 69%)', // #FAA954
  
  // Functional Colors
  success: 'hsl(120, 60%, 50%)',
  error: 'hsl(0, 84%, 60%)',
  warning: 'hsl(45, 100%, 50%)',
} as const;

// Typography
export const TYPOGRAPHY = {
  fontFamily: {
    primary: '"Sora", sans-serif',
  },
  fontSize: {
    // Headings
    h1: '32px',
    h2: '24px',
    h3: '20px',
    h4: '18px',
    
    // Body
    body: '16px',
    bodySmall: '14px',
    bodyXSmall: '12px',
    
    // Special
    caption: '15px',
  },
  fontWeight: {
    thin: 100,
    light: 200,
    regular: 300,
    normal: 400,
    medium: 500,
    semiBold: 600,
    bold: 700,
    extraBold: 800,
    black: 900,
  },
} as const;

// Spacing
export const SPACING = {
  section: {
    mobile: '60px',
    tablet: '100px',
    desktop: '150px',
  },
  component: {
    small: '20px',
    medium: '40px',
    large: '60px',
  },
} as const;

// Border Radius
export const BORDER_RADIUS = {
  small: '8px',
  medium: '15px',
  large: '25px',
  button: '39px',
  circle: '50%',
} as const;

// Breakpoints (matching Tailwind defaults)
export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1400px',
} as const;

// File Upload Limits
export const FILE_LIMITS = {
  notaFiscal: {
    maxSize: 2 * 1024 * 1024, // 2MB in bytes
    allowedTypes: ['image/png', 'image/jpeg', 'application/pdf'],
    allowedExtensions: ['.png', '.jpg', '.jpeg', '.pdf'],
  },
  productImage: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/png', 'image/jpeg', 'image/webp'],
    allowedExtensions: ['.png', '.jpg', '.jpeg', '.webp'],
  },
} as const;

// Estados Brasileiros
export const ESTADOS_BRASILEIROS = [
  { value: 'AC', label: 'Acre' },
  { value: 'AL', label: 'Alagoas' },
  { value: 'AP', label: 'Amapá' },
  { value: 'AM', label: 'Amazonas' },
  { value: 'BA', label: 'Bahia' },
  { value: 'CE', label: 'Ceará' },
  { value: 'DF', label: 'Distrito Federal' },
  { value: 'ES', label: 'Espírito Santo' },
  { value: 'GO', label: 'Goiás' },
  { value: 'MA', label: 'Maranhão' },
  { value: 'MT', label: 'Mato Grosso' },
  { value: 'MS', label: 'Mato Grosso do Sul' },
  { value: 'MG', label: 'Minas Gerais' },
  { value: 'PA', label: 'Pará' },
  { value: 'PB', label: 'Paraíba' },
  { value: 'PR', label: 'Paraná' },
  { value: 'PE', label: 'Pernambuco' },
  { value: 'PI', label: 'Piauí' },
  { value: 'RJ', label: 'Rio de Janeiro' },
  { value: 'RN', label: 'Rio Grande do Norte' },
  { value: 'RS', label: 'Rio Grande do Sul' },
  { value: 'RO', label: 'Rondônia' },
  { value: 'RR', label: 'Roraima' },
  { value: 'SC', label: 'Santa Catarina' },
  { value: 'SP', label: 'São Paulo' },
  { value: 'SE', label: 'Sergipe' },
  { value: 'TO', label: 'Tocantins' },
] as const;

// Status Types
export const STATUS_PAGAMENTO = {
  PENDENTE: 'pendente',
  APROVADO: 'aprovado',
  RECUSADO: 'recusado',
} as const;

export const STATUS_PROCESSAMENTO = {
  PENDENTE: 'pendente',
  PROCESSANDO: 'processando',
  CONCLUIDO: 'concluido',
  CANCELADO: 'cancelado',
} as const;

// Payment Methods
export const METODOS_PAGAMENTO = {
  CARTAO_CREDITO: 'cartao_credito',
  PIX: 'pix',
} as const;

// Product Categories
export const CATEGORIAS_PRODUTOS = [
  'Carrocerias',
  'Tanques',
  'Guindastes / Plataformas',
  'Basculantes e Especiais',
  'Mecanismos Operacionais',
] as const;

// API Endpoints (placeholders para futuro)
export const API_ENDPOINTS = {
  viaCep: 'https://viacep.com.br/ws',
  // Adicionar endpoints de RENAVAM, BIN, ECAT, etc quando disponíveis
} as const;
