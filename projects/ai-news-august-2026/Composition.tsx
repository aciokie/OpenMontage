import React from "react";
import {
  AbsoluteFill,
  Audio,
  CalculateMetadataFunction,
  Easing,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export interface NarrationTrack {
  id: string;
  src: string;
  startSeconds: number;
  durationSeconds: number;
}

export interface CaptionPage {
  id: string;
  text: string;
  startSeconds: number;
  endSeconds: number;
}

export interface SceneProps extends Record<string, unknown> {
  fps?: number;
  totalSeconds?: number;
  narration?: NarrationTrack[];
  captions?: CaptionPage[];
  musicSrc?: string;
  musicEnabled?: boolean;
}

type BeatProps = {duration: number};

const C = {
  ink: "#071015",
  paper: "#E8F2EE",
  access: "#30E6C8",
  stakes: "#FFB84D",
  warning: "#FF5D57",
  mute: "#9EB0AC",
};

const fontHeading = 'Arial Black, Arial Narrow, Arial, sans-serif';
const fontBody = 'Arial, Helvetica, sans-serif';
const fontMono = 'Courier New, monospace';

const clamp = (value: number, input: [number, number], output: [number, number]) =>
  interpolate(value, input, output, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

const settle = (frame: number, fps: number, delay = 0) =>
  spring({
    frame: frame - delay,
    fps,
    config: {damping: 22, stiffness: 105, mass: 0.9},
  });

const Photo: React.FC<{
  src: string;
  duration: number;
  fit?: "cover" | "contain";
  position?: string;
  zoom?: number;
  filter?: string;
}> = ({src, duration, fit = "cover", position = "center", zoom = 0.06, filter}) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, duration], [1.02, 1.02 + zoom], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <Img
      src={staticFile(src)}
      style={{
        width: "100%",
        height: "100%",
        objectFit: fit,
        objectPosition: position,
        transform: `scale(${scale})`,
        filter,
      }}
    />
  );
};

const Grain: React.FC = () => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      opacity: 0.07,
      mixBlendMode: "soft-light",
      backgroundImage:
        "repeating-radial-gradient(circle at 17% 29%, rgba(255,255,255,.8) 0 0.7px, transparent 0.8px 4px)",
      backgroundSize: "9px 11px",
    }}
  />
);

const Registration: React.FC<{light?: boolean}> = ({light = true}) => {
  const color = light ? C.paper : C.ink;
  return (
    <>
      {[
        [54, 54],
        [1866, 54],
        [54, 1026],
        [1866, 1026],
      ].map(([x, y], i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: x - 12,
            top: y - 12,
            width: 24,
            height: 24,
            opacity: 0.55,
            borderTop: i > 1 ? "none" : `2px solid ${color}`,
            borderBottom: i > 1 ? `2px solid ${color}` : "none",
            borderLeft: i % 2 === 0 ? `2px solid ${color}` : "none",
            borderRight: i % 2 === 1 ? `2px solid ${color}` : "none",
          }}
        />
      ))}
    </>
  );
};

const SourceSlug: React.FC<{children: React.ReactNode; dark?: boolean}> = ({children, dark = true}) => (
  <div
    style={{
      position: "absolute",
      top: 62,
      left: 96,
      padding: "10px 15px 9px",
      background: dark ? "rgba(7,16,21,.82)" : C.paper,
      color: dark ? C.paper : C.ink,
      fontFamily: fontMono,
      fontSize: 20,
      lineHeight: 1,
      letterSpacing: 1.2,
      textTransform: "uppercase",
      borderLeft: `6px solid ${C.access}`,
      zIndex: 30,
    }}
  >
    {children}
  </div>
);

const BeatShell: React.FC<{duration: number; children: React.ReactNode; lightMarks?: boolean}> = ({
  duration,
  children,
  lightMarks = true,
}) => {
  const frame = useCurrentFrame();
  const opacity = Math.min(
    interpolate(frame, [0, 8], [0, 1], {extrapolateRight: "clamp"}),
    interpolate(frame, [duration - 7, duration], [1, 0], {extrapolateLeft: "clamp"}),
  );
  return (
    <AbsoluteFill style={{background: C.ink, opacity, overflow: "hidden"}}>
      {children}
      <Grain />
      <Registration light={lightMarks} />
    </AbsoluteFill>
  );
};

