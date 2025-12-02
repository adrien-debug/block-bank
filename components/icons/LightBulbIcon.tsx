export default function LightBulbIcon({ className = '' }: { className?: string }) {
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
        d="M12 2C9.24 2 7 4.24 7 7C7 8.78 7.75 10.38 9 11.46V16C9 16.55 9.45 17 10 17H14C14.55 17 15 16.55 15 16V11.46C16.25 10.38 17 8.78 17 7C17 4.24 14.76 2 12 2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 21H15"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 18V20H14V18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}


