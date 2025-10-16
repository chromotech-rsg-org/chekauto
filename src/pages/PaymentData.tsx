import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stepper } from '@/components/ui/stepper';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreditCard } from 'lucide-react';
import logoBlack from '@/assets/logo-chekauto-black.png';

export default function PaymentData() {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<'cartao' | 'pix'>('cartao');
  const [cardData, setCardData] = useState({
    numero: '',
    titular: '',
    cvv: '',
    validade: '',
    parcelas: '1'
  });

  const steps = [
    { label: 'Dados do Veículo', completed: true, active: false },
    { label: 'Dados do Cliente', completed: true, active: false },
    { label: 'Pagamento', completed: false, active: true },
    { label: 'Finalizado', completed: false, active: false }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Payment data:', { paymentMethod, cardData });
    navigate('/solicitacao/confirmacao');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 py-4 px-6">
        <img src={logoBlack} alt="CHEKAUTO" className="h-8" />
      </header>

      {/* Stepper */}
      <div className="py-12 bg-gray-50">
        <Stepper steps={steps} />
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Resumo da Compra */}
          <div>
            <h2 className="text-2xl font-bold text-black mb-6">Resumo da compra</h2>
            
            <div className="border border-gray-200 rounded-lg p-6 mb-6">
              <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center mb-4">
                <p className="text-gray-400">Imagem 3D do produto</p>
              </div>
              
              <h3 className="text-xl font-bold text-black mb-2">CARROCERIA SOBRE CHASSI TANQUE</h3>
              <p className="text-gray-600 text-sm mb-4">
                Implemento especializado para transporte de líquidos com segurança e eficiência.
              </p>
              
              <div className="bg-gray-50 rounded p-4 mb-4">
                <p className="text-sm text-gray-600">Características principais do produto</p>
              </div>
              
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">R$ 1.950,00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Desconto</span>
                  <span className="font-semibold text-green-600">- R$ 150,00</span>
                </div>
                <div className="flex justify-between text-lg pt-2 border-t">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-[#FAA954]">R$ 1.750,00</span>
                </div>
              </div>
            </div>
          </div>

          {/* Dados de Pagamento */}
          <div>
            <h2 className="text-2xl font-bold text-black mb-6">Dados do Pagamento</h2>
            
            {/* Método de Pagamento */}
            <div className="flex gap-4 mb-8">
              <button
                type="button"
                onClick={() => setPaymentMethod('cartao')}
                className={`flex-1 py-3 px-4 rounded-lg border-2 font-semibold transition-all ${
                  paymentMethod === 'cartao'
                    ? 'border-black bg-black text-white'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
              >
                Cartão de Crédito
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('pix')}
                className={`flex-1 py-3 px-4 rounded-lg border-2 font-semibold transition-all ${
                  paymentMethod === 'pix'
                    ? 'border-black bg-black text-white'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
              >
                Pagamento via PIX
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {paymentMethod === 'cartao' ? (
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="numeroCartao">Número do Cartão *</Label>
                    <div className="relative">
                      <Input
                        id="numeroCartao"
                        value={cardData.numero}
                        onChange={(e) => setCardData(prev => ({ ...prev, numero: e.target.value }))}
                        placeholder="0000 0000 0000 0000"
                        className="mt-1 pl-10"
                        required
                      />
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="titular">Nome do Titular *</Label>
                    <Input
                      id="titular"
                      value={cardData.titular}
                      onChange={(e) => setCardData(prev => ({ ...prev, titular: e.target.value }))}
                      placeholder="Nome como está no cartão"
                      className="mt-1"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="cvv">CVV *</Label>
                      <Input
                        id="cvv"
                        value={cardData.cvv}
                        onChange={(e) => setCardData(prev => ({ ...prev, cvv: e.target.value }))}
                        placeholder="123"
                        maxLength={3}
                        className="mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="validade">Validade *</Label>
                      <Input
                        id="validade"
                        value={cardData.validade}
                        onChange={(e) => setCardData(prev => ({ ...prev, validade: e.target.value }))}
                        placeholder="MM/AA"
                        className="mt-1"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="parcelas">Número de Parcelas *</Label>
                    <Select value={cardData.parcelas} onValueChange={(value) => setCardData(prev => ({ ...prev, parcelas: value }))}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1x de R$ 1.750,00 sem juros</SelectItem>
                        <SelectItem value="2">2x de R$ 875,00 sem juros</SelectItem>
                        <SelectItem value="3">3x de R$ 583,33 sem juros</SelectItem>
                        <SelectItem value="6">6x de R$ 291,67 sem juros</SelectItem>
                        <SelectItem value="12">12x de R$ 145,83 sem juros</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <div className="bg-gray-200 w-48 h-48 mx-auto mb-4 rounded-lg flex items-center justify-center">
                      <p className="text-gray-500">QR Code PIX</p>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Escaneie o QR Code ou copie o código abaixo</p>
                    <div className="bg-gray-50 p-3 rounded text-xs font-mono break-all">
                      00020126580014br.gov.bcb.pix...
                    </div>
                    <Button type="button" variant="outline" className="mt-4">
                      Copiar código PIX
                    </Button>
                  </div>
                </div>
              )}

              <Button type="submit" className="w-full bg-black text-white hover:bg-black/90 h-12 text-base font-semibold rounded-full mt-8">
                Finalizar Compra
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
