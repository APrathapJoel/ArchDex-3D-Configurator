import * as THREE from 'three';

const interiorPeople = [];
let elapsedTime = 0;

export function getFloorCount(buildingType) {
    switch (buildingType) {
        case 'modern-villa': return 1;
        case 'contemporary-house': return 2;
        case 'apartment': return 5;
        case 'office-building': return 10;
        case 'glass-corporate': return 8;
        case 'university': return 5;
        case 'cathedral': return 1;
        default: return 1;
    }
}

// ============================================================
// Procedural Canvas Textures (Matching Reference Image)
// ============================================================

function createWoodTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#D2A679';
    ctx.fillRect(0, 0, 512, 512);

    const plankHeight = 32;
    for (let y = 0; y < 512; y += plankHeight) {
        ctx.fillStyle = (y / plankHeight) % 2 === 0 ? '#C69563' : '#DCB085';
        ctx.fillRect(0, y, 512, plankHeight - 2);

        ctx.strokeStyle = '#8C5A2B';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(512, y);
        ctx.stroke();

        for (let x = (y * 3) % 128; x < 512; x += 128) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x, y + plankHeight - 2);
            ctx.stroke();
        }

        ctx.strokeStyle = 'rgba(110, 65, 25, 0.15)';
        ctx.lineWidth = 1;
        for (let i = 0; i < 4; i++) {
            const gy = y + 6 + i * 6;
            ctx.beginPath();
            ctx.moveTo(0, gy);
            ctx.bezierCurveTo(170, gy + 3, 340, gy - 3, 512, gy);
            ctx.stroke();
        }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
}

function createBlueTileTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#C8E6C9';
    ctx.fillRect(0, 0, 512, 512);

    const tileSize = 64;
    for (let y = 0; y < 512; y += tileSize) {
        for (let x = 0; x < 512; x += tileSize) {
            const isAlt = ((x / tileSize) + (y / tileSize)) % 2 === 0;
            ctx.fillStyle = isAlt ? '#79B7D2' : '#5A9EBC';
            ctx.fillRect(x + 2, y + 2, tileSize - 4, tileSize - 4);

            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 2;
            ctx.strokeRect(x + 6, y + 6, tileSize - 12, tileSize - 12);

            ctx.fillStyle = '#3F7B96';
            ctx.beginPath();
            ctx.arc(x + tileSize / 2, y + tileSize / 2, 8, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
}

function createWhiteTileTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#EBE8E1';
    ctx.fillRect(0, 0, 512, 512);

    const tileSize = 64;
    ctx.strokeStyle = '#BDB7AB';
    ctx.lineWidth = 3;
    for (let y = 0; y <= 512; y += tileSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(512, y);
        ctx.stroke();
    }
    for (let x = 0; x <= 512; x += tileSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 512);
        ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
}

function createRugTexture(type = 'boho') {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    if (type === 'boho') {
        ctx.fillStyle = '#D95D39';
        ctx.fillRect(0, 0, 512, 512);

        ctx.fillStyle = '#F0A202';
        ctx.fillRect(32, 32, 448, 448);

        ctx.fillStyle = '#202C39';
        ctx.fillRect(64, 64, 384, 384);

        ctx.strokeStyle = '#F4E8C1';
        ctx.lineWidth = 8;
        ctx.strokeRect(80, 80, 352, 352);

        ctx.fillStyle = '#D95D39';
        ctx.beginPath();
        ctx.moveTo(256, 120);
        ctx.lineTo(392, 256);
        ctx.lineTo(256, 392);
        ctx.lineTo(120, 256);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#F0A202';
        ctx.beginPath();
        ctx.arc(256, 256, 40, 0, Math.PI * 2);
        ctx.fill();
    } else {
        ctx.fillStyle = '#E8DAB2';
        ctx.fillRect(0, 0, 512, 512);

        ctx.strokeStyle = '#4F6D7A';
        ctx.lineWidth = 12;
        ctx.strokeRect(20, 20, 472, 472);

        ctx.fillStyle = '#C0D6DF';
        ctx.fillRect(40, 40, 432, 432);
    }

    return new THREE.CanvasTexture(canvas);
}

// Cached textures
const woodTex = createWoodTexture();
woodTex.repeat.set(4, 4);
const blueTileTex = createBlueTileTexture();
blueTileTex.repeat.set(4, 4);
const whiteTileTex = createWhiteTileTexture();
whiteTileTex.repeat.set(4, 4);

// ============================================================
// Detailed Furniture Creators (Reference Image Styling)
// ============================================================

function createChair(color = '#8B4513') {
    const group = new THREE.Group();
    const material = new THREE.MeshStandardMaterial({ color, roughness: 0.6 });

    const seat = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.05, 0.4), material);
    seat.position.y = 0.4;
    seat.castShadow = true;
    seat.receiveShadow = true;
    group.add(seat);

    const legGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.4);
    [[-0.15, -0.15], [0.15, -0.15], [-0.15, 0.15], [0.15, 0.15]].forEach(([x, z]) => {
        const leg = new THREE.Mesh(legGeo, material);
        leg.position.set(x, 0.2, z);
        leg.castShadow = true;
        group.add(leg);
    });

    const back = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.05), material);
    back.position.set(0, 0.625, -0.175);
    back.castShadow = true;
    group.add(back);

    return group;
}

function createArmchair(color = '#D95D39') {
    const group = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.8 });

    const seat = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.25, 0.75), mat);
    seat.position.y = 0.25;
    seat.castShadow = true;
    group.add(seat);

    const back = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.6, 0.18), mat);
    back.position.set(0, 0.55, -0.3);
    back.castShadow = true;
    group.add(back);

    const armGeo = new THREE.BoxGeometry(0.18, 0.4, 0.75);
    const armL = new THREE.Mesh(armGeo, mat);
    armL.position.set(-0.45, 0.4, 0);
    armL.castShadow = true;
    group.add(armL);

    const armR = new THREE.Mesh(armGeo, mat);
    armR.position.set(0.45, 0.4, 0);
    armR.castShadow = true;
    group.add(armR);

    return group;
}

