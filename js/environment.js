import * as THREE from 'three';

// --- Global State ---
let envObjects = [];
let vehicles = [];
let pedestrians = [];
let fountainWaterMesh = null;

// Track created geometries and materials for proper disposal
let _geometries = [];
let _materials = [];

function registerGeometry(geo) {
    _geometries.push(geo);
    return geo;
}

function registerMaterial(mat) {
    _materials.push(mat);
    return mat;
}

function registerObject(obj, scene) {
    envObjects.push(obj);
    scene.add(obj);
    return obj;
}

// --- Environment Creation ---

export function createEnvironment(scene) {
    createRoadsAndSidewalks(scene);
    createStreetlights(scene);
    createPark(scene);
    createParkingLot(scene);
    createBackgroundCity(scene);
    
    setupTraffic(scene);
    setupPedestrians(scene);
}

function createRoadsAndSidewalks(scene) {
    const roadMat = registerMaterial(new THREE.MeshLambertMaterial({ color: 0x333333 }));
    const lineMatYellow = registerMaterial(new THREE.MeshBasicMaterial({ color: 0xe5c100 }));
    const lineMatWhite = registerMaterial(new THREE.MeshBasicMaterial({ color: 0xffffff }));
    const sidewalkMat = registerMaterial(new THREE.MeshLambertMaterial({ color: 0x999999 }));

    // North Road
    const nRoadGeo = registerGeometry(new THREE.BoxGeometry(212, 0.05, 12));
    const nRoad = new THREE.Mesh(nRoadGeo, roadMat);
    nRoad.position.set(0, 0.025, 75);
    nRoad.receiveShadow = true;
    registerObject(nRoad, scene);

    // South Road
    const sRoadGeo = registerGeometry(new THREE.BoxGeometry(212, 0.05, 12));
    const sRoad = new THREE.Mesh(sRoadGeo, roadMat);
    sRoad.position.set(0, 0.025, -75);
    sRoad.receiveShadow = true;
    registerObject(sRoad, scene);

    // East Road
    const eRoadGeo = registerGeometry(new THREE.BoxGeometry(12, 0.05, 138));
    const eRoad = new THREE.Mesh(eRoadGeo, roadMat);
    eRoad.position.set(100, 0.025, 0);
    eRoad.receiveShadow = true;
    registerObject(eRoad, scene);

    // West Road
    const wRoadGeo = registerGeometry(new THREE.BoxGeometry(12, 0.05, 138));
    const wRoad = new THREE.Mesh(wRoadGeo, roadMat);
    wRoad.position.set(-100, 0.025, 0);
    wRoad.receiveShadow = true;
    registerObject(wRoad, scene);
    
    // Intersections (Corners)
    const cornerGeo = registerGeometry(new THREE.BoxGeometry(12, 0.05, 12));
    const corners = [
        [100, 75], [-100, 75], [100, -75], [-100, -75]
    ];
    corners.forEach(pos => {
        const cMesh = new THREE.Mesh(cornerGeo, roadMat);
        cMesh.position.set(pos[0], 0.025, pos[1]);
        cMesh.receiveShadow = true;
        registerObject(cMesh, scene);
    });

    // Sidewalks (elevated 0.1, width 3, inside roads, offset ~6 inward from center)
    // North sidewalk (inside is z = 69)
    const nSidewalkGeo = registerGeometry(new THREE.BoxGeometry(188, 0.1, 3));
    const nSidewalk = new THREE.Mesh(nSidewalkGeo, sidewalkMat);
    nSidewalk.position.set(0, 0.05, 69);
    nSidewalk.receiveShadow = true;
    nSidewalk.castShadow = true;
    registerObject(nSidewalk, scene);

    // South sidewalk (z = -69)
    const sSidewalk = new THREE.Mesh(nSidewalkGeo, sidewalkMat);
    sSidewalk.position.set(0, 0.05, -69);
    sSidewalk.receiveShadow = true;
    sSidewalk.castShadow = true;
    registerObject(sSidewalk, scene);

    // East sidewalk (x = 94)
    const eSidewalkGeo = registerGeometry(new THREE.BoxGeometry(3, 0.1, 135));
    const eSidewalk = new THREE.Mesh(eSidewalkGeo, sidewalkMat);
    eSidewalk.position.set(94, 0.05, 0);
    eSidewalk.receiveShadow = true;
    eSidewalk.castShadow = true;
    registerObject(eSidewalk, scene);

    // West sidewalk (x = -94)
    const wSidewalk = new THREE.Mesh(eSidewalkGeo, sidewalkMat);
    wSidewalk.position.set(-94, 0.05, 0);
    wSidewalk.receiveShadow = true;
    wSidewalk.castShadow = true;
    registerObject(wSidewalk, scene);
}

