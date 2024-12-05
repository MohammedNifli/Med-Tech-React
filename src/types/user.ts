export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  role?: string; // Add this line if role is optional
  isBlocked: boolean; // Add this line
  isVerified: boolean;
  __v: number;
  photo: string;
  gender: string;
}