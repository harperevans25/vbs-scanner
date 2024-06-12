import forge from 'node-forge';

// Helper function to convert a PEM-encoded private key to a forge private key object
function getPrivateKey(privateKeyPem) {
  const privateKeyObject = forge.pki.privateKeyFromPem(privateKeyPem);
  return privateKeyObject;
}

export function decryptMessage(encryptedMessage, privateKeyPem) {
  const privateKey = getPrivateKey(privateKeyPem);

  const encryptedBytes = forge.util.decode64(encryptedMessage);
  const decryptedBytes = privateKey.decrypt(encryptedBytes, 'RSA-OAEP', {
    md: forge.md.sha256.create(),
    mgf1: {
      md: forge.md.sha256.create(),
    },
  });

  return forge.util.decodeUtf8(decryptedBytes);
}