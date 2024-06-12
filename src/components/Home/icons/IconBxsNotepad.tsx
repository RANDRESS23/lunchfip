function IconBxsNotepad (props: React.SVGProps<SVGSVGElement>) {
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
      <path fill="url(#grad1)" d="M19 4h-3V2h-2v2h-4V2H8v2H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2zm-7 10H7v-2h5v2zm5-4H7V8h10v2z" />
    </svg>
  )
}

export default IconBxsNotepad