function createSofa(color = '#E0A96D') {
    const group = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.7 });

    const base = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.25, 0.85), mat);
    base.position.y = 0.18;
    base.castShadow = true;
    group.add(base);

    const cushionMat = new THREE.MeshStandardMaterial({ color: '#D49B59', roughness: 0.6 });
    for (let i = 0; i < 3; i++) {
        const cushion = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.15, 0.75), cushionMat);
        cushion.position.set(-0.64 + i * 0.64, 0.35, 0.02);
        cushion.castShadow = true;
        group.add(cushion);
    }

    const back = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.55, 0.18), mat);
    back.position.set(0, 0.55, -0.35);
    back.castShadow = true;
    group.add(back);

    const armGeo = new THREE.BoxGeometry(0.2, 0.42, 0.85);
    const armL = new THREE.Mesh(armGeo, mat);
    armL.position.set(-1.0, 0.42, 0);
    armL.castShadow = true;
    group.add(armL);

    const armR = new THREE.Mesh(armGeo, mat);
    armR.position.set(1.0, 0.42, 0);
    armR.castShadow = true;
    group.add(armR);

    const pillowMat = new THREE.MeshStandardMaterial({ color: '#3A7D44' });
    const p1 = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.28, 0.12), pillowMat);
    p1.position.set(-0.75, 0.55, -0.22);
    p1.rotation.z = 0.2;
    group.add(p1);

    const p2 = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.28, 0.12), pillowMat);
    p2.position.set(0.75, 0.55, -0.22);
    p2.rotation.z = -0.2;
    group.add(p2);

    return group;
}

function createBed() {
    const group = new THREE.Group();
    const frameMat = new THREE.MeshStandardMaterial({ color: '#6A4A3C', roughness: 0.7 });
    const sheetMat = new THREE.MeshStandardMaterial({ color: '#FFF8E7', roughness: 0.5 });
    const blanketMat = new THREE.MeshStandardMaterial({ color: '#457B9D', roughness: 0.6 });

    const frame = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.35, 1.7), frameMat);
    frame.position.y = 0.18;
    frame.castShadow = true;
    group.add(frame);

    const headboard = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.9, 0.12), frameMat);
    headboard.position.set(0, 0.55, -0.82);
    headboard.castShadow = true;
    group.add(headboard);

    const mattress = new THREE.Mesh(new THREE.BoxGeometry(1.95, 0.22, 1.55), sheetMat);
    mattress.position.set(0, 0.42, 0);
    mattress.castShadow = true;
    group.add(mattress);

    const blanket = new THREE.Mesh(new THREE.BoxGeometry(1.96, 0.08, 1.05), blanketMat);
    blanket.position.set(0, 0.52, 0.24);
    blanket.castShadow = true;
    group.add(blanket);

    const pillowMat = new THREE.MeshStandardMaterial({ color: '#FFFFFF' });
    [-0.5, 0.5].forEach(x => {
        const pillow = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.12, 0.38), pillowMat);
        pillow.position.set(x, 0.56, -0.52);
        pillow.castShadow = true;
        group.add(pillow);
    });

    [-1.25, 1.25].forEach(x => {
        const ns = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.45, 0.45), frameMat);
        ns.position.set(x, 0.23, -0.6);
        ns.castShadow = true;
        group.add(ns);

        const lampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.2, 8), new THREE.MeshStandardMaterial({ color: '#E9C46A' }));
        lampBase.position.set(x, 0.55, -0.6);
        group.add(lampBase);

        const shade = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.18, 0.22, 12), new THREE.MeshStandardMaterial({ color: '#FFF3B0', emissive: 0xFFE066, emissiveIntensity: 0.6 }));
        shade.position.set(x, 0.72, -0.6);
        group.add(shade);

        const light = new THREE.PointLight(0xFFE066, 0.4, 4);
        light.position.set(x, 0.75, -0.6);
        group.add(light);
    });

    return group;
}

function createBathtub() {
    const group = new THREE.Group();
    const tubMat = new THREE.MeshStandardMaterial({ color: '#FFFFFF', roughness: 0.2, metalness: 0.1 });
    const waterMat = new THREE.MeshStandardMaterial({ color: '#8ECAE6', transparent: true, opacity: 0.75, roughness: 0.1 });
    const chromeMat = new THREE.MeshStandardMaterial({ color: '#D3D3D3', metalness: 0.9, roughness: 0.1 });

    const outer = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.6, 0.85), tubMat);
    outer.position.y = 0.3;
    outer.castShadow = true;
    group.add(outer);

    const water = new THREE.Mesh(new THREE.BoxGeometry(1.45, 0.05, 0.7), waterMat);
    water.position.y = 0.48;
    group.add(water);

    const faucet = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.25, 8), chromeMat);
    faucet.position.set(-0.7, 0.68, 0);
    group.add(faucet);

    const mat = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.02, 0.5), new THREE.MeshStandardMaterial({ color: '#E9C46A' }));
    mat.position.set(0, 0.01, 0.7);
    group.add(mat);

    return group;
}

function createToilet() {
    const group = new THREE.Group();
    const porcelainMat = new THREE.MeshStandardMaterial({ color: '#FFFFFF', roughness: 0.3 });

    const base = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.42, 0.55), porcelainMat);
    base.position.y = 0.21;
    base.castShadow = true;
    group.add(base);

    const tank = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.45, 0.22), porcelainMat);
    tank.position.set(0, 0.62, -0.2);
    tank.castShadow = true;
    group.add(tank);

    return group;
}

function createSink() {
    const group = new THREE.Group();
    const porcelainMat = new THREE.MeshStandardMaterial({ color: '#FFFFFF', roughness: 0.3 });

    const counter = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.06, 0.5), new THREE.MeshStandardMaterial({ color: '#2B2D42' }));
    counter.position.y = 0.82;
    counter.castShadow = true;
    group.add(counter);

    const basin = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.15, 0.35), porcelainMat);
    basin.position.y = 0.74;
    group.add(basin);

    const mirror = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.8, 0.04), new THREE.MeshStandardMaterial({ color: '#A8DADC', roughness: 0.1, metalness: 0.8 }));
    mirror.position.set(0, 1.4, -0.22);
    group.add(mirror);

    return group;
}

