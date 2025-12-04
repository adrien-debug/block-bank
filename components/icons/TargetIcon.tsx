export default function TargetIcon({ 
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
        cx="10"
        cy="10"
        r="7"
        stroke={color}
        strokeWidth="1.5"
      />
      <circle
        cx="10"
        cy="10"
        r="4"
        stroke={color}
        strokeWidth="1.5"
      />
      <circle
        cx="10"
        cy="10"
        r="1.5"
        fill={color}
      />
    </svg>
  )
}