function createStreetlights(scene) {
    const poleMat = registerMaterial(new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.8 }));
    const bulbMat = registerMaterial(new THREE.MeshBasicMaterial({ color: 0xffffff }));
    const poleGeo = registerGeometry(new THREE.CylinderGeometry(0.1, 0.15, 5, 8));
    const armGeo = registerGeometry(new THREE.CylinderGeometry(0.05, 0.05, 1.5, 8));
    const bulbGeo = registerGeometry(new THREE.SphereGeometry(0.2, 8, 8));

    const positions = [
        [50, 68], [-50, 68], [50, -68], [-50, -68],
        [93, 40], [93, -40], [-93, 40], [-93, -40]
    ];

    positions.forEach(pos => {
        const group = new THREE.Group();
        group.position.set(pos[0], 0, pos[1]);

        const pole = new THREE.Mesh(poleGeo, poleMat);
        pole.position.y = 2.5;
        pole.castShadow = true;
        group.add(pole);

        const arm = new THREE.Mesh(armGeo, poleMat);
        arm.position.set(0, 4.8, 0.5);
        arm.rotation.x = Math.PI / 2;
        group.add(arm);

        const bulb = new THREE.Mesh(bulbGeo, bulbMat);
        bulb.position.set(0, 4.8, 1.25);
        group.add(bulb);

        const light = new THREE.PointLight(0xfff5b6, 0.8, 30);
        light.position.set(0, 4.5, 1.25);
        light.castShadow = false; // Disable to save performance
        group.add(light);
        
        // Point arm towards road
        if(Math.abs(pos[1]) === 68) {
            group.rotation.y = pos[1] > 0 ? 0 : Math.PI;
        } else {
            group.rotation.y = pos[0] > 0 ? Math.PI/2 : -Math.PI/2;
        }

        registerObject(group, scene);
    });
}

