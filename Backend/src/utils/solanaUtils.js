import nacl from 'tweetnacl';
import bs58 from 'bs58';
import { TextEncoder } from 'util';

export const verifySignature = (data, signature, publicKey) => {
  try {
    // 1. Serialize the data object to a consistent string format, same as the client.
    const message = JSON.stringify(data);
    const messageBytes = new TextEncoder().encode(message);

    // 2. Decode the Base58 signature and public key into bytes.
    const signatureBytes = bs58.decode(signature);
    const publicKeyBytes = bs58.decode(publicKey);

    // 3. Use nacl.sign.detached.verify() to check the signature.
    return nacl.sign.detached.verify(messageBytes, signatureBytes, publicKeyBytes);
  } catch (error) {
    console.error("Error verifying signature:", error);
    return false;
  }
};