function createFullKitchen(width = 3.5) {
    const group = new THREE.Group();
    const cabMat = new THREE.MeshStandardMaterial({ color: '#A86B32', roughness: 0.6 });
    const counterMat = new THREE.MeshStandardMaterial({ color: '#F4F1DE', roughness: 0.3 });
    const stainlessMat = new THREE.MeshStandardMaterial({ color: '#C0C0C0', metalness: 0.8, roughness: 0.2 });

    const baseCab = new THREE.Mesh(new THREE.BoxGeometry(width, 0.88, 0.65), cabMat);
    baseCab.position.set(0, 0.44, 0);
    baseCab.castShadow = true;
    group.add(baseCab);

    const topCounter = new THREE.Mesh(new THREE.BoxGeometry(width + 0.05, 0.06, 0.7), counterMat);
    topCounter.position.set(0, 0.91, 0);
    topCounter.castShadow = true;
    group.add(topCounter);

    const sink = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.02, 0.45), stainlessMat);
    sink.position.set(-0.8, 0.94, 0);
    group.add(sink);

    const faucet = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.2, 8), stainlessMat);
    faucet.position.set(-0.8, 1.05, -0.18);
    group.add(faucet);

    const stove = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.03, 0.5), new THREE.MeshStandardMaterial({ color: '#111111' }));
    stove.position.set(0.6, 0.94, 0);
    group.add(stove);

    for (let bx of [-0.2, 0.2]) {
        for (let bz of [-0.12, 0.12]) {
            const burner = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.01, 12), new THREE.MeshStandardMaterial({ color: '#333333' }));
            burner.position.set(0.6 + bx, 0.96, bz);
            group.add(burner);
        }
    }

    const hood = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.4, 0.45), stainlessMat);
    hood.position.set(0.6, 1.8, 0);
    group.add(hood);

    const fridgeMat = new THREE.MeshStandardMaterial({ color: '#E5E5E5', metalness: 0.5, roughness: 0.3 });
    const fridge = new THREE.Mesh(new THREE.BoxGeometry(0.85, 1.85, 0.75), fridgeMat);
    fridge.position.set(width / 2 - 0.45, 0.925, 0);
    fridge.castShadow = true;
    group.add(fridge);

    return group;
}

function createFireplace() {
    const group = new THREE.Group();
    const brickMat = new THREE.MeshStandardMaterial({ color: '#9A3B3B', roughness: 0.9 });
    const hearthMat = new THREE.MeshStandardMaterial({ color: '#2B2D42', roughness: 0.8 });

    const base = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.4, 0.5), brickMat);
    base.position.y = 0.7;
    base.castShadow = true;
    group.add(base);

    const fireBox = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.7, 0.4), hearthMat);
    fireBox.position.set(0, 0.45, 0.08);
    group.add(fireBox);

    const fireLight = new THREE.PointLight(0xFF6B35, 1.2, 4);
    fireLight.position.set(0, 0.5, 0.2);
    group.add(fireLight);

    const mantel = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.08, 0.6), new THREE.MeshStandardMaterial({ color: '#5C3D2E' }));
    mantel.position.set(0, 1.44, 0);
    group.add(mantel);

    return group;
}

function createPottedPlant() {
    const group = new THREE.Group();
    const potMat = new THREE.MeshStandardMaterial({ color: '#D97706', roughness: 0.8 });
    const leafMat = new THREE.MeshStandardMaterial({ color: '#15803D', roughness: 0.6 });

    const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.18, 0.45, 12), potMat);
    pot.position.y = 0.225;
    pot.castShadow = true;
    group.add(pot);

    for (let i = 0; i < 6; i++) {
        const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.22, 6, 6), leafMat);
        leaf.scale.set(0.6, 1.2, 0.2);
        const angle = (i / 6) * Math.PI * 2;
        leaf.position.set(Math.cos(angle) * 0.18, 0.55 + Math.random() * 0.1, Math.sin(angle) * 0.18);
        leaf.rotation.z = Math.cos(angle) * 0.5;
        leaf.rotation.x = Math.sin(angle) * 0.5;
        leaf.castShadow = true;
        group.add(leaf);
    }

    return group;
}

function createElevatorLift() {
    const group = new THREE.Group();
    const shaftMat = new THREE.MeshStandardMaterial({ color: '#334155', roughness: 0.5 });
    const doorMat = new THREE.MeshStandardMaterial({ color: '#CBD5E1', metalness: 0.8, roughness: 0.2 });

    const shaft = new THREE.Mesh(new THREE.BoxGeometry(2.6, 2.2, 2.4), shaftMat);
    shaft.position.y = 1.1;
    shaft.castShadow = true;
    group.add(shaft);

    const doorL = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.9, 0.05), doorMat);
    doorL.position.set(-0.46, 0.95, 1.21);
    group.add(doorL);

    const doorR = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.9, 0.05), doorMat);
    doorR.position.set(0.46, 0.95, 1.21);
    group.add(doorR);

    const btn = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.2, 0.04), new THREE.MeshStandardMaterial({ color: '#0284C7', emissive: '#0284C7', emissiveIntensity: 0.8 }));
    btn.position.set(1.05, 1.0, 1.22);
    group.add(btn);

    return group;
}

function createReceptionDesk() {
    const group = new THREE.Group();
    const deskMat = new THREE.MeshStandardMaterial({ color: '#1E293B', roughness: 0.4 });
    const topMat = new THREE.MeshStandardMaterial({ color: '#F8FAFC', roughness: 0.2 });

    const mainBody = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.9, 0.9), deskMat);
    mainBody.position.set(0, 0.45, 0);
    mainBody.castShadow = true;
    group.add(mainBody);

    const top = new THREE.Mesh(new THREE.BoxGeometry(3.3, 0.06, 0.95), topMat);
    top.position.set(0, 0.93, 0);
    top.castShadow = true;
    group.add(top);

    const monitor = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.4, 0.05), new THREE.MeshStandardMaterial({ color: '#0F172A' }));
    monitor.position.set(0, 1.18, 0.1);
    group.add(monitor);

    const chair = createChair('#0284C7');
    chair.position.set(0, 0, -0.7);
    group.add(chair);

    return group;
}