const Hook: React.FC<BeatProps> = ({duration}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const reveal = clamp(frame, [5, 45], [0, 1]);
  const title = settle(frame, fps, 28);
  const scanX = clamp(frame, [0, 52], [-120, 2020]);
  return (
    <BeatShell duration={duration}>
      <AbsoluteFill>
        <Photo
          src="images/city-sean-pollock-PhYq704ffdA.jpg"
          duration={duration}
          zoom={0.09}
          position="center 44%"
          filter="saturate(.55) contrast(1.18) brightness(.66)"
        />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(90deg, rgba(7,16,21,.94) 0%, rgba(7,16,21,.72) 48%, rgba(7,16,21,.2) 78%, rgba(7,16,21,.7) 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          width: 150,
          left: scanX,
          background: "linear-gradient(90deg, transparent, rgba(232,242,238,.15), transparent)",
          transform: "skewX(-8deg)",
        }}
      />
      <SourceSlug>AI NEWS DISPATCH · 14 AUG 2026</SourceSlug>
      <div style={{position: "absolute", left: 96, top: 236, width: 1050, color: C.paper}}>
        <div
          style={{
            fontFamily: fontMono,
            fontSize: 23,
            letterSpacing: 4,
            color: C.access,
            opacity: reveal,
            marginBottom: 18,
          }}
        >
          ONE WEEK / TWO DIRECTIONS
        </div>
        <div
          style={{
            fontFamily: fontHeading,
            fontSize: 110,
            lineHeight: 0.88,
            letterSpacing: -5,
            transform: `translateY(${(1 - title) * 52}px)`,
            opacity: title,
          }}
        >
          AI GETS
          <br />
          <span style={{color: C.access}}>CHEAPER.</span>
        </div>
        <div
          style={{
            fontFamily: fontHeading,
            fontSize: 78,
            lineHeight: 0.92,
            marginTop: 26,
            color: C.stakes,
            transform: `translateX(${(1 - title) * 90}px)`,
            opacity: title,
          }}
        >
          STAKES GET BIGGER.
        </div>
      </div>
      <svg width="1920" height="1080" style={{position: "absolute", inset: 0}}>
        <path
          d="M 108 870 L 640 870 L 875 870 L 1180 690 L 1830 690"
          fill="none"
          stroke={C.access}
          strokeWidth="8"
          strokeLinecap="square"
          pathLength="1"
          strokeDasharray="1"
          strokeDashoffset={1 - reveal}
        />
        <path
          d="M 108 870 L 640 870 L 875 870 L 1180 930 L 1830 930"
          fill="none"
          stroke={C.stakes}
          strokeWidth="8"
          strokeLinecap="square"
          pathLength="1"
          strokeDasharray="1"
          strokeDashoffset={1 - reveal}
        />
      </svg>
      <div style={{position: "absolute", right: 98, top: 674, color: C.access, font: `22px ${fontMono}`}}>
        ACCESS ↗
      </div>
      <div style={{position: "absolute", right: 98, top: 914, color: C.stakes, font: `22px ${fontMono}`}}>
        CONSEQUENCE ↗
      </div>
    </BeatShell>
  );
};

const OpenAIBeat: React.FC<BeatProps> = ({duration}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const open = settle(frame, fps, 8);
  const numberIn = settle(frame, fps, 25);
  return (
    <BeatShell duration={duration} lightMarks={false}>
      <AbsoluteFill style={{background: C.paper}} />
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 1030,
          height: 1080,
          overflow: "hidden",
          clipPath: `inset(0 ${100 - open * 100}% 0 0)`,
        }}
      >
        <Photo src="images/edge-device-lilly-rum-15YTRXKuJ14.jpg" duration={duration} position="52% center" zoom={0.07} />
        <AbsoluteFill style={{background: "linear-gradient(0deg, rgba(7,16,21,.78), transparent 58%)"}} />
        <div style={{position: "absolute", left: 92, bottom: 158, color: C.paper, width: 720}}>
          <div style={{font: `700 30px ${fontMono}`, color: C.access, marginBottom: 14}}>CHATGPT GO</div>
          <div style={{font: `84px/0.95 ${fontHeading}`, letterSpacing: -3}}>$20 / MONTH</div>
          <div style={{font: `28px/1.25 ${fontBody}`, marginTop: 16}}>GPT-5.6 Thinking included.</div>
        </div>
      </div>
      <SourceSlug dark={false}>SOURCE · OPENAI · 06 AUG 2026</SourceSlug>
      <div style={{position: "absolute", left: 1110, top: 215, right: 88, color: C.ink}}>
        <div style={{font: `23px ${fontMono}`, letterSpacing: 3, marginBottom: 18}}>MODEL RELEASE</div>
        <div
          style={{
            font: `190px/.78 ${fontHeading}`,
            letterSpacing: -13,
            color: C.ink,
            opacity: numberIn,
            transform: `translateX(${(1 - numberIn) * 80}px)`,
          }}
        >
          5.6
        </div>
        <div style={{width: 570, height: 12, background: C.access, margin: "42px 0 24px", transformOrigin: "left", transform: `scaleX(${numberIn})`}} />
        <div style={{font: `56px/.98 ${fontHeading}`, letterSpacing: -2}}>BETTER REASONING.</div>
        <div style={{font: `56px/.98 ${fontHeading}`, letterSpacing: -2, color: "#46625C", marginTop: 8}}>LOWER ENTRY.</div>
        <div style={{font: `24px/1.35 ${fontBody}`, marginTop: 36, width: 560}}>
          OpenAI says ChatGPT now serves more than one billion weekly users.
        </div>
      </div>
      <div style={{position: "absolute", right: 82, bottom: 94, font: `18px ${fontMono}`, color: "#46625C"}}>
        ACCESS SIGNAL / 01
      </div>
    </BeatShell>
  );
};

