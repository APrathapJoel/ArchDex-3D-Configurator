/**
 * Controls module for ArchDex application
 * Manages UI event handling, state management, and DOM interactions
 */

const state = {
  pending: {
    buildingType: 'modern-villa',
    colorTheme: 'white',
    features: {
      'compound-wall': false, 'entrance-gate': false, 'garden': false, 'pool': false,
      'trees': false, 'gazebo': false, 'pergola': false, 'outdoor-seating': false,
      'basketball': false, 'playground': false, 'parking': false, 'driveway': false,
      'solar': false, 'rooftop-garden': false, 'fountain': false, 'security': false,
      'balcony': false, 'terrace': false, 'glass-roof': false, 'smart-lighting': false,
      'glass-railing': false, 'facade-panels': false, 'decorative-lighting': false
    }
  },
  applied: {
    buildingType: 'modern-villa',
    colorTheme: 'white',
    features: {
      'compound-wall': false, 'entrance-gate': false, 'garden': false, 'pool': false,
      'trees': false, 'gazebo': false, 'pergola': false, 'outdoor-seating': false,
      'basketball': false, 'playground': false, 'parking': false, 'driveway': false,
      'solar': false, 'rooftop-garden': false, 'fountain': false, 'security': false,
      'balcony': false, 'terrace': false, 'glass-roof': false, 'smart-lighting': false,
      'glass-railing': false, 'facade-panels': false, 'decorative-lighting': false
    }
  },
  viewMode: 'exterior',
  selectedFloor: 0,
  editMode: false
};

// Initial state for reset
const defaultState = JSON.parse(JSON.stringify(state));

