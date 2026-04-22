interface BrandLogoProps {
  className?: string;
  height?: number;
}

export function BrandLogo({ className, height = 32 }: BrandLogoProps) {
  const aspectRatio = 1979.61 / 398.76;
  const width = height * aspectRatio;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1979.61 398.76"
      width={width}
      height={height}
      className={className}
    >
      <defs>
        <radialGradient id="hshq-rg1" cx="320.91" cy="47.62" fx="320.91" fy="47.62" r="130.81" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#b3d0ed"/>
          <stop offset="1" stopColor="#71a6d9"/>
        </radialGradient>
        <radialGradient id="hshq-rg2" cx="126.23" cy="180.32" fx="126.23" fy="180.32" r="98.77" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#005297"/>
          <stop offset="1" stopColor="#1b437a"/>
        </radialGradient>
        <radialGradient id="hshq-rg3" cx="320.3" cy="333.76" fx="320.3" fy="333.76" r="113.62" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#5791cd"/>
          <stop offset="1" stopColor="#3b7bbf"/>
        </radialGradient>
      </defs>
      <g>
        <path fill="url(#hshq-rg1)" d="M351.14,46.2c0,17.97-14.56,32.53-32.53,32.53s-32.53-14.56-32.53-32.53,14.56-32.53,32.53-32.53,32.53,14.56,32.53,32.53ZM304.35,76.61c-48.19-26.98-85.54-13.64-92.47,6.93,0,0,26.51,4.22,23.8,21.69-3.71,23.93-11.45,31.02-11.45,55.12s17.77,32.26,29.52,32.26c33.73,0,52.11-43.11,78.61-43.11s44.18,46.67,44.18,46.67c0,0-1.71-80.1-72.19-119.56Z"/>
        <path fill="url(#hshq-rg2)" d="M44.67,177.61c15.56-8.98,35.45-3.65,44.43,11.91,8.98,15.56,3.65,35.45-11.91,44.43-15.56,8.98-35.45,3.65-44.43-11.91s-3.65-35.45,11.91-44.43ZM94.4,202.93c.72,55.23,30.94,80.91,52.22,76.63,0,0-9.6-25.06,6.89-31.45,22.59-8.75,32.59-5.59,53.46-17.64s19.06-31.52,13.19-41.69c-16.86-29.22-63.38-23.58-76.63-46.54-13.25-22.96,18.34-61.59,18.34-61.59,0,0-68.52,41.52-67.47,122.29Z"/>
        <path fill="url(#hshq-rg3)" d="M310.48,380.79c-15.59-8.93-20.99-28.8-12.06-44.39,8.93-15.59,28.8-20.99,44.39-12.06,15.59,8.93,20.99,28.8,12.06,44.39-8.93,15.59-28.8,20.99-44.39,12.06ZM307.34,325.07c47.36-28.42,54.34-67.46,39.94-83.69,0,0-16.83,20.91-30.64,9.87-18.92-15.12-21.24-25.35-42.15-37.32-20.91-11.97-36.83-.61-42.66,9.58-16.76,29.28,11.51,66.64-1.66,89.64-13.17,23-62.45,15.15-62.45,15.15,0,0,70.36,38.32,139.63-3.24Z"/>
      </g>
      <text fill="currentColor" fontFamily="Tahoma-Bold, Tahoma" fontWeight="700" fontSize="179.11px" transform="translate(446.56 256.39) scale(.93 1)">
        <tspan letterSpacing="-.03em" x="0" y="0">h</tspan>
        <tspan letterSpacing="-.03em" x="109.51" y="0">u</tspan>
        <tspan letterSpacing="-.02em" x="218.78" y="0">m</tspan>
        <tspan letterSpacing="-.03em" x="385.48" y="0">a</tspan>
        <tspan letterSpacing="0em" x="487.59" y="0">n </tspan>
        <tspan letterSpacing="-.01em" x="654.72" y="0">s</tspan>
        <tspan letterSpacing="-.01em" x="744.64" y="0">e</tspan>
        <tspan letterSpacing=".01em" x="848.68" y="0">r</tspan>
        <tspan letterSpacing="-.02em" x="928.59" y="0">v</tspan>
        <tspan letterSpacing="-.03em" x="1028.09" y="0">i</tspan>
        <tspan letterSpacing="0em" x="1077.66" y="0">c</tspan>
        <tspan letterSpacing="0em" x="1170.8" y="0">e</tspan>
        <tspan x="1276.83" y="0">s</tspan>
      </text>
      <text fill="var(--primary, #70a5d9)" fontFamily="Tahoma-Bold, Tahoma" fontWeight="700" fontSize="191.96px" transform="translate(1757.44 256.35) scale(.66 .7)">
        <tspan x="0" y="0">HQ</tspan>
      </text>
    </svg>
  );
}

