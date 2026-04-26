import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  userId?: string;
  userRole?: string;
}

export interface JWTPayload {
  userId: string;
  role: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  role?: 'COLABORADOR' | 'RH' | 'GESTOR';
}

export interface UpdateUserDTO {
  name?: string;
  email?: string;
  avatar?: string;
}

export interface CreatePostDTO {
  content: string;
  category?: string;
  imageUrl?: string;
}

export interface CreateMessageDTO {
  receiverId: string;
  content: string;
}

export interface UploadDocumentDTO {
  admissionId: string;
  documentName: string;
}
