/**
 * Mapeia os dados da API InfoSimples para um formato amigável e estruturado
 */

export interface DadosVeiculoMapeados {
  // Identificação
  identificacao: {
    placa: string;
    chassi: string;
    renavam: string;
    uf: string;
  };
  
  // Especificações
  especificacoes: {
    modelo: string;
    marca: string;
    anoFabricacao: string;
    anoModelo: string;
    cor: string;
    tipo: string;
    especie: string;
    categoria: string;
  };
  
  // Motorização
  motorizacao: {
    combustivel: string;
    potencia: string;
    cilindradas: string;
    capacidadePassageiros: string;
    capacidadeCarga: string;
  };
  
  // Registro
  registro: {
    situacao: string;
    dataEmissaoCRV: string;
    municipio: string;
    uf: string;
  };
  
  // Informações adicionais
  informacoes: {
    restricoes: string[];
    observacoes: string[];
  };
  
  // Dados completos originais
  dadosOriginais?: any;
}

/**
 * Extrai valor de um objeto por múltiplos caminhos possíveis
 */
const extrairValor = (obj: any, ...caminhos: string[]): string => {
  for (const caminho of caminhos) {
    const valor = caminho.split('.').reduce((acc, part) => acc?.[part], obj);
    if (valor !== undefined && valor !== null && valor !== '') {
      return String(valor);
    }
  }
  return 'N/A';
};

/**
 * Mapeia a resposta da API para o formato estruturado
 */
export const mapearDadosVeiculo = (apiResponse: any): DadosVeiculoMapeados => {
  // A API base-sp retorna estrutura: { code: 200, data: [{ crv: {...}, debitos: {...}, veiculo: {...} }] }
  let data = apiResponse?.data || apiResponse;
  
  // Se data é um array, pegar o primeiro item
  if (Array.isArray(data) && data.length > 0) {
    data = data[0];
  }
  
  // Extrair subseções da resposta base-sp
  const veiculo = data?.veiculo || data?.Veiculo || {};
  const crv = data?.crv || data?.CRV || {};
  const debitos = data?.debitos || data?.Debitos || {};
  
  // Para compatibilidade, mesclar tudo em um único objeto
  const merged = { ...data, ...veiculo, ...crv, ...debitos };

  // Extrair e formatar o tipo (ex: "11 - SEMIRREBOQUE")
  let tipoFormatado = extrairValor(merged, 'tipo', 'Tipo', 'tipo_veiculo');
  const categoria = extrairValor(merged, 'categoria', 'Categoria');
  
  // Se temos código do tipo e categoria, formatar como "11 - SEMIRREBOQUE"
  if (tipoFormatado !== 'N/A' && categoria !== 'N/A' && !tipoFormatado.includes(' - ')) {
    tipoFormatado = `${tipoFormatado} - ${categoria}`;
  } else if (tipoFormatado === 'N/A' && categoria !== 'N/A') {
    tipoFormatado = categoria;
  }

  return {
    identificacao: {
      placa: extrairValor(merged, 'placa', 'Placa'),
      chassi: extrairValor(merged, 'chassi', 'Chassi'),
      renavam: extrairValor(merged, 'renavam', 'Renavam'),
      uf: extrairValor(merged, 'uf', 'UF', 'uf_placa'),
    },
    
    especificacoes: {
      modelo: extrairValor(merged, 'modelo', 'Modelo'),
      marca: extrairValor(merged, 'marca', 'Marca'),
      anoFabricacao: extrairValor(merged, 'ano_fabricacao', 'AnoFabricacao', 'ano_fab'),
      anoModelo: extrairValor(merged, 'ano_modelo', 'AnoModelo', 'ano'),
      cor: extrairValor(merged, 'cor', 'Cor'),
      tipo: tipoFormatado,
      especie: extrairValor(merged, 'especie', 'Especie'),
      categoria: categoria,
    },
    
    motorizacao: {
      combustivel: extrairValor(merged, 'combustivel', 'Combustivel', 'tipo_combustivel'),
      potencia: extrairValor(merged, 'potencia', 'Potencia'),
      cilindradas: extrairValor(merged, 'cilindradas', 'Cilindradas'),
      capacidadePassageiros: extrairValor(merged, 'capacidade_passageiros', 'CapacidadePassageiros', 'lotacao'),
      capacidadeCarga: extrairValor(merged, 'capacidade_carga', 'CapacidadeCarga', 'pbt'),
    },
    
    registro: {
      situacao: extrairValor(merged, 'situacao', 'Situacao', 'situacao_veiculo'),
      dataEmissaoCRV: extrairValor(merged, 'data_emissao_crv', 'DataEmissaoCRV', 'exercicio', 'licenciamento'),
      municipio: extrairValor(merged, 'municipio', 'Municipio'),
      uf: extrairValor(merged, 'uf', 'UF'),
    },
    
    informacoes: {
      restricoes: extrairRestricoes(merged),
      observacoes: extrairObservacoes(merged),
    },
    
    dadosOriginais: data,
  };
};

/**
 * Extrai restrições do veículo
 */
const extrairRestricoes = (data: any): string[] => {
  const restricoes: string[] = [];
  
  const campos = [
    'restricao_1', 'restricao_2', 'restricao_3', 'restricao_4',
    'Restricao1', 'Restricao2', 'Restricao3', 'Restricao4',
  ];
  
  campos.forEach(campo => {
    const valor = data[campo];
    if (valor && valor !== 'NADA CONSTA' && valor !== 'N/A') {
      restricoes.push(valor);
    }
  });
  
  return restricoes.length > 0 ? restricoes : ['Nenhuma restrição'];
};

/**
 * Extrai observações do veículo
 */
const extrairObservacoes = (data: any): string[] => {
  const observacoes: string[] = [];
  
  if (data.observacao) {
    observacoes.push(data.observacao);
  }
  
  if (data.Observacao) {
    observacoes.push(data.Observacao);
  }
  
  return observacoes;
};

/**
 * Formata dados para exibição resumida
 */
export const formatarDadosResumo = (dados: DadosVeiculoMapeados) => {
  return {
    titulo: `${dados.especificacoes.marca} ${dados.especificacoes.modelo}`,
    subtitulo: `${dados.especificacoes.anoFabricacao}/${dados.especificacoes.anoModelo}`,
    items: [
      { label: 'Placa', value: dados.identificacao.placa },
      { label: 'Chassi', value: dados.identificacao.chassi },
      { label: 'Renavam', value: dados.identificacao.renavam },
      { label: 'Cor', value: dados.especificacoes.cor },
      { label: 'Combustível', value: dados.motorizacao.combustivel },
    ],
  };
};
