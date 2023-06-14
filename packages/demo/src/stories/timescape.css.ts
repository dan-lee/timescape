import { style } from '@vanilla-extract/css'

const baseColor = '#6c70ff'

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

  ':focus-within': {
    outline: `1px solid ${baseColor}`,
    borderColor: baseColor,
  },
})

export const input = style({
  fontVariantNumeric: 'tabular-nums',
  height: 'fit-content',
  fontSize: 18,
  border: 'none',
  outline: 'none',
  cursor: 'default',
  userSelect: 'none',
  maxWidth: '50px',

  '::selection': {
    background: 'none',
  },

  ':focus': {
    backgroundColor: baseColor,
    color: '#fff',
    borderRadius: '6px',
    padding: '2px',
  },
})

export const separator = style({
  fontSize: '80%',
  color: '#8c8c8c',
  margin: 0,
})
