/**
 * Globe terrestre interactif centré sur Abidjan (textures NASA via three.js) :
 * lumières des villes côté nuit, nuages, halo atmosphérique, balise orange pulsante.
 * Glisser pour tourner ; il revient doucement vers Abidjan au repos.
 * (Porté du site AIA de Jcalixte24.)
 */
import * as THREE from 'three';

const clamp = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x));

export function initGlobe(boite: HTMLElement, canvas: HTMLCanvasElement, balise: HTMLElement): void {
  const reduit = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const R = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  R.setPixelRatio(Math.min(devicePixelRatio, 2));
  R.outputColorSpace = THREE.SRGBColorSpace;

  const sc = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  cam.position.z = 7.4;
  const L = new THREE.TextureLoader();
  const tex = (n: string, couleur = true) => {
    const t = L.load('/images/textures/' + n);
    if (couleur) t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    return t;
  };

  const terre = new THREE.Mesh(
    new THREE.SphereGeometry(1.5, 96, 96),
    new THREE.MeshPhongMaterial({
      map: tex('earth_atmos.webp'),
      specularMap: tex('earth_specular.webp', false),
      specular: new THREE.Color(0x335577),
      shininess: 18,
      emissiveMap: tex('earth_lights.webp'),
      emissive: new THREE.Color(0xffc58a),
      emissiveIntensity: 1.1,
    }),
  );
  const nuages = new THREE.Mesh(
    new THREE.SphereGeometry(1.515, 64, 64),
    new THREE.MeshLambertMaterial({ map: tex('earth_clouds.webp'), transparent: true, opacity: 0.55, depthWrite: false }),
  );
  const atmosphere = new THREE.Mesh(
    new THREE.SphereGeometry(1.72, 64, 64),
    new THREE.ShaderMaterial({
      transparent: true,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexShader:
        'varying vec3 n;void main(){n=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
      fragmentShader:
        'varying vec3 n;void main(){float i=pow(.62-dot(n,vec3(0.,0.,1.)),3.);gl_FragColor=vec4(.35,.6,1.,1.)*i*1.6;}',
    }),
  );
  const groupe = new THREE.Group();
  groupe.add(terre, nuages);
  sc.add(groupe, atmosphere);

  // Abidjan : 5°21′ N, 4°01′ O
  const lat = 5.36, lon = -4.03, ph = ((90 - lat) * Math.PI) / 180, th = ((lon + 180) * Math.PI) / 180, r = 1.5;
  const pos = new THREE.Vector3(-r * Math.sin(ph) * Math.cos(th), r * Math.cos(ph), r * Math.sin(ph) * Math.sin(th));
  const point = new THREE.Mesh(new THREE.SphereGeometry(0.035, 16, 16), new THREE.MeshBasicMaterial({ color: 0xf77f00 }));
  point.position.copy(pos);
  const onde = new THREE.Mesh(
    new THREE.RingGeometry(0.05, 0.062, 40),
    new THREE.MeshBasicMaterial({ color: 0xf77f00, transparent: true, side: THREE.DoubleSide }),
  );
  onde.position.copy(pos.clone().multiplyScalar(1.004));
  onde.lookAt(pos.clone().multiplyScalar(2));
  terre.add(point, onde);

  sc.add(new THREE.AmbientLight(0x7a6a8a, 0.4));
  const soleil = new THREE.DirectionalLight(0xfff2dd, 2.4);
  soleil.position.set(-4, 2.5, 4);
  sc.add(soleil);

  const base = Math.atan2(-pos.x, pos.z);
  let ry = base - 1.6, rx = 0.22, vx = 0, vy = 0, glisse = false, px = 0, py = 0, repos = 0;
  const ajuster = () => R.setSize(boite.clientWidth, boite.clientWidth, false);
  ajuster();
  addEventListener('resize', ajuster);

  boite.addEventListener('pointerdown', (e) => {
    glisse = true;
    px = e.clientX;
    py = e.clientY;
    boite.setPointerCapture(e.pointerId);
  });
  boite.addEventListener('pointermove', (e) => {
    if (!glisse) return;
    vx = (e.clientX - px) * 0.008;
    vy = (e.clientY - py) * 0.005;
    ry += vx;
    rx = clamp(rx + vy, -0.9, 0.9);
    px = e.clientX;
    py = e.clientY;
    repos = 0;
  });
  const lacher = () => (glisse = false);
  boite.addEventListener('pointerup', lacher);
  boite.addEventListener('pointercancel', lacher);

  let visible = false, t = 0;
  new IntersectionObserver((es) => (visible = es[0].isIntersecting)).observe(boite);
  const v = new THREE.Vector3();
  const boucle = () => {
    requestAnimationFrame(boucle);
    if (!visible) return;
    t += 0.016;
    if (!glisse) {
      repos += 0.016;
      ry += vx;
      vx *= 0.94;
      if (repos > 2) {
        const but = base - 0.15 + (reduit ? 0 : Math.sin(t * 0.3) * 0.5);
        ry += (but - ry) * 0.02;
      }
      rx += (0.22 - rx) * 0.01;
    }
    groupe.rotation.set(rx, ry, 0);
    if (!reduit) nuages.rotation.y += 0.0006;
    const k = (t * 1.1) % 1;
    onde.scale.setScalar(1 + k * 1.8);
    (onde.material as THREE.MeshBasicMaterial).opacity = 1 - k;
    R.render(sc, cam);
    v.copy(pos);
    terre.localToWorld(v);
    const face = v.z > 0.25;
    v.project(cam);
    balise.style.opacity = face ? '1' : '0';
    balise.style.left = (v.x * 0.5 + 0.5) * 100 + '%';
    balise.style.top = (-v.y * 0.5 + 0.5) * 100 + '%';
  };
  boucle();
}
