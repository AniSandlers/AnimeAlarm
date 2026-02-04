import { Alarm } from './types';
// import { CHARACTERS } from './constants';
// import { registerPlugin } from '@capacitor/core';
//
// interface AlarmPlugin {
//     schedule(options: { time: string; alarmPath: string; voicePath: string }): Promise<void>;
//     cancel(): Promise<void>;
// }
//
// const AlarmPlugin = registerPlugin<AlarmPlugin>('AlarmPlugin');

export const scheduleNativeAlarm = async (timestamp: number, alarm: Alarm | null) => {
    console.log('STUB: Scheduling alarm for:', new Date(timestamp).toLocaleString());
    // Waiting for new implementation strategy
};

export const cancelNativeAlarm = async () => {
    console.log('STUB: Cancelling alarm');
    // Waiting for new implementation strategy
};

export const getNextAlarmDiff = (alarms: Alarm[]): string => {
    const enabledAlarms = alarms.filter(a => a.enabled);
    if (enabledAlarms.length === 0) return '';

    const now = new Date();
    const currentDay = now.getDay(); // 0-6 Sun-Sat
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    let minDiffMinutes = Infinity;

    enabledAlarms.forEach(alarm => {
        const [h, m] = alarm.time.split(':').map(Number);
        const alarmMinutes = h * 60 + m;

        let diff = Infinity;

        if (alarm.days.length === 0) {
            // One-time alarm
            if (alarmMinutes > currentMinutes) {
                diff = alarmMinutes - currentMinutes;
            } else {
                diff = (24 * 60) - currentMinutes + alarmMinutes;
            }
        } else {
            // Repeating alarm
            // Find the next active day
            // sorted days: e.g. [1, 3, 5] (Mon, Wed, Fri)
            // currentDay: 2 (Tue)

            // Check today first
            if (alarm.days.includes(currentDay) && alarmMinutes > currentMinutes) {
                diff = alarmMinutes - currentMinutes;
            } else {
                // Find next day
                let nextDay = -1;
                // Try to find a day > currentDay
                const futureDays = alarm.days.filter(d => d > currentDay).sort((a, b) => a - b);
                if (futureDays.length > 0) {
                    nextDay = futureDays[0];
                } else {
                    // Wrap around to first day of the week
                    nextDay = alarm.days.sort((a, b) => a - b)[0];
                }

                let dayDiff = 0;
                if (nextDay > currentDay) {
                    dayDiff = nextDay - currentDay;
                } else {
                    dayDiff = (7 - currentDay) + nextDay;
                }

                // Calculate minutes
                // (days * 24 * 60) - (minutes passed today) + (alarm minutes on that day)
                // Wait, simplified:
                // Diff = (DaysDiff * 24 * 60) + (AlarmMinutes - CurrentMinutes)
                // Example: Now Mon 10:00. Alarm Tue 09:00.
                // DayDiff = 1.
                // Diff = 1 * 1440 + (540 - 600) = 1440 - 60 = 1380m (23h) -> Correct.

                diff = (dayDiff * 24 * 60) + (alarmMinutes - currentMinutes);
            }
        }

        if (diff < minDiffMinutes) {
            minDiffMinutes = diff;
        }
    });

    if (minDiffMinutes === Infinity) return '';

    // Format
    const days = Math.floor(minDiffMinutes / (24 * 60));
    const hours = Math.floor((minDiffMinutes % (24 * 60)) / 60);
    const minutes = minDiffMinutes % 60;

    if (days > 0) {
        return `${days}d ${hours}h ${minutes}m`;
    }
    return `${hours}h ${minutes}m`;
};

export const getNextAlarmTimestamp = (alarms: Alarm[]): number | null => {
    const enabledAlarms = alarms.filter(a => a.enabled);
    if (enabledAlarms.length === 0) return null;

    const now = new Date();
    const currentDay = now.getDay();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    let minDiffMinutes = Infinity;

    enabledAlarms.forEach(alarm => {
        const [h, m] = alarm.time.split(':').map(Number);
        const alarmMinutes = h * 60 + m;

        let diff = Infinity;

        if (alarm.days.length === 0) {
            // One-time
            if (alarmMinutes > currentMinutes) {
                diff = alarmMinutes - currentMinutes;
            } else {
                diff = (24 * 60) - currentMinutes + alarmMinutes;
            }
        } else {
            // Repeating
            if (alarm.days.includes(currentDay) && alarmMinutes > currentMinutes) {
                diff = alarmMinutes - currentMinutes;
            } else {
                let nextDay = -1;
                const futureDays = alarm.days.filter(d => d > currentDay).sort((a, b) => a - b);
                if (futureDays.length > 0) {
                    nextDay = futureDays[0];
                } else {
                    nextDay = alarm.days.sort((a, b) => a - b)[0];
                }

                let dayDiff = 0;
                if (nextDay > currentDay) {
                    dayDiff = nextDay - currentDay;
                } else {
                    dayDiff = (7 - currentDay) + nextDay;
                }
                diff = (dayDiff * 24 * 60) + (alarmMinutes - currentMinutes);
            }
        }

        if (diff < minDiffMinutes) {
            minDiffMinutes = diff;
        }
    });

    if (minDiffMinutes === Infinity) return null;

    // Calculate timestamp
    return now.getTime() + (minDiffMinutes * 60 * 1000); // approximate, or use strict date math
    // Better date math:
    // actually, let's just use the diff to add to current time.
    // We already calculated diff in minutes accurately respecting days.
    // However, we discarded seconds/ms in calculation (assuming 0).
    // Let's reset seconds/ms for the target?
    // The native alarm manager needs precise time.
    // If we say "alarm in 1 minute", and seconds is 30, it will fire in 1m 30s?
    // Or we want it to fire at HH:mm:00 precisely?
    // Our logic above used currentMinutes (floored).
    // So if it is 10:00:59, and alarm is 10:01, diff is 1 min.
    // We want to fire at 10:01:00.
    // So target = (now_minutes + diff) converted to date.

    const targetDate = new Date(now.getTime() + minDiffMinutes * 60000);
    targetDate.setSeconds(0);
    targetDate.setMilliseconds(0);

    // Correction: if we are close to the next minute, ensure we are targeting the right one.
    // Actually simpler:
    // targetTime = (Current Total Minutes + Diff) * 60 * 1000? 
    // No, reference to start of today?
    // Let's just trust expected behavior: 
    // If diff is 1 min, target is next minute :00.

    // Let's re-calculate target properly based on now.
    // We need to support 'seconds' if we want precision, but alarm is HH:mm.
    // So we want to target HH:mm:00.

    const nowTs = now.getTime();
    const currentSecondsMs = now.getSeconds() * 1000 + now.getMilliseconds();

    // minDiffMinutes is relative to 'currentMinutes' which is floor(now).
    // so it is distance from HH:MM:00 (approx/past) to Target HH:MM:00.
    // If now is 10:00:30, and target is 10:01:00.
    // currentMinutes = 10 * 60 + 0 = 600.
    // targetMinutes = 601.
    // diff = 1.
    // We want target 10:01:00.
    // targetTs = (now - seconds_part) + diff * 60000.

    const nowFloored = new Date(now);
    nowFloored.setSeconds(0);
    nowFloored.setMilliseconds(0);

    return nowFloored.getTime() + (minDiffMinutes * 60 * 1000);
};
