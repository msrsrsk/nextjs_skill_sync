import { FILE_UPLOAD_CONFIG, FILE_STATUS_TYPES } from "@/constants/index"

const { MAX_TOTAL_SIZE_TEXT } = FILE_UPLOAD_CONFIG;
const { FILE_LOADING, FILE_SUCCESS, FILE_ERROR } = FILE_STATUS_TYPES;

export const formatFileStatusMessage = (type: FileStatusType): string => {
    const messageMap = {
        [FILE_LOADING]: '※ファイルをアップロード中...',
        [FILE_SUCCESS]: '',
        [FILE_ERROR]: `※容量が合計${MAX_TOTAL_SIZE_TEXT}を超えています`,
    }
    
    return messageMap[type] || '';
}