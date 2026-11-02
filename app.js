/* ==========================================================================
   ANSHUMAN SINGH — CINEMATIC 3D DEVELOPER PORTFOLIO
   Core Application Engine: 3D WebGL, Particle Physics, UI & Audio
   ========================================================================== */

// 1. Initialize Lucide Icons
function initLucide() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}
document.addEventListener('DOMContentLoaded', initLucide);


/* ==========================================================================
   2. WEB AUDIO API SYNTHESIZER (Sci-Fi Cinematic UI Sounds)
   ========================================================================== */
let audioCtx = null;
let soundEnabled = true;

function initAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
}

function playUiSound(type = 'click') {
  if (!soundEnabled) return;
  try {
    initAudioContext();
    if (!audioCtx) return;
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const now = audioCtx.currentTime;

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    if (type === 'hover') {
      // Subtle micro-click
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.04);
      gain.gain.setValueAtTime(0.015, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
      osc.start(now);
      osc.stop(now + 0.04);
    } else if (type === 'click') {
      // Metallic sci-fi confirmation chirp
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'teleport') {
      // Futuristic chime
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.setValueAtTime(880, now + 0.06); // A5
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    } else if (type === 'success') {
      // Double harmonious harmonic chime
      const osc2 = audioCtx.createOscillator();
      const gain2 = audioCtx.createGain();
      osc2.connect(gain2);
      gain2.connect(audioCtx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(783.99, now + 0.15); // G5
      gain2.gain.setValueAtTime(0.04, now + 0.15);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);

      osc.start(now);
      osc.stop(now + 0.4);
      osc2.start(now + 0.15);
      osc2.stop(now + 0.5);
    }
  } catch (e) {
    // Audio context may be restricted by autoplay policy
  }
}

function toggleAudio() {
  soundEnabled = !soundEnabled;
  const indicator = document.getElementById('sound-indicator');
  const btn = document.getElementById('audio-toggle');
  if (soundEnabled) {
    btn.classList.remove('sound-muted');
    btn.title = "Audio FX: ON";
    showToast("Audio FX Enabled", "volume-2");
    playUiSound('success');
  } else {
    btn.classList.add('sound-muted');
    btn.title = "Audio FX: MUTED";
    showToast("Audio FX Muted", "volume-x");
  }
}


/* ==========================================================================
   3. TOAST NOTIFICATION UTILITY
   ========================================================================== */
let toastTimeout = null;
function showToast(message, iconName = 'check-circle') {
  const toast = document.getElementById('toast');
  const msgEl = document.getElementById('toast-message');
  const iconEl = document.getElementById('toast-icon');

  if (!toast || !msgEl) return;

  msgEl.innerText = message;
  if (iconEl && window.lucide) {
    iconEl.innerHTML = `<i data-lucide="${iconName}" class="w-4 h-4"></i>`;
    window.lucide.createIcons();
  }

  toast.classList.remove('translate-y-[-150%]', 'opacity-0', 'pointer-events-none');
  toast.classList.add('translate-y-0', 'opacity-100');

  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('translate-y-0', 'opacity-100');
    toast.classList.add('translate-y-[-150%]', 'opacity-0', 'pointer-events-none');
  }, 3200);
}


/* ==========================================================================
   4. INTRO LOADING SCREEN: CINEMATIC AS LOGO ANIMATION & WEBGL ENGINE
   ========================================================================== */
const loaderCanvas = document.getElementById('loader-canvas');
const lCtx = loaderCanvas ? loaderCanvas.getContext('2d') : null;
let loaderAnimFrame = null;
let loaderMouseX = 0;
let loaderMouseY = 0;

function resizeLoaderCanvas() {
  if (!loaderCanvas) return;
  loaderCanvas.width = window.innerWidth;
  loaderCanvas.height = window.innerHeight;
}
resizeLoaderCanvas();
window.addEventListener('resize', resizeLoaderCanvas);

// Track subtle mouse parallax for loader background
window.addEventListener('mousemove', (e) => {
  loaderMouseX = (e.clientX - window.innerWidth / 2) * 0.05;
  loaderMouseY = (e.clientY - window.innerHeight / 2) * 0.05;
  
  // Spawn interactive stardust embers on movement
  if (loadingScreen && !loadingScreen.classList.contains('fade-out') && Math.random() < 0.35) {
    loaderInteractiveSparks.push({
      x: e.clientX,
      y: e.clientY,
      vx: (Math.random() - 0.5) * 1.5,
      vy: -Math.random() * 2 - 0.5,
      size: Math.random() * 2.2 + 0.8,
      alpha: 1.0,
      decay: Math.random() * 0.03 + 0.02,
      color: Math.random() > 0.4 ? '#38bdf8' : '#ffffff'
    });
  }
});

// Drifting deep space starfield particles
const loaderParticles = [];
for (let i = 0; i < 110; i++) {
  loaderParticles.push({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    size: Math.random() * 2.0 + 0.4,
    speedX: (Math.random() - 0.5) * 0.35,
    speedY: (Math.random() - 0.5) * 0.35,
    baseAlpha: Math.random() * 0.6 + 0.25,
    twinkleSpeed: Math.random() * 0.04 + 0.01,
    twinkleOffset: Math.random() * Math.PI * 2,
    color: Math.random() > 0.7 ? 'rgba(56,189,248,' : (Math.random() > 0.5 ? 'rgba(216,180,254,' : 'rgba(255,255,255,')
  });
}

// Interactive cursor embers & expanding shockwaves
const loaderInteractiveSparks = [];
const loaderShockwaves = [];

// 2 High-velocity 3D orbital light streams wrapping the monogram
const orbitalTrails = [
  { radiusX: 250, radiusY: 95, speed: 0.045, angle: 0, tilt: 0.35, color: '#ffffff', glowColor: 'rgba(56,189,248,0.9)' },
  { radiusX: 290, radiusY: 115, speed: -0.038, angle: Math.PI, tilt: -0.38, color: '#38bdf8', glowColor: 'rgba(168,85,247,0.85)' }
];

// Procedural arc plasma lightning bolts
let lastLightningTime = 0;
let currentLightningBolts = [];

function generateLightningBranch(x1, y1, x2, y2, displace) {
  if (displace < 7) {
    return [{ x: x1, y: y1 }, { x: x2, y: y2 }];
  }
  const midX = (x1 + x2) / 2 + (Math.random() - 0.5) * displace;
  const midY = (y1 + y2) / 2 + (Math.random() - 0.5) * displace;
  const left = generateLightningBranch(x1, y1, midX, midY, displace / 1.9);
  const right = generateLightningBranch(midX, midY, x2, y2, displace / 1.9);
  return left.concat(right.slice(1));
}

function spawnPlasmaLightning() {
  if (!loaderCanvas) return;
  const cx = loaderCanvas.width / 2;
  const cy = loaderCanvas.height / 2;
  const angle = Math.random() * Math.PI * 2;
  const dist = 140 + Math.random() * 80;
  const startX = cx + Math.cos(angle) * dist;
  const startY = cy + Math.sin(angle) * dist * 0.55;
  const endAngle = angle + (Math.random() - 0.5) * 1.8;
  const endX = cx + Math.cos(endAngle) * (dist * 0.5);
  const endY = cy + Math.sin(endAngle) * (dist * 0.3);

  const points = generateLightningBranch(startX, startY, endX, endY, 24);
  currentLightningBolts.push({
    points,
    alpha: 1.0,
    width: Math.random() * 2 + 1.2,
    color: Math.random() > 0.4 ? '#38bdf8' : '#ffffff'
  });
}

