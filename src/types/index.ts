export type DriverStatus = 'PENDENTE' | 'ATIVO' | 'BLOQUEADO';
export type VehicleStatus = 'REGULAR' | 'FURTO' | 'IRREGULAR';

export interface Driver {  
  // Dados Profissionais
  id: string;
  cnh: string;
  status: DriverStatus; // ISO string (ex: "2023-01-15")
  photoUrl?: string; // Opcional
  publicToken: string;
  createdAt: string; // Vem como string ISO do JSON
  user: UserData;    // Relação obrigatória
  vehicle?: VehicleData | null; // Relação opcional (pode ser null)
  company: string;
  toxicologyExam: string;
}

export interface UserData {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  createdAt: string;
}

// 2. O que vem dentro de 'vehicle'
export interface VehicleData {
  id: string;
  model: string;
  plate: string;
  brand: string;
  color: string;
  status: VehicleStatus;
  licensingDate: string;
  ownerName: string;  
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