function createOfficeCubicle() {
    const group = new THREE.Group();
    const partMat = new THREE.MeshStandardMaterial({ color: '#64748B', roughness: 0.8 });
    const deskMat = new THREE.MeshStandardMaterial({ color: '#E2E8F0', roughness: 0.5 });

    const wallBack = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.25, 0.06), partMat);
    wallBack.position.set(0, 0.625, -0.8);
    wallBack.castShadow = true;
    group.add(wallBack);

    const wallSide = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.25, 1.6), partMat);
    wallSide.position.set(-0.9, 0.625, 0);
    wallSide.castShadow = true;
    group.add(wallSide);

    const desk = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.05, 0.7), deskMat);
    desk.position.set(0, 0.7, -0.4);
    desk.castShadow = true;
    group.add(desk);

    const pc = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.35, 0.05), new THREE.MeshStandardMaterial({ color: '#1E293B' }));
    pc.position.set(0, 0.95, -0.55);
    group.add(pc);

    const chair = createChair('#2563EB');
    chair.position.set(0, 0, 0.1);
    group.add(chair);

    return group;
}

function createChalkboard() {
    const group = new THREE.Group();
    const frameMat = new THREE.MeshStandardMaterial({ color: '#78350F' });
    const boardMat = new THREE.MeshStandardMaterial({ color: '#14532D', roughness: 0.9 });

    const board = new THREE.Mesh(new THREE.BoxGeometry(4.0, 1.3, 0.05), boardMat);
    board.position.set(0, 1.5, 0);
    board.castShadow = true;
    group.add(board);

    const frame = new THREE.Mesh(new THREE.BoxGeometry(4.1, 1.4, 0.03), frameMat);
    frame.position.set(0, 1.5, -0.02);
    group.add(frame);

    return group;
}

function createAreaRug(width, depth, texture) {
    const rug = new THREE.Mesh(
        new THREE.BoxGeometry(width, 0.015, depth),
        new THREE.MeshStandardMaterial({ map: texture, roughness: 0.9 })
    );
    rug.position.y = 0.01;
    rug.receiveShadow = true;
    return rug;
}

function createPerson(color = '#E63946') {
    const group = new THREE.Group();
    const bodyMat = new THREE.MeshStandardMaterial({ color, roughness: 0.6 });
    const headMat = new THREE.MeshStandardMaterial({ color: '#FFD166', roughness: 0.5 });

    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.95, 8), bodyMat);
    body.position.y = 0.475;
    body.castShadow = true;
    group.add(body);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.16, 8, 8), headMat);
    head.position.y = 1.1;
    head.castShadow = true;
    group.add(head);

    return group;
}

function createSeatedPerson(color = '#1D3557') {
    const group = new THREE.Group();
    const bodyMat = new THREE.MeshStandardMaterial({ color, roughness: 0.6 });
    const headMat = new THREE.MeshStandardMaterial({ color: '#FFD166', roughness: 0.5 });

    // Torso / Upper body
    const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.5, 8), bodyMat);
    torso.position.y = 0.7;
    torso.castShadow = true;
    group.add(torso);

    // Head
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.15, 8, 8), headMat);
    head.position.y = 1.02;
    head.castShadow = true;
    group.add(head);

    // Seated Legs (extending forward towards -z)
    const legs = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.12, 0.32), bodyMat);
    legs.position.set(0, 0.46, -0.12);
    legs.castShadow = true;
    group.add(legs);

    return group;
}

function addPersonToFloor(group, color, startX, endX, startZ, endZ, speed, axis) {
    const person = createPerson(color);
    person.position.set(startX, 0, startZ);
    group.add(person);

    interiorPeople.push({
        mesh: person,
        group,
        startX, endX, startZ, endZ,
        speed,
        t: Math.random(),
        direction: 1,
        axis
    });
}

