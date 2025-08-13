import { gzipSync, brotliCompressSync } from 'zlib';

export function compressText(text: string, encoding: 'gzip' | 'brotli'): Buffer {
  const buffer = Buffer.from(text, 'utf-8');
  
  if (encoding === 'brotli') {
    return brotliCompressSync(buffer, {
      params: {
        // High quality compression for better size reduction
        [require('zlib').constants.BROTLI_PARAM_QUALITY]: 6,
        [require('zlib').constants.BROTLI_PARAM_SIZE_HINT]: buffer.length,
      },
    });
  }
  
  return gzipSync(buffer, {
    level: 9, // Maximum compression
    windowBits: 15,
    memLevel: 8,
  });
}

export function shouldCompress(content: string, minSize: number = 1024): boolean {
  return content.length >= minSize;
}

export function detectBestEncoding(acceptEncoding: string): 'brotli' | 'gzip' | null {
  if (acceptEncoding.includes('br')) {
    return 'brotli';
  }
  if (acceptEncoding.includes('gzip')) {
    return 'gzip';
  }
  return null;
}