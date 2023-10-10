import React, { useState, useEffect } from 'react';



interface TimeAgoProps {
  isoDate: string;
}

const secondsTable: [Intl.RelativeTimeFormatUnit, number][] = [
  ['year', 60 * 60 * 24 * 365],
  ['month', 60 * 60 * 24 * 30],
  ['week', 60 * 60 * 24 * 7],
  ['day', 60 * 60 * 24],
  ['hour', 60 * 60],
  ['minute', 60],
];

const rtf = new Intl.RelativeTimeFormat(undefined, {numeric: 'auto'});

const TimeAgo = ({ isoDate }: TimeAgoProps) => {
  const date = new Date(Date.parse(isoDate));

  let bestTime: number = 0;  // Initialize with a default number value.
  let bestUnit: Intl.RelativeTimeFormatUnit = "second"; // Initialize with a default string value.
  let bestInterval: number = 0; // Initialize with a default number value

  const seconds = Math.round((date.getTime() - new Date().getTime()) / 1000);
  const absSeconds = Math.abs(seconds);

  for (const [unit, unitSeconds] of secondsTable) {
    if (absSeconds >= unitSeconds) {
      bestUnit = unit;
      bestTime = Math.round(seconds / unitSeconds);
      bestInterval = unitSeconds / 2;
      break;
    }
  };

  if (!bestUnit) {
    bestUnit = 'second';
    bestTime = parseInt(String(seconds / 10)) * 10;
    bestInterval = 10;
  }

  const [, setUpdate] = useState(0);

  useEffect(() => {
    const timerId = setInterval(
      () => setUpdate(update => update + 1),
      bestInterval * 1000
    );

    return () => clearInterval(timerId);
  }, [bestInterval]);

  return (
    <span title={date.toString()}>{rtf.format(bestTime, bestUnit)}</span>
  );
};

export default TimeAgo;