const CapitalBeat: React.FC<BeatProps> = ({duration}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const amount = settle(frame, fps, 16);
  const bands = ["APOLLO", "BLACKROCK", "BLACKSTONE", "BROOKFIELD", "GOLDMAN SACHS", "KKR"];
  return (
    <BeatShell duration={duration}>
      <AbsoluteFill>
        <Photo
          src="images/city-sean-pollock-PhYq704ffdA.jpg"
          duration={duration}
          position="center 44%"
          zoom={0.1}
          filter="saturate(.52) contrast(1.22) brightness(.62)"
        />
      </AbsoluteFill>
      <AbsoluteFill style={{background: "linear-gradient(90deg, rgba(7,16,21,.97) 0 44%, rgba(7,16,21,.38) 72%, rgba(7,16,21,.78))"}} />
      <SourceSlug>SOURCE · NVIDIA NEWSROOM · 12 AUG 2026</SourceSlug>
      <div style={{position: "absolute", left: 96, top: 225, color: C.paper, zIndex: 3}}>
        <div style={{font: `26px ${fontMono}`, color: C.stakes, letterSpacing: 3}}>NON-BINDING FINANCING MOUs</div>
        <div
          style={{
            font: `168px/.82 ${fontHeading}`,
            letterSpacing: -11,
            marginTop: 38,
            transform: `translateY(${(1 - amount) * 46}px)`,
            opacity: amount,
          }}
        >
          $500B+
        </div>
        <div style={{font: `52px/1 ${fontHeading}`, width: 720, marginTop: 34}}>THE INFRASTRUCTURE BET</div>
        <div style={{font: `26px/1.38 ${fontBody}`, width: 650, marginTop: 24, color: "#C8D6D2"}}>
          Third-party capital aimed at chips, data centers, and energy.
        </div>
      </div>
      <div style={{position: "absolute", right: 90, top: 190, width: 660}}>
        {bands.map((label, i) => {
          const p = settle(frame, fps, 30 + i * 8);
          return (
            <div
              key={label}
              style={{
                height: 98,
                marginBottom: 11,
                padding: "0 28px",
                background: i === bands.length - 1 ? C.stakes : "rgba(232,242,238,.90)",
                color: C.ink,
                font: `700 23px/98px ${fontMono}`,
                letterSpacing: 1.4,
                transform: `translateX(${(1 - p) * (110 + i * 18)}px)`,
                opacity: p,
              }}
            >
              {String(i + 1).padStart(2, "0")} / {label}
            </div>
          );
        })}
      </div>
      <div style={{position: "absolute", right: 95, bottom: 94, color: C.stakes, font: `19px ${fontMono}`}}>SCALE SIGNAL / 06</div>
    </BeatShell>
  );
};

const RegulationBeat: React.FC<BeatProps> = ({duration}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const stamps = [
    ["DISCLOSE", -2],
    ["LABEL", 2],
    ["MACHINE-MARK", -1],
  ] as const;
  return (
    <BeatShell duration={duration} lightMarks={false}>
      <AbsoluteFill style={{background: C.paper}} />
      <div style={{position: "absolute", right: 0, top: 0, width: 760, height: 1080, overflow: "hidden"}}>
        <Photo src="images/eu-flag-dmitrii-e-9IijGDLb1D4.jpg" duration={duration} position="51% 43%" zoom={0.05} filter="saturate(.78) contrast(1.08)" />
        <AbsoluteFill style={{background: "linear-gradient(90deg, rgba(232,242,238,1), transparent 18%, rgba(7,16,21,.08))"}} />
      </div>
      <SourceSlug dark={false}>SOURCE · EUROPEAN COMMISSION · 02 AUG 2026</SourceSlug>
      <div style={{position: "absolute", left: 96, top: 206, width: 1020, color: C.ink}}>
        <div style={{font: `25px ${fontMono}`, letterSpacing: 3, color: "#3D5550"}}>AI ACT / ENFORCEMENT DATE</div>
        <div style={{font: `106px/.86 ${fontHeading}`, letterSpacing: -6, margin: "28px 0 34px"}}>RULES MOVE<br />ONTO THE SCREEN.</div>
        {stamps.map(([label, angle], i) => {
          const p = settle(frame, fps, 28 + i * 11);
          return (
            <div
              key={label}
              style={{
                display: "inline-block",
                border: `5px solid ${i === 2 ? C.stakes : C.ink}`,
                color: i === 2 ? "#A95A00" : C.ink,
                font: `700 30px ${fontMono}`,
                padding: "14px 20px 11px",
                margin: "0 15px 18px 0",
                transform: `scale(${0.75 + p * 0.25}) rotate(${angle}deg)`,
                opacity: p,
              }}
            >
              {label}
            </div>
          );
        })}
        <div style={{font: `25px/1.4 ${fontBody}`, width: 800, marginTop: 22}}>
          Providers must disclose AI interactions and mark synthetic media in machine-readable form.
        </div>
      </div>
      <div style={{position: "absolute", left: 98, bottom: 82, width: 940, height: 5, background: C.ink}} />
      <div style={{position: "absolute", left: 98, bottom: 96, font: `19px ${fontMono}`, color: "#3D5550"}}>OVERSIGHT SIGNAL / 07</div>
    </BeatShell>
  );
};

