import { Trash2 } from "lucide-react"

import { formatFileSize } from "@/lib/utils/format"
import { UploadSuccessIcon } from "@/components/common/icons/SvgIcons"

interface UploadedFileListProps {
    file: File;
    index?: number;
    removeFile?: (index: number) => void;
}

const UploadedFileList = ({ 
    file, 
    index, 
    removeFile 
}: UploadedFileListProps) => {
    const isValidDelete = index !== undefined && removeFile;
    
    return (
        <li className="file-status-list">
            <div className="flex gap-2">
                <UploadSuccessIcon customClass="w-5 h-5 mt-2" />
                <div>
                    <UploadedFileContent file={file} />
                </div>
            </div>

            {isValidDelete && (
                <button 
                    onClick={() => removeFile(index)}
                    aria-label="アップロードされたファイルを削除する"
                    className="file-status-button"
                >
                    <Trash2 className="w-5 h-5" />
                </button>
            )}
        </li>
    );
};

export const UploadedFileContent = ({ file }: { file: File }) => {
    return (
        <p className="flex flex-col gap-[2px] text-sm md:text-base font-medium leading-[28px]">
            {file.name}
            <span className="text-xs text-sub leading-[20px] font-bold">
                ファイルサイズ：{formatFileSize(file.size)}
            </span>
        </p>
    )
}

export default UploadedFileList