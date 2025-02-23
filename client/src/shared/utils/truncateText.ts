export const truncateText = (text: string | undefined, maxLength: number): string => {
  if (!text) return ''; 
  return text?.length > maxLength ? `${text?.slice(0, maxLength)}...` : text;
};
