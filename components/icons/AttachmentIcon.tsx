export default function AttachmentIcon({ className = '' }: { className?: string }) {
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
        d="M15.5 9.5L9.5 15.5C8.5 16.5 6.5 16.5 5.5 15.5C4.5 14.5 4.5 12.5 5.5 11.5L12.5 4.5C13.5 3.5 15.5 3.5 16.5 4.5C17.5 5.5 17.5 7.5 16.5 8.5L9.5 15.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}



