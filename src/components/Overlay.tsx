import type { ReactNode } from "react";

interface OverlayProps {
  className?: string;
  children: ReactNode;
}

function Overlay({ className = "", children }: OverlayProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div
        className={`bg-black w-40 h-20 flex items-center justify-center ${className}`}
      >
        {children}
      </div>
    </div>
  );
}

export default Overlay;