function createPark(scene) {
    const parkGroup = new THREE.Group();
    parkGroup.position.set(125, 0, 110);

    const grassMat = registerMaterial(new THREE.MeshLambertMaterial({ color: 0x2d4c1e }));
    const padGeo = registerGeometry(new THREE.BoxGeometry(20, 0.1, 20));
    const pad = new THREE.Mesh(padGeo, grassMat);
    pad.position.y = 0.05;
    pad.receiveShadow = true;
    parkGroup.add(pad);

    // Trees
    const trunkMat = registerMaterial(new THREE.MeshLambertMaterial({ color: 0x4a3728 }));
    const leavesMat = registerMaterial(new THREE.MeshLambertMaterial({ color: 0x1a4314 }));
    const trunkGeo = registerGeometry(new THREE.CylinderGeometry(0.2, 0.3, 1.5));
    const leavesGeo = registerGeometry(new THREE.ConeGeometry(1.5, 3, 8));

    for(let i = 0; i < 8; i++) {
        const tree = new THREE.Group();
        const trunk = new THREE.Mesh(trunkGeo, trunkMat);
        trunk.position.y = 0.75;
        trunk.castShadow = true;
        
        const leaves = new THREE.Mesh(leavesGeo, leavesMat);
        leaves.position.y = 2.5;
        leaves.castShadow = true;

        tree.add(trunk);
        tree.add(leaves);
        
        const angle = (i / 8) * Math.PI * 2;
        const radius = 6 + Math.random() * 2;
        tree.position.set(Math.cos(angle)*radius, 0.1, Math.sin(angle)*radius);
        parkGroup.add(tree);
    }

    // Pond
    const pondMat = registerMaterial(new THREE.MeshLambertMaterial({ color: 0x333333 }));
    const waterMat = registerMaterial(new THREE.MeshPhysicalMaterial({ color: 0x4aa3df, transparent: true, opacity: 0.8 }));
    const pondGeo = registerGeometry(new THREE.CylinderGeometry(3, 3, 0.2, 16));
    const pond = new THREE.Mesh(pondGeo, pondMat);
    pond.position.y = 0.1;
    parkGroup.add(pond);

    const waterGeo = registerGeometry(new THREE.CylinderGeometry(2.8, 2.8, 0.22, 16));
    const water = new THREE.Mesh(waterGeo, waterMat);
    water.position.y = 0.11;
    parkGroup.add(water);

    // Fountain
    const fountainMat = registerMaterial(new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.6 }));
    const fountainGeo = registerGeometry(new THREE.ConeGeometry(0.5, 2, 8));
    fountainWaterMesh = new THREE.Mesh(fountainGeo, fountainMat);
    fountainWaterMesh.position.y = 1;
    parkGroup.add(fountainWaterMesh);

    registerObject(parkGroup, scene);
}

function createParkingLot(scene) {
    const lotGroup = new THREE.Group();
    lotGroup.position.set(-125, 0, 110);

    const asphaltMat = registerMaterial(new THREE.MeshLambertMaterial({ color: 0x333333 }));
    const padGeo = registerGeometry(new THREE.BoxGeometry(20, 0.08, 15));
    const pad = new THREE.Mesh(padGeo, asphaltMat);
    pad.position.y = 0.04;
    pad.receiveShadow = true;
    lotGroup.add(pad);

    // Parked Cars
    const colors = [0xff0000, 0x0000ff, 0x00ff00, 0xaaaaaa, 0x222222, 0xdddddd];
    for (let i = 0; i < 6; i++) {
        const carGroup = createVehicleModel('car', colors[i]);
        carGroup.position.set(-7 + (i % 3) * 7, 0.3, i < 3 ? -4 : 4);
        if (i >= 3) carGroup.rotation.y = Math.PI;
        lotGroup.add(carGroup);
    }

    registerObject(lotGroup, scene);
}

function createBackgroundCity(scene) {
    const bldgMat = registerMaterial(new THREE.MeshLambertMaterial({ color: 0x444444 }));
    const winMat = registerMaterial(new THREE.MeshBasicMaterial({ color: 0xffffaa }));

    for (let i = 0; i < 15; i++) {
        const angle = -Math.PI/4 + (i / 15) * Math.PI * 1.5;
        const radius = 175 + Math.random() * 50;
        
        const width = 10 + Math.random() * 10;
        const depth = 10 + Math.random() * 10;
        const height = 15 + Math.random() * 25;

        const bldgGeo = registerGeometry(new THREE.BoxGeometry(width, height, depth));
        const bldg = new THREE.Mesh(bldgGeo, bldgMat);
        
        bldg.position.set(Math.cos(angle) * radius, height/2, Math.sin(angle) * radius);
        bldg.rotation.y = -angle;
        bldg.castShadow = true;
        bldg.receiveShadow = true;

        registerObject(bldg, scene);
    }
}

// --- Traffic System ---

