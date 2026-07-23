import * as THREE from 'three';

const BUILDING_FOOTPRINTS = {
  'modern-villa': { w: 14, d: 12 },
  'contemporary-house': { w: 12, d: 10 },
  'apartment': { w: 25, d: 12 },
  'office-building': { w: 20, d: 15 },
  'glass-corporate': { w: 18, d: 18 },
  'university': { w: 40, d: 25 },
  'cathedral': { w: 17, d: 28 }
};

export class EditModeManager {
  constructor(scene, camera, renderer, orbitControls) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.orbitControls = orbitControls;

    this.active = false;
    this.activeFeatures = new Map();
    this.buildingType = null;
    this.plotBounds = { minX: -60, maxX: 60, minZ: -50, maxZ: 50 };

    this.selectedFeatureKey = null;
    this.selectedFeature = null;

    this.isDragging = false;
    this.dragPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    this.dragOffset = new THREE.Vector3();
    this.dragStartPosition = new THREE.Vector3();
    this.dragStartRotation = new THREE.Euler();

    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();

    this.originalState = new Map();
    this.undoStack = [];
    this.deletedFeatures = new Set();
    
    // Bind event handlers
    this.onPointerDown = this.onPointerDown.bind(this);
    this.onPointerMove = this.onPointerMove.bind(this);
    this.onPointerUp = this.onPointerUp.bind(this);
    this.onWheel = this.onWheel.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onRotateBtn = this.onRotateBtn.bind(this);
    this.onDeleteBtn = this.onDeleteBtn.bind(this);
    this.onDuplicateBtn = this.onDuplicateBtn.bind(this);
    this.onUndoBtn = this.onUndoBtn.bind(this);
  }

  enable(activeFeatures, buildingType) {
    this.active = true;
    this.activeFeatures = activeFeatures;
    this.buildingType = buildingType;
    this.deletedFeatures.clear();
    this.undoStack = [];

    // Store original state
    this.originalState.clear();
    this.activeFeatures.forEach((feature, key) => {
      this.originalState.set(key, {
        position: feature.position.clone(),
        rotation: feature.rotation.clone(),
        visible: feature.visible
      });
    });

    const canvas = this.renderer.domElement;
    canvas.addEventListener('pointerdown', this.onPointerDown);
    canvas.addEventListener('pointermove', this.onPointerMove);
    canvas.addEventListener('pointerup', this.onPointerUp);
    canvas.addEventListener('wheel', this.onWheel, { passive: false });
    window.addEventListener('keydown', this.onKeyDown);

    // Toolbar listeners
    document.getElementById('edit-rotate')?.addEventListener('click', this.onRotateBtn);
    document.getElementById('edit-delete')?.addEventListener('click', this.onDeleteBtn);
    document.getElementById('edit-duplicate')?.addEventListener('click', this.onDuplicateBtn);
    document.getElementById('edit-undo')?.addEventListener('click', this.onUndoBtn);
  }

  disable() {
    this.active = false;
    this.deselectFeature();

    if (this.orbitControls) {
      this.orbitControls.enabled = true;
    }

    const canvas = this.renderer.domElement;
    canvas.removeEventListener('pointerdown', this.onPointerDown);
    canvas.removeEventListener('pointermove', this.onPointerMove);
    canvas.removeEventListener('pointerup', this.onPointerUp);
    canvas.removeEventListener('wheel', this.onWheel);
    window.addEventListener('keydown', this.onKeyDown);

    // Toolbar listeners
    document.getElementById('edit-rotate')?.removeEventListener('click', this.onRotateBtn);
    document.getElementById('edit-delete')?.removeEventListener('click', this.onDeleteBtn);
    document.getElementById('edit-duplicate')?.removeEventListener('click', this.onDuplicateBtn);
    document.getElementById('edit-undo')?.removeEventListener('click', this.onUndoBtn);
  }

  isActive() {
    return this.active;
  }

  update() {
    // Called every frame if needed (e.g., animations)
  }

  getModifiedPositions() {
    const modifications = new Map();
    this.activeFeatures.forEach((feature, key) => {
      if (!this.deletedFeatures.has(key)) {
        modifications.set(key, {
          position: feature.position.clone(),
          rotation: feature.rotation.clone()
        });
      }
    });
    return modifications;
  }

  resetPositions() {
    this.originalState.forEach((state, key) => {
      const feature = this.activeFeatures.get(key);
      if (feature) {
        feature.position.copy(state.position);
        feature.rotation.copy(state.rotation);
        feature.visible = state.visible;
      }
    });
    this.deletedFeatures.clear();
    this.undoStack = [];
    this.deselectFeature();
  }

  dispose() {
    this.disable();
    this.originalState.clear();
    this.activeFeatures.clear();
  }

  // --- Interaction Helpers ---

  getIntersectedFeature(e) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.pointer, this.camera);
    
    // Check intersection with all active, non-deleted features
    let closestFeature = null;
    let closestKey = null;
    let minDistance = Infinity;

    this.activeFeatures.forEach((feature, key) => {
      if (this.deletedFeatures.has(key) || !feature.visible) return;

      const intersects = this.raycaster.intersectObject(feature, true);
      if (intersects.length > 0 && intersects[0].distance < minDistance) {
        minDistance = intersects[0].distance;
        closestFeature = feature;
        closestKey = key;
      }
    });

    return { feature: closestFeature, key: closestKey, distance: minDistance };
  }

  selectFeature(feature, key) {
    this.deselectFeature();
    this.selectedFeature = feature;
    this.selectedFeatureKey = key;
    this.setFeatureTint(this.selectedFeature, 0x444444); // Selection emissive
  }

  deselectFeature() {
    if (this.selectedFeature) {
      this.clearFeatureTint(this.selectedFeature);
      this.selectedFeature = null;
      this.selectedFeatureKey = null;
    }
  }

  setFeatureTint(feature, hexColor) {
    feature.traverse((child) => {
      if (child.isMesh) {
        if (!child.userData.originalEmissive) {
          child.userData.originalEmissive = child.material.emissive ? child.material.emissive.clone() : new THREE.Color(0x000000);
        }
        child.material = child.material.clone(); // Ensure we don't modify shared materials
        child.material.emissive.setHex(hexColor);
      }
    });
  }

  clearFeatureTint(feature) {
    feature.traverse((child) => {
      if (child.isMesh && child.userData.originalEmissive) {
        child.material.emissive.copy(child.userData.originalEmissive);
      }
    });
  }

  // --- Validation ---

  isValidPosition(feature) {
    // 1. Plot bounds check
    const pos = feature.position;
    if (pos.x < this.plotBounds.minX || pos.x > this.plotBounds.maxX ||
        pos.z < this.plotBounds.minZ || pos.z > this.plotBounds.maxZ) {
      return false;
    }

    const featureBox = new THREE.Box3().setFromObject(feature);

    // 2. Building overlap check
    const buildingInfo = BUILDING_FOOTPRINTS[this.buildingType];
    if (buildingInfo) {
      const margin = 2;
      const bw = buildingInfo.w / 2 + margin;
      const bd = buildingInfo.d / 2 + margin;
      
      const buildingBox = new THREE.Box3(
        new THREE.Vector3(-bw, -10, -bd),
        new THREE.Vector3(bw, 100, bd)
      );

      if (featureBox.intersectsBox(buildingBox)) {
        return false;
      }
    }

    // 3. Other feature overlap check
    let overlapping = false;
    const marginBox = new THREE.Box3();
    const marginVec = new THREE.Vector3(2, 2, 2);
    
    marginBox.copy(featureBox).expandByVector(marginVec);

    this.activeFeatures.forEach((otherFeature, key) => {
      if (overlapping || key === this.selectedFeatureKey || this.deletedFeatures.has(key) || !otherFeature.visible) return;
      
      const otherBox = new THREE.Box3().setFromObject(otherFeature);
      if (marginBox.intersectsBox(otherBox)) {
        overlapping = true;
      }
    });

    return !overlapping;
  }

  // --- Event Listeners ---

  onPointerDown(e) {
    if (e.button !== 0) return; // Only left click

    const intersection = this.getIntersectedFeature(e);
    
    if (intersection.feature) {
      this.selectFeature(intersection.feature, intersection.key);
      
      this.isDragging = false;
      this.dragStartPosition.copy(intersection.feature.position);
      this.dragStartRotation.copy(intersection.feature.rotation);
      
      // Calculate offset for dragging
      this.raycaster.ray.intersectPlane(this.dragPlane, this.dragOffset);
      if (this.dragOffset) {
        this.dragOffset.sub(intersection.feature.position);
      }
    } else {
      this.deselectFeature();
    }
  }

  onPointerMove(e) {
    if (!this.selectedFeature || e.buttons !== 1) return;

    if (!this.isDragging) {
      this.isDragging = true;
      if (this.orbitControls) this.orbitControls.enabled = false;
    }

    const rect = this.renderer.domElement.getBoundingClientRect();
    this.pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    this.raycaster.setFromCamera(this.pointer, this.camera);

    const target = new THREE.Vector3();
    this.raycaster.ray.intersectPlane(this.dragPlane, target);

    if (target) {
      // Snap to y=0 keeping original Y offset
      const originalY = this.selectedFeature.position.y;
      this.selectedFeature.position.copy(target.sub(this.dragOffset));
      this.selectedFeature.position.y = originalY;

      // Validation tint
      if (this.isValidPosition(this.selectedFeature)) {
        this.setFeatureTint(this.selectedFeature, 0x004400); // Green
      } else {
        this.setFeatureTint(this.selectedFeature, 0x440000); // Red
      }
    }
  }

  onPointerUp(e) {
    if (this.isDragging && this.selectedFeature) {
      this.isDragging = false;
      if (this.orbitControls) this.orbitControls.enabled = true;

      if (this.isValidPosition(this.selectedFeature)) {
        // Record undo
        this.pushUndo({
          type: 'move',
          featureKey: this.selectedFeatureKey,
          oldPosition: this.dragStartPosition.clone(),
          newPosition: this.selectedFeature.position.clone()
        });
        
        // Reset tint to selected
        this.setFeatureTint(this.selectedFeature, 0x444444);
      } else {
        // Snap back
        this.selectedFeature.position.copy(this.dragStartPosition);
        this.setFeatureTint(this.selectedFeature, 0x444444);
      }
    }
  }

  onWheel(e) {
    if (!this.selectedFeature) return;
    
    e.preventDefault(); // Prevent page scroll
    
    const angle = THREE.MathUtils.degToRad(15) * Math.sign(e.deltaY);
    const oldRotation = this.selectedFeature.rotation.clone();
    
    this.selectedFeature.rotateY(angle);
    
    // Quick validation for rotation
    if (!this.isValidPosition(this.selectedFeature)) {
       this.selectedFeature.rotation.copy(oldRotation);
    } else {
       this.pushUndo({
         type: 'rotate',
         featureKey: this.selectedFeatureKey,
         oldRotation: oldRotation.clone(),
         newRotation: this.selectedFeature.rotation.clone()
       });
    }
  }

  onKeyDown(e) {
    if (e.key === 'Delete' || e.key === 'Backspace') {
      this.onDeleteBtn();
    }
    
    // Ctrl+Z Undo
    if (e.ctrlKey && e.key === 'z') {
      this.onUndoBtn();
    }
  }

  // --- Toolbar Actions ---

  onRotateBtn() {
    if (!this.selectedFeature) return;
    
    const oldRotation = this.selectedFeature.rotation.clone();
    this.selectedFeature.rotateY(THREE.MathUtils.degToRad(15));
    
    if (!this.isValidPosition(this.selectedFeature)) {
       this.selectedFeature.rotation.copy(oldRotation);
    } else {
       this.pushUndo({
         type: 'rotate',
         featureKey: this.selectedFeatureKey,
         oldRotation: oldRotation.clone(),
         newRotation: this.selectedFeature.rotation.clone()
       });
    }
  }

  onDeleteBtn() {
    if (!this.selectedFeature) return;
    
    const key = this.selectedFeatureKey;
    const feature = this.selectedFeature;
    
    feature.visible = false;
    this.deletedFeatures.add(key);
    
    this.pushUndo({
      type: 'delete',
      featureKey: key
    });
    
    this.deselectFeature();
  }

  onDuplicateBtn() {
    if (!this.selectedFeature) return;
    // Implement if needed, though requirements only specify UI hook
    // Usually handled by notifying main state or cloning node
  }

  onUndoBtn() {
    if (this.undoStack.length === 0) return;
    
    const action = this.undoStack.pop();
    const feature = this.activeFeatures.get(action.featureKey);
    
    if (!feature) return;

    switch(action.type) {
      case 'move':
        feature.position.copy(action.oldPosition);
        break;
      case 'rotate':
        feature.rotation.copy(action.oldRotation);
        break;
      case 'delete':
        feature.visible = true;
        this.deletedFeatures.delete(action.featureKey);
        break;
    }
  }

  pushUndo(action) {
    this.undoStack.push(action);
    if (this.undoStack.length > 15) {
      this.undoStack.shift();
    }
  }
}
