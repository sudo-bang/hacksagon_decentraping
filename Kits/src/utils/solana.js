import nacl from 'tweetnacl';
import bs58 from 'bs58';
import { TextEncoder, TextDecoder } from 'util';

export const signData = (data, keypair) => {
  // TODO:
  // 1. Serialize the data object to a consistent string format (e.g., sorted JSON).
  // 2. Encode the string as a Uint8Array.
  // 3. Sign the bytes using the keypair's secret key.
  // 4. Return the signature as a Base58 encoded string.
  const message = JSON.stringify(data);
  const messageBytes = new TextEncoder().encode(message);
  const signatureBytes = nacl.sign.detached(messageBytes, keypair.secretKey);
  return bs58.encode(signatureBytes);
};

export const verifySignature = (data, signature, publicKey) => {
  // TODO:
  // 1. Serialize the data object just like in the signData function.
  // 2. Decode the Base58 signature and public key into bytes.
  // 3. Use nacl.sign.detached.verify() to check the signature.
  return true; // Placeholder
};