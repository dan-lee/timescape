import { ReactNode, useEffect, useRef } from 'react'
import { borderBox, flashEffect } from './timescape.css'

export const UpdateFlasher = ({
  children,
  data,
}: {
  data: unknown
  children: ReactNode
}) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    const wrap = wrapperRef.current
    const handleAnimationEnd = () => wrap?.classList.remove(flashEffect)
    wrap?.addEventListener('animationend', handleAnimationEnd)
    return () => wrap?.removeEventListener('animationend', handleAnimationEnd)
  }, [])

  useEffect(() => {
    if (wrapperRef.current?.contains(document.activeElement)) return
    wrapperRef.current?.classList.add(flashEffect)
  }, [data])

  return (
    <div className={borderBox} ref={wrapperRef}>
      {children}
    </div>
  )
}
