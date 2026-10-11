/**
 * Télescope 3D de l'accueil : un réfracteur sur monture équatoriale (axe incliné à 5,36°,
 * la latitude d'Abidjan) qui se décompose au défilement, puis la caméra plonge dans l'objectif.
 *
 * L'état d'animation est piloté de l'extérieur (GSAP ScrollTrigger dans accueil.ts) :
 *   e : écartement des pièces (0 → 1)      o : rotation de la caméra vers le profil
 *   d : recentrage avant la plongée         t : traversée du tube (plongée)
 *   l : opacité des 8 étiquettes
 *
 * Porté du site AIA de Jcalixte24 et recoloré aux couleurs du logo (crème, aubergine, orange).
 */
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

export interface EtatTelescope {
  e: number;
  o: number;
  d: number;
  t: number;
  l: number[];
}

const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const clamp = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x));
const lisse = (x: number) => x * x * (3 - 2 * x);

interface Piece {
  g: THREE.Group;
  base: THREE.Vector3;
  dir: THREE.Vector3;
  dist: number;
  spin: [number, number, number];
}

export function initTelescope(stage: HTMLElement, canvas: HTMLCanvasElement, S: EtatTelescope): void {
  const reduit = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const R = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  R.setPixelRatio(Math.min(devicePixelRatio, 2));
  R.toneMapping = THREE.ACESFilmicToneMapping;
  R.outputColorSpace = THREE.SRGBColorSpace;

  const sc = new THREE.Scene();
  const pm = new THREE.PMREMGenerator(R);
  sc.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
  const cam = new THREE.PerspectiveCamera(28, 1, 0.05, 120);

  const cle = new THREE.DirectionalLight(0xfff1dc, 2.1);
  cle.position.set(5, 6, 8);
  const contre = new THREE.DirectionalLight(0xf77f00, 3.2); // liseré orange
  contre.position.set(-6, 2, -7);
  const appoint = new THREE.DirectionalLight(0x9a7aa6, 1.3); // reflet aubergine
  appoint.position.set(-7, -2, 6);
  sc.add(cle, contre, appoint);

  const M = {
    creme: new THREE.MeshStandardMaterial({ color: 0xf8f7f8, metalness: 0.2, roughness: 0.26 }),
    satin: new THREE.MeshStandardMaterial({ color: 0xcec9ce, metalness: 0.7, roughness: 0.32 }),
    noir: new THREE.MeshStandardMaterial({ color: 0x120a12, metalness: 0.15, roughness: 0.75 }),
    noirInt: new THREE.MeshStandardMaterial({ color: 0x0b060c, metalness: 0, roughness: 0.95, side: THREE.BackSide }),
    orange: new THREE.MeshStandardMaterial({ color: 0xf77f00, metalness: 1, roughness: 0.26 }),
    acier: new THREE.MeshStandardMaterial({ color: 0xa79fa8, metalness: 1, roughness: 0.28 }),
    verre: new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0,
      roughness: 0,
      transmission: 1,
      thickness: 0.4,
      ior: 1.5,
      transparent: true,
    }),
    traitement: new THREE.MeshPhysicalMaterial({
      color: 0xb07ab0,
      metalness: 0,
      roughness: 0.08,
      iridescence: 1,
      iridescenceIOR: 1.9,
      iridescenceThicknessRange: [200, 600],
      transparent: true,
      opacity: 0.28,
      side: THREE.DoubleSide,
    }),
  };

  const mesh = (g: THREE.BufferGeometry, m: THREE.Material) => new THREE.Mesh(g, m);
  const cyl = (rt: number, rb: number, h: number, m: THREE.Material, ouvert = false) => {
    const g = new THREE.CylinderGeometry(rt, rb, h, 64, 1, ouvert);
    g.rotateX(Math.PI / 2);
    return mesh(g, m);
  };
  const cylX = (r: number, h: number, m: THREE.Material) => {
    const g = new THREE.CylinderGeometry(r, r, h, 40);
    g.rotateZ(Math.PI / 2);
    return mesh(g, m);
  };
  const anneau = (ro: number, ri: number, h: number, m: THREE.Material) => {
    const pts = [
      [ri, -h / 2],
      [ro, -h / 2],
      [ro, h / 2],
      [ri, h / 2],
      [ri, -h / 2],
    ].map(([x, y]) => new THREE.Vector2(x, y));
    const g = new THREE.LatheGeometry(pts, 64);
    g.rotateX(Math.PI / 2);
    return mesh(g, m);
  };
  const en = <T extends THREE.Object3D>(o: T, x: number, y: number, z: number) => {
    o.position.set(x, y, z);
    return o;
  };

  const lunette = new THREE.Group();
  sc.add(lunette);
  const pieces: Record<string, Piece> = {};
  const piece = (
    nom: string,
    base: [number, number, number],
    dir: [number, number, number],
    dist: number,
    spin: [number, number, number] = [0, 0, 0],
  ) => {
    const g = new THREE.Group();
    g.position.set(...base);
    lunette.add(g);
    return (pieces[nom] = { g, base: new THREE.Vector3(...base), dir: new THREE.Vector3(...dir), dist, spin });
  };

  /* pare-buée */
  let p = piece('pareBuee', [0, 0, 2.55], [0, 0, 1], 3.6, [0, 0, 0.5]);
  const pareBuee = cyl(0.62, 0.62, 0.9, M.creme.clone(), true);
  (pareBuee.material as THREE.MeshStandardMaterial).side = THREE.DoubleSide;
  p.g.add(pareBuee, cyl(0.6, 0.6, 0.9, M.noirInt, true));
  const liseré = mesh(new THREE.TorusGeometry(0.62, 0.02, 20, 72), M.orange);
  liseré.position.z = 0.45;
  p.g.add(liseré);
  /* objectif */
  p = piece('objectif', [0, 0, 1.95], [0, 0, 1], 2.0, [0, 0, 0.9]);
  p.g.add(anneau(0.62, 0.5, 0.2, M.satin));
  const lentille = mesh(new THREE.SphereGeometry(0.52, 64, 40), M.verre);
  lentille.scale.set(1, 1, 0.26);
  const traitement = mesh(new THREE.CircleGeometry(0.5, 64), M.traitement);
  traitement.position.z = 0.14;
  p.g.add(lentille, traitement, en(anneau(0.6, 0.49, 0.04, M.orange), 0, 0, 0.1));
  /* tube */
  p = piece('tube', [0, 0, 0.2], [0, 0, 0], 0);
  p.g.add(cyl(0.55, 0.55, 3.6, M.creme), cyl(0.535, 0.535, 3.6, M.noirInt, true));
  [1.2, -0.9].forEach((z) => p.g.add(en(cyl(0.562, 0.562, 0.1, M.noir), 0, 0, z)));
  p.g.add(en(cyl(0.568, 0.568, 0.04, M.orange), 0, 0, 0.3));
  [1.4, 0.7, 0, -0.7, -1.4].forEach((z) => p.g.add(en(anneau(0.536, 0.38, 0.03, M.noir), 0, 0, z)));
  p.g.add(en(mesh(new THREE.BoxGeometry(0.16, 0.05, 2.4), M.acier), 0, -0.58, 0));
  /* chercheur */
  p = piece('chercheur', [0, 0.95, 0.6], [0, 1, 0], 1.7, [0.08, 0, 0]);
  p.g.add(cyl(0.11, 0.11, 1.1, M.creme), en(cyl(0.14, 0.14, 0.12, M.noir), 0, 0, 0.52));
  p.g.add(en(mesh(new THREE.CircleGeometry(0.1, 32), M.verre), 0, 0, 0.585));
  p.g.add(en(cyl(0.06, 0.06, 0.3, M.noir), 0, 0, -0.66));
  [0.25, -0.25].forEach((z) => {
    p.g.add(en(anneau(0.16, 0.11, 0.07, M.acier), 0, 0, z));
    p.g.add(en(mesh(new THREE.BoxGeometry(0.05, 0.56, 0.06), M.acier), 0, -0.36, z));
  });
  /* porte-oculaire */
  p = piece('molette', [0, 0, -1.75], [0, 0, -1], 1.8, [0, 0, -0.4]);
  p.g.add(cyl(0.3, 0.3, 0.5, M.satin), en(cyl(0.32, 0.32, 0.05, M.orange), 0, 0, 0.2));
  [-1, 1].forEach((s) => {
    p.g.add(en(cylX(0.17, 0.1, M.acier), s * 0.4, -0.04, 0));
    p.g.add(en(cylX(0.1, 0.16, M.orange), s * 0.36, -0.04, 0));
  });
  /* oculaire */
  p = piece('oculaire', [0, 0, -2.4], [0, 0, -1], 3.8, [0, 0, 1.2]);
  p.g.add(cyl(0.14, 0.14, 0.9, M.noir), en(cyl(0.18, 0.18, 0.32, M.noir), 0, 0, -0.12));
  p.g.add(en(cyl(0.185, 0.185, 0.04, M.orange), 0, 0, -0.02));
  const lentilleOc = mesh(new THREE.SphereGeometry(0.12, 32, 24), M.verre);
  lentilleOc.scale.set(1, 1, 0.35);
  lentilleOc.position.z = -0.46;
  p.g.add(lentilleOc);
  /* monture équatoriale : axe polaire incliné à la latitude d'Abidjan */
  p = piece('monture', [0, -1.15, 0], [0, -1, 0], 1.2, [0, 0.15, 0]);
  p.g.add(en(mesh(new THREE.BoxGeometry(0.46, 0.12, 1.5), M.satin), 0, 0.62, 0));
  p.g.add(en(mesh(new THREE.BoxGeometry(0.5, 0.5, 0.9), M.satin), 0, 0.12, 0));
  const polaire = cyl(0.2, 0.2, 1.6, M.acier);
  polaire.position.set(0, -0.38, 0);
  polaire.rotation.x = THREE.MathUtils.degToRad(-5.36);
  p.g.add(polaire, en(cyl(0.215, 0.215, 0.05, M.orange), 0, -0.38, 0.55));
  p.g.add(en(cylX(0.17, 1.0, M.satin), 0, 0.3, 0), en(cylX(0.055, 1.05, M.acier), 0.98, 0.3, 0));
  [0.9, 1.28].forEach((x) => {
    p.g.add(en(cylX(0.3, 0.22, M.noir), x, 0.3, 0));
    p.g.add(en(cylX(0.305, 0.04, M.orange), x + 0.08, 0.3, 0));
  });
  /* trépied */
  p = piece('trepied', [0, -2.15, 0], [0, -1, 0], 2.0, [0, 0.2, 0]);
  p.g.add(mesh(new THREE.CylinderGeometry(0.38, 0.46, 0.22, 48), M.satin));
  [Math.PI, Math.PI + 2.094, Math.PI - 2.094].forEach((az) => {
    const jambe = new THREE.Group();
    const tige = mesh(new THREE.CylinderGeometry(0.075, 0.06, 1.95, 20), M.acier);
    tige.position.y = -0.975;
    const pied = mesh(new THREE.SphereGeometry(0.11, 16, 12), M.noir);
    pied.position.y = -1.97;
    jambe.add(tige, pied);
    jambe.rotation.order = 'YXZ';
    jambe.rotation.y = az + Math.PI;
    jambe.rotation.x = 0.3;
    jambe.position.set(Math.sin(az) * 0.32, -0.05, Math.cos(az) * 0.32);
    p.g.add(jambe);
  });

  /* halo qui suit l'objectif */
  const fc = document.createElement('canvas');
  fc.width = fc.height = 256;
  const fx = fc.getContext('2d')!;
  const gr = fx.createRadialGradient(128, 128, 0, 128, 128, 128);
  gr.addColorStop(0, 'rgba(255,240,220,1)');
  gr.addColorStop(0.22, 'rgba(247,127,0,.55)');
  gr.addColorStop(1, 'rgba(247,127,0,0)');
  fx.fillStyle = gr;
  fx.fillRect(0, 0, 256, 256);
  const halo = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: new THREE.CanvasTexture(fc),
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthWrite: false,
      opacity: 0,
    }),
  );
  sc.add(halo);

  /* étiquettes HTML ancrées sur les pièces */
  const defs: [string, [number, number, number], 'haut' | 'bas' | 'cote'][] = [
    ['pareBuee', [0, 0.62, 0], 'haut'],
    ['objectif', [0, 0.52, 0], 'haut'],
    ['chercheur', [0, 0.14, 0.2], 'haut'],
    ['molette', [0, 0.3, 0], 'haut'],
    ['oculaire', [0, 0.18, 0], 'haut'],
    ['tube', [0, -0.56, 1.6], 'bas'],
    ['monture', [0, -0.55, -0.7], 'bas'],
    ['trepied', [0, -1.2, -0.8], 'cote'],
  ];
  const etiquettes = defs.map(([nom, a, sorte], i) => {
    const el = stage.querySelector<HTMLElement>(`.etiq[data-i="${i}"]`)!;
    el.style.opacity = '0';
    return {
      el,
      ligne: el.querySelector<HTMLElement>('.etiq__ligne')!,
      point: el.querySelector<HTMLElement>('.etiq__point')!,
      piece: pieces[nom],
      ancre: new THREE.Vector3(...a),
      sorte,
      h: el.offsetHeight || 70,
    };
  });

  let w = 1, h = 1;
  const ajuster = () => {
    w = stage.clientWidth;
    h = stage.clientHeight;
    R.setSize(w, h, false);
    cam.aspect = w / h;
    cam.updateProjectionMatrix();
    etiquettes.forEach((t) => (t.h = t.el.offsetHeight || 70));
  };
  ajuster();
  addEventListener('resize', ajuster);

  let visible = true, mx = 0, my = 0;
  new IntersectionObserver((es) => (visible = es[0].isIntersecting)).observe(stage);
  addEventListener('mousemove', (e) => {
    mx = e.clientX / innerWidth - 0.5;
    my = e.clientY / innerHeight - 0.5;
  });

  const v = new THREE.Vector3(), cible = new THREE.Vector3(), wp = new THREE.Vector3();
  const image = (temps: number) => {
    requestAnimationFrame(image);
    if (!visible) return;
    const e = S.e, o = lisse(S.o), d = lisse(S.d), t = S.t, large = w > 980;
    for (const k in pieces) {
      const q = pieces[k];
      q.g.position.copy(q.base).addScaledVector(q.dir, q.dist * e);
      q.g.rotation.set(q.spin[0] * e, q.spin[1] * e, q.spin[2] * e);
    }
    const flotte = reduit ? 0 : Math.sin(temps * 0.0004) * 0.04;
    let a = lerp(0.78 + flotte + mx * 0.12, Math.PI / 2, o);
    a = lerp(a, 0, d);
    const asp = w / h;
    const cadrer = (sw: number, sh: number) => Math.max(sw / (0.4986 * asp), sh / 0.4986);
    const portrait = !large && asp < 1, paysage = !large && asp >= 1.3;
    const Da = large ? (w < 1300 ? 18.5 : 15.5) : cadrer(9.6, 6.8);
    const Dp = large ? 22 : portrait ? cadrer(10, 14.8) : cadrer(14, 10.5);
    const ty0 = lerp(-0.2, portrait ? -1.55 : -0.95, o);
    const hh = lerp(lerp(2.3, 0.5, o) + my * -0.5, 0.05, d);
    const D = lerp(lerp(Da, Dp, o), 9, d);
    if (t > 0) {
      cam.position.set(0, 0.04, lerp(9, -9, t));
      cible.set(0, 0.04, cam.position.z - 6);
    } else {
      cible.set(0, lerp(ty0, 0.04, d), 0);
      cam.position.set(Math.sin(a) * D, cible.y + hh, Math.cos(a) * D);
    }
    const q = portrait ? o * (1 - d) : 0;
    cam.up.set(0, 1 - q, q).normalize();
    cam.lookAt(cible);
    // décale le télescope à droite du texte sur grand écran, sous le texte sur mobile
    const sx = large
      ? lerp((w < 1300 ? 0.34 : 0.27) * w, 0, Math.max(o, d))
      : paysage
        ? lerp(0.24 * w, 0, Math.max(o, d))
        : 0;
    const sy = large || paysage ? 0 : lerp(-(h < 620 ? 0.33 : 0.25) * h, 0, o);
    cam.setViewOffset(w, h, -sx, -sy, w, h);

    pieces.objectif.g.getWorldPosition(wp);
    halo.position.copy(wp).add(new THREE.Vector3(0, 0, 0.35));
    const dz = Math.abs(cam.position.z - wp.z), proche = t > 0 ? clamp(1 - dz / 2.6, 0, 1) : 0;
    halo.scale.setScalar(lerp(1.2, 3.2, proche));
    halo.material.opacity = proche * 0.5 + (1 - o) * 0.22;
    R.render(sc, cam);

    etiquettes.forEach((T, i) => {
      const al = S.l[i];
      if (al < 0.01 || w < 1150) {
        T.el.style.opacity = '0';
        return;
      }
      v.copy(T.ancre);
      T.piece.g.localToWorld(v);
      v.project(cam);
      const x = (v.x * 0.5 + 0.5) * w, y = (-v.y * 0.5 + 0.5) * h, cxp = clamp(x, 100, w - 100);
      const demi = T.el.offsetWidth / 2 || 88, dl = x - cxp + demi;
      T.el.style.opacity = String(al);
      if (T.sorte === 'haut') {
        const haut = Math.max(92, h * 0.13);
        Object.assign(T.el.style, { left: cxp + 'px', top: haut + 'px' });
        Object.assign(T.ligne.style, { left: dl + 'px', top: T.h + 'px', height: Math.max(0, y - haut - T.h) + 'px' });
        Object.assign(T.point.style, { left: dl + 'px', top: y - haut - 4 + 'px' });
      } else if (T.sorte === 'bas') {
        const haut = h * 0.8;
        Object.assign(T.el.style, { left: cxp + 'px', top: haut + 'px' });
        Object.assign(T.ligne.style, { left: dl + 'px', top: 'auto', bottom: '100%', height: Math.max(0, haut - y) + 'px' });
        Object.assign(T.point.style, { left: dl + 'px', top: y - haut - 4 + 'px' });
      } else {
        Object.assign(T.el.style, { left: x + 120 + 'px', top: y - T.h / 2 + 'px' });
        T.ligne.style.display = 'none';
        Object.assign(T.point.style, { top: T.h / 2 - 4 + 'px', left: demi - 120 + 'px' });
      }
    });
  };
  requestAnimationFrame(image);
}
