// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function debounce(func: any, wait: number) {
  let timeout: NodeJS.Timeout | undefined;
  let later: () => void | undefined;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const debouncedFunction = (...args: any) => {
    later = () => {
      timeout = undefined;
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };

  const cancel = () => {
    if (timeout !== undefined) {
      clearTimeout(timeout);
      if (later !== undefined) {
        later();
      }
    }
  };

  return [debouncedFunction, cancel];
}