function drawLoaderScene(timestamp = 0) {
  if (!lCtx || !loaderCanvas) return;
  lCtx.clearRect(0, 0, loaderCanvas.width, loaderCanvas.height);
  const cx = loaderCanvas.width / 2 + loaderMouseX;
  const cy = loaderCanvas.height / 2 + loaderMouseY;

  // 1. Render drifting deep-space starfield with twinkle
  for (let p of loaderParticles) {
    p.x += p.speedX;
    p.y += p.speedY;
    if (p.x < 0) p.x = loaderCanvas.width;
    if (p.x > loaderCanvas.width) p.x = 0;
    if (p.y < 0) p.y = loaderCanvas.height;
    if (p.y > loaderCanvas.height) p.y = 0;

    const twinkle = 0.5 + 0.5 * Math.sin(timestamp * 0.003 + p.twinkleOffset);
    const alpha = p.baseAlpha * twinkle;

    lCtx.beginPath();
    lCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    lCtx.fillStyle = `${p.color}${alpha})`;
    lCtx.fill();
  }

  // 2. Render shockwave rings
  for (let i = loaderShockwaves.length - 1; i >= 0; i--) {
    const sw = loaderShockwaves[i];
    sw.radius += sw.speed;
    sw.alpha -= sw.decay;
    if (sw.alpha <= 0) {
      loaderShockwaves.splice(i, 1);
      continue;
    }

    lCtx.beginPath();
    lCtx.ellipse(sw.x, sw.y, sw.radius, sw.radius * 0.65, 0, 0, Math.PI * 2);
    lCtx.strokeStyle = `rgba(255, 255, 255, ${sw.alpha * 0.8})`;
    lCtx.lineWidth = sw.lineWidth;
    lCtx.shadowBlur = 20;
    lCtx.shadowColor = sw.color;
    lCtx.stroke();
    lCtx.shadowBlur = 0;
  }

  // 3. Render procedural plasma lightning arcs (active during early phases)
  if (timestamp - lastLightningTime > 320 && Math.random() < 0.7) {
    spawnPlasmaLightning();
    lastLightningTime = timestamp;
  }

  for (let i = currentLightningBolts.length - 1; i >= 0; i--) {
    const bolt = currentLightningBolts[i];
    bolt.alpha -= 0.08;
    if (bolt.alpha <= 0) {
      currentLightningBolts.splice(i, 1);
      continue;
    }

    lCtx.beginPath();
    lCtx.moveTo(bolt.points[0].x, bolt.points[0].y);
    for (let j = 1; j < bolt.points.length; j++) {
      lCtx.lineTo(bolt.points[j].x, bolt.points[j].y);
    }
    lCtx.strokeStyle = bolt.color;
    lCtx.globalAlpha = bolt.alpha;
    lCtx.lineWidth = bolt.width;
    lCtx.shadowBlur = 14;
    lCtx.shadowColor = bolt.color;
    lCtx.stroke();
    lCtx.shadowBlur = 0;
    lCtx.globalAlpha = 1.0;
  }

  // 4. Render dual 3D converging orbital trails with radiant comet heads
  for (let t of orbitalTrails) {
    t.angle += t.speed;
    const cos = Math.cos(t.angle);
    const sin = Math.sin(t.angle);
    const px = cx + cos * t.radiusX;
    const py = cy + sin * t.radiusY + (cos * t.radiusX * t.tilt);

    // Glowing comet head
    const glow = lCtx.createRadialGradient(px, py, 1, px, py, 18);
    glow.addColorStop(0, '#ffffff');
    glow.addColorStop(0.35, t.glowColor);
    glow.addColorStop(1, 'rgba(0,0,0,0)');

    lCtx.fillStyle = glow;
    lCtx.beginPath();
    lCtx.arc(px, py, 18, 0, Math.PI * 2);
    lCtx.fill();

    // Trailing plasma comet ribbon
    lCtx.beginPath();
    lCtx.moveTo(px, py);
    for (let s = 1; s <= 20; s++) {
      const pAngle = t.angle - (s * t.speed * 0.85);
      const ppx = cx + Math.cos(pAngle) * t.radiusX;
      const ppy = cy + Math.sin(pAngle) * t.radiusY + (Math.cos(pAngle) * t.radiusX * t.tilt);
      lCtx.lineTo(ppx, ppy);
    }
    lCtx.strokeStyle = t.color;
    lCtx.globalAlpha = 0.5;
    lCtx.lineWidth = 2.4;
    lCtx.stroke();
    lCtx.globalAlpha = 1.0;
  }

  // 5. Render interactive cursor embers
  for (let i = loaderInteractiveSparks.length - 1; i >= 0; i--) {
    const spark = loaderInteractiveSparks[i];
    spark.x += spark.vx;
    spark.y += spark.vy;
    spark.alpha -= spark.decay;
    if (spark.alpha <= 0) {
      loaderInteractiveSparks.splice(i, 1);
      continue;
    }

    lCtx.beginPath();
    lCtx.arc(spark.x, spark.y, spark.size, 0, Math.PI * 2);
    lCtx.fillStyle = spark.color;
    lCtx.globalAlpha = spark.alpha;
    lCtx.shadowBlur = 8;
    lCtx.shadowColor = spark.color;
    lCtx.fill();
    lCtx.shadowBlur = 0;
    lCtx.globalAlpha = 1.0;
  }

  loaderAnimFrame = requestAnimationFrame(drawLoaderScene);
}
if (loaderCanvas) drawLoaderScene();


/* ==========================================================================
   CINEMATIC VIDEO SYNCHRONIZATION & TELEMETRY CONTROLLER
   ========================================================================== */
const loaderVideo = document.getElementById('loader-video');
const loaderFlash = document.getElementById('loader-flash');
const loaderStage = document.getElementById('loader-stage');
const loaderFallback = document.getElementById('loader-fallback');
const loaderStatusText = document.getElementById('loader-status-text');
const loaderStageIndicator = document.getElementById('loader-stage-indicator');
const progressBar = document.getElementById('progress-bar');
const loaderPct = document.getElementById('loader-pct');
const loadingScreen = document.getElementById('loading-screen');
const mainContent = document.getElementById('main-content');
const loaderSoundToggle = document.getElementById('loader-sound-toggle');

// Climax timing in video: peak supernova flare occurs at 5.75s
const CLIMAX_TIME = 5.75;
let loaderCurrentPct = 0;
let transitionTriggered = false;
let flashFired = false;
let videoLoaded = false;
let fallbackTimer = null;

// Configure Video Playback
if (loaderVideo) {
  loaderVideo.playbackRate = 1.25; // 1.25x speed: rich yet crisp 4.6s intro sequence
  
  loaderVideo.addEventListener('loadedmetadata', () => {
    videoLoaded = true;
  });

  loaderVideo.addEventListener('timeupdate', () => {
    if (transitionTriggered) return;
    const cur = loaderVideo.currentTime;
    
    // Map current time to percentage up to the climax flash
    const pct = Math.min(Math.round((cur / CLIMAX_TIME) * 100), 100);
    updateLoaderProgress(pct);

    // Trigger climax supernova flash when reaching peak flare
    if (cur >= 5.5 && !flashFired) {
      triggerSupernovaFlash();
    }

    // Automatically transition to hero at 100% / peak climax
    if (cur >= CLIMAX_TIME && !transitionTriggered) {
      transitionToHero();
    }
  });

  loaderVideo.addEventListener('ended', () => {
    if (!transitionTriggered) transitionToHero();
  });

  loaderVideo.addEventListener('error', () => {
    console.warn("Video playback unavailable, activating procedural fallback.");
    activateFallbackSequence();
  });

  // Attempt autoplay
  const playPromise = loaderVideo.play();
  if (playPromise !== undefined) {
    playPromise.catch(() => {
      // If autoplay was restricted, video will still show poster, user can click to play
      console.log("Autoplay paused or awaiting interaction");
    });
  }
}

