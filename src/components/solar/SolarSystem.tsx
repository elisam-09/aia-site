/**
 * Île de navigation « système solaire ».
 * Rendu serveur : fallback 2D immédiat. Côté client, si les conditions le permettent
 * (WebGL dispo, pas d'économie de données, pas de reduced-motion), la scène 3D est
 * chargée en différé puis substituée en douceur. Garde-fou : 8 s sans contexte WebGL
 * prêt → retour au 2D. Bouton de bascule manuelle dans tous les cas.
 */
import {
  Component,
  Suspense,
  lazy,
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type ReactNode,
} from 'react';
import type { Lang } from '../../i18n/ui';
import SolarFallback from './SolarFallback';
import './solar.css';

const SceneLazy = lazy(() => import('./SolarScene'));

interface Labels {
  aria: string;
  to3d: string;
  to2d: string;
}

interface Props {
  lang: Lang;
  labels: Labels;
}

class GardeErreur extends Component<{ onError: () => void; children: ReactNode }, { ko: boolean }> {
  state = { ko: false };
  static getDerivedStateFromError() {
    return { ko: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.ko ? null : this.props.children;
  }
}

function webglDisponible(): boolean {
  try {
    const c = document.createElement('canvas');
    return Boolean(c.getContext('webgl2') ?? c.getContext('webgl'));
  } catch {
    return false;
  }
}

export default function SolarSystem({ lang, labels }: Props) {
  const [mode, setMode] = useState<'2d' | '3d'>('2d');
  const [capable, setCapable] = useState(false);
  const [pret, setPret] = useState(false);
  const [visible, setVisible] = useState(true);
  const boxRef = useRef<HTMLDivElement>(null);

  // Détection des capacités + chargement auto en tâche de fond
  useEffect(() => {
    const ok = webglDisponible();
    setCapable(ok);
    if (!ok) return;

    const reduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const eco = (navigator as { connection?: { saveData?: boolean } }).connection?.saveData;
    if (reduit || eco) return; // le bouton reste disponible pour forcer la 3D

    const idle =
      (window as { requestIdleCallback?: (cb: () => void) => number }).requestIdleCallback ??
      ((cb: () => void) => window.setTimeout(cb, 700));
    idle(() => setMode('3d'));
  }, []);

  // Garde-fou : si la 3D ne signale pas son contexte prêt sous 8 s, on revient au 2D
  useEffect(() => {
    if (mode !== '3d' || pret) return;
    const id = window.setTimeout(() => setMode('2d'), 8000);
    return () => window.clearTimeout(id);
  }, [mode, pret]);

  // Pause de l'animation quand la section sort de l'écran
  useEffect(() => {
    const el = boxRef.current;
    if (!el || !('IntersectionObserver' in window)) return;
    const obs = new IntersectionObserver(([e]) => setVisible(e?.isIntersecting ?? true), {
      threshold: 0.05,
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div className="solar-wrap" ref={boxRef} aria-label={labels.aria}>
      {mode === '3d' ? (
        <GardeErreur onError={() => setMode('2d')}>
          <Suspense fallback={<SolarFallback lang={lang} ariaLabel={labels.aria} />}>
            <SceneLazy lang={lang} paused={!visible} onReady={() => setPret(true)} />
          </Suspense>
        </GardeErreur>
      ) : (
        <SolarFallback lang={lang} ariaLabel={labels.aria} />
      )}

      {capable && (
        <button
          type="button"
          className="solar-toggle"
          onClick={() => setMode(mode === '3d' ? '2d' : '3d')}
        >
          {mode === '3d' ? labels.to2d : labels.to3d}
        </button>
      )}
    </div>
  );
}
