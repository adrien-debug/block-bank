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
      <circle cx="16" cy="16" r="14" fill="#3B82F6" opacity="0.2" />
      <circle cx="16" cy="16" r="8" fill="#2563EB" />
      <path d="M16 8 L20 16 L16 20 L12 16 Z" fill="#FFFFFF" />
    </svg>
  )
}

