import type { Admin } from "../services/adminService";


export type DriverStatus = 'PENDENTE' | 'ATIVO' | 'BLOQUEADO';
export type VehicleStatus = 'REGULAR' | 'FURTO' | 'IRREGULAR';


export interface UserData {
  id: string;
  name: string;
  email: string;
  password: string;

  cpf?: string | null;
  cnpj?: string | null;
  isActive: boolean;
  createdAt: string;
}


export interface Driver {  
  // Dados Profissionais
  id: string;
  cnh: string;
  status: DriverStatus; // ISO string (ex: "2023-01-15")
  photoUrl?: string; // Opcional
  publicToken: string;
  createdAt: string; // Vem como string ISO do JSON
  user: UserData;    // Relação obrigatória
  vehicle?: Vehicle[] | null; // Relação opcional (pode ser null)
  companyId: string;
  toxicologyExam: string;
}

export interface CreateDriverData {  
  // Dados Profissionais
  name: string;
  email: string;
  password: string;
  cnh: string;
  companyId?: string;
  cpf?: string;
  status: string;
  photoUrl: string;
  toxicologyExam: Date | null;
}

export interface UpdateDriverData {  
  // Dados Profissionais
  name: string;
  email: string;
  password?: string;
  cpf?: string;
  cnh: string;
  company: string;
  status: string;
  photoUrl: string;
  toxicologyExam: Date | null;
}

// 2. O que vem dentro de 'vehicle'
export interface VehicleData {
  id: string;
  plate: string;
  model: string;
  brand: string;
  color: string;
  year: string;
  status?: VehicleStatus;
  licensingDate: string;
  renavam: string;
  ownerName: string;
  driverId?: string | null;
  companyId?: string | null;
}

// 4. Metadados da Paginação
export interface PaginationMeta {
  total: number;
  page: number;
  lastPage: number;
  limit: number;
}

// 5. Resposta da API
export interface DriversResponse {
  data: Driver[];
  meta: PaginationMeta;
}

export type OperatorType = 'PF' | 'PJ';

// --- TIPO PRINCIPAL (Retorno do Banco/API) ---
export interface Operator {
  id: string;
  userId: string;
  
  // Dados específicos do Model Operator
  companyId: string | null;
  region: string | null;

  // Relacionamento com User (Essencial para a tabela mostrar Nome/Email)
  user: {
    id: string;
    name: string;
    email: string;
    cpf: string;
  };
}

// --- TIPO PARA CRIAÇÃO (POST) ---
// Junta dados do User (nome, email, senha) + dados do Operator
export interface CreateOperatorData {
  // Dados do User
  name: string;
  email: string;
  password: string; // Obrigatória na criação
  companyId: string;
  region: string;
  cpf?: string;     
}

// --- TIPO PARA EDIÇÃO (PATCH) ---
// Tudo opcional, pois podemos editar só um campo
export interface UpdateOperatorData {
  name?: string;
  email?: string;
  password?: string; // Se enviado, troca a senha. Se não, mantém.
  
  type?: OperatorType;
  company?: string;
  region?: string;
  cpf?: string;
  cnpj?: string;
}

// --- TIPOS DE RESPOSTA DA API (Paginação) ---

export interface PaginationMeta {
  total: number;
  page: number;
  lastPage: number;
  limit: number;
  /*
  currentPage?: number | null;
  perPage?: number | null;
  prev?: number | null;
  next?: number | null;
  */
}

export interface OperatorsResponse {
  data: Operator[];
  meta: PaginationMeta;
}

// src/types/index.ts
export interface Vehicle {
  id: string;
  plate: string;      // Placa
  model: string;      // Modelo
  brand: string;      // Marca
  year: string;       // Ano
  color: string;
  renavam: string;    // RENAVAM
  licensingDate: string; // Data de Licenciamento
  ownerName: string;  // Nome do Proprietário
  status?: VehicleStatus;
  driverId?: string | null;
  companyId?: string | null;

  // Relacionamento opcional com Motorista (quem está dirigindo agora?)
  driver?: {
    id: string;
    user: {
      name: string;
    }
  } | null;
  company?: {
    id: string;
    user: {
      name: string;
    }
  } | null;
}

export interface VehiclesResponse {
  data: Vehicle[];
  meta: PaginationMeta;
}

export interface AdminsResponse {
  data: Admin[];
  meta: PaginationMeta;
}

export interface CreateVehicleData {
  plate: string;
  model: string;
  brand: string;
  year: string;
  color: string;
  renavam: string;
  licensingDate: Date | null;
  ownerName: string;
  status?: VehicleStatus;
  driverId?: string | null;
  companyId?: string | null;
}

export interface UpdateVehicleData {
  plate?: string;
  model?: string;
  brand?: string;
  year?: string;
  color?: string;
  renavam?: string;
  licensingDate?: Date | null;
  ownerName?: string;
  status?: VehicleStatus;
  driverId?: string | null;
  companyId?: string | null;
}

export const statusCarOptions = [
  { value: 'REGULAR', label: 'Regular' },
  { value: 'FURTO', label: 'Furto' },
  { value: 'IRREGULAR', label: 'Irregular' },
];

export const yearCarOptions = [
  "2024", "2023", "2022", "2021", "2020", "2019",
  "2018", "2017", "2016", "2015", "2014", "2013",
  "2012", "2011", "2010", "2009", "2008", "2007",
  "2006", "2005", "2004", "2003", "2002", "2001",
  "2000", "1999", "1998", "1997", "1996", "1995",
  "1994", "1993", "1992", "1991", "1990", "1989",
  "1988", "1987", "1986", "1985", "1984", "1983",
  "1982", "1981", "1980", "1979", "1978", "1977",
  "1976", "1975", "1974", "1973", "1972", "1971",
  "1970", "1969", "1968", "1967", "1966", "1965", 
  "1964", "1963", "1962", "1961", "1960",
];

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    lastPage?: number;
    limit: number;
  };
}

export interface Company {
  id: string;
  user:UserData;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phone?: string;
}


export interface UpdateCompanyData {
  name?: string;
  email?: string;
  password?: string;
  cnpj?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phone?: string;
}
