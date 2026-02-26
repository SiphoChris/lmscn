"use client";

export function LmscnLogo() {
  return (
    <svg
    width={125}
    height={40}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 400 90"
      fill="none"
      role="img"
      aria-label="lmscn"
    >
      <g transform="translate(5,5)">
        <path
          d="M 2,2 L 40,2 L 40,13 A 7,7 0 0,1 40,27 L 40,40 L 27,40 A 7,7 0 0,1 13,40 L 2,40 Z"
          fill="#06b6d4"
        />
        <path
          d="M 40,2 L 78,2 L 78,40 L 67,40 A 7,7 0 0,1 53,40 L 40,40 L 40,27 A 7,7 0 0,0 40,13 L 40,2 Z"
          fill="#2563eb"
        />
        <path
          d="M 2,40 L 13,40 A 7,7 0 0,0 27,40 L 40,40 L 40,53 A 7,7 0 0,1 40,67 L 40,78 L 2,78 Z"
          fill="#f59e0b"
        />
        <path
          d="M 40,40 L 53,40 A 7,7 0 0,0 67,40 L 78,40 L 78,78 L 40,78 L 40,67 A 7,7 0 0,0 40,53 L 40,40 Z"
          fill="#8b5cf6"
        />
      </g>
      <text
        x="108"
        y="80"
        fontFamily="'DM Mono', 'Fira Code', ui-monospace, monospace"
        fontWeight="700"
        fontSize="64"
        letterSpacing="-2"
        fill="currentColor"
      >
        lmscn
      </text>
    </svg>
  );
}



