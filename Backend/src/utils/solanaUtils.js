import nacl from 'tweetnacl';
import bs58 from 'bs58';
import { TextEncoder } from 'util';

const deterministicStringify = (obj) => {
  const sortedObj = {};
  Object.keys(obj).sort().forEach(key => {
    sortedObj[key] = obj[key];
  });
  const str = JSON.stringify(sortedObj);
  // --- DEBUG LOG ---
  console.log(`[Backend] String being verified: ${str}`);
  return str;
};

export const verifySignature = (data, signature, publicKey) => {
  try {
    const message = deterministicStringify(data);
    const messageBytes = new TextEncoder().encode(message);
    const signatureBytes = bs58.decode(signature);
    const publicKeyBytes = bs58.decode(publicKey);
    return nacl.sign.detached.verify(messageBytes, signatureBytes, publicKeyBytes);
  } catch (error) {
    console.error("Error verifying signature:", error);
    return false;
  }
};