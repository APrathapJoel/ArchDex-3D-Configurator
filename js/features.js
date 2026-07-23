import * as THREE from 'three';

export const FEATURES = {
  // Exterior Features
  COMPOUND_WALL: 'compound-wall',
  ENTRANCE_GATE: 'entrance-gate',
  GARDEN: 'garden',
  SWIMMING_POOL: 'pool',
  TREES: 'trees',
  GAZEBO: 'gazebo',
  PERGOLA: 'pergola',
  OUTDOOR_SEATING: 'outdoor-seating',
  BASKETBALL_COURT: 'basketball',
  PLAYGROUND: 'playground',
  PARKING: 'parking',
  DRIVEWAY: 'driveway',
  SOLAR_PANELS: 'solar',
  ROOFTOP_GARDEN: 'rooftop-garden',
  FOUNTAIN: 'fountain',
  SECURITY_CABIN: 'security',
  // Building Features
  BALCONY: 'balcony',
  TERRACE: 'terrace',
  GLASS_ROOF: 'glass-roof',
  SMART_LIGHTING: 'smart-lighting',
  GLASS_RAILING: 'glass-railing',
  FACADE_PANELS: 'facade-panels',
  DECORATIVE_LIGHTING: 'decorative-lighting'
};

export const FEATURE_INFO = {
  [FEATURES.COMPOUND_WALL]: { name: 'Compound Wall', description: 'Enclosing boundary wall', icon: '🧱' },
  [FEATURES.ENTRANCE_GATE]: { name: 'Entrance Gate', description: 'Main gate for property', icon: '🚪' },
  [FEATURES.GARDEN]: { name: 'Garden', description: 'Landscaped garden area', icon: '🌷' },
  [FEATURES.SWIMMING_POOL]: { name: 'Swimming Pool', description: 'Outdoor pool', icon: '🏊' },
  [FEATURES.TREES]: { name: 'Trees', description: 'Planted trees around property', icon: '🌲' },
  [FEATURES.GAZEBO]: { name: 'Gazebo', description: 'Shaded seating structure', icon: '⛺' },
  [FEATURES.PERGOLA]: { name: 'Pergola', description: 'Outdoor shaded walkway or seating', icon: '⛩️' },
  [FEATURES.OUTDOOR_SEATING]: { name: 'Outdoor Seating', description: 'Benches and tables', icon: '🪑' },
  [FEATURES.BASKETBALL_COURT]: { name: 'Basketball Court', description: 'Recreational sports court', icon: '🏀' },
  [FEATURES.PLAYGROUND]: { name: 'Playground', description: 'Kids play area with swings', icon: '🛝' },
  [FEATURES.PARKING]: { name: 'Parking', description: 'Designated parking spots', icon: '🅿️' },
  [FEATURES.DRIVEWAY]: { name: 'Driveway', description: 'Paved access path', icon: '🛣️' },
  [FEATURES.SOLAR_PANELS]: { name: 'Solar Panels', description: 'Roof-mounted energy panels', icon: '☀️' },
  [FEATURES.ROOFTOP_GARDEN]: { name: 'Rooftop Garden', description: 'Plants and seating on roof', icon: '🪴' },
  [FEATURES.FOUNTAIN]: { name: 'Water Fountain', description: 'Decorative water feature', icon: '⛲' },
  [FEATURES.SECURITY_CABIN]: { name: 'Security Cabin', description: 'Guard booth at entrance', icon: '👮' },
  [FEATURES.BALCONY]: { name: 'Balcony', description: 'Projecting floor with railing', icon: '🏗️' },
  [FEATURES.TERRACE]: { name: 'Terrace', description: 'Large open outdoor platform', icon: '🌇' },
  [FEATURES.GLASS_ROOF]: { name: 'Glass Roof', description: 'Transparent roof sections', icon: '🪟' },
  [FEATURES.SMART_LIGHTING]: { name: 'Smart Lighting', description: 'Automated LED illumination', icon: '💡' },
  [FEATURES.GLASS_RAILING]: { name: 'Glass Railing', description: 'Modern transparent barriers', icon: '🧊' },
  [FEATURES.FACADE_PANELS]: { name: 'Facade Panels', description: 'Decorative wall claddings', icon: '🏢' },
  [FEATURES.DECORATIVE_LIGHTING]: { name: 'Decorative Lighting', description: 'Aesthetic ambient lights', icon: '✨' }
};

export function getFeatureInfo(featureName) {
  return FEATURE_INFO[featureName] || { name: featureName, description: 'No description available', icon: '❓' };
}

function enableShadows(obj) {
  obj.traverse(child => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
}

function createChildPerson(colorHex = 0xef4444) {
  const group = new THREE.Group();
  const bodyMat = new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.6 });
  const skinMat = new THREE.MeshStandardMaterial({ color: 0xffccaa, roughness: 0.5 });

  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.65, 8), bodyMat);
  body.position.y = 0.325;
  body.castShadow = true;
  group.add(body);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.14, 8, 8), skinMat);
  head.position.y = 0.75;
  head.castShadow = true;
  group.add(head);

  return group;
}