export function initControls(callbacks) {
  // 1. Category accordion
  const categoryHeaders = document.querySelectorAll('.category-header');
  categoryHeaders.forEach((header, index) => {
    // First category starts expanded, others collapsed
    const content = header.nextElementSibling;
    if (content) {
      if (index === 0) {
        header.classList.add('expanded');
        content.classList.remove('collapsed');
      } else {
        header.classList.remove('expanded');
        content.classList.add('collapsed');
      }
    }

    header.addEventListener('click', () => {
      const isAlreadyExpanded = header.classList.contains('expanded');
      
      // Collapse all categories
      categoryHeaders.forEach(otherHeader => {
        otherHeader.classList.remove('expanded');
        if (otherHeader.nextElementSibling) {
          otherHeader.nextElementSibling.classList.add('collapsed');
        }
      });

      // Toggle clicked category if it wasn't already expanded
      if (!isAlreadyExpanded) {
        header.classList.add('expanded');
        if (content) {
          content.classList.remove('collapsed');
        }
      }
    });
  });

  const validateRooftopGardenAvailability = (bType) => {
    const FLAT_ROOF_BUILDINGS = ['modern-villa', 'apartment', 'office-building', 'glass-corporate', 'university'];
    const rooftopCb = document.getElementById('feature-rooftop-garden');
    if (rooftopCb) {
      const isFlat = FLAT_ROOF_BUILDINGS.includes(bType);
      if (!isFlat) {
        rooftopCb.checked = false;
        rooftopCb.disabled = true;
        state.pending.features['rooftop-garden'] = false;
        if (rooftopCb.parentElement) {
          rooftopCb.parentElement.style.opacity = '0.4';
          rooftopCb.parentElement.title = 'Rooftop Gardens are only available on flat open roofs';
        }
      } else {
        rooftopCb.disabled = false;
        if (rooftopCb.parentElement) {
          rooftopCb.parentElement.style.opacity = '1.0';
          rooftopCb.parentElement.title = '';
        }
      }
    }
  };

  // 2. Building cards
  const buildingCards = document.querySelectorAll('.building-card');
  buildingCards.forEach(card => {
    card.addEventListener('click', () => {
      buildingCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      state.pending.buildingType = card.getAttribute('data-building');
      
      validateRooftopGardenAvailability(state.pending.buildingType);

      if (callbacks.onBuildingSelect) {
        callbacks.onBuildingSelect(state.pending.buildingType);
      }
    });
  });

  // 3. Color swatches & Palette Dropdown
  const colorSwatches = document.querySelectorAll('.color-swatch');
  const colorPaletteSelect = document.getElementById('color-palette-select');
  const colorPreviewDot = document.getElementById('color-preview-dot');

  const setSelectedColor = (colorTheme) => {
    state.pending.colorTheme = colorTheme;

    // Sync sidebar swatches
    colorSwatches.forEach(s => {
      if (s.getAttribute('data-color') === colorTheme) {
        s.classList.add('active');
      } else {
        s.classList.remove('active');
      }
    });

    // Sync dropdown
    if (colorPaletteSelect && colorPaletteSelect.value !== colorTheme) {
      colorPaletteSelect.value = colorTheme;
    }

    // Sync preview dot
    if (colorPreviewDot) {
      const swatch = document.querySelector(`.color-swatch[data-color="${colorTheme}"]`);
      const hexColor = swatch ? (swatch.style.getPropertyValue('--swatch-color') || colorTheme) : colorTheme;
      colorPreviewDot.style.backgroundColor = hexColor;
    }
  };

  if (colorPaletteSelect) {
    colorPaletteSelect.addEventListener('change', (e) => {
      setSelectedColor(e.target.value);
    });
  }

  colorSwatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      const color = swatch.getAttribute('data-color');
      setSelectedColor(color);
    });
  });

  // 4. Feature checkboxes
  const featureCheckboxes = document.querySelectorAll('input[type="checkbox"][id^="feature-"]');
  featureCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      const key = checkbox.id.replace('feature-', '');
      state.pending.features[key] = checkbox.checked;
    });
  });

  // 5. View toggle
  const btnExterior = document.getElementById('btn-exterior-view');
  const btnInterior = document.getElementById('btn-interior-view');
  
  btnExterior?.addEventListener('click', () => {
    btnExterior.classList.add('active');
    if (btnInterior) btnInterior.classList.remove('active');
    state.viewMode = 'exterior';
    
    if (callbacks.onViewChange) callbacks.onViewChange(state.viewMode);
    
    updateSummaryView();
    const floorSelector = document.getElementById('floor-selector');
    if (floorSelector) floorSelector.classList.add('hidden');
  });

  btnInterior?.addEventListener('click', () => {
    btnInterior.classList.add('active');
    if (btnExterior) btnExterior.classList.remove('active');
    state.viewMode = 'interior';
    
    if (callbacks.onViewChange) callbacks.onViewChange(state.viewMode);
    
    updateSummaryView();
    const floorSelector = document.getElementById('floor-selector');
    if (floorSelector) floorSelector.classList.remove('hidden');
  });

  // 6. Floor selector buttons
  const floorSelector = document.getElementById('floor-selector');
  if (floorSelector) {
    floorSelector.addEventListener('click', (e) => {
      const btn = e.target.closest('.floor-btn');
      if (!btn) return;

      const buttons = floorSelector.querySelectorAll('.floor-btn');
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      state.selectedFloor = parseInt(btn.getAttribute('data-floor'), 10);
      
      if (callbacks.onFloorChange) {
        callbacks.onFloorChange(state.selectedFloor);
      }
    });
  }

  // 7. Apply button
  const btnApply = document.getElementById('btn-apply');
  const statusText = document.getElementById('status-text');
  
  if (btnApply) {
    btnApply.addEventListener('click', () => {
      // Deep copy pending to applied
      state.applied = JSON.parse(JSON.stringify(state.pending));
      
      if (callbacks.onApply) {
        callbacks.onApply(state.applied);
      }
      
      if (statusText) {
        statusText.textContent = 'Changes applied!';
        setTimeout(() => {
          statusText.textContent = 'Ready';
        }, 2000);
      }
      
      updateSummaryPanel();
    });
  }

  // 7.5. Edit Mode button
  const btnEditMode = document.getElementById('btn-edit-mode');
  const editToolbar = document.getElementById('edit-toolbar');
  const viewportContainer = document.getElementById('viewport-container');

  if (btnEditMode) {
    btnEditMode.addEventListener('click', () => {
      state.editMode = !state.editMode;

      if (state.editMode) {
        btnEditMode.classList.add('active');
        if (editToolbar) editToolbar.classList.remove('hidden');
        if (viewportContainer) viewportContainer.classList.add('edit-active');
        if (statusText) statusText.textContent = 'Edit Mode Active - Drag & drop features';
      } else {
        btnEditMode.classList.remove('active');
        if (editToolbar) editToolbar.classList.add('hidden');
        if (viewportContainer) viewportContainer.classList.remove('edit-active');
        if (statusText) statusText.textContent = 'Ready';
      }

      if (callbacks.onEditModeToggle) {
        callbacks.onEditModeToggle(state.editMode);
      }
    });
  }

  // 7.6. Enlarge Screen Button
  const btnEnlarge = document.getElementById('btn-enlarge-canvas');
  const enlargeIcon = document.getElementById('enlarge-icon');
  const enlargeText = document.getElementById('enlarge-text');

  if (btnEnlarge) {
    btnEnlarge.addEventListener('click', () => {
      document.body.classList.toggle('canvas-fullscreen');
      const isFull = document.body.classList.contains('canvas-fullscreen');
      
      if (enlargeIcon) enlargeIcon.textContent = isFull ? '⤝' : '⤢';
      if (enlargeText) enlargeText.textContent = isFull ? 'Exit Fullscreen' : 'Enlarge Screen';

      if (callbacks.onResize) {
        setTimeout(callbacks.onResize, 100);
      }
    });
  }

  // 7.7. Mobile / Split-Screen Drawer Toggles
  const btnToggleLeft = document.getElementById('btn-toggle-left');
  const btnToggleRight = document.getElementById('btn-toggle-right');
  const btnCloseLeft = document.getElementById('btn-close-left-drawer');
  const btnCloseRight = document.getElementById('btn-close-right-drawer');
  const drawerBackdrop = document.getElementById('mobile-drawer-backdrop');

  const closeDrawers = () => {
    document.body.classList.remove('left-drawer-open', 'right-drawer-open');
    if (btnToggleLeft) btnToggleLeft.classList.remove('active');
    if (btnToggleRight) btnToggleRight.classList.remove('active');
  };

  if (btnToggleLeft) {
    btnToggleLeft.addEventListener('click', () => {
      const isOpen = document.body.classList.contains('left-drawer-open');
      closeDrawers();
      if (!isOpen) {
        document.body.classList.add('left-drawer-open');
        btnToggleLeft.classList.add('active');
      }
    });
  }

  if (btnToggleRight) {
    btnToggleRight.addEventListener('click', () => {
      const isOpen = document.body.classList.contains('right-drawer-open');
      closeDrawers();
      if (!isOpen) {
        document.body.classList.add('right-drawer-open');
        btnToggleRight.classList.add('active');
      }
    });
  }

  if (btnCloseLeft) btnCloseLeft.addEventListener('click', closeDrawers);
  if (btnCloseRight) btnCloseRight.addEventListener('click', closeDrawers);
  if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeDrawers);

  // 8. Reset button
  const btnReset = document.getElementById('btn-reset');
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      // Reset state
      state.pending = JSON.parse(JSON.stringify(defaultState.pending));
      state.applied = JSON.parse(JSON.stringify(defaultState.applied));
      state.viewMode = defaultState.viewMode;
      state.selectedFloor = defaultState.selectedFloor;

      // Reset UI elements
      // Building cards
      buildingCards.forEach(c => c.classList.remove('active'));
      const defaultBuilding = document.querySelector('.building-card[data-building="modern-villa"]');
      if (defaultBuilding) defaultBuilding.classList.add('active');

      // Colors
      setSelectedColor('white');

      // Checkboxes
      featureCheckboxes.forEach(cb => {
        cb.checked = false;
      });

      // View modes
      if (btnExterior) btnExterior.classList.add('active');
      if (btnInterior) btnInterior.classList.remove('active');
      if (floorSelector) floorSelector.classList.add('hidden');

      state.editMode = false;
      if (btnEditMode) btnEditMode.classList.remove('active');
      if (editToolbar) editToolbar.classList.add('hidden');
      if (viewportContainer) viewportContainer.classList.remove('edit-active');

      if (callbacks.onReset) {
        callbacks.onReset();
      }

      if (statusText) {
        statusText.textContent = 'Reset to defaults';
        setTimeout(() => {
          statusText.textContent = 'Ready';
        }, 2000);
      }

      updateSummaryPanel();
    });
  }

  // 9. Tooltips
  const tooltips = document.querySelectorAll('.tooltip-trigger');
  const tooltipEl = document.getElementById('tooltip');
  
  if (tooltipEl) {
    tooltips.forEach(trigger => {
      trigger.addEventListener('mouseenter', (e) => {
        const text = trigger.getAttribute('data-tooltip');
        if (text) {
          tooltipEl.textContent = text;
          tooltipEl.style.display = 'block';
          // Position it (simple naive position)
          const rect = trigger.getBoundingClientRect();
          tooltipEl.style.top = `${rect.top - 30}px`;
          tooltipEl.style.left = `${rect.left}px`;
        }
      });
      trigger.addEventListener('mouseleave', () => {
        tooltipEl.style.display = 'none';
      });
    });
  }
}

