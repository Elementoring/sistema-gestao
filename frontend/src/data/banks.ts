export const banks = [
  { code: '000', name: 'Banco Itaucard / ITI' },
  { code: '001', name: 'Banco do Brasil S.A.' },
  { code: '003', name: 'Banco da Amazônia S.A.' },
  { code: '004', name: 'Banco do Nordeste do Brasil S.A.' },
  { code: '033', name: 'Banco Santander (Brasil) S.A.' },
  { code: '041', name: 'Banco do Estado do Rio Grande do Sul S.A.' },
  { code: '070', name: 'BRB - Banco de Brasília S.A.' },
  { code: '077', name: 'Banco Intermedium S.A.' },
  { code: '104', name: 'Caixa Econômica Federal' },
  { code: '212', name: 'Banco Original S.A.' },
  { code: '237', name: 'Banco Bradesco S.A.' },
  { code: '260', name: 'Nu Pagamentos' },
  { code: '290', name: 'PagBank' },
  { code: '318', name: 'Banco BMG S.A.' },
  { code: '336', name: 'Banco C6 S.A' },
  { code: '341', name: 'Itaú Unibanco S.A.' },
  { code: '389', name: 'Banco Mercantil do Brasil S.A.' },
  { code: '422', name: 'Banco Safra S.A.' },
  { code: '623', name: 'Banco Panamericano S.A.' },
  { code: '633', name: 'Banco Rendimento S.A.' },
  { code: '637', name: 'Banco Sofisa S.A.' },
  { code: '655', name: 'Banco Votorantim S.A.' },
  { code: '707', name: 'Banco Daycoval S.A.' },
  { code: '748', name: 'Banco Cooperativo Sicredi S.A.' },
  { code: '756', name: 'Banco Cooperativo do Brasil S.A. - BANCOOB' },
];

export const getBankName = (code: string): string => {
  const bank = banks.find(b => b.code === code);
  return bank ? bank.name : '';
};