function createRooftopDeckInterior(w = 22, d = 16) {
    const group = new THREE.Group();

    // 1. Weatherized Slate Roof Deck Surface
    const roofDeckMat = new THREE.MeshStandardMaterial({ color: '#334155', roughness: 0.8 });
    const roofSlab = new THREE.Mesh(new THREE.BoxGeometry(w, 0.06, d), roofDeckMat);
    group.add(roofSlab);

    // 2. Parapet Safety Perimeter Walls with Glass Railing
    const parapetMat = new THREE.MeshStandardMaterial({ color: '#475569', roughness: 0.7 });
    const glassRailMat = new THREE.MeshPhysicalMaterial({ color: '#38bdf8', transparent: true, opacity: 0.45, transmission: 0.8, side: THREE.DoubleSide });

    // Front & Back Parapets
    for (let pz of [-d / 2, d / 2]) {
        const wall = new THREE.Mesh(new THREE.BoxGeometry(w, 0.8, 0.25), parapetMat);
        wall.position.set(0, 0.4, pz);
        group.add(wall);

        const rail = new THREE.Mesh(new THREE.BoxGeometry(w - 0.2, 0.6, 0.05), glassRailMat);
        rail.position.set(0, 1.1, pz);
        group.add(rail);
    }
    // Left & Right Parapets
    for (let px of [-w / 2, w / 2]) {
        const wall = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.8, d), parapetMat);
        wall.position.set(px, 0.4, 0);
        group.add(wall);

        const rail = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.6, d - 0.2), glassRailMat);
        rail.position.set(px, 1.1, 0);
        group.add(rail);
    }

    // 3. Central Elevator Machine Penthouse & Stairwell Entry
    const pentMat = new THREE.MeshStandardMaterial({ color: '#1e293b', roughness: 0.5 });
    const penthouse = new THREE.Mesh(new THREE.BoxGeometry(4.2, 2.5, 3.8), pentMat);
    penthouse.position.set(0, 1.25, -d / 4);
    penthouse.castShadow = true;
    group.add(penthouse);

    const pentRoof = new THREE.Mesh(new THREE.BoxGeometry(4.6, 0.15, 4.2), parapetMat);
    pentRoof.position.set(0, 2.55, -d / 4);
    group.add(pentRoof);

    const door = new THREE.Mesh(new THREE.BoxGeometry(1.0, 1.9, 0.05), new THREE.MeshStandardMaterial({ color: '#0f172a' }));
    door.position.set(0, 0.95, -d / 4 + 1.92);
    group.add(door);

    // 4. Industrial HVAC Chiller Air Handling Units
    const chillerMat = new THREE.MeshStandardMaterial({ color: '#94a3b8', metalness: 0.8, roughness: 0.3 });
    const fanMat = new THREE.MeshStandardMaterial({ color: '#09090b' });
    for (let cX of [-w / 3.2, w / 3.2]) {
        const chiller = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.2, 1.4), chillerMat);
        chiller.position.set(cX, 0.6, -d / 3.2);
        chiller.castShadow = true;
        group.add(chiller);

        for (let fx of [-0.6, 0.6]) {
            const fan = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.08, 16), fanMat);
            fan.position.set(cX + fx, 1.24, -d / 3.2);
            group.add(fan);
        }
    }

    // 5. Glass Skylight Domes
    const skyMat = new THREE.MeshPhysicalMaterial({ color: '#38bdf8', transparent: true, opacity: 0.6, transmission: 0.85 });
    for (let sX of [-w / 4, w / 4]) {
        const frame = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.2, 1.8), parapetMat);
        frame.position.set(sX, 0.1, d / 4);
        const dome = new THREE.Mesh(new THREE.SphereGeometry(0.8, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), skyMat);
        dome.position.set(sX, 0.2, d / 4);
        group.add(frame, dome);
    }

    // 6. Rooftop Sky Lounge & Wooden Pergola Deck Area
    const deckWoodMat = new THREE.MeshStandardMaterial({ map: woodTex, roughness: 0.5 });
    const loungeDeck = new THREE.Mesh(new THREE.BoxGeometry(7.5, 0.08, 5.5), deckWoodMat);
    loungeDeck.position.set(0, 0.04, d / 4);
    group.add(loungeDeck);

    const sofa = createSofa('#0284c7');
    sofa.position.set(-1.8, 0.08, d / 4);
    group.add(sofa);

    const coffeeTable = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.4, 0.8), new THREE.MeshStandardMaterial({ color: '#0f172a' }));
    coffeeTable.position.set(0.6, 0.2, d / 4);
    group.add(coffeeTable);

    // Potted Palm Trees on Roof
    for (let pX of [-2.8, 2.8]) {
        const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.25, 0.6, 12), parapetMat);
        pot.position.set(pX, 0.38, d / 4 + 2);
        const plant = new THREE.Mesh(new THREE.SphereGeometry(0.55, 8, 8), new THREE.MeshStandardMaterial({ color: '#15803d' }));
        plant.position.set(pX, 0.9, d / 4 + 2);
        group.add(pot, plant);
    }

    // People relaxing on Roof Deck
    addPersonToFloor(group, '#e11d48', 1.0, 1.0, d / 4, d / 4, 0.1, 'x');
    addPersonToFloor(group, '#0284c7', -1.5, -1.5, d / 4, d / 4, 0.1, 'x');

    return group;
}

// ============================================================
// Floor Construction by Building Type
// ============================================================

