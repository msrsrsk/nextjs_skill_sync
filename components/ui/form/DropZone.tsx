"use client"

import { useRef } from "react";
import { CloudUpload } from "lucide-react";

import UploadFileStatus from "@/components/ui/form/UploadFileStatus";
import { useDropzone } from "react-dropzone";
import { useFileUpload } from "@/hooks/file/useFileUpload";
import { EventButtonSecondary } from "@/components/common/buttons/Button";
import { 
    FILE_UPLOAD_CONFIG, 
    REVIEW_ACCEPTED_FILE_TYPES, 
    CONTACT_ACCEPTED_FILE_TYPES, 
    BUTTON_SIZES,
    BUTTON_TEXT_TYPES,
    DROPZONE_TYPES
} from "@/constants/index"

const { MAX_TOTAL_SIZE, MAX_TOTAL_SIZE_TEXT } = FILE_UPLOAD_CONFIG;
const { BUTTON_LARGE } = BUTTON_SIZES;
const { BUTTON_JA } = BUTTON_TEXT_TYPES;
const { DROPZONE_REVIEW } = DROPZONE_TYPES;

interface DropZoneProps {
    files: Files;
    setFiles: React.Dispatch<React.SetStateAction<Files>>;
    type?: DropzoneType;
}

const DropZone = ({ 
    files, 
    setFiles, 
    type = DROPZONE_REVIEW 
}: DropZoneProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { 
        fileStatuses, 
        handleFileUpload, 
        removeFile, 
        removeErrorStatus 
    } = useFileUpload(files, setFiles, MAX_TOTAL_SIZE);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: handleFileUpload,
        accept: type === DROPZONE_REVIEW ? 
            REVIEW_ACCEPTED_FILE_TYPES : CONTACT_ACCEPTED_FILE_TYPES
    });

    const acceptedFormats = type === DROPZONE_REVIEW ? 'JPG/JPEG/PNG' : 'JPG/JPEG/PNG/PDF';

    return <>
        <div 
            className={`border-dashed border-2 rounded-[8px] pt-5 pb-6 flex flex-col items-center justify-center${
                isDragActive ? ' border-tag-extras bg-[rgba(var(--tag-extras-rgb),0.1)]' : ' border-form-line bg-form-bg'
            }`} 
            {...getRootProps()}
        >
            <input {...getInputProps()} ref={fileInputRef} />
            <CloudUpload className="w-10 h-10 mb-1" strokeWidth={1.5} />
            <p className="text-sm font-medium leading-[24px] mb-[2px]">
                ここにファイルをアップロード
            </p>

            <p className="text-xs font-medium leading-[24px] mb-2">または</p>
            
            <EventButtonSecondary
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                }}
                customClass="mb-3"
                size={BUTTON_LARGE}
                text={BUTTON_JA}
            >
                ファイルを選択
            </EventButtonSecondary>

            <p className="small-note">
                ※対応形式：{acceptedFormats}<br />
                ※容量上限：合計{MAX_TOTAL_SIZE_TEXT}まで
            </p>
        </div>
        <ul>
            <UploadFileStatus
                files={files}
                fileStatuses={fileStatuses}
                removeFile={removeFile}
                removeErrorStatus={removeErrorStatus}
            />
        </ul>
    </>
};

export default DropZone