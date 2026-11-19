/**
 * ============================================================================
 * PORTFOLIO DATA & CONFIGURATION
 * ============================================================================
 * Edit this single file to personalize the portfolio with your own bio,
 * contact details, and experiential production case studies.
 *
 * Spatial Layout:
 * The infinite 360° canvas wraps seamlessly across WORLD_WIDTH x WORLD_HEIGHT.
 * The Hero Twin-Flower Landmark sits at (0, 0). Each project is positioned
 * relative to (0, 0) using (x, y) coordinates inside [-WORLD_WIDTH/2, WORLD_WIDTH/2].
 */

export const WORLD_WIDTH = 2900;
export const WORLD_HEIGHT = 2300;

export type FlowerStyle = 'solid-4' | 'solid-5' | 'sketch-outline-4' | 'twin-solid';

export type ArtworkVariant =
  | 'conservatory'
  | 'monolith-stage'
  | 'water-pavilion'
  | 'subterranean-choir'
  | 'helios-drift'
  | 'paper-smoke'
  | 'glass-foundry'
  | 'afterimage-archive';

export interface ProjectCredit {
  role: string;
  name: string;
}

export interface PortfolioProject {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  category: string;
  client: string;
  venue: string;
  location: string;
  year: string;
  role: string;
  scale: string;
  duration: string;
  /** Position on the seamless 360° toroidal field (origin is 0, 0). */
  x: number;
  y: number;
  /** Compass bearing label for field telemetry & editorial cues. */
  bearingLabel: string;
  /** Hand-drawn black-work floral marker style inspired by the reference ink drawings. */
  flowerStyle: FlowerStyle;
  /** Bespoke monochrome architectural/experiential plate drawn via SVG. */
  artwork: ArtworkVariant;
  /** Short poetic margin note written in zine hand near the station. */
  marginNote: string;
  /** Concise teaser shown on the spatial field card. */
  excerpt: string;
  /** Full editorial narrative paragraphs shown inside the case study overlay. */
  narrative: string[];
  /** Concrete experiential production highlights. */
  highlights: string[];
  /** Spatial / technical systems deployed on site. */
  systems: string[];
  /** Production credits list. */
  credits: ProjectCredit[];
}

export interface FieldAnnotation {
  id: string;
  x: number;
  y: number;
  text: string;
  subtext?: string;
  rotation: number;
  style: 'zine' | 'survey' | 'poem';
}

export interface DecorativeBloom {
  id: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  variant: 'solid-4' | 'solid-5' | 'sketch-outline-4';
  stemHeight: number;
  hasHill?: boolean;
}

export interface ProducerProfile {
  name: string;
  monogram: string;
  title: string;
  location: string;
  availability: string;
  heroPoemLines: [string, string, string];
  heroSubtitle: string;
  bioLead: string;
  bioParagraphs: string[];
  disciplines: string[];
  selectedClients: string[];
  recognition: { year: string; title: string; detail: string }[];
  contact: {
    email: string;
    instagram: string;
    instagramUrl: string;
    linkedin: string;
    linkedinUrl: string;
    representation: string;
  };
}

