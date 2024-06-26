function IconServerSecurity (props: React.SVGProps<SVGSVGElement>) {
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
      <path fill="url(#grad1)" d="M3 1h16a1 1 0 011 1v4a1 1 0 01-1 1H3a1 1 0 01-1-1V2a1 1 0 011-1m0 8h16a1 1 0 011 1v.67l-2.5-1.11-6.5 2.88V15H3a1 1 0 01-1-1v-4a1 1 0 011-1m0 8h8c.06 2.25 1 4.4 2.46 6H3a1 1 0 01-1-1v-4a1 1 0 011-1M8 5h1V3H8v2m0 8h1v-2H8v2m0 8h1v-2H8v2M4 3v2h2V3H4m0 8v2h2v-2H4m0 8v2h2v-2H4m13.5-7l4.5 2v3c0 2.78-1.92 5.37-4.5 6-2.58-.63-4.5-3.22-4.5-6v-3l4.5-2m0 1.94L15 15.06v2.66c0 1.54 1.07 2.98 2.5 3.34v-7.12z" />
    </svg>
  )
}

export default IconServerSecurity
