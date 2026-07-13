import { UserRole } from "@/generated/prisma/enums.js";

export interface AuthTokenPayload {
  sub: string;
  role: UserRole;
  iat: number;
  exp: number;
}
