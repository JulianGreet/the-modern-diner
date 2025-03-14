
export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price);
};

export const getCourseTypeColor = (courseType: string) => {
  switch (courseType) {
    case 'appetizer':
      return 'bg-amber-500';
    case 'main':
      return 'bg-blue-500';
    case 'dessert':
      return 'bg-pink-500';
    case 'drink':
      return 'bg-purple-500';
    default:
      return 'bg-gray-500';
  }
};

export const groupItemsByCategory = <T extends { category: string }>(items: T[]) => {
  return items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, T[]>);
};
