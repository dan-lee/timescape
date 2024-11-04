import { keyframes, style } from '@vanilla-extract/css'

export const baseColor = '#6c70ff'
export const lightColor = '#7182ec'

export const root = style({
  display: 'flex',
  alignItems: 'center',
  gap: '2px',
  width: 'fit-content',
  border: '1px solid #bbb',
  padding: '5px',
  userSelect: 'none',
  borderRadius: '10px',
  transition: '100ms',
  backgroundColor: '#fff',
  cursor: 'text',

  ':focus-within': {
    outline: `1px solid ${baseColor}`,
    borderColor: baseColor,
  },
})

export const flex = style({
  display: 'flex',
  alignItems: 'center',
})

export const input = style({
  fontVariantNumeric: 'tabular-nums',
  height: 'fit-content',
  fontSize: 18,
  border: 'none',
  outline: 'none',
  userSelect: 'none',
  maxWidth: '50px',
  caretColor: 'transparent',

  '::selection': {
    background: 'none',
  },

  ':focus': {
    backgroundColor: baseColor,
    color: '#fff',
    borderRadius: '6px',
    paddingInline: '2px',
  },
})

export const separator = style({
  fontSize: '80%',
  color: '#8c8c8c',
  margin: 0,
})

////////////

export const wrapper = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '2rem',
})

export const fieldset = style({
  position: 'fixed',
  top: 0,
  right: 0,
  fontSize: '14px',
  transform: 'translate(-20px, 10px)',
  backgroundColor: 'rgba(255, 255, 255, 0.6)',
  padding: '1rem 1.5rem',
  border: `1px solid ${lightColor}`,
  borderRadius: 4,
  display: 'grid',
  gridTemplateColumns: 'max-content 1fr',
  gap: '0.25rem 1rem',
  justifyItems: 'flex-start',
  alignItems: 'center',
  overflow: 'hidden',
  selectors: {
    '&[data-expanded="false"]': {
      maxHeight: 0,
      cursor: 'pointer',
      border: '1px solid rgba(0,0,0,0.2)',
      paddingBlock: 0,
    },
  },
})

export const optionsInput = style({
  border: '1px solid #bbb',
  userSelect: 'none',
  borderRadius: '10px',
  transition: '100ms',
  paddingInline: '5px',
  paddingBlock: '3px',
  ':focus-within': {
    outline: `1px solid ${lightColor}`,
    borderColor: lightColor,
  },
  ':invalid': {
    outline: `1px solid #ce4455`,
    borderColor: '#ce4455',
  },
})

export const checkbox = style({
  appearance: 'none',
  backgroundColor: 'transparent',
  margin: 0,
  font: 'inherit',
  color: 'currentColor',
  width: '14px',
  height: '14px',
  border: '1px solid #bbb',
  borderRadius: '4px',
  display: 'grid',
  placeContent: 'center',
  cursor: 'pointer',
  ':focus': {
    borderColor: lightColor,
    outline: 'none',
  },
  selectors: {
    '&:checked::before': {
      borderRadius: '2px',
      content: '',
      width: '8px',
      height: '8px',
      backgroundColor: lightColor,
    },
  },
})

export const label = style({
  cursor: 'pointer',
  fontFamily: 'monospace',
  fontSize: '90%',
  color: '#444',
  width: '100%',
})

export const button = style({
  cursor: 'pointer',
  appearance: 'none',
  backgroundColor: '#eee',
  border: '1px solid #bbb',
  borderRadius: '4px',
  padding: '0.25rem 0.5rem',
})

const secondColor = '#f5f5f5'
const flashAnim = keyframes({
  '0%': {
    backgroundPosition: 'right',
    backgroundImage: `linear-gradient(white, white), 
                      linear-gradient(-60deg, ${baseColor}, ${secondColor}, ${baseColor})`,
    opacity: 1,
  },
  '100%': {
    backgroundPosition: 'left',
    backgroundSize: '200%',
    backgroundImage: `linear-gradient(white, white), 
                      linear-gradient(120deg, ${baseColor}, ${secondColor}, ${baseColor})`,
  },
})

export const borderBox = style({
  border: '1px solid transparent',
})

export const flashEffect = style({
  animation: `${flashAnim} 800ms ease-out`,
  borderRadius: '12px',
  width: 'fit-content',
  backgroundImage: `linear-gradient(white, white),
                    linear-gradient(-60deg, ${baseColor}, ${secondColor}, ${baseColor})`,
  backgroundSize: '200%',
  backgroundPosition: 'left',
  backgroundOrigin: 'border-box',
  backgroundClip: 'content-box, border-box',
})