export const PRODUCER_PROFILE: ProducerProfile = {
  name: 'Camille Vance',
  monogram: 'CV',
  title: 'Experiential Producer · Spatial & Live Environments',
  location: 'New York / Los Angeles / Touring Worldwide',
  availability: 'Booking Q3–Q4 2026 Commissions & Touring Productions',
  heroPoemLines: ['TWO WORLDS', 'AND THEY GREW', 'TOGETHER'],
  heroSubtitle: 'Staging architecture, light, sound, and human ritual across physical space.',
  bioLead:
    'Camille Vance is an independent experiential producer building tactile architectural environments, kinetic festival stages, and sensory brand worlds where technical rigor meets raw handmade emotion.',
  bioParagraphs: [
    'Working between live performance, spatial design, and large-scale cultural commissioning, Camille leads multidisciplinary productions from first charcoal sketch and feasibility study through structural engineering, timecoded show control, and opening-night cue calling.',
    'Her practice treats every venue—whether a 19th-century armory, a desert floor at dusk, or an intimate botanical glasshouse—as a living instrument tuned to crowd choreography, light decay, acoustic resonance, and memory.',
    'Over the past decade she has delivered forty-plus temporary architectures, touring stage systems, and site-specific public installations across North America, Europe, and Japan.'
  ],
  disciplines: [
    'Executive Experiential Production',
    'Spatial Architecture & Scenic Fabrication',
    'Kinetic Lighting & Timecode Show Direction',
    'Multi-Channel Spatial Audio & Soundscapes',
    'Site Permitting, Crowd Flow & Technical Direction',
    'Sensory Brand Worlds & Cultural Commissioning'
  ],
  selectedClients: [
    'Park Avenue Armory',
    'Brooklyn Botanic Garden',
    'Sónar Festival',
    'Maison Margiela',
    'Desert X',
    'Byredo',
    'Barbican Centre',
    'MoMA PS1',
    'Boiler Room',
    'A24 Live'
  ],
  recognition: [
    {
      year: '2026',
      title: 'Frame Awards — Exhibition of the Year (Shortlist)',
      detail: 'Nocturne Conservatory · Architectural Projection & Sound'
    },
    {
      year: '2025',
      title: 'D&AD Graphite Pencil — Spatial Design',
      detail: 'Still Water Pavilion · Paris Fashion Week'
    },
    {
      year: '2025',
      title: 'Fast Company Innovation by Design — Honoree',
      detail: 'Monolith Stage IV · Kinetic Festival Architecture'
    },
    {
      year: '2024',
      title: 'Architizer A+Awards — Pop-Ups & Temporary',
      detail: 'Helios Drift · Coachella Valley Light Commission'
    }
  ],
  contact: {
    email: 'studio@camillevance.work',
    instagram: '@camillevance.studio',
    instagramUrl: 'https://instagram.com',
    linkedin: 'linkedin.com/in/camillevance',
    linkedinUrl: 'https://linkedin.com',
    representation: 'Direct Inquiries & Agency Partnerships · NYC / LA'
  }
};

