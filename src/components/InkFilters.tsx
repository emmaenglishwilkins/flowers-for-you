/**
 * Shared SVG filter definitions that give strokes and fills an authentic
 * dry-brush charcoal / hand-inked edge on rag paper—never sterile vector lines.
 */
export function InkFilters() {
  return (
    <svg
      aria-hidden="true"
      width="0"
      height="0"
      style={{ position: 'fixed', width: 0, height: 0, pointerEvents: 'none' }}
    >
      <defs>
        {/* Heavy charcoal / oil-pastel edge matching ref-two-flowers & ref-sketch-flower */}
        <filter id="ink-charcoal" x="-18%" y="-18%" width="136%" height="136%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.048"
            numOctaves={3}
            seed={11}
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale={5.2}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>

        {/* Extra shaggy feathered dry-brush stroke for giant outlined sketchbook flowers */}
        <filter id="ink-shaggy" x="-22%" y="-22%" width="144%" height="144%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.075"
            numOctaves={4}
            seed={27}
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale={7.8}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>

        {/* Subtle hand-inked wobble for editorial borders, stems, and hatching */}
        <filter id="ink-fine" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.032"
            numOctaves={2}
            seed={5}
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale={2.4}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>

        {/* Rough rounded charcoal border frame */}
        <filter id="ink-frame" x="-6%" y="-6%" width="112%" height="112%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.022"
            numOctaves={3}
            seed={19}
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale={3.6}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>

        {/* Diagonal charcoal cross-hatching pattern for hills & shadow plates */}
        <pattern
          id="charcoal-hatch"
          width="10"
          height="10"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(-28)"
        >
          <path
            d="M 0 2 L 10 2 M 0 6.5 L 10 6.5"
            stroke="#111110"
            strokeWidth="1.25"
            strokeOpacity="0.65"
          />
          <path
            d="M 0 9 L 10 8.2"
            stroke="#111110"
            strokeWidth="0.6"
            strokeOpacity="0.35"
          />
        </pattern>

        <pattern
          id="charcoal-crosshatch"
          width="12"
          height="12"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M -2 10 L 10 -2 M 2 14 L 14 2"
            stroke="#111110"
            strokeWidth="0.9"
            strokeOpacity="0.48"
          />
          <path
            d="M -2 2 L 10 14 M 2 -2 L 14 10"
            stroke="#111110"
            strokeWidth="0.7"
            strokeOpacity="0.3"
          />
        </pattern>
      </defs>
    </svg>
  );
}
