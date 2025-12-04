export default function GemIcon({ className = '' }: { className?: string }) {
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
        d="M6 3L12 9L18 3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18 3L21 6L18 9L15 6L18 3Z"
        fill="currentColor"
        opacity="0.5"
      />
      <path
        d="M18 3L12 21L6 3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 3L3 6L6 9L9 6L6 3Z"
        fill="currentColor"
        opacity="0.5"
      />
      <path
        d="M12 9L9 6L12 3L15 6L12 9Z"
        fill="currentColor"
        opacity="0.3"
      />
    </svg>
  )
}








