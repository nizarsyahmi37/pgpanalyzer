export interface ParsedKeyData {
  fingerprint: string;
  keyId: string;
  algorithm: string;
  bitLength: number;
  curve?: string;
  creationTime: string;
  expirationTime?: string;
  isExpired: boolean;
  isRevoked: boolean;
  usage: string[];
  version: number;
  userIds: UserIdentity[];
  subkeys: SubkeyData[];
}

export interface UserIdentity {
  name: string;
  email?: string;
  comment?: string;
  isPrimary: boolean;
  isRevoked: boolean;
}

export interface SubkeyData {
  keyId: string;
  fingerprint: string;
  algorithm: string;
  bitLength: number;
  curve?: string;
  creationTime: string;
  expirationTime?: string;
  isExpired: boolean;
  isRevoked: boolean;
  usage: string[];
}