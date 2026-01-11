import * as XLSX from 'xlsx';

export const exportToExcel = (data: any[], filename: string, sheetName: string = 'Dados') => {
  // Criar workbook
  const wb = XLSX.utils.book_new();
  
  // Criar worksheet a partir dos dados
  const ws = XLSX.utils.json_to_sheet(data);
  
  // Ajustar largura das colunas automaticamente
  const colWidths = Object.keys(data[0] || {}).map(key => ({
    wch: Math.max(
      key.length,
      ...data.map(row => String(row[key] || '').length)
    ) + 2
  }));
  ws['!cols'] = colWidths;
  
  // Adicionar worksheet ao workbook
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  
  // Gerar arquivo e fazer download
  XLSX.writeFile(wb, `${filename}.xlsx`);
};

export const exportClientsToExcel = (clients: any[]) => {
  const formattedData = clients.map(client => ({
    'CPF': client.cpf,
    'Nome Completo': client.full_name,
    'Data de Nascimento': new Date(client.birth_date).toLocaleDateString('pt-BR'),
    'Idade': client.age,
    'Email': client.email || '',
    'Telefone 1': client.phone_1,
    'Telefone 2': client.phone_2 || '',
    'CEP': client.zip_code,
    'Endereço': `${client.address}, ${client.address_number}`,
    'Bairro': client.neighborhood,
    'Cidade': client.city,
    'Estado': client.state,
    'Órgão Benefício': client.benefits?.[0]?.benefit_organ || '',
    'Nº Benefício': client.benefits?.[0]?.benefit_number || '',
    'Espécie': client.benefits?.[0]?.benefit_species || '',
    'Salário Bruto': client.benefits?.[0]?.gross_salary ? `R$ ${Number(client.benefits[0].gross_salary || 0).toFixed(2)}` : '',
    'Cadastrado em': new Date(client.created_at).toLocaleDateString('pt-BR')
  }));

  exportToExcel(formattedData, `clientes_${new Date().toISOString().split('T')[0]}`, 'Clientes');
};

export const exportProposalsToExcel = (proposals: any[]) => {
  const formattedData = proposals.map(proposal => ({
    'ID': proposal.id,
    'Data Proposta': new Date(proposal.proposal_date).toLocaleDateString('pt-BR'),
    'Cliente': proposal.client_name,
    'CPF': proposal.cpf,
    'Valor Contrato': `R$ ${Number(proposal.contract_value || 0).toFixed(2)}`,
    'Valor Parcela': `R$ ${Number(proposal.installment_value || 0).toFixed(2)}`,
    'Qtd Parcelas': proposal.installment_count,
    'Banco Contrato': proposal.contract_bank,
    'Tipo Contrato': proposal.contract_type,
    'Status': proposal.status,
    'Taxa Juros': proposal.interest_rate ? `${proposal.interest_rate}%` : '',
    'Digitado por': proposal.digitized_by_name || '',
    'Atendido por': proposal.attended_by_name || '',
    'Observações': proposal.notes || '',
    'Criado em': new Date(proposal.created_at).toLocaleDateString('pt-BR')
  }));

  exportToExcel(formattedData, `propostas_${new Date().toISOString().split('T')[0]}`, 'Propostas');
};

export const exportStatusHistoryToExcel = (history: any[]) => {
  const formattedData = history.map(entry => ({
    'Data': new Date(entry.created_at).toLocaleString('pt-BR'),
    'Status Anterior': entry.old_status || 'Novo',
    'Novo Status': entry.new_status,
    'Alterado por': entry.changed_by_name,
    'Observações': entry.notes || ''
  }));

  exportToExcel(formattedData, `historico_status_${new Date().toISOString().split('T')[0]}`, 'Histórico');
};

export const exportInteractionsToExcel = (interactions: any[]) => {
  const formattedData = interactions.map(interaction => ({
    'Data': new Date(interaction.created_at).toLocaleString('pt-BR'),
    'Tipo': interaction.interaction_type,
    'Descrição': interaction.description,
    'Usuário': interaction.user_name
  }));

  exportToExcel(formattedData, `interacoes_${new Date().toISOString().split('T')[0]}`, 'Interações');
};