function createVehicleModel(type, colorHex = 0xffffff) {
    const group = new THREE.Group();
    const bodyMat = registerMaterial(new THREE.MeshLambertMaterial({ color: colorHex }));
    const wheelMat = registerMaterial(new THREE.MeshLambertMaterial({ color: 0x111111 }));
    const lightMatF = registerMaterial(new THREE.MeshBasicMaterial({ color: 0xffffff }));
    const lightMatR = registerMaterial(new THREE.MeshBasicMaterial({ color: 0xff0000 }));

    if (type === 'car') {
        const bodyGeo = registerGeometry(new THREE.BoxGeometry(1.5, 0.8, 3));
        const roofGeo = registerGeometry(new THREE.BoxGeometry(1.3, 0.6, 1.5));
        
        const body = new THREE.Mesh(bodyGeo, bodyMat);
        body.position.y = 0.6;
        body.castShadow = true;
        const roof = new THREE.Mesh(roofGeo, bodyMat);
        roof.position.set(0, 1.3, -0.2);
        roof.castShadow = true;

        group.add(body);
        group.add(roof);

        // Wheels
        const wGeo = registerGeometry(new THREE.CylinderGeometry(0.3, 0.3, 0.2, 8));
        wGeo.rotateZ(Math.PI/2);
        const wPos = [[-0.8, 0.3, -1], [0.8, 0.3, -1], [-0.8, 0.3, 1], [0.8, 0.3, 1]];
        wPos.forEach(p => {
            const w = new THREE.Mesh(wGeo, wheelMat);
            w.position.set(...p);
            group.add(w);
        });

        // Lights
        const lGeo = registerGeometry(new THREE.PlaneGeometry(0.3, 0.2));
        const fl1 = new THREE.Mesh(lGeo, lightMatF); fl1.position.set(-0.5, 0.6, -1.51); fl1.rotation.y = Math.PI; group.add(fl1);
        const fl2 = new THREE.Mesh(lGeo, lightMatF); fl2.position.set(0.5, 0.6, -1.51); fl2.rotation.y = Math.PI; group.add(fl2);
        const rl1 = new THREE.Mesh(lGeo, lightMatR); rl1.position.set(-0.5, 0.6, 1.51); group.add(rl1);
        const rl2 = new THREE.Mesh(lGeo, lightMatR); rl2.position.set(0.5, 0.6, 1.51); group.add(rl2);
    } 
    else if (type === 'suv') {
        const bodyGeo = registerGeometry(new THREE.BoxGeometry(1.8, 1.2, 3.5));
        const roofGeo = registerGeometry(new THREE.BoxGeometry(1.5, 0.7, 2.2));
        
        const body = new THREE.Mesh(bodyGeo, bodyMat);
        body.position.y = 0.8;
        body.castShadow = true;
        const roof = new THREE.Mesh(roofGeo, bodyMat);
        roof.position.set(0, 1.75, -0.2);
        roof.castShadow = true;

        group.add(body, roof);

        const wGeo = registerGeometry(new THREE.CylinderGeometry(0.35, 0.35, 0.3, 8));
        wGeo.rotateZ(Math.PI/2);
        const wPos = [[-0.9, 0.35, -1.2], [0.9, 0.35, -1.2], [-0.9, 0.35, 1.2], [0.9, 0.35, 1.2]];
        wPos.forEach(p => {
            const w = new THREE.Mesh(wGeo, wheelMat);
            w.position.set(...p);
            group.add(w);
        });
    }
    else if (type === 'bus') {
        const bodyGeo = registerGeometry(new THREE.BoxGeometry(2.2, 2.5, 6));
        const body = new THREE.Mesh(bodyGeo, bodyMat);
        body.position.y = 1.5;
        body.castShadow = true;
        group.add(body);

        const wGeo = registerGeometry(new THREE.CylinderGeometry(0.5, 0.5, 0.4, 8));
        wGeo.rotateZ(Math.PI/2);
        const wPos = [[-1.2, 0.5, -2], [1.2, 0.5, -2], [-1.2, 0.5, 2], [1.2, 0.5, 2]];
        wPos.forEach(p => {
            const w = new THREE.Mesh(wGeo, wheelMat);
            w.position.set(...p);
            group.add(w);
        });
    }
    else if (type === 'motorcycle') {
        const bodyGeo = registerGeometry(new THREE.BoxGeometry(0.4, 0.6, 1.8));
        const body = new THREE.Mesh(bodyGeo, bodyMat);
        body.position.y = 0.6;
        body.castShadow = true;
        group.add(body);

        const wGeo = registerGeometry(new THREE.CylinderGeometry(0.3, 0.3, 0.15, 8));
        wGeo.rotateZ(Math.PI/2);
        const wPos = [[0, 0.3, -0.7], [0, 0.3, 0.7]];
        wPos.forEach(p => {
            const w = new THREE.Mesh(wGeo, wheelMat);
            w.position.set(...p);
            group.add(w);
        });

        const riderBodyGeo = registerGeometry(new THREE.CylinderGeometry(0.2, 0.2, 0.6));
        const riderHeadGeo = registerGeometry(new THREE.SphereGeometry(0.2));
        const riderMat = registerMaterial(new THREE.MeshLambertMaterial({ color: 0x111111 }));
        
        const rBody = new THREE.Mesh(riderBodyGeo, riderMat);
        rBody.position.set(0, 1.2, 0);
        const rHead = new THREE.Mesh(riderHeadGeo, riderMat);
        rHead.position.set(0, 1.7, -0.1);
        group.add(rBody, rHead);
    }
    
    return group;
}

