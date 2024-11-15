export const formattedDate = (date: string): string => {
    const newDate = new Date(date);
    const day: number = newDate.getDate();
    const month: number = newDate.getMonth() + 1;
    const year: string = newDate.getFullYear().toString().slice(-2);
    const hours: string = String(newDate.getHours()).padStart(2, '0');
    const minutes: string = String(newDate.getMinutes()).padStart(2, '0');

    return `${day}/${month}/${year}, ${hours}:${minutes}`;
};