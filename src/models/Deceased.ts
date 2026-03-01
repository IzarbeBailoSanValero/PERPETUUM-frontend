//Campos base que comparten casi todos los DTOs
interface DeceasedBase {
  dni: string;
  name: string;
  funeralHomeId: number;
  guardianId: number;
  staffId: number; 
  biography: string;
  photoURL: string;
  birthDate: string;
  deathDate: string;
  epitaph: string;
}

//DeceasedCreateDTO
export interface DeceasedCreate extends DeceasedBase {}

//DeceasedUpdateDTO
export interface DeceasedUpdate extends DeceasedCreate {
  id: number;
}

//DeceasedResponseDTO
export interface Deceased extends DeceasedBase {
  id: number;
  memories?: any[] | null; //  los MemoryResponseDTO
}

//para listados (DeceasedSummaryDTO) no extiende porque es cortito

export interface DeceasedSummary {
  id: number;
  name: string;
  photoURL?: string;
  deathDate: string;
}
