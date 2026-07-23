import * as THREE from 'three';

function createTextSprite(message, color = 'rgba(255, 255, 255, 1.0)') {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 128;
    const context = canvas.getContext('2d');
    
    context.fillStyle = 'rgba(0, 0, 0, 0.8)';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    context.font = 'bold 32px Arial';
    context.fillStyle = color;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(message, canvas.width / 2, canvas.height / 2);
    
    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(3, 1.5, 1);
    
    return sprite;
}

function createRoom(name, width, depth, x, z, color) {
    const group = new THREE.Group();
    
    const geo = new THREE.BoxGeometry(width, 0.02, depth);
    const mat = new THREE.MeshBasicMaterial({ color, opacity: 0.6, transparent: true });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, 0, z);
    group.add(mesh);
    
    const edges = new THREE.EdgesGeometry(geo);
    const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x000000 }));
    line.position.set(x, 0, z);
    group.add(line);
    
    const sprite = createTextSprite(name);
    sprite.position.set(x, 0.5, z);
    group.add(sprite);
    
    return group;
}

export function createFloorPlan(buildingType, floorIndex = 0) {
    const group = new THREE.Group();
    group.position.y = 0.1;
    
    if (buildingType === 'modern-villa') {
        group.add(createRoom('Living Room', 8, 6, 0, 3, '#4CAF50'));
        group.add(createRoom('Kitchen', 5, 5, 5, -2, '#FF9800'));
        group.add(createRoom('Master Bedroom', 5, 5, -6, -3, '#2196F3'));
        group.add(createRoom('Bedroom 2', 4, 4, -6, -6.5, '#03A9F4'));
        group.add(createRoom('Bathroom 1', 3, 3, 3, -5, '#E91E63'));
        group.add(createRoom('Bathroom 2', 2.5, 2.5, -3, -6.5, '#9C27B0'));
        group.add(createRoom('Corridor', 4, 3, 0, -2, '#607D8B'));
    } else if (buildingType === 'contemporary-house') {
        if (floorIndex === 0) {
            group.add(createRoom('Living Room', 7, 5, 0, 3, '#4CAF50'));
            group.add(createRoom('Kitchen', 4, 4, 4, -2, '#FF9800'));
            group.add(createRoom('Dining', 4, 5, 4, 3, '#8BC34A'));
            group.add(createRoom('Bathroom', 3, 2.5, -4, -2, '#E91E63'));
            group.add(createRoom('Staircase', 3, 3, -4, 2, '#795548'));
        } else {
            group.add(createRoom('Master Bedroom', 5, 5, 0, 3, '#2196F3'));
            group.add(createRoom('Bedroom 2', 4, 4, -3, 3, '#03A9F4'));
            group.add(createRoom('Bedroom 3', 4, 3, 3, -2, '#00BCD4'));
            group.add(createRoom('Bathroom', 3, 2.5, -4, -2, '#E91E63'));
            group.add(createRoom('Hallway', 2, 6, 0, 0, '#607D8B'));
        }
    } else if (buildingType === 'apartment') {
        group.add(createRoom('Corridor', 2, 10, 0, 0, '#607D8B'));
        group.add(createRoom('Unit A - Living', 5, 4, -4.5, 3, '#4CAF50'));
        group.add(createRoom('Unit A - Kitchen', 3, 3, -3.5, -1, '#FF9800'));
        group.add(createRoom('Unit A - Bed', 4, 4, -4, -4.5, '#2196F3'));
        group.add(createRoom('Unit A - Bath', 2.5, 2.5, -1.5, -1.5, '#E91E63'));
        group.add(createRoom('Unit B - Living', 5, 4, 4.5, 3, '#4CAF50'));
        group.add(createRoom('Unit B - Kitchen', 3, 3, 3.5, -1, '#FF9800'));
        group.add(createRoom('Unit B - Bed', 4, 4, 4, -4.5, '#2196F3'));
        group.add(createRoom('Unit B - Bath', 2.5, 2.5, 1.5, -1.5, '#E91E63'));
    } else if (buildingType === 'office-building') {
        if (floorIndex === 0) {
            group.add(createRoom('Reception', 8, 5, 0, 3, '#4CAF50'));
            group.add(createRoom('Lobby Seating', 4, 4, -6, 3, '#8BC34A'));
            group.add(createRoom('Security', 3, 3, 6, 0, '#FF9800'));
            group.add(createRoom('Restrooms', 4, 3, -6, -3, '#9C27B0'));
            group.add(createRoom('Elevator/Stairs', 3, 3, 0, -4, '#795548'));
        } else if (floorIndex < 9) {
            group.add(createRoom('Open Office', 14, 8, 0, 2, '#4CAF50'));
            group.add(createRoom('Meeting Room', 5, 4, -6, -3, '#2196F3'));
            group.add(createRoom('Pantry', 4, 3, 6, -3, '#FF9800'));
            group.add(createRoom('Restrooms', 3, 2, 0, -4.5, '#9C27B0'));
            group.add(createRoom('Elevator', 2, 2, -8, -3, '#795548'));
        } else {
            group.add(createRoom('Executive Suite', 10, 6, 0, 2, '#3F51B5'));
            group.add(createRoom('Board Room', 5, 4, -6, 2, '#2196F3'));
            group.add(createRoom('Executive Lounge', 4, 4, 6, -2, '#8BC34A'));
            group.add(createRoom('Restroom', 3, 2, 0, -4, '#9C27B0'));
        }
    } else if (buildingType === 'glass-corporate') {
        if (floorIndex === 0) {
            group.add(createRoom('Grand Lobby', 12, 8, 0, 2, '#4CAF50'));
            group.add(createRoom('Reception', 6, 3, 0, -4, '#FF9800'));
            group.add(createRoom('Security', 3, 3, -6, -4, '#607D8B'));
        } else if (floorIndex < 7) {
            group.add(createRoom('Open Workspace', 12, 8, 0, 2, '#4CAF50'));
            group.add(createRoom('Meeting Room', 5, 4, -5, -3, '#2196F3'));
            group.add(createRoom('Breakout Area', 4, 4, 5, -3, '#8BC34A'));
        } else {
            group.add(createRoom('Executive Office', 8, 6, 0, 3, '#3F51B5'));
            group.add(createRoom('Sky Lounge', 12, 4, 0, -3, '#00BCD4'));
        }
    } else if (buildingType === 'university') {
        if (floorIndex === 0) {
            group.add(createRoom('Grand Foyer', 15, 8, 0, 3, '#4CAF50'));
            group.add(createRoom('Admin Office', 6, 5, -12, 2, '#FF9800'));
            group.add(createRoom('Reception', 6, 5, 12, 2, '#607D8B'));
            group.add(createRoom('Restrooms', 4, 3, 0, -6, '#9C27B0'));
            group.add(createRoom('Staircase', 4, 4, -15, 0, '#795548'));
        } else if (floorIndex === 1) {
            group.add(createRoom('Lecture Hall A', 10, 8, -8, 3, '#4CAF50'));
            group.add(createRoom('Lecture Hall B', 10, 8, 8, 3, '#66BB6A'));
            group.add(createRoom('Corridor', 25, 2, 0, 0, '#607D8B'));
            group.add(createRoom('Staircase', 4, 4, -15, 0, '#795548'));
        } else if (floorIndex === 2) {
            group.add(createRoom('Chemistry Lab', 8, 6, -8, 3, '#F44336'));
            group.add(createRoom('Computer Lab', 8, 6, 8, 3, '#2196F3'));
            group.add(createRoom('Corridor', 25, 2, 0, 0, '#607D8B'));
            group.add(createRoom('Prep Room', 5, 3, 0, -5, '#FF9800'));
        } else if (floorIndex === 3) {
            group.add(createRoom('Library', 20, 10, 0, 2, '#8B6914'));
            group.add(createRoom('Reading Area', 12, 3, 0, -5, '#CDDC39'));
            group.add(createRoom('Staircase', 4, 4, -15, 0, '#795548'));
        } else if (floorIndex === 4) {
            group.add(createRoom('Faculty Office A', 6, 5, -8, 3, '#FF9800'));
            group.add(createRoom('Faculty Office B', 6, 5, 0, 3, '#FFA726'));
            group.add(createRoom('Faculty Office C', 6, 5, 8, 3, '#FFB74D'));
            group.add(createRoom('Student Lounge', 10, 5, 0, -4, '#4CAF50'));
            group.add(createRoom('Staircase', 4, 4, -15, 0, '#795548'));
        }
    } else if (buildingType === 'cathedral') {
        group.add(createRoom('Main Nave', 10, 25, 0, 2, '#4CAF50'));
        group.add(createRoom('Left Aisle', 5, 25, -10, 2, '#66BB6A'));
        group.add(createRoom('Right Aisle', 5, 25, 10, 2, '#66BB6A'));
        group.add(createRoom('Altar', 8, 6, 0, -12, '#FFD700'));
        group.add(createRoom('Choir', 6, 4, 0, -6, '#9C27B0'));
        group.add(createRoom('Chapel L', 4, 4, -10, -10, '#2196F3'));
        group.add(createRoom('Chapel R', 4, 4, 10, -10, '#03A9F4'));
        group.add(createRoom('Vestry', 4, 3, -10, -14, '#795548'));
    }
    
    return group;
}
