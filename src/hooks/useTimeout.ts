import { useCallback, useEffect, useRef, useState } from "react";

// Reference: https://gist.github.com/codeaid/11b2ae365fe928763ab2a77cbfbe07f3

type UseTimeoutCallback = (...args: Array<any>) => void;

export const useTimeout = (fn: UseTimeoutCallback, ms: number) => {
  // Indicates if timer is currently running
  // Apply useState to allow component re-render
  const [isRunning, setIsRunning] = useState(false);

  // Number of milliseconds remaining before the timer runs out and callback is executed
  const msRemaining = useRef(ms);

  // Time when the most recent execution was requested (0 if time is not currently running)
  const timeStarted = useRef(0);

  // Timeout handle
  const handle = useRef<number | NodeJS.Timeout>(0);

  // Original callback function
  const callback = useRef(fn);

  const cancelTimeout = useCallback(() => {
    // Ignore request if there is no active timeout to cancel
    if ((handle.current as number) <= 0) {
      return;
    }

    // Mark timer as paused and reset all internal values to avoid being able to restart it
    setIsRunning(false);
    msRemaining.current = 0;
    timeStarted.current = 0;

    clearTimeout(handle.current);
    handle.current = 0;
  }, []);

  const resumeTimeout = useCallback(() => {
    // Ignore request if time is already running or if there is no time remaining
    if (isRunning || msRemaining.current <= 0) {
      return;
    }

    // Mark timer as running and record the current time for future calculations
    setIsRunning(true);
    timeStarted.current = Date.now();

    // Schedule timeout
    handle.current = setTimeout(() => {
      // Clear all internal values when the timer executes
      cancelTimeout();

      // Invoke the callback function
      callback.current && callback.current();
    }, msRemaining.current);
  }, [cancelTimeout, isRunning]);

  const pauseTimeout = useCallback(() => {
    // Ignore request if timer is not currently running
    if (!isRunning) {
      return;
    }

    // Mark timer as paused, clear last time started and reduce the number of remaining
    // milliseconds by the time that passed since the last "start" call
    setIsRunning(false);
    msRemaining.current -= Date.now() - timeStarted.current;
    timeStarted.current = 0;

    // Clear timeout handle to avoid the function executing while timer is paused
    clearTimeout(handle.current);
    handle.current = 0;
  }, [isRunning]);

  // Update callback function reference when a new function is passed in
  useEffect(() => {
    callback.current = fn;
  }, [fn]);

  // Cancel timer on unmount
  useEffect(() => {
    return cancelTimeout;
  }, [cancelTimeout]);

  return {
    isRunning,
    cancelTimeout,
    pauseTimeout,
    resumeTimeout,
  };
};
