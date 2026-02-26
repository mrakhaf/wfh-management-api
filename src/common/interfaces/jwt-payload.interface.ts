export interface User {
  id: string;
  email: string;
  fullname: string;
  phone_number: string;
  position: string;
  photo_url: string;
  created_at: string;
  updated_at: string;
}

export interface JwtPayload {
  valid: boolean;
  user: User;
}