export const PROJECTS: PortfolioProject[] = [
  {
    id: 'nocturne-conservatory',
    index: '01',
    title: 'Nocturne Conservatory',
    subtitle: 'After-Hours Botanical Projection & Spatial Soundscape',
    category: 'Spatial Light & Sound Installation',
    client: 'Brooklyn Botanic Garden × Lumina Arts',
    venue: 'Steinhardt Conservatory & Palm House',
    location: 'Brooklyn, NY',
    year: '2026',
    role: 'Executive Experiential Producer',
    scale: '48,000 Visitors · 18,000 sq ft Glasshouse',
    duration: '8-Week Winter Run · 420 Guests / Hour',
    x: 690,
    y: -520,
    bearingLabel: '053° NE',
    flowerStyle: 'solid-4',
    artwork: 'conservatory',
    marginNote: 'bloom after dark',
    excerpt:
      'Transforming a Victorian glasshouse into a living ink-and-light nocturnal biome choreographed with 32-channel botanical acoustics.',
    narrative: [
      'Commissioned to reimagine winter after-hours programming inside Brooklyn’s historic glasshouses, Nocturne Conservatory turned living tropical canopies into a shifting monochrome projection canvas. Rather than overwhelming the flora with saturated RGB washes, we composed custom silver-white beam arrays and hand-drawn botanical projection plates that cast giant shadow-petals across the wrought-iron dome.',
      'Guests entered through a fog-cooled threshold tunnel where sub-bass field recordings—captured from root vibrations and greenhouse rain—gave way to a choreographed 45-minute loop of rising mist, slow-panning follow-spots, and acoustic choral swells.',
      'Working closely with horticultural conservationists, every fixture was calibrated to zero-UV photobiological safety limits and rigged with non-invasive clamps across historic cast-iron trusses.'
    ],
    highlights: [
      'Zero-impact rigging engineered around 110-year-old conservatory ironwork and rare tropical specimens',
      'Custom 14-projector edge-blended dome mapping paired with real-time humidity-reactive haze',
      'Timed-entry crowd choreography maintaining quiet acoustic intimacy at 420 guests per hour',
      '98.4% sell-through across 56 winter evenings with zero weather cancellations'
    ],
    systems: [
      '14× 20K Laser Projectors (Disguise vx4)',
      '32-Channel d&b Soundscape Spatial Array',
      'Custom Ultrasonic Botanical Mist Curtain',
      'DMX Automated Ellipsoidal Follow-Spots'
    ],
    credits: [
      { role: 'Experiential Producer', name: 'Camille Vance' },
      { role: 'Spatial Lighting Design', name: 'Studio Kōen' },
      { role: 'Sound Composition', name: 'Hana Lindqvist' },
      { role: 'Technical Direction', name: 'Marcus Delacroix' }
    ]
  },
  {
    id: 'monolith-stage-iv',
    index: '02',
    title: 'Monolith Stage IV',
    subtitle: 'Kinetic Brutalist Festival Mainstage & Timecode Rig',
    category: 'Kinetic Festival Architecture',
    client: 'Sónar Commission · SonarLab',
    venue: 'Fira Gran Via Hall 3',
    location: 'Barcelona, Spain',
    year: '2025',
    role: 'Lead Stage Producer',
    scale: '22,000 Nightly Capacity · 28m Kinetic Span',
    duration: '3 Festival Nights · 19 Touring Artists',
    x: 1120,
    y: 40,
    bearingLabel: '088° E',
    flowerStyle: 'sketch-outline-4',
    artwork: 'monolith-stage',
    marginNote: 'steel breathes in time',
    excerpt:
      'Five counterweighted 14-meter blackened steel light blades hovering above 22,000 dancers in millimeter-synced kinetic motion.',
    narrative: [
      'Monolith Stage IV abandoned the flat LED wall in favor of sculptural weight and negative space. Five articulated, charcoal-anodized aluminum monoliths suspended from 30 high-speed CyberHoist winches reshaped the stage horizon live between every set—descending into an intimate low ceiling for ambient openers before cracking apart into a 28-meter cathedral of stark white beams at 3 AM.',
      'As Lead Stage Producer, Camille coordinated European structural certification, 14-day pre-visualization in Depence, custom artist timecode handoffs, and a 64-person international rigging and automation crew on an unforgiving 36-hour load-in.'
    ],
    highlights: [
      '30-axis SIL3-rated overhead kinetic automation running live over 36 continuous performance hours',
      'Bespoke perforated acoustic scrims hiding linear strobe blades for razor-sharp beam geometry',
      'Modular artist-ready lighting macro package enabling 19 touring LDs to take live control in 10 minutes',
      'Delivered 4 hours ahead of production schedule and 6% under international freight budget'
    ],
    systems: [
      '30× CyberHoist II Kinetic Winches',
      '148× Linear White Strobe & Beam Fixtures',
      'GrandMA3 Redundant Fiber Show Network',
      'Custom Blackened Steel Scenic Truss Blades'
    ],
    credits: [
      { role: 'Lead Stage Producer', name: 'Camille Vance' },
      { role: 'Scenic & Kinetic Architecture', name: 'Atelier Nord' },
      { role: 'Automation Lead', name: 'Jordi Puig' },
      { role: 'Show Control & LX', name: 'Sora Takahashi' }
    ]
  },
  {
    id: 'still-water-pavilion',
    index: '03',
    title: 'Still Water Pavilion',
    subtitle: 'Black-Mirror Pool Runway & Tactile Brand World',
    category: 'Immersive Brand World',
    client: 'Maison Margiela · Paris Fashion Week',
    venue: 'Ancien Entrepôt Industriel, 19e',
    location: 'Paris, France',
    year: '2025',
    role: 'Executive Producer · Spatial & Show',
    scale: '1,400 Invited Guests · 60m Reflective Basin',
    duration: 'Runway Show + 4-Day Private Salon',
    x: 780,
    y: 610,
    bearingLabel: '128° SE',
    flowerStyle: 'solid-5',
    artwork: 'water-pavilion',
    marginNote: 'walk on dark ink',
    excerpt:
      'A 60-meter black-dyed shallow mirror pool turning a raw Parisian warehouse into an inverted architectural ink drawing.',
    narrative: [
      'For an Autumn/Winter presentation built around silhouette, raw stitchwork, and charcoal pigment, we flooded a decommissioned Paris freight depot with 18 millimeters of mineral-dyed black water contained inside a precision-leveled micro-cement basin. Models walked an invisible submerged glass catwalk, producing crisp concentric ripples under overhead theatrical follow-spots.',
      'Following the 18-minute runway presentation, the space transformed overnight into a four-day appointment salon where custom archival tables floated like charcoal plinths above the dark water.'
    ],
    highlights: [
      'Laser-leveled 60m × 18m watertight basin engineered to ±1.5mm tolerance across uneven heritage concrete',
      'Acoustic water-damping channels preventing pump hum during live string quartet performance',
      'Overhead manual follow-spot bridge manned by four theatrical operators tracking each silhouette',
      '100% closed-loop filtered water reclamation and modular reusable scenic steel'
    ],
    systems: [
      'Submerged Tempered-Glass Runway Deck',
      '4× Manual Robert Juliat Follow-Spots',
      'Closed-Loop Silent Water Filtration',
      'Custom Raw Linen & Charcoal Plinth Architecture'
    ],
    credits: [
      { role: 'Executive Producer', name: 'Camille Vance' },
      { role: 'Set Design', name: 'Bureau Ligne' },
      { role: 'Technical Producer (Paris)', name: 'Claire Beaumont' },
      { role: 'Live Musical Direction', name: 'Quatuor Blanc' }
    ]
  },
  {
    id: 'subterranean-choir',
    index: '04',
    title: 'Subterranean Choir',
    subtitle: '64-Channel Spatial Audio & Candlelight Listening Ritual',
    category: 'Acoustic & Sensory Performance',
    client: 'Park Avenue Armory',
    venue: 'Wade Thompson Drill Hall',
    location: 'New York, NY',
    year: '2025',
    role: 'Senior Producer',
    scale: '14-Night Run · 900 Listeners per Evening',
    duration: '90-Minute Continuous Spatial Work',
    x: 40,
    y: 830,
    bearingLabel: '177° S',
    flowerStyle: 'twin-solid',
    artwork: 'subterranean-choir',
    marginNote: 'dont go just yet',
    excerpt:
      'Nine hundred listeners seated in concentric floor rings around 24 vocalists, 64 directional speakers, and a single descending halo of tungsten light.',
    narrative: [
      'Conceived as an antidote to screen-saturated live entertainment, Subterranean Choir stripped the 55,000-square-foot Drill Hall down to raw acoustic physics and darkness. Audiences surrendered phones at the foyer and walked by candlelight into concentric wool-felt floor circles.',
      'Over ninety uninterrupted minutes, 24 live vocalists drifted through the aisles while a 64-channel overhead speaker dome spun harmonies in slow 360-degree orbits—guided by a single 12-meter hand-patinated black steel oculus lowering slowly toward the floor.'
    ],
    highlights: [
      'Custom acoustic drapery array taming the Armory’s 6-second natural reverb down to an articulated 2.4s tail',
      'FDNY-approved theatrical open-flame perimeter choreography with 480 hand-dipped beeswax tapers',
      'Zero-click silent winch descent of a 1.8-ton black steel lighting halo over live audience seating',
      'Featured in The New York Times & Wallpaper* Best Live Experiences of the Year'
    ],
    systems: [
      '64-Channel Meyer Sound Spacemap Go',
      '12m Suspended Blackened-Steel Tungsten Oculus',
      '480 Hand-Dipped Beeswax Taper Stations',
      'Custom Wool-Felt Acoustic Seating Rings'
    ],
    credits: [
      { role: 'Senior Producer', name: 'Camille Vance' },
      { role: 'Composer & Director', name: 'Maren Solberg' },
      { role: 'Acoustic Engineering', name: 'Arup Acoustics' },
      { role: 'Lighting Design', name: 'Devon Sato' }
    ]
  },
  {
    id: 'helios-drift',
    index: '05',
    title: 'Helios Drift',
    subtitle: 'Autonomous Desert Light Sculpture & Dusk Gathering',
    category: 'Architectural Land Art & Live Event',
    client: 'Desert X · Special Commission',
    venue: 'Coachella Valley Wash',
    location: 'Palm Springs, CA',
    year: '2024',
    role: 'Field & Experiential Producer',
    scale: '36,000 Visitors · 4-Acre Open Desert Site',
    duration: '9-Week Exhibition + 3 Solstice Nights',
    x: -740,
    y: 620,
    bearingLabel: '230° SW',
    flowerStyle: 'solid-4',
    artwork: 'helios-drift',
    marginNote: 'shadow holds the heat',
    excerpt:
      'Twelve charred-cedar wind monoliths casting shifting ink-black sundials by day and synchronized horizon searchlights after sunset.',
    narrative: [
      'Planted directly into an arid alluvial fan outside Palm Springs, Helios Drift bridged land art and live nocturnal theater. By day, twelve 9-meter shou sugi ban charred-cedar towers stood like rough charcoal brush strokes against white desert sand, casting razor-sharp geometric shadows that visitors moved through on foot.',
      'As desert temperatures dropped at dusk, solar-charged battery banks awakened narrow-beam xenon beacons embedded in each tower crown—sweeping slowly across the desert floor in response to live anemometer wind telemetry.'
    ],
    highlights: [
      '100% off-grid solar microgrid powering nightly 4-hour atmospheric beam sequences for 63 consecutive nights',
      'Engineered for 75mph desert sandstorm gusts with removable helical earth anchors leaving zero site scar',
      'Produced three intimate 600-person sunset acoustic gatherings with full remote hospitality and egress',
      'Featured across Architizer, Dezeen, and Los Angeles Times Arts'
    ],
    systems: [
      '12× 9m Shou Sugi Ban Charred-Cedar Towers',
      'Off-Grid 180kWh Solar Battery Microgrid',
      'Wind-Telemetry Generative Beam Control',
      'Leave-No-Trace Helical Pier Foundations'
    ],
    credits: [
      { role: 'Field & Experiential Producer', name: 'Camille Vance' },
      { role: 'Lead Artist', name: 'Tomasz Zieliński' },
      { role: 'Structural Engineering', name: 'Canyon Structurals' },
      { role: 'Solar & Power Systems', name: 'SolGrid Live' }
    ]
  },
  {
    id: 'paper-smoke-atelier',
    index: '06',
    title: 'Paper & Smoke Atelier',
    subtitle: 'Intimate Sensory Pop-Up & Olfactory Architecture',
    category: 'Tactile Sensory Pop-Up',
    client: 'Byredo · Global Touring Edition',
    venue: 'SoHo Cast-Iron Loft / Tokyo / London / Milan',
    location: '4-City Global Tour',
    year: '2024',
    role: 'Touring Experiential Producer',
    scale: '18,500 Guests · 4 International Cities',
    duration: '10 Days per City · Flat-Pack Touring Kit',
    x: -1100,
    y: -20,
    bearingLabel: '271° W',
    flowerStyle: 'sketch-outline-4',
    artwork: 'paper-smoke',
    marginNote: 'ink on raw cotton',
    excerpt:
      'A flat-pack labyrinth of raw cotton rag-paper walls, warm ceramic incense chimneys, and micro-climate scent chambers touring four capitals.',
    narrative: [
      'Designed around the physical craft of scent composition and zine printing, Paper & Smoke Atelier rejected glossy retail fixtures for raw, tactile materiality. Visitors walked through four sequential sensory rooms separated by floor-to-ceiling heavyweight handmade paper curtains screen-printed with oversized charcoal florals.',
      'Each chamber isolated a single olfactory note via silent laminar airflow columns, culminating in a live risograph studio where guests hand-pulled a numbered botanical memory print infused with the fragrance.'
    ],
    highlights: [
      'Engineered a single sea-freight touring kit assembling in 48 hours across radically different storefronts',
      'Bespoke micro-climate laminar scent diffusers preventing olfactory cross-contamination between rooms',
      'Live on-site two-drum risograph print station producing 18,500 numbered takeaway editions',
      'Average guest dwell time of 34 minutes—3.2× brand retail benchmark'
    ],
    systems: [
      'Modular Tensioned Cotton Rag-Paper Architecture',
      '4-Zone Laminar Olfactory Diffusion Columns',
      'Live Dual-Drum Risograph Print Press',
      'Warm 2700K Pin-Spot Theatrical Track Rig'
    ],
    credits: [
      { role: 'Touring Experiential Producer', name: 'Camille Vance' },
      { role: 'Spatial Concept', name: 'Studio Sable' },
      { role: 'Print & Typography', name: 'Press Collective NYC' },
      { role: 'Fabrication', name: 'Form & Matter' }
    ]
  },
  {
    id: 'the-glass-foundry',
    index: '07',
    title: 'The Glass Foundry',
    subtitle: 'Industrial Warehouse Takeover & Live A/V Opera',
    category: 'Architectural Projection & Live A/V',
    client: 'Boiler Room × Barbican Centre',
    venue: 'Silvertown Quays Turbine Hall',
    location: 'London, UK',
    year: '2024',
    role: 'Executive Producer',
    scale: '6,200 Attendees · 360° In-The-Round Floor',
    duration: '2 Consecutive Nights + Global Livestream',
    x: -740,
    y: -590,
    bearingLabel: '309° NW',
    flowerStyle: 'solid-5',
    artwork: 'glass-foundry',
    marginNote: 'four walls dissolve',
    excerpt:
      'A 360-degree in-the-round warehouse opera merging live orchestral brass, brutalist monochrome camera feeds, and overhead laser grids.',
    narrative: [
      'Commissioned to unite club culture and contemporary architectural performance, The Glass Foundry placed musicians and performers inside a transparent scaffolding tower at the dead center of an East London turbine hall, encircled 360 degrees by 3,100 guests per night.',
      'Four roaming 16mm-grain monochrome camera operators projected live high-contrast ink-like closeups onto 18-meter raw concrete walls while overhead mist curtains caught razor-thin architectural light planes.'
    ],
    highlights: [
      'Seamless dual-production workflow serving both 3,100 in-person guests and a 1.4M live global broadcast',
      'Zero-barrier 360° crowd circulation with integrated wheelchair-accessible elevated viewing bridges',
      'Custom real-time TouchDesigner monochrome charcoal shader processing live camera feeds at 12ms latency',
      'Full East London council licensing, acoustic boundary compliance, and zero-incident crowd safety record'
    ],
    systems: [
      'Center-Stage 360° Translucent Scaffold Tower',
      'Real-Time Monochrome Charcoal Camera Pipeline',
      '4-Wall 30K Projection Mapping System',
      'L-Acoustics K2 360° Distributed Sound Rig'
    ],
    credits: [
      { role: 'Executive Producer', name: 'Camille Vance' },
      { role: 'Creative & Visual Direction', name: 'Ollie Mercer-Grant' },
      { role: 'Broadcast Director', name: 'Nadia Al-Mansoor' },
      { role: 'Production Management', name: 'Thames Live Ops' }
    ]
  },
  {
    id: 'afterimage-archive',
    index: '08',
    title: 'Afterimage Archive',
    subtitle: 'Interactive Courtyard Shadow-Play Monograph',
    category: 'Public Interactive Exhibition',
    client: 'MoMA PS1 · Summer Courtyard Series',
    venue: 'PS1 Concrete Courtyard',
    location: 'Long Island City, NY',
    year: '2023',
    role: 'Experiential & Fabrication Producer',
    scale: '62,000 Summer Visitors · Open-Air Pavilion',
    duration: '12-Week Public Exhibition',
    x: -40,
    y: -780,
    bearingLabel: '357° N',
    flowerStyle: 'solid-4',
    artwork: 'afterimage-archive',
    marginNote: 'hold the light still',
    excerpt:
      'A monumental perforated-steel botanical canopy casting evolving charcoal shadow drawings across the courtyard pavement from noon to midnight.',
    narrative: [
      'Built for MoMA PS1’s iconic concrete courtyard, Afterimage Archive used nothing more than blackened laser-cut steel canopies, solar elevation, and visitor movement to turn daylight into a constantly shifting black-work ink garden.',
      'At sunset, ground-recessed theatrical uplights flipped the geometry—projecting giant floral silhouettes upward onto the surrounding brick schoolhouse facade as live DJs and poets performed beneath the canopy.'
    ],
    highlights: [
      'Engineered 22-ton freestanding blackened-steel lattice requiring zero courtyard concrete penetrations',
      'Dual daytime solar-shadow choreography and nighttime architectural uplight inversion',
      'Hosted 14 Saturday Warm-Up sessions and 6 sunset literary salons over a 12-week summer run',
      '100% of steel canopy panels later relocated to a permanent Queens community garden amphitheater'
    ],
    systems: [
      'Laser-Cut Blackened Weathering-Steel Canopy',
      'Recessed IP67 Theatrical Architectural Uplights',
      'Zero-Penetration Ballasted Timber Plinths',
      'Integrated Courtyard Mist & Shade Cooling'
    ],
    credits: [
      { role: 'Experiential Producer', name: 'Camille Vance' },
      { role: 'Architectural Design', name: 'Kuroda + Vane' },
      { role: 'Metal Fabrication', name: 'Red Hook Ironworks' },
      { role: 'Curatorial Liaison', name: 'Elena Morales' }
    ]
  }
];

