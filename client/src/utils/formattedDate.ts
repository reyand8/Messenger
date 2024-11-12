import { format } from 'date-fns';

export const formattedDate = (date: string): string => {
    const newDate = new Date(date);
    return format(newDate, 'd/M/yy, HH:mm');
}