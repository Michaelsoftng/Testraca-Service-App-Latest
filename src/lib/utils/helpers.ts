export const formatDate = (date: Date | null): string => {
  if (!date) {
    return 'No date selected';
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Add leading zero
  const day = String(date.getDate()).padStart(2, '0'); // Add leading zero
  return `${year}-${month}-${day}`;
};
