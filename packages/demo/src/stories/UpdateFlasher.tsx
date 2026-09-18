import { type ReactNode, useEffect, useRef } from "react";

// Defined in ../tailwind.css — an animated gradient border shown when the value
// updates from outside the input (e.g. by picking a date in the calendar).
const FLASH_CLASS = "ts-flash";

export const UpdateFlasher = ({
  children,
}: {
  data: unknown;
  children: ReactNode;
}) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const wrap = wrapperRef.current;
    const handleAnimationEnd = () => wrap?.classList.remove(FLASH_CLASS);
    wrap?.addEventListener("animationend", handleAnimationEnd);
    return () => wrap?.removeEventListener("animationend", handleAnimationEnd);
  }, []);

  useEffect(() => {
    if (wrapperRef.current?.contains(document.activeElement)) return;
    wrapperRef.current?.classList.add(FLASH_CLASS);
  }, []);

  return (
    <div className="border border-transparent" ref={wrapperRef}>
      {children}
    </div>
  );
};
