export const formatDate = (dateString: string): string => {
  try {
    if (!dateString) return 'Unknown date';
    return new Date(dateString).toLocaleDateString();
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Unknown date';
  }
}; 