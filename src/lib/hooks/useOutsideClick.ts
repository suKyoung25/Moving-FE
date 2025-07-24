import { useEffect } from "react";

export function useOutsideClick<T extends HTMLElement>(
   ref: React.RefObject<T | null>,
   handler: (event: MouseEvent) => void,
) {
   useEffect(() => {
      const handleClick = (event: MouseEvent) => {
         if (ref.current && !ref.current.contains(event.target as Node)) {
            handler(event);
         }
      };

      document.addEventListener("mousedown", handleClick);

      return () => {
         document.removeEventListener("mousedown", handleClick);
      };
   }, [ref, handler]);
}
