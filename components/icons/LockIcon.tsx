export default function LockIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect
        x="5"
        y="9"
        width="10"
        height="7"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M6.667 9V5.667C6.667 4.193 7.86 3 9.333 3s2.667 1.193 2.667 2.667V9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}


