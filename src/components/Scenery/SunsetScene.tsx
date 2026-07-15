import "../styles/SunsetScene.css";

const FLOODLIGHT_X = [80, 550, 1050, 1520];
const FLOODLIGHT_TOP = [210, 260, 260, 210];
const FLOODLIGHT_BASE_Y = 640;

const STRIPE_COUNT = 10;
const PITCH_TOP = 668;
const PITCH_BOTTOM = 900;
const PITCH_WIDTH = 1600;

function buildRoofPath() {
  const teeth = 22;
  const segmentWidth = PITCH_WIDTH / teeth;
  let d = `M0,600`;
  for (let i = 0; i <= teeth; i++) {
    const x = i * segmentWidth;
    const y = i % 2 === 0 ? 592 : 612;
    d += ` L${x.toFixed(1)},${y}`;
  }
  d += ` L${PITCH_WIDTH},645 L0,645 Z`;
  return d;
}

function buildStripes() {
  const stripes = [];
  const bandHeight = (PITCH_BOTTOM - PITCH_TOP) / STRIPE_COUNT;
  for (let i = 0; i < STRIPE_COUNT; i++) {
    const y = PITCH_TOP + i * bandHeight;
    stripes.push({
      key: i,
      y,
      height: bandHeight + 1,
      fill: i % 2 === 0 ? "#2f6b38" : "#275c30",
    });
  }
  return stripes;
}

const ROOF_PATH = buildRoofPath();
const STRIPES = buildStripes();

type PoseName = "run" | "runMirror" | "celebrate" | "goalie" | "ref";

const PLAYER_POSES: Record<
  PoseName,
  { armL: string; armR: string; legL: string; legR: string }
> = {
  run: {
    armL: "rotate(35 9 20)",
    armR: "rotate(-55 31 18)",
    legL: "rotate(24 14 40)",
    legR: "rotate(-34 26 38)",
  },
  runMirror: {
    armL: "rotate(-35 9 20)",
    armR: "rotate(55 31 18)",
    legL: "rotate(-24 14 40)",
    legR: "rotate(34 26 38)",
  },
  celebrate: {
    armL: "rotate(-160 9 22)",
    armR: "rotate(160 31 22)",
    legL: "rotate(6 14 40)",
    legR: "rotate(-6 26 40)",
  },
  goalie: {
    armL: "rotate(-95 9 20)",
    armR: "rotate(95 31 20)",
    legL: "rotate(16 14 40)",
    legR: "rotate(-16 26 40)",
  },
  ref: {
    armL: "rotate(8 9 20)",
    armR: "rotate(-140 31 18)",
    legL: "rotate(8 14 40)",
    legR: "rotate(-8 26 40)",
  },
};

interface PlayerProps {
  x: number;
  y: number;
  scale?: number;
  jersey: string;
  shorts?: string;
  skin?: string;
  pose: PoseName;
  number?: string;
  runnerClassName?: string;
}

function Player({
  x,
  y,
  scale = 1,
  jersey,
  shorts = "#f2f0ea",
  skin = "#e3ad83",
  pose,
  number,
  runnerClassName,
}: PlayerProps) {
  const p = PLAYER_POSES[pose];
  return (
    <g transform={`translate(${x - 20 * scale}, ${y - 64 * scale}) scale(${scale})`}>
      <g className={runnerClassName}>
        <ellipse cx="20" cy="63" rx="12" ry="3.5" fill="rgba(6,3,10,0.3)" />
        <rect x="6" y="18" width="7" height="20" rx="3" fill={jersey} transform={p.armL} />
        <rect x="27" y="18" width="7" height="20" rx="3" fill={jersey} transform={p.armR} />
        <rect x="11" y="38" width="8" height="24" rx="3" fill={shorts} transform={p.legL} />
        <rect x="21" y="38" width="8" height="24" rx="3" fill={shorts} transform={p.legR} />
        <rect x="12" y="17" width="16" height="23" rx="6" fill={jersey} />
        <circle cx="20" cy="9" r="7" fill={skin} />
        {number && (
          <text
            x="20"
            y="30"
            fontSize="9"
            fontWeight="700"
            fill="rgba(255,255,255,0.85)"
            textAnchor="middle"
          >
            {number}
          </text>
        )}
      </g>
    </g>
  );
}

