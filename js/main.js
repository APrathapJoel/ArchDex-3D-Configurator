import * as THREE from 'three';
import { initScene, resetCamera, switchToExteriorView, switchToInteriorView, onWindowResize } from './scene.js?v=23';
import { AnimationManager, animateCameraTo, animateColor, fadeIn, fadeOut, scaleIn } from './animations.js?v=23';
import { createBuilding, updateBuildingColors, getBuildingInfo, BUILDING_TYPES, THEME_COLORS } from './buildings.js?v=23';
import { createFeature, FEATURES } from './features.js?v=23';
import { createFloorPlan } from './floorplans.js?v=23';
import { initControls, getState, updateFloorSelector, updateBuildingInfo } from './controls.js?v=23';
import { createEnvironment, updateEnvironment, disposeEnvironment } from './environment.js?v=23';
import { getFloorCount, createFloorInterior, updateInteriorAnimations, disposeInterior } from './interiors.js?v=23';
import { EditModeManager } from './editmode.js?v=23';

let scene, camera, renderer, controls;
let animManager, editManager;
let currentBuilding = null;
let currentBuildingType = 'modern-villa';
let currentColorTheme = 'white';
let currentViewMode = 'exterior';
let currentFloor = 0;
const activeFeatures = new Map();
let currentFloorPlan = null;
let currentInterior = null;
const clock = new THREE.Clock();

const FEATURE_MAP = {
  'compound-wall': FEATURES.COMPOUND_WALL,
  'entrance-gate': FEATURES.ENTRANCE_GATE,
  'garden': FEATURES.GARDEN,
  'pool': FEATURES.SWIMMING_POOL,
  'trees': FEATURES.TREES,
  'gazebo': FEATURES.GAZEBO,
  'pergola': FEATURES.PERGOLA,
  'outdoor-seating': FEATURES.OUTDOOR_SEATING,
  'basketball': FEATURES.BASKETBALL_COURT,
  'playground': FEATURES.PLAYGROUND,
  'parking': FEATURES.PARKING,
  'driveway': FEATURES.DRIVEWAY,
  'solar': FEATURES.SOLAR_PANELS,
  'rooftop-garden': FEATURES.ROOFTOP_GARDEN,
  'fountain': FEATURES.FOUNTAIN,
  'security': FEATURES.SECURITY_CABIN,
  'balcony': FEATURES.BALCONY,
  'terrace': FEATURES.TERRACE,
  'glass-roof': FEATURES.GLASS_ROOF,
  'smart-lighting': FEATURES.SMART_LIGHTING,
  'glass-railing': FEATURES.GLASS_RAILING,
  'facade-panels': FEATURES.FACADE_PANELS,
  'decorative-lighting': FEATURES.DECORATIVE_LIGHTING
};

function init() {
  const loadingOverlay = document.getElementById('loading-overlay');
  const container = document.getElementById('canvas-container');

  try {
    const sceneData = initScene(container);
    scene = sceneData.scene;
    camera = sceneData.camera;
    renderer = sceneData.renderer;
    controls = sceneData.controls;
    
    renderer.localClippingEnabled = true;

    animManager = new AnimationManager();
    editManager = new EditModeManager(scene, camera, renderer, controls);

    createEnvironment(scene);

    loadBuilding('modern-villa', 'white', false);

    initControls({
      onApply: handleApply,
      onReset: handleReset,
      onViewChange: handleViewChange,
      onBuildingSelect: handleBuildingSelect,
      onFloorChange: handleFloorChange,
      onEditModeToggle: handleEditModeToggle,
      onResize: () => onWindowResize(camera, renderer, container)
    });

    updateBuildingInfo(getBuildingInfo('modern-villa'));

    window.addEventListener('resize', () => {
      onWindowResize(camera, renderer, container);
    });

    setTimeout(() => {
      if (loadingOverlay) {
        loadingOverlay.style.opacity = '0';
        setTimeout(() => loadingOverlay.style.display = 'none', 300);
      }
    }, 100);

    animate();
  } catch (error) {
    console.error("Initialization error:", error);
    if (loadingOverlay) {
      loadingOverlay.innerHTML = '<div style="color: white; padding: 20px; text-align: center;">Error loading application. Please refresh.</div>';
    }
  }
}