export function createFloorInterior(buildingType, floorIndex) {
    const totalFloors = getFloorCount(buildingType);
    const isRoof = (floorIndex === totalFloors - 1) && (totalFloors > 1);

    let floorHeight = 3.3;
    if (buildingType === 'modern-villa' || buildingType === 'contemporary-house') floorHeight = 3.5;
    if (buildingType === 'apartment') floorHeight = 3.0;
    if (buildingType === 'university') floorHeight = 3.6;
    if (buildingType === 'cathedral') floorHeight = 20;

    // ROOF FLOOR (R) RENDERS OPEN-AIR ROOFTOP DECK & SKY LOUNGE
    if (isRoof) {
        let rw = 22, rd = 16;
        if (buildingType === 'apartment') { rw = 22; rd = 12; }
        else if (buildingType === 'glass-corporate') { rw = 18; rd = 18; }
        else if (buildingType === 'university') { rw = 36; rd = 22; }
        else if (buildingType === 'modern-villa') { rw = 14; rd = 12; }
        else if (buildingType === 'contemporary-house') { rw = 12; rd = 10; }

        const roofGroup = createRooftopDeckInterior(rw, rd);
        roofGroup.position.y = floorIndex * floorHeight + 0.05;
        return roofGroup;
    }

    const group = new THREE.Group();
    group.position.y = floorIndex * floorHeight + 0.05;

    // MODERN VILLA - Full Detailed Match to Reference Image
    if (buildingType === 'modern-villa') {
        // Bedroom Floor (Wood)
        const bedFloor = new THREE.Mesh(new THREE.BoxGeometry(6, 0.04, 6), new THREE.MeshStandardMaterial({ map: woodTex, roughness: 0.5 }));
        bedFloor.position.set(-4, 0, 3);
        group.add(bedFloor);

        // Living Room Floor (Wood)
        const livingFloor = new THREE.Mesh(new THREE.BoxGeometry(8, 0.04, 8), new THREE.MeshStandardMaterial({ map: woodTex, roughness: 0.5 }));
        livingFloor.position.set(3, 0, 2);
        group.add(livingFloor);

        // Kitchen Floor (White Tile)
        const kitchenFloor = new THREE.Mesh(new THREE.BoxGeometry(5, 0.04, 8), new THREE.MeshStandardMaterial({ map: whiteTileTex, roughness: 0.4 }));
        kitchenFloor.position.set(8.5, 0, 2);
        group.add(kitchenFloor);

        // Bathroom Floor (Blue Tile)
        const bathFloor = new THREE.Mesh(new THREE.BoxGeometry(6, 0.04, 4), new THREE.MeshStandardMaterial({ map: blueTileTex, roughness: 0.3 }));
        bathFloor.position.set(-4, 0, -3);
        group.add(bathFloor);

        // Dark Wall Partitions
        const wallMat = new THREE.MeshStandardMaterial({ color: '#2B2D42', roughness: 0.8 });
        const addWall = (w, h, d, x, z) => {
            const wall = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), wallMat);
            wall.position.set(x, h / 2, z);
            wall.castShadow = true;
            wall.receiveShadow = true;
            group.add(wall);
        };

        // Outer & Interior Wall Borders
        addWall(19.5, 2.2, 0.15, 2, 6.0);
        addWall(19.5, 2.2, 0.15, 2, -5.0);
        addWall(0.15, 2.2, 11, -7.0, 0.5);
        addWall(0.15, 2.2, 11, 11.0, 0.5);
        addWall(0.15, 2.2, 11, -1.0, 0.5);
        addWall(0.15, 2.2, 11, 6.0, 0.5);
        addWall(6, 2.2, 0.15, -4, 0.0);

        // --- ROOM 1: BEDROOM (Top-Left) ---
        const bed = createBed();
        bed.position.set(-4, 0, 4.2);
        group.add(bed);

        const bedRug = createAreaRug(2.4, 2.0, createRugTexture('boho'));
        bedRug.position.set(-4, 0, 3.2);
        group.add(bedRug);

        const desk = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.05, 0.6), new THREE.MeshStandardMaterial({ color: '#5C3D2E' }));
        desk.position.set(-1.8, 0.7, 2.5);
        group.add(desk);

        const chair = createChair('#3A7D44');
        chair.position.set(-1.8, 0, 3.1);
        group.add(chair);

        // --- ROOM 2: LIVING ROOM (Center) ---
        const rug = createAreaRug(3.2, 2.4, createRugTexture('boho'));
        rug.position.set(2.5, 0, 2.5);
        group.add(rug);

        const sofa = createSofa('#E0A96D');
        sofa.position.set(3.8, 0, 2.5);
        sofa.rotation.y = -Math.PI / 2;
        group.add(sofa);

        const armchair = createArmchair('#D95D39');
        armchair.position.set(1.2, 0, 1.2);
        armchair.rotation.y = Math.PI / 4;
        group.add(armchair);

        const coffeeTable = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.35, 0.6), new THREE.MeshStandardMaterial({ color: '#6A4A3C' }));
        coffeeTable.position.set(2.5, 0.18, 2.5);
        coffeeTable.castShadow = true;
        group.add(coffeeTable);

        const fireplace = createFireplace();
        fireplace.position.set(-0.6, 0, 3.5);
        fireplace.rotation.y = Math.PI / 2;
        group.add(fireplace);

        const plant1 = createPottedPlant();
        plant1.position.set(0.0, 0, 5.0);
        group.add(plant1);

        const plant2 = createPottedPlant();
        plant2.position.set(5.0, 0, 5.0);
        group.add(plant2);

        // Dining Table Section
        const diningTable = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 0.05, 16), new THREE.MeshStandardMaterial({ color: '#6A4A3C' }));
        diningTable.position.set(2.5, 0.7, -2.5);
        group.add(diningTable);

        [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].forEach(angle => {
            const c = createChair('#E9C46A');
            c.position.set(2.5 + Math.cos(angle) * 0.9, 0, -2.5 + Math.sin(angle) * 0.9);
            c.rotation.y = -angle + Math.PI / 2;
            group.add(c);
        });

        // --- ROOM 3: KITCHEN (Right) ---
        const kitchen = createFullKitchen(4.0);
        kitchen.position.set(8.5, 0, 5.3);
        group.add(kitchen);

        // --- ROOM 4: BATHROOM (Bottom-Left) ---
        const tub = createBathtub();
        tub.position.set(-5.0, 0, -3.2);
        group.add(tub);

        const toilet = createToilet();
        toilet.position.set(-1.8, 0, -4.0);
        group.add(toilet);

        const sink = createSink();
        sink.position.set(-1.8, 0, -2.0);
        sink.rotation.y = -Math.PI / 2;
        group.add(sink);

        // Occupants
        addPersonToFloor(group, '#E63946', 2.0, 4.0, 2.0, 2.0, 0.5, 'x');
        addPersonToFloor(group, '#457B9D', -3.0, -3.0, 1.0, 4.0, 0.4, 'z');

    } else if (buildingType === 'cathedral') {
        // --- CATHEDRAL INTERIOR (Exact Specification) ---
        // 1. Polished Cathedral Stone Floor
        const stoneFloorMat = new THREE.MeshStandardMaterial({ color: '#3D3B38', roughness: 0.4 });
        const cathedralFloor = new THREE.Mesh(new THREE.BoxGeometry(26, 0.04, 44), stoneFloorMat);
        cathedralFloor.position.set(0, 0, 0);
        cathedralFloor.receiveShadow = true;
        group.add(cathedralFloor);

        // 2. Central Aisle Path (Red Carpet Runner from entrance to pulpit)
        const carpetMat = new THREE.MeshStandardMaterial({ color: '#8B0000', roughness: 0.8 });
        const centralAisle = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.02, 32), carpetMat);
        centralAisle.position.set(0, 0.015, 2);
        centralAisle.receiveShadow = true;
        group.add(centralAisle);

        // 3. Raised Pulpit / Altar Platform in Front (z = -13)
        const platformMat = new THREE.MeshStandardMaterial({ color: '#5C4033', roughness: 0.5 });
        const platform = new THREE.Mesh(new THREE.BoxGeometry(12, 0.35, 6), platformMat);
        platform.position.set(0, 0.175, -13);
        platform.castShadow = true;
        platform.receiveShadow = true;
        group.add(platform);

        // 4. Wooden Pulpit / Lectern
        const pulpitGroup = new THREE.Group();
        const woodMat = new THREE.MeshStandardMaterial({ color: '#3E2508', roughness: 0.6 });
        const pulpitBase = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.2, 0.8), woodMat);
        pulpitBase.position.y = 0.6;
        pulpitBase.castShadow = true;
        pulpitGroup.add(pulpitBase);

        const pulpitTop = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.1, 0.9), woodMat);
        pulpitTop.position.set(0, 1.25, 0);
        pulpitTop.rotation.x = -Math.PI / 12; // Sloped top for holy scriptures
        pulpitTop.castShadow = true;
        pulpitGroup.add(pulpitTop);
        pulpitGroup.position.set(0, 0.35, -11.5);
        group.add(pulpitGroup);

        // 5. Golden Altar Cross & Altar Table
        const altarTable = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.9, 1.2), new THREE.MeshStandardMaterial({ color: '#FFFFFF', roughness: 0.3 }));
        altarTable.position.set(0, 0.8, -14.8);
        altarTable.castShadow = true;
        group.add(altarTable);

        const goldMat = new THREE.MeshStandardMaterial({ color: '#FFD700', metalness: 0.9, roughness: 0.2 });
        const crossV = new THREE.Mesh(new THREE.BoxGeometry(0.18, 2.2, 0.18), goldMat);
        crossV.position.set(0, 2.3, -15.5);
        group.add(crossV);
        const crossH = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.18, 0.18), goldMat);
        crossH.position.set(0, 2.7, -15.5);
        group.add(crossH);

        // 6. Altar Candles
        [-2.5, 2.5].forEach(x => {
            const candle = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.8, 12), new THREE.MeshStandardMaterial({ color: '#FFFDD0' }));
            candle.position.set(x, 0.75, -14.0);
            group.add(candle);

            const flame = new THREE.PointLight(0xFFB703, 0.8, 6);
            flame.position.set(x, 1.2, -14.0);
            group.add(flame);
        });

        // 7. Wooden Chairs / Pews Covering the Whole Area
        const pewWoodMat = new THREE.MeshStandardMaterial({ color: '#5C3D2E', roughness: 0.7 });
        const createPew = () => {
            const pew = new THREE.Group();
            const seat = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.1, 0.55), pewWoodMat);
            seat.position.y = 0.45;
            seat.castShadow = true;
            pew.add(seat);

            const back = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.55, 0.08), pewWoodMat);
            back.position.set(0, 0.725, 0.23);
            back.castShadow = true;
            pew.add(back);

            [-2.4, 2.4].forEach(px => {
                const side = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.75, 0.6), pewWoodMat);
                side.position.set(px, 0.375, 0);
                side.castShadow = true;
                pew.add(side);
            });
            return pew;
        };

        // Fill entire main nave with 10 rows of pews on both sides of central aisle
        const attendeeColors = ['#1D3557', '#457B9D', '#E63946', '#2A9D8F', '#E76F51', '#6A4C93', '#3A7D44', '#8D99AE', '#B5838D', '#3D5A80', '#2B2D42', '#D95D39'];
        const pewOffsets = [-1.8, -0.6, 0.6, 1.8];

        for (let row = 0; row < 10; row++) {
            const zPos = 15.0 - row * 2.7;

            // Left Side Pews
            const leftPew = createPew();
            leftPew.position.set(-5.5, 0, zPos);
            group.add(leftPew);

            // Right Side Pews
            const rightPew = createPew();
            rightPew.position.set(5.5, 0, zPos);
            group.add(rightPew);

            // Add seated worshippers on Left Pews
            pewOffsets.forEach((offX, i) => {
                // Populate ~75% of seats deterministically for a realistic filled church
                if ((row + i) % 4 !== 0) {
                    const personColor = attendeeColors[(row * 4 + i) % attendeeColors.length];
                    const seatedPerson = createSeatedPerson(personColor);
                    seatedPerson.position.set(-5.5 + offX, 0, zPos - 0.05);
                    group.add(seatedPerson);
                }
            });

            // Add seated worshippers on Right Pews
            pewOffsets.forEach((offX, i) => {
                if ((row + i + 1) % 4 !== 0) {
                    const personColor = attendeeColors[(row * 4 + i + 3) % attendeeColors.length];
                    const seatedPerson = createSeatedPerson(personColor);
                    seatedPerson.position.set(5.5 + offX, 0, zPos - 0.05);
                    group.add(seatedPerson);
                }
            });
        }

        // 8. Preacher & People (No House Furniture)
        // Preacher at pulpit
        const preacher = createPerson('#1A1A1A');
        preacher.position.set(0, 0.35, -11.0);
        group.add(preacher);

        // Congregation walking down central aisle
        addPersonToFloor(group, '#457B9D', 0, 0, -8, 14, 0.4, 'z');
        addPersonToFloor(group, '#E63946', 0, 0, 10, -4, 0.3, 'z');

    } else if (buildingType === 'university') {
        // --- UNIVERSITY INTERIOR ---
        const uniFloor = new THREE.Mesh(new THREE.BoxGeometry(32, 0.04, 20), new THREE.MeshStandardMaterial({ map: woodTex, roughness: 0.5 }));
        group.add(uniFloor);

        // Central Elevator / Lift
        const lift = createElevatorLift();
        lift.position.set(0, 0, -6);
        group.add(lift);

        if (floorIndex === 0) {
            // Floor 0: Grand Auditorium / Lecture Hall
            const podium = new THREE.Mesh(new THREE.BoxGeometry(4, 0.4, 2.5), new THREE.MeshStandardMaterial({ color: '#1E293B' }));
            podium.position.set(0, 0.2, -6.5);
            group.add(podium);

            for (let row = 0; row < 4; row++) {
                const rowZ = -2 + row * 2.8;
                for (let c = 0; c < 5; c++) {
                    const deskL = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.05, 0.6), new THREE.MeshStandardMaterial({ color: '#4A2C11' }));
                    deskL.position.set(-11 + c * 2.1, 0.7, rowZ);
                    group.add(deskL);

                    const chairL = createChair('#334155');
                    chairL.position.set(-11 + c * 2.1, 0, rowZ + 0.35);
                    group.add(chairL);

                    const deskR = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.05, 0.6), new THREE.MeshStandardMaterial({ color: '#4A2C11' }));
                    deskR.position.set(1 + c * 2.1, 0.7, rowZ);
                    group.add(deskR);

                    const chairR = createChair('#334155');
                    chairR.position.set(1 + c * 2.1, 0, rowZ + 0.35);
                    group.add(chairR);
                }
            }

            const professor = createPerson('#1E1B4B');
            professor.position.set(0, 0, -5.5);
            group.add(professor);

        } else if (floorIndex === 1) {
            // Floor 1: Science & Computer Laboratories
            const labMat = new THREE.MeshStandardMaterial({ color: '#0F172A', roughness: 0.3 });
            for (let r = 0; r < 2; r++) {
                const z = -2 + r * 5;
                const benchL = new THREE.Mesh(new THREE.BoxGeometry(8, 0.85, 1.2), labMat);
                benchL.position.set(-6, 0.425, z);
                benchL.castShadow = true;
                group.add(benchL);

                const benchR = new THREE.Mesh(new THREE.BoxGeometry(8, 0.85, 1.2), labMat);
                benchR.position.set(6, 0.425, z);
                benchR.castShadow = true;
                group.add(benchR);

                for (let i = 0; i < 4; i++) {
                    const pcL = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.35, 0.05), new THREE.MeshStandardMaterial({ color: '#38BDF8' }));
                    pcL.position.set(-8.5 + i * 1.8, 1.05, z);
                    group.add(pcL);

                    const pcR = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.35, 0.05), new THREE.MeshStandardMaterial({ color: '#38BDF8' }));
                    pcR.position.set(3.5 + i * 1.8, 1.05, z);
                    group.add(pcR);
                }
            }
            addPersonToFloor(group, '#0284C7', -8, 8, 2, 2, 0.5, 'x');

        } else if (floorIndex === 2) {
            // Floor 2: University Library
            for (let i = 0; i < 6; i++) {
                const bs = createBookshelf('#78350F');
                bs.position.set(-11 + i * 4.2, 0, 3);
                group.add(bs);
            }
            const readTable = new THREE.Mesh(new THREE.BoxGeometry(6.0, 0.05, 1.8), new THREE.MeshStandardMaterial({ color: '#5C4033' }));
            readTable.position.set(0, 0.7, -3.0);
            readTable.castShadow = true;
            group.add(readTable);

            addPersonToFloor(group, '#B45309', -6, 6, -3, -3, 0.3, 'x');

        } else {
            // Faculty Offices & Student Lounge
            for (let i = 0; i < 4; i++) {
                const cub = createOfficeCubicle();
                cub.position.set(-9 + i * 5, 0, 2);
                group.add(cub);
            }
            const sofa = createSofa('#047857');
            sofa.position.set(0, 0, -4);
            group.add(sofa);

            addPersonToFloor(group, '#047857', -6, 6, -4, -4, 0.4, 'x');
        }

    } else if (buildingType === 'office-building' || buildingType === 'glass-corporate') {
        // OFFICE BUILDING FLOORS
        const officeFloor = new THREE.Mesh(new THREE.BoxGeometry(22, 0.04, 16), new THREE.MeshStandardMaterial({ color: '#F1F5F9', roughness: 0.4 }));
        group.add(officeFloor);

        if (floorIndex === 0) {
            // GROUND FLOOR: Reception Desk & Elevator Lift
            const reception = createReceptionDesk();
            reception.position.set(0, 0, 2.0);
            group.add(reception);

            const sofaL = createSofa('#334155');
            sofaL.position.set(-6.5, 0, 3.0);
            group.add(sofaL);

            const sofaR = createSofa('#334155');
            sofaR.position.set(6.5, 0, 3.0);
            group.add(sofaR);

            addPersonToFloor(group, '#0F172A', -5, 5, 2, 2, 0.6, 'x');
            addPersonToFloor(group, '#2563EB', 0, 0, -3, 3, 0.5, 'z');

        } else {
            // INDOOR OFFICE FLOORS: Office Cubicles & Workstations
            for (let r = 0; r < 2; r++) {
                const z = -1.5 + r * 4.2;
                for (let c = 0; c < 4; c++) {
                    const cubL = createOfficeCubicle();
                    cubL.position.set(-7.5 + c * 2.2, 0, z);
                    group.add(cubL);

                    const cubR = createOfficeCubicle();
                    cubR.position.set(2.0 + c * 2.2, 0, z);
                    group.add(cubR);
                }
            }

            const confTable = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.05, 1.4), new THREE.MeshStandardMaterial({ color: '#1E293B' }));
            confTable.position.set(0, 0.7, 5.5);
            group.add(confTable);

            addPersonToFloor(group, '#2563EB', -6, 6, 0, 0, 0.5, 'x');
        }

    } else {
        // RESIDENTIAL HOUSES & APARTMENTS
        const resFloor = new THREE.Mesh(new THREE.BoxGeometry(20, 0.04, 15), new THREE.MeshStandardMaterial({ map: woodTex, roughness: 0.5 }));
        group.add(resFloor);

        const sofa = createSofa('#E0A96D');
        sofa.position.set(-4, 0, 3);
        group.add(sofa);

        const bed = createBed();
        bed.position.set(4, 0, 3);
        group.add(bed);

        const bath = createBathtub();
        bath.position.set(-5, 0, -4);
        group.add(bath);

        const kitchen = createFullKitchen(3.5);
        kitchen.position.set(4, 0, -4);
        group.add(kitchen);

        addPersonToFloor(group, '#E63946', -2, 2, 0, 0, 0.5, 'x');
    }

    return group;
}

export function updateInteriorAnimations(deltaTime) {
    elapsedTime += deltaTime;
    interiorPeople.forEach(p => {
        p.t += p.speed * deltaTime * p.direction;
        if (p.t > 1) {
            p.t = 1;
            p.direction = -1;
        } else if (p.t < 0) {
            p.t = 0;
            p.direction = 1;
        }

        if (p.axis === 'x') {
            p.mesh.position.x = p.startX + (p.endX - p.startX) * p.t;
        } else {
            p.mesh.position.z = p.startZ + (p.endZ - p.startZ) * p.t;
        }

        p.mesh.position.y = Math.sin(elapsedTime * 5) * 0.02;
    });
}

export function disposeInterior(group) {
    for (let i = interiorPeople.length - 1; i >= 0; i--) {
        if (interiorPeople[i].group === group) {
            interiorPeople.splice(i, 1);
        }
    }

    group.traverse((child) => {
        if (child.isMesh) {
            child.geometry.dispose();
            if (child.material.isMaterial) {
                if (child.material.map) child.material.map.dispose();
                child.material.dispose();
            } else if (Array.isArray(child.material)) {
                child.material.forEach(m => {
                    if (m.map) m.map.dispose();
                    m.dispose();
                });
            }
        }
    });
}
