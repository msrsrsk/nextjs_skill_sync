export const isValidCategory = (
    category: string, 
    categoryConstants: Record<string, string>
): boolean => {
    const validCategories = Object.values(categoryConstants)
        .map(cat => cat.toLowerCase());
    return validCategories.includes(category.toLowerCase());
}