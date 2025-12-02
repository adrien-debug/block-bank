export default function DashboardIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="12" y="3" width="5" height="4" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="12" y="10" width="5" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="3" y="13" width="7" height="4" rx="1" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}





