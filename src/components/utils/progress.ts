export const setProgress = (setLoading: (value: number) => void) => {
  let percent = 0;

  let interval = setInterval(() => {
    if (percent <= 50) {
      const rand = Math.round(Math.random() * 5);
      percent = percent + rand;
      setLoading(percent);
    } else {
      clearInterval(interval);
      interval = setInterval(() => {
        percent = percent + 1;
        setLoading(percent);
        if (percent > 91) {
          clearInterval(interval);
        }
      }, 250);
    }
  }, 100);

  function clear() {
    clearInterval(interval);
    setLoading(100);
  }

  function stop() {
    clearInterval(interval);
  }

  function loaded() {
    return new Promise<number>((resolve) => {
      clearInterval(interval);
      interval = setInterval(() => {
        if (percent < 100) {
          percent++;
          setLoading(percent);
        } else {
          resolve(percent);
          clearInterval(interval);
        }
      }, 2);
    });
  }

  return { loaded, percent, clear, stop };
};
