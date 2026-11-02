import { useRef } from "react";
import type { AnchorHTMLAttributes, PointerEvent, PropsWithChildren } from "react";

/** Small pointer-only magnetic pull; touch and keyboard users receive a normal link. */
const MagneticLink = ({ children, className, ...props }: PropsWithChildren<AnchorHTMLAttributes<HTMLAnchorElement>>) => {
  const ref = useRef<HTMLAnchorElement>(null);
  const move = (event: PointerEvent<HTMLAnchorElement>) => {
    if (event.pointerType === "touch" || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    ref.current.style.transform = `translate3d(${(event.clientX - rect.left - rect.width / 2) * .12}px, ${(event.clientY - rect.top - rect.height / 2) * .12}px, 0)`;
  };
  const reset = () => { if (ref.current) ref.current.style.transform = "translate3d(0, 0, 0)"; };
  return <a {...props} ref={ref} className={`magnetic-link ${className ?? ""}`} onPointerMove={move} onPointerLeave={reset} onBlur={reset}>{children}</a>;
};

export default MagneticLink;
