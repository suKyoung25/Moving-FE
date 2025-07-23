import { useEffect } from "react";

export function useOutsideClick<T extends HTMLElement>(
   ref: React.RefObject<T>,
   onClickOutside: () => void,
   enabled: boolean = true,
) {
   useEffect(() => {
      if (!enabled) return;

      const handleClick = (event: MouseEvent) => {
         if (ref.current && !ref.current.contains(event.target as Node)) {
            onClickOutside();
         }
      };

      document.addEventListener("mousedown", handleClick);

      return () => {
         document.removeEventListener("mousedown", handleClick);
      };
   }, [ref, onClickOutside, enabled]);
}
