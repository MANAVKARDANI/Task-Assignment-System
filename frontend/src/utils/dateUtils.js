export const isOverdue = (date) => {
  return new Date() > new Date(date);
};