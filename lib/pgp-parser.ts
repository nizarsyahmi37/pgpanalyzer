import * as openpgp from 'openpgp';
import type { ParsedKeyData, UserIdentity, SubkeyData } from '@/types/pgp';

export async function parseKey(keyText: string): Promise<ParsedKeyData> {
  try {
    // Clean and validate the key text
    const cleanedKey = keyText.trim();
    if (!cleanedKey) {
      throw new Error('No key content provided');
    }

    // Parse the key
    const key = await openpgp.readKey({ armoredKey: cleanedKey });
    
    if (!key) {
      throw new Error('Failed to parse PGP key');
    }

    // Get primary key information
    const primaryKey = key.getKeys()[0];
    if (!primaryKey) {
      throw new Error('No primary key found');
    }

    const fingerprint = key.getFingerprint();
    const keyId = key.getKeyID().toHex();
    const algorithm = getAlgorithmName(primaryKey.getAlgorithmInfo().algorithm);
    const bitLength = primaryKey.getAlgorithmInfo().bits || 0;
    const curve = primaryKey.getAlgorithmInfo().curve;
    
    const creationTime = primaryKey.getCreationTime();
    const expirationTime = await key.getExpirationTime();
    const isExpired = expirationTime ? new Date() > expirationTime : false;
    const isRevoked = key.revocationSignatures.length > 0;

    // Get usage flags
    const usage = getKeyUsage(primaryKey);

    // Get user identities
    const userIds: UserIdentity[] = [];
    const users = key.users;
    
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const userId = user.userID;
      
      if (userId) {
        const parsedUserId = parseUserId(userId.userID || '');
        userIds.push({
          ...parsedUserId,
          isPrimary: i === 0,
          isRevoked: isRevoked // Use the primary key's revocation status
        });
      }
    }

    // Get subkeys
    const subkeys: SubkeyData[] = [];
    const subkeyObjects = key.getSubkeys();
    
    for (const subkey of subkeyObjects) {
      const subkeyData = subkey.keyPacket;
      const subkeyId = subkey.getKeyID().toHex();
      const subkeyFingerprint = subkey.getFingerprint();
      const subkeyAlgorithm = getAlgorithmName(subkeyData.getAlgorithmInfo().algorithm);
      const subkeyBitLength = subkeyData.getAlgorithmInfo().bits || 0;
      const subkeyCurve = subkeyData.getAlgorithmInfo().curve;
      const subkeyCreationTime = subkeyData.getCreationTime();
      const subkeyExpirationTime = await subkey.getExpirationTime();
      const subkeyIsExpired = subkeyExpirationTime ? new Date() > subkeyExpirationTime : false;
      const subkeyIsRevoked = subkey.revocationSignatures.length > 0;
      const subkeyUsage = getKeyUsage(subkeyData);

      subkeys.push({
        keyId: subkeyId,
        fingerprint: subkeyFingerprint,
        algorithm: subkeyAlgorithm,
        bitLength: subkeyBitLength,
        curve: subkeyCurve,
        creationTime: subkeyCreationTime.toISOString().split('T')[0],
        expirationTime: subkeyExpirationTime instanceof Date ? subkeyExpirationTime.toISOString().split('T')[0] : undefined,
        isExpired: subkeyIsExpired,
        isRevoked: subkeyIsRevoked,
        usage: subkeyUsage
      });
    }

    return {
      fingerprint,
      keyId,
      algorithm,
      bitLength,
      curve,
      creationTime: creationTime.toISOString().split('T')[0],
      expirationTime: expirationTime instanceof Date ? expirationTime.toISOString().split('T')[0] : undefined,
      isExpired,
      isRevoked,
      usage,
      version: 4, // OpenPGP.js primarily works with v4 keys
      userIds,
      subkeys
    };

  } catch (error) {
    console.error('Error parsing PGP key:', error);
    throw new Error(`Failed to parse PGP key: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

function getAlgorithmName(algorithm: string): string {
  const algorithmMap: Record<string, string> = {
    'rsa': 'RSA',
    'dsa': 'DSA',
    'elgamal': 'ElGamal',
    'ecdsa': 'ECDSA',
    'ecdh': 'ECDH',
    'eddsa': 'EdDSA',
    'x25519': 'X25519',
    'x448': 'X448'
  };
  
  return algorithmMap[algorithm.toLowerCase()] || algorithm.toUpperCase();
}

function getKeyUsage(keyPacket: any): string[] {
  const usage: string[] = [];
  
  try {
    // Try to get key flags from the key packet
    if (keyPacket.keyFlags) {
      if (keyPacket.keyFlags.sign) usage.push('Sign');
      if (keyPacket.keyFlags.encrypt_communication || keyPacket.keyFlags.encrypt_storage) usage.push('Encrypt');
      if (keyPacket.keyFlags.certify) usage.push('Certify');
      if (keyPacket.keyFlags.authenticate) usage.push('Authenticate');
    } else {
      // Fallback based on algorithm
      const algorithm = keyPacket.getAlgorithmInfo().algorithm.toLowerCase();
      if (algorithm === 'rsa') {
        usage.push('Sign', 'Encrypt', 'Certify');
      } else if (algorithm === 'dsa') {
        usage.push('Sign', 'Certify');
      } else if (algorithm === 'ecdsa' || algorithm === 'eddsa') {
        usage.push('Sign', 'Certify');
      } else if (algorithm === 'ecdh') {
        usage.push('Encrypt');
      }
    }
  } catch (error) {
    // If we can't determine usage, provide a default
    usage.push('Unknown');
  }
  
  return usage.length > 0 ? usage : ['Unknown'];
}

function parseUserId(userIdString: string): Omit<UserIdentity, 'isPrimary' | 'isRevoked'> {
  // Parse user ID string like "Name (Comment) <email@example.com>"
  const emailMatch = userIdString.match(/<([^>]+)>/);
  const email = emailMatch ? emailMatch[1] : undefined;
  
  const commentMatch = userIdString.match(/\(([^)]+)\)/);
  const comment = commentMatch ? commentMatch[1] : undefined;
  
  // Extract name by removing email and comment parts
  let name = userIdString;
  if (emailMatch) {
    name = name.replace(emailMatch[0], '').trim();
  }
  if (commentMatch) {
    name = name.replace(commentMatch[0], '').trim();
  }
  
  return {
    name: name || 'Unknown',
    email,
    comment
  };
}