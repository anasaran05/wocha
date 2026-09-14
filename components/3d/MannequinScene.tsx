'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  createGarmentDecal,
  GraphicPlacement,
} from '@/lib/3d/decalEngine';
import {
  createTextGraphicTexture,
  createImageGraphicTexture,
} from '@/lib/3d/textureCompositor';

export type GarmentSelection = 'hoodie' | 'tshirt' | 'puffer';

export interface MannequinSceneProps {
  activeGarment: GarmentSelection;
  onSelectGarment?: (garment: GarmentSelection) => void;
  garmentColor?: string;
  showAngleControls?: boolean;
  // Dynamic graphic / image projection props
  graphicType?: 'image' | 'text' | 'none';
  graphicUrl?: string;
  customText?: string;
  customFont?: 'grotesk' | 'serif' | 'mono';
  graphicPlacement?: GraphicPlacement;
  graphicScale?: number;
  graphicColor?: string;
}

/**
 * Creates lightweight procedural micro-weave normal textures.
 */
function createProceduralFabricTexture(type: 'twill' | 'ripstop' | 'jersey'): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const imgData = ctx.createImageData(size, size);
  const data = imgData.data;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      let nx = 128;
      let ny = 128;
      const nz = 255;

      if (type === 'twill') {
        const diag = (x + y * 2) % 8;
        const bump = Math.sin((diag / 8) * Math.PI * 2) * 22;
        const grain = (Math.random() - 0.5) * 8;
        nx = 128 + bump + grain;
        ny = 128 + bump * 0.6 + grain;
      } else if (type === 'ripstop') {
        const gridX = x % 24 < 2 ? 30 : 0;
        const gridY = y % 24 < 2 ? 30 : 0;
        const grain = (Math.random() - 0.5) * 5;
        nx = 128 + gridX + grain;
        ny = 128 + gridY + grain;
      } else {
        // Fine interlocking jersey knit
        const stipple = (x % 4 === 0 ? 12 : -12) + (y % 4 === 0 ? 12 : -12);
        const grain = (Math.random() - 0.5) * 6;
        nx = 128 + stipple + grain;
        ny = 128 + stipple + grain;
      }

      data[idx] = Math.min(255, Math.max(0, nx));
      data[idx + 1] = Math.min(255, Math.max(0, ny));
      data[idx + 2] = nz;
      data[idx + 3] = 255;
    }
  }
  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(type === 'ripstop' ? 14 : 28, type === 'ripstop' ? 14 : 28);
  texture.generateMipmaps = true;
  return texture;
}

/**
 * Creates soft Gaussian contact shadow for base of stand.
 */
function createContactShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  const gradient = ctx.createRadialGradient(128, 128, 12, 128, 128, 120);
  gradient.addColorStop(0, 'rgba(0, 0, 0, 0.55)');
  gradient.addColorStop(0.3, 'rgba(0, 0, 0, 0.28)');
  gradient.addColorStop(0.65, 'rgba(0, 0, 0, 0.09)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 256, 256);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

/**
 * Builds an editorial bespoke tailor dress form mannequin:
 * - Gunmetal / Dark cast iron tripod stand with telescoping pole and knurled knob
 * - Contoured tailoring torso with linen/plaster finish
 * - Turned ash-wood neck finial / neck cap
 */
function buildEditorialMannequin(disposables: { dispose: () => void }[]): THREE.Group {
  const group = new THREE.Group();

  // Materials
  const ironMat = new THREE.MeshStandardMaterial({
    color: 0x222222,
    roughness: 0.38,
    metalness: 0.88,
  });
  const brassMat = new THREE.MeshStandardMaterial({
    color: 0xc8a46b,
    roughness: 0.32,
    metalness: 0.85,
  });
  const linenMat = new THREE.MeshStandardMaterial({
    color: 0xe8e4dc,
    roughness: 0.88,
    metalness: 0.02,
  });
  const woodMat = new THREE.MeshStandardMaterial({
    color: 0x8a6344,
    roughness: 0.62,
    metalness: 0.08,
  });
  disposables.push(ironMat, brassMat, linenMat, woodMat);

  // 1. Cast Iron Tripod Base
  const baseCenterGeo = new THREE.CylinderGeometry(0.12, 0.14, 0.08, 24);
  disposables.push(baseCenterGeo);
  const baseCenter = new THREE.Mesh(baseCenterGeo, ironMat);
  baseCenter.position.set(0, 0.04, 0);
  baseCenter.receiveShadow = true;
  group.add(baseCenter);

  // 3 Curved Tripod Legs
  for (let i = 0; i < 3; i++) {
    const angle = (i * Math.PI * 2) / 3;
    const legGeo = new THREE.CylinderGeometry(0.024, 0.032, 0.95, 16);
    disposables.push(legGeo);
    const leg = new THREE.Mesh(legGeo, ironMat);
    leg.position.set(Math.sin(angle) * 0.42, 0.16, Math.cos(angle) * 0.42);
    leg.rotation.x = Math.cos(angle) * 0.48;
    leg.rotation.z = -Math.sin(angle) * 0.48;
    leg.castShadow = true;
    group.add(leg);

    // Foot Pad
    const padGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.02, 16);
    disposables.push(padGeo);
    const pad = new THREE.Mesh(padGeo, ironMat);
    pad.position.set(Math.sin(angle) * 0.78, 0.01, Math.cos(angle) * 0.78);
    group.add(pad);
  }

  // 2. Vertical Telescoping Iron Pole
  const poleGeo = new THREE.CylinderGeometry(0.032, 0.032, 1.85, 20);
  disposables.push(poleGeo);
  const pole = new THREE.Mesh(poleGeo, ironMat);
  pole.position.set(0, 0.92, 0);
  pole.castShadow = true;
  group.add(pole);

  // Brass Height Adjustment Collar & Knurled Knob
  const collarGeo = new THREE.CylinderGeometry(0.048, 0.048, 0.09, 20);
  disposables.push(collarGeo);
  const collar = new THREE.Mesh(collarGeo, brassMat);
  collar.position.set(0, 1.15, 0);
  group.add(collar);

  const knobGeo = new THREE.CylinderGeometry(0.022, 0.022, 0.07, 16);
  knobGeo.rotateX(Math.PI / 2);
  disposables.push(knobGeo);
  const knob = new THREE.Mesh(knobGeo, brassMat);
  knob.position.set(0, 1.15, 0.06);
  group.add(knob);

  // 3. Lower Torso Mounting Flange
  const flangeGeo = new THREE.CylinderGeometry(0.09, 0.05, 0.12, 24);
  disposables.push(flangeGeo);
  const flange = new THREE.Mesh(flangeGeo, ironMat);
  flange.position.set(0, 1.48, 0);
  group.add(flange);

  // 4. Haute-Couture Contoured Tailor Torso
  // Pelvis / Lower Hip
  const pelvisGeo = new THREE.CylinderGeometry(0.33, 0.38, 0.34, 36);
  pelvisGeo.scale(1.18, 1, 0.72);
  disposables.push(pelvisGeo);
  const pelvis = new THREE.Mesh(pelvisGeo, linenMat);
  pelvis.position.set(0, 1.62, 0);
  pelvis.castShadow = true;
  group.add(pelvis);

  // Narrow Natural Waist
  const waistGeo = new THREE.CylinderGeometry(0.34, 0.33, 0.44, 36);
  waistGeo.scale(1.14, 1, 0.7);
  disposables.push(waistGeo);
  const waist = new THREE.Mesh(waistGeo, linenMat);
  waist.position.set(0, 1.98, 0);
  waist.castShadow = true;
  group.add(waist);

  // Chest & Upper Torso
  const chestGeo = new THREE.CylinderGeometry(0.44, 0.35, 0.58, 36);
  chestGeo.scale(1.18, 1, 0.74);
  disposables.push(chestGeo);
  const chest = new THREE.Mesh(chestGeo, linenMat);
  chest.position.set(0, 2.44, 0);
  chest.castShadow = true;
  group.add(chest);

  // Sculpted Shoulder Curve
  const shoulderBeamGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.98, 24);
  shoulderBeamGeo.rotateZ(Math.PI / 2);
  disposables.push(shoulderBeamGeo);
  const shoulderBeam = new THREE.Mesh(shoulderBeamGeo, linenMat);
  shoulderBeam.position.set(0, 2.7, 0);
  shoulderBeam.castShadow = true;
  group.add(shoulderBeam);

  // Tailor Neck Base (Brass ring)
  const neckRingGeo = new THREE.CylinderGeometry(0.11, 0.12, 0.04, 24);
  disposables.push(neckRingGeo);
  const neckRing = new THREE.Mesh(neckRingGeo, brassMat);
  neckRing.position.set(0, 2.82, 0);
  group.add(neckRing);

  // Turned Ash-Wood Neck Cap & Architectural Finial
  const neckCapGeo = new THREE.CylinderGeometry(0.09, 0.11, 0.16, 24);
  disposables.push(neckCapGeo);
  const neckCap = new THREE.Mesh(neckCapGeo, woodMat);
  neckCap.position.set(0, 2.92, 0);
  neckCap.castShadow = true;
  group.add(neckCap);

  const finialGeo = new THREE.SphereGeometry(0.08, 20, 20);
  finialGeo.scale(0.85, 1.25, 0.85);
  disposables.push(finialGeo);
  const finial = new THREE.Mesh(finialGeo, woodMat);
  finial.position.set(0, 3.06, 0);
  finial.castShadow = true;
  group.add(finial);

  return group;
}

