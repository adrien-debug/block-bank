export default function UsersIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M17 21V19C17 17.9 16.1 17 15 17H5C3.9 17 3 17.9 3 19V21"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="10"
        cy="7"
        r="4"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M23 21V19C23 18.13 22.3 17.4 21.4 17.18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 3.13C16.9 3.35 17.6 4.08 17.6 5C17.6 5.92 16.9 6.65 16 6.87"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}











