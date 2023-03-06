const throttle = (callback: (value?: unknown) => unknown, timeout: number) => {
  let timer: string | number | NodeJS.Timeout | undefined;

  return function perform(...args: unknown[]) {
    if (timer) return;

    timer = setTimeout(() => {
      callback(...args);
      clearTimeout(timer);
      timer = undefined;
    }, timeout);
  };
};

export { throttle };
