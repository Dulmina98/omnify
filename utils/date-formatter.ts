export const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);

    const day = date.getDate();
    const month = date.toLocaleString('default', {month: 'short'});
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
};