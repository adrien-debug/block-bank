export default function Logo({ className = '' }: { className?: string }) {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="32" height="32" rx="8" fill="url(#gradient)" />
      <path
        d="M16 8L20 12H18V20H14V12H12L16 8Z"
        fill="white"
      />
      <path
        d="M8 16L12 20H14V24H18V20H20L16 16L8 16Z"
        fill="white"
        opacity="0.8"
      />
      <defs>
        <linearGradient id="gradient" x1="0" y1="0" x2="32" y2="32">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#1E40AF" />
        </linearGradient>
      </defs>
    </svg>
  )
}

