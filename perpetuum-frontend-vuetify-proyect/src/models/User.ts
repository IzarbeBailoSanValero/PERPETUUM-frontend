//  Si algo cambia aquí, cambia en toda la App.
export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  funeralHomeId: number | null;   // Lo pongo como opcional  / null porque los StandardUser no tienen funeraria
}