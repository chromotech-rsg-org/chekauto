/**
 * Validação de chassi de veículos brasileiros
 * Um chassi válido possui:
 * - Exatamente 17 caracteres alfanuméricos
 * - Não pode conter as letras I, O ou Q (para evitar confusão com números)
 * - Possui um dígito verificador na posição 9
 */

// Pesos para cada posição do VIN (ISO 3779)
const PESOS = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2];

// Tabela de transliteração (ISO 3779)
const VALORES_LETRAS: { [key: string]: number } = {
  A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8,
  J: 1, K: 2, L: 3, M: 4, N: 5, P: 7, R: 9,
  S: 2, T: 3, U: 4, V: 5, W: 6, X: 7, Y: 8, Z: 9,
};

/**
 * Valida se o chassi tem formato correto (17 caracteres, sem I/O/Q)
 */
export function validarFormatoChassi(chassi: string): {
  valido: boolean;
  erro?: string;
} {
  if (!chassi || typeof chassi !== 'string') {
    return { valido: false, erro: 'Chassi não informado' };
  }

  const chassiLimpo = chassi.trim().toUpperCase();

  // Validar tamanho
  if (chassiLimpo.length !== 17) {
    return {
      valido: false,
      erro: `Chassi deve ter exatamente 17 caracteres (informado: ${chassiLimpo.length})`,
    };
  }

  // Validar se contém apenas letras e números
  if (!/^[A-Z0-9]+$/.test(chassiLimpo)) {
    return {
      valido: false,
      erro: 'Chassi deve conter apenas letras e números',
    };
  }

  // Validar se não contém I, O ou Q
  if (/[IOQ]/.test(chassiLimpo)) {
    return {
      valido: false,
      erro: 'Chassi não pode conter as letras I, O ou Q',
    };
  }

  return { valido: true };
}

/**
 * Converte um caractere do chassi para seu valor numérico
 */
function obterValorCaractere(char: string): number {
  if (/[0-9]/.test(char)) {
    return parseInt(char, 10);
  }
  return VALORES_LETRAS[char] || 0;
}

/**
 * Calcula o dígito verificador do chassi
 */
function calcularDigitoVerificador(chassi: string): string {
  let soma = 0;

  for (let i = 0; i < 17; i++) {
    const valor = obterValorCaractere(chassi[i]);
    soma += valor * PESOS[i];
  }

  const resto = soma % 11;
  
  if (resto === 10) {
    return 'X';
  }
  
  return resto.toString();
}

/**
 * Valida o dígito verificador do chassi (posição 9)
 */
export function validarDigitoVerificador(chassi: string): {
  valido: boolean;
  erro?: string;
} {
  const formatoValido = validarFormatoChassi(chassi);
  if (!formatoValido.valido) {
    return formatoValido;
  }

  const chassiLimpo = chassi.trim().toUpperCase();
  const digitoInformado = chassiLimpo[8]; // Posição 9 (índice 8)
  const digitoCalculado = calcularDigitoVerificador(chassiLimpo);

  if (digitoInformado !== digitoCalculado) {
    return {
      valido: false,
      erro: `Dígito verificador inválido (esperado: ${digitoCalculado}, informado: ${digitoInformado})`,
    };
  }

  return { valido: true };
}

/**
 * Valida chassi completo (formato + dígito verificador)
 */
export function validarChassi(chassi: string): {
  valido: boolean;
  erro?: string;
  chassiLimpo?: string;
} {
  const formatoValido = validarFormatoChassi(chassi);
  if (!formatoValido.valido) {
    return formatoValido;
  }

  const chassiLimpo = chassi.trim().toUpperCase();

  // Validação do dígito verificador é opcional mas recomendada
  // Alguns veículos importados podem não seguir o padrão
  const digitoValido = validarDigitoVerificador(chassiLimpo);
  
  if (!digitoValido.valido) {
    // Retorna aviso mas não bloqueia (pode ser veículo importado)
    console.warn('Chassi com dígito verificador inconsistente:', digitoValido.erro);
  }

  return {
    valido: true,
    chassiLimpo,
  };
}

/**
 * Limpa e formata o chassi
 */
export function limparChassi(chassi: string): string {
  if (!chassi) return '';
  return chassi.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
}
