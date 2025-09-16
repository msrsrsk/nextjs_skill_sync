import { LoaderCircle, CircleX } from "lucide-react"

import UploadedFileList from "@/components/ui/form/UploadedFileList"
import { formatFileStatusMessage } from "@/lib/utils/format"
import { UploadSuccessIcon, AlertIcon } from "@/components/common/icons/SvgIcons"
import { UploadedFileContent } from "@/components/ui/form/UploadedFileList"
import { FILE_STATUS_TYPES } from "@/constants/index"

const { FILE_LOADING, FILE_SUCCESS, FILE_ERROR } = FILE_STATUS_TYPES;

interface UploadFileStatusProps {
    files: Files;
    fileStatuses: Array<{
        file: File;
        type: FileStatusType;
    }>;
    removeFile: (index: number) => void;
    removeErrorStatus: (index: number) => void;
}

const UploadFileStatus = ({ 
    files, 
    fileStatuses, 
    removeFile, 
    removeErrorStatus 
}: UploadFileStatusProps) => {
    const getStatusIcon = (type: string) => {
        switch (type) {
            case FILE_LOADING:
                return <LoaderCircle className="w-[18px] h-auto animate-spin text-tag-extras mt-2" />;
            case FILE_SUCCESS:
                return <UploadSuccessIcon customClass="w-5 h-5 mt-2" />;
            case FILE_ERROR:
                return <AlertIcon customClass="w-5 h-5 mt-2" />;
            default:
                return null;
        }
    };

    const getStatusTextClass = (type: string) => {
        return type === FILE_LOADING ? 'text-tag-extras' : 
            type === FILE_ERROR ? 'text-tag-default' : '';
    };

    return <>
        {files.map((file, fileIndex) => (
            <UploadedFileList 
                key={`${file.name}-${fileIndex}`} 
                file={file} 
                index={fileIndex}
                removeFile={removeFile}
            />
        ))}
        {fileStatuses
            .filter(status => status.type !== FILE_SUCCESS)
            .map((status, index) => (
                <li 
                    key={`${status.file.name}-${index}`} 
                    className="file-status-list"
                >
                    <div className="flex gap-2">
                        {getStatusIcon(status.type)}
                        <div>
                            <UploadedFileContent file={status.file} />
                            {status.type === FILE_LOADING && (
                                <p className={
                                    `text-xs leading-[18px] font-bold ${getStatusTextClass(status.type)}`
                                }>
                                    {formatFileStatusMessage(status.type)}
                                </p>
                            )}
                        </div>
                    </div>
                    {status.type === FILE_ERROR && (
                        <button 
                            onClick={() => removeErrorStatus(index)}
                            aria-label="ファイルのアップロードエラーの表示を削除する"
                            className="file-status-button"
                        >
                            <CircleX className="w-5 h-5" />
                        </button>
                    )}
                </li>
            ))
        }
    </>
};

export default UploadFileStatus