const LocalModelBeat: React.FC<BeatProps> = ({duration}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = settle(frame, fps, 8);
  const cloudExit = clamp(frame, [20, 95], [0, 1]);
  return (
    <BeatShell duration={duration}>
      <AbsoluteFill style={{background: "#0B181D"}} />
      <div style={{position: "absolute", left: 72, top: 128, width: 1125, height: 760, overflow: "hidden", border: `3px solid ${C.paper}`}}>
        <Photo src="images/edge-device-lilly-rum-15YTRXKuJ14.jpg" duration={duration} position="56% center" zoom={0.055} filter="saturate(.66) brightness(.68) contrast(1.18)" />
        <AbsoluteFill style={{background: "linear-gradient(90deg, rgba(7,16,21,.18), transparent 55%, rgba(7,16,21,.48))"}} />
        <div style={{position: "absolute", right: 34 + cloudExit * 160, top: 35, opacity: 1 - cloudExit * 0.82, font: `22px ${fontMono}`, color: C.paper, border: `2px dashed ${C.paper}`, borderRadius: 70, padding: "24px 30px"}}>CLOUD</div>
      </div>
      <SourceSlug>SOURCE · CNBC · 10 AUG 2026</SourceSlug>
      <div style={{position: "absolute", right: 72, top: 128, width: 585, height: 760, background: C.paper, color: C.ink, padding: "52px 46px"}}>
        <div style={{display: "flex", alignItems: "center", gap: 12, font: `20px ${fontMono}`, color: "#37534C"}}>
          <span style={{width: 14, height: 14, borderRadius: 14, background: C.access, boxShadow: `0 0 0 7px rgba(48,230,200,.18)`}} /> ON-DEVICE ROUTE
        </div>
        <div style={{font: `61px/.91 ${fontHeading}`, letterSpacing: -3, marginTop: 52, transform: `translateX(${(1 - p) * 55}px)`, opacity: p}}>
          MUSE<br />GLIMMER.<br /><span style={{color: "#2B8173"}}>RUNS ON<br />LAPTOPS.</span>
        </div>
        <div style={{marginTop: 44, borderTop: `3px solid ${C.ink}`, paddingTop: 23, font: `20px/1.55 ${fontMono}`}}>
          LOWER COST<br />FASTER RESPONSE<br />MORE PRIVATE PROCESSING
        </div>
      </div>
      <div style={{position: "absolute", left: 94, bottom: 94, color: C.access, font: `19px ${fontMono}`}}>EDGE SIGNAL / 03</div>
    </BeatShell>
  );
};

