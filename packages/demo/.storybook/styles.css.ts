import { style } from '@vanilla-extract/css'

export const bottomToolbar = style({
  display: 'flex',
  justifyContent: 'space-between',
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  background: 'rgba(255, 255, 255, 0.65)',
  backdropFilter: 'blur(4px)',
  padding: '8px 16px',
})

export const background = style({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'absolute',
  inset: 0,
  background: `linear-gradient(45deg, #6d6dff 10%, transparent 25%, transparent 75%, #fbffbe 90%)`,
})
