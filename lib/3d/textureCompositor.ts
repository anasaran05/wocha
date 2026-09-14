import * as THREE from 'three';

/**
 * Creates a high-resolution canvas texture from custom text motif.
 */
export function createTextGraphicTexture(
  text: string,
  font: 'grotesk' | 'serif' | 'mono' = 'grotesk',
  textColor: string = '#FFFFFF'
): THREE.CanvasTexture {
  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.clearRect(0, 0, size, size);

  // Styling
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = textColor;

  let fontFamily = 'system-ui, -apple-system, sans-serif';
  let fontWeight = 'bold';
  let fontStyle = 'normal';
  let letterSpacing = '4px';

  if (font === 'serif') {
    fontFamily = 'Playfair Display, Georgia, serif';
    fontWeight = '500';
    fontStyle = 'italic';
    letterSpacing = '2px';
  } else if (font === 'mono') {
    fontFamily = 'ui-monospace, SFMono-Regular, Menlo, monospace';
    fontWeight = '600';
    letterSpacing = '8px';
  }

  // Draw refined typography with micro-subtext
  const lines = text.split('\n');
  const fontSize = Math.min(100, Math.floor(size / (lines[0]?.length || 10) * 1.3));

  ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;
  
  // High-fashion frame/box or underline aesthetic if single short line
  const startY = size / 2 - ((lines.length - 1) * fontSize * 1.3) / 2;
  lines.forEach((line, idx) => {
    ctx.fillText(line.trim(), size / 2, startY + idx * fontSize * 1.35);
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Loads an external image (or data URL from uploaded image) into a Three.js Texture
 * with aspect ratio preservation centered in a square transparent canvas.
 */
export function createImageGraphicTexture(
  src: string,
  onLoaded?: (texture: THREE.Texture) => void
): THREE.CanvasTexture {
  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;

  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => {
    ctx.clearRect(0, 0, size, size);

    // Maintain aspect ratio centered in canvas
    const maxDim = size * 0.85;
    const aspect = img.width / img.height;
    let drawW = maxDim;
    let drawH = maxDim;

    if (aspect > 1) {
      drawH = maxDim / aspect;
    } else {
      drawW = maxDim * aspect;
    }

    const drawX = (size - drawW) / 2;
    const drawY = (size - drawH) / 2;

    ctx.drawImage(img, drawX, drawY, drawW, drawH);
    texture.needsUpdate = true;
    if (onLoaded) onLoaded(texture);
  };
  img.src = src;

  return texture;
}