const OpenWeightsBeat: React.FC<BeatProps> = ({duration}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = settle(frame, fps, 7);
  return (
    <BeatShell duration={duration}>
      <AbsoluteFill style={{background: "#0A171C"}} />
      <div style={{position: "absolute", left: 72, top: 128, width: 1080, height: 760, overflow: "hidden", border: `3px solid ${C.paper}`}}>
        <Photo src="images/code-laptop-daniil-komov-QkYZsgJt9Rg.jpg" duration={duration} position="center 58%" zoom={0.05} filter="saturate(.7) brightness(.68) contrast(1.2)" />
        <AbsoluteFill style={{background: "linear-gradient(0deg, rgba(7,16,21,.5), transparent 55%)"}} />
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{position: "absolute", left: 55 + i * 180, bottom: 45 + (i % 2) * 42, width: 150, height: 36, background: i === 3 ? C.access : C.paper, color: C.ink, font: `16px/36px ${fontMono}`, textAlign: "center", transform: `translateY(${(1 - p) * 90}px)`, opacity: p}}>
            WEIGHT {String(i + 1).padStart(2, "0")}
          </div>
        ))}
      </div>
      <SourceSlug>SOURCE · CNBC · 10 AUG 2026</SourceSlug>
      <div style={{position: "absolute", right: 72, top: 128, width: 645, height: 760, background: C.paper, color: C.ink, padding: "52px 48px"}}>
        <div style={{font: `20px ${fontMono}`, color: "#37534C"}}>OPEN-WEIGHT RELEASE</div>
        <div style={{font: `66px/.9 ${fontHeading}`, letterSpacing: -3, marginTop: 46, transform: `translateX(${(1 - p) * 50}px)`, opacity: p}}>
          MUSE<br />SPARK 1.2<br /><span style={{color: "#2B8173"}}>WEIGHTS<br />UNLOCKED.</span>
        </div>
        <div style={{marginTop: 40, borderTop: `3px solid ${C.ink}`, paddingTop: 24, font: `23px/1.38 ${fontBody}`}}>
          Developers get access to the model’s learned parameters.
        </div>
      </div>
      <div style={{position: "absolute", left: 94, bottom: 94, color: C.access, font: `19px ${fontMono}`}}>OPEN-WEIGHT SIGNAL / 04</div>
    </BeatShell>
  );
};

const ComputeBridge: React.FC<BeatProps> = ({duration}) => {
  const frame = useCurrentFrame();
  const iris = clamp(frame, [0, 42], [42, 0]);
  const line = clamp(frame, [15, 80], [0, 1]);
  return (
    <BeatShell duration={duration}>
      <AbsoluteFill style={{background: C.ink}} />
      <div style={{position: "absolute", inset: 0, overflow: "hidden", clipPath: `inset(0 ${iris}% 0 ${iris}%)`}}>
        <Photo src="images/server-technician-panumas-19226354.jpg" duration={duration} position="58% center" zoom={0.09} filter="saturate(.42) brightness(.46) contrast(1.35)" />
      </div>
      <AbsoluteFill style={{background: "linear-gradient(90deg, rgba(7,16,21,.8), rgba(7,16,21,.15), rgba(7,16,21,.75))"}} />
      <div style={{position: "absolute", left: 95, top: 76, color: C.stakes, font: `21px ${fontMono}`, letterSpacing: 3}}>BRIDGE / FROM EDGE TO INFRASTRUCTURE</div>
      <div style={{position: "absolute", left: 260, right: 260, top: 330, color: C.paper, textAlign: "center"}}>
        <div style={{font: `88px/.92 ${fontHeading}`, letterSpacing: -4}}>THE COMPUTE RACE<br /><span style={{color: C.stakes}}>BECOMES PHYSICAL.</span></div>
        <div style={{height: 9, background: C.stakes, marginTop: 48, transformOrigin: "center", transform: `scaleX(${line})`}} />
      </div>
    </BeatShell>
  );
};

const RiskBeat: React.FC<BeatProps> = ({duration}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const route = clamp(frame, [20, 120], [0, 1]);
  const denied = settle(frame, fps, 145);
  const nodes = [
    {x: 260, label: "BOOK", state: "REQUEST"},
    {x: 650, label: "READ", state: "SITE"},
    {x: 1040, label: "BYPASS", state: "CONTROL"},
    {x: 1430, label: "ADMIN", state: "ACCESS"},
  ];
  return (
    <BeatShell duration={duration}>
      <AbsoluteFill>
        <Photo src="images/gym-app-thisisengineering-3912952.jpg" duration={duration} position="47% center" zoom={0.09} filter="saturate(.45) contrast(1.25) brightness(.48)" />
      </AbsoluteFill>
      <AbsoluteFill style={{background: "linear-gradient(0deg, rgba(7,16,21,.98) 0 32%, rgba(7,16,21,.46) 78%, rgba(7,16,21,.82))"}} />
      <SourceSlug>SOURCE · ABC NEWS AUSTRALIA · 10 AUG 2026</SourceSlug>
      <div style={{position: "absolute", left: 96, top: 185, color: C.paper, width: 930}}>
        <div style={{font: `28px ${fontMono}`, color: C.warning, letterSpacing: 3}}>AUTONOMOUS AGENT INCIDENT</div>
        <div style={{font: `90px/.9 ${fontHeading}`, letterSpacing: -4, marginTop: 26}}>A BOOKING TASK<br />BECAME A BREACH.</div>
      </div>
      <div
        style={{
          position: "absolute",
          right: 110,
          top: 210,
          width: 470,
          padding: "28px 30px",
          background: denied > 0.1 ? C.warning : C.access,
          color: C.ink,
          transform: `rotate(${(1 - denied) * -3}deg) scale(${0.92 + denied * 0.08})`,
          opacity: Math.max(0.2, denied),
        }}
      >
        <div style={{font: `20px ${fontMono}`}}>END STATE</div>
        <div style={{font: `52px/.95 ${fontHeading}`, marginTop: 10}}>ADMIN<br />ACCESS</div>
      </div>
      <div style={{position: "absolute", left: 100, right: 100, bottom: 260, height: 230}}>
        <svg width="1720" height="230" style={{position: "absolute", inset: 0}}>
          <line x1="160" y1="100" x2="1330" y2="100" stroke="rgba(232,242,238,.28)" strokeWidth="9" />
          <line
            x1="160"
            y1="100"
            x2={160 + 1170 * route}
            y2="100"
            stroke={route < 0.66 ? C.access : C.warning}
            strokeWidth="9"
          />
        </svg>
        {nodes.map((node, i) => {
          const x = node.x - 100;
          const active = route >= i / (nodes.length - 1) - 0.03;
          const failed = i >= 2 && route > 0.62;
          return (
            <div key={node.label} style={{position: "absolute", left: x, top: 58, width: 200, textAlign: "center", transform: "translateX(-50%)"}}>
              <div style={{margin: "0 auto", width: 78, height: 78, borderRadius: 50, background: active ? (failed ? C.warning : C.access) : "#33444A", border: `8px solid ${C.ink}`, boxShadow: `0 0 0 3px ${active ? C.paper : "#617079"}`}} />
              <div style={{font: `700 23px ${fontMono}`, color: C.paper, marginTop: 15}}>{node.label}</div>
              <div style={{font: `16px ${fontMono}`, color: failed ? C.warning : C.mute, marginTop: 6}}>{node.state}</div>
            </div>
          );
        })}
      </div>
      <div style={{position: "absolute", left: 96, bottom: 96, font: `22px/1.35 ${fontBody}`, color: "#C5D1CE", width: 1450}}>
        Goal achievement outran the boundary the system was supposed to respect.
      </div>
    </BeatShell>
  );
};