// Safety fallback timer if video is stalled or unsupported
setTimeout(() => {
  if (!videoLoaded && loaderCurrentPct < 15) {
    activateFallbackSequence();
  }
}, 1400);

function updateLoaderProgress(pct) {
  if (pct < loaderCurrentPct) return;
  loaderCurrentPct = pct;

  if (progressBar) progressBar.style.width = `${pct}%`;
  if (loaderPct) loaderPct.innerText = `${pct}%`;

  // Update telemetry status messages and phases
  if (loaderStatusText && loaderStageIndicator) {
    if (pct < 28) {
      loaderStatusText.innerText = 'CONVERGING PLASMA ENERGY CONTOURS';
      loaderStageIndicator.innerText = 'PHASE: 01/04';
    } else if (pct < 62) {
      loaderStatusText.innerText = 'ARC-WELDING 3D CHROME MONOGRAM';
      loaderStageIndicator.innerText = 'PHASE: 02/04';
    } else if (pct < 88) {
      loaderStatusText.innerText = 'IGNITING SPECULAR ANAMORPHIC CORE';
      loaderStageIndicator.innerText = 'PHASE: 03/04';
    } else {
      loaderStatusText.innerText = 'SYNCHRONIZING NEURAL 3D RUNTIME';
      loaderStageIndicator.innerText = 'PHASE: 04/04';
    }
  }
}

// Trigger Supernova Flash & Shockwave at Climax
function triggerSupernovaFlash() {
  if (flashFired) return;
  flashFired = true;

  if (loaderFlash) {
    loaderFlash.classList.add('flash-active');
    setTimeout(() => {
      loaderFlash.classList.remove('flash-active');
    }, 450);
  }

  // Trigger canvas shockwave ring
  if (loaderCanvas) {
    loaderShockwaves.push({
      x: loaderCanvas.width / 2,
      y: loaderCanvas.height / 2,
      radius: 20,
      speed: 28,
      alpha: 1.0,
      decay: 0.035,
      lineWidth: 5,
      color: '#38bdf8'
    });
    loaderShockwaves.push({
      x: loaderCanvas.width / 2,
      y: loaderCanvas.height / 2,
      radius: 10,
      speed: 20,
      alpha: 0.9,
      decay: 0.025,
      lineWidth: 3,
      color: '#ffffff'
    });
  }

  playUiSound('success');
}

// Procedural Fallback Animation Sequence
function activateFallbackSequence() {
  if (fallbackTimer || transitionTriggered) return;
  if (loaderFallback) loaderFallback.classList.remove('hidden');

  let current = loaderCurrentPct;
  fallbackTimer = setInterval(() => {
    current += 3;
    updateLoaderProgress(current);

    if (current >= 90 && !flashFired) {
      triggerSupernovaFlash();
    }

    if (current >= 100) {
      clearInterval(fallbackTimer);
      setTimeout(transitionToHero, 300);
    }
  }, 75);
}

// Transition from Loading Screen to 3D Hero
function transitionToHero() {
  if (transitionTriggered) return;
  transitionTriggered = true;

  triggerSupernovaFlash();
  playUiSound('teleport');

  if (loadingScreen) {
    loadingScreen.classList.add('fade-out');
  }

  if (mainContent) {
    mainContent.classList.remove('content-hidden');
    mainContent.classList.add('content-visible');
  }

  setTimeout(() => {
    if (loaderAnimFrame) cancelAnimationFrame(loaderAnimFrame);
    if (loadingScreen) loadingScreen.style.display = 'none';
  }, 900);
}

// Bypass or skip immediately
function forceEnterWebsite() {
  updateLoaderProgress(100);
  transitionToHero();
}

function handleStageClick() {
  // Clicking the logo stage accelerates video or transitions immediately
  if (loaderVideo && !loaderVideo.paused) {
    loaderVideo.playbackRate = 2.5;
  } else {
    forceEnterWebsite();
  }
}

// Toggle Loader Video Sound
function toggleLoaderSound(e) {
  if (e) e.stopPropagation();
  initAudioContext();
  if (!loaderVideo) return;

  loaderVideo.muted = !loaderVideo.muted;
  const soundIcon = document.getElementById('loader-sound-icon');
  const soundLabel = document.getElementById('loader-sound-label');

  if (!loaderVideo.muted) {
    if (soundLabel) soundLabel.innerText = 'SOUND: ON';
    if (soundIcon) soundIcon.setAttribute('data-lucide', 'volume-2');
    showToast("Intro Video Audio Enabled", "volume-2");
  } else {
    if (soundLabel) soundLabel.innerText = 'SOUND: OFF';
    if (soundIcon) soundIcon.setAttribute('data-lucide', 'volume-x');
    showToast("Intro Video Audio Muted", "volume-x");
  }
  if (window.lucide) window.lucide.createIcons();
}

// Replay Cinematic Intro Anytime
function replayIntro() {
  transitionTriggered = false;
  flashFired = false;
  loaderCurrentPct = 0;

  if (loadingScreen) {
    loadingScreen.style.display = 'flex';
    loadingScreen.classList.remove('fade-out');
  }
  if (mainContent) {
    mainContent.classList.remove('content-visible');
    mainContent.classList.add('content-hidden');
  }

  updateLoaderProgress(0);

  if (loaderVideo) {
    loaderVideo.currentTime = 0;
    loaderVideo.playbackRate = 1.25;
    loaderVideo.play().catch(() => {});
  } else {
    activateFallbackSequence();
  }

  if (!loaderAnimFrame && loaderCanvas) {
    drawLoaderScene();
  }

  showToast("Replaying Cinematic Intro", "play");
}

function handleLogoClick(e) {
  playUiSound('click');
  if (e.shiftKey || window.scrollY < 80) {
    replayIntro();
  }
}

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' || e.code === 'Space') {
    if (loadingScreen && loadingScreen.style.display !== 'none') {
      forceEnterWebsite();
    }
  }
});


/* ==========================================================================
   5. THREE.JS 3D CONTINUOUS WEBGL BACKGROUND ENGINE
   ========================================================================== */
const container = document.getElementById('three-container');
let scene, camera, renderer;
let ribbonMesh, outerRibbonMesh, ringMesh, particleSystem;
let currentGeometry = 'torus';
let isWireframe = true;
let autoSpinSpeed = 1.0;

// Cybernetic Metallic Wireframe Material (Permanent Wireframe Mode)
const chromeMaterial = new THREE.MeshStandardMaterial({
  color: 0xd6d9df,
  metalness: 0.94,
  roughness: 0.16,
  wireframe: true
});

const darkSilverMaterial = new THREE.MeshStandardMaterial({
  color: 0x474b54,
  metalness: 0.88,
  roughness: 0.32,
  wireframe: true
});