const BUILDING_FOOTPRINTS = {
  'modern-villa': { w: 14, d: 12, h: 4, fz: 6 },
  'contemporary-house': { w: 12, d: 10, h: 9.5, fz: 5 },
  'apartment': { w: 25, d: 12, h: 15, fz: 6 },
  'office-building': { w: 20, d: 15, h: 33, fz: 7.5 },
  'glass-corporate': { w: 18, d: 18, h: 26, fz: 9 },
  'university': { w: 40, d: 25, h: 18, fz: 12.5 },
  'cathedral': { w: 17, d: 28, h: 19, fz: 11 }
};

export function createFeature(featureName, buildingType) {
  const group = new THREE.Group();
  group.userData.featureName = featureName;
  
  const footprint = BUILDING_FOOTPRINTS[buildingType] || { w: 10, d: 10, h: 5, fz: 5 };
  
  // Reusable materials
  const stoneMat = new THREE.MeshStandardMaterial({ color: 0x928E85, roughness: 0.9 });
  const darkMetal = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.7, roughness: 0.4 });
  const woodMat = new THREE.MeshStandardMaterial({ color: 0x8B6914, roughness: 0.8 });
  const roofMat = new THREE.MeshStandardMaterial({ color: 0x8B4513, roughness: 0.7 });
  const leafMat = new THREE.MeshStandardMaterial({ color: 0x2d5a27, roughness: 0.9 });
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x4a3c31, roughness: 0.9 });
  const waterMat = new THREE.MeshPhysicalMaterial({ color: 0x00aaff, transparent: true, opacity: 0.6, transmission: 0.8 });
  const glassMat = new THREE.MeshPhysicalMaterial({ color: 0x88ccff, transparent: true, opacity: 0.3, transmission: 0.9, side: THREE.DoubleSide });
  const asphaltMat = new THREE.MeshStandardMaterial({ color: 0x444444, roughness: 0.9 });
  const concreteMat = new THREE.MeshStandardMaterial({ color: 0x666666, roughness: 0.9 });
  const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 });
  const sandMat = new THREE.MeshStandardMaterial({ color: 0xF4D03F, roughness: 0.9 });
  const cyanEmissive = new THREE.MeshStandardMaterial({ color: 0x00d4ff, emissive: 0x00d4ff, emissiveIntensity: 0.8 });
  const warmEmissive = new THREE.MeshStandardMaterial({ color: 0xFFE4B5, emissive: 0xFFE4B5, emissiveIntensity: 0.8 });
  
  const cw = 125, cd = 100; // Compound wall dims (2.5× expanded plot)

  switch(featureName) {
    case FEATURES.COMPOUND_WALL: {
      const ch = 1.8, ct = 0.25;
      
      const leftW = new THREE.Mesh(new THREE.BoxGeometry(ct, ch, cd), stoneMat);
      leftW.position.set(-cw/2, ch/2, 0);
      group.add(leftW);
      
      const rightW = new THREE.Mesh(new THREE.BoxGeometry(ct, ch, cd), stoneMat);
      rightW.position.set(cw/2, ch/2, 0);
      group.add(rightW);
      
      const backW = new THREE.Mesh(new THREE.BoxGeometry(cw, ch, ct), stoneMat);
      backW.position.set(0, ch/2, -cd/2);
      group.add(backW);
      
      const frontL = new THREE.Mesh(new THREE.BoxGeometry((cw-6)/2, ch, ct), stoneMat);
      frontL.position.set(-cw/4 - 1.5, ch/2, cd/2);
      group.add(frontL);
      
      const frontR = new THREE.Mesh(new THREE.BoxGeometry((cw-6)/2, ch, ct), stoneMat);
      frontR.position.set(cw/4 + 1.5, ch/2, cd/2);
      group.add(frontR);
      
      // Caps
      const capGeo = new THREE.BoxGeometry(ct+0.05, 0.1, cd+0.05);
      const capL = new THREE.Mesh(capGeo, concreteMat);
      capL.position.set(-cw/2, ch + 0.05, 0);
      group.add(capL);
      const capR = new THREE.Mesh(capGeo, concreteMat);
      capR.position.set(cw/2, ch + 0.05, 0);
      group.add(capR);
      const capBackGeo = new THREE.BoxGeometry(cw+0.05, 0.1, ct+0.05);
      const capB = new THREE.Mesh(capBackGeo, concreteMat);
      capB.position.set(0, ch + 0.05, -cd/2);
      group.add(capB);
      break;
    }
    case FEATURES.ENTRANCE_GATE: {
      const zPos = cd/2;
      const pilGeo = new THREE.BoxGeometry(0.6, 2.5, 0.6);
      const p1 = new THREE.Mesh(pilGeo, stoneMat);
      p1.position.set(-3, 1.25, zPos);
      const p2 = new THREE.Mesh(pilGeo, stoneMat);
      p2.position.set(3, 1.25, zPos);
      group.add(p1, p2);
      
      const barGeo = new THREE.BoxGeometry(3, 2, 0.08);
      const b1 = new THREE.Mesh(barGeo, darkMetal);
      b1.position.set(-1.5, 1.2, zPos);
      const b2 = new THREE.Mesh(barGeo, darkMetal);
      b2.position.set(1.5, 1.2, zPos);
      group.add(b1, b2);
      break;
    }
    case FEATURES.GARDEN: {
      const positions = [
        { x: footprint.w/2 + 8, z: 0 },
        { x: -(footprint.w/2 + 10), z: 5 },
        { x: footprint.w/2 + 6, z: -footprint.d/2 - 5 },
        { x: -(footprint.w/2 + 6), z: -footprint.d/2 - 8 }
      ];
      positions.forEach(pos => {
        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.3, 2), trunkMat);
        trunk.position.set(pos.x, 1, pos.z);
        const leaves = new THREE.Mesh(new THREE.SphereGeometry(1.5), leafMat);
        leaves.position.set(pos.x, 2.5, pos.z);
        group.add(trunk, leaves);
      });
      for(let i=0; i<6; i++) {
        const bush = new THREE.Mesh(new THREE.SphereGeometry(Math.random()*0.5 + 0.5), leafMat);
        bush.position.set((Math.random()-0.5)*cw*0.8, 0.5, (Math.random()-0.5)*cd*0.8);
        group.add(bush);
      }
      break;
    }
    case FEATURES.SWIMMING_POOL: {
      const pW = 8, pD = 4;
      const basin = new THREE.Mesh(new THREE.BoxGeometry(pW, 0.2, pD), concreteMat);
      basin.position.set(0, 0.1, footprint.fz + 3 + pD/2);
      const water = new THREE.Mesh(new THREE.BoxGeometry(pW-0.4, 0.18, pD-0.4), waterMat);
      water.position.set(0, 0.12, footprint.fz + 3 + pD/2);
      group.add(basin, water);
      break;
    }
    case FEATURES.TREES: {
      for(let i=0; i<8; i++) {
        const px = (Math.random()-0.5)*cw*0.9;
        const pz = (Math.random()-0.5)*cd*0.9;
        if(Math.abs(px) < footprint.w/2+2 && Math.abs(pz) < footprint.d/2+2) continue; // avoid building
        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.3, 2.5), trunkMat);
        trunk.position.set(px, 1.25, pz);
        const isConifer = Math.random() > 0.5;
        const canopy = new THREE.Mesh(
          isConifer ? new THREE.ConeGeometry(1.5, 4, 8) : new THREE.SphereGeometry(1.8),
          leafMat
        );
        canopy.position.set(px, isConifer ? 3.5 : 3, pz);
        group.add(trunk, canopy);
      }
      break;
    }
    case FEATURES.GAZEBO: {
      const gX = footprint.w/2 + 15, gZ = 0;
      const floor = new THREE.Mesh(new THREE.CylinderGeometry(3, 3, 0.1, 8), woodMat);
      floor.position.set(gX, 0.05, gZ);
      const roof = new THREE.Mesh(new THREE.CylinderGeometry(3, 3, 0.5, 8), roofMat);
      roof.position.set(gX, 3.25, gZ);
      group.add(floor, roof);
      for(let i=0; i<8; i++) {
        const angle = (i * Math.PI * 2) / 8;
        const post = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 3, 8), woodMat);
        post.position.set(gX + Math.cos(angle)*2.8, 1.5, gZ + Math.sin(angle)*2.8);
        group.add(post);
      }
      break;
    }
    case FEATURES.PERGOLA: {
      const pX = -footprint.w/2 - 12, pZ = 5;
      for(let i=0; i<4; i++) {
        const post = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 2.5, 8), woodMat);
        post.position.set(pX + (i%2==0?-2:2), 1.25, pZ + (i<2?-1.5:1.5));
        group.add(post);
      }
      for(let i=0; i<5; i++) {
        const beam = new THREE.Mesh(new THREE.BoxGeometry(4, 0.1, 0.1), woodMat);
        beam.position.set(pX, 2.55, pZ - 1.5 + (i*0.75));
        group.add(beam);
      }
      const side1 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 3), woodMat);
      side1.position.set(pX - 2, 2.45, pZ);
      const side2 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 3), woodMat);
      side2.position.set(pX + 2, 2.45, pZ);
      group.add(side1, side2);
      break;
    }
    case FEATURES.OUTDOOR_SEATING: {
      const sX = 6, sZ = footprint.fz + 5;
      const tTop = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.05, 12), woodMat);
      tTop.position.set(sX, 0.7, sZ);
      const tLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.7, 12), darkMetal);
      tLeg.position.set(sX, 0.35, sZ);
      group.add(tTop, tLeg);
      for(let i=0; i<3; i++) {
        const angle = (i * Math.PI * 2) / 3;
        const seat = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.05, 0.6), woodMat);
        seat.position.set(sX + Math.cos(angle)*1.5, 0.4, sZ + Math.sin(angle)*1.5);
        group.add(seat);
      }
      break;
    }
    case FEATURES.BASKETBALL_COURT: {
      const cX = footprint.w/2 + 20, cZ = -footprint.d/2;
      const court = new THREE.Mesh(new THREE.BoxGeometry(6, 0.03, 12), new THREE.MeshStandardMaterial({color: 0xCD853F}));
      court.position.set(cX, 0.015, cZ);
      const cLine = new THREE.Mesh(new THREE.BoxGeometry(6, 0.035, 0.05), whiteMat);
      cLine.position.set(cX, 0.018, cZ);
      group.add(court, cLine);
      
      const hoopGroup = (zOffset) => {
        const p = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 3), darkMetal);
        p.position.set(cX, 1.5, cZ + zOffset);
        const bb = new THREE.Mesh(new THREE.BoxGeometry(1, 0.8, 0.05), whiteMat);
        bb.position.set(cX, 2.6, cZ + zOffset + (zOffset>0?-0.2:0.2));
        const rim = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.02, 4, 12), new THREE.MeshStandardMaterial({color: 0xff0000}));
        rim.rotation.x = Math.PI/2;
        rim.position.set(cX, 2.4, cZ + zOffset + (zOffset>0?-0.5:0.5));
        group.add(p, bb, rim);
      };
      hoopGroup(5.5);
      hoopGroup(-5.5);
      break;
    }
    case FEATURES.PLAYGROUND: {
      const px = -footprint.w/2 - 20, pz = -footprint.d/2;

      // 1. Enormous Play Pit Foundation (18m x 14m Safety Turf & Sand Base)
      const turfMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.8 });
      const sandPitMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.9 });
      const borderMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.7 });

      const baseArea = new THREE.Mesh(new THREE.BoxGeometry(18, 0.08, 14), turfMat);
      baseArea.position.set(px, 0.04, pz);
      baseArea.receiveShadow = true;
      group.add(baseArea);

      // Sand Pit Zone inside turf
      const sandZone = new THREE.Mesh(new THREE.BoxGeometry(8, 0.1, 8), sandPitMat);
      sandZone.position.set(px - 4, 0.05, pz - 2);
      sandZone.receiveShadow = true;
      group.add(sandZone);

      // Wooden border surround
      for (let sideZ of [-7, 7]) {
        const b1 = new THREE.Mesh(new THREE.BoxGeometry(18.4, 0.2, 0.3), borderMat);
        b1.position.set(px, 0.1, pz + sideZ);
        group.add(b1);
      }
      for (let sideX of [-9, 9]) {
        const b2 = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.2, 14.4), borderMat);
        b2.position.set(px + sideX, 0.1, pz);
        group.add(b2);
      }

      // Reusable materials
      const pillarMat = new THREE.MeshStandardMaterial({ color: 0x2563eb });
      const roofMat1 = new THREE.MeshStandardMaterial({ color: 0xef4444 });
      const roofMat2 = new THREE.MeshStandardMaterial({ color: 0x8b5cf6 });
      const woodDeckMat = new THREE.MeshStandardMaterial({ color: 0xd97706 });
      const slideMat1 = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.3 });
      const slideMat2 = new THREE.MeshStandardMaterial({ color: 0x06b6d4, roughness: 0.3 });

      // 2. GIANT TWIN-TOWER ADVENTURE FORT
      // Tower A (Main Left Castle)
      const tA_X = px - 5, tA_Z = pz - 2;
      const deckA = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.1, 2.4), woodDeckMat);
      deckA.position.set(tA_X, 1.8, tA_Z);
      deckA.castShadow = true;
      group.add(deckA);

      for (let dx of [-1.1, 1.1]) {
        for (let dz of [-1.1, 1.1]) {
          const post = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 3.6, 8), pillarMat);
          post.position.set(tA_X + dx, 1.8, tA_Z + dz);
          post.castShadow = true;
          group.add(post);
        }
      }
      const roofA = new THREE.Mesh(new THREE.ConeGeometry(2.0, 1.4, 4), roofMat1);
      roofA.rotation.y = Math.PI / 4;
      roofA.position.set(tA_X, 4.3, tA_Z);
      roofA.castShadow = true;
      group.add(roofA);

      // Tower B (Right Castle)
      const tB_X = px - 1, tB_Z = pz - 2;
      const deckB = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.1, 2.2), woodDeckMat);
      deckB.position.set(tB_X, 1.5, tB_Z);
      deckB.castShadow = true;
      group.add(deckB);

      for (let dx of [-1.0, 1.0]) {
        for (let dz of [-1.0, 1.0]) {
          const post = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 3.2, 8), new THREE.MeshStandardMaterial({ color: 0xeab308 }));
          post.position.set(tB_X + dx, 1.6, tB_Z + dz);
          post.castShadow = true;
          group.add(post);
        }
      }
      const roofB = new THREE.Mesh(new THREE.ConeGeometry(1.8, 1.2, 4), roofMat2);
      roofB.rotation.y = Math.PI / 4;
      roofB.position.set(tB_X, 3.8, tB_Z);
      roofB.castShadow = true;
      group.add(roofB);

      // Connecting Suspension Bridge between Tower A and Tower B
      const bridge = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.08, 0.9), woodDeckMat);
      bridge.position.set((tA_X + tB_X) / 2, 1.65, tA_Z);
      bridge.castShadow = true;
      group.add(bridge);

      for (let sideZ of [-0.45, 0.45]) {
        const rope = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.8), roofMat1);
        rope.rotation.z = Math.PI / 2;
        rope.position.set((tA_X + tB_X) / 2, 2.05, tA_Z + sideZ);
        group.add(rope);
      }

      // Slide 1: Giant Yellow Slide on Tower A
      const slide1 = new THREE.Group();
      const sRamp1 = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.06, 3.2), slideMat1);
      sRamp1.rotation.x = -Math.PI / 5;
      sRamp1.position.set(0, 0.9, 1.3);
      sRamp1.castShadow = true;
      slide1.add(sRamp1);
      for (let rx of [-0.45, 0.45]) {
        const rail = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.28, 3.2), roofMat1);
        rail.rotation.x = -Math.PI / 5;
        rail.position.set(rx, 1.0, 1.3);
        slide1.add(rail);
      }
      slide1.position.set(tA_X, 0.3, tA_Z + 1.0);
      group.add(slide1);

      // Slide 2: Blue Speed Slide on Tower B
      const slide2 = new THREE.Group();
      const sRamp2 = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.06, 2.6), slideMat2);
      sRamp2.rotation.x = -Math.PI / 5;
      sRamp2.position.set(0, 0.7, 1.1);
      sRamp2.castShadow = true;
      slide2.add(sRamp2);
      slide2.position.set(tB_X, 0.3, tB_Z + 1.0);
      group.add(slide2);

      // Rock Climbing Wall on Tower A side
      const rockWall = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.0, 0.08), woodDeckMat);
      rockWall.rotation.x = Math.PI / 10;
      rockWall.position.set(tA_X - 1.2, 0.9, tA_Z);
      group.add(rockWall);

      const gripColors = [0xef4444, 0x10b981, 0x3b82f6, 0xfacc15, 0xec4899];
      for (let i = 0; i < 8; i++) {
        const grip = new THREE.Mesh(new THREE.SphereGeometry(0.08, 6, 6), new THREE.MeshStandardMaterial({ color: gripColors[i % gripColors.length] }));
        const gx = tA_X - 1.2 + (i % 2 === 0 ? -0.3 : 0.3);
        const gy = 0.3 + Math.floor(i / 2) * 0.4;
        grip.position.set(gx, gy, tA_Z + (gy * 0.3));
        group.add(grip);
      }

      // 3. EXPANDED 4-SWING SET (Right Side)
      const swX = px + 4.5, swZ = pz - 2;
      const swingFrameMat = new THREE.MeshStandardMaterial({ color: 0x10b981 });
      const seatMat = new THREE.MeshStandardMaterial({ color: 0x1e293b });

      // Posts
      const pL1 = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 3.2, 8), swingFrameMat);
      pL1.rotation.z = 0.22;
      pL1.position.set(swX - 3.2, 1.5, swZ - 1.2);
      const pL2 = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 3.2, 8), swingFrameMat);
      pL2.rotation.z = -0.22;
      pL2.position.set(swX - 3.2, 1.5, swZ + 1.2);

      const pR1 = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 3.2, 8), swingFrameMat);
      pR1.rotation.z = 0.22;
      pR1.position.set(swX + 3.2, 1.5, swZ - 1.2);
      const pR2 = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 3.2, 8), swingFrameMat);
      pR2.rotation.z = -0.22;
      pR2.position.set(swX + 3.2, 1.5, swZ + 1.2);

      const swBar = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 6.8, 8), swingFrameMat);
      swBar.rotation.z = Math.PI / 2;
      swBar.position.set(swX, 3.0, swZ);
      group.add(pL1, pL2, pR1, pR2, swBar);

      // 4 Swings
      const swOffsets = [-2.1, -0.7, 0.7, 2.1];
      swOffsets.forEach((off, idx) => {
        for (let cx of [-0.25, 0.25]) {
          const chain = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 2.3), seatMat);
          chain.position.set(swX + off + cx, 1.8, swZ);
          group.add(chain);
        }
        if (idx === 1) {
          const bucket = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.22, 0.35, 12), new THREE.MeshStandardMaterial({ color: 0xef4444 }));
          bucket.position.set(swX + off, 0.75, swZ);
          group.add(bucket);
        } else {
          const seat = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.04, 0.26), seatMat);
          seat.position.set(swX + off, 0.65, swZ);
          seat.castShadow = true;
          group.add(seat);
        }
      });

      // 4. SPINNING CAROUSEL / MERRY-GO-ROUND
      const carX = px - 4, carZ = pz + 3.5;
      const carBase = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 1.8, 0.1, 16), new THREE.MeshStandardMaterial({ color: 0x06b6d4, roughness: 0.5 }));
      carBase.position.set(carX, 0.1, carZ);
      group.add(carBase);

      const centerPole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.2, 8), roofMat1);
      centerPole.position.set(carX, 0.6, carZ);
      group.add(centerPole);

      const wheelTop = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.03, 8, 16), slideMat1);
      wheelTop.rotation.x = Math.PI / 2;
      wheelTop.position.set(carX, 1.1, carZ);
      group.add(wheelTop);

      for (let a = 0; a < 4; a++) {
        const ang = (a / 4) * Math.PI * 2;
        const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.9, 8), roofMat1);
        handle.position.set(carX + Math.cos(ang) * 1.2, 0.55, carZ + Math.sin(ang) * 1.2);
        group.add(handle);
      }

      // 5. SUNKEN TRAMPOLINE
      const trampX = px + 4, trampZ = pz + 3.5;
      const trampPad = new THREE.Mesh(new THREE.CylinderGeometry(2.0, 2.0, 0.12, 24), new THREE.MeshStandardMaterial({ color: 0x2563eb }));
      trampPad.position.set(trampX, 0.06, trampZ);
      const trampMat = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, 0.14, 24), new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9 }));
      trampMat.position.set(trampX, 0.07, trampZ);
      group.add(trampPad, trampMat);

      // 6. DOUBLE SEESAW (Center-Front)
      for (let sOff of [-1.2, 1.2]) {
        const seeX = px + sOff, seeZ = pz + 4.5;
        const fulcrum = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.5, 4), pillarMat);
        fulcrum.position.set(seeX, 0.25, seeZ);
        const plank = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.05, 0.3), woodDeckMat);
        plank.rotation.z = sOff < 0 ? 0.18 : -0.18;
        plank.position.set(seeX, 0.55, seeZ);
        plank.castShadow = true;
        group.add(fulcrum, plank);

        for (let sx of [-1.1, 1.1]) {
          const sSeat = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.04, 0.3), roofMat1);
          sSeat.position.set(seeX + sx, 0.55 + (sx < 0 ? (sOff<0?-0.18:0.18) : (sOff<0?0.18:-0.18)), seeZ);
          group.add(sSeat);
        }
      }

      // 7. CRAWL TUNNELS & SPRING BOUNCERS
      const tunX = px - 7, tunZ = pz + 2;
      const tunnel = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 1.8, 16, 1, true), new THREE.MeshStandardMaterial({ color: 0xf97316, side: THREE.DoubleSide }));
      tunnel.rotation.z = Math.PI / 2;
      tunnel.position.set(tunX, 0.65, tunZ);
      group.add(tunnel);

      // Spring Riders (Bouncers)
      for (let bOff of [-1, 1]) {
        const sprX = px - 7 + bOff * 1.5, sprZ = pz - 5;
        const spring = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.45, 8), new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.8 }));
        spring.position.set(sprX, 0.225, sprZ);
        const riderAnimal = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.4, 0.3), new THREE.MeshStandardMaterial({ color: bOff < 0 ? 0xef4444 : 0x3b82f6 }));
        riderAnimal.position.set(sprX, 0.55, sprZ);
        group.add(spring, riderAnimal);
      }

      // 8. PARENTS PICNIC PAVILION & BENCHES
      const picX = px + 6.5, picZ = pz - 4.5;
      const picnicTable = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.08, 0.9), woodDeckMat);
      picnicTable.position.set(picX, 0.7, picZ);
      picnicTable.castShadow = true;
      group.add(picnicTable);

      for (let pzOff of [-0.65, 0.65]) {
        const pBench = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.06, 0.3), woodDeckMat);
        pBench.position.set(picX, 0.4, picZ + pzOff);
        group.add(pBench);
      }

      // Colorful Sun Umbrella over Picnic Table
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.4, 8), pillarMat);
      pole.position.set(picX, 1.2, picZ);
      const umbrella = new THREE.Mesh(new THREE.ConeGeometry(1.6, 0.6, 8), new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.4 }));
      umbrella.position.set(picX, 2.3, picZ);
      group.add(pole, umbrella);

      // 9. CHILD FIGURES PLAYING
      const kid1 = createChildPerson(0xef4444);
      kid1.position.set(tA_X, 1.1, tA_Z + 1.8);
      group.add(kid1);

      const kid2 = createChildPerson(0x3b82f6);
      kid2.position.set(swX - 0.7, 0.6, swZ);
      group.add(kid2);

      const kid3 = createChildPerson(0x10b981);
      kid3.position.set(carX + 0.8, 0.15, carZ);
      group.add(kid3);

      break;
    }
    case FEATURES.PARKING: {
      const pkX = footprint.w/2 + 20, pkZ = footprint.fz + 5;
      const pSurf = new THREE.Mesh(new THREE.BoxGeometry(10, 0.02, 15), asphaltMat);
      pSurf.position.set(pkX, 0.01, pkZ);
      group.add(pSurf);
      for(let i=0; i<5; i++) {
        const line = new THREE.Mesh(new THREE.BoxGeometry(4, 0.025, 0.1), whiteMat);
        line.position.set(pkX, 0.012, pkZ - 6 + i*3);
        group.add(line);
      }
      break;
    }
    case FEATURES.DRIVEWAY: {
      const drive = new THREE.Mesh(new THREE.BoxGeometry(4, 0.02, 20), concreteMat);
      drive.position.set(0, 0.01, footprint.fz + 10);
      group.add(drive);
      break;
    }
    case FEATURES.SOLAR_PANELS: {
      const solarCellMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9, roughness: 0.2 });
      const solarFrameMat = new THREE.MeshStandardMaterial({ color: 0xc0c0c0, metalness: 0.8, roughness: 0.3 });
      const rackLegMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.7, roughness: 0.5 });

      const roofY = footprint.h;
      
      // 3x3 Solar Panel Grid Array
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          const panelGroup = new THREE.Group();

          // Silver Outer Frame
          const frame = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.06, 1.6), solarFrameMat);
          frame.castShadow = true;
          panelGroup.add(frame);

          // Deep Blue Silicon Solar Cells Surface
          const cellSurface = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.07, 1.5), solarCellMat);
          cellSurface.position.y = 0.01;
          panelGroup.add(cellSurface);

          // Grid lines on panel
          for (let g = -0.6; g <= 0.6; g += 0.4) {
            const lineV = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.08, 1.48), solarFrameMat);
            lineV.position.set(g, 0.01, 0);
            panelGroup.add(lineV);
          }

          // Metal Support Legs
          const leg1 = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.6, 8), rackLegMat);
          leg1.position.set(-0.8, -0.25, -0.6);
          const leg2 = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.3, 8), rackLegMat);
          leg2.position.set(-0.8, -0.12, 0.6);
          const leg3 = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.6, 8), rackLegMat);
          leg3.position.set(0.8, -0.25, -0.6);
          const leg4 = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.3, 8), rackLegMat);
          leg4.position.set(0.8, -0.12, 0.6);
          panelGroup.add(leg1, leg2, leg3, leg4);

          // Tilt 18 degrees South towards sun
          panelGroup.rotation.x = Math.PI / 10;
          panelGroup.position.set(i * 2.6, roofY + 0.45, j * 2.2);

          group.add(panelGroup);
        }
      }
      break;
    }
    case FEATURES.ROOFTOP_GARDEN: {
      const FLAT_ROOF_BUILDINGS = ['modern-villa', 'apartment', 'office-building', 'glass-corporate', 'university'];
      // Rooftop gardens are only permitted on flat open roofs (disallowed on gothic cathedral or pitched house roofs)
      if (!FLAT_ROOF_BUILDINGS.includes(buildingType)) {
        break;
      }

      const roofY = footprint.h;
      for (let i = 0; i < 3; i++) {
        const planter = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.5, 1.5), woodMat);
        planter.position.set(i * 3.6 - 3.6, roofY + 0.25, 0);
        planter.castShadow = true;

        const soil = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.05, 1.3), new THREE.MeshStandardMaterial({ color: 0x3e2723 }));
        soil.position.set(i * 3.6 - 3.6, roofY + 0.51, 0);

        const bush = new THREE.Mesh(new THREE.SphereGeometry(0.65, 8, 8), leafMat);
        bush.position.set(i * 3.6 - 3.6, roofY + 0.9, 0);
        bush.castShadow = true;

        group.add(planter, soil, bush);
      }
      break;
    }
    case FEATURES.FOUNTAIN: {
      const fX = 0, fZ = footprint.fz + 10;
      const basin = new THREE.Mesh(new THREE.CylinderGeometry(2.5, 2.5, 0.5, 24), stoneMat);
      basin.position.set(fX, 0.25, fZ);
      const water = new THREE.Mesh(new THREE.CylinderGeometry(2.3, 2.3, 0.05, 24), waterMat);
      water.position.set(fX, 0.45, fZ);
      const col = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 1.5, 8), stoneMat);
      col.position.set(fX, 1, fZ);
      const topP = new THREE.Mesh(new THREE.SphereGeometry(0.4, 8, 8), stoneMat);
      topP.position.set(fX, 1.9, fZ);
      group.add(basin, water, col, topP);
      break;
    }
    case FEATURES.SECURITY_CABIN: {
      const scX = 8, scZ = cd/2 - 4;

      // 1. Concrete Pad Foundation
      const padMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.8 });
      const pad = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.1, 4.2), padMat);
      pad.position.set(scX, 0.05, scZ);
      pad.receiveShadow = true;
      group.add(pad);

      // 2. Modern Glass & Charcoal Security Cabin Body
      const cabinWallMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4 });
      const roofMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3 });

      const cabin = new THREE.Mesh(new THREE.BoxGeometry(2.6, 2.6, 2.6), cabinWallMat);
      cabin.position.set(scX, 1.35, scZ);
      cabin.castShadow = true;
      cabin.receiveShadow = true;
      group.add(cabin);

      // Wrap-around Windows
      const winFront = new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.1, 0.08), glassMat);
      winFront.position.set(scX, 1.6, scZ + 1.28);
      const winLeft = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.1, 1.8), glassMat);
      winLeft.position.set(scX - 1.28, 1.6, scZ);
      const winRight = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.1, 1.8), glassMat);
      winRight.position.set(scX + 1.28, 1.6, scZ);
      group.add(winFront, winLeft, winRight);

      // Sleek Overhang Roof & LED Trim
      const roofOverhang = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.18, 3.2), roofMat);
      roofOverhang.position.set(scX, 2.74, scZ);
      roofOverhang.castShadow = true;
      group.add(roofOverhang);

      const ledTrim = new THREE.Mesh(new THREE.BoxGeometry(3.1, 0.05, 0.05), new THREE.MeshStandardMaterial({
        color: 0x38bdf8, emissive: 0x38bdf8, emissiveIntensity: 0.8
      }));
      ledTrim.position.set(scX, 2.63, scZ + 1.55);
      group.add(ledTrim);

      // CCTV Camera Dome
      const camMount = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.3, 8), darkMetal);
      camMount.position.set(scX - 1.3, 2.5, scZ + 1.3);
      const camDome = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 12), new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.9 }));
      camDome.position.set(scX - 1.3, 2.35, scZ + 1.3);
      group.add(camMount, camDome);

      // 3. Automated Entrance Boom Barrier Gate
      const barrierGroup = new THREE.Group();
      const housingMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.5 });
      const armMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });

      const housing = new THREE.Mesh(new THREE.BoxGeometry(0.4, 1.2, 0.4), housingMat);
      housing.position.set(scX - 2.2, 0.6, scZ + 1.2);
      housing.castShadow = true;
      barrierGroup.add(housing);

      const signalLED = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), new THREE.MeshStandardMaterial({ color: 0x22c55e, emissive: 0x22c55e, emissiveIntensity: 0.9 }));
      signalLED.position.set(scX - 2.2, 1.15, scZ + 1.42);
      barrierGroup.add(signalLED);

      const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 3.8, 12), armMat);
      arm.rotation.z = Math.PI / 2;
      arm.position.set(scX - 4.1, 0.95, scZ + 1.2);
      arm.castShadow = true;
      barrierGroup.add(arm);

      for (let s = 0; s < 4; s++) {
        const stripe = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.042, 0.3, 12), new THREE.MeshStandardMaterial({ color: 0xef4444 }));
        stripe.rotation.z = Math.PI / 2;
        stripe.position.set(scX - 2.6 - s * 0.8, 0.95, scZ + 1.2);
        barrierGroup.add(stripe);
      }
      group.add(barrierGroup);

      // 4. Uniformed Guard Figure
      const guardGroup = new THREE.Group();
      const uniformMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a });
      const skinMat = new THREE.MeshStandardMaterial({ color: 0xffccaa });
      const capMat = new THREE.MeshStandardMaterial({ color: 0x0f172a });

      const guardBody = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.95, 8), uniformMat);
      guardBody.position.y = 0.475;
      guardBody.castShadow = true;
      guardGroup.add(guardBody);

      const guardHead = new THREE.Mesh(new THREE.SphereGeometry(0.16, 8, 8), skinMat);
      guardHead.position.y = 1.05;
      guardGroup.add(guardHead);

      const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.08, 8), capMat);
      cap.position.y = 1.18;
      const visor = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.02, 0.12), capMat);
      visor.position.set(0, 1.15, 0.12);
      guardGroup.add(cap, visor);

      guardGroup.position.set(scX - 1.2, 0.1, scZ + 1.6);
      group.add(guardGroup);

      // 5. Traffic Cones
      for (let c = 0; c < 2; c++) {
        const cone = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.45, 8), new THREE.MeshStandardMaterial({ color: 0xf97316 }));
        cone.position.set(scX - 2.0 - c * 0.6, 0.225, scZ + 2.0);
        cone.castShadow = true;
        group.add(cone);
      }
      break;
    }
    case FEATURES.BALCONY: {
      const bY = footprint.h > 8 ? 4 : footprint.h - 1;
      const slab = new THREE.Mesh(new THREE.BoxGeometry(6, 0.2, 2), concreteMat);
      slab.position.set(0, bY, footprint.fz + 1);
      const rail = new THREE.Mesh(new THREE.BoxGeometry(6, 1, 0.1), glassMat);
      rail.position.set(0, bY + 0.6, footprint.fz + 1.95);
      group.add(slab, rail);
      break;
    }
    case FEATURES.TERRACE: {
      const tY = footprint.h > 10 ? footprint.h / 2 : footprint.h;
      const plat = new THREE.Mesh(new THREE.BoxGeometry(8, 0.15, 5), concreteMat);
      plat.position.set(footprint.w/2 + 2, tY, 0);
      group.add(plat);
      break;
    }
    case FEATURES.GLASS_ROOF: {
      const groof = new THREE.Mesh(new THREE.BoxGeometry(footprint.w - 2, 0.5, footprint.d - 2), glassMat);
      groof.position.set(0, footprint.h + 0.25, 0);
      const frame = new THREE.Mesh(new THREE.BoxGeometry(footprint.w - 1.8, 0.6, footprint.d - 1.8), darkMetal);
      frame.position.set(0, footprint.h + 0.25, 0);
      group.add(frame, groof);
      break;
    }
    case FEATURES.SMART_LIGHTING: {
      const strip1 = new THREE.Mesh(new THREE.BoxGeometry(footprint.w + 0.2, 0.1, 0.1), cyanEmissive);
      strip1.position.set(0, footprint.h - 0.1, footprint.fz + 0.05);
      group.add(strip1);
      const pl1 = new THREE.PointLight(0x00d4ff, 0.3, 5);
      pl1.position.set(0, footprint.h + 1, footprint.fz + 1);
      group.add(pl1);
      break;
    }
    case FEATURES.GLASS_RAILING: {
      const railG = new THREE.Mesh(new THREE.BoxGeometry(footprint.w, 1.2, 0.1), glassMat);
      railG.position.set(0, footprint.h + 0.6, footprint.d/2);
      group.add(railG);
      break;
    }
    case FEATURES.FACADE_PANELS: {
      for(let i=0; i<3; i++) {
        const pan = new THREE.Mesh(new THREE.BoxGeometry(2, footprint.h - 1, 0.2), panelMat);
        pan.position.set((i-1)*4, footprint.h/2, footprint.fz + 0.1);
        group.add(pan);
      }
      break;
    }
    case FEATURES.DECORATIVE_LIGHTING: {
      for(let i=0; i<4; i++) {
        const lx = (i%2===0 ? -1 : 1) * (footprint.w/2 + 1);
        const lz = (i<2 ? -1 : 1) * (footprint.d/2 + 1);
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1, 4), darkMetal);
        pole.position.set(lx, 0.5, lz);
        const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.15, 6, 6), warmEmissive);
        bulb.position.set(lx, 1, lz);
        const light = new THREE.PointLight(0xFFE4B5, 0.2, 3);
        light.position.set(lx, 1, lz);
        group.add(pole, bulb, light);
      }
      break;
    }
  }

  enableShadows(group);
  return group;
}