const GOAL_WIDTH = 230;
const GOAL_TOP = 675;
const GOAL_BOTTOM = 752;

function buildGoal(xStart: number) {
  const width = GOAL_WIDTH;
  const verticals = 8;
  let net = "";
  for (let i = 0; i <= verticals; i++) {
    const vx = xStart + 8 + (i * (width - 16)) / verticals;
    net += ` M${vx.toFixed(1)},${GOAL_TOP} L${vx.toFixed(1)},${GOAL_BOTTOM}`;
  }
  const step = (GOAL_BOTTOM - GOAL_TOP) / 4;
  let netH = "";
  for (let i = 1; i <= 3; i++) {
    const vy = GOAL_TOP + step * i;
    netH += ` M${xStart + 8},${vy} L${xStart + width - 8},${vy}`;
  }
  return {
    net: net + netH,
    xStart,
    width,
  };
}

function Goal({ x }: { x: number }) {
  const g = buildGoal(x);
  return (
    <g className="sunset-goal">
      <rect x={x + 8} y={GOAL_TOP} width={g.width - 16} height={GOAL_BOTTOM - GOAL_TOP} className="sunset-goal-net" />
      <path d={g.net} />
      <rect x={x} y={GOAL_TOP - 4} width="8" height={GOAL_BOTTOM - GOAL_TOP + 8} fill="#f4f2f6" />
      <rect x={x + g.width - 8} y={GOAL_TOP - 4} width="8" height={GOAL_BOTTOM - GOAL_TOP + 8} fill="#f4f2f6" />
      <rect x={x} y={GOAL_TOP - 4} width={g.width} height="8" fill="#f4f2f6" />
    </g>
  );
}

