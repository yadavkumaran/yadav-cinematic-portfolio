import { useId, type JSX } from 'react';
import type { ArtworkKey, Project } from '../../data/portfolio';

const DISPLAY = "'Space Grotesk Variable', 'Space Grotesk', sans-serif";
const SANS = "'Inter Variable', 'Inter', sans-serif";
const SERIF = "'Instrument Serif', Georgia, serif";

function Vaidhya({ uid }: { uid: string }) {
  return (
    <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id={`${uid}-glow`} cx="52%" cy="42%" r="55%">
          <stop offset="0%" stopColor="#8fe3c8" stopOpacity="0.2" />
          <stop offset="55%" stopColor="#2a7a68" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#071412" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${uid}-pulse`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#8fe3c8" stopOpacity="0" />
          <stop offset="30%" stopColor="#8fe3c8" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#8fe3c8" stopOpacity="0.1" />
        </linearGradient>
      </defs>

      <rect width="800" height="600" fill="#07110f" />
      <rect width="800" height="600" fill={`url(#${uid}-glow)`} />
      {Array.from({ length: 18 }, (_, i) => (
        <line key={`v-${i}`} x1={i * 46} y1="0" x2={i * 46} y2="600" stroke="#8fe3c8" strokeWidth="0.6" opacity="0.055" />
      ))}
      {Array.from({ length: 13 }, (_, i) => (
        <line key={`h-${i}`} x1="0" y1={i * 46} x2="800" y2={i * 46} stroke="#8fe3c8" strokeWidth="0.6" opacity="0.055" />
      ))}

      <text x="30" y="38" fill="#d7f7ec" fontFamily={DISPLAY} fontSize="14" fontWeight="500" letterSpacing="3.4">
        VAIDHYA
      </text>
      <text x="770" y="36" textAnchor="end" fill="#6fa99a" fontFamily={SANS} fontSize="8.5" letterSpacing="2.1">
        CARE CONSOLE / 01
      </text>
      <circle cx="742" cy="52" r="2.2" fill="#8fe3c8" />
      <line x1="0" y1="64" x2="800" y2="64" stroke="#8fe3c8" strokeOpacity="0.14" />

      {/* Conversation panel */}
      <rect x="30" y="86" width="214" height="294" fill="#0a1c19" stroke="#8fe3c8" strokeOpacity="0.18" />
      <text x="46" y="108" fill="#7fb9a9" fontFamily={SANS} fontSize="7" letterSpacing="1.8">
        CONSULTATION / LIVE
      </text>
      <rect x="46" y="122" width="144" height="34" fill="#123a33" />
      <rect x="54" y="132" width="104" height="3" fill="#8fe3c8" opacity="0.55" />
      <rect x="54" y="141" width="72" height="3" fill="#8fe3c8" opacity="0.3" />
      <rect x="72" y="168" width="156" height="46" fill="#0e2723" stroke="#8fe3c8" strokeOpacity="0.2" />
      <rect x="84" y="180" width="116" height="3" fill="#bfeade" opacity="0.6" />
      <rect x="84" y="190" width="90" height="3" fill="#bfeade" opacity="0.35" />
      <rect x="84" y="200" width="123" height="3" fill="#bfeade" opacity="0.22" />
      <rect x="46" y="228" width="132" height="34" fill="#123a33" />
      <rect x="54" y="238" width="88" height="3" fill="#8fe3c8" opacity="0.5" />
      <circle cx="205" cy="344" r="20" fill="#0f2b26" stroke="#8fe3c8" strokeOpacity="0.4" />
      <circle cx="205" cy="344" r="7" fill="#8fe3c8" opacity="0.8" />
      <text x="46" y="364" fill="#5d8d81" fontFamily={SANS} fontSize="7" letterSpacing="1.4">
        AI ASSISTANT ACTIVE
      </text>

      {/* Clinical focal point */}
      <circle cx="420" cy="245" r="122" fill="none" stroke="#8fe3c8" strokeOpacity="0.14" />
      <circle cx="420" cy="245" r="92" fill="none" stroke="#8fe3c8" strokeOpacity="0.24" strokeDasharray="3 7" />
      <circle cx="420" cy="245" r="62" fill="#0d2b25" stroke="#8fe3c8" strokeOpacity="0.45" />
      <rect x="410" y="211" width="20" height="68" rx="2" fill="#8fe3c8" />
      <rect x="386" y="235" width="68" height="20" rx="2" fill="#8fe3c8" />
      <circle cx="420" cy="245" r="7" fill="#eafff8" />
      <text x="420" y="345" textAnchor="middle" fill="#9ed7c7" fontFamily={SANS} fontSize="7.5" letterSpacing="2">
        PATIENT · DOCTOR · PHARMACY
      </text>

      <path
        d="M30 430 L118 430 L136 404 L158 456 L180 430 L256 430 L274 410 L292 444 L314 430 L366 430 L386 386 L412 468 L438 430 L800 430"
        fill="none"
        stroke={`url(#${uid}-pulse)`}
        strokeWidth="1.6"
      />
      <line x1="0" y1="430" x2="800" y2="430" stroke="#8fe3c8" strokeOpacity="0.1" />

      {/* Vitals panel */}
      <rect x="592" y="86" width="178" height="294" fill="#0a1c19" stroke="#8fe3c8" strokeOpacity="0.18" />
      <text x="608" y="108" fill="#7fb9a9" fontFamily={SANS} fontSize="7" letterSpacing="1.8">
        VITALS / STABLE
      </text>
      {[
        ['72', 'BPM'],
        ['98', '% SpO2'],
        ['36.6', '°C'],
        ['118/76', 'BP'],
      ].map(([value, label], index) => (
        <g key={label}>
          <text x="608" y={152 + index * 56} fill="#e8fff8" fontFamily={DISPLAY} fontSize="24" fontWeight="500">
            {value}
          </text>
          <text x="608" y={168 + index * 56} fill="#5d8d81" fontFamily={SANS} fontSize="7" letterSpacing="1.4">
            {label}
          </text>
          <line x1="608" y1={180 + index * 56} x2="752" y2={180 + index * 56} stroke="#8fe3c8" strokeOpacity="0.12" />
        </g>
      ))}

      <text x="30" y="480" fill="#a5d9cb" fontFamily={SANS} fontSize="8" letterSpacing="2.2">
        TELEMEDICINE · PROTOTYPE
      </text>
      <text x="770" y="480" textAnchor="end" fill="#4f7a6f" fontFamily={SANS} fontSize="7" letterSpacing="1.6">
        MVP / NOT FOR CLINICAL USE
      </text>

      <g opacity="0.7">
        <rect x="30" y="516" width="740" height="54" fill="#0a1b18" stroke="#8fe3c8" strokeOpacity="0.13" />
        <circle cx="56" cy="543" r="10" fill="#123a33" stroke="#8fe3c8" strokeOpacity="0.35" />
        <text x="78" y="540" fill="#c9eee3" fontFamily={SANS} fontSize="8" letterSpacing="1.1">
          PRESCRIPTION READY FOR PHARMACY
        </text>
        <text x="78" y="554" fill="#548378" fontFamily={SANS} fontSize="7" letterSpacing="0.8">
          Handoff prepared · review before dispatch
        </text>
        <rect x="638" y="530" width="112" height="26" fill="#8fe3c8" opacity="0.9" />
        <text x="694" y="547" textAnchor="middle" fill="#071412" fontFamily={SANS} fontSize="7.5" fontWeight="600" letterSpacing="1.4">
          REVIEW
        </text>
      </g>
    </svg>
  );
}

