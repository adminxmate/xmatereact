export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  
  // Check if the date is valid
  if (isNaN(date.getTime())) return 'N/A';

  // Option A: Oct 01, 2012 (Professional Look)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });

  // Option B: 01-10-2012 (Standard Look)
  // return date.toLocaleDateString('en-GB').replace(/\//g, '-');
};