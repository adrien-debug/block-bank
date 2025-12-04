export default function CalendarIcon({ 
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
      <rect
        x="3"
        y="4"
        width="14"
        height="13"
        rx="2"
        stroke={color}
        strokeWidth="1.5"
      />
      <path
        d="M3 8H17"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M7 2V6M13 2V6"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="7" cy="12" r="1" fill={color} />
      <circle cx="10" cy="12" r="1" fill={color} />
      <circle cx="13" cy="12" r="1" fill={color} />
      <circle cx="7" cy="15" r="1" fill={color} />
      <circle cx="10" cy="15" r="1" fill={color} />
    </svg>
  )
}