function loadBuilding(buildingType, colorTheme, shouldAnimate = false) {
  if (currentBuilding) {
    if (shouldAnimate) {
      const oldBuilding = currentBuilding;
      fadeOut(oldBuilding, 0.4, animManager, () => {
        disposeGroup(oldBuilding);
        scene.remove(oldBuilding);
      });
    } else {
      disposeGroup(currentBuilding);
      scene.remove(currentBuilding);
    }
  }

  activeFeatures.forEach((feature) => {
    disposeGroup(feature);
    scene.remove(feature);
  });
  activeFeatures.clear();

  removeFloorPlan();
  removeInterior();

  currentBuildingType = buildingType;
  currentColorTheme = colorTheme;

  currentBuilding = createBuilding(currentBuildingType, currentColorTheme);
  
  if (currentBuilding) {
    scene.add(currentBuilding);
    if (shouldAnimate) {
      fadeIn(currentBuilding, 0.5, animManager);
    }
  }

  if (currentViewMode === 'exterior') {
    if (shouldAnimate) {
      switchToExteriorView(camera, controls, currentBuildingType, (cam, ctrl, pos, lookAt) => {
        animateCameraTo(cam, ctrl, pos, lookAt, 1.0, animManager);
      });
    } else {
      resetCamera(camera, controls, currentBuildingType);
    }
  } else {
    handleFloorChange(0);
    switchToInteriorView(camera, controls, currentBuildingType);
  }
}

function getFloorHeight(buildingType) {
  switch(buildingType) {
    case 'modern-villa':
    case 'contemporary-house':
      return 3.5;
    case 'apartment':
      return 3.0;
    case 'office-building':
    case 'glass-corporate':
      return 3.3;
    case 'university':
      return 3.6;
    case 'cathedral':
      return 11;
    default:
      return 3.5;
  }
}

function handleFloorChange(floorIndex) {
  currentFloor = floorIndex;
  
  removeInterior();
  removeFloorPlan();

  currentInterior = createFloorInterior(currentBuildingType, floorIndex);
  if (currentInterior) {
    scene.add(currentInterior);
    fadeIn(currentInterior, 0.5, animManager);
  }

  currentFloorPlan = createFloorPlan(currentBuildingType, floorIndex);
  if (currentFloorPlan) {
    scene.add(currentFloorPlan);
    fadeIn(currentFloorPlan, 0.5, animManager);
  }

  const floorHeight = getFloorHeight(currentBuildingType);
  
  // Set clip height to cut off ceiling/roof cover above the active floor
  let clipY = (floorIndex + 1) * floorHeight - 0.25;
  if (currentBuildingType === 'cathedral') {
    clipY = 12.0; // Open cathedral roof to reveal nave & altar interior
  }
  
  const clipPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), clipY);
  renderer.clippingPlanes = [clipPlane];

  // Dynamically elevate camera target & camera height to focus on current floor
  if (controls && camera) {
    const floorY = floorIndex * floorHeight;
    controls.target.set(0, floorY + 1.5, 0);
    camera.position.set(camera.position.x, floorY + 18, Math.max(16, floorY * 0.5 + 16));
    controls.update();
  }
}

function handleApply(appliedState) {
  const targetType = appliedState.buildingType || currentBuildingType;
  const targetTheme = appliedState.colorTheme || currentColorTheme;

  if (targetType !== currentBuildingType || targetTheme !== currentColorTheme) {
    loadBuilding(targetType, targetTheme, true);
  } else if (currentBuilding) {
    updateBuildingColors(currentBuilding, targetTheme);
  }

  activeFeatures.forEach((feature) => {
    if (feature) {
      fadeOut(feature, 0.3, animManager, () => {
        disposeGroup(feature);
        scene.remove(feature);
      });
    }
  });
  activeFeatures.clear();

  if (currentViewMode === 'exterior') {
    setTimeout(() => {
      if (appliedState.features) {
        Object.keys(appliedState.features).forEach(featureKey => {
          if (appliedState.features[featureKey] && FEATURE_MAP[featureKey]) {
            const feature = createFeature(FEATURE_MAP[featureKey], currentBuildingType);
            if (feature) {
              scene.add(feature);
              activeFeatures.set(featureKey, feature);
              scaleIn(feature, 0.5, animManager);
            }
          }
        });
      }
    }, 350);
  }

  updateBuildingInfo(getBuildingInfo(currentBuildingType));
}