/**
 * Hand-scrawled zine margin notes & surveyor field marks scattered across
 * the 360-degree torus so the entire infinite world feels hand-inked.
 */
export const FIELD_ANNOTATIONS: FieldAnnotation[] = [
  {
    id: 'note-dont-go',
    x: -360,
    y: 320,
    text: 'DONT GO JUST YET',
    subtext: 'sector 225° · sketchbook margin',
    rotation: -6,
    style: 'zine'
  },
  {
    id: 'note-grew',
    x: 420,
    y: -250,
    text: 'AND THEY GREW TOGETHER',
    subtext: 'stem corridor · north-east',
    rotation: 4,
    style: 'poem'
  },
  {
    id: 'note-follow',
    x: 480,
    y: 350,
    text: 'FOLLOW THE BEAM →',
    subtext: 'ellipsoidal cue 04',
    rotation: -3,
    style: 'survey'
  },
  {
    id: 'note-loop',
    x: -440,
    y: -310,
    text: 'NO EDGES · ONLY ORBIT',
    subtext: '360° boundless field',
    rotation: 5,
    style: 'survey'
  },
  {
    id: 'note-silence',
    x: 1180,
    y: -490,
    text: 'HOLD THE SILENCE BEFORE THE CUE',
    subtext: 'backstage note · 02:14',
    rotation: -4,
    style: 'zine'
  },
  {
    id: 'note-roots',
    x: -1160,
    y: 440,
    text: 'DEEP ROOTS UNDER HEAVY STEEL',
    subtext: 'field study iv',
    rotation: 7,
    style: 'poem'
  },
  {
    id: 'note-seam',
    x: 1410,
    y: 960,
    text: 'THE FIELD WRAPS FOREVER',
    subtext: 'torus meridian · 180°',
    rotation: -2,
    style: 'survey'
  },
  {
    id: 'note-petal',
    x: -390,
    y: -1020,
    text: 'CHARCOAL ON RAG PAPER',
    subtext: 'archive plate · 00',
    rotation: 3,
    style: 'zine'
  }
];