function generateArcPoints(cx, cz, radius, startAngle, endAngle, numPoints) {
    let pts = [];
    for (let i = 1; i <= numPoints; i++) {
        const t = i / (numPoints + 1);
        const angle = startAngle + (endAngle - startAngle) * t;
        pts.push(new THREE.Vector3(cx + Math.cos(angle)*radius, 0.3, cz + Math.sin(angle)*radius));
    }
    return pts;
}

function createCircuits() {
    // Clockwise (outer lane, offset +3 from center)
    // North eastbound (z=78), East southbound (x=103), South westbound (z=-78), West northbound (x=-103)
    const cw = [];
    cw.push(new THREE.Vector3(-103, 0.3, 78)); 
    cw.push(new THREE.Vector3(78, 0.3, 78)); // Approaching NE
    cw.push(...generateArcPoints(78, 53, 25, Math.PI/2, 0, 3)); // NE corner right curve
    cw.push(new THREE.Vector3(103, 0.3, 53));
    cw.push(new THREE.Vector3(103, 0.3, -53)); // Approaching SE
    cw.push(...generateArcPoints(78, -53, 25, 0, -Math.PI/2, 3)); // SE corner right curve
    cw.push(new THREE.Vector3(78, 0.3, -78));
    cw.push(new THREE.Vector3(-78, 0.3, -78)); // Approaching SW
    cw.push(...generateArcPoints(-78, -53, 25, -Math.PI/2, -Math.PI, 3)); // SW corner right curve
    cw.push(new THREE.Vector3(-103, 0.3, -53));
    cw.push(new THREE.Vector3(-103, 0.3, 53)); // Approaching NW
    cw.push(...generateArcPoints(-78, 53, 25, Math.PI, Math.PI/2, 3)); // NW corner right curve

    // Counter-clockwise (inner lane, offset -3 from center)
    // North westbound (z=72), West southbound (x=-97), South eastbound (z=-72), East northbound (x=97)
    const ccw = [];
    ccw.push(new THREE.Vector3(97, 0.3, 72));
    ccw.push(new THREE.Vector3(-72, 0.3, 72)); // Approaching NW
    ccw.push(...generateArcPoints(-72, 47, 25, Math.PI/2, Math.PI, 3)); // NW corner left curve
    ccw.push(new THREE.Vector3(-97, 0.3, 47));
    ccw.push(new THREE.Vector3(-97, 0.3, -47)); // Approaching SW
    ccw.push(...generateArcPoints(-72, -47, 25, Math.PI, Math.PI*1.5, 3)); // SW corner left curve
    ccw.push(new THREE.Vector3(-72, 0.3, -72));
    ccw.push(new THREE.Vector3(72, 0.3, -72)); // Approaching SE
    ccw.push(...generateArcPoints(72, -47, 25, -Math.PI/2, 0, 3)); // SE corner left curve
    ccw.push(new THREE.Vector3(97, 0.3, -47));
    ccw.push(new THREE.Vector3(97, 0.3, 47)); // Approaching NE
    ccw.push(...generateArcPoints(72, 47, 25, 0, Math.PI/2, 3)); // NE corner left curve

    return { cw, ccw };
}

