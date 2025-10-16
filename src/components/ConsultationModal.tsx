import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

interface ConsultationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  renave?: string;
}

export const ConsultationModal: React.FC<ConsultationModalProps> = ({
  open,
  onOpenChange,
  renave = "18283215412"
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-brand-yellow p-8 max-w-sm border-none rounded-2xl">
        <div className="space-y-4">
          <h2 className="text-black text-lg font-bold text-center">
            RENAVE: {renave}
          </h2>
          
          <Input
            placeholder="Seu Nome"
            className="bg-white border-none h-12 text-black placeholder:text-gray-400 rounded-lg"
          />
          
          <Input
            placeholder="WhatsApp"
            className="bg-white border-none h-12 text-black placeholder:text-gray-400 rounded-lg"
          />
          
          <button className="w-full bg-black text-white font-bold py-3 rounded-lg hover:bg-gray-900 transition-colors">
            Consultar Agora
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
