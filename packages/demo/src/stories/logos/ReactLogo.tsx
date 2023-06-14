import { SVGProps } from 'react'
const ReactLogo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    className="mt-4 mb-3 text-link dark:text-link-dark w-24 lg:w-28 self-center text-sm mr-0 flex origin-center transition-all ease-in-out"
    viewBox="-10.5 -9.45 21 18.9"
    {...props}
  >
    <circle r={2} fill="currentColor" />
    <g stroke="currentColor">
      <ellipse rx={10} ry={4.5} />
      <ellipse rx={10} ry={4.5} transform="rotate(60)" />
      <ellipse rx={10} ry={4.5} transform="rotate(120)" />
    </g>
  </svg>
)
export default ReactLogo