function preprocessCircuit(points) {
    const segments = [];
    let totalLength = 0;
    for (let i = 0; i < points.length; i++) {
        const p1 = points[i];
        const p2 = points[(i + 1) % points.length];
        const len = p1.distanceTo(p2);
        segments.push({ p1, p2, len, startDist: totalLength });
        totalLength += len;
    }
    return { points, segments, totalLength };
}

function setupTraffic(scene) {
    const circuits = createCircuits();
    const cwCircuit = preprocessCircuit(circuits.cw);
    const ccwCircuit = preprocessCircuit(circuits.ccw);

    const cwDef = [
        { type: 'car', speed: 12, color: 0xff0000 },
        { type: 'car', speed: 11, color: 0x00ff00 },
        { type: 'car', speed: 13, color: 0x0000ff },
        { type: 'suv', speed: 9, color: 0x333333 },
        { type: 'bus', speed: 7, color: 0xaaaa00 }
    ];

    const ccwDef = [
        { type: 'car', speed: 12, color: 0x00ffff },
        { type: 'car', speed: 14, color: 0xff00ff },
        { type: 'car', speed: 10, color: 0xffffff },
        { type: 'suv', speed: 10, color: 0x111111 },
        { type: 'motorcycle', speed: 15, color: 0xdd0000 }
    ];

    const addVehicle = (def, circuit, index, total) => {
        const mesh = createVehicleModel(def.type, def.color);
        registerObject(mesh, scene);
        
        // Distribute evenly initially
        const targetDist = (index / total) * circuit.totalLength;
        let segIdx = 0;
        let seg = circuit.segments[0];
        while (segIdx < circuit.segments.length - 1 && circuit.segments[segIdx + 1].startDist <= targetDist) {
            segIdx++;
            seg = circuit.segments[segIdx];
        }
        
        const segmentT = (targetDist - seg.startDist) / seg.len;

        vehicles.push({
            mesh,
            circuit,
            segmentIndex: segIdx,
            segmentT,
            speed: def.speed,
            currentSpeed: def.speed,
            type: def.type,
            distance: targetDist
        });
    };

    cwDef.forEach((def, i) => addVehicle(def, cwCircuit, i, cwDef.length));
    ccwDef.forEach((def, i) => addVehicle(def, ccwCircuit, i, ccwDef.length));
}

function setupPedestrians(scene) {
    const pedGeoBody = registerGeometry(new THREE.CylinderGeometry(0.2, 0.2, 1.2));
    const pedGeoHead = registerGeometry(new THREE.SphereGeometry(0.2));
    const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff];

    for(let i = 0; i < 10; i++) {
        const group = new THREE.Group();
        const mat = registerMaterial(new THREE.MeshLambertMaterial({ color: colors[i%colors.length] }));
        
        const body = new THREE.Mesh(pedGeoBody, mat);
        body.position.y = 0.6;
        body.castShadow = true;
        
        const head = new THREE.Mesh(pedGeoHead, mat);
        head.position.y = 1.4;
        head.castShadow = true;

        group.add(body, head);
        registerObject(group, scene);

        // Simple rectangular path around inside sidewalks
        const path = [
            new THREE.Vector3(-93, 0.1, 68),
            new THREE.Vector3(93, 0.1, 68),
            new THREE.Vector3(93, 0.1, -68),
            new THREE.Vector3(-93, 0.1, -68)
        ];

        pedestrians.push({
            mesh: group,
            path: path,
            targetIndex: i % 4,
            speed: 1 + Math.random(),
            time: Math.random() * 10
        });

        // Set initial position
        const p1 = path[i % 4];
        const p2 = path[(i + 1) % 4];
        group.position.copy(p1).lerp(p2, Math.random());
    }
}