export function BrandIcon({ className, size = 24 }: { className?: string; size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 400 398.76"
      width={size}
      height={size}
      className={className}
    >
      <defs>
        <radialGradient id="hshq-icon-rg1" cx="320.91" cy="47.62" fx="320.91" fy="47.62" r="130.81" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#b3d0ed"/>
          <stop offset="1" stopColor="#71a6d9"/>
        </radialGradient>
        <radialGradient id="hshq-icon-rg2" cx="126.23" cy="180.32" fx="126.23" fy="180.32" r="98.77" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#005297"/>
          <stop offset="1" stopColor="#1b437a"/>
        </radialGradient>
        <radialGradient id="hshq-icon-rg3" cx="320.3" cy="333.76" fx="320.3" fy="333.76" r="113.62" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#5791cd"/>
          <stop offset="1" stopColor="#3b7bbf"/>
        </radialGradient>
      </defs>
      <g>
        <path fill="url(#hshq-icon-rg1)" d="M351.14,46.2c0,17.97-14.56,32.53-32.53,32.53s-32.53-14.56-32.53-32.53,14.56-32.53,32.53-32.53,32.53,14.56,32.53,32.53ZM304.35,76.61c-48.19-26.98-85.54-13.64-92.47,6.93,0,0,26.51,4.22,23.8,21.69-3.71,23.93-11.45,31.02-11.45,55.12s17.77,32.26,29.52,32.26c33.73,0,52.11-43.11,78.61-43.11s44.18,46.67,44.18,46.67c0,0-1.71-80.1-72.19-119.56Z"/>
        <path fill="url(#hshq-icon-rg2)" d="M44.67,177.61c15.56-8.98,35.45-3.65,44.43,11.91,8.98,15.56,3.65,35.45-11.91,44.43-15.56,8.98-35.45,3.65-44.43-11.91s-3.65-35.45,11.91-44.43ZM94.4,202.93c.72,55.23,30.94,80.91,52.22,76.63,0,0-9.6-25.06,6.89-31.45,22.59-8.75,32.59-5.59,53.46-17.64s19.06-31.52,13.19-41.69c-16.86-29.22-63.38-23.58-76.63-46.54-13.25-22.96,18.34-61.59,18.34-61.59,0,0-68.52,41.52-67.47,122.29Z"/>
        <path fill="url(#hshq-icon-rg3)" d="M310.48,380.79c-15.59-8.93-20.99-28.8-12.06-44.39,8.93-15.59,28.8-20.99,44.39-12.06,15.59,8.93,20.99,28.8,12.06,44.39-8.93,15.59-28.8,20.99-44.39,12.06ZM307.34,325.07c47.36-28.42,54.34-67.46,39.94-83.69,0,0-16.83,20.91-30.64,9.87-18.92-15.12-21.24-25.35-42.15-37.32-20.91-11.97-36.83-.61-42.66,9.58-16.76,29.28,11.51,66.64-1.66,89.64-13.17,23-62.45,15.15-62.45,15.15,0,0,70.36,38.32,139.63-3.24Z"/>
      </g>
    </svg>
  );
}
