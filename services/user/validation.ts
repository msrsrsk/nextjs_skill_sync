import { accountInfoIconImages } from "@/data"

export const isDefaultIcon = (iconUrl: string): boolean => {
    return accountInfoIconImages.some(icon => icon.src === iconUrl);
}