const SynthesisBeat: React.FC<BeatProps> = ({duration}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const columns = [
    {src: "images/city-sean-pollock-PhYq704ffdA.jpg", label: "ACCESS", note: "MORE USERS", w: 520, pos: "center"},
    {src: "images/server-technician-panumas-19226354.jpg", label: "SCALE", note: "MORE CAPITAL", w: 760, pos: "55% center"},
    {src: "images/code-laptop-daniil-komov-QkYZsgJt9Rg.jpg", label: "OVERSIGHT", note: "MORE CONTROL", w: 640, pos: "center"},
  ];
  let left = 0;
  return (
    <BeatShell duration={duration}>
      {columns.map((column, i) => {
        const x = left;
        left += column.w;
        const p = settle(frame, fps, i * 10 + 5);
        return (
          <div key={column.label} style={{position: "absolute", left: x, top: 0, width: column.w, height: 1080, overflow: "hidden", transform: `translateY(${(1 - p) * (i % 2 === 0 ? 80 : -80)}px)`, opacity: p}}>
            <Photo src={column.src} duration={duration} position={column.pos} zoom={0.055 + i * 0.015} filter="saturate(.52) contrast(1.18) brightness(.58)" />
            <AbsoluteFill style={{background: i === 1 ? "rgba(255,184,77,.12)" : "rgba(7,16,21,.26)"}} />
            <div style={{position: "absolute", left: 40, right: 40, bottom: 145, color: C.paper}}>
              <div style={{font: `54px/.92 ${fontHeading}`, letterSpacing: -2}}>{column.label}</div>
              <div style={{font: `19px ${fontMono}`, marginTop: 16, color: i === 1 ? C.stakes : C.access}}>{column.note}</div>
            </div>
          </div>
        );
      })}
      <div style={{position: "absolute", left: 80, top: 78, right: 80, display: "flex", justifyContent: "space-between", color: C.paper, font: `20px ${fontMono}`, letterSpacing: 2}}>
        <span>SYNTHESIS / FIVE REPORTS</span><span>01 + 02 + 03 + 04 + 05</span>
      </div>
      <div style={{position: "absolute", left: 350, right: 350, top: 360, padding: "42px 55px", background: "rgba(7,16,21,.88)", color: C.paper, textAlign: "center", borderTop: `9px solid ${C.stakes}`}}>
        <div style={{font: `86px/.9 ${fontHeading}`, letterSpacing: -4}}>THE SHIFT IS<br />STRUCTURAL.</div>
        <div style={{font: `24px ${fontMono}`, marginTop: 28, color: C.mute}}>CAPABILITY OUTWARD · CONSEQUENCE UPWARD</div>
      </div>
    </BeatShell>
  );
};