// --- Update Logic ---

export function updateEnvironment(deltaTime) {
    updateTraffic(deltaTime);
    updatePedestrians(deltaTime);
    if (fountainWaterMesh) {
        fountainWaterMesh.rotation.y += deltaTime * 2;
    }
}

function updateTraffic(deltaTime) {
    // Update distances for collision checking
    vehicles.forEach(v => {
        v.distance = v.circuit.segments[v.segmentIndex].startDist + v.segmentT * v.circuit.segments[v.segmentIndex].len;
    });

    vehicles.forEach(v => {
        const seg = v.circuit.segments[v.segmentIndex];
        
        // Base speed logic
        let targetSpeed = v.speed;
        if (seg.len < 20) targetSpeed *= 0.5; // Slow down on corners (short segments)

        // Find vehicle ahead in SAME circuit
        let distAhead = Infinity;
        let aheadSpeed = targetSpeed;
        
        for (let other of vehicles) {
            if (other === v || other.circuit !== v.circuit) continue;
            let d = other.distance - v.distance;
            if (d < 0) d += v.circuit.totalLength; // wrap around
            if (d < distAhead && d > 0) {
                distAhead = d;
                aheadSpeed = other.currentSpeed;
            }
        }

        // Collision avoidance
        if (distAhead < 3) {
            v.currentSpeed = 0;
        } else if (distAhead < 8) {
            v.currentSpeed = Math.min(v.currentSpeed, aheadSpeed * 0.8);
        } else {
            v.currentSpeed += 5 * deltaTime; // Acceleration
            if (v.currentSpeed > targetSpeed) v.currentSpeed = targetSpeed;
        }

        // Move
        if (v.currentSpeed > 0) {
            v.segmentT += (v.currentSpeed * deltaTime) / seg.len;
            if (v.segmentT >= 1) {
                v.segmentT -= 1;
                v.segmentIndex = (v.segmentIndex + 1) % v.circuit.segments.length;
            }
        }

        // Position & Rotation
        const curSeg = v.circuit.segments[v.segmentIndex];
        v.mesh.position.copy(curSeg.p1).lerp(curSeg.p2, v.segmentT);
        
        const dir = new THREE.Vector3().subVectors(curSeg.p2, curSeg.p1).normalize();
        // Model faces -Z, so rotate to align -Z with dir
        v.mesh.rotation.y = Math.atan2(dir.x, dir.z) + Math.PI;
    });
}

function updatePedestrians(deltaTime) {
    pedestrians.forEach(p => {
        p.time += deltaTime;
        const target = p.path[p.targetIndex];
        const dir = new THREE.Vector3().subVectors(target, p.mesh.position);
        dir.y = 0;
        
        if (dir.length() < 0.5) {
            p.targetIndex = (p.targetIndex + 1) % p.path.length;
        } else {
            dir.normalize();
            p.mesh.position.addScaledVector(dir, p.speed * deltaTime);
            p.mesh.rotation.y = Math.atan2(dir.x, dir.z);
            
            // Bobbing
            p.mesh.position.y = 0.1 + Math.abs(Math.sin(p.time * 10)) * 0.1;
        }
    });
}

// --- Cleanup ---

export function disposeEnvironment(scene) {
    envObjects.forEach(obj => {
        scene.remove(obj);
    });
    
    _geometries.forEach(geo => geo.dispose());
    _materials.forEach(mat => mat.dispose());

    envObjects = [];
    vehicles = [];
    pedestrians = [];
    _geometries = [];
    _materials = [];
    fountainWaterMesh = null;
}
