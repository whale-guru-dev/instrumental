import { useEffect, useState } from "react";

// modified from https://usehooks.com/useDebounce/
export default function useDebounce<T>(
  value: T,
  delay: number,
): { before?: T; after: T } {
  const [debouncedValue, setDebouncedValue] = useState<{
    before?: T;
    after: T;
  }>({
    before: value,
    after: value,
  });

  useEffect(() => {
    // Update debounced value after delay
    const handler = setTimeout(() => {
      setDebouncedValue({ before: debouncedValue.after, after: value });
    }, delay);

    // Cancel the timeout if value changes (also on delay change or unmount)
    // This is how we prevent debounced value from updating if value is changed ...
    // .. within the delay period. Timeout gets cleared and restarted.
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