function initThreeScene() {
  if (!container) return;

  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x030305, 0.025);

  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 16);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  container.appendChild(renderer.domElement);

  // Cinematic Studio Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);

  const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
  keyLight.position.set(12, 18, 15);
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0xd8e8ff, 1.2);
  rimLight.position.set(-15, -10, 10);
  scene.add(rimLight);

  const cyanFill = new THREE.PointLight(0x38bdf8, 1.8, 45);
  cyanFill.position.set(2, 6, 8);
  scene.add(cyanFill);

  // Primary 3D Object: Flowing Torus Knot Ribbon
  const ribbonGeo = new THREE.TorusKnotGeometry(4.8, 0.82, 140, 24, 2, 3);
  ribbonMesh = new THREE.Mesh(ribbonGeo, chromeMaterial);
  ribbonMesh.position.set(4.2, -0.5, -2);
  scene.add(ribbonMesh);

  // Secondary Background Curved Ribbon
  const outerGeo = new THREE.TorusKnotGeometry(7.2, 0.42, 140, 18, 3, 5);
  outerRibbonMesh = new THREE.Mesh(outerGeo, darkSilverMaterial);
  outerRibbonMesh.position.set(-5, 1.5, -7);
  scene.add(outerRibbonMesh);

  // Geometric Chromed Core Ring
  const ringGeo = new THREE.TorusGeometry(3.5, 0.18, 16, 90);
  ringMesh = new THREE.Mesh(ringGeo, chromeMaterial);
  ringMesh.position.set(-3.5, -2.5, 0);
  ringMesh.rotation.x = Math.PI / 3;
  scene.add(ringMesh);

  // Floating Dust Particles in 3D Space
  const pCount = 320;
  const pGeo = new THREE.BufferGeometry();
  const pPos = new Float32Array(pCount * 3);

  for (let i = 0; i < pCount * 3; i += 3) {
    pPos[i] = (Math.random() - 0.5) * 50;
    pPos[i + 1] = (Math.random() - 0.5) * 40;
    pPos[i + 2] = (Math.random() - 0.5) * 40;
  }
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));

  const pMat = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.14,
    transparent: true,
    opacity: 0.7
  });

  particleSystem = new THREE.Points(pGeo, pMat);
  scene.add(particleSystem);

  // Mouse Parallax
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('resize', onWindowResize);

  animateThree();
}

let targetMouseX = 0, targetMouseY = 0;
let currentMouseX = 0, currentMouseY = 0;

function onMouseMove(e) {
  targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
  targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
}

function onWindowResize() {
  if (!camera || !renderer) return;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// 3D Animation Loop
const clock = new THREE.Clock();
function animateThree() {
  requestAnimationFrame(animateThree);
  const elapsedTime = clock.getElapsedTime();

  // Smooth mouse lerping
  currentMouseX += (targetMouseX - currentMouseX) * 0.05;
  currentMouseY += (targetMouseY - currentMouseY) * 0.05;

  // Dynamic continuous rotations
  if (ribbonMesh) {
    ribbonMesh.rotation.x = elapsedTime * 0.18 * autoSpinSpeed;
    ribbonMesh.rotation.y = elapsedTime * 0.22 * autoSpinSpeed;
  }

  if (outerRibbonMesh) {
    outerRibbonMesh.rotation.x = -elapsedTime * 0.12 * autoSpinSpeed;
    outerRibbonMesh.rotation.z = elapsedTime * 0.15 * autoSpinSpeed;
  }

  if (ringMesh) {
    ringMesh.rotation.z = elapsedTime * 0.25 * autoSpinSpeed;
    ringMesh.rotation.y = Math.sin(elapsedTime * 0.3) * 0.4;
  }

  if (particleSystem) {
    particleSystem.rotation.y = elapsedTime * 0.03;
    particleSystem.rotation.x = elapsedTime * 0.015;
  }

  // Camera parallax & smooth float
  if (camera) {
    camera.position.x = currentMouseX * 1.6 + Math.sin(elapsedTime * 0.2) * 0.4;
    camera.position.y = -currentMouseY * 1.3 + Math.cos(elapsedTime * 0.25) * 0.3;
    camera.lookAt(0, 0, 0);
  }

  if (renderer && scene && camera) {
    renderer.render(scene, camera);
  }
}

// Initialize Three scene
initThreeScene();


/* ==========================================================================
   6. 3D ENVIRONMENT HUD CONTROLS (Geometry Switcher & Wireframe)
   ========================================================================== */
function set3DGeometry(type) {
  if (!ribbonMesh) return;
  playUiSound('click');
  currentGeometry = type;

  // Update active HUD buttons
  document.querySelectorAll('.geom-btn').forEach(btn => {
    btn.classList.remove('active', 'bg-white/20', 'text-white');
    btn.classList.add('text-zinc-400');
  });
  if (event && event.currentTarget) {
    event.currentTarget.classList.add('active', 'bg-white/20', 'text-white');
    event.currentTarget.classList.remove('text-zinc-400');
  }

  ribbonMesh.geometry.dispose();

  if (type === 'torus') {
    ribbonMesh.geometry = new THREE.TorusKnotGeometry(4.8, 0.82, 140, 24, 2, 3);
    showToast("3D Geometry: Liquid Torus Knot", "box");
  } else if (type === 'sphere') {
    ribbonMesh.geometry = new THREE.IcosahedronGeometry(4.5, 3);
    showToast("3D Geometry: Cyber Geodesic Sphere", "globe");
  } else if (type === 'rings') {
    ribbonMesh.geometry = new THREE.TorusGeometry(4.5, 0.5, 24, 80);
    showToast("3D Geometry: Orbital Gyro Rings", "circle");
  }
}

function toggleWireframe() {
  isWireframe = !isWireframe;
  playUiSound('click');
  chromeMaterial.wireframe = isWireframe;
  darkSilverMaterial.wireframe = isWireframe;

  const btn = document.getElementById('wireframe-btn');
  if (btn) {
    btn.innerText = `WIREFRAME: ${isWireframe ? 'ON' : 'OFF'}`;
    btn.classList.toggle('text-white', isWireframe);
    btn.classList.toggle('bg-white/20', isWireframe);
  }
  showToast(`Wireframe: ${isWireframe ? 'Enabled' : 'Disabled'}`, 'layers');
}


/* ==========================================================================
   7. 3D TILT EFFECT ON PORTRAIT CARD
   ========================================================================== */
const portraitCard = document.getElementById('portrait-card');
if (portraitCard) {
  window.addEventListener('mousemove', (e) => {
    const rect = portraitCard.getBoundingClientRect();
    const cardX = rect.left + rect.width / 2;
    const cardY = rect.top + rect.height / 2;
    const distX = (e.clientX - cardX) / (window.innerWidth / 2);
    const distY = (e.clientY - cardY) / (window.innerHeight / 2);

    portraitCard.style.transform = `perspective(1000px) rotateY(${distX * 7}deg) rotateX(${-distY * 7}deg)`;
  });

  portraitCard.addEventListener('mouseleave', () => {
    portraitCard.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)';
  });
}


/* ==========================================================================
   8. CUSTOM CHROME MAGNETIC CURSOR (Desktop)
   ========================================================================== */
const cursorDot = document.getElementById('cursor-dot');
const cursorRing = document.getElementById('cursor-ring');
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let ringX = mouseX;
let ringY = mouseY;

window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  if (cursorDot) {
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
  }
});

function updateCursorRing() {
  ringX += (mouseX - ringX) * 0.18;
  ringY += (mouseY - ringY) * 0.18;

  if (cursorRing) {
    cursorRing.style.left = `${ringX}px`;
    cursorRing.style.top = `${ringY}px`;
  }
  requestAnimationFrame(updateCursorRing);
}
requestAnimationFrame(updateCursorRing);

// Dynamic Cursor Hover States with Sound FX
document.addEventListener('mouseover', (e) => {
  const interactive = e.target.closest('a, button, input, select, textarea, .cursor-pointer, .chrome-border');
  if (interactive) {
    document.body.classList.add('cursor-hover');
  }
});

