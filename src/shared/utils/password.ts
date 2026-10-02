import argon2 from "argon2";

export function hashPassword(password: string): Promise<string> {
  return argon2.hash(password);
}

export function verifyPassword(hashedPassword: string, password: string): Promise<boolean> {
  return argon2.verify(hashedPassword, password);
}