function HeatGuard({ uid }: { uid: string }) {
  const cells = [
    0.18, 0.28, 0.46, 0.62, 0.34, 0.24, 0.52, 0.74, 0.88, 0.55, 0.32, 0.4, 0.66, 0.82, 0.7, 0.3, 0.45, 0.6, 0.9, 0.78,
    0.28, 0.3, 0.42, 0.5, 0.36,
  ];
  return (
    <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id={`${uid}-heat`} cx="45%" cy="45%" r="65%">
          <stop offset="0%" stopColor="#ff8a3d" stopOpacity="0.25" />
          <stop offset="60%" stopColor="#8c1e0c" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#170905" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${uid}-legend`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#2a1009" />
          <stop offset="35%" stopColor="#a83214" />
          <stop offset="68%" stopColor="#ff612f" />
          <stop offset="100%" stopColor="#ffd08a" />
        </linearGradient>
        <linearGradient id={`${uid}-line`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ffb06a" stopOpacity="0.2" />
          <stop offset="48%" stopColor="#ffe1b8" />
          <stop offset="100%" stopColor="#ff7a3d" stopOpacity="0.5" />
        </linearGradient>
      </defs>

      <rect width="800" height="600" fill="#160a06" />
      <rect width="800" height="600" fill={`url(#${uid}-heat)`} />

      <text x="30" y="38" fill="#f7e6d6" fontFamily={DISPLAY} fontSize="14" fontWeight="500" letterSpacing="3.2">
        HEATGUARD AI
      </text>
      <text x="770" y="36" textAnchor="end" fill="#bd816a" fontFamily={SANS} fontSize="8.5" letterSpacing="2">
        URBAN CLIMATE / MITIGATION
      </text>
      <line x1="0" y1="62" x2="800" y2="62" stroke="#ff9a66" strokeOpacity="0.17" />

      {/* Heat cells */}
      <g>
        {cells.map((value, index) => {
          const col = index % 5;
          const row = Math.floor(index / 5);
          return (
            <rect
              key={index}
              x={30 + col * 108}
              y={92 + row * 62}
              width="104"
              height="58"
              fill={value > 0.7 ? '#ff7a3f' : value > 0.45 ? '#c1461d' : '#5c1d0d'}
              opacity={0.2 + value * 0.72}
            />
          );
        })}
        {Array.from({ length: 6 }, (_, i) => (
          <line key={i} x1="30" y1={92 + i * 62} x2="562" y2={92 + i * 62} stroke="#260f08" strokeWidth="1.2" />
        ))}
        {Array.from({ length: 6 }, (_, i) => (
          <line key={`c-${i}`} x1={30 + i * 108} y1="92" x2={30 + i * 108} y2="402" stroke="#260f08" strokeWidth="1.2" />
        ))}
      </g>

      {/* Hotspot markers */}
      <circle cx="470" cy="238" r="28" fill="none" stroke="#ffe0bd" strokeOpacity="0.75" strokeDasharray="2 4" />
      <circle cx="470" cy="238" r="4" fill="#ffe9d2" />
      <line x1="470" y1="210" x2="470" y2="180" stroke="#ffe0bd" strokeOpacity="0.55" />
      <text x="470" y="172" textAnchor="middle" fill="#ffd8b3" fontFamily={SANS} fontSize="7.5" letterSpacing="1.2">
        PRIORITY BLOCK
      </text>

      {/* Forecast curve overlay */}
      <path
        d="M40 360 C120 352 148 300 214 308 C286 318 320 260 390 268 C444 274 468 238 520 246 C548 250 556 214 570 200"
        fill="none"
        stroke={`url(#${uid}-line)`}
        strokeWidth="2"
      />
      {[214, 330, 452].map((x) => (
        <circle key={x} cx={x} cy={x === 214 ? 308 : x === 330 ? 292 : 254} r="3" fill="#ffe6cb" />
      ))}

      {/* Right readout */}
      <line x1="582" y1="92" x2="582" y2="524" stroke="#ff9a66" strokeOpacity="0.14" />
      <text x="608" y="110" fill="#bb7a5e" fontFamily={SANS} fontSize="7.5" letterSpacing="2">
        PEAK LST / TODAY
      </text>
      <text x="606" y="176" fill="#fff0e2" fontFamily={DISPLAY} fontSize="64" fontWeight="500" letterSpacing="-3">
        41.2
      </text>
      <text x="714" y="152" fill="#ffb183" fontFamily={DISPLAY} fontSize="22">
        °C
      </text>
      <text x="608" y="200" fill="#d88e6e" fontFamily={SANS} fontSize="8.5" letterSpacing="0.6">
        +3.8°C above district median
      </text>

      <text x="608" y="246" fill="#bb7a5e" fontFamily={SANS} fontSize="7.5" letterSpacing="2">
        MODEL INPUTS
      </text>
      {['Land surface temperature', 'Vegetation index', 'Built density', 'Albedo / roof cover'].map((label, index) => (
        <g key={label}>
          <text x="608" y={266 + index * 20} fill="#d8b4a2" fontFamily={SANS} fontSize="8">
            {label}
          </text>
          <circle cx="760" cy={263 + index * 20} r="2" fill="#ff8347" opacity="0.8" />
        </g>
      ))}

      <text x="608" y="378" fill="#bb7a5e" fontFamily={SANS} fontSize="7.5" letterSpacing="2">
        SURFACE HEAT
      </text>
      <rect x="608" y="392" width="150" height="8" fill={`url(#${uid}-legend)`} />
      <text x="608" y="416" fill="#7f5343" fontFamily={SANS} fontSize="6.5">
        COOL
      </text>
      <text x="758" y="416" textAnchor="end" fill="#7f5343" fontFamily={SANS} fontSize="6.5">
        EXTREME
      </text>

      <rect x="608" y="450" width="150" height="46" fill="#2a1008" stroke="#ff7a3f" strokeOpacity="0.28" />
      <text x="620" y="468" fill="#ffb48d" fontFamily={SANS} fontSize="7" letterSpacing="1.5">
        TOP INTERVENTION
      </text>
      <text x="620" y="484" fill="#f3d8c7" fontFamily={SANS} fontSize="8">
        Reflective roofs · 6 blocks
      </text>

      {/* Lower strip */}
      <rect x="0" y="524" width="800" height="76" fill="#110704" />
      <line x1="0" y1="524" x2="800" y2="524" stroke="#ff9a66" strokeOpacity="0.16" />
      <text x="30" y="552" fill="#d6a288" fontFamily={SANS} fontSize="7.5" letterSpacing="2">
        EXPLAINABILITY
      </text>
      <text x="30" y="574" fill="#f2d9c7" fontFamily={SANS} fontSize="10">
        Every prediction carries its feature contributions.
      </text>
      <g transform="translate(610,542)">
        <rect width="160" height="32" fill="none" stroke="#ff7a3f" strokeOpacity="0.35" />
        <text x="80" y="21" textAnchor="middle" fill="#ffc39f" fontFamily={SANS} fontSize="8" letterSpacing="1.4">
          RESEARCH PROTOTYPE
        </text>
      </g>
    </svg>
  );
}

function BidLens({ uid }: { uid: string }) {
  return (
    <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id={`${uid}-glow`} cx="30%" cy="45%" r="60%">
          <stop offset="0%" stopColor="#a9c7ff" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#0a0f16" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${uid}-scan`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#a9c7ff" stopOpacity="0" />
          <stop offset="50%" stopColor="#cfe0ff" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#a9c7ff" stopOpacity="0" />
        </linearGradient>
      </defs>

      <rect width="800" height="600" fill="#090e15" />
      <rect width="800" height="600" fill={`url(#${uid}-glow)`} />
      {Array.from({ length: 14 }, (_, i) => (
        <line key={i} x1="0" y1={i * 46} x2="800" y2={i * 46} stroke="#a9c7ff" strokeOpacity="0.045" />
      ))}

      <text x="30" y="38" fill="#e3ebfa" fontFamily={DISPLAY} fontSize="14" fontWeight="500" letterSpacing="3.2">
        BIDLENS
      </text>
      <text x="770" y="36" textAnchor="end" fill="#7388a6" fontFamily={SANS} fontSize="8.5" letterSpacing="2">
        DOCUMENT VERIFICATION
      </text>
      <line x1="0" y1="62" x2="800" y2="62" stroke="#a9c7ff" strokeOpacity="0.14" />

      {/* Document stack */}
      <g transform="rotate(-4 280 310)">
        <rect x="112" y="112" width="306" height="414" fill="#121a24" opacity="0.8" transform="translate(14 10)" />
        <rect x="112" y="112" width="306" height="414" fill="#e7e5dd" />
        <rect x="112" y="112" width="306" height="52" fill="#dad7cd" />
        <text x="134" y="135" fill="#50565a" fontFamily={SANS} fontSize="7" letterSpacing="1.6">
          TENDER DOCUMENT / 24 PAGES
        </text>
        <text x="134" y="151" fill="#9a9c98" fontFamily={SANS} fontSize="6.4" letterSpacing="1">
          PROCUREMENT · RESTRICTED
        </text>
        <rect x="134" y="188" width="184" height="7" fill="#303a40" />
        <rect x="134" y="204" width="238" height="3" fill="#b7b8b2" />
        <rect x="134" y="214" width="212" height="3" fill="#c3c4be" />
        <rect x="134" y="224" width="230" height="3" fill="#c3c4be" />

        <rect x="134" y="248" width="132" height="40" fill="none" stroke="#2a8fa0" strokeWidth="1.5" />
        <rect x="142" y="258" width="72" height="3" fill="#5b6468" />
        <rect x="142" y="268" width="104" height="3" fill="#8a8e8c" />
        <rect x="300" y="242" width="86" height="52" fill="none" stroke="#c25027" strokeWidth="1.5" strokeDasharray="3 3" />
        <text x="138" y="236" fill="#2a8fa0" fontFamily={SANS} fontSize="5.5" letterSpacing="1">
          BUSINESS IDENTIFIER
        </text>
        <text x="304" y="236" fill="#c25027" fontFamily={SANS} fontSize="5.5" letterSpacing="1">
          REVIEW
        </text>

        <rect x="134" y="314" width="268" height="3" fill="#c9cac4" />
        <rect x="134" y="324" width="244" height="3" fill="#c9cac4" />
        <rect x="134" y="334" width="264" height="3" fill="#c9cac4" />
        <rect x="134" y="344" width="158" height="3" fill="#c9cac4" />
        <rect x="134" y="372" width="110" height="26" fill="#d3d0c6" />
        <rect x="134" y="410" width="220" height="3" fill="#c9cac4" />
        <rect x="134" y="420" width="228" height="3" fill="#c9cac4" />
        <rect x="134" y="430" width="188" height="3" fill="#c9cac4" />
        <rect x="134" y="452" width="80" height="24" fill="none" stroke="#2a8fa0" opacity="0.6" />
        <text x="142" y="468" fill="#2a8fa0" fontFamily={SANS} fontSize="6" letterSpacing="1">
          OCR PASS
        </text>
        <text x="366" y="500" textAnchor="end" fill="#9b9c98" fontFamily={SANS} fontSize="6">
          08 / 24
        </text>
      </g>

      <rect x="94" y="300" width="360" height="2" fill={`url(#${uid}-scan)`} opacity="0.9" />

      {/* Extraction panel */}
      <g>
        <text x="486" y="110" fill="#7f94b3" fontFamily={SANS} fontSize="7.5" letterSpacing="2">
          EXTRACTED FIELDS
        </text>
        <line x1="486" y1="122" x2="770" y2="122" stroke="#a9c7ff" strokeOpacity="0.18" />
        {[
          ['LEGAL NAME', 'Meridian Infra Pvt. Ltd.', true],
          ['GSTIN', '27AABCM4192P1Z6', true],
          ['PAN', 'AABCM4192P', true],
          ['TENDER NO.', 'BID/2026/0418', true],
          ['BID VALUE', '₹ 4,82,00,000', false],
          ['VALIDITY', 'Mismatch in dates', false],
        ].map(([label, value, ok], index) => (
          <g key={label as string}>
            <text x="486" y={156 + index * 54} fill="#6e819d" fontFamily={SANS} fontSize="6.8" letterSpacing="1.5">
              {label}
            </text>
            <text x="486" y={174 + index * 54} fill={ok ? '#dfe9fb' : '#ffb18f'} fontFamily={SANS} fontSize="10">
              {value}
            </text>
            <circle cx="758" cy={168 + index * 54} r="7" fill="none" stroke={ok ? '#7fc6c1' : '#e07c47'} strokeOpacity="0.6" />
            {ok ? (
              <path d={`M754 ${168 + index * 54} l3 3 l6 -7`} fill="none" stroke="#7fc6c1" strokeWidth="1.3" />
            ) : (
              <path d={`M758 ${164 + index * 54} v6`} stroke="#e07c47" strokeWidth="1.4" />
            )}
            <line x1="486" y1={188 + index * 54} x2="770" y2={188 + index * 54} stroke="#a9c7ff" strokeOpacity="0.1" />
          </g>
        ))}
      </g>

      <rect x="486" y="474" width="284" height="58" fill="#101a25" stroke="#a9c7ff" strokeOpacity="0.22" />
      <text x="500" y="494" fill="#8499b6" fontFamily={SANS} fontSize="6.8" letterSpacing="1.5">
        VERIFICATION STATUS
      </text>
      <text x="500" y="516" fill="#f0d9c8" fontFamily={SANS} fontSize="11">
        5 verified · 1 needs review
      </text>
      <rect x="700" y="492" width="54" height="24" fill="none" stroke="#e07c47" strokeOpacity="0.7" />
      <text x="727" y="507" textAnchor="middle" fill="#e8a578" fontFamily={SANS} fontSize="6.5" letterSpacing="1">
        REVIEW
      </text>

      <text x="30" y="566" fill="#7488a4" fontFamily={SANS} fontSize="7.5" letterSpacing="2">
        PARSE · EXTRACT · VERIFY
      </text>
      <text x="770" y="566" textAnchor="end" fill="#4c5d74" fontFamily={SANS} fontSize="7">
        WORK IN PROGRESS
      </text>
    </svg>
  );
}

function Kgb({ uid }: { uid: string }) {
  const candles = [
    [70, 380, 132, 34, false],
    [116, 350, 102, 30, true],
    [162, 362, 118, 28, true],
    [208, 318, 88, 22, false],
    [254, 330, 96, 26, true],
    [300, 286, 74, 20, true],
    [346, 302, 84, 24, false],
    [392, 258, 62, 18, true],
    [438, 268, 70, 22, true],
    [484, 216, 52, 16, false],
    [530, 226, 58, 18, true],
    [576, 178, 40, 14, true],
  ] as const;
  return (
    <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id={`${uid}-gold`} cx="30%" cy="40%" r="65%">
          <stop offset="0%" stopColor="#e5c170" stopOpacity="0.18" />
          <stop offset="60%" stopColor="#8a6421" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#0b0905" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${uid}-area`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e5c170" stopOpacity="0.26" />
          <stop offset="100%" stopColor="#e5c170" stopOpacity="0" />
        </linearGradient>
      </defs>

      <rect width="800" height="600" fill="#0b0905" />
      <rect width="800" height="600" fill={`url(#${uid}-gold)`} />

      <text x="30" y="36" fill="#f1e3c4" fontFamily={DISPLAY} fontSize="13" fontWeight="500" letterSpacing="3">
        KGB
      </text>
      <text x="78" y="36" fill="#7f6a45" fontFamily={SANS} fontSize="7.5" letterSpacing="1.5">
        KANISHKA GOLD BULLION
      </text>
      <text x="770" y="34" textAnchor="end" fill="#a48857" fontFamily={SANS} fontSize="7.5" letterSpacing="1.8">
        GOLD · FX · INTELLIGENCE
      </text>
      <line x1="0" y1="56" x2="800" y2="56" stroke="#e5c170" strokeOpacity="0.16" />

      {/* Chart grid */}
      {Array.from({ length: 7 }, (_, i) => (
        <g key={i}>
          <line x1="34" y1={110 + i * 56} x2="590" y2={110 + i * 56} stroke="#e5c170" strokeOpacity="0.07" />
          <text x="30" y={114 + i * 56} textAnchor="end" fill="#5f5138" fontFamily={SANS} fontSize="6">
            {['76', '74', '72', '70', '68', '66', '64'][i]}k
          </text>
        </g>
      ))}
      <path
        d="M40 452 C130 430 170 420 240 392 C320 360 360 346 430 312 C500 278 530 242 590 202 L590 506 L40 506 Z"
        fill={`url(#${uid}-area)`}
      />
      <path
        d="M40 452 C130 430 170 420 240 392 C320 360 360 346 430 312 C500 278 530 242 590 202"
        fill="none"
        stroke="#e5c170"
        strokeWidth="1.6"
      />
      <path
        d="M590 202 C622 184 642 172 664 164 C696 152 730 142 762 132"
        fill="none"
        stroke="#ff9a5c"
        strokeWidth="1.4"
        strokeDasharray="4 5"
      />

      {/* Candles */}
      {candles.map(([x, y, height, width, up], index) => (
        <g key={index}>
          <line
            x1={x}
            y1={y - 10}
            x2={x}
            y2={y + height + 10}
            stroke={up ? '#e5c170' : '#c65a34'}
            strokeWidth="1"
            opacity="0.6"
          />
          <rect
            x={x - width / 2}
            y={y}
            width={width}
            height={height}
            fill={up ? '#d9b261' : '#8f3a22'}
            opacity={0.88}
          />
        </g>
      ))}

      <circle cx="576" cy="178" r="4" fill="#ffe3b0" />
      <circle cx="576" cy="178" r="11" fill="none" stroke="#ffe3b0" strokeOpacity="0.3" />

      {/* Price readout */}
      <text x="618" y="106" fill="#a48857" fontFamily={SANS} fontSize="7" letterSpacing="2">
        XAU / INR · 24K
      </text>
      <text x="616" y="160" fill="#f6ead1" fontFamily={DISPLAY} fontSize="46" fontWeight="500" letterSpacing="-2">
        74,820
      </text>
      <text x="618" y="184" fill="#e5c170" fontFamily={SANS} fontSize="9" letterSpacing="0.4">
        +1.24% · TODAY
      </text>
      <rect x="618" y="202" width="152" height="32" fill="#1c1508" stroke="#e5c170" strokeOpacity="0.25" />
      <circle cx="632" cy="218" r="3" fill="#e5c170" />
      <text x="642" y="221" fill="#d8bd88" fontFamily={SANS} fontSize="7.5" letterSpacing="0.5">
        Alert set above 75,000
      </text>

      <line x1="618" y1="260" x2="770" y2="260" stroke="#e5c170" strokeOpacity="0.14" />
      {[
        ['USD / INR', '87.42', '+0.18%'],
        ['SILVER', '₹ 92,140', '+0.64%'],
        ['10G GOLD', '₹ 74,820', '+1.24%'],
      ].map(([label, value, change], index) => (
        <g key={label}>
          <text x="618" y={286 + index * 46} fill="#7c6844" fontFamily={SANS} fontSize="6.8" letterSpacing="1.4">
            {label}
          </text>
          <text x="618" y={302 + index * 46} fill="#f0e2c2" fontFamily={DISPLAY} fontSize="15" fontWeight="500">
            {value}
          </text>
          <text x="770" y={302 + index * 46} textAnchor="end" fill="#c2a265" fontFamily={SANS} fontSize="8">
            {change}
          </text>
        </g>
      ))}

      <rect x="618" y="418" width="152" height="78" fill="#141008" stroke="#e5c170" strokeOpacity="0.2" />
      <text x="632" y="438" fill="#8f774c" fontFamily={SANS} fontSize="6.5" letterSpacing="1.5">
        FORECAST · 7 DAYS
      </text>
      <path d="M632 478 C654 468 668 470 686 458 C704 446 726 444 754 430" fill="none" stroke="#c96c3f" strokeWidth="1.4" strokeDasharray="3 3" />
      <circle cx="754" cy="430" r="3" fill="#ff9a5c" />

      <rect x="0" y="532" width="800" height="68" fill="#0d0a06" />
      <line x1="0" y1="532" x2="800" y2="532" stroke="#e5c170" strokeOpacity="0.16" />
      <text x="30" y="558" fill="#a48857" fontFamily={SANS} fontSize="7" letterSpacing="2">
        INTELLIGENCE / BILINGUAL
      </text>
      <text x="30" y="580" fill="#e9d9b7" fontFamily={SANS} fontSize="10">
        Bullion and currency context, read together.
      </text>
      <text x="770" y="576" textAnchor="end" fill="#6f5c3a" fontFamily={SERIF} fontStyle="italic" fontSize="16">
        KGB
      </text>
    </svg>
  );
}

function Hearth({ uid }: { uid: string }) {
  return (
    <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id={`${uid}-warm`} cx="35%" cy="40%" r="65%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="70%" stopColor="#e8d2ba" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#efe3d3" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="800" height="600" fill="#efe3d3" />
      <rect width="800" height="600" fill={`url(#${uid}-warm)`} />

      <text x="32" y="54" fill="#3d2b21" fontFamily={SERIF} fontStyle="italic" fontSize="26">
        Hearth
      </text>
      <text x="768" y="34" textAnchor="end" fill="#8a6a53" fontFamily={SANS} fontSize="7.5" letterSpacing="1.8">
        HOUSEHOLD / OVERVIEW
      </text>
      <text x="768" y="50" textAnchor="end" fill="#b0917b" fontFamily={SANS} fontSize="7" letterSpacing="1.4">
        AUGUST
      </text>
      <line x1="0" y1="72" x2="800" y2="72" stroke="#3d2b21" strokeOpacity="0.16" />

      {/* Ring chart */}
      <g transform="translate(250 300)">
        <circle r="126" fill="none" stroke="#d9c2ab" strokeWidth="1" />
        <circle r="96" fill="none" stroke="#dcc6b0" strokeWidth="24" />
        <circle
          r="96"
          fill="none"
          stroke="#c25b3b"
          strokeWidth="24"
          strokeDasharray="410 603"
          strokeLinecap="butt"
          transform="rotate(-90)"
        />
        <circle
          r="96"
          fill="none"
          stroke="#e3a97d"
          strokeWidth="7"
          strokeDasharray="120 603"
          strokeDashoffset="-420"
          transform="rotate(-90)"
        />
        <circle r="68" fill="#efe3d3" />
        <text textAnchor="middle" y="4" fill="#3d2b21" fontFamily={DISPLAY} fontSize="42" fontWeight="500" letterSpacing="-2">
          68%
        </text>
        <text textAnchor="middle" y="26" fill="#8a6a53" fontFamily={SANS} fontSize="7" letterSpacing="1.6">
          OF MONTHLY PLAN
        </text>
        <text textAnchor="middle" y="154" fill="#8a6a53" fontFamily={SANS} fontSize="7" letterSpacing="1.4">
          SPENT · 42,800
        </text>
      </g>

      {/* Breakdown */}
      <g transform="translate(428 108)">
        <text fill="#8a6a53" fontFamily={SANS} fontSize="7.5" letterSpacing="2">
          THIS MONTH
        </text>
        <line x1="0" y1="16" x2="342" y2="16" stroke="#3d2b21" strokeOpacity="0.16" />
        {[
          ['Housing', '32%', '#c25b3b'],
          ['Groceries', '21%', '#d98960'],
          ['Transport', '9%', '#a97c5f'],
          ['Utilities', '6%', '#c9a98c'],
        ].map(([label, value, color], index) => (
          <g key={label}>
            <rect x="0" y={38 + index * 44} width="5" height="22" fill={color} />
            <text x="18" y={46 + index * 44} fill="#4a3528" fontFamily={SANS} fontSize="10">
              {label}
            </text>
            <text x="18" y={60 + index * 44} fill="#9a7b64" fontFamily={SANS} fontSize="7.5">
              {['Rent and upkeep', 'Household essentials', 'Commute and fuel', 'Power and water'][index]}
            </text>
            <text x="342" y={52 + index * 44} textAnchor="end" fill="#4a3528" fontFamily={DISPLAY} fontSize="12" fontWeight="500">
              {value}
            </text>
            <line x1="0" y1={76 + index * 44} x2="342" y2={76 + index * 44} stroke="#3d2b21" strokeOpacity="0.1" />
          </g>
        ))}
      </g>

      {/* Voice interaction bar */}
      <rect x="428" y="424" width="342" height="86" fill="#3d2b21" />
      <circle cx="462" cy="466" r="17" fill="#efe3d3" />
      <path d="M462 458 a5 5 0 0 1 5 5 v6 a5 5 0 0 1 -10 0 v-6 a5 5 0 0 1 5 -5 m-8 10 a8 8 0 0 0 16 0 m-8 8 v5" fill="none" stroke="#3d2b21" strokeWidth="1.4" strokeLinecap="round" />
      {[8, 18, 28, 14, 34, 22, 10, 26, 16, 30, 12, 20, 8, 24, 14].map((height, index) => (
        <rect
          key={index}
          x={496 + index * 10}
          y={466 - height / 2}
          width="3"
          height={height}
          fill="#efe3d3"
          opacity={0.4 + (index % 4) * 0.12}
        />
      ))}
      <text x="496" y="496" fill="#c8ad97" fontFamily={SANS} fontSize="6.5" letterSpacing="1.4">
        TAP TO ADD AN EXPENSE BY VOICE
      </text>
      <text x="738" y="458" textAnchor="end" fill="#efe3d3" fontFamily={SANS} fontSize="7" letterSpacing="1.5">
        VOICE ENTRY
      </text>

      <text x="32" y="548" fill="#8a6a53" fontFamily={SANS} fontSize="7" letterSpacing="1.8">
        QUIET HOUSEHOLD FINANCE · PROTOTYPE
      </text>
      <text x="768" y="548" textAnchor="end" fill="#a98469" fontFamily={SERIF} fontStyle="italic" fontSize="14">
        less admin, more living
      </text>
      <line x1="32" y1="568" x2="768" y2="568" stroke="#3d2b21" strokeOpacity="0.14" />
    </svg>
  );
}

function Orbit({ uid }: { uid: string }) {
  return (
    <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id={`${uid}-core`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="14%" stopColor="#c9c0ff" stopOpacity="0.85" />
          <stop offset="45%" stopColor="#6d5be0" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#07060e" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="800" height="600" fill="#06060e" />
      <circle cx="420" cy="300" r="260" fill={`url(#${uid}-core)`} opacity="0.8" />

      {Array.from({ length: 70 }, (_, i) => {
        const x = (i * 137.5) % 780;
        const y = (i * 97.3) % 560;
        const r = 0.5 + ((i * 13) % 9) / 8;
        return <circle key={i} cx={x + 10} cy={y + 20} r={r} fill="#c8c2f2" opacity={0.12 + (i % 5) * 0.1} />;
      })}

      <ellipse cx="420" cy="300" rx="256" ry="118" fill="none" stroke="#9f91ff" strokeOpacity="0.28" transform="rotate(-18 420 300)" />
      <ellipse cx="420" cy="300" rx="204" ry="88" fill="none" stroke="#9f91ff" strokeOpacity="0.35" transform="rotate(-18 420 300)" strokeDasharray="2 6" />
      <ellipse cx="420" cy="300" rx="140" ry="58" fill="none" stroke="#d8d2ff" strokeOpacity="0.4" transform="rotate(-18 420 300)" />

      <circle cx="420" cy="300" r="44" fill="#0b0916" stroke="#e6e1ff" strokeWidth="1" />
      <circle cx="420" cy="300" r="18" fill="#f6f3ff" opacity="0.9" />
      <circle cx="420" cy="300" r="56" fill="none" stroke="#9f91ff" strokeOpacity="0.5" strokeDasharray="1 4" />

      {[
        [186, 336, -6],
        [264, 246, 4],
        [560, 358, -4],
        [646, 268, 6],
        [364, 196, 2],
        [492, 220, -3],
      ].map(([x, y, r], index) => (
        <g key={index} transform={`rotate(${r} ${x} ${y})`}>
          <rect x={x - 22} y={y - 28} width="44" height="56" fill="#0c0b16" stroke="#b8aeff" strokeOpacity="0.55" />
          <rect x={x - 17} y={y - 23} width="34" height="38" fill="#191730" />
          <circle cx={x - 10} cy={y - 15} r="2" fill="#9f91ff" opacity="0.7" />
          <rect x={x - 17} y={y + 20} width="22" height="2" fill="#9f91ff" opacity="0.4" />
        </g>
      ))}

      <text x="32" y="40" fill="#e4dfff" fontFamily={DISPLAY} fontSize="13" fontWeight="500" letterSpacing="3">
        ORBIT STUDY
      </text>
      <text x="768" y="38" textAnchor="end" fill="#77709e" fontFamily={SANS} fontSize="7.5" letterSpacing="2">
        SHADER / COMPOSITION
      </text>
      <text x="32" y="566" fill="#7f78a8" fontFamily={SANS} fontSize="7" letterSpacing="2">
        REAL-TIME GLSL · ONE POINTER RESPONSE
      </text>
      <text x="768" y="566" textAnchor="end" fill="#4f4a6d" fontFamily={DISPLAY} fontSize="11" letterSpacing="2">
        08
      </text>
    </svg>
  );
}

function Type({ uid }: { uid: string }) {
  return (
    <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`${uid}-red`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d6482a" />
          <stop offset="100%" stopColor="#982a17" />
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill="#efe8dd" />
      <line x1="0" y1="78" x2="800" y2="78" stroke="#14110d" strokeOpacity="0.2" />
      <line x1="0" y1="516" x2="800" y2="516" stroke="#14110d" strokeOpacity="0.2" />
      {[160, 260, 360, 460].map((y) => (
        <line key={y} x1="0" y1={y} x2="800" y2={y} stroke="#14110d" strokeOpacity="0.06" />
      ))}

      <text x="34" y="48" fill="#4a3a2f" fontFamily={SANS} fontSize="8" letterSpacing="2.2">
        TYPE STUDY / 01
      </text>
      <text x="766" y="48" textAnchor="end" fill="#8a7565" fontFamily={SANS} fontSize="7.5" letterSpacing="1.6">
        SCALE / CONTRAST / RHYTHM
      </text>

      <text x="44" y="430" fill="#14110d" fontFamily={DISPLAY} fontSize="330" fontWeight="500" letterSpacing="-18">
        Aa
      </text>
      <text x="370" y="410" fill="#a5301b" fontFamily={SERIF} fontStyle="italic" fontSize="92" letterSpacing="-1">
        in motion
      </text>

      <rect x="620" y="112" width="22" height="286" fill={`url(#${uid}-red)`} />
      <text x="658" y="146" fill="#3c2c22" fontFamily={SANS} fontSize="7" letterSpacing="1.8">
        DISPLAY
      </text>
      <text x="658" y="166" fill="#14110d" fontFamily={DISPLAY} fontSize="13" fontWeight="500">
        Space Grotesk
      </text>
      <text x="658" y="200" fill="#3c2c22" fontFamily={SANS} fontSize="7" letterSpacing="1.8">
        ACCENT
      </text>
      <text x="658" y="222" fill="#a5301b" fontFamily={SERIF} fontStyle="italic" fontSize="18">
        Instrument Serif
      </text>
      <text x="658" y="256" fill="#3c2c22" fontFamily={SANS} fontSize="7" letterSpacing="1.8">
        BODY
      </text>
      <text x="658" y="278" fill="#14110d" fontFamily={SANS} fontSize="13">
        Inter
      </text>
      <line x1="658" y1="302" x2="766" y2="302" stroke="#14110d" strokeOpacity="0.2" />
      <text x="658" y="322" fill="#7c6657" fontFamily={SANS} fontSize="6.8">
        A system, not a font.
      </text>

      <text x="34" y="550" fill="#4a3a2f" fontFamily={SANS} fontSize="7" letterSpacing="1.8">
        EDITORIAL SYSTEM FOR CINEMATIC INTERFACES
      </text>
      <text x="766" y="550" textAnchor="end" fill="#8a7565" fontFamily={SANS} fontSize="7" letterSpacing="1.4">
        EXPERIMENT
      </text>
    </svg>
  );
}

function Portfolio({ uid }: { uid: string }) {
  return (
    <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id={`${uid}-sun`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffe0b0" />
          <stop offset="32%" stopColor="#ff8a45" />
          <stop offset="62%" stopColor="#d73520" />
          <stop offset="100%" stopColor="#3c0e07" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${uid}-fade`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#08090c" stopOpacity="0" />
          <stop offset="100%" stopColor="#08090c" />
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill="#08090c" />
      <circle cx="518" cy="250" r="220" fill={`url(#${uid}-sun)`} />
      <rect y="380" width="800" height="220" fill={`url(#${uid}-fade)`} opacity="0.7" />

      <text x="32" y="40" fill="#f3f0eb" fontFamily={DISPLAY} fontSize="13" fontWeight="500" letterSpacing="2.6">
        PORTFOLIO OS
      </text>
      <text x="768" y="38" textAnchor="end" fill="#9b9ba5" fontFamily={SANS} fontSize="7.5" letterSpacing="2">
        LIVE / 01
      </text>
      <circle cx="744" cy="52" r="2.2" fill="#ff612f" />
      <line x1="0" y1="66" x2="800" y2="66" stroke="#f3f0eb" strokeOpacity="0.14" />

      {/* Wireframe / build layers */}
      <g transform="translate(58 122)">
        <rect width="292" height="192" fill="rgba(12,13,18,0.75)" stroke="#f3f0eb" strokeOpacity="0.2" />
        <rect width="292" height="22" fill="#14151b" />
        <circle cx="12" cy="11" r="2" fill="#ff612f" />
        <circle cx="21" cy="11" r="2" fill="#6a5a55" />
        <circle cx="30" cy="11" r="2" fill="#6a5a55" />
        <text x="14" y="48" fill="#f3f0eb" fontFamily={SERIF} fontStyle="italic" fontSize="22">
          Software
        </text>
        <text x="14" y="70" fill="#ffb08b" fontFamily={SERIF} fontStyle="italic" fontSize="22">
          with depth.
        </text>
        <rect x="14" y="86" width="118" height="2" fill="#f3f0eb" opacity="0.15" />
        <rect x="14" y="96" width="84" height="2" fill="#f3f0eb" opacity="0.1" />
        <rect x="14" y="144" width="56" height="20" fill="#f3f0eb" />
        <text x="42" y="157" textAnchor="middle" fill="#08090c" fontFamily={SANS} fontSize="6" letterSpacing="1">
          VIEW
        </text>
        <circle cx="228" cy="130" r="34" fill="none" stroke="#ff612f" strokeOpacity="0.5" />
        <circle cx="228" cy="130" r="14" fill="#ff612f" opacity="0.25" />
      </g>

      <g transform="translate(392 320)">
        <rect width="348" height="178" fill="rgba(15,16,21,0.9)" stroke="#f3f0eb" strokeOpacity="0.14" />
        <text x="16" y="26" fill="#9b9ba5" fontFamily={SANS} fontSize="6.5" letterSpacing="1.8">
          SELECTED WORK
        </text>
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <rect x="16" y={44 + i * 40} width="46" height="30" fill="#1a1620" stroke="#f3f0eb" strokeOpacity="0.15" />
            <rect x="72" y={50 + i * 40} width="82" height="4" fill="#f3f0eb" opacity="0.6" />
            <rect x="72" y={60 + i * 40} width="52" height="3" fill="#9b9ba5" opacity="0.4" />
            <text x="330" y={62 + i * 40} textAnchor="end" fill="#ff8a5c" fontFamily={SERIF} fontStyle="italic" fontSize="13">
              0{i + 1}
            </text>
            <line x1="16" y1={80 + i * 40} x2="332" y2={80 + i * 40} stroke="#f3f0eb" strokeOpacity="0.08" />
          </g>
        ))}
      </g>

      <text x="32" y="556" fill="#9b9ba5" fontFamily={SANS} fontSize="7" letterSpacing="1.8">
        SCROLL-DRIVEN NARRATIVE · REACT + THREE.JS
      </text>
      <text x="768" y="556" textAnchor="end" fill="#6f6b76" fontFamily={SANS} fontSize="7" letterSpacing="1.4">
        2026
      </text>
    </svg>
  );
}

const artworkByKey: Record<ArtworkKey, (props: { uid: string }) => JSX.Element> = {
  vaidhya: Vaidhya,
  heatguard: HeatGuard,
  bidlens: BidLens,
  kgb: Kgb,
  hearth: Hearth,
  orbit: Orbit,
  type: Type,
  portfolio: Portfolio,
};

/** Cropped to a portrait tile in the orbital gallery: keep the mark centred. */
function TypeTile() {
  return (
    <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <rect width="800" height="600" fill="#efe8dd" />
      <text x="400" y="420" textAnchor="middle" fill="#14110d" fontFamily={DISPLAY} fontSize="300" fontWeight="500" letterSpacing="-14">
        Aa
      </text>
      <line x1="120" y1="452" x2="680" y2="452" stroke="#14110d" strokeOpacity="0.22" />
      <text x="400" y="500" textAnchor="middle" fill="#a5301b" fontFamily={SERIF} fontStyle="italic" fontSize="74">
        in motion
      </text>
    </svg>
  );
}

export function ProjectArtwork({ project, compact = false }: { project: Project; compact?: boolean }) {
  const uid = useId().replace(/:/g, '');
  const Artwork = artworkByKey[project.artwork];

  if (project.image) {
    return <img src={project.image} alt={`${project.title} preview`} loading="lazy" decoding="async" />;
  }

  if (compact && project.artwork === 'type') return <TypeTile />;

  return <Artwork uid={uid} />;
}