/**
 * Large sculptural botanical landmarks scattered between project stations
 * so panning in any direction glides past lush hand-inked charcoal flowers.
 */
export const DECORATIVE_BLOOMS: DecorativeBloom[] = [
  { id: 'bloom-a', x: 350, y: -620, scale: 0.95, rotation: -8, variant: 'sketch-outline-4', stemHeight: 150 },
  { id: 'bloom-b', x: 960, y: -300, scale: 1.15, rotation: 11, variant: 'solid-4', stemHeight: 170, hasHill: true },
  { id: 'bloom-c', x: 430, y: 540, scale: 0.9, rotation: -14, variant: 'solid-5', stemHeight: 135 },
  { id: 'bloom-d', x: -410, y: 690, scale: 1.2, rotation: 6, variant: 'sketch-outline-4', stemHeight: 175 },
  { id: 'bloom-e', x: -980, y: 310, scale: 1.05, rotation: -12, variant: 'solid-4', stemHeight: 160, hasHill: true },
  { id: 'bloom-f', x: -430, y: -520, scale: 0.92, rotation: 15, variant: 'solid-5', stemHeight: 140 },
  { id: 'bloom-g', x: 1320, y: 520, scale: 1.1, rotation: -5, variant: 'sketch-outline-4', stemHeight: 165 },
  { id: 'bloom-h', x: -1350, y: -540, scale: 1.0, rotation: 9, variant: 'solid-4', stemHeight: 150 },
  { id: 'bloom-i', x: 480, y: -1020, scale: 1.05, rotation: -9, variant: 'solid-5', stemHeight: 145 },
  { id: 'bloom-j', x: -420, y: 1050, scale: 0.95, rotation: 12, variant: 'solid-4', stemHeight: 155 }
];
