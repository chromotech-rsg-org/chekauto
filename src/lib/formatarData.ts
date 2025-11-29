/**
 * Formata uma data para exibição considerando se foi hoje, ontem ou em outra data
 */
export function formatarDataAtualizacao(dataString: string): string {
  const data = new Date(dataString);
  const hoje = new Date();
  
  // Zera as horas para comparação apenas de datas
  const dataComparar = new Date(data.getFullYear(), data.getMonth(), data.getDate());
  const hojeComparar = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
  
  const diffDias = Math.floor((hojeComparar.getTime() - dataComparar.getTime()) / (1000 * 60 * 60 * 24));
  
  const hora = data.toLocaleTimeString('pt-BR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  
  if (diffDias === 0) {
    return `Hoje às ${hora}`;
  } else if (diffDias === 1) {
    return `Ontem às ${hora}`;
  } else if (diffDias < 7) {
    return `${diffDias} dias atrás às ${hora}`;
  } else {
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }) + ` às ${hora}`;
  }
}

/**
 * Formata data simples sem hora
 */
export function formatarDataSimples(dataString: string): string {
  const data = new Date(dataString);
  return data.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}
