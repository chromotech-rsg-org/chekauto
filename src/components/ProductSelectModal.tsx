import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Search, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Produto {
  id: string;
  nome: string;
  preco: number;
  descricao: string | null;
  foto_url: string | null;
  categoria_id: string | null;
}

interface Categoria {
  id: string;
  nome: string;
  codigo: string | null;
}

interface ProductSelectModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (product: { id: string; name: string; price: number; description: string; image?: string }) => void;
}

export function ProductSelectModal({ open, onClose, onSelect }: ProductSelectModalProps) {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [categoriaFilter, setCategoriaFilter] = useState<string>('all');

  useEffect(() => {
    if (open) {
      loadData();
    }
  }, [open]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [produtosRes, categoriasRes] = await Promise.all([
        supabase.from('produtos').select('*').eq('ativo', true).order('nome'),
        supabase.from('categorias').select('*').order('nome')
      ]);

      if (produtosRes.data) setProdutos(produtosRes.data);
      if (categoriasRes.data) setCategorias(categoriasRes.data);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProdutos = produtos.filter(p => {
    const matchesSearch = search === '' || 
      p.nome.toLowerCase().includes(search.toLowerCase()) ||
      (p.descricao && p.descricao.toLowerCase().includes(search.toLowerCase()));
    
    const matchesCategoria = categoriaFilter === 'all' || p.categoria_id === categoriaFilter;
    
    return matchesSearch && matchesCategoria;
  });

  const handleSelect = (produto: Produto) => {
    onSelect({
      id: produto.id,
      name: produto.nome,
      price: produto.preco,
      description: produto.descricao || '',
      image: produto.foto_url || undefined
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Selecionar Produto</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col sm:flex-row gap-3 py-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar produto..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={categoriaFilter} onValueChange={setCategoriaFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as categorias</SelectItem>
              {categorias.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.codigo ? `${cat.codigo} - ${cat.nome}` : cat.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredProdutos.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              Nenhum produto encontrado
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
              {filteredProdutos.map((produto) => (
                <Card 
                  key={produto.id} 
                  className="p-4 cursor-pointer hover:border-brand-yellow transition-colors"
                  onClick={() => handleSelect(produto)}
                >
                  {produto.foto_url && (
                    <img 
                      src={produto.foto_url} 
                      alt={produto.nome}
                      className="w-full h-32 object-cover rounded-md mb-3"
                    />
                  )}
                  <h3 className="font-semibold text-sm line-clamp-2 mb-1">{produto.nome}</h3>
                  {produto.descricao && (
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{produto.descricao}</p>
                  )}
                  <p className="text-brand-yellow font-bold">
                    R$ {produto.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="pt-4 border-t">
          <Button variant="outline" onClick={onClose} className="w-full">
            Cancelar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
