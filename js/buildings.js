import * as THREE from 'three';

export const BUILDING_TYPES = {
  MODERN_VILLA: 'modern-villa',
  CONTEMPORARY_HOUSE: 'contemporary-house',
  APARTMENT: 'apartment',
  OFFICE_BUILDING: 'office-building',
  GLASS_CORPORATE: 'glass-corporate',
  UNIVERSITY: 'university',
  CATHEDRAL: 'cathedral'
};

export const COLOR_THEMES = { 
  WHITE: 'white', BEIGE: 'beige', CREAM: 'cream', BROWN: 'brown', WALNUT: 'walnut', 
  WOODEN: 'wooden', BRICK_RED: 'brick-red', PEACH: 'peach', TERRACOTTA: 'terracotta', 
  LIGHT_GRAY: 'light-gray', DARK_GRAY: 'dark-gray', BLACK: 'black', DARK_BLUE: 'dark-blue', 
  OLIVE_GREEN: 'olive-green', STONE: 'stone', SAND: 'sand', CONCRETE: 'concrete' 
};

export const THEME_COLORS = {
  'white':      { wall:'#F5F5F5', wallSecondary:'#E8E8E8', roof:'#8B8B8B', door:'#6B4226', window:'#87CEEB', windowFrame:'#D0D0D0', trim:'#FFFFFF' },
  'beige':      { wall:'#D4B896', wallSecondary:'#C4A876', roof:'#8B6914', door:'#5C3317', window:'#87CEEB', windowFrame:'#B89A6A', trim:'#E8D5B5' },
  'cream':      { wall:'#FFFDD0', wallSecondary:'#F5EAB8', roof:'#A0896A', door:'#6B4226', window:'#87CEEB', windowFrame:'#D4C49A', trim:'#FFF8DC' },
  'brown':      { wall:'#8B4513', wallSecondary:'#7A3B10', roof:'#5C2E0A', door:'#3E1F06', window:'#87CEEB', windowFrame:'#6B3510', trim:'#A0522D' },
  'walnut':     { wall:'#5C4033', wallSecondary:'#4A3328', roof:'#3E2A1E', door:'#2C1A10', window:'#87CEEB', windowFrame:'#4A3528', trim:'#6B4D3E' },
  'wooden':     { wall:'#8B6914', wallSecondary:'#7A5A10', roof:'#5C3D0E', door:'#3E2508', window:'#87CEEB', windowFrame:'#6B4E14', trim:'#A07A1A' },
  'brick-red':  { wall:'#CB4154', wallSecondary:'#B33A4A', roof:'#8B2E38', door:'#5C1F26', window:'#87CEEB', windowFrame:'#A03545', trim:'#D45565' },
  'peach':      { wall:'#FFCBA4', wallSecondary:'#F0BC95', roof:'#B08A68', door:'#6B4226', window:'#87CEEB', windowFrame:'#D4A880', trim:'#FFD8B8' },
  'terracotta': { wall:'#E2725B', wallSecondary:'#D06550', roof:'#A04A3A', door:'#6B3025', window:'#87CEEB', windowFrame:'#C05A48', trim:'#E88575' },
  'light-gray': { wall:'#C0C0C0', wallSecondary:'#A8A8A8', roof:'#808080', door:'#505050', window:'#87CEEB', windowFrame:'#999999', trim:'#D0D0D0' },
  'dark-gray':  { wall:'#4A4A4A', wallSecondary:'#3A3A3A', roof:'#2A2A2A', door:'#1A1A1A', window:'#6AB4E8', windowFrame:'#5A5A5A', trim:'#6A6A6A' },
  'black':      { wall:'#1A1A1A', wallSecondary:'#111111', roof:'#0A0A0A', door:'#000000', window:'#6AB4E8', windowFrame:'#2A2A2A', trim:'#333333' },
  'dark-blue':  { wall:'#1B2A4A', wallSecondary:'#152240', roof:'#0E1830', door:'#0A1020', window:'#87CEEB', windowFrame:'#1A2540', trim:'#253A5A' },
  'olive-green':{ wall:'#556B2F', wallSecondary:'#4A5D28', roof:'#3A4A20', door:'#2A3518', window:'#87CEEB', windowFrame:'#4A5A28', trim:'#667B3F' },
  'stone':      { wall:'#928E85', wallSecondary:'#827E75', roof:'#6A6660', door:'#504C48', window:'#87CEEB', windowFrame:'#7A7670', trim:'#A09C95' },
  'sand':       { wall:'#C2B280', wallSecondary:'#B0A070', roof:'#8A7A55', door:'#6A5A3A', window:'#87CEEB', windowFrame:'#A09060', trim:'#D4C498' },
  'concrete':   { wall:'#808080', wallSecondary:'#707070', roof:'#606060', door:'#404040', window:'#87CEEB', windowFrame:'#686868', trim:'#909090' }
};

