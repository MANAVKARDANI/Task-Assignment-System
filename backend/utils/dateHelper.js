exports.isOverdue = (deadline) => {
  return new Date() > new Date(deadline);
};

exports.daysLeft = (deadline) => {
  const diff = new Date(deadline) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};