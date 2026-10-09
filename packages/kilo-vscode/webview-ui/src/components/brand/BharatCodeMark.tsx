import type { JSX } from "solid-js"

/**
 * BharatCode mark: two orange chevrons with a diamond in the gap.
 * One mark for both themes — the orange works on light and dark canvases.
 */
export const BharatCodeMark = (props: JSX.SvgSVGAttributes<SVGSVGElement>): JSX.Element => (
  <svg
    viewBox="0 0 512 512"
    fill="none"
    stroke="#ff6b35"
    stroke-width="54"
    stroke-linecap="square"
    role="img"
    aria-label="BharatCode"
    {...props}
  >
    <path d="M194 142 84 256l110 114" />
    <path d="m318 142 110 114-110 114" />
    <path fill="#ff6b35" stroke="none" d="m256 221 35 35-35 35-35-35z" />
  </svg>
)