// Helper function to create a mesh
function createMesh(geometry, colorStr, partType) {
  const material = new THREE.MeshStandardMaterial({ 
    color: colorStr,
    roughness: 0.8,
    metalness: 0.1
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.userData.partType = partType;
  return mesh;
}

export function createBuilding(type, colorTheme) {
  const group = new THREE.Group();
  group.userData.type = type;
  group.userData.colorTheme = colorTheme;

  const colors = THEME_COLORS[colorTheme] || THEME_COLORS['white'];

  if (type === BUILDING_TYPES.MODERN_VILLA) {
    // 1. Main body
    const mainBodyGeom = new THREE.BoxGeometry(14, 3.5, 12);
    const mainBody = createMesh(mainBodyGeom, colors.wall, 'wall');
    mainBody.position.set(0, 1.75, 0);
    group.add(mainBody);

    // 2. Wing
    const wingGeom = new THREE.BoxGeometry(8, 3.5, 6);
    const wing = createMesh(wingGeom, colors.wall, 'wall');
    wing.position.set(-6, 1.75, -3);
    group.add(wing);

    // 3. Flat roof overhang on main
    const mainRoofGeom = new THREE.BoxGeometry(15, 0.3, 13);
    const mainRoof = createMesh(mainRoofGeom, colors.roof, 'roof');
    mainRoof.position.set(0, 3.65, 0);
    group.add(mainRoof);

    // 4. Flat roof overhang on wing
    const wingRoofGeom = new THREE.BoxGeometry(9, 0.3, 7);
    const wingRoof = createMesh(wingRoofGeom, colors.roof, 'roof');
    wingRoof.position.set(-6, 3.65, -3);
    group.add(wingRoof);

    // 5. Front entrance (door)
    const doorGeom = new THREE.BoxGeometry(1.8, 2.8, 0.1);
    const door = createMesh(doorGeom, colors.door, 'door');
    door.position.set(2, 1.4, 6.05); // slight offset to avoid z-fighting
    group.add(door);

    // 6. Windows
    // Front face
    for(let i=0; i<3; i++) {
      const windowGeom = new THREE.BoxGeometry(3, 2, 0.1);
      const win = createMesh(windowGeom, colors.window, 'window');
      win.position.set(-3.5 + i*4, 1.5, 6.05);
      group.add(win);

      const frameGeom = new THREE.BoxGeometry(3.2, 2.2, 0.05);
      const frame = createMesh(frameGeom, colors.windowFrame, 'windowFrame');
      frame.position.set(-3.5 + i*4, 1.5, 6.05);
      group.add(frame);
    }
    // Wing face (front)
    for(let i=0; i<2; i++) {
      const windowGeom = new THREE.BoxGeometry(2, 2, 0.1);
      const win = createMesh(windowGeom, colors.window, 'window');
      win.position.set(-8.5 + i*3, 1.5, -0.05 + 0.1); 
      group.add(win);
    }

    // 7. Decorative trim
    const trimGeom = new THREE.BoxGeometry(14.2, 0.15, 12.2);
    const trim = createMesh(trimGeom, colors.trim, 'trim');
    trim.position.set(0, 3.3, 0);
    group.add(trim);

    // 8. Front steps
    const stepGeom = new THREE.BoxGeometry(3, 0.2, 1);
    const step = createMesh(stepGeom, colors.trim, 'trim');
    step.position.set(2, 0.1, 6.6);
    group.add(step);

    const step2Geom = new THREE.BoxGeometry(3, 0.2, 1);
    const step2 = createMesh(step2Geom, colors.trim, 'trim');
    step2.position.set(2, -0.1, 7.1); // below ground mostly, just for effect
    group.add(step2);

    // 9. Patio/Terrace area
    const patioGeom = new THREE.BoxGeometry(14, 0.1, 4);
    const patio = createMesh(patioGeom, colors.wallSecondary, 'wallSecondary');
    patio.position.set(-1, 0.05, 8);
    group.add(patio);

  } else if (type === BUILDING_TYPES.CONTEMPORARY_HOUSE) {
    // 1. Ground floor
    const groundGeom = new THREE.BoxGeometry(12, 3.5, 10);
    const groundFloor = createMesh(groundGeom, colors.wall, 'wall');
    groundFloor.position.set(0, 1.75, 0);
    group.add(groundFloor);

    // 2. Upper floor
    const upperGeom = new THREE.BoxGeometry(12, 3.5, 10);
    const upperFloor = createMesh(upperGeom, colors.wallSecondary, 'wallSecondary');
    upperFloor.position.set(0, 5.25, 0);
    group.add(upperFloor);

    // 3. Pitched roof (simple two angled panels approach)
    const roofPanelGeom1 = new THREE.BoxGeometry(13, 0.2, 6);
    const roofPanel1 = createMesh(roofPanelGeom1, colors.roof, 'roof');
    roofPanel1.position.set(0, 8.2, 2.5);
    roofPanel1.rotation.x = -Math.PI / 6; // ~30 deg
    group.add(roofPanel1);

    const roofPanelGeom2 = new THREE.BoxGeometry(13, 0.2, 6);
    const roofPanel2 = createMesh(roofPanelGeom2, colors.roof, 'roof');
    roofPanel2.position.set(0, 8.2, -2.5);
    roofPanel2.rotation.x = Math.PI / 6;
    group.add(roofPanel2);
    
    // Fill the gables
    const shape = new THREE.Shape();
    shape.moveTo(-5.1, 0);
    shape.lineTo(5.1, 0);
    shape.lineTo(0, 3);
    shape.lineTo(-5.1, 0);
    const extrudeSettings = { depth: 12.1, bevelEnabled: false };
    const gableGeom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    // Center it
    gableGeom.translate(0, 0, -6.05);
    // Rotate to orient correctly
    gableGeom.rotateY(Math.PI / 2);
    
    const gableMesh = createMesh(gableGeom, colors.wallSecondary, 'wall');
    gableMesh.position.set(0, 7, 0);
    group.add(gableMesh);

    // 4. Front door
    const doorGeom = new THREE.BoxGeometry(1.5, 2.5, 0.1);
    const door = createMesh(doorGeom, colors.door, 'door');
    door.position.set(0, 1.25, 5.05);
    group.add(door);

    // 5. Windows
    // GF front
    for(let i=0; i<2; i++) {
      const winGeom = new THREE.BoxGeometry(1.8, 1.5, 0.1);
      const win = createMesh(winGeom, colors.window, 'window');
      win.position.set(-3 + i*6, 1.5, 5.05);
      group.add(win);
    }
    // UF front
    for(let i=0; i<3; i++) {
      const winGeom = new THREE.BoxGeometry(1.5, 1.5, 0.1);
      const win = createMesh(winGeom, colors.window, 'window');
      win.position.set(-3.5 + i*3.5, 5.25, 5.05);
      group.add(win);
    }
    // Side windows (just one side for simplicity in this example)
    for(let i=0; i<2; i++) {
      const winGeom = new THREE.BoxGeometry(0.1, 1.5, 1.5);
      const win = createMesh(winGeom, colors.window, 'window');
      win.position.set(6.05, 1.5, -2 + i*4);
      group.add(win);
    }
    for(let i=0; i<2; i++) {
      const winGeom = new THREE.BoxGeometry(0.1, 1.5, 1.5);
      const win = createMesh(winGeom, colors.window, 'window');
      win.position.set(6.05, 5.25, -2 + i*4);
      group.add(win);
    }

    // 6. Chimney
    const chimneyGeom = new THREE.BoxGeometry(1, 4, 1);
    const chimney = createMesh(chimneyGeom, colors.wallSecondary, 'wallSecondary');
    chimney.position.set(4, 7.5, 0);
    group.add(chimney);

    // 7. Front porch
    const porchSlabGeom = new THREE.BoxGeometry(4, 0.2, 2);
    const porchSlab = createMesh(porchSlabGeom, colors.trim, 'trim');
    porchSlab.position.set(0, 0.1, 6);
    group.add(porchSlab);
    
    const colGeom = new THREE.CylinderGeometry(0.1, 0.1, 2.5);
    const col1 = createMesh(colGeom, colors.trim, 'trim');
    col1.position.set(-1.8, 1.25, 6.8);
    group.add(col1);
    
    const col2 = createMesh(colGeom, colors.trim, 'trim');
    col2.position.set(1.8, 1.25, 6.8);
    group.add(col2);

    // 8. Trim/molding
    const trimGeom = new THREE.BoxGeometry(12.2, 0.15, 10.2);
    const trim = createMesh(trimGeom, colors.trim, 'trim');
    trim.position.set(0, 3.5, 0);
    group.add(trim);

  } else if (type === BUILDING_TYPES.APARTMENT) {
    // 1. Main body
    const mainBodyGeom = new THREE.BoxGeometry(25, 15, 12);
    const mainBody = createMesh(mainBodyGeom, colors.wall, 'wall');
    mainBody.position.set(0, 7.5, 0);
    group.add(mainBody);

    // 2. Each floor horizontal band
    for (let y = 3; y <= 12; y += 3) {
      const bandGeom = new THREE.BoxGeometry(25.4, 0.15, 12.4);
      const band = createMesh(bandGeom, colors.trim, 'trim');
      band.position.set(0, y, 0);
      group.add(band);
    }

    // 3. Flat roof
    const roofGeom = new THREE.BoxGeometry(26, 0.4, 13);
    const roof = createMesh(roofGeom, colors.roof, 'roof');
    roof.position.set(0, 15.2, 0);
    group.add(roof);

    // 4. Roof structures
    const elevatorGeom = new THREE.BoxGeometry(3, 1.5, 3);
    const elevator = createMesh(elevatorGeom, colors.wallSecondary, 'wallSecondary');
    elevator.position.set(-5, 16.15, -2);
    group.add(elevator);

    const waterTankGeom = new THREE.BoxGeometry(2, 1, 2);
    const waterTank = createMesh(waterTankGeom, colors.wallSecondary, 'wallSecondary');
    waterTank.position.set(6, 15.9, 0);
    group.add(waterTank);

    // 5. Windows
    for (let row = 0; row < 5; row++) {
      const y = 1.5 + row * 3;
      for (let col = 0; col < 8; col++) {
        const x = -10.5 + col * 3;
        // Front windows
        const winGeom = new THREE.BoxGeometry(1.8, 1.3, 0.1);
        const win = createMesh(winGeom, colors.window, 'window');
        win.position.set(x, y, 6.05);
        group.add(win);
        
        const frameGeom = new THREE.BoxGeometry(2, 1.5, 0.05);
        const frame = createMesh(frameGeom, colors.windowFrame, 'windowFrame');
        frame.position.set(x, y, 6.05);
        group.add(frame);
      }
      for (let col = 0; col < 4; col++) {
        const z = -4.5 + col * 3;
        // Right side windows
        const winGeom = new THREE.BoxGeometry(0.1, 1.3, 1.8);
        const win = createMesh(winGeom, colors.window, 'window');
        win.position.set(12.55, y, z);
        group.add(win);
        // Left side windows
        const win2 = createMesh(winGeom, colors.window, 'window');
        win2.position.set(-12.55, y, z);
        group.add(win2);
      }
    }

    // 6. Main entrance
    const mainDoorGeom = new THREE.BoxGeometry(3, 3, 0.1);
    const mainDoor = createMesh(mainDoorGeom, colors.window, 'window'); // glass door
    mainDoor.material.transparent = true;
    mainDoor.material.opacity = 0.8;
    mainDoor.position.set(0, 1.5, 6.05);
    group.add(mainDoor);
    
    const canopyGeom = new THREE.BoxGeometry(4, 0.2, 2);
    const canopy = createMesh(canopyGeom, colors.trim, 'trim');
    canopy.position.set(0, 3.1, 7);
    group.add(canopy);

    // 7. Balcony ledges
    for (let row = 1; row < 5; row++) {
      const y = row * 3 + 0.1;
      for (let col = 0; col < 8; col += 2) {
        const x = -10.5 + col * 3;
        const balcGeom = new THREE.BoxGeometry(2, 0.1, 1.5);
        const balc = createMesh(balcGeom, colors.trim, 'trim');
        balc.position.set(x, y, 6.75);
        group.add(balc);
      }
    }

    // 8. Ground floor entrance area (wall section)
    const gfWallGeom = new THREE.BoxGeometry(4, 3, 0.05);
    const gfWall = createMesh(gfWallGeom, colors.wallSecondary, 'wallSecondary');
    gfWall.position.set(0, 1.5, 6.02);
    group.add(gfWall);

  } else if (type === BUILDING_TYPES.OFFICE_BUILDING) {
    const mainGeom = new THREE.BoxGeometry(20, 33, 15);
    const mainBody = createMesh(mainGeom, colors.wall, 'wall');
    mainBody.position.set(0, 16.5, 0);
    group.add(mainBody);

    for (let floor = 1; floor <= 10; floor++) {
      const y = floor * 3.3;
      const bandGeom = new THREE.BoxGeometry(20.4, 0.12, 15.4);
      const band = createMesh(bandGeom, colors.trim, 'trim');
      band.position.set(0, y, 0);
      group.add(band);
      
      const winGeom = new THREE.BoxGeometry(18, 2.5, 0.1);
      const win = createMesh(winGeom, colors.window, 'window');
      win.material.transparent = true;
      win.material.opacity = 0.6;
      win.position.set(0, y - 1.65, 7.55);
      group.add(win);
    }

    for (let floor = 1; floor <= 10; floor++) {
      const y = (floor * 3.3) - 1.65;
      for (let c = 0; c < 5; c++) {
        const z = -6 + c * 3;
        const winRGeom = new THREE.BoxGeometry(0.1, 2, 1.5);
        const winR = createMesh(winRGeom, colors.window, 'window');
        winR.position.set(10.05, y, z);
        group.add(winR);
        const winLGeom = new THREE.BoxGeometry(0.1, 2, 1.5);
        const winL = createMesh(winLGeom, colors.window, 'window');
        winL.position.set(-10.05, y, z);
        group.add(winL);
      }
    }

    const entranceGeom = new THREE.BoxGeometry(6, 3.5, 0.1);
    const entrance = createMesh(entranceGeom, colors.window, 'window');
    entrance.material.transparent = true;
    entrance.material.opacity = 0.7;
    entrance.position.set(0, 1.75, 7.56);
    group.add(entrance);

    const entranceCanopyGeom = new THREE.BoxGeometry(8, 0.2, 3);
    const entranceCanopy = createMesh(entranceCanopyGeom, colors.trim, 'trim');
    entranceCanopy.position.set(0, 3.5, 8.5);
    group.add(entranceCanopy);

    const roofGeom = new THREE.BoxGeometry(21, 0.4, 16);
    const roof = createMesh(roofGeom, colors.roof, 'roof');
    roof.position.set(0, 33.2, 0);
    group.add(roof);

    for (let i = 0; i < 3; i++) {
      const acGeom = new THREE.BoxGeometry(2, 1, 2);
      const ac = createMesh(acGeom, colors.wallSecondary, 'wallSecondary');
      ac.position.set(-6 + i * 4, 33.9, -3);
      group.add(ac);
    }
    const elevShaftGeom = new THREE.BoxGeometry(4, 2, 4);
    const elevShaft = createMesh(elevShaftGeom, colors.wallSecondary, 'wallSecondary');
    elevShaft.position.set(4, 34.4, 2);
    group.add(elevShaft);

    group.children.forEach(child => {
      child.userData.floor = Math.max(1, Math.floor(child.position.y / 3.3));
    });

  } else if (type === BUILDING_TYPES.GLASS_CORPORATE) {
    const coreGeom = new THREE.BoxGeometry(16, 26.4, 16);
    const core = createMesh(coreGeom, colors.wallSecondary, 'wallSecondary');
    core.position.set(0, 13.2, 0);
    group.add(core);

    const glassFBGeom = new THREE.BoxGeometry(18, 26, 0.15);
    const glassF = createMesh(glassFBGeom, colors.window, 'window');
    glassF.material.transparent = true;
    glassF.material.opacity = 0.4;
    glassF.material.metalness = 0.8;
    glassF.material.roughness = 0.05;
    glassF.position.set(0, 13, 9.075);
    group.add(glassF);
    
    const glassB = glassF.clone();
    glassB.position.set(0, 13, -9.075);
    group.add(glassB);

    const glassLRGeom = new THREE.BoxGeometry(0.15, 26, 18);
    const glassL = createMesh(glassLRGeom, colors.window, 'window');
    glassL.material.transparent = true;
    glassL.material.opacity = 0.4;
    glassL.material.metalness = 0.8;
    glassL.material.roughness = 0.05;
    glassL.position.set(-9.075, 13, 0);
    group.add(glassL);
    
    const glassR = glassL.clone();
    glassR.position.set(9.075, 13, 0);
    group.add(glassR);

    for (let floor = 1; floor <= 8; floor++) {
      const slabGeom = new THREE.BoxGeometry(17, 0.15, 17);
      const slab = createMesh(slabGeom, colors.trim, 'trim');
      slab.position.set(0, floor * 3.3, 0);
      group.add(slab);
    }

    for (let i = 0; i < 4; i++) {
      const offset = -6 + i * 4;
      const mullionFBGeom = new THREE.BoxGeometry(0.08, 26, 0.08);
      const mullionF = createMesh(mullionFBGeom, colors.windowFrame, 'windowFrame');
      mullionF.position.set(offset, 13, 9.15);
      group.add(mullionF);
      
      const mullionB = mullionF.clone();
      mullionB.position.set(offset, 13, -9.15);
      group.add(mullionB);

      const mullionLRGeom = new THREE.BoxGeometry(0.08, 26, 0.08);
      const mullionL = createMesh(mullionLRGeom, colors.windowFrame, 'windowFrame');
      mullionL.position.set(-9.15, 13, offset);
      group.add(mullionL);
      
      const mullionR = mullionL.clone();
      mullionR.position.set(9.15, 13, offset);
      group.add(mullionR);
    }

    const entranceGeom = new THREE.CylinderGeometry(1.5, 1.5, 3, 16);
    const entrance = createMesh(entranceGeom, colors.window, 'window');
    entrance.material.transparent = true;
    entrance.material.opacity = 0.5;
    entrance.position.set(0, 1.5, 9);
    group.add(entrance);

    const roofGeom = new THREE.BoxGeometry(19, 0.3, 19);
    const roof = createMesh(roofGeom, colors.roof, 'roof');
    roof.position.set(0, 26.55, 0);
    group.add(roof);

    const helipadGeom = new THREE.CylinderGeometry(4, 4, 0.1, 32);
    const helipad = createMesh(helipadGeom, colors.wallSecondary, 'wallSecondary');
    helipad.position.set(0, 26.75, 0);
    group.add(helipad);

    group.children.forEach(child => {
      child.userData.floor = Math.max(1, Math.floor(child.position.y / 3.3));
    });

  } else if (type === BUILDING_TYPES.UNIVERSITY) {
    const mainGeom = new THREE.BoxGeometry(40, 18, 25);
    const mainBody = createMesh(mainGeom, colors.wall, 'wall');
    mainBody.position.set(0, 9, 0);
    group.add(mainBody);

    const centralGeom = new THREE.BoxGeometry(10, 20, 4);
    const centralBlock = createMesh(centralGeom, colors.wallSecondary, 'wallSecondary');
    centralBlock.position.set(0, 10, 14.5);
    group.add(centralBlock);

    const doorGeom = new THREE.BoxGeometry(5, 6, 0.15);
    const door = createMesh(doorGeom, colors.door, 'door');
    door.position.set(0, 3, 16.575);
    group.add(door);

    const archGeom = new THREE.CylinderGeometry(3, 3, 0.3, 16, 1, false, 0, Math.PI);
    archGeom.rotateX(Math.PI / 2);
    const arch = createMesh(archGeom, colors.wallSecondary, 'wallSecondary');
    arch.position.set(0, 6, 16.575);
    group.add(arch);

    for (let i = 0; i < 5; i++) {
      const stepGeom = new THREE.BoxGeometry(12, 0.3, 1.5);
      const step = createMesh(stepGeom, colors.trim, 'trim');
      step.position.set(0, i * 0.3 + 0.15, 17.5 - i * 1.5);
      group.add(step);
    }

    for (let i = 0; i < 4; i++) {
      const colGeom = new THREE.CylinderGeometry(0.4, 0.4, 8, 12);
      const col = createMesh(colGeom, colors.trim, 'trim');
      col.position.set(-3.5 + i * (7/3), 4, 17);
      group.add(col);
    }

    for (let floor = 0; floor < 5; floor++) {
      const y = 2.5 + floor * 3.6;
      for (let c = 0; c < 10; c++) {
        if (c >= 3 && c <= 6) continue;
        const x = -18 + c * 4;
        const winGeom = new THREE.BoxGeometry(2, 1.5, 0.1);
        const win = createMesh(winGeom, colors.window, 'window');
        win.position.set(x, y, 12.55);
        group.add(win);
      }
      for (let c = 0; c < 6; c++) {
        const z = -10 + c * 4;
        const winLGeom = new THREE.BoxGeometry(0.1, 1.5, 2);
        const winL = createMesh(winLGeom, colors.window, 'window');
        winL.position.set(-20.05, y, z);
        group.add(winL);
        
        const winRGeom = new THREE.BoxGeometry(0.1, 1.5, 2);
        const winR = createMesh(winRGeom, colors.window, 'window');
        winR.position.set(20.05, y, z);
        group.add(winR);
      }
      
      if (floor > 0) {
        const bandGeom = new THREE.BoxGeometry(40.4, 0.2, 25.4);
        const band = createMesh(bandGeom, colors.trim, 'trim');
        band.position.set(0, floor * 3.6, 0);
        group.add(band);
      }
    }

    const corniceGeom = new THREE.BoxGeometry(41, 0.5, 26);
    const cornice = createMesh(corniceGeom, colors.trim, 'trim');
    cornice.position.set(0, 18.25, 0);
    group.add(cornice);

    const roofC1Geom = new THREE.BoxGeometry(11, 0.2, 2.5);
    const roofC1 = createMesh(roofC1Geom, colors.roof, 'roof');
    roofC1.position.set(0, 20.5, 15.5);
    roofC1.rotation.x = -Math.PI / 6;
    group.add(roofC1);

    const roofC2Geom = new THREE.BoxGeometry(11, 0.2, 2.5);
    const roofC2 = createMesh(roofC2Geom, colors.roof, 'roof');
    roofC2.position.set(0, 20.5, 13.5);
    roofC2.rotation.x = Math.PI / 6;
    group.add(roofC2);

    group.children.forEach(child => {
      child.userData.floor = Math.max(1, Math.floor(child.position.y / 3.6));
    });

  } else if (type === BUILDING_TYPES.CATHEDRAL) {
    // Scale factor to fit cathedral within the plot (roads at z=±30)
    const s = 0.55;

    const naveGeom = new THREE.BoxGeometry(16*s, 20*s, 40*s);
    const nave = createMesh(naveGeom, colors.wall, 'wall');
    nave.position.set(0, 10*s, 0);
    group.add(nave);

    const aisleGeom = new THREE.BoxGeometry(7*s, 12*s, 40*s);
    const aisleL = createMesh(aisleGeom, colors.wallSecondary, 'wallSecondary');
    aisleL.position.set(-11.5*s, 6*s, 0);
    group.add(aisleL);

    const aisleR = createMesh(aisleGeom, colors.wallSecondary, 'wallSecondary');
    aisleR.position.set(11.5*s, 6*s, 0);
    group.add(aisleR);

    const towerGeom = new THREE.BoxGeometry(7*s, 35*s, 7*s);
    const towerL = createMesh(towerGeom, colors.wall, 'wall');
    towerL.position.set(-11.5*s, 17.5*s, 23.5*s);
    group.add(towerL);

    const towerR = createMesh(towerGeom, colors.wall, 'wall');
    towerR.position.set(11.5*s, 17.5*s, 23.5*s);
    group.add(towerR);

    const spireGeom = new THREE.ConeGeometry(5*s, 8*s, 4);
    spireGeom.rotateY(Math.PI / 4);
    const spireL = createMesh(spireGeom, colors.roof, 'roof');
    spireL.position.set(-11.5*s, 39*s, 23.5*s);
    group.add(spireL);

    const spireR = createMesh(spireGeom, colors.roof, 'roof');
    spireR.position.set(11.5*s, 39*s, 23.5*s);
    group.add(spireR);

    const naveRoofGeom = new THREE.BoxGeometry(10*s, 0.2, 42*s);
    const roofL = createMesh(naveRoofGeom, colors.roof, 'roof');
    roofL.position.set(-4*s, 22*s, 0);
    roofL.rotation.z = Math.PI / 6;
    group.add(roofL);

    const roofR = createMesh(naveRoofGeom, colors.roof, 'roof');
    roofR.position.set(4*s, 22*s, 0);
    roofR.rotation.z = -Math.PI / 6;
    group.add(roofR);

    const roseGeom = new THREE.CircleGeometry(3*s, 32);
    const rose = createMesh(roseGeom, '#FF6B35', 'window');
    rose.material.emissive = new THREE.Color('#FF6B35');
    rose.material.emissiveIntensity = 0.5;
    rose.position.set(0, 14*s, 20.05*s);
    group.add(rose);

    for (let i = 0; i < 6; i++) {
      const z = (-15 + i * 6) * s;
      const winGeom = new THREE.BoxGeometry(0.1, 4*s, 1.2*s);
      
      const winNL = createMesh(winGeom, colors.window, 'window');
      winNL.position.set(-8.05*s, 16*s, z);
      group.add(winNL);
      const topNLGeom = new THREE.ConeGeometry(0.6*s, 1*s, 4);
      topNLGeom.rotateY(Math.PI / 4);
      const topNL = createMesh(topNLGeom, colors.window, 'window');
      topNL.position.set(-8.05*s, 18.5*s, z);
      group.add(topNL);

      const winNR = createMesh(winGeom, colors.window, 'window');
      winNR.position.set(8.05*s, 16*s, z);
      group.add(winNR);
      const topNRGeom = new THREE.ConeGeometry(0.6*s, 1*s, 4);
      topNRGeom.rotateY(Math.PI / 4);
      const topNR = createMesh(topNRGeom, colors.window, 'window');
      topNR.position.set(8.05*s, 18.5*s, z);
      group.add(topNR);
    }

    const mainDoorGeom = new THREE.BoxGeometry(4*s, 6*s, 0.15);
    const mainDoor = createMesh(mainDoorGeom, colors.door, 'door');
    mainDoor.position.set(0, 3*s, 20.05*s);
    group.add(mainDoor);

    for (let i = 0; i < 4; i++) {
      const z = (-10 + i * 8) * s;
      const buttressGeom = new THREE.BoxGeometry(4.5*s, 0.5*s, 0.5*s);
      
      const buttressL = createMesh(buttressGeom, colors.trim, 'trim');
      buttressL.position.set(-10*s, 14*s, z);
      buttressL.rotation.z = Math.PI / 4;
      group.add(buttressL);
      
      const buttressR = createMesh(buttressGeom, colors.trim, 'trim');
      buttressR.position.set(10*s, 14*s, z);
      buttressR.rotation.z = -Math.PI / 4;
      group.add(buttressR);
    }

    const createCross = () => {
      const cross = new THREE.Group();
      const vGeom = new THREE.BoxGeometry(0.15, 1.5*s, 0.15);
      const v = createMesh(vGeom, colors.trim, 'trim');
      cross.add(v);
      const hGeom = new THREE.BoxGeometry(0.8*s, 0.15, 0.15);
      const h = createMesh(hGeom, colors.trim, 'trim');
      h.position.set(0, 0.3*s, 0);
      cross.add(h);
      return cross;
    };
    
    const crossL = createCross();
    crossL.position.set(-11.5*s, 43.75*s, 23.5*s);
    group.add(crossL);

    const crossR = createCross();
    crossR.position.set(11.5*s, 43.75*s, 23.5*s);
    group.add(crossR);

    group.children.forEach(child => {
      child.userData.floor = 0;
    });
  }

  return group;
}

export function updateBuildingColors(buildingGroup, colorTheme) {
  if (!THEME_COLORS[colorTheme]) return;
  const colors = THEME_COLORS[colorTheme];
  buildingGroup.userData.colorTheme = colorTheme;

  buildingGroup.traverse((child) => {
    if (child.isMesh && child.userData.partType && child.material) {
      const partType = child.userData.partType;
      if (colors[partType]) {
        child.material.color.set(colors[partType]);
      }
    }
  });
}

export function getBuildingInfo(type) {
  const info = {
    'modern-villa': {
      name: 'Modern Villa',
      description: 'A sleek single-story villa with an L-shaped layout, featuring large windows, flat roof with overhangs, and a spacious patio.',
      dimensions: { width: 20, depth: 15, height: 4 },
      floors: 1,
      totalArea: 210, // sq meters
      rooms: [
        { name: 'Living Room', area: 48, color: '#4CAF50' },
        { name: 'Kitchen', area: 30, color: '#FF9800' },
        { name: 'Master Bedroom', area: 25, color: '#2196F3' },
        { name: 'Bedroom 2', area: 16, color: '#03A9F4' },
        { name: 'Bathroom 1', area: 9, color: '#9C27B0' },
        { name: 'Bathroom 2', area: 6, color: '#E91E63' },
        { name: 'Hallway', area: 12, color: '#607D8B' },
        { name: 'Terrace', area: 30, color: '#8BC34A' }
      ]
    },
    'contemporary-house': {
      name: 'Contemporary House',
      description: 'A charming two-story home with pitched roof, chimney, front porch, and traditional layout across two floors.',
      dimensions: { width: 12, depth: 10, height: 9.5 },
      floors: 2,
      totalArea: 240,
      rooms: [
        { name: 'Living Room', area: 35, color: '#4CAF50' },
        { name: 'Kitchen', area: 20, color: '#FF9800' },
        { name: 'Dining Room', area: 15, color: '#CDDC39' },
        { name: 'Bathroom (GF)', area: 6, color: '#9C27B0' },
        { name: 'Master Bedroom', area: 25, color: '#2196F3' },
        { name: 'Bedroom 2', area: 16, color: '#03A9F4' },
        { name: 'Bedroom 3', area: 14, color: '#00BCD4' },
        { name: 'Bathroom (1F)', area: 8, color: '#E91E63' },
        { name: 'Staircase', area: 8, color: '#795548' },
        { name: 'Hallway', area: 10, color: '#607D8B' }
      ]
    },
    'apartment': {
      name: 'Apartment Building',
      description: 'A modern 5-story apartment complex with multiple units per floor, central staircase, and rooftop utilities.',
      dimensions: { width: 25, depth: 12, height: 15 },
      floors: 5,
      totalArea: 1500,
      rooms: [
        { name: 'Unit A - Living', area: 30, color: '#4CAF50' },
        { name: 'Unit A - Kitchen', area: 12, color: '#FF9800' },
        { name: 'Unit A - Bedroom', area: 16, color: '#2196F3' },
        { name: 'Unit A - Bathroom', area: 6, color: '#9C27B0' },
        { name: 'Unit B - Living', area: 28, color: '#66BB6A' },
        { name: 'Unit B - Kitchen', area: 10, color: '#FFA726' },
        { name: 'Unit B - Bedroom', area: 14, color: '#42A5F5' },
        { name: 'Unit B - Bathroom', area: 5, color: '#AB47BC' },
        { name: 'Corridor', area: 20, color: '#607D8B' },
        { name: 'Staircase', area: 12, color: '#795548' }
      ]
    },
    'office-building': {
      name: 'Office Building',
      description: 'A 10-floor modern corporate tower with a glass curtain wall and contemporary aesthetic.',
      dimensions: { width: 20, depth: 15, height: 33 },
      floors: 10,
      totalArea: 3000,
      rooms: [
        { name: 'Reception', area: 60, color: '#4CAF50' },
        { name: 'Open Office (x8)', area: 150, color: '#2196F3' },
        { name: 'Meeting Room (x4)', area: 30, color: '#FF9800' },
        { name: 'Cafeteria', area: 80, color: '#E91E63' },
        { name: 'Executive Suite', area: 50, color: '#9C27B0' },
        { name: 'Server Room', area: 30, color: '#607D8B' },
        { name: 'Restrooms (x10)', area: 15, color: '#00BCD4' }
      ]
    },
    'glass-corporate': {
      name: 'Glass Corporate Building',
      description: 'A premium fully glazed headquarters featuring an outer glass shell and a rooftop helipad.',
      dimensions: { width: 18, depth: 18, height: 26.4 },
      floors: 8,
      totalArea: 2592,
      rooms: [
        { name: 'Grand Lobby', area: 100, color: '#4CAF50' },
        { name: 'Executive Floor', area: 280, color: '#9C27B0' },
        { name: 'Open Workspace (x4)', area: 250, color: '#2196F3' },
        { name: 'Board Room', area: 60, color: '#FF9800' },
        { name: 'Lounge', area: 80, color: '#E91E63' },
        { name: 'Sky Garden', area: 150, color: '#8BC34A' }
      ]
    },
    'university': {
      name: 'University Building',
      description: 'A grand 5-floor campus building with classical architectural elements, arched entrance, and pitched roofs.',
      dimensions: { width: 40, depth: 25, height: 18 },
      floors: 5,
      totalArea: 5000,
      rooms: [
        { name: 'Grand Foyer', area: 200, color: '#4CAF50' },
        { name: 'Lecture Hall (x4)', area: 120, color: '#2196F3' },
        { name: 'Laboratory (x3)', area: 80, color: '#FF9800' },
        { name: 'Library', area: 300, color: '#9C27B0' },
        { name: 'Admin Office (x5)', area: 40, color: '#607D8B' },
        { name: 'Student Lounge (x2)', area: 100, color: '#E91E63' },
        { name: 'Auditorium', area: 250, color: '#F44336' },
        { name: 'Faculty Room (x3)', area: 50, color: '#795548' },
        { name: 'Washrooms (x10)', area: 15, color: '#00BCD4' }
      ]
    },
    'cathedral': {
      name: 'Cathedral',
      description: 'A Gothic-inspired grand cathedral featuring tall spires, flying buttresses, and stained glass windows.',
      dimensions: { width: 17, depth: 28, height: 19 },
      floors: 1,
      totalArea: 1500,
      rooms: [
        { name: 'Main Nave', area: 600, color: '#4CAF50' },
        { name: 'Side Aisles (x2)', area: 150, color: '#2196F3' },
        { name: 'Altar', area: 100, color: '#FF9800' },
        { name: 'Choir', area: 80, color: '#9C27B0' },
        { name: 'Transept', area: 200, color: '#E91E63' },
        { name: 'Chapel (x2)', area: 60, color: '#00BCD4' },
        { name: 'Vestry', area: 40, color: '#607D8B' },
        { name: 'Bell Tower (x2)', area: 20, color: '#795548' }
      ]
    }
  };
  return info[type];
}
