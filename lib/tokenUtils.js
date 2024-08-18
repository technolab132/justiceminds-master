import crypto from 'crypto';

// Ensure your secret key is a string
const secretKey = process.env.NEXT_PUBLIC_ENCRYPTION_SECRET;

// Generate a 32-byte (256-bit) key for AES-256-CBC
const ENCRYPTION_KEY = crypto.createHash('sha256').update(secretKey).digest(); // 32 bytes key

// Function to generate a random 16-byte IV for each encryption
function generateIV() {
  return crypto.randomBytes(16); // 16 bytes for AES
}

// Function to encrypt data into a token
export function createToken(data) {
  const iv = generateIV(); // Generate a new IV
  const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return {
    iv: iv.toString('hex'), // Include the IV in the output
    encryptedData: encrypted
  };
}


function getEncryptionKey() {
  return crypto.createHash('sha256').update(secretKey).digest();
}

export function decryptToken(encryptedToken, ivHex) {
  try {
    const iv = Buffer.from(ivHex, 'hex');
    const key = getEncryptionKey();
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);

    let decrypted = decipher.update(encryptedToken, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error.message);
    throw error;
  }
}