export function getState() {
  return state;
}

export function updateFloorSelector(floorCount, currentFloor) {
  const floorSelector = document.getElementById('floor-selector');
  if (!floorSelector) return;

  // Clear existing buttons
  const existingBtns = floorSelector.querySelectorAll('.floor-btn');
  existingBtns.forEach(btn => btn.remove());

  // Create buttons from floorCount-1 down to 0
  for (let i = floorCount - 1; i >= 0; i--) {
    const btn = document.createElement('button');
    btn.className = 'floor-btn';
    if (i === currentFloor) {
      btn.classList.add('active');
    }
    btn.setAttribute('data-floor', i);
    
    if (i === floorCount - 1 && floorCount > 1) {
      btn.textContent = 'R'; // Roof
    } else if (i === 0) {
      btn.textContent = 'G'; // Ground
    } else {
      btn.textContent = i;
    }
    
    floorSelector.appendChild(btn);
  }

  if (state.viewMode === 'interior') {
    floorSelector.classList.remove('hidden');
  }
}

export function updateBuildingInfo(info) {
  if (!info) return;

  const nameEl = document.getElementById('info-building-name');
  if (nameEl) nameEl.textContent = info.name || '';

  const dimEl = document.getElementById('info-dimensions');
  if (dimEl && info.dimensions) {
    dimEl.textContent = `${info.dimensions.width}m × ${info.dimensions.depth}m × ${info.dimensions.height}m`;
  }

  const floorsEl = document.getElementById('info-floors');
  if (floorsEl) floorsEl.textContent = info.floors || 0;

  const areaEl = document.getElementById('info-area');
  if (areaEl) areaEl.textContent = `${info.totalArea || 0} sq m`;

  const descEl = document.getElementById('info-description');
  if (descEl) descEl.textContent = info.description || '';

  const roomList = document.getElementById('room-list');
  if (roomList && info.rooms) {
    roomList.innerHTML = '';
    info.rooms.forEach(room => {
      const roomDiv = document.createElement('div');
      roomDiv.className = 'room-item';
      
      const nameSpan = document.createElement('span');
      nameSpan.className = 'room-name';
      nameSpan.textContent = room.name;
      
      const areaSpan = document.createElement('span');
      areaSpan.className = 'room-area';
      areaSpan.textContent = `${room.area} sq m`;
      
      roomDiv.appendChild(nameSpan);
      roomDiv.appendChild(areaSpan);
      roomList.appendChild(roomDiv);
    });
  }
}

