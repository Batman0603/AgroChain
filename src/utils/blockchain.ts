import crypto from 'crypto-js';

export function generateHash(data: string): string {
  return crypto.SHA256(data).toString();
}

export function verifyHash(data: string, hash: string): boolean {
  return generateHash(data) === hash;
}