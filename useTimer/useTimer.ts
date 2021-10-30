import { useEffect, useRef, useState } from 'react';
import { Time, Validate } from './utils';

function useInterval(callback, delay) {
  const callbacRef = useRef();

  // update callback function with current render callback that has access to latest props and state
  useEffect(() => {
    callbacRef.current = callback;
  });

  useEffect(() => {
    if (!delay) {
      return () => {};
    }

    const interval = setInterval(() => {
      // @ts-ignore: I don't know
      callbacRef.current && callbacRef.current();
    }, delay);
    return () => clearInterval(interval);
  }, [delay]);
}

const DEFAULT_DELAY = 1000;
function getDelayFromExpiryTimestamp(expiryTimestamp) {
  if (!Validate.expiryTimestamp(expiryTimestamp)) {
    return null;
  }

  const seconds = Time.getSecondsFromExpiry(expiryTimestamp);
  const extraMilliSeconds = Math.floor((seconds - Math.floor(seconds)) * 1000);
  return extraMilliSeconds > 0 ? extraMilliSeconds : DEFAULT_DELAY;
}

interface TimerSettings {
  autoStart?: boolean;
  expiryTimestamp: Date;
  onExpire?: () => void;
}

interface TimerResult {
  seconds: number;
  minutes: number;
  hours: number;
  days: number;
  isRunning: boolean;
  start: () => void;
  pause: () => void;
  resume: () => void;
  restart: (newExpiryTimestamp: Date, autoStart?: boolean) => void;
}

export default function useTimer({ expiryTimestamp: expiry, onExpire, autoStart = true }: TimerSettings): TimerResult {
  const [expiryTimestamp, setExpiryTimestamp] = useState(expiry);
  const [seconds, setSeconds] = useState(Time.getSecondsFromExpiry(expiryTimestamp));
  const [isRunning, setIsRunning] = useState(autoStart);
  const [didStart, setDidStart] = useState(autoStart);
  const [delay, setDelay] = useState(getDelayFromExpiryTimestamp(expiryTimestamp));

  function handleExpire() {
    setIsRunning(false);
    setDelay(null);
    Validate.onExpire(onExpire) && onExpire();
  }

  function pause() {
    setIsRunning(false);
  }

  function restart(newExpiryTimestamp, newAutoStart = true) {
    setDelay(getDelayFromExpiryTimestamp(newExpiryTimestamp));
    setDidStart(newAutoStart);
    setIsRunning(newAutoStart);
    setExpiryTimestamp(newExpiryTimestamp);
    setSeconds(Time.getSecondsFromExpiry(newExpiryTimestamp));
  }

  function resume() {
    const time = new Date();
    time.setMilliseconds(time.getMilliseconds() + (seconds * 1000));
    restart(time);
  }

  function start() {
    if (didStart) {
      setSeconds(Time.getSecondsFromExpiry(expiryTimestamp));
      setIsRunning(true);
    } else {
      resume();
    }
  }

  useInterval(() => {
    if (delay !== DEFAULT_DELAY) {
      setDelay(DEFAULT_DELAY);
    }
    const secondsValue = Time.getSecondsFromExpiry(expiryTimestamp);
    setSeconds(secondsValue);
    if (secondsValue <= 0) {
      handleExpire();
    }
  }, isRunning ? delay : null);

  return {
    ...Time.getTimeFromSeconds(seconds), start, pause, resume, restart, isRunning,
  };
}