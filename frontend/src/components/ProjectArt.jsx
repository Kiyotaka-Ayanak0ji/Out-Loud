const Grid = () => <g className="text-line" stroke="currentColor" strokeOpacity="0.08">{[40, 80, 120, 160].map((y) => <line key={y} x1="0" y1={y} x2="320" y2={y} />)}</g>;

const ART = {
  finance: <>
    <Grid />
    {[[40, 110, 50], [90, 80, 80], [140, 95, 65], [190, 55, 105], [240, 70, 90]].map(([x, y, h]) => <rect key={x} x={x} y={y} width="28" height={h} rx="6" fill="#818CF8" fillOpacity="0.55" />)}
    <path d="M30 140 L290 140" stroke="#818CF8" strokeOpacity="0.4" strokeWidth="2" />
    <rect x="200" y="22" width="92" height="28" rx="14" fill="none" stroke="#2DD4BF" strokeOpacity="0.7" strokeWidth="2" />
    <text x="246" y="41" textAnchor="middle" fontSize="12" fontFamily="Space Grotesk, sans-serif" fill="#2DD4BF">GET /api</text>
  </>,
  image: <>
    <Grid />
    <rect x="70" y="30" width="180" height="120" rx="14" fill="none" stroke="#F97316" strokeOpacity="0.7" strokeWidth="2" />
    <path d="M80 135 L135 85 L170 115 L200 92 L240 135 Z" fill="#F97316" fillOpacity="0.25" />
    <circle cx="210" cy="62" r="12" fill="#F97316" fillOpacity="0.5" />
    {Array.from({ length: 8 }, (_, i) => <rect key={i} x={92 + i * 18} y="44" width="10" height="10" rx="2" fill="#818CF8" fillOpacity={i % 3 ? 0.25 : 0.7} />)}
  </>,
  chart: <>
    <Grid />
    <path d="M20 140 L70 120 L110 128 L150 90 L190 100 L230 62" fill="none" stroke="#818CF8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M230 62 L270 48 L300 30" fill="none" stroke="#2DD4BF" strokeWidth="3" strokeDasharray="6 6" strokeLinecap="round" />
    <circle cx="230" cy="62" r="5" fill="#2DD4BF" />
  </>,
};

export const ProjectArt = ({ kind }) => (
  <svg viewBox="0 0 320 180" className="h-full w-full" role="img" aria-label="Project illustration" preserveAspectRatio="xMidYMid slice">{ART[kind]}</svg>
);
