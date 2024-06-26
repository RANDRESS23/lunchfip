function IconShieldLockFill (props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 16 16"
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
      <path
        fill="url(#grad1)"
        d="M8 0c-.69 0-1.843.265-2.928.56-1.11.3-2.229.655-2.887.87a1.54 1.54 0 00-1.044 1.262c-.596 4.477.787 7.795 2.465 9.99a11.777 11.777 0 002.517 2.453c.386.273.744.482 1.048.625.28.132.581.24.829.24s.548-.108.829-.24a7.159 7.159 0 001.048-.625 11.775 11.775 0 002.517-2.453c1.678-2.195 3.061-5.513 2.465-9.99a1.541 1.541 0 00-1.044-1.263 62.467 62.467 0 00-2.887-.87C9.843.266 8.69 0 8 0zm0 5a1.5 1.5 0 01.5 2.915l.385 1.99a.5.5 0 01-.491.595h-.788a.5.5 0 01-.49-.595l.384-1.99A1.5 1.5 0 018 5z"
      />
    </svg>
  )
}

export default IconShieldLockFill
