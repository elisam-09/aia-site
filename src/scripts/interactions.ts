/** Petites interactions partagées entre les pages (sans dépendance). */

/** Bandes horizontales [data-glisser] : défilement à la souris par glisser-déposer. */
export function activerGlisser(): void {
  document.querySelectorAll<HTMLElement>('[data-glisser]').forEach((el) => {
    let bas = false, sx = 0, sl = 0, bouge = false;
    el.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'touch') return;
      bas = true;
      bouge = false;
      sx = e.clientX;
      sl = el.scrollLeft;
    });
    addEventListener('pointermove', (e) => {
      if (!bas) return;
      const dx = e.clientX - sx;
      if (Math.abs(dx) > 4) {
        bouge = true;
        el.classList.add('glisse');
      }
      el.scrollLeft = sl - dx;
    });
    addEventListener('pointerup', () => {
      bas = false;
      setTimeout(() => el.classList.remove('glisse'), 0);
    });
    // un glisser ne doit pas déclencher le clic d'un lien de la bande
    el.addEventListener(
      'click',
      (e) => {
        if (bouge) {
          e.preventDefault();
          e.stopPropagation();
          bouge = false;
        }
      },
      true,
    );
  });
}

/** Ajoute la classe « vu » aux éléments du sélecteur quand ils entrent dans l'écran. */
export function activerRevele(selecteur = '.revele', seuil = 0.12): void {
  const els = document.querySelectorAll(selecteur);
  if (!('IntersectionObserver' in window)) {
    els.forEach((e) => e.classList.add('vu'));
    return;
  }
  const obs = new IntersectionObserver(
    (es) =>
      es.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('vu');
          obs.unobserve(e.target);
        }
      }),
    { threshold: seuil },
  );
  els.forEach((e) => obs.observe(e));
}
