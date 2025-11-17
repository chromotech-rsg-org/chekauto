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
  const data = apiResponse?.data || apiResponse;

  return {
    identificacao: {
      placa: extrairValor(data, 'placa', 'Placa'),
      chassi: extrairValor(data, 'chassi', 'Chassi'),
      renavam: extrairValor(data, 'renavam', 'Renavam'),
      uf: extrairValor(data, 'uf', 'UF', 'uf_placa'),
    },
    
    especificacoes: {
      modelo: extrairValor(data, 'modelo', 'Modelo'),
      marca: extrairValor(data, 'marca', 'Marca'),
      anoFabricacao: extrairValor(data, 'ano_fabricacao', 'AnoFabricacao', 'ano_fab'),
      anoModelo: extrairValor(data, 'ano_modelo', 'AnoModelo', 'ano'),
      cor: extrairValor(data, 'cor', 'Cor'),
      tipo: extrairValor(data, 'tipo', 'Tipo', 'tipo_veiculo'),
      especie: extrairValor(data, 'especie', 'Especie'),
      categoria: extrairValor(data, 'categoria', 'Categoria'),
    },
    
    motorizacao: {
      combustivel: extrairValor(data, 'combustivel', 'Combustivel', 'tipo_combustivel'),
      potencia: extrairValor(data, 'potencia', 'Potencia'),
      cilindradas: extrairValor(data, 'cilindradas', 'Cilindradas'),
      capacidadePassageiros: extrairValor(data, 'capacidade_passageiros', 'CapacidadePassageiros', 'lotacao'),
      capacidadeCarga: extrairValor(data, 'capacidade_carga', 'CapacidadeCarga', 'pbt'),
    },
    
    registro: {
      situacao: extrairValor(data, 'situacao', 'Situacao', 'situacao_veiculo'),
      dataEmissaoCRV: extrairValor(data, 'data_emissao_crv', 'DataEmissaoCRV'),
      municipio: extrairValor(data, 'municipio', 'Municipio'),
      uf: extrairValor(data, 'uf', 'UF'),
    },
    
    informacoes: {
      restricoes: extrairRestricoes(data),
      observacoes: extrairObservacoes(data),
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