const SunsetScene = () => {
  return (
    <div className="sunset-scene" aria-hidden="true">
      <svg
        className="sunset-scene-svg"
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMax slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0a0416" />
            <stop offset="20%" stopColor="#221030" />
            <stop offset="38%" stopColor="#552655" />
            <stop offset="54%" stopColor="#8a3a68" />
            <stop offset="68%" stopColor="#d1527a" />
            <stop offset="82%" stopColor="#ff7d5c" />
            <stop offset="94%" stopColor="#ffb347" />
            <stop offset="100%" stopColor="#ffd27a" />
          </linearGradient>
          <radialGradient id="sunHalo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255, 226, 170, 0.85)" />
            <stop offset="55%" stopColor="rgba(255, 157, 92, 0.32)" />
            <stop offset="100%" stopColor="rgba(255, 157, 92, 0)" />
          </radialGradient>
          <radialGradient id="sunCore" cx="42%" cy="38%" r="60%">
            <stop offset="0%" stopColor="#fff6e0" />
            <stop offset="55%" stopColor="#ffd27a" />
            <stop offset="100%" stopColor="#ff9d5c" />
          </radialGradient>
          <linearGradient id="cloudGradFar" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255, 214, 170, 0.5)" />
            <stop offset="100%" stopColor="rgba(107, 56, 104, 0.28)" />
          </linearGradient>
          <linearGradient id="cloudGradNear" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255, 232, 196, 0.78)" />
            <stop offset="100%" stopColor="rgba(226, 85, 122, 0.4)" />
          </linearGradient>
          <linearGradient id="pitchGlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255, 157, 92, 0.28)" />
            <stop offset="45%" stopColor="rgba(255, 157, 92, 0.06)" />
            <stop offset="100%" stopColor="rgba(255, 157, 92, 0)" />
          </linearGradient>
          <radialGradient id="floodGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255, 244, 214, 0.9)" />
            <stop offset="100%" stopColor="rgba(255, 244, 214, 0)" />
          </radialGradient>
          <radialGradient id="messiSpot" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255, 221, 130, 0.55)" />
            <stop offset="100%" stopColor="rgba(255, 221, 130, 0)" />
          </radialGradient>
          <pattern
            id="crowdPattern"
            width="16"
            height="9"
            patternUnits="userSpaceOnUse"
          >
            <rect width="16" height="9" fill="#1c0d20" />
            <rect x="1" y="2" width="4" height="4" rx="1" fill="#3a1f3a" opacity="0.8" />
            <rect x="8" y="1" width="4" height="4" rx="1" fill="#341c34" opacity="0.7" />
            <rect x="12" y="4" width="3" height="3" rx="1" fill="#3a1f3a" opacity="0.6" />
          </pattern>
          <symbol id="cloudShape" viewBox="0 0 240 90">
            <ellipse cx="30" cy="62" rx="40" ry="20" />
            <ellipse cx="60" cy="55" rx="60" ry="26" />
            <ellipse cx="120" cy="40" rx="55" ry="30" />
            <ellipse cx="175" cy="58" rx="50" ry="24" />
          </symbol>
          <filter id="softBlurSmall" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
          <filter id="softBlurLarge" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>

        <rect x="0" y="0" width="1600" height="900" fill="url(#skyGrad)" />

        <g className="sunset-sun">
          <circle
            className="sunset-sun-halo"
            cx="1180"
            cy="540"
            r="240"
            fill="url(#sunHalo)"
          />
          <circle
            className="sunset-sun-core"
            cx="1180"
            cy="540"
            r="92"
            fill="url(#sunCore)"
          />
        </g>

        <g className="sunset-birds">
          <g transform="translate(260,300)">
            <path className="sunset-bird sunset-bird-1" d="M0,0 L11,-7 L22,0 L33,-7 L44,0" />
          </g>
          <g transform="translate(980,240)">
            <path className="sunset-bird sunset-bird-2" d="M0,0 L9,-6 L18,0 L27,-6 L36,0" />
          </g>
          <g transform="translate(1220,340)">
            <path className="sunset-bird sunset-bird-3" d="M0,0 L8,-5 L16,0 L24,-5 L32,0" />
          </g>
        </g>

        <g
          className="sunset-cloud-layer sunset-cloud-far"
          filter="url(#softBlurSmall)"
        >
          <use href="#cloudShape" x="60" y="130" width="260" height="95" fill="url(#cloudGradFar)" opacity="0.55" />
          <use href="#cloudShape" x="480" y="90" width="200" height="75" fill="url(#cloudGradFar)" opacity="0.4" />
          <use href="#cloudShape" x="860" y="150" width="300" height="110" fill="url(#cloudGradFar)" opacity="0.5" />
          <use href="#cloudShape" x="1280" y="100" width="220" height="80" fill="url(#cloudGradFar)" opacity="0.42" />
          <use href="#cloudShape" x="1660" y="130" width="260" height="95" fill="url(#cloudGradFar)" opacity="0.55" />
          <use href="#cloudShape" x="2080" y="90" width="200" height="75" fill="url(#cloudGradFar)" opacity="0.4" />
          <use href="#cloudShape" x="2460" y="150" width="300" height="110" fill="url(#cloudGradFar)" opacity="0.5" />
          <use href="#cloudShape" x="2880" y="100" width="220" height="80" fill="url(#cloudGradFar)" opacity="0.42" />
        </g>

        <g className="sunset-cloud-layer sunset-cloud-near">
          <use href="#cloudShape" x="180" y="320" width="230" height="86" fill="url(#cloudGradNear)" opacity="0.6" />
          <use href="#cloudShape" x="700" y="360" width="270" height="100" fill="url(#cloudGradNear)" opacity="0.5" />
          <use href="#cloudShape" x="1220" y="300" width="210" height="78" fill="url(#cloudGradNear)" opacity="0.55" />
          <use href="#cloudShape" x="1780" y="320" width="230" height="86" fill="url(#cloudGradNear)" opacity="0.6" />
          <use href="#cloudShape" x="2300" y="360" width="270" height="100" fill="url(#cloudGradNear)" opacity="0.5" />
          <use href="#cloudShape" x="2820" y="300" width="210" height="78" fill="url(#cloudGradNear)" opacity="0.55" />
        </g>

        {/* stadium roof + stand */}
        <path className="sunset-roof" d={ROOF_PATH} />
        <rect
          className="sunset-crowd"
          x="0"
          y="645"
          width="1600"
          height="35"
          fill="url(#crowdPattern)"
        />

        {/* floodlight towers */}
        <g className="sunset-floodlights">
          {FLOODLIGHT_X.map((x, i) => (
            <g key={x}>
              <circle
                className="sunset-flood-glow"
                cx={x}
                cy={FLOODLIGHT_TOP[i]}
                r="70"
                fill="url(#floodGlow)"
                filter="url(#softBlurLarge)"
              />
              <line
                x1={x}
                y1={FLOODLIGHT_BASE_Y}
                x2={x}
                y2={FLOODLIGHT_TOP[i] + 14}
                stroke="#180a1c"
                strokeWidth="6"
              />
              <rect
                x={x - 26}
                y={FLOODLIGHT_TOP[i] - 10}
                width="52"
                height="24"
                rx="3"
                fill="#180a1c"
              />
              <circle className="sunset-flood-bulb" cx={x - 15} cy={FLOODLIGHT_TOP[i] + 2} r="4" />
              <circle className="sunset-flood-bulb" cx={x} cy={FLOODLIGHT_TOP[i] + 2} r="4" />
              <circle className="sunset-flood-bulb" cx={x + 15} cy={FLOODLIGHT_TOP[i] + 2} r="4" />
            </g>
          ))}
        </g>

        {/* pitch */}
        <g className="sunset-pitch">
          {STRIPES.map((s) => (
            <rect key={s.key} x="0" y={s.y} width={PITCH_WIDTH} height={s.height} fill={s.fill} />
          ))}
          <rect x="0" y={PITCH_TOP} width={PITCH_WIDTH} height={PITCH_BOTTOM - PITCH_TOP} fill="url(#pitchGlow)" />

          <line x1="0" y1={PITCH_TOP} x2={PITCH_WIDTH} y2={PITCH_TOP} className="sunset-pitch-line" />
          <line x1="0" y1="784" x2={PITCH_WIDTH} y2="784" className="sunset-pitch-line" />
          <ellipse cx="800" cy="784" rx="170" ry="32" className="sunset-pitch-line-fill" />
          <circle cx="800" cy="784" r="4" fill="rgba(255,255,255,0.85)" />

          {/* single goal, at the end where the match action is */}
          <Goal x={1150} />

          {/* keeper */}
          <Player x={1265} y={760} scale={1.15} jersey="#e0c23e" shorts="#181018" pose="goalie" runnerClassName="sunset-shuffle-right" />

          {/* the action: Messi and a teammate one-touch passing, marked by a defender */}
          <circle
            className="sunset-messi-spot"
            cx="1300"
            cy="778"
            r="70"
            fill="url(#messiSpot)"
            filter="url(#softBlurLarge)"
          />
          <Player
            x={1230}
            y={800}
            scale={1.6}
            jersey="#7cc1f2"
            shorts="#181018"
            pose="run"
            number="10"
            runnerClassName="sunset-messi sunset-pass-a"
          />
          <Player
            x={1330}
            y={808}
            scale={1.35}
            jersey="#d64545"
            shorts="#181018"
            pose="runMirror"
            runnerClassName="sunset-jockey"
          />
          <Player
            x={1510}
            y={800}
            scale={1.4}
            jersey="#5aa9e6"
            shorts="#f2f0ea"
            pose="runMirror"
            number="7"
            runnerClassName="sunset-pass-b"
          />

          {/* the ball, passed back and forth between the two teammates */}
          <g transform="translate(1370,793)">
            <g className="sunset-pass-ball">
              <ellipse cx="0" cy="20" rx="14" ry="4" fill="rgba(6,3,10,0.3)" />
              <circle r="13" fill="#f4f1e9" />
              <path d="M0,-13 L4,-4 L12,-1 L8,7 L-8,7 L-12,-1 L-4,-4 Z" fill="#17181c" />
            </g>
          </g>

          {/* referee following the play */}
          <Player x={1555} y={755} scale={1.15} jersey="#141018" shorts="#141018" pose="ref" runnerClassName="sunset-jog-right" />
        </g>
      </svg>
    </div>
  );
};

export default SunsetScene;
