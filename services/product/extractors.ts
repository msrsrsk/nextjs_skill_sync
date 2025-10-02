export function extractProductLink(content: string): string | null {
    if (!content) return null;
    
    const productLinkMatch = content.match(/<a[^>]*href="([^"]*)"[^>]*>商品を見る<\/a>/);
    
    if (productLinkMatch && productLinkMatch[1]) {
        return productLinkMatch[1];
    }
    
    return null
}