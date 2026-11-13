/**
 * Hand-drawn inline SVG: laptop with a loan chart, a calculator, coins,
 * a small house and botanical leaves. Inline so it costs no extra request
 * and stays crisp at any size.
 */

const leaf = "M0 0C8-11 26-12 36 0 26 12 8 11 0 0Z";

function Leaf({ x, y, r, s = 1, fill }: { x: number; y: number; r: number; s?: number; fill: string }) {
  return <path d={leaf} fill={fill} transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`} />;
}

export function HeroIllustration({ className = "" }: { className?: string }) {
  const coins = [0, 1, 2, 3];
  return (
    <svg
      viewBox="0 0 560 430"
      role="img"
      aria-labelledby="hero-illustration-title"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title id="hero-illustration-title">
        Illustration of a laptop showing a rising loan chart, with a calculator, a stack of coins, a small house and
        green plants
      </title>

      {/* Soft background shape and ground */}
      <path d="M78 248C70 140 168 58 292 60c126 2 214 74 216 176 2 104-86 160-214 162C166 400 86 350 78 248Z" fill="#E9F0E4" />
      <ellipse cx="290" cy="402" rx="250" ry="12" fill="#E5DFD6" opacity=".7" />
      <circle cx="470" cy="96" r="6" fill="#759879" opacity=".35" />
      <circle cx="96" cy="128" r="4" fill="#759879" opacity=".35" />
      <circle cx="500" cy="190" r="3" fill="#205C40" opacity=".25" />

      {/* Plant behind the laptop (left) */}
      <path d="M128 336C122 290 114 246 104 204" stroke="#759879" strokeWidth="3" fill="none" strokeLinecap="round" />
      <Leaf x={123} y={296} r={-160} fill="#759879" />
      <Leaf x={118} y={266} r={-28} fill="#205C40" />
      <Leaf x={112} y={238} r={-152} s={0.9} fill="#205C40" />
      <Leaf x={106} y={210} r={-78} s={0.85} fill="#759879" />

      {/* Laptop */}
      <rect x="150" y="128" width="270" height="188" rx="14" fill="#252522" />
      <rect x="162" y="140" width="246" height="164" rx="5" fill="#FFFFFF" />
      <rect x="178" y="154" width="72" height="8" rx="4" fill="#E5DFD6" />
      <rect x="178" y="168" width="46" height="6" rx="3" fill="#F3EEE5" />
      <rect x="352" y="154" width="40" height="18" rx="9" fill="#E9F0E4" />
      <path d="M178 290H392" stroke="#E5DFD6" strokeWidth="1.5" />
      <path d="M178 262H392M178 234H392M178 206H392" stroke="#F3EEE5" strokeWidth="1.5" />
      {[24, 34, 30, 46, 54, 66, 80].map((h, i) => (
        <rect key={i} x={184 + i * 30} y={290 - h} width="16" height={h} rx="4" fill="#E9F0E4" />
      ))}
      <path d="M192 262L222 252L252 256L282 236L312 228L342 206L374 186L374 290H192Z" fill="#205C40" opacity=".07" />
      <path
        d="M192 262L222 252L252 256L282 236L312 228L342 206L374 186"
        stroke="#205C40"
        strokeWidth="3.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="374" cy="186" r="9" fill="#205C40" opacity=".15" />
      <circle cx="374" cy="186" r="5" fill="#205C40" />
      <path d="M118 316H452L440 334A9 9 0 0 1 432 339H138A9 9 0 0 1 130 334Z" fill="#E5DFD6" />
      <rect x="262" y="316" width="46" height="5" rx="2.5" fill="#D3CBBF" />

      {/* House */}
      <rect x="40" y="350" width="70" height="52" rx="3" fill="#FFFFFF" stroke="#D3CBBF" strokeWidth="1.5" />
      <rect x="92" y="322" width="10" height="20" rx="1.5" fill="#205C40" />
      <path d="M31 354L75 316L119 354Z" fill="#205C40" strokeLinejoin="round" />
      <rect x="66" y="372" width="18" height="30" rx="2.5" fill="#759879" />
      <rect x="48" y="362" width="12" height="12" rx="1.5" fill="#E9F0E4" stroke="#D3CBBF" />
      <rect x="92" y="362" width="12" height="12" rx="1.5" fill="#E9F0E4" stroke="#D3CBBF" />

      {/* Coins */}
      {coins.map((i) => {
        const cy = 390 - i * 10;
        return (
          <g key={`a${i}`}>
            <rect x="136" y={cy} width="52" height="10" fill="#C9AE78" />
            <ellipse cx="162" cy={cy + 10} rx="26" ry="7" fill="#C9AE78" />
            <ellipse cx="162" cy={cy} rx="26" ry="7" fill="#E2CC9C" stroke="#C9AE78" strokeWidth="1.2" />
          </g>
        );
      })}
      {[0, 1].map((i) => {
        const cy = 390 - i * 10;
        return (
          <g key={`b${i}`}>
            <rect x="182" y={cy} width="48" height="10" fill="#C9AE78" />
            <ellipse cx="206" cy={cy + 10} rx="24" ry="6.5" fill="#C9AE78" />
            <ellipse cx="206" cy={cy} rx="24" ry="6.5" fill="#E2CC9C" stroke="#C9AE78" strokeWidth="1.2" />
          </g>
        );
      })}
      <circle cx="252" cy="380" r="21" fill="#E2CC9C" stroke="#C9AE78" strokeWidth="2" />
      <circle cx="252" cy="380" r="15" fill="none" stroke="#C9AE78" strokeWidth="1.2" />
      <path
        d="M256 372.5c-1.2-1.4-3-2-4.8-2-2.6 0-4.4 1.4-4.4 3.4 0 4.6 9.6 2.4 9.6 7.2 0 2.1-2 3.6-4.8 3.6-2.1 0-4-.8-5.2-2.3M251.4 367.6v2.9M251.4 384.7v2.9"
        stroke="#9C834F"
        strokeWidth="1.8"
        fill="none"
        strokeLinecap="round"
      />

      {/* Calculator */}
      <rect x="384" y="296" width="96" height="106" rx="13" fill="#FFFFFF" stroke="#D3CBBF" strokeWidth="1.5" />
      <rect x="396" y="308" width="72" height="24" rx="6" fill="#E9F0E4" />
      <text x="460" y="325" textAnchor="end" fontFamily="ui-sans-serif, system-ui, sans-serif" fontSize="12" fontWeight="600" fill="#205C40">
        500.95
      </text>
      {[0, 1, 2].map((row) =>
        [0, 1, 2, 3].map((col) => (
          <rect
            key={`${row}-${col}`}
            x={397 + col * 18}
            y={340 + row * 18}
            width="13"
            height="12"
            rx="3"
            fill={row === 2 && col === 3 ? "#205C40" : col === 3 ? "#E9F0E4" : "#F3EEE5"}
          />
        )),
      )}

      {/* Plant in a pot (right) */}
      <path d="M513 360C511 330 505 300 497 266" stroke="#759879" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M514 360C518 330 526 306 538 284" stroke="#759879" strokeWidth="3" fill="none" strokeLinecap="round" />
      <Leaf x={511} y={340} r={-150} fill="#759879" />
      <Leaf x={508} y={316} r={-38} s={0.9} fill="#205C40" />
      <Leaf x={503} y={292} r={-142} s={0.9} fill="#205C40" />
      <Leaf x={499} y={270} r={-80} s={0.8} fill="#759879" />
      <Leaf x={520} y={334} r={-22} s={0.8} fill="#759879" />
      <Leaf x={530} y={304} r={-58} s={0.85} fill="#205C40" />
      <path d="M490 358H538L532 402H496Z" fill="#F3EEE5" stroke="#D3CBBF" strokeWidth="1.5" strokeLinejoin="round" />
      <rect x="487" y="354" width="54" height="9" rx="3" fill="#E5DFD6" />
    </svg>
  );
}