function handleEditModeToggle(active) {
  if (!editManager) return;
  if (active) {
    editManager.enable(activeFeatures, currentBuildingType);
  } else {
    editManager.disable();
  }
}

function handleReset() {
  if (editManager) {
    editManager.resetPositions();
    editManager.disable();
  }

  currentViewMode = 'exterior';
  renderer.clippingPlanes = [];
  
  removeInterior();
  removeFloorPlan();

  loadBuilding('modern-villa', 'white', true);
  switchToExteriorView(camera, controls, 'modern-villa', (cam, ctrl, pos, lookAt) => {
    animateCameraTo(cam, ctrl, pos, lookAt, 1.0, animManager);
  });
}

function handleViewChange(viewMode) {
  currentViewMode = viewMode;

  if (viewMode === 'exterior') {
    removeFloorPlan();
    removeInterior();
    
    renderer.clippingPlanes = [];

    if (currentBuilding) {
      currentBuilding.visible = true;
      fadeIn(currentBuilding, 0.5, animManager);
    }

    activeFeatures.forEach((feature) => {
      if (feature) {
        feature.visible = true;
        fadeIn(feature, 0.5, animManager);
      }
    });

    switchToExteriorView(camera, controls, currentBuildingType, (cam, ctrl, pos, lookAt) => {
      animateCameraTo(cam, ctrl, pos, lookAt, 1.0, animManager);
    });
  } else if (viewMode === 'interior') {
    if (currentBuilding) {
      fadeOut(currentBuilding, 0.4, animManager);
    }

    activeFeatures.forEach((feature) => {
      if (feature) {
        fadeOut(feature, 0.4, animManager);
      }
    });

    handleFloorChange(0);
    updateFloorSelector(getFloorCount(currentBuildingType), 0);
    
    switchToInteriorView(camera, controls, currentBuildingType, (cam, ctrl, pos, lookAt) => {
      animateCameraTo(cam, ctrl, pos, lookAt, 1.0, animManager);
    });
  }
}

function handleBuildingSelect(buildingType) {
  updateBuildingInfo(getBuildingInfo(buildingType));
  
  if (currentViewMode === 'interior') {
    updateFloorSelector(getFloorCount(buildingType), 0);
  }
}

function removeFloorPlan() {
  if (currentFloorPlan) {
    disposeGroup(currentFloorPlan);
    scene.remove(currentFloorPlan);
    currentFloorPlan = null;
  }
}

function removeInterior() {
  if (currentInterior) {
    disposeInterior(currentInterior);
    scene.remove(currentInterior);
    currentInterior = null;
  }
}

function disposeGroup(group) {
  if (!group) return;
  group.traverse((child) => {
    if (child.geometry) {
      child.geometry.dispose();
    }
    if (child.material) {
      if (Array.isArray(child.material)) {
        child.material.forEach(mat => {
          if (mat.map) mat.map.dispose();
          mat.dispose();
        });
      } else {
        if (child.material.map) child.material.map.dispose();
        child.material.dispose();
      }
    }
  });
}

function animate() {
  requestAnimationFrame(animate);
  const deltaTime = clock.getDelta();
  if (controls) controls.update();
  if (animManager) animManager.update(deltaTime);
  if (editManager && editManager.isActive()) editManager.update();
  updateEnvironment(deltaTime);
  updateInteriorAnimations(deltaTime);
  if (renderer && scene && camera) renderer.render(scene, camera);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
