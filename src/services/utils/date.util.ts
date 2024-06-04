export const AddTimeToDateNow = (value: string): number => {
    const now = new Date();
    const timeValue = parseInt(value.slice(0, -1), 10);
    const timeUnit = value.slice(-1);

    switch (timeUnit) {
        case 'y':
            now.setFullYear(now.getFullYear() + timeValue);
            break;
        case 'M': // 'M' for month
            now.setMonth(now.getMonth() + timeValue);
            break;
        case 'w':
            now.setDate(now.getDate() + (timeValue * 7));
            break;
        case 'd':
            now.setDate(now.getDate() + timeValue);
            break;
        case 'h':
            now.setHours(now.getHours() + timeValue);
            break;
        case 'm':
            now.setMinutes(now.getMinutes() + timeValue);
            break;
        case 's':
            now.setSeconds(now.getSeconds() + timeValue);
            break;
        default:
            throw new Error('Invalid time unit');
    }

    return now.getTime();
};