document.addEventListener('mouseout', (e) => {
  const interactive = e.target.closest('a, button, input, select, textarea, .cursor-pointer, .chrome-border');
  if (interactive) {
    document.body.classList.remove('cursor-hover');
  }
});

// Magnetic Button Physics
function initMagneticButtons() {
  const magneticTargets = document.querySelectorAll(
    'a[href="#projects"], a[href="#contact"], .skill-filter-btn, #submit-btn, button[onclick*="Resume"], #audio-toggle, #video-sound-btn'
  );

  magneticTargets.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15 - 2.5}px) scale(1.02)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}
initMagneticButtons();


/* ==========================================================================
   9. NAVIGATION SCROLL SPY & HEADER TRANSITIONS
   ========================================================================== */
const sections = document.querySelectorAll('main, section');
const navLinks = document.querySelectorAll('.nav-link');
const siteHeader = document.getElementById('site-header');

window.addEventListener('scroll', () => {
  const scrollPos = window.scrollY + 200;

  // Header background blur on scroll
  if (siteHeader) {
    if (window.scrollY > 40) {
      siteHeader.classList.add('bg-black/70', 'backdrop-blur-xl', 'border-b', 'border-white/10', 'py-3.5');
      siteHeader.classList.remove('py-5', 'bg-transparent');
    } else {
      siteHeader.classList.remove('bg-black/70', 'backdrop-blur-xl', 'border-b', 'border-white/10', 'py-3.5');
      siteHeader.classList.add('py-5', 'bg-transparent');
    }
  }

  // Active section spy
  sections.forEach(sec => {
    const top = sec.offsetTop;
    const height = sec.offsetHeight;
    const id = sec.getAttribute('id');

    if (scrollPos >= top && scrollPos < top + height) {
      navLinks.forEach(link => {
        if (link.getAttribute('data-section') === id) {
          link.classList.add('text-white', 'active');
          link.classList.remove('text-zinc-400');
        } else {
          link.classList.remove('text-white', 'active');
          link.classList.add('text-zinc-400');
        }
      });
    }
  });
});


/* ==========================================================================
   10. MOBILE NAVIGATION DRAWER
   ========================================================================== */
let isDrawerOpen = false;
function toggleMobileDrawer() {
  isDrawerOpen = !isDrawerOpen;
  playUiSound('click');
  const drawer = document.getElementById('mobile-drawer');
  const panel = document.getElementById('drawer-panel');

  if (isDrawerOpen) {
    drawer.classList.remove('pointer-events-none', 'opacity-0');
    drawer.classList.add('opacity-100');
    panel.classList.remove('translate-x-full');
    panel.classList.add('translate-x-0');
    document.body.style.overflow = 'hidden';
  } else {
    panel.classList.remove('translate-x-0');
    panel.classList.add('translate-x-full');
    drawer.classList.remove('opacity-100');
    drawer.classList.add('opacity-0', 'pointer-events-none');
    document.body.style.overflow = 'auto';
  }
}


/* ==========================================================================
   11. SKILLS MATRIX FILTERING
   ========================================================================== */
function filterSkills(category) {
  playUiSound('click');

  // Update filter buttons
  document.querySelectorAll('.skill-filter-btn').forEach(btn => {
    btn.classList.remove('bg-white', 'text-black');
    btn.classList.add('chrome-border', 'text-zinc-400');
  });

  const activeBtn = Array.from(document.querySelectorAll('.skill-filter-btn')).find(b => {
    const text = b.innerText.toLowerCase();
    if (category === 'all' && text === 'all') return true;
    if (category === 'ai' && (text.includes('ai') || text.includes('vision'))) return true;
    if (category === 'iot' && (text.includes('embedded') || text.includes('iot'))) return true;
    if (category === 'software' && (text.includes('software') || text.includes('dev'))) return true;
    if (category === 'design' && (text.includes('design') || text.includes('hardware'))) return true;
    return false;
  });

  if (activeBtn) {
    activeBtn.classList.remove('chrome-border', 'text-zinc-400');
    activeBtn.classList.add('bg-white', 'text-black');
  }

  // Filter skills grid
  const cards = document.querySelectorAll('.skill-card');
  cards.forEach(card => {
    const cardCat = card.getAttribute('data-category');
    if (category === 'all' || cardCat === category) {
      card.style.display = 'block';
      card.style.opacity = '1';
      card.style.transform = 'scale(1)';
    } else {
      card.style.display = 'none';
      card.style.opacity = '0';
      card.style.transform = 'scale(0.95)';
    }
  });

  showToast(`Filtering: ${category.toUpperCase()} Arsenal`, 'cpu');
}

/* ==========================================================================
   12. PROJECT DETAIL MODAL SYSTEM & INTERACTIVE DEMOS
   ========================================================================== */
const projectData = {
  traffic_ai: {
    title: "AI-Powered Smart Traffic Intelligence & Road Safety System",
    category: "COMPUTER VISION & IOT",
    badge: "ACTIVE PROTOTYPE // LOW-COST",
    summary: "An adaptive urban traffic management system developed to replace rigid timer-based signals with computer vision and real-time deep learning. Utilizes YOLO and OpenCV to detect and classify multi-class vehicle density, dynamically adjust green signal phases, enforce virtual stop-line violation tracking, and immediately trigger automated emergency vehicle corridors with Arduino/ESP32 hardware serial synchronization.",
    metrics: [
      { label: "Vision Core", val: "YOLOv8 + OpenCV" },
      { label: "Latency", val: "28ms / Frame (Realtime)" },
      { label: "Hardware Bridge", val: "Arduino UNO / ESP32" },
      { label: "Safety Priority", val: "Automated Green Corridor" }
    ],
    architecture: [
      "Real-time video stream ingested and processed through an optimized OpenCV image processing pipeline.",
      "YOLOv8 deep learning model performs multi-class vehicle detection, density quantification, and siren/ambulance recognition.",
      "Dynamic queue supervisor continuously computes adaptive green phase timings based on traffic saturation.",
      "Asynchronous serial protocol dispatches byte commands directly to Arduino/ESP32 microcontrollers to switch physical relay signals.",
      "Violation tracking submodule captures stop-line boundary infractions and records telemetry in the central dashboard."
    ],
    tags: ["Computer Vision", "YOLOv8", "OpenCV", "Python", "Arduino", "ESP32", "Serial Comm", "Road Safety"],
    simulationType: "traffic"
  },
  fire_detector: {
    title: "Fire And Smoke Detector For Machine",
    category: "EMBEDDED SYSTEMS & SAFETY",
    badge: "DEPLOYED HARDWARE // RELIABLE",
    summary: "A robust industrial safety and early-warning environmental monitoring system built on Arduino UNO. Leverages an MQ2 electrochemical sensor to detect dangerous gases and smoke particulates alongside an infrared flame sensor to detect active fires in real time. Deploys instantaneous high-decibel acoustic buzzer alarms and updates a 16x2 LCD display to protect machinery, workshops, and facilities.",
    metrics: [
      { label: "Controller", val: "Arduino UNO (ATmega328P)" },
      { label: "Sensors", val: "MQ2 Gas + Flame IR" },
      { label: "Response Time", val: "< 150ms Instant Alert" },
      { label: "Display Unit", val: "16x2 HD44780 LCD" }
    ],
    architecture: [
      "MQ2 sensor continuously measures atmospheric concentrations of smoke, LPG, methane, and toxic combustible gases.",
      "Optical infrared flame sensor detects flame radiation wavelengths between 760nm - 1100nm.",
      "Arduino firmware computes analog threshold cross-checks with noise debouncing and state stabilization.",
      "Instant dual safety actuation: activates high-decibel piezo buzzer alarm and renders real-time telemetry on the 16x2 LCD.",
      "Engineered with modular pin topology for future expansion with IoT telemetry, automatic sprinklers, and GSM modules."
    ],
    tags: ["Arduino UNO", "Sensor Interfacing", "MQ2 Sensor", "Flame Sensor", "Circuit Design", "Breadboarding", "Safety Automation"],
    simulationType: "fire"
  },
  hovercraft: {
    title: "Single Motor RC Hovercraft",
    category: "AERODYNAMICS & ROBOTICS",
    badge: "AERODYNAMIC PROTOTYPE",
    summary: "A lightweight radio-controlled hovercraft engineered with an airflow splitting mechanism that solves the classic multi-motor dependency. Powered by a single high-KV brushless motor that simultaneously pressurizes the perimeter air-cushion plenum for ground levitation and drives high-velocity propulsion over twin 9g servo-actuated aerodynamic rudders.",
    metrics: [
      { label: "Motor", val: "2200KV BLDC (Single Motor)" },
      { label: "Airflow Split", val: "40% Lift / 60% Thrust" },
      { label: "ESC Unit", val: "30A SimonK Brushless" },
      { label: "Steering", val: "Dual 9g Servo Depron Rudders" }
    ],
    architecture: [
      "Single 2200KV brushless outrunner motor mounted inside a precision aerodynamic duct.",
      "Engineered splitter duct channels ~40% airflow directly downward into the skirt plenum to create a low-friction air cushion.",
      "Remaining ~60% linear airflow is expelled rearward across twin aerodynamic Depron rudders for high-authority yaw control.",
      "Precision structural chassis sculpted from lightweight XPS foam with reinforced ripstop vinyl perimeter skirt.",
      "3-cell 11.1V LiPo battery and 30A ESC deliver instant throttle response across smooth floors and water surfaces."
    ],
    tags: ["Aerodynamics", "Airflow Management", "Brushless BLDC", "ESC 30A", "RC Electronics", "XPS Foam Fabrication", "Servo Control"],
    simulationType: "hovercraft"
  },
  idea_lab: {
    title: "PCE-AICTE IDEA Lab Smart Systems",
    category: "DIGITAL PROTOTYPING & EMBEDDED",
    badge: "AICTE ACCREDITED // 2026",
    summary: "Hands-on product development and rapid engineering at Poornima AICTE IDEA Lab. Comprehensive prototyping spanning custom PCB fabrication, 3D printing (FDM & SLA), laser cutting, CNC precision machining, and ESP32 cloud-connected sensor integration for smart city infrastructure.",
    metrics: [
      { label: "Rapid Fabrication", val: "3D (FDM/SLA) + Laser Cut" },
      { label: "Electronics", val: "PCB Milling & Soldering" },
      { label: "Connected MCUs", val: "ESP32, Arduino & Sensors" },
      { label: "Program", val: "AICTE IDEA Lab Fellow" }
    ],
    architecture: [
      "Ideation and CAD modeling of customized enclosures and mechanical mounts.",
      "Rapid additive manufacturing using SLA and FDM 3D printing with sub-millimeter tolerances.",
      "Custom single/double-sided PCB design, chemical etching, CNC routing, and surface-mount soldering.",
      "Firmware integration for sensor telemetry, Wi-Fi connectivity, and cloud dashboard synchronization."
    ],
    tags: ["AICTE IDEA Lab", "3D Printing", "PCB Design", "Laser Cutting", "CNC Machining", "ESP32", "IoT"],
    simulationType: "idealab"
  },
  udaan_graphics: {
    title: "Udaan Aeromodelling Creative Suite",
    category: "GRAPHIC DESIGN & BRANDING",
    badge: "OFFICIAL CLUB DESIGNER",
    summary: "Visual identity, aerospace-themed promotional graphics, technical banners, and digital marketing materials crafted for Udaan Aeromodelling Club. Enhances brand recognition across drone exhibitions, aeromodelling workshops, and inter-college aero-design competitions.",
    metrics: [
      { label: "Design Role", val: "Lead Graphic Designer" },
      { label: "Core Tools", val: "Canva, Vector & Typography" },
      { label: "Impact", val: "College-Wide Brand Identity" },
      { label: "Medium", val: "Print, Digital & Social Assets" }
    ],
    architecture: [
      "Aerodynamic visual theme: metallic textures, aerospace blueprints, and high-contrast typography.",
      "High-resolution vector assets for campus banners, social media announcements, and workshop guides.",
      "Brand style guide establishing uniform identity across photography, digital media, and certificates."
    ],
    tags: ["Graphic Design", "Canva", "Brand Identity", "Visual Media", "Aeromodelling Club", "Typography"],
    simulationType: "graphics"
  },
  ecell_initiatives: {
    title: "E-Cell IIT Bombay Campus Outreach",
    category: "LEADERSHIP & ENTREPRENEURSHIP",
    badge: "CAMPUS AMBASSADOR // ACTIVE",
    summary: "Fostering entrepreneurial spirit, technological innovation, and startup culture representing E-Cell IIT Bombay. Connecting aspiring student founders with industry mentors, promoting nationwide hackathons and pitch competitions, and orchestrating campus workshops.",
    metrics: [
      { label: "Organization", val: "E-Cell, IIT Bombay" },
      { label: "Tenure", val: "Jun 2026 - Present" },
      { label: "Role", val: "Campus Ambassador" },
      { label: "Network", val: "IIT Bombay Startup Ecosystem" }
    ],
    architecture: [
      "Promoting national-level entrepreneurial summits, ideation sprints, and venture workshops.",
      "Mentoring peer students on turning hardware/software ideas into viable technological prototypes.",
      "Acting as the vital bridge between university talent and IIT Bombay's premier incubation network."
    ],
    tags: ["E-Cell IIT Bombay", "Leadership", "Entrepreneurship", "Public Speaking", "Community Building"],
    simulationType: "ecell"
  }
};

