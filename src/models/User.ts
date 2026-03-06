//  Si algo cambia aquí, cambia en toda la App.

// Datos que vienen del JWT (token decodificado en authStore)
export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  funeralHomeId: number | null; // Solo Staff/Guardian tienen funeraria; StandardUser es null
}

// Datos que devuelve GET /api/User/{id} (UserDtoOut del backend)
// No incluye funeralHomeId porque UserDtoOut no lo expone
export interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: string;
  phoneNumber: string | null;
  birthDate: string | null; //  viene como DateTime? del backend
}