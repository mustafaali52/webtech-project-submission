import { useState, useEffect } from "react";

/**
 * A hook that watches `ref.current` via IntersectionObserver and returns true
 * once the element has intersected. We copy `ref.current` into a local variable
 * so that the cleanup always unobserves the same element we observed.
 *
 * @param {React.RefObject<HTMLElement>} ref
 * @param {{ threshold?: number; rootMargin?: string }} options
 * @returns {boolean}  true once the element is on screen (intersection ≥ threshold)
 */

export default function useOnScreen(
  ref,
  options = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
) {
  const { threshold, rootMargin } = options;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [ref, threshold, rootMargin]);

  return isVisible;
}
