export const isValidCategory = (
    category: string, 
    categoryConstants: Record<string, string>
): boolean => {
    const validCategories = Object.values(categoryConstants)
        .map(cat => cat.toLowerCase());
    return validCategories.includes(category.toLowerCase());
}

export const startTokenValidation = (
    expiryTime: Date,
    onExpiry: () => void
) => {
    const now = new Date();
    const timeUntilExpiry = expiryTime.getTime() - now.getTime();
    
    if (timeUntilExpiry <= 0) {
        onExpiry();
        return null;
    }

    return setTimeout(() => {
        onExpiry();
    }, timeUntilExpiry);
}