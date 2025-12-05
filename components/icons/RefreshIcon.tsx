export default function RefreshIcon({ 
  className = '',
  size = 20,
  color = 'currentColor'
}: { 
  className?: string
  size?: number
  color?: string
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M17 10C17 13.866 13.866 17 10 17M17 10C17 6.13401 13.866 3 10 3M17 10H3M3 10C3 6.13401 6.13401 3 10 3M3 10C3 13.866 6.13401 17 10 17"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 1V5M10 15V19"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}




