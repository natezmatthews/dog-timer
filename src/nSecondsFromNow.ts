export default function nSecondsFromNow(n: number): Date {
    const time = new Date();
    time.setSeconds(time.getSeconds() + n);
    return time;
}