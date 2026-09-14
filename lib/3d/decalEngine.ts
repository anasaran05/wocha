import * as THREE from 'three';
import { DecalGeometry } from 'three/examples/jsm/geometries/DecalGeometry.js';

export type GraphicPlacement = 'left-chest' | 'center-chest' | 'upper-back';

export interface DecalConfig {
  targetMesh: THREE.Mesh;
  texture: THREE.Texture;
  placement: GraphicPlacement;
  scale?: number; // scale multiplier, default 1.0
  colorTint?: string; // hex color if graphic needs tinting or contrast
}

// Preset 3D projection anchors for garments centered at y ~= 2.2 on the mannequin
export const PLACEMENT_ANCHORS: Record<
  GraphicPlacement,
  {
    position: THREE.Vector3;
    normal: THREE.Vector3;
    size: THREE.Vector3; // width, height, depth of the projection box
    rotation: THREE.Euler;
  }
> = {
  'center-chest': {
    position: new THREE.Vector3(0, 2.22, 0.44),
    normal: new THREE.Vector3(0, 0, 1),
    size: new THREE.Vector3(0.38, 0.38, 0.45),
    rotation: new THREE.Euler(0, 0, 0),
  },
  'left-chest': {
    position: new THREE.Vector3(-0.16, 2.34, 0.41),
    normal: new THREE.Vector3(-0.15, 0, 0.98).normalize(),
    size: new THREE.Vector3(0.16, 0.16, 0.35),
    rotation: new THREE.Euler(0, 0.15, 0),
  },
  'upper-back': {
    position: new THREE.Vector3(0, 2.30, -0.42),
    normal: new THREE.Vector3(0, 0, -1),
    size: new THREE.Vector3(0.44, 0.44, 0.45),
    rotation: new THREE.Euler(0, Math.PI, 0),
  },
};

/**
 * Creates a Decal Mesh projected onto the target garment mesh.
 */
export function createGarmentDecal({
  targetMesh,
  texture,
  placement,
  scale = 1.0,
  colorTint,
}: DecalConfig): THREE.Mesh | null {
  try {
    const anchor = PLACEMENT_ANCHORS[placement];
    if (!anchor) return null;

    // Adjust size by scale multiplier
    const scaledSize = anchor.size.clone().multiplyScalar(scale);

    const decalGeometry = new DecalGeometry(
      targetMesh,
      anchor.position,
      anchor.rotation,
      scaledSize
    );

    const decalMaterial = new THREE.MeshStandardMaterial({
      map: texture,
      transparent: true,
      depthTest: true,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -4,
      polygonOffsetUnits: -4,
      roughness: 0.8,
      metalness: 0.05,
    });

    if (colorTint) {
      decalMaterial.color = new THREE.Color(colorTint);
    }

    const decalMesh = new THREE.Mesh(decalGeometry, decalMaterial);
    decalMesh.renderOrder = 1;
    return decalMesh;
  } catch (err) {
    console.warn('Failed to project decal onto garment mesh:', err);
    return null;
  }
}