export function MannequinScene({
  activeGarment,
  onSelectGarment,
  garmentColor = '#B85C3E',
  showAngleControls = true,
  graphicType = 'text',
  graphicUrl,
  customText = 'WOCHA ATELIER',
  customFont = 'grotesk',
  graphicPlacement = 'center-chest',
  graphicScale = 1.0,
  graphicColor,
}: MannequinSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [loaded, setLoaded] = useState(false);

  // References to garment groups and target meshes for decal projection
  const garmentGroupsRef = useRef<{
    hoodie?: THREE.Group;
    tshirt?: THREE.Group;
    puffer?: THREE.Group;
  }>({});

  const targetMeshesRef = useRef<{
    hoodie?: THREE.Mesh;
    tshirt?: THREE.Mesh;
    puffer?: THREE.Mesh;
  }>({});

  const materialsRef = useRef<{
    hoodie?: THREE.MeshPhysicalMaterial;
    tshirt?: THREE.MeshPhysicalMaterial;
    puffer?: THREE.MeshPhysicalMaterial;
  }>({});

  // Active Decal Mesh container
  const decalMeshRef = useRef<THREE.Mesh | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  // Function to recompute and project the decal
  const updateDecal = useCallback(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    // Remove existing decal
    if (decalMeshRef.current) {
      scene.remove(decalMeshRef.current);
      if (decalMeshRef.current.geometry) decalMeshRef.current.geometry.dispose();
      if (decalMeshRef.current.material) {
        if (Array.isArray(decalMeshRef.current.material)) {
          decalMeshRef.current.material.forEach((m) => m.dispose());
        } else {
          decalMeshRef.current.material.dispose();
        }
      }
      decalMeshRef.current = null;
    }

    if (graphicType === 'none') return;

    const targetMesh = targetMeshesRef.current[activeGarment];
    if (!targetMesh) return;

    // Auto-determine contrasting graphic color if not supplied
    let effectiveGraphicColor = graphicColor;
    if (!effectiveGraphicColor) {
      try {
        const c = new THREE.Color(garmentColor);
        // Perceived luminance
        const lum = 0.299 * c.r + 0.587 * c.g + 0.114 * c.b;
        effectiveGraphicColor = lum > 0.5 ? '#111111' : '#FFFFFF';
      } catch {
        effectiveGraphicColor = '#FFFFFF';
      }
    }

    if (graphicType === 'text') {
      const texture = createTextGraphicTexture(
        customText || 'WOCHA ATELIER',
        customFont,
        effectiveGraphicColor
      );

      const decalMesh = createGarmentDecal({
        targetMesh,
        texture,
        placement: graphicPlacement,
        scale: graphicScale,
      });

      if (decalMesh) {
        scene.add(decalMesh);
        decalMeshRef.current = decalMesh;
      }
    } else if (graphicType === 'image' && graphicUrl) {
      createImageGraphicTexture(graphicUrl, (texture) => {
        // Re-check target mesh
        if (!targetMeshesRef.current[activeGarment] || !sceneRef.current) return;
        
        // Remove previous decal if exists
        if (decalMeshRef.current) {
          sceneRef.current.remove(decalMeshRef.current);
          decalMeshRef.current.geometry.dispose();
          decalMeshRef.current = null;
        }

        const decalMesh = createGarmentDecal({
          targetMesh: targetMeshesRef.current[activeGarment]!,
          texture,
          placement: graphicPlacement,
          scale: graphicScale,
        });

        if (decalMesh && sceneRef.current) {
          sceneRef.current.add(decalMesh);
          decalMeshRef.current = decalMesh;
        }
      });
    }
  }, [
    activeGarment,
    graphicType,
    graphicUrl,
    customText,
    customFont,
    graphicPlacement,
    graphicScale,
    graphicColor,
    garmentColor,
  ]);

  // Main Three.js Scene Lifecycle
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const disposables: { dispose: () => void }[] = [];

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#FAFAF8');
    scene.fog = new THREE.Fog('#FAFAF8', 11, 24);
    sceneRef.current = scene;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 2. Camera setup - Architectural studio perspective
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    camera.position.set(0, 2.18, 5.75);
    cameraRef.current = camera;

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;

    container.appendChild(renderer.domElement);

    // 4. Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.target.set(0, 1.95, 0);
    controls.minDistance = 3.2;
    controls.maxDistance = 7.6;
    controls.minPolarAngle = Math.PI / 3.6;
    controls.maxPolarAngle = Math.PI / 2 + 0.04;
    controls.autoRotate = isAutoRotating;
    controls.autoRotateSpeed = 0.7;
    controlsRef.current = controls;

    controls.addEventListener('start', () => {
      setIsAutoRotating(false);
      controls.autoRotate = false;
    });

    // 5. Editorial 3-Point Studio Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
    scene.add(ambientLight);

    // Key Light: Studio Softbox
    const keyLight = new THREE.DirectionalLight(0xfff8f0, 2.05);
    keyLight.position.set(3.8, 6.6, 4.4);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 16;
    keyLight.shadow.camera.left = -2.5;
    keyLight.shadow.camera.right = 2.5;
    keyLight.shadow.camera.top = 4.5;
    keyLight.shadow.camera.bottom = -1.5;
    keyLight.shadow.bias = -0.0004;
    keyLight.shadow.radius = 2.2;
    scene.add(keyLight);

    // Fill Light: Soft Cool Skylight
    const fillLight = new THREE.DirectionalLight(0xe8efff, 0.9);
    fillLight.position.set(-4.5, 4.2, 3.2);
    scene.add(fillLight);

    // Rim / Silhouette Kicker
    const rimLight = new THREE.DirectionalLight(0xffffff, 1.4);
    rimLight.position.set(0, 4.8, -4.2);
    scene.add(rimLight);

    // 6. Studio Floor Pedestal & Soft Contact Shadow
    const pedestalGeo = new THREE.CylinderGeometry(1.68, 1.76, 0.06, 64);
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: 0xeeece5,
      roughness: 0.92,
      metalness: 0.03,
    });
    disposables.push(pedestalGeo, pedestalMat);
    const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestal.position.y = 0.03;
    pedestal.receiveShadow = true;
    scene.add(pedestal);

    // Contact shadow
    const contactTexture = createContactShadowTexture();
    disposables.push(contactTexture);
    const shadowGeo = new THREE.PlaneGeometry(3.6, 3.6);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: contactTexture,
      transparent: true,
      depthWrite: false,
    });
    disposables.push(shadowGeo, shadowMat);
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = 0.002;
    scene.add(shadowMesh);

    // 7. Editorial Bespoke Tailor Mannequin Dress Form
    const mannequinGroup = buildEditorialMannequin(disposables);
    scene.add(mannequinGroup);

    // 8. Photorealistic Garments
    const twillTexture = createProceduralFabricTexture('twill');
    const ripstopTexture = createProceduralFabricTexture('ripstop');
    const jerseyTexture = createProceduralFabricTexture('jersey');
    disposables.push(twillTexture, ripstopTexture, jerseyTexture);

    const initialCol = new THREE.Color(garmentColor);

    // -----------------------------------------------------------------
    // A) 01 HEAVYWEIGHT BOXY HOODIE (480 GSM French Terry)
    // -----------------------------------------------------------------
    const hoodieGroup = new THREE.Group();
    const hoodieMat = new THREE.MeshPhysicalMaterial({
      color: initialCol,
      roughness: 0.86,
      metalness: 0.02,
      sheen: 0.85,
      sheenRoughness: 0.45,
      sheenColor: new THREE.Color(0xffffff),
      normalMap: twillTexture,
      normalScale: new THREE.Vector2(0.25, 0.25),
    });
    const ribMat = new THREE.MeshPhysicalMaterial({
      color: initialCol,
      roughness: 0.92,
      metalness: 0.01,
      sheen: 0.6,
      sheenColor: new THREE.Color(0xffffff),
    });
    disposables.push(hoodieMat, ribMat);

    // Main Torso (Target for Decal)
    const hTorsoGeo = new THREE.CylinderGeometry(0.53, 0.49, 1.18, 48);
    hTorsoGeo.scale(1.24, 1, 0.86);
    disposables.push(hTorsoGeo);
    const hTorso = new THREE.Mesh(hTorsoGeo, hoodieMat);
    hTorso.position.set(0, 2.22, 0);
    hTorso.castShadow = true;
    hTorso.receiveShadow = true;
    hoodieGroup.add(hTorso);

    // Waistband Hem
    const hRibHemGeo = new THREE.CylinderGeometry(0.485, 0.485, 0.14, 48);
    hRibHemGeo.scale(1.22, 1, 0.84);
    disposables.push(hRibHemGeo);
    const hRibHem = new THREE.Mesh(hRibHemGeo, ribMat);
    hRibHem.position.set(0, 1.58, 0);
    hRibHem.castShadow = true;
    hoodieGroup.add(hRibHem);

    // Kangaroo Pocket
    const pocketGeo = new THREE.BoxGeometry(0.64, 0.28, 0.14);
    disposables.push(pocketGeo);
    const pocket = new THREE.Mesh(pocketGeo, hoodieMat);
    pocket.position.set(0, 1.84, 0.38);
    pocket.castShadow = true;
    hoodieGroup.add(pocket);

    // Articulated Dropped Sleeves
    [-1, 1].forEach((side) => {
      const uSleeveGeo = new THREE.CylinderGeometry(0.185, 0.15, 0.65, 28);
      disposables.push(uSleeveGeo);
      const uSleeve = new THREE.Mesh(uSleeveGeo, hoodieMat);
      uSleeve.position.set(side * 0.58, 2.38, 0.02);
      uSleeve.rotation.z = side * 0.18;
      uSleeve.castShadow = true;
      hoodieGroup.add(uSleeve);

      const lSleeveGeo = new THREE.CylinderGeometry(0.148, 0.125, 0.56, 28);
      disposables.push(lSleeveGeo);
      const lSleeve = new THREE.Mesh(lSleeveGeo, hoodieMat);
      lSleeve.position.set(side * 0.64, 1.84, 0.05);
      lSleeve.rotation.z = side * 0.1;
      lSleeve.castShadow = true;
      hoodieGroup.add(lSleeve);

      const cuffGeo = new THREE.CylinderGeometry(0.115, 0.105, 0.12, 24);
      disposables.push(cuffGeo);
      const cuff = new THREE.Mesh(cuffGeo, ribMat);
      cuff.position.set(side * 0.67, 1.56, 0.06);
      cuff.rotation.z = side * 0.08;
      cuff.castShadow = true;
      hoodieGroup.add(cuff);
    });

    // Sculpted Cowl Hood
    const hoodGeo = new THREE.SphereGeometry(0.39, 32, 28, 0, Math.PI * 2, 0, Math.PI * 0.7);
    hoodGeo.scale(1.18, 1.28, 1.08);
    disposables.push(hoodGeo);
    const hood = new THREE.Mesh(hoodGeo, hoodieMat);
    hood.position.set(0, 2.88, -0.16);
    hood.rotation.x = -0.32;
    hood.castShadow = true;
    hoodieGroup.add(hood);

    // Drawstrings with Metal Aglets
    const metalAgletMat = new THREE.MeshStandardMaterial({
      color: 0xdcdcdc,
      metalness: 0.95,
      roughness: 0.2,
    });
    disposables.push(metalAgletMat);

    [-1, 1].forEach((side) => {
      const stringGeo = new THREE.CylinderGeometry(0.011, 0.011, 0.44, 12);
      disposables.push(stringGeo);
      const stringMesh = new THREE.Mesh(
        stringGeo,
        new THREE.MeshStandardMaterial({ color: 0xe5e5e0, roughness: 0.85 })
      );
      stringMesh.position.set(side * 0.13, 2.48, 0.43);
      hoodieGroup.add(stringMesh);

      const agletGeo = new THREE.CylinderGeometry(0.013, 0.013, 0.05, 12);
      disposables.push(agletGeo);
      const agletMesh = new THREE.Mesh(agletGeo, metalAgletMat);
      agletMesh.position.set(side * 0.13, 2.25, 0.43);
      hoodieGroup.add(agletMesh);
    });
    scene.add(hoodieGroup);

    // -----------------------------------------------------------------
    // B) 01 HEAVYWEIGHT BOXY TEE (280 GSM Dry Jersey)
    // -----------------------------------------------------------------
    const tshirtGroup = new THREE.Group();
    const tshirtMat = new THREE.MeshPhysicalMaterial({
      color: initialCol,
      roughness: 0.93,
      metalness: 0.01,
      sheen: 0.35,
      sheenRoughness: 0.7,
      sheenColor: new THREE.Color(0xffffff),
      normalMap: jerseyTexture,
      normalScale: new THREE.Vector2(0.2, 0.2),
    });
    disposables.push(tshirtMat);

    // T-shirt Torso (Target for Decal)
    const tTorsoGeo = new THREE.CylinderGeometry(0.485, 0.455, 1.05, 48);
    tTorsoGeo.scale(1.22, 1, 0.82);
    disposables.push(tTorsoGeo);
    const tTorso = new THREE.Mesh(tTorsoGeo, tshirtMat);
    tTorso.position.set(0, 2.26, 0);
    tTorso.castShadow = true;
    tTorso.receiveShadow = true;
    tshirtGroup.add(tTorso);

    // Ribbed Bound Crewneck Collar
    const tCollarGeo = new THREE.TorusGeometry(0.165, 0.038, 20, 48);
    tCollarGeo.rotateX(Math.PI / 2);
    disposables.push(tCollarGeo);
    const tCollar = new THREE.Mesh(tCollarGeo, ribMat);
    tCollar.position.set(0, 2.76, 0);
    tshirtGroup.add(tCollar);

    // Dropped Short Sleeves
    [-1, 1].forEach((side) => {
      const sGeo = new THREE.CylinderGeometry(0.16, 0.138, 0.46, 32);
      disposables.push(sGeo);
      const sleeve = new THREE.Mesh(sGeo, tshirtMat);
      sleeve.position.set(side * 0.56, 2.48, 0.01);
      sleeve.rotation.z = side * 0.28;
      sleeve.castShadow = true;
      tshirtGroup.add(sleeve);
    });
    scene.add(tshirtGroup);

    // -----------------------------------------------------------------
    // C) 01 BAFFLE QUILTED PUFFER (750 FP Down / Ripstop Nylon)
    // -----------------------------------------------------------------
    const pufferGroup = new THREE.Group();
    const pufferMat = new THREE.MeshPhysicalMaterial({
      color: initialCol,
      roughness: 0.24,
      metalness: 0.15,
      clearcoat: 0.35,
      clearcoatRoughness: 0.25,
      normalMap: ripstopTexture,
      normalScale: new THREE.Vector2(0.3, 0.3),
    });
    disposables.push(pufferMat);

    // Baffle Chambers
    const baffleHeights = [2.66, 2.42, 2.18, 1.94, 1.7];
    const baffleRadii = [0.53, 0.57, 0.56, 0.53, 0.49];

    let pTorsoCenterMesh: THREE.Mesh | undefined;

    baffleHeights.forEach((y, i) => {
      const chamberGeo = new THREE.TorusGeometry(baffleRadii[i], 0.135, 24, 48);
      chamberGeo.scale(1.2, 1, 0.86);
      disposables.push(chamberGeo);
      const chamber = new THREE.Mesh(chamberGeo, pufferMat);
      chamber.position.set(0, y, 0);
      chamber.castShadow = true;
      pufferGroup.add(chamber);

      if (i === 2) {
        pTorsoCenterMesh = chamber;
      }
    });

    // High Storm Collar
    const pCollarGeo = new THREE.CylinderGeometry(0.24, 0.26, 0.34, 36);
    pCollarGeo.scale(1.12, 1, 0.9);
    disposables.push(pCollarGeo);
    const pCollar = new THREE.Mesh(pCollarGeo, pufferMat);
    pCollar.position.set(0, 2.92, -0.02);
    pCollar.castShadow = true;
    pufferGroup.add(pCollar);

    // Quilted Sleeves
    [-1, 1].forEach((side) => {
      [2.56, 2.3, 2.04, 1.78, 1.56].forEach((sy, idx) => {
        const ringGeo = new THREE.TorusGeometry(0.14 - idx * 0.008, 0.075, 18, 30);
        ringGeo.rotateX(Math.PI / 2);
        disposables.push(ringGeo);
        const ring = new THREE.Mesh(ringGeo, pufferMat);
        ring.position.set(side * (0.54 + (2.6 - sy) * 0.09), sy, 0.02);
        ring.rotation.z = side * 0.14;
        ring.castShadow = true;
        pufferGroup.add(ring);
      });
    });
    scene.add(pufferGroup);

    // Save references
    garmentGroupsRef.current = {
      hoodie: hoodieGroup,
      tshirt: tshirtGroup,
      puffer: pufferGroup,
    };

    targetMeshesRef.current = {
      hoodie: hTorso,
      tshirt: tTorso,
      puffer: pTorsoCenterMesh || hTorso,
    };

    materialsRef.current = {
      hoodie: hoodieMat,
      tshirt: tshirtMat,
      puffer: pufferMat,
    };

    // Initial Visibility
    tshirtGroup.visible = activeGarment === 'tshirt';
    hoodieGroup.visible = activeGarment === 'hoodie';
    pufferGroup.visible = activeGarment === 'puffer';

    setLoaded(true);

    // Throttled Animation Loop
    let animationFrameId: number;
    let lastRenderTime = performance.now();
    const targetInterval = 1000 / 60;

    const animate = (currentTime: number) => {
      animationFrameId = requestAnimationFrame(animate);

      const delta = currentTime - lastRenderTime;
      if (delta >= targetInterval) {
        lastRenderTime = currentTime - (delta % targetInterval);
        controls.update();
        renderer.render(scene, camera);
      }
    };
    animationFrameId = requestAnimationFrame(animate);

    // Responsive Resize
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      controls.dispose();
      renderer.dispose();

      disposables.forEach((item) => {
        if ('dispose' in item && typeof item.dispose === 'function') {
          item.dispose();
        }
      });

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Update visibility smoothly when activeGarment changes
  useEffect(() => {
    const { hoodie, tshirt, puffer } = garmentGroupsRef.current;
    if (hoodie) hoodie.visible = activeGarment === 'hoodie';
    if (tshirt) tshirt.visible = activeGarment === 'tshirt';
    if (puffer) puffer.visible = activeGarment === 'puffer';
    updateDecal();
  }, [activeGarment, updateDecal]);

  // Update material colors reactively
  useEffect(() => {
    if (!garmentColor) return;
    try {
      const col = new THREE.Color(garmentColor);
      const { hoodie, tshirt, puffer } = materialsRef.current;
      if (hoodie) hoodie.color.copy(col);
      if (tshirt) tshirt.color.copy(col);
      if (puffer) puffer.color.copy(col);
      updateDecal();
    } catch {
      // ignore invalid color format
    }
  }, [garmentColor, updateDecal]);

  // Trigger decal update whenever graphic attributes change
  useEffect(() => {
    updateDecal();
  }, [updateDecal]);

  const setCameraAngle = (view: 'front' | 'angle' | 'side' | 'back') => {
    if (!cameraRef.current || !controlsRef.current) return;
    controlsRef.current.autoRotate = false;
    setIsAutoRotating(false);

    const radius = 5.75;
    const camY = 2.18;

    switch (view) {
      case 'front':
        cameraRef.current.position.set(0, camY, radius);
        break;
      case 'angle':
        cameraRef.current.position.set(3.8, camY + 0.15, 4.1);
        break;
      case 'side':
        cameraRef.current.position.set(radius, camY, 0);
        break;
      case 'back':
        cameraRef.current.position.set(0, camY, -radius);
        break;
    }
    controlsRef.current.target.set(0, 1.95, 0);
    controlsRef.current.update();
  };

  const handleResetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
      controlsRef.current.target.set(0, 1.95, 0);
    }
  };

  const toggleAutoRotate = () => {
    if (controlsRef.current) {
      const nextState = !isAutoRotating;
      controlsRef.current.autoRotate = nextState;
      setIsAutoRotating(nextState);
    }
  };

  return (
    <div className="relative w-full h-full min-h-[520px] select-none bg-[#FAFAF8]">
      {/* Three.js Canvas Container */}
      <div ref={containerRef} className="w-full h-full" />

      {/* Loading Overlay */}
      {!loaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#FAFAF8] z-20 space-y-3">
          <span className="w-5 h-5 border-2 border-[#111111] border-t-transparent rounded-full animate-spin" />
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#6B6B6B]">
            Initializing Studio Atelier Rig...
          </span>
        </div>
      )}

      {/* Floating Studio Controls */}
      {showAngleControls && loaded && (
        <>
          {/* Top-Right: Camera Orbit & Reset */}
          <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
            <button
              type="button"
              onClick={toggleAutoRotate}
              className={`px-3 py-1.5 text-[11px] font-mono uppercase tracking-wider rounded-lg hairline-border backdrop-blur-md transition-all cursor-pointer shadow-2xs ${
                isAutoRotating
                  ? 'bg-[#111111] text-white'
                  : 'bg-white/80 text-[#111111] hover:bg-white'
              }`}
            >
              {isAutoRotating ? 'Auto Orbit' : 'Orbit Paused'}
            </button>
            <button
              type="button"
              onClick={handleResetCamera}
              className="px-3 py-1.5 text-[11px] font-mono uppercase tracking-wider rounded-lg hairline-border bg-white/80 backdrop-blur-md text-[#111111] hover:bg-white transition-all cursor-pointer shadow-2xs"
            >
              Reset
            </button>
          </div>

          {/* Right Center: Angle Presets */}
          <div className="absolute top-20 right-4 flex flex-col gap-1.5 z-10 bg-white/85 backdrop-blur-md p-1.5 rounded-xl hairline-border shadow-2xs">
            <span className="text-[9px] font-mono text-center text-[#6B6B6B] uppercase tracking-wider mb-0.5">
              Angle
            </span>
            {(['front', 'angle', 'side', 'back'] as const).map((view) => (
              <button
                key={view}
                type="button"
                onClick={() => setCameraAngle(view)}
                className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider rounded-md text-[#111111] hover:bg-[#FAFAF8] transition-colors text-center cursor-pointer"
              >
                {view === 'angle' ? '45°' : view}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Subtle interaction guide */}
      <div className="absolute bottom-4 left-4 pointer-events-none z-10">
        <p className="text-[10px] font-mono text-[#6B6B6B] uppercase tracking-wider bg-white/80 backdrop-blur-md px-2.5 py-1 hairline-border rounded-lg shadow-2xs">
          360° Drag &bull; Scroll Zoom &bull; Curved Decal Active
        </p>
      </div>
    </div>
  );
}
