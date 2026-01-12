import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Check } from 'lucide-react';

interface Benefit {
  id: number;
  benefit_organ: string;
  benefit_number: string;
  benefit_species: string;
  benefit_species_description: string;
  bank_name: string;
  account_type: string;
  gross_salary: string;
}

interface BenefitSelectorModalProps {
  open: boolean;
  onClose: () => void;
  benefits: Benefit[];
  onSelect: (benefit: Benefit) => void;
}

export default function BenefitSelectorModal({
  open,
  onClose,
  benefits,
  onSelect,
}: BenefitSelectorModalProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Selecione o Benefício para a Proposta</DialogTitle>
          <DialogDescription id="benefit-selector-description">
            Este cliente possui múltiplos benefícios cadastrados. Selecione qual benefício será usado nesta proposta:
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {benefits.map((benefit, index) => (
            <Card
              key={benefit.id}
              className="cursor-pointer hover:border-primary hover:shadow-md transition-all"
              onClick={() => onSelect(benefit)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">
                        Benefício {index + 1} - {benefit.benefit_organ}
                      </h3>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                        {benefit.benefit_species}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                      <div>
                        <span className="text-gray-500">Matrícula:</span>
                        <span className="ml-2 font-medium">{benefit.benefit_number}</span>
                      </div>

                      <div>
                        <span className="text-gray-500">Espécie:</span>
                        <span className="ml-2 font-medium">{benefit.benefit_species_description}</span>
                      </div>

                      <div>
                        <span className="text-gray-500">Banco:</span>
                        <span className="ml-2 font-medium">{benefit.bank_name}</span>
                      </div>

                      <div>
                        <span className="text-gray-500">Tipo de Conta:</span>
                        <span className="ml-2 font-medium capitalize">{benefit.account_type}</span>
                      </div>

                      {benefit.gross_salary && (
                        <div>
                          <span className="text-gray-500">Salário Bruto:</span>
                          <span className="ml-2 font-medium text-green-600">
                            R$ {Number(benefit.gross_salary).toLocaleString('pt-BR', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <Button
                    type="button"
                    size="sm"
                    className="ml-4"
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Selecionar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-end pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
