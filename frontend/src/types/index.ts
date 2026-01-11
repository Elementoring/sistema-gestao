export interface User {
  id: number;
  username: string;
  fullName: string;
  full_name?: string;
  role: 'admin' | 'user';
  active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface Client {
  id: number;
  cpf: string;
  full_name: string;
  birth_date: string;
  age: number;
  rg?: string;
  rg_issuer?: string;
  rg_issuer_state?: string;
  rg_issue_date?: string;
  mother_name?: string;
  father_name?: string;
  birthplace_city?: string;
  birthplace_state?: string;
  zip_code?: string;
  address?: string;
  address_number?: string;
  address_complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  phone_1?: string;
  phone_2?: string;
  benefits?: ClientBenefit[];
  created_at: string;
  updated_at: string;
}

export interface ClientBenefit {
  id?: number;
  benefit_organ: string;
  benefit_number: string;
  benefit_species?: string;
  benefit_species_description?: string;
  bank_code?: string;
  bank_name?: string;
  account_type?: 'corrente' | 'poupanca';
  agency?: string;
  account_number?: string;
  account_digit?: string;
  concession_date?: string;
  gross_salary?: number;
}

export interface Proposal {
  id: number;
  client_id: number;
  benefit_id?: number;
  proposal_date: string;
  contract_value: number;
  balance_due?: number;
  change_amount?: number;
  installment_value: number;
  installment_count: number;
  contract_bank: string;
  bank_login?: string;
  contract_type: string;
  status: string;
  interest_rate?: number;
  digitized_by?: number;
  attended_by?: number;
  notes?: string;
  cpf?: string;
  client_cpf?: string;
  client_name?: string;
  birth_date?: string;
  age?: number;
  phone_1?: string;
  benefit_organ?: string;
  benefit_number?: string;
  benefit_species?: string;
  benefit_species_description?: string;
  account_type?: string;
  agency?: string;
  account_number?: string;
  account_digit?: string;
  bank_name?: string;
  digitized_by_name?: string;
  attended_by_name?: string;
  created_at: string;
  updated_at: string;
}

export interface ProposalStats {
  total_proposals: number;
  total_clients: number;
  total_contract_value: number;
  avg_contract_value: number;
  approved_count: number;
  pending_count: number;
  denied_count: number;
  analyzing_count: number;
}
