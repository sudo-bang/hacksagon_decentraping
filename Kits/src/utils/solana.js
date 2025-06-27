import nacl from 'tweetnacl';
import bs58 from 'bs58';
import { TextEncoder } from 'util';

export const signData = (data, keypair) => {
  const message = JSON.stringify(data);
  const messageBytes = new TextEncoder().encode(message);
  const signatureBytes = nacl.sign.detached(messageBytes, keypair.secretKey);
  return bs58.encode(signatureBytes);
};

export const verifySignature = (data, signature, publicKey) => {
  try {
    const message = JSON.stringify(data);
    const messageBytes = new TextEncoder().encode(message);
    const signatureBytes = bs58.decode(signature);
    const publicKeyBytes = bs58.decode(publicKey);
    return nacl.sign.detached.verify(messageBytes, signatureBytes, publicKeyBytes);
  } catch (error) {
    console.error("Error verifying signature:", error.message);
    return false;
  }
};