import type { ArtworkVariant, FlowerStyle } from '../data/portfolio';

interface FlowerIconProps {
  styleType: FlowerStyle;
  size?: number;
  className?: string;
  withStem?: boolean;
  muted?: boolean;
}

/**
 * Hand-drawn black-work floral markers honoring both reference artworks:
 * - solid-4 / solid-5: chunky organic solid-black petals with hollow paper-white center
 * - sketch-outline-4: heavy shaggy charcoal-outlined 4-petal flower over fine sketchbook hatching
 * - twin-solid: paired blooms curving together from shared charcoal roots
 */
export function BlackworkFlower({
  styleType,
  size = 76,
  className = '',
  withStem = false,
  muted = false
}: FlowerIconProps) {
  const ink = muted ? 'rgba(18, 17, 15, 0.34)' : '#0e0e0d';
  const hole = muted ? '#928d82' : '#f4f0e6';
  const viewH = withStem ? 148 : 100;

  if (styleType === 'sketch-outline-4') {
    return (
      <svg
        width={size}
        height={(size * viewH) / 100}
        viewBox={`0 0 100 ${viewH}`}
        className={className}
        aria-hidden="true"
      >
        {!muted && (
          <g opacity="0.28" stroke="#181816" strokeWidth="0.75" fill="none">
            <path d="M12 18 L34 6 M18 28 L44 10 M62 12 L88 26 M66 22 L90 36" />
            <path d="M10 68 L30 82 M14 78 L36 90 M68 74 L92 60 M72 86 L90 74" />
            <path d="M22 10 L20 92 M78 14 L81 90" strokeDasharray="3 3" />
          </g>
        )}
        <g filter={muted ? undefined : 'url(#ink-shaggy)'}>
          {withStem && (
            <path
              d="M50 56 C48 82, 51 112, 47 142"
              stroke={ink}
              strokeWidth="6.2"
              strokeLinecap="round"
              fill="none"
            />
          )}
          <path
            d="M46 44 C26 42, 14 25, 27 14 C39 5, 53 18, 50 38
               C54 18, 72 8, 82 22 C91 34, 74 47, 56 47
               C76 50, 88 68, 74 80 C61 91, 49 74, 50 55
               C47 75, 29 88, 17 75 C7 63, 25 48, 46 48 Z"
            fill="none"
            stroke={ink}
            strokeWidth={muted ? '3.5' : '8'}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <circle
            cx="50"
            cy="48"
            r="10.5"
            fill={hole}
            stroke={ink}
            strokeWidth={muted ? '2.5' : '6'}
          />
        </g>
      </svg>
    );
  }

  if (styleType === 'twin-solid') {
    return (
      <svg
        width={size}
        height={(size * viewH) / 100}
        viewBox={`0 0 112 ${viewH}`}
        className={className}
        aria-hidden="true"
      >
        <g filter={muted ? undefined : 'url(#ink-charcoal)'}>
          {withStem && (
            <>
              <path
                d="M36 62 C38 88, 34 118, 38 140 M38 136 L30 144 M38 136 L45 143"
                stroke={ink}
                strokeWidth="4.2"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M78 44 C66 76, 62 110, 56 140 M56 135 L48 144 M56 135 L64 143"
                stroke={ink}
                strokeWidth="4.6"
                strokeLinecap="round"
                fill="none"
              />
            </>
          )}
          <path
            d="M34 26 C21 24, 13 36, 19 48 C12 58, 22 72, 36 68 C47 74, 59 64, 54 51 C61 39, 49 23, 34 26 Z"
            fill={ink}
          />
          <ellipse cx="36" cy="48" rx="4.4" ry="5" fill={hole} />
          <path
            d="M76 11 C63 9, 53 21, 59 33 C52 44, 63 58, 78 53 C90 59, 102 47, 96 34 C103 21, 90 7, 76 11 Z"
            fill={ink}
          />
          <ellipse cx="78" cy="33" rx="5.2" ry="4.6" fill={hole} />
        </g>
      </svg>
    );
  }

  if (styleType === 'solid-5') {
    return (
      <svg
        width={size}
        height={(size * viewH) / 100}
        viewBox={`0 0 100 ${viewH}`}
        className={className}
        aria-hidden="true"
      >
        <g filter={muted ? undefined : 'url(#ink-charcoal)'}>
          {withStem && (
            <path
              d="M50 72 C46 95, 53 118, 48 142 M48 138 L40 145 M48 138 L56 144"
              stroke={ink}
              strokeWidth="4.6"
              strokeLinecap="round"
              fill="none"
            />
          )}
          <path
            d="M50 11 C61 8, 72 19, 67 31 C80 28, 91 41, 83 53 C91 64, 81 79, 67 74 C67 88, 50 93, 41 82 C29 90, 15 80, 20 66 C8 60, 11 42, 24 41 C18 28, 30 14, 42 22 C44 15, 47 12, 50 11 Z"
            fill={ink}
          />
          <ellipse cx="49" cy="51" rx="7.6" ry="7.1" transform="rotate(-11 49 51)" fill={hole} />
        </g>
      </svg>
    );
  }

  return (
    <svg
      width={size}
      height={(size * viewH) / 100}
      viewBox={`0 0 100 ${viewH}`}
      className={className}
      aria-hidden="true"
    >
      <g filter={muted ? undefined : 'url(#ink-charcoal)'}>
        {withStem && (
          <path
            d="M49 74 C53 98, 46 119, 51 142 M51 138 L43 145 M51 138 L58 144"
            stroke={ink}
            strokeWidth="4.8"
            strokeLinecap="round"
            fill="none"
          />
        )}
        <path
          d="M48 15 C32 9, 14 23, 21 41 C9 52, 16 74, 34 75 C42 88, 66 88, 73 73 C88 68, 91 46, 77 37 C84 21, 66 7, 48 15 Z"
          fill={ink}
        />
        <ellipse cx="49" cy="49" rx="7.4" ry="8.1" transform="rotate(9 49 49)" fill={hole} />
      </g>
    </svg>
  );
}

/**
 * Wordless origin landmark: twin charcoal flowers on an open hill.
 * No captions, no buttons — the blooms are the mark.
 */
export function HeroTwinFlowersPlinth() {
  return (
    <div className="hero-plinth" aria-hidden="true">
      {/* Hand-inked twin solid-black charcoal flowers growing openly out of a cross-hatched hill */}
      <svg
        className="hero-plinth-artwork"
        viewBox="248 0 392 480"
        aria-hidden="true"
      >
        {/* Subtle fine-pen sketchbook cross-hatching & compass arc */}
        <g opacity="0.16" stroke="#141412" strokeWidth="0.9" fill="none">
          <circle cx="430" cy="196" r="158" strokeDasharray="3 6" />
          <path d="M320 48 L368 18 M342 56 L388 26 M366 62 L408 36" />
        </g>

        {/* Open organic cross-hatched charcoal hill tapering naturally into the rag paper */}
        <g filter="url(#ink-charcoal)">
          <path
            d="M276 410 C340 368, 412 318, 482 292 C530 274, 580 272, 626 282 L610 424 C514 414, 386 416, 276 410 Z"
            fill="url(#charcoal-hatch)"
            opacity="0.92"
          />
          <path
            d="M490 400 L614 324 L604 424 L490 418 Z"
            fill="url(#charcoal-crosshatch)"
            opacity="0.7"
          />
          <path
            d="M274 410 C340 368, 412 318, 482 292 C530 274, 580 272, 626 282"
            fill="none"
            stroke="#0e0e0d"
            strokeWidth="6.4"
            strokeLinecap="round"
          />
          <path
            d="M292 412 C386 404, 484 406, 598 416"
            fill="none"
            stroke="#0e0e0d"
            strokeWidth="3"
            strokeOpacity="0.62"
            strokeLinecap="round"
          />
        </g>

        {/* Curving dry-brush stems with splayed dark ink roots */}
        <g filter="url(#ink-charcoal)" fill="none" stroke="#0e0e0d" strokeLinecap="round">
          <path d="M398 220 C406 272, 398 320, 406 368" strokeWidth="9.5" />
          <path
            d="M398 220 C406 272, 398 320, 406 368"
            stroke="#f4f0e6"
            strokeWidth="1.5"
            strokeDasharray="18 14"
            opacity="0.55"
          />
          <path d="M406 360 L390 378 M406 360 L422 376" strokeWidth="6.8" />

          <path d="M524 146 C492 192, 488 238, 468 286 C458 312, 456 338, 455 362" strokeWidth="11" />
          <path
            d="M524 146 C492 192, 488 238, 468 286 C458 312, 456 338, 455 362"
            stroke="#f4f0e6"
            strokeWidth="1.7"
            strokeDasharray="24 18"
            opacity="0.45"
          />
          <path d="M456 348 L436 372 M456 348 L471 373" strokeWidth="8.2" />
        </g>

        {/* Left chunky solid-black 4-petal charcoal flower */}
        <g filter="url(#ink-charcoal)">
          <path
            d="M388 118
               C360 106, 325 127, 336 158
               C314 180, 330 220, 366 224
               C388 246, 435 240, 446 210
               C470 196, 467 154, 440 141
               C446 112, 413 98, 388 118 Z"
            fill="#0e0e0d"
          />
          <ellipse cx="394" cy="174" rx="11.5" ry="12.8" transform="rotate(-8 394 174)" fill="#f4f0e6" />
        </g>

        {/* Right larger solid-black 4-petal charcoal flower */}
        <g filter="url(#ink-charcoal)">
          <path
            d="M530 40
               C496 28, 458 54, 470 90
               C444 111, 458 156, 500 160
               C526 188, 580 180, 588 142
               C608 124, 604 74, 574 62
               C580 34, 552 24, 530 40 Z"
            fill="#0e0e0d"
          />
          <ellipse cx="534" cy="100" rx="13.5" ry="12.2" transform="rotate(10 534 100)" fill="#f4f0e6" />
        </g>
      </svg>
    </div>
  );
}

interface ProjectArtworkProps {
  variant: ArtworkVariant;
  className?: string;
}

/**
 * 8 bespoke art-directed monochrome charcoal-and-rag-paper architectural plates.
 * Zero external image dependencies—every plate feels like a hand-inked production print.
 */
export function ProjectArtworkPlate({ variant, className = '' }: ProjectArtworkProps) {
  return (
    <svg
      viewBox="0 0 420 260"
      className={className}
      role="img"
      aria-label={`Monochrome production artwork plate: ${variant}`}
    >
      <rect width="420" height="260" fill="#f1ede3" />

      {variant === 'conservatory' && (
        <g>
          <rect x="0" y="0" width="420" height="190" fill="#141413" />
          <polygon points="105,0 165,0 245,210 15,210" fill="#f4f1e8" opacity="0.2" />
          <polygon points="275,0 325,0 390,210 190,210" fill="#f4f1e8" opacity="0.16" />
          <g stroke="#f4f1e8" fill="none" strokeWidth="1.5" opacity="0.82">
            <path d="M20 190 C20 55, 110 22, 210 22 C310 22, 400 55, 400 190" />
            <path d="M70 190 C70 76, 134 42, 210 42 C286 42, 350 76, 350 190" />
            <path d="M130 190 C130 100, 165 65, 210 65 C255 65, 290 100, 290 190" />
            <line x1="210" y1="22" x2="210" y2="190" />
            <path d="M28 112 L392 112 M44 74 L376 74" strokeOpacity="0.45" />
          </g>
          <g filter="url(#ink-charcoal)">
            <path
              d="M210 66 C188 58, 168 74, 178 96 C158 109, 170 137, 198 137 C208 156, 240 152, 244 130 C266 122, 263 92, 241 85 C244 65, 224 55, 210 66 Z"
              fill="#f4f1e8"
              opacity="0.92"
            />
            <circle cx="211" cy="106" r="10" fill="#141413" />
          </g>
          <rect x="0" y="188" width="420" height="72" fill="url(#charcoal-hatch)" />
          <path d="M0 190 Q105 178 210 190 T420 190" fill="none" stroke="#0e0e0d" strokeWidth="3.5" filter="url(#ink-fine)" />
          <g fill="#0e0e0d">
            <rect x="132" y="176" width="8" height="28" rx="3" />
            <circle cx="136" cy="171" r="4" />
            <rect x="148" y="180" width="7" height="24" rx="3" />
            <circle cx="151.5" cy="175" r="3.6" />
            <rect x="278" y="174" width="8" height="30" rx="3" />
            <circle cx="282" cy="169" r="4.2" />
          </g>
        </g>
      )}

      {variant === 'monolith-stage' && (
        <g>
          <rect width="420" height="260" fill="#121211" />
          <g stroke="#f4f1e8" strokeWidth="0.9" opacity="0.45">
            <line x1="78" y1="0" x2="78" y2="70" />
            <line x1="142" y1="0" x2="142" y2="48" />
            <line x1="210" y1="0" x2="210" y2="30" />
            <line x1="278" y1="0" x2="278" y2="54" />
            <line x1="342" y1="0" x2="342" y2="78" />
          </g>
          <polygon points="108,50 116,50 128,225 96,225" fill="#f4f1e8" opacity="0.28" />
          <polygon points="205,30 215,30 232,225 188,225" fill="#f4f1e8" opacity="0.5" />
          <polygon points="304,55 312,55 324,225 292,225" fill="#f4f1e8" opacity="0.26" />
          <g filter="url(#ink-fine)">
            <rect x="58" y="64" width="40" height="106" fill="#1d1d1b" stroke="#f4f1e8" strokeWidth="1.8" />
            <rect x="122" y="42" width="42" height="122" fill="#0e0e0d" stroke="#f4f1e8" strokeWidth="2" />
            <rect x="188" y="26" width="44" height="134" fill="#f4f1e8" stroke="#0e0e0d" strokeWidth="2.8" />
            <rect x="256" y="48" width="42" height="118" fill="#0e0e0d" stroke="#f4f1e8" strokeWidth="2" />
            <rect x="322" y="72" width="40" height="98" fill="#1d1d1b" stroke="#f4f1e8" strokeWidth="1.8" />
          </g>
          <circle cx="210" cy="92" r="16" fill="none" stroke="#0e0e0d" strokeWidth="5.2" filter="url(#ink-charcoal)" />
          <circle cx="210" cy="92" r="4.5" fill="#0e0e0d" />
          <path d="M0 202 L420 202 L420 260 L0 260 Z" fill="#f4f1e8" />
          <path d="M0 202 L420 202 L420 260 L0 260 Z" fill="url(#charcoal-crosshatch)" />
          <path d="M0 202 L420 202" stroke="#0e0e0d" strokeWidth="4.5" />
        </g>
      )}

      {variant === 'water-pavilion' && (
        <g>
          <rect x="0" y="0" width="420" height="138" fill="#f2eee4" />
          <rect x="0" y="0" width="420" height="138" fill="url(#charcoal-hatch)" opacity="0.2" />
          <path d="M0 26 L420 26 M0 38 L420 38 M30 26 L55 38 L80 26 L105 38 L130 26 L155 38 L180 26 L205 38 L230 26 L255 38 L280 26 L305 38 L330 26 L355 38 L380 26 L405 38" stroke="#0e0e0d" strokeWidth="1.3" fill="none" />
          <polygon points="196,28 224,28 272,175 148,175" fill="#ffffff" opacity="0.55" />
          <rect x="0" y="138" width="420" height="122" fill="#121211" />
          <g fill="none" stroke="#f4f1e8" strokeWidth="1.3" filter="url(#ink-fine)">
            <ellipse cx="210" cy="176" rx="34" ry="8" opacity="0.85" />
            <ellipse cx="210" cy="176" rx="68" ry="16" opacity="0.55" />
            <ellipse cx="210" cy="176" rx="112" ry="26" opacity="0.32" />
            <ellipse cx="210" cy="176" rx="164" ry="38" opacity="0.18" />
          </g>
          <g filter="url(#ink-fine)">
            <path d="M210 82 C204 82, 202 90, 204 102 L196 154 L224 154 L216 102 C218 90, 216 82, 210 82 Z" fill="#0e0e0d" />
            <circle cx="210" cy="74" r="6" fill="#0e0e0d" />
            <path d="M210 240 C205 240, 203 230, 205 218 L198 176 L222 176 L215 218 C217 230, 215 240, 210 240 Z" fill="#f4f1e8" opacity="0.22" />
          </g>
          <line x1="0" y1="138" x2="420" y2="138" stroke="#0e0e0d" strokeWidth="3.2" />
          <path d="M18 134 L125 134 M295 134 L402 134" stroke="#0e0e0d" strokeWidth="6.5" filter="url(#ink-charcoal)" />
        </g>
      )}

      {variant === 'subterranean-choir' && (
        <g>
          <rect width="420" height="260" fill="#141413" />
          <g fill="none" stroke="#f4f1e8">
            <ellipse cx="210" cy="186" rx="178" ry="52" strokeWidth="1" opacity="0.24" strokeDasharray="4 4" />
            <ellipse cx="210" cy="186" rx="136" ry="39" strokeWidth="1.2" opacity="0.38" />
            <ellipse cx="210" cy="186" rx="94" ry="26" strokeWidth="1.4" opacity="0.55" />
            <ellipse cx="210" cy="186" rx="52" ry="15" strokeWidth="1.8" opacity="0.78" />
          </g>
          <ellipse cx="210" cy="76" rx="96" ry="24" fill="none" stroke="#f4f1e8" strokeWidth="7" filter="url(#ink-charcoal)" />
          <ellipse cx="210" cy="76" rx="96" ry="24" fill="none" stroke="#0e0e0d" strokeWidth="2.5" />
          <polygon points="116,78 304,78 340,210 80,210" fill="#f4f1e8" opacity="0.14" />
          <g fill="#f4f1e8">
            {[62, 92, 128, 168, 210, 252, 292, 328, 358].map((cx, i) => (
              <g key={cx}>
                <circle cx={cx} cy={196 + Math.sin(i * 0.9) * 14} r="2.6" />
                <circle cx={cx} cy={196 + Math.sin(i * 0.9) * 14} r="7" opacity="0.18" />
              </g>
            ))}
          </g>
          <g transform="translate(182 48) scale(0.56)">
            <path d="M50 16 C35 10, 18 24, 24 41 C13 52, 20 72, 37 74 C44 86, 66 86, 73 72 C87 67, 90 46, 76 38 C83 22, 66 8, 50 16 Z" fill="#f4f1e8" filter="url(#ink-charcoal)" />
            <circle cx="50" cy="49" r="8" fill="#141413" />
          </g>
        </g>
      )}

      {variant === 'helios-drift' && (
        <g>
          <rect x="0" y="0" width="420" height="168" fill="#f3efe5" />
          <g fill="#0e0e0d" opacity="0.13">
            <polygon points="88,168 96,168 38,0 16,0" />
            <polygon points="168,168 176,168 148,0 120,0" />
            <polygon points="246,168 254,168 292,0 264,0" />
            <polygon points="326,168 334,168 408,0 382,0" />
          </g>
          <path d="M0 166 Q110 150 220 164 T420 158 L420 260 L0 260 Z" fill="url(#charcoal-hatch)" />
          <path d="M0 166 Q110 150 220 164 T420 158" fill="none" stroke="#0e0e0d" strokeWidth="3" filter="url(#ink-fine)" />
          <g filter="url(#ink-charcoal)">
            {[74, 118, 164, 206, 250, 294, 340].map((x, idx) => {
              const h = 76 + (idx % 3) * 14;
              return (
                <g key={x}>
                  <polygon points={`${x},166 ${x + 11},166 ${x + 56},248 ${x + 36},248`} fill="#0e0e0d" opacity="0.26" />
                  <rect x={x} y={166 - h} width="11" height={h} fill="#0e0e0d" />
                  <circle cx={x + 5.5} cy={166 - h + 4} r="2.2" fill="#f4f1e8" />
                </g>
              );
            })}
          </g>
        </g>
      )}

      {variant === 'paper-smoke' && (
        <g>
          <rect width="420" height="260" fill="#f4f0e6" />
          <g stroke="#0e0e0d" strokeWidth="2.1" filter="url(#ink-frame)">
            <rect x="34" y="18" width="96" height="214" fill="#f8f5ee" />
            <rect x="162" y="18" width="96" height="214" fill="#f2eee4" />
            <rect x="290" y="18" width="96" height="214" fill="#f8f5ee" />
          </g>
          <g filter="url(#ink-charcoal)">
            <path d="M82 78 C68 72, 54 84, 60 98 C50 107, 56 124, 71 124 C78 135, 97 134, 102 121 C114 116, 115 98, 104 92 C108 79, 94 69, 82 78 Z" fill="#0e0e0d" />
            <circle cx="82" cy="103" r="6.5" fill="#f8f5ee" />
            <path d="M210 92 C192 86, 178 102, 186 118 C174 128, 182 148, 200 148 C208 160, 229 158, 234 143 C248 137, 248 117, 235 110 C240 94, 224 83, 210 92 Z" fill="none" stroke="#0e0e0d" strokeWidth="7" />
            <circle cx="210" cy="122" r="8" fill="#f2eee4" stroke="#0e0e0d" strokeWidth="4" />
            <path d="M338 72 C324 67, 312 78, 317 92 C308 101, 314 118, 329 118 C336 129, 353 128, 358 116 C370 111, 370 94, 359 88 C363 75, 349 65, 338 72 Z" fill="#0e0e0d" />
            <circle cx="338" cy="97" r="6" fill="#f8f5ee" />
          </g>
          <g fill="none" stroke="#0e0e0d" strokeWidth="1.5" opacity="0.52" filter="url(#ink-fine)">
            <path d="M146 232 C136 186, 158 148, 144 96 C136 66, 150 42, 142 18" />
            <path d="M274 232 C284 188, 262 150, 276 100 C284 70, 270 42, 278 18" />
          </g>
          <line x1="0" y1="232" x2="420" y2="232" stroke="#0e0e0d" strokeWidth="2.6" />
        </g>
      )}

      {variant === 'glass-foundry' && (
        <g>
          <rect width="420" height="260" fill="#141413" />
          <g stroke="#f4f1e8" strokeWidth="0.8" opacity="0.28">
            <line x1="0" y1="52" x2="420" y2="52" />
            <line x1="0" y1="104" x2="420" y2="104" />
            <line x1="0" y1="156" x2="420" y2="156" />
            <line x1="84" y1="0" x2="84" y2="260" />
            <line x1="168" y1="0" x2="168" y2="260" />
            <line x1="252" y1="0" x2="252" y2="260" />
            <line x1="336" y1="0" x2="336" y2="260" />
          </g>
          <g stroke="#f4f1e8" fill="none" strokeWidth="2.1" filter="url(#ink-fine)">
            <rect x="152" y="34" width="116" height="172" />
            <line x1="152" y1="90" x2="268" y2="90" />
            <line x1="152" y1="148" x2="268" y2="148" />
            <line x1="152" y1="34" x2="268" y2="90" opacity="0.6" />
            <line x1="268" y1="34" x2="152" y2="90" opacity="0.6" />
            <line x1="152" y1="90" x2="268" y2="148" opacity="0.6" />
            <line x1="268" y1="90" x2="152" y2="148" opacity="0.6" />
          </g>
          <line x1="0" y1="68" x2="420" y2="68" stroke="#f4f1e8" strokeWidth="2.4" opacity="0.85" />
          <line x1="0" y1="126" x2="420" y2="126" stroke="#f4f1e8" strokeWidth="1.5" opacity="0.58" />
          <ellipse cx="210" cy="216" rx="184" ry="32" fill="none" stroke="#f4f1e8" strokeWidth="1.8" strokeDasharray="8 5" opacity="0.7" />
          <circle cx="210" cy="118" r="22" fill="#f4f1e8" opacity="0.9" filter="url(#ink-charcoal)" />
          <circle cx="210" cy="118" r="7" fill="#141413" />
        </g>
      )}

      {variant === 'afterimage-archive' && (
        <g>
          <rect width="420" height="260" fill="#f4f1e8" />
          <polygon points="36,24 384,24 352,98 68,98" fill="#0e0e0d" filter="url(#ink-charcoal)" />
          <g fill="#f4f1e8">
            <circle cx="128" cy="58" r="14" />
            <circle cx="210" cy="56" r="18" />
            <circle cx="292" cy="58" r="14" />
          </g>
          <g stroke="#0e0e0d" strokeWidth="5.2" filter="url(#ink-fine)">
            <line x1="78" y1="96" x2="78" y2="212" />
            <line x1="342" y1="96" x2="342" y2="212" />
          </g>
          <g transform="translate(0 18)" filter="url(#ink-charcoal)" opacity="0.88">
            <ellipse cx="136" cy="186" rx="34" ry="16" fill="#0e0e0d" />
            <ellipse cx="136" cy="186" rx="10" ry="4.8" fill="#f4f1e8" />
            <ellipse cx="218" cy="194" rx="44" ry="20" fill="#0e0e0d" />
            <ellipse cx="218" cy="194" rx="13" ry="6" fill="#f4f1e8" />
            <ellipse cx="304" cy="184" rx="32" ry="15" fill="#0e0e0d" />
            <ellipse cx="304" cy="184" rx="9" ry="4.5" fill="#f4f1e8" />
          </g>
          <line x1="0" y1="154" x2="420" y2="154" stroke="#0e0e0d" strokeWidth="1.4" strokeDasharray="6 4" />
          <rect x="0" y="226" width="420" height="34" fill="url(#charcoal-hatch)" opacity="0.52" />
        </g>
      )}
    </svg>
  );
}