function updateSummaryView() {
  const summaryView = document.getElementById('summary-view');
  if (summaryView) {
    summaryView.textContent = state.viewMode === 'exterior' ? 'Exterior' : 'Interior';
  }
}

function updateSummaryPanel() {
  const summaryColor = document.getElementById('summary-color');
  if (summaryColor) {
    summaryColor.innerHTML = '';
    const dot = document.createElement('span');
    dot.className = 'color-dot';
    
    const swatch = document.querySelector(`.color-swatch[data-color="${state.applied.colorTheme}"]`);
    const hexColor = swatch ? (swatch.style.getPropertyValue('--swatch-color') || state.applied.colorTheme) : state.applied.colorTheme;
    dot.style.backgroundColor = hexColor;
    
    const text = document.createElement('span');
    text.textContent = ` ${state.applied.colorTheme}`;
    text.style.textTransform = 'capitalize';
    
    summaryColor.appendChild(dot);
    summaryColor.appendChild(text);
  }

  const summaryFeatures = document.getElementById('summary-features');
  if (summaryFeatures) {
    summaryFeatures.innerHTML = '';
    const activeFeatures = Object.keys(state.applied.features).filter(k => state.applied.features[k]);
    
    if (activeFeatures.length === 0) {
      summaryFeatures.textContent = 'None';
    } else {
      activeFeatures.forEach(feat => {
        const badge = document.createElement('span');
        badge.className = 'feature-badge';
        badge.textContent = feat.replace('-', ' ');
        summaryFeatures.appendChild(badge);
      });
    }
  }
  
  updateSummaryView();
}
