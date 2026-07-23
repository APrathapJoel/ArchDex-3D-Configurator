import * as THREE from 'three';

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export class AnimationManager {
  constructor() {
    this.animations = [];
  }

  add(animation) {
    // animation = { update(progress), onComplete?, duration, elapsed: 0 }
    animation.elapsed = 0;
    this.animations.push(animation);
  }

  update(deltaTime) {
    for (let i = this.animations.length - 1; i >= 0; i--) {
      const anim = this.animations[i];
      anim.elapsed += deltaTime;
      
      const progress = Math.min(Math.max(anim.elapsed / anim.duration, 0), 1);
      const easedProgress = easeInOutCubic(progress);
      
      if (anim.update) {
        anim.update(easedProgress);
      }
      
      if (progress >= 1) {
        if (anim.onComplete) {
          anim.onComplete();
        }
        this.animations.splice(i, 1);
      }
    }
  }

  clear() {
    this.animations = [];
  }
}

export function animateCameraTo(camera, controls, targetPos, targetLookAt, duration, manager) {
  const startPos = camera.position.clone();
  const startTarget = controls.target.clone();

  manager.add({
    duration: duration,
    update: (progress) => {
      camera.position.lerpVectors(startPos, targetPos, progress);
      controls.target.lerpVectors(startTarget, targetLookAt, progress);
      controls.update();
    }
  });
}

export function animateColor(material, propertyName, targetColor, duration, manager) {
  const startColor = material[propertyName].clone();

  manager.add({
    duration: duration,
    update: (progress) => {
      material[propertyName].lerpColors(startColor, targetColor, progress);
    }
  });
}

function setObjectOpacity(object, opacity) {
  object.traverse(child => {
    if (child.isMesh && child.material) {
      const mats = Array.isArray(child.material) ? child.material : [child.material];
      mats.forEach(mat => {
        mat.transparent = true;
        mat.opacity = opacity;
      });
    }
  });
}

export function fadeIn(object3D, duration, manager) {
  object3D.visible = true;
  setObjectOpacity(object3D, 0);

  manager.add({
    duration: duration,
    update: (progress) => {
      setObjectOpacity(object3D, progress);
    }
  });
}

export function fadeOut(object3D, duration, manager, onComplete) {
  manager.add({
    duration: duration,
    update: (progress) => {
      setObjectOpacity(object3D, 1 - progress);
    },
    onComplete: () => {
      object3D.visible = false;
      if (onComplete) onComplete();
    }
  });
}

export function scaleIn(object3D, duration, manager) {
  object3D.scale.set(0.01, 0.01, 0.01);
  object3D.visible = true;

  manager.add({
    duration: duration,
    update: (progress) => {
      // Avoid exact zero scale
      const s = Math.max(progress, 0.01);
      object3D.scale.set(s, s, s);
    }
  });
}
