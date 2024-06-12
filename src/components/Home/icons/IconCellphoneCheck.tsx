function IconCellphoneCheck (props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      height="2em"
      width="2em"
      {...props}
    >
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#338bff', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#ff3366', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <path fill="url(#grad1)" d="M14.54 23H7a2 2 0 01-2-2V3c0-1.11.89-2 2-2h10a2 2 0 012 2v10c-.7 0-1.37.13-2 .35V5H7v14h6c0 1.54.58 2.94 1.54 4m3.21-.84l-2.75-3L16.16 18l1.59 1.59L21.34 16l1.16 1.41-4.75 4.75" />
    </svg>
  )
}

export default IconCellphoneCheck
