export const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);

    const day = date.getDate();
    const month = date.toLocaleString('default', {month: 'short'});
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
};

export const getRemainingDays = (timestamp: number): number => {
    const deadlineDate = new Date(timestamp);
    const currentDate = new Date();

    const difference = deadlineDate.getTime() - currentDate.getTime();

    return Math.max(Math.ceil(difference / (1000 * 60 * 60 * 24)), 0);
};