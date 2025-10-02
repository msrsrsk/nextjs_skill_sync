import { getFileExtension, dataUrlToFile } from "@/lib/utils/format"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { SUPABASE_ERROR } = ERROR_MESSAGES;

interface UrlToFileResult extends ActionState {
    data: File | null;
}

// URLをFileに変換
export const urlToFile = async (
    url: string, 
    filename?: string
): Promise<UrlToFileResult> => {
    if (url.startsWith('data:')) {
        const extension = getFileExtension(dataUrlToFile(url, 'temp').type);
        const defaultFilename = `icon.${extension}`;
        
        return {
            success: true, 
            error: null, 
            data: dataUrlToFile(url, filename || defaultFilename) 
        }
    }

    try {
        const response = await fetch(url);
        const blob = await response.blob();
        const extension = getFileExtension(blob.type);
        const defaultFilename = `icon.${extension}`;
        
        return {
            success: true, 
            error: null, 
            data: new File([blob], filename || defaultFilename, { type: blob.type }) 
        }
    } catch (error) {
        console.error('Actions Error - Convert URL to File error:', error);

        return {
            success: false, 
            error: SUPABASE_ERROR.CONVERT_FAILED,
            data: null
        }
    }
};