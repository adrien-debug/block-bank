export default function USDCIcon({ size = 20, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ flexShrink: 0 }}
    >
      <circle cx="12" cy="12" r="12" fill="#2775CA"/>
      <circle cx="12" cy="12" r="9" fill="#3A9AE8"/>
      <path
        d="M12 4C7.58 4 4 7.58 4 12s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"
        fill="white"
        opacity="0.3"
      />
      <circle cx="12" cy="12" r="5" fill="white"/>
      <text
        x="12"
        y="15.5"
        textAnchor="middle"
        fill="#2775CA"
        fontSize="7"
        fontWeight="bold"
        fontFamily="Arial, sans-serif"
        letterSpacing="0.5px"
      >
        USDC
      </text>
    </svg>
  )
}