const BalanceBeat: React.FC<BeatProps> = ({duration}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const axis = settle(frame, fps, 16);
  return (
    <BeatShell duration={duration} lightMarks={false}>
      <AbsoluteFill style={{background: C.paper}} />
      <div style={{position: "absolute", left: 0, top: 0, width: 610, height: 1080, overflow: "hidden", clipPath: "polygon(0 0, 100% 0, 83% 100%, 0 100%)"}}>
        <Photo src="images/edge-device-lilly-rum-15YTRXKuJ14.jpg" duration={duration} position="58% center" zoom={0.07} filter="saturate(.65) contrast(1.1)" />
        <AbsoluteFill style={{background: "rgba(48,230,200,.16)"}} />
      </div>
      <div style={{position: "absolute", right: 0, top: 0, width: 610, height: 1080, overflow: "hidden", clipPath: "polygon(17% 0, 100% 0, 100% 100%, 0 100%)"}}>
        <Photo src="images/server-technician-panumas-19226354.jpg" duration={duration} position="58% center" zoom={0.08} filter="saturate(.58) contrast(1.16)" />
        <AbsoluteFill style={{background: "rgba(255,184,77,.16)"}} />
      </div>
      <div style={{position: "absolute", top: 0, bottom: 0, left: 500, right: 500, background: "linear-gradient(90deg, rgba(232,242,238,.6), #E8F2EE 22% 78%, rgba(232,242,238,.6))"}} />
      <SourceSlug dark={false}>EDITORIAL SYNTHESIS · VERIFIED SOURCES</SourceSlug>
      <div style={{position: "absolute", left: 560, right: 560, top: 205, textAlign: "center", color: C.ink}}>
        <div style={{font: `25px ${fontMono}`, letterSpacing: 4}}>THE TAKEAWAY</div>
        <div style={{font: `78px/.9 ${fontHeading}`, letterSpacing: -4, marginTop: 28}}>ACCESS IS<br />EXPANDING.</div>
        <div style={{font: `62px/.92 ${fontHeading}`, letterSpacing: -3, color: "#A95A00", marginTop: 20}}>RESPONSIBILITY<br />MUST KEEP UP.</div>
      </div>
      <div style={{position: "absolute", left: 235, right: 235, bottom: 205, height: 175}}>
        <div style={{position: "absolute", left: 0, right: 0, top: 80, height: 9, background: C.ink, transformOrigin: "center", transform: `scaleX(${axis})`}} />
        <div style={{position: "absolute", left: "50%", top: 23, width: 16, height: 125, background: C.ink, transform: "translateX(-50%)"}} />
        <div style={{position: "absolute", left: 0, top: 25, font: `700 26px ${fontMono}`, color: "#176C60"}}>EDGE / ACCESS</div>
        <div style={{position: "absolute", right: 0, top: 25, font: `700 26px ${fontMono}`, color: "#A95A00"}}>SCALE / CONTROL</div>
        <div style={{position: "absolute", left: 0, top: 80, width: "48%", height: 9, background: C.access, transformOrigin: "right", transform: `scaleX(${axis})`}} />
        <div style={{position: "absolute", right: 0, top: 80, width: "48%", height: 9, background: C.stakes, transformOrigin: "left", transform: `scaleX(${axis})`}} />
      </div>
    </BeatShell>
  );
};

const ClosingBeat: React.FC<BeatProps> = ({duration}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = settle(frame, fps, 10);
  const line = clamp(frame, [8, 80], [0, 1]);
  return (
    <BeatShell duration={duration}>
      <AbsoluteFill style={{background: C.ink}} />
      <div style={{position: "absolute", left: 96, top: 76, color: C.mute, font: `20px ${fontMono}`, letterSpacing: 3}}>AI NEWS / THE QUESTION AFTER THE HEADLINES</div>
      <div style={{position: "absolute", left: 195, right: 195, top: 210, textAlign: "center", color: C.paper, opacity: p, transform: `translateY(${(1 - p) * 38}px)`}}>
        <div style={{font: `82px/.94 ${fontHeading}`, letterSpacing: -4}}>AI IS GETTING<br /><span style={{color: C.access}}>CHEAPER TO REACH.</span></div>
        <div style={{font: `40px/1.1 ${fontBody}`, marginTop: 28, color: "#BCCAC6"}}>Its consequences are getting bigger.</div>
      </div>
      <div style={{position: "absolute", left: 430, right: 430, top: 590, display: "flex", gap: 12}}>
        {["CAPITAL", "RULES", "CONSEQUENCES"].map((label, i) => {
          const block = settle(frame, fps, 24 + i * 8);
          return <div key={label} style={{flex: 1, padding: "18px 10px 16px", textAlign: "center", background: i === 2 ? C.stakes : "rgba(232,242,238,.1)", color: i === 2 ? C.ink : C.paper, border: `2px solid ${i === 2 ? C.stakes : "rgba(232,242,238,.45)"}`, font: `700 20px ${fontMono}`, transform: `translateY(${(1 - block) * 30}px)`, opacity: block}}>{label}</div>;
        })}
      </div>
      <svg width="1920" height="1080" style={{position: "absolute", inset: 0}}>
        <path d="M 120 850 L 700 850 L 930 785 L 1800 785" fill="none" stroke={C.access} strokeWidth="8" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - line} />
        <path d="M 120 850 L 700 850 L 930 915 L 1800 915" fill="none" stroke={C.stakes} strokeWidth="8" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - line} />
      </svg>
      <div style={{position: "absolute", left: 120, bottom: 72, color: C.paper, font: `22px ${fontMono}`}}>OPENMONTAGE / 100 SECOND BRIEFING</div>
      <div style={{position: "absolute", right: 120, bottom: 72, color: C.stakes, font: `22px ${fontMono}`}}>END / 100.0</div>
    </BeatShell>
  );
};

const CaptionRail: React.FC<{pages: CaptionPage[]}> = ({pages}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const now = frame / fps;
  const page = pages.find((entry) => now >= entry.startSeconds && now < entry.endSeconds);
  if (!page) return null;
  const edge = Math.min(now - page.startSeconds, page.endSeconds - now);
  const opacity = clamp(edge, [0, 0.12], [0, 1]);
  return (
    <div
      style={{
        position: "absolute",
        left: 330,
        right: 330,
        bottom: 34,
        zIndex: 100,
        display: "flex",
        justifyContent: "center",
        opacity,
      }}
    >
      <div
        style={{
          maxWidth: 1260,
          padding: "12px 22px 13px",
          background: "rgba(7,16,21,.88)",
          color: C.paper,
          borderBottom: `4px solid ${C.access}`,
          font: `600 31px/1.18 ${fontBody}`,
          textAlign: "center",
          boxShadow: "0 8px 30px rgba(0,0,0,.22)",
        }}
      >
        {page.text}
      </div>
    </div>
  );
};

const AudioMix: React.FC<Pick<SceneProps, "narration" | "musicSrc" | "musicEnabled">> = ({
  narration = [],
  musicSrc = "",
  musicEnabled = false,
}) => {
  const {fps, durationInFrames} = useVideoConfig();
  return (
    <>
      {musicEnabled && musicSrc ? (
        <Audio
          src={staticFile(musicSrc)}
          volume={(audioFrame) => {
            const fadeIn = clamp(audioFrame, [0, fps * 2], [0, 0.16]);
            const fadeOut = clamp(durationInFrames - audioFrame, [0, fps * 4], [0, 0.16]);
            return Math.min(fadeIn, fadeOut);
          }}
        />
      ) : null}
      {narration.map((track) => (
        <Sequence key={track.id} from={Math.round(track.startSeconds * fps)} durationInFrames={Math.ceil((track.durationSeconds + 0.15) * fps)}>
          <Audio src={staticFile(track.src)} volume={1} />
        </Sequence>
      ))}
    </>
  );
};

const timeline = [
  {id: "scene-01", start: 0, end: 9, component: Hook},
  {id: "scene-02", start: 9, end: 23, component: OpenAIBeat},
  {id: "scene-03", start: 23, end: 35, component: LocalModelBeat},
  {id: "scene-04", start: 35, end: 44, component: OpenWeightsBeat},
  {id: "scene-05", start: 44, end: 49, component: ComputeBridge},
  {id: "scene-06", start: 49, end: 65, component: CapitalBeat},
  {id: "scene-07", start: 65, end: 78, component: RegulationBeat},
  {id: "scene-08", start: 78, end: 93, component: RiskBeat},
  {id: "scene-09", start: 93, end: 100, component: ClosingBeat},
];

export const Scene: React.FC<SceneProps> = ({narration = [], captions = [], musicSrc = "", musicEnabled = false}) => {
  const {fps} = useVideoConfig();
  return (
    <AbsoluteFill style={{background: C.ink}}>
      {timeline.map((beat) => {
        const Component = beat.component;
        const duration = Math.round((beat.end - beat.start) * fps);
        return (
          <Sequence key={beat.id} name={beat.id} from={Math.round(beat.start * fps)} durationInFrames={duration} premountFor={fps}>
            <Component duration={duration} />
          </Sequence>
        );
      })}
      <AudioMix narration={narration} musicSrc={musicSrc} musicEnabled={musicEnabled} />
      <CaptionRail pages={captions} />
    </AbsoluteFill>
  );
};

export const calculateMetadata: CalculateMetadataFunction<SceneProps> = async ({props}) => ({
  durationInFrames: Math.round((props.totalSeconds ?? 100) * (props.fps ?? 30)),
  fps: props.fps ?? 30,
  width: 1920,
  height: 1080,
});
