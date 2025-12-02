export default function WarningIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M10 6.667V10M10 13.333h.008M3.333 16.667h13.334a1.667 1.667 0 0 0 1.44-2.5L11.44 3.333a1.667 1.667 0 0 0-2.88 0L1.893 14.167a1.667 1.667 0 0 0 1.44 2.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}





