/**
 * Fallback 2D de la navigation système solaire.
 * SVG pur, rendu côté serveur, animé en CSS : fonctionne sans WebGL et sans JS.
 */
import type { Lang } from '../../i18n/ui';
import { SUN, PLANETS, MOON, BELT } from './config';

const F = 12.5; // unités scène → pixels

function deg(rad: number): number {
  return (rad * 180) / Math.PI;
}

interface Props {
  lang: Lang;
  ariaLabel: string;
}

export default function SolarFallback({ lang, ariaLabel }: Props) {
  return (
    <svg
      className="fb-solaire"
      viewBox="-295 -295 590 590"
      role="navigation"
      aria-label={ariaLabel}
    >
      {/* Orbites */}
      {PLANETS.map((p) => (
        <circle key={`o-${p.id}`} className="fb-orbite" r={p.orbit * F} />
      ))}

      {/* Ceinture d'astéroïdes → ancre recherche */}
      <a href={BELT.route[lang]} className="fb-corps" aria-label={BELT.label[lang]}>
        <circle className="fb-ceinture" r={((BELT.inner + BELT.outer) / 2) * F} />
        {[0.4, 1.5, 2.7, 3.8, 4.9, 5.8].map((a, i) => (
          <circle
            key={i}
            cx={Math.cos(a) * ((BELT.inner + BELT.outer) / 2) * F}
            cy={Math.sin(a) * ((BELT.inner + BELT.outer) / 2) * F}
            r={3.2}
            fill="#F77F00"
          />
        ))}
        <text className="fb-etiquette" x={0} y={-((BELT.inner + BELT.outer) / 2) * F - 14} textAnchor="middle">
          <tspan className="fb-fleche">→ </tspan>
          {BELT.label[lang]}
        </text>
      </a>

      {/* Soleil */}
      <a href={SUN.route[lang]} className="fb-corps" aria-label={SUN.label[lang]}>
        <circle className="fb-astre" r={SUN.size * 6.9} fill={SUN.color} />
        <circle r={SUN.size * 6.9 + 7} fill="none" stroke={SUN.color} strokeOpacity={0.25} strokeWidth={9} />
        <text className="fb-etiquette" y={-SUN.size * 6.9 - 12} textAnchor="middle">
          <tspan className="fb-fleche">→ </tspan>
          {SUN.label[lang]}
        </text>
      </a>

      {/* Planètes */}
      {PLANETS.map((p) => {
        const r = Math.max(4.2, p.size * 6.9);
        return (
          <g key={p.id} transform={`rotate(${deg(p.phase)})`}>
            <g className="fb-rot" style={{ animationDuration: `${p.period}s` }}>
              <g transform={`translate(${p.orbit * F} 0)`}>
                <g className="fb-rot-inverse" style={{ animationDuration: `${p.period}s` }}>
                  <g transform={`rotate(${-deg(p.phase)})`}>
                    <a href={p.route[lang]} className="fb-corps" aria-label={p.label[lang]}>
                      <circle className="fb-astre" r={r} fill={p.color} />
                      {p.ring && (
                        <ellipse
                          rx={r * 2.1}
                          ry={r * 0.62}
                          fill="none"
                          stroke="#CEC9CE"
                          strokeOpacity={0.6}
                          strokeWidth={2.4}
                          transform="rotate(-18)"
                        />
                      )}
                      <text className="fb-etiquette" y={-r - 11} textAnchor="middle">
                        <tspan className="fb-fleche">→ </tspan>
                        {p.label[lang]}
                      </text>
                    </a>
                    {/* La Lune orbite la Terre */}
                    {p.id === 'terre' && (
                      <g className="fb-rot" style={{ animationDuration: `${MOON.period}s` }}>
                        <g transform={`translate(${MOON.orbit * F + 6} 0)`}>
                          <g
                            className="fb-rot-inverse"
                            style={{ animationDuration: `${MOON.period}s` }}
                          >
                            <a href={MOON.route[lang]} className="fb-corps" aria-label={MOON.label[lang]}>
                              <circle className="fb-astre" r={4.4} fill={MOON.color} />
                              <text className="fb-etiquette" y={-14} textAnchor="middle">
                                <tspan className="fb-fleche">→ </tspan>
                                {MOON.label[lang]}
                              </text>
                            </a>
                          </g>
                        </g>
                      </g>
                    )}
                  </g>
                </g>
              </g>
            </g>
          </g>
        );
      })}
    </svg>
  );
}
