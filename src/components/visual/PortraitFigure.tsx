import { useId } from 'react';

export function PortraitFigure() {
  const uid = useId().replace(/:/g, '');
  const skin = `skin-${uid}`;
  const skinShade = `skin-shade-${uid}`;
  const rim = `rim-${uid}`;
  const halo = `halo-${uid}`;
  const jacket = `jacket-${uid}`;
  const dots = `dots-${uid}`;

  return (
    <svg viewBox="0 0 560 780" role="presentation">
      <defs>
        <radialGradient id={halo} cx="50%" cy="40%" r="56%">
          <stop offset="0%" stopColor="#e7c8a9" stopOpacity="0.95" />
          <stop offset="58%" stopColor="#e7c8a9" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#e7c8a9" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={skin} x1="0.05" y1="0.1" x2="0.9" y2="0.9">
          <stop offset="0%" stopColor="#9a6448" />
          <stop offset="30%" stopColor="#3d2318" />
          <stop offset="100%" stopColor="#150c08" />
        </linearGradient>
        <linearGradient id={skinShade} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3a2117" />
          <stop offset="100%" stopColor="#130b08" />
        </linearGradient>
        <linearGradient id={rim} x1="0" y1="0" x2="0.35" y2="1">
          <stop offset="0%" stopColor="#ffdcb3" />
          <stop offset="52%" stopColor="#ff925b" />
          <stop offset="100%" stopColor="#cf3b1d" stopOpacity="0.25" />
        </linearGradient>
        <linearGradient id={jacket} x1="0" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#2b211b" />
          <stop offset="48%" stopColor="#17110e" />
          <stop offset="100%" stopColor="#0b0908" />
        </linearGradient>
        <pattern id={dots} width="10" height="10" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="0.85" fill="#f3e5d4" opacity="0.28" />
        </pattern>
        <clipPath id={`bust-${uid}`}>
          <path d="M26 780 C40 664 110 596 206 560 L354 560 C450 596 520 664 534 780 Z" />
        </clipPath>
      </defs>

      {/* Editorial halo */}
      <circle cx="312" cy="342" r="268" fill={`url(#${halo})`} />
      <circle cx="312" cy="342" r="268" fill="none" stroke="#d3b598" strokeWidth="1" opacity="0.5" />

      {/* Neck */}
      <path d="M244 372 L318 380 L328 568 C300 586 268 584 240 560 Z" fill={`url(#${skinShade})`} />
      <path d="M250 416 C268 442 296 448 320 432" stroke="#5f3426" strokeWidth="2" fill="none" opacity="0.45" />
      <path d="M252 468 C272 490 298 494 322 478" stroke="#1f110c" strokeWidth="3" fill="none" opacity="0.3" />

      {/* Jacket and shirt */}
      <path
        d="M26 780 C40 664 110 596 206 560 L354 560 C450 596 520 664 534 780 Z"
        fill={`url(#${jacket})`}
      />
      <path d="M254 560 L320 560 L344 662 L282 780 L226 662 Z" fill="#e8dac7" />
      <path d="M260 566 L280 652 L278 780 L246 652 Z" fill="#d6c4ae" opacity="0.8" />
      <path d="M240 562 C246 600 252 632 260 654 L220 780 L172 780 C180 676 198 608 240 562 Z" fill="#1d1612" />
      <path d="M332 562 C326 600 320 632 312 654 L352 780 L400 780 C392 676 374 608 332 562 Z" fill="#1d1612" />
      <path d="M262 654 L280 780" stroke="#bfa88c" strokeWidth="1" opacity="0.6" fill="none" />
      <path d="M320 380 L326 496" stroke="#633826" strokeWidth="1.5" opacity="0.4" fill="none" />
      <g clipPath={`url(#bust-${uid})`}>
        <rect x="26" y="540" width="510" height="250" fill={`url(#${dots})`} opacity="0.38" />
      </g>
      <path d="M206 560 C186 592 174 636 170 688" stroke="#ff9059" strokeWidth="1.6" opacity="0.28" fill="none" />

      {/* Head, profile facing left */}
      <path
        d="M302 110 C252 110 212 146 198 200 C192 222 184 238 178 254 C174 266 160 282 148 294 C140 302 144 310 156 310 L180 306 C176 315 176 322 182 326 C175 333 176 341 184 346 C179 354 187 362 200 366 C200 382 212 396 232 402 L252 428 L312 438 L356 418 C394 402 412 366 412 318 C412 282 404 245 392 212 C374 152 338 110 302 110 Z"
        fill={`url(#${skin})`}
      />

      {/* Far-side shadow plane */}
      <path
        d="M332 122 C372 148 396 196 398 248 C400 296 408 334 392 374 C378 410 350 428 314 436 L300 404 C338 382 352 348 350 302 C348 246 338 176 332 122 Z"
        fill="#170d09"
        opacity="0.45"
      />

      {/* A narrow plane of light, no drawn features */}
      <path
        d="M202 206 C208 170 234 142 274 128 C252 152 238 180 232 208 C226 238 210 254 193 262 Z"
        fill="#c98f69"
        opacity="0.22"
      />
      <path d="M232 250 C252 272 270 300 278 330" stroke="#b87d5a" strokeWidth="13" fill="none" opacity="0.08" />

      {/* Hair */}
      <path
        d="M197 202 C190 140 233 94 300 94 C362 94 409 136 416 204 C420 242 414 292 404 326 C396 286 390 254 376 230 C350 244 322 250 294 244 C264 238 240 226 224 208 C212 222 204 244 200 270 L188 294 C184 266 190 230 197 202 Z"
        fill="#16100d"
      />
      <path
        d="M220 214 C254 242 300 252 368 232 C358 204 334 180 300 168 C260 154 228 174 220 214 Z"
        fill="#1e1612"
      />
      <path d="M200 194 C216 154 246 128 288 120 C248 138 224 168 214 206 Z" fill="#372820" opacity="0.65" />
      <path d="M368 190 C386 216 396 254 398 298 C386 272 374 248 358 228 Z" fill="#0c0907" opacity="0.65" />
      <path d="M222 214 C248 234 280 244 316 244" stroke="#3f2d23" strokeWidth="1.4" fill="none" opacity="0.5" />

      {/* Ear, kept in shadow */}
      <ellipse cx="332" cy="288" rx="14" ry="23" fill="#3b2318" />
      <path d="M328 274 C336 278 336 296 330 303" stroke="#1f130e" strokeWidth="1.3" fill="none" opacity="0.6" />

      {/* Rim light on profile */}
      <path
        d="M198 202 C194 222 186 240 180 254 C176 267 162 282 149 294 C141 302 145 310 156 310 L180 306 C176 315 176 322 182 326 C175 333 176 341 184 346 C179 354 187 362 200 366 C200 382 212 396 232 402 L250 428"
        fill="none"
        stroke={`url(#${rim})`}
        strokeWidth="3.4"
        strokeLinecap="round"
      />
      <path
        d="M207 196 C214 158 246 128 292 120 C318 118 342 126 358 142"
        fill="none"
        stroke={`url(#${rim})`}
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.38"
      />
      <path
        d="M206 560 C182 598 168 648 164 712"
        fill="none"
        stroke="#ff935b"
        strokeWidth="2"
        opacity="0.4"
        strokeLinecap="round"
      />
      <path d="M200 366 C212 384 224 394 242 400" fill="none" stroke="#ffb78a" strokeWidth="1.3" opacity="0.45" strokeLinecap="round" />
      <path d="M328 380 C326 448 330 508 322 560" fill="none" stroke="#b0704f" strokeWidth="1.2" opacity="0.3" />
    </svg>
  );
}