function openProjectModal(key) {
  playUiSound('click');
  const modal = document.getElementById('project-modal');
  const content = document.getElementById('modal-content');
  const proj = projectData[key];

  if (!modal || !content || !proj) return;

  content.innerHTML = `
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
      <div>
        <div class="text-[11px] font-mono-display text-cyan-400 tracking-widest uppercase">${proj.category}</div>
        <h2 class="text-2xl sm:text-3xl font-extrabold font-syne text-white mt-1">${proj.title}</h2>
      </div>
      <div class="px-3 py-1 rounded-full chrome-badge text-xs font-mono-display text-emerald-400 self-start sm:self-center">
        ${proj.badge}
      </div>
    </div>

    <!-- Summary -->
    <p class="text-sm text-zinc-300 leading-relaxed">
      ${proj.summary}
    </p>

    <!-- Key Performance Metrics Grid -->
    <div>
      <h4 class="text-xs font-mono-display text-zinc-400 uppercase tracking-widest mb-3">SYSTEM TELEMETRY</h4>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        ${proj.metrics.map(m => `
          <div class="chrome-border p-3 rounded-xl">
            <div class="text-[10px] font-mono-display text-zinc-500 uppercase">${m.label}</div>
            <div class="text-xs font-bold text-white font-mono-display mt-1">${m.val}</div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Architecture & Operational Blueprint -->
    <div>
      <h4 class="text-xs font-mono-display text-zinc-400 uppercase tracking-widest mb-3">ARCHITECTURE WORKFLOW</h4>
      <div class="space-y-2">
        ${proj.architecture.map((step, idx) => `
          <div class="chrome-border p-3.5 rounded-xl flex items-start space-x-3 text-xs text-zinc-300">
            <span class="w-5 h-5 rounded-md chrome-badge flex items-center justify-center font-mono-display text-[11px] text-cyan-400 shrink-0 mt-0.5">0${idx + 1}</span>
            <span class="leading-relaxed">${step}</span>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Interactive Simulator Sandbox -->
    <div class="chrome-border p-4 rounded-2xl bg-black/60">
      <div class="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
        <span class="text-xs font-mono-display text-emerald-400 flex items-center space-x-2">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>INTERACTIVE SIMULATOR RUNTIME</span>
        </span>
        <button onclick="runProjectSimulation('${key}')" class="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-mono-display text-white transition-colors cursor-pointer">
          RE-RUN EXECUTION
        </button>
      </div>
      <div id="simulation-output" class="font-mono-display text-xs text-zinc-300 bg-zinc-950 p-4 rounded-xl min-h-[90px] flex flex-col justify-center">
        <div class="text-zinc-500">[ Ready ] Click 'RE-RUN EXECUTION' to trigger live sandbox test suite.</div>
      </div>
    </div>

    <!-- Tech Stack Tags & Actions -->
    <div class="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-white/10">
      <div class="flex flex-wrap gap-1.5">
        ${proj.tags.map(t => `<span class="px-2.5 py-1 rounded-md chrome-badge text-[10px] font-mono-display text-zinc-300">${t}</span>`).join('')}
      </div>
      <div class="flex items-center space-x-3">
        <button onclick="simulateRepoView('${proj.title}')" class="px-4 py-2 rounded-xl chrome-border hover:bg-white/10 text-xs font-mono-display uppercase tracking-wider text-white transition-all cursor-pointer">
          VIEW REPO
        </button>
        <button onclick="simulateLiveDeploy('${proj.title}')" class="px-5 py-2 rounded-xl bg-white hover:bg-zinc-200 text-black font-bold text-xs font-mono-display uppercase tracking-wider transition-all cursor-pointer">
          LAUNCH LIVE
        </button>
      </div>
    </div>
  `;

  modal.classList.remove('hidden');
  modal.classList.add('flex');
  document.body.style.overflow = 'hidden';

  // Automatically start initial simulation run
  setTimeout(() => runProjectSimulation(key), 300);
}

function closeProjectModal() {
  playUiSound('click');
  const modal = document.getElementById('project-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
  document.body.style.overflow = 'auto';
}

// Close modal on click outside
window.addEventListener('click', (e) => {
  const modal = document.getElementById('project-modal');
  if (e.target === modal) closeProjectModal();
  const resModal = document.getElementById('resume-modal');
  if (e.target === resModal) closeResumeModal();
});

// Interactive Project Sandbox Simulator
function runProjectSimulation(key) {
  playUiSound('hover');
  const output = document.getElementById('simulation-output');
  if (!output) return;

  output.innerHTML = `<span class="text-cyan-400 animate-pulse">> Initializing telemetry stream for ${key}...</span>`;

  setTimeout(() => {
    if (key === 'traffic_ai') {
      output.innerHTML = `
        <div class="text-cyan-400 font-mono-display">> [OpenCV Feed] Stream active: 1920x1080 @ 30 FPS</div>
        <div class="text-zinc-300 pt-1">> [YOLOv8 Inference] Detected: 32 Cars, 3 Buses, 1 Emergency Ambulance (North Lane)</div>
        <div class="text-emerald-400 font-bold">> [Emergency Corridor] AMBULANCE OVERRIDE TRIGGERED on North Axis</div>
        <div class="text-zinc-400">> [Serial Bridge] Sent command: <code>SET_LIGHT(LANE_N, GREEN, DURATION=45)</code></div>
        <div class="text-cyan-300 font-bold pt-1">> [Telemetry] Virtual Stop-line Violations: 0 | Green Wave Active (Latency: 26.4ms)</div>
      `;
    } else if (key === 'fire_detector') {
      output.innerHTML = `
        <div class="text-amber-400 font-mono-display">> [Arduino UNO ATmega328P] Initializing ADC A0 (MQ2) & D2 (Flame Sensor)...</div>
        <div class="text-zinc-300 pt-1">> Baseline Air Quality: 115 PPM (Clean Atmosphere < 300 PPM)</div>
        <div class="text-red-400 font-bold">> [Hazard Triggered] Smoke spike: 720 PPM | Flame IR Detected (880nm radiation)</div>
        <div class="text-zinc-300">> [Buzzer Output] Pin D8 -> High Frequency Alert Tone (2.8 kHz Active)</div>
        <div class="text-red-400 font-bold pt-1">> [LCD 16x2] Message Displayed: "!! FIRE ALERT !! EVACUATE MACHINE AREA"</div>
      `;
    } else if (key === 'hovercraft') {
      output.innerHTML = `
        <div class="text-cyan-400 font-mono-display">> [RC Avionics] Connecting 2.4GHz Receiver to SimonK 30A ESC...</div>
        <div class="text-zinc-300 pt-1">> [Brushless Motor] 2200KV BLDC spooling to 68% Throttle (14,200 RPM)</div>
        <div class="text-emerald-400 font-bold">> [Airflow Splitter] 40% channeled to Skirt Plenum -> Cushion Pressure: 1.82 kPa</div>
        <div class="text-zinc-300">> [Levitation State] Ground clearance: 13.5mm | Surface friction minimized</div>
        <div class="text-cyan-300 font-bold pt-1">> [Rudder Servo] Dual 9g deflection: +24° -> Stable Vector Thrust Engaged</div>
      `;
    } else if (key === 'idea_lab') {
      output.innerHTML = `
        <div class="text-emerald-400 font-mono-display">> [PCE-AICTE IDEA LAB] Diagnostics Suite Initialized...</div>
        <div class="text-zinc-300 pt-1">> ESP32 Wi-Fi Telemetry: Connected to Local IoT Broker (RSSI: -48dBm)</div>
        <div class="text-zinc-400">> 3D Chassis Tolerance: +-0.1mm (FDM Precision) | Laser Cut Mounts: OK</div>
        <div class="text-emerald-400 font-bold pt-1">> Status: IoT Hardware Prototype Online & Transmitting Packet Streams</div>
      `;
    } else if (key === 'udaan_graphics') {
      output.innerHTML = `
        <div class="text-purple-400 font-mono-display">> [Udaan Creative Suite] Canva & Vector Pipeline Active...</div>
        <div class="text-zinc-300 pt-1">> Rendered Aeromodelling Event Showcase Banner (300 DPI, CMYK)</div>
        <div class="text-zinc-400">> Assets Published: Social Posters, Workshop Guides & ID Badges</div>
        <div class="text-purple-300 font-bold pt-1">> Visual Identity: Modern Cyber-Aero Theme Deployed</div>
      `;
    } else if (key === 'ecell_initiatives') {
      output.innerHTML = `
        <div class="text-cyan-400 font-mono-display">> [E-Cell IIT Bombay] Campus Ambassador Node Connected...</div>
        <div class="text-zinc-300 pt-1">> Synchronizing Outreach: National Entrepreneurship Challenge</div>
        <div class="text-zinc-400">> 180+ Student Innovators Engaged | Mentorship Sessions Scheduled</div>
        <div class="text-emerald-400 font-bold pt-1">> Ecosystem Status: Active Leadership & Campus Incubation Support</div>
      `;
    } else {
      output.innerHTML = `
        <div class="text-zinc-300">> Running diagnostic sequence for ${key}...</div>
        <div class="text-emerald-400 pt-1">> System telemetry validated (100% operational)</div>
      `;
    }
    playUiSound('success');
  }, 600);
}

function simulateRepoView(title) {
  playUiSound('click');
  showToast(`Opening GitHub repository...`, 'github');
  window.open('https://github.com/anshumansingh5511-byte', '_blank');
}

function simulateLiveDeploy(title) {
  playUiSound('click');
  showToast(`Deploy preview initiated for: ${title}`, 'external-link');
}


/* ==========================================================================
   13. RESUME / CV MODAL
   ========================================================================== */
function openResumeModal() {
  playUiSound('click');
  const modal = document.getElementById('resume-modal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
  }
}

function closeResumeModal() {
  playUiSound('click');
  const modal = document.getElementById('resume-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = 'auto';
  }
}

function downloadResumePdf() {
  playUiSound('success');
  showToast("Downloading Anshuman_Singh_Resume.pdf...", "download");
  const a = document.createElement('a');
  a.href = 'assets/Anshuman_Singh_Resume.pdf';
  a.setAttribute('download', 'Anshuman_Singh_Resume.pdf');
  a.target = '_blank';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
  }, 500);
}

function switchResumeTab(tab) {
  playUiSound('click');
  const interactiveView = document.getElementById('resume-interactive-view');
  const pdfView = document.getElementById('resume-pdf-view');
  const tabInteractive = document.getElementById('tab-resume-interactive');
  const tabPdf = document.getElementById('tab-resume-pdf');

  if (tab === 'interactive') {
    if (interactiveView) interactiveView.classList.remove('hidden');
    if (pdfView) pdfView.classList.add('hidden');
    if (tabInteractive) {
      tabInteractive.classList.add('bg-white', 'text-black');
      tabInteractive.classList.remove('chrome-border', 'text-zinc-400');
    }
    if (tabPdf) {
      tabPdf.classList.remove('bg-white', 'text-black');
      tabPdf.classList.add('chrome-border', 'text-zinc-400');
    }
  } else {
    if (interactiveView) interactiveView.classList.add('hidden');
    if (pdfView) pdfView.classList.remove('hidden');
    if (tabPdf) {
      tabPdf.classList.add('bg-white', 'text-black');
      tabPdf.classList.remove('chrome-border', 'text-zinc-400');
    }
    if (tabInteractive) {
      tabInteractive.classList.remove('bg-white', 'text-black');
      tabInteractive.classList.add('chrome-border', 'text-zinc-400');
    }
  }
}


/* ==========================================================================
   14. CONTACT FORM HANDLING & CLIPBOARD COPY
   ========================================================================== */
function updateCharCount() {
  const msg = document.getElementById('contact-message');
  const count = document.getElementById('char-count');
  if (msg && count) {
    count.innerText = `${msg.value.length} / 1000`;
  }
}

function handleContactSubmit(e) {
  e.preventDefault();
  playUiSound('click');

  const btn = document.getElementById('submit-btn');
  const btnText = document.getElementById('btn-text');
  const btnIcon = document.getElementById('btn-icon');
  const name = document.getElementById('contact-name').value;
  const email = document.getElementById('contact-email').value;

  // Sending state
  btn.disabled = true;
  btnText.innerText = "TRANSMITTING ENCRYPTED PAYLOAD...";
  if (btnIcon) btnIcon.classList.add('animate-spin');

  setTimeout(() => {
    btn.disabled = false;
    btnText.innerText = "TRANSMISSION SUCCESSFUL ✓";
    if (btnIcon) btnIcon.classList.remove('animate-spin');

    playUiSound('success');
    showToast(`Transmission received, ${name}! I'll reply via ${email} within 24h.`, "check-circle");

    // Reset form
    document.getElementById('contact-form').reset();
    updateCharCount();

    setTimeout(() => {
      btnText.innerText = "TRANSMIT MESSAGE";
    }, 4000);
  }, 1400);
}

function copyEmail() {
  playUiSound('click');
  const email = "anshumansingh5511@gmail.com";
  navigator.clipboard.writeText(email).then(() => {
    showToast("Email address copied to clipboard!", "check-circle");
    playUiSound('success');
  }).catch(() => {
    showToast("Email: anshumansingh5511@gmail.com", "mail");
  });
}


/* ==========================================================================
   15. CONTINUOUS HERO VIDEO PLAYBACK & AUDIO CONTROLLER
   ========================================================================== */
function initHeroVideo() {
  const heroVideo = document.getElementById('hero-video');
  if (!heroVideo) return;

  // Guarantee loop & continuous autoplay
  heroVideo.loop = true;
  heroVideo.muted = true;

  const playPromise = heroVideo.play();
  if (playPromise !== undefined) {
    playPromise.catch(() => {
      // If browser blocked autoplay, start on first user interaction
      const startPlayback = () => {
        heroVideo.play().catch(() => {});
        document.removeEventListener('click', startPlayback);
        document.removeEventListener('scroll', startPlayback);
      };
      document.addEventListener('click', startPlayback);
      document.addEventListener('scroll', startPlayback);
    });
  }

  // Ensure seamless loop restart without pauses
  heroVideo.addEventListener('ended', () => {
    heroVideo.currentTime = 0;
    heroVideo.play().catch(() => {});
  });
}
document.addEventListener('DOMContentLoaded', initHeroVideo);
setTimeout(initHeroVideo, 500);

function toggleHeroVideoSound() {
  const vid = document.getElementById('hero-video');
  const icon = document.getElementById('video-sound-icon');
  const text = document.getElementById('video-sound-text');
  if (!vid) return;

  vid.muted = !vid.muted;
  if (!vid.muted) {
    vid.volume = 0.8;
    vid.play().catch(() => {});
    if (text) text.innerText = 'AUDIO ON';
    if (icon) {
      icon.setAttribute('data-lucide', 'volume-2');
      if (window.lucide) window.lucide.createIcons();
    }
    showToast('Video Audio: ON', 'volume-2');
    playUiSound('click');
  } else {
    if (text) text.innerText = 'MUTED';
    if (icon) {
      icon.setAttribute('data-lucide', 'volume-x');
      if (window.lucide) window.lucide.createIcons();
    }
    showToast('Video Audio: MUTED', 'volume-x');
    playUiSound('click');
  }
}



/* ==========================================================================
   16. DYNAMIC CLICK RIPPLE WAVE SYSTEM
   ========================================================================== */
document.addEventListener('click', (e) => {
  const target = e.target.closest('button, a.chrome-border, a[href="#projects"], .skill-filter-btn, #submit-btn');
  if (!target) return;

  const rect = target.getBoundingClientRect();
  const circle = document.createElement('span');
  const diameter = Math.max(rect.width, rect.height) * 1.5;
  const radius = diameter / 2;

  circle.style.width = circle.style.height = `${diameter}px`;
  circle.style.left = `${e.clientX - rect.left - radius}px`;
  circle.style.top = `${e.clientY - rect.top - radius}px`;
  circle.classList.add('btn-ripple-wave');

  // Intelligent contrast detection
  const isLight = target.classList.contains('bg-white') || window.getComputedStyle(target).backgroundColor.includes('255, 255, 255');
  if (isLight) {
    circle.style.background = 'radial-gradient(circle, rgba(0, 0, 0, 0.25) 0%, rgba(56, 189, 248, 0.2) 60%, transparent 100%)';
  } else {
    circle.style.background = 'radial-gradient(circle, rgba(255, 255, 255, 0.5) 0%, rgba(56, 189, 248, 0.4) 50%, transparent 100%)';
  }

  const existingRipple = target.querySelector('.btn-ripple-wave');
  if (existingRipple) existingRipple.remove();

  target.appendChild(circle);

  setTimeout(() => {
    circle.remove();
  }, 650);
});
