export default function SearchIcon({ 
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
      <circle
        cx="9"
        cy="9"
        r="6"
        stroke={color}
        strokeWidth="1.5"
      />
      <path
        d="M13 13L17 17"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}



