import { useState, useCallback } from "react"

import { FILE_STATUS_TYPES, FILE_UPLOAD_CONFIG } from "@/constants/index"

const { FILE_LOADING, FILE_SUCCESS, FILE_ERROR } = FILE_STATUS_TYPES;
const { INITIAL_TOTAL_SIZE } = FILE_UPLOAD_CONFIG;

interface FileStatus {
    file: File;
    type: FileStatusType;
}

export const useFileUpload = (
    files: File[], 
    setFiles: React.Dispatch<React.SetStateAction<File[]>>,
    maxTotalSize: number
) => {
    const [fileStatuses, setFileStatuses] = useState<FileStatus[]>([]);

    const handleFileUpload = useCallback(async (acceptedFiles: File[]) => {
        const currentTotalSize = files.reduce((sum, file) => sum + file.size, INITIAL_TOTAL_SIZE);
        const newTotalSize = acceptedFiles.reduce((sum, file) => sum + file.size, INITIAL_TOTAL_SIZE);
        
        if (currentTotalSize + newTotalSize > maxTotalSize) {
            setFileStatuses(prev => [
                ...prev,
                ...acceptedFiles.map(file => ({
                    file,
                    type: FILE_ERROR
                }))
            ]);
            return;
        }
        
        const newStatuses = acceptedFiles.map(file => ({
            file,
            type: FILE_LOADING
        }));
        setFileStatuses(prev => [...prev, ...newStatuses]);

        try {
            await Promise.all(acceptedFiles.map(async (file) => {
                setFiles(prev => [...prev, file]);
                setFileStatuses(prev => 
                    prev.map(status => 
                        status.file === file ? 
                        { ...status, type: FILE_SUCCESS } : status
                    )
                );
            }));
        } catch (error) {
            setFileStatuses(prev => 
                prev.map(status => 
                    acceptedFiles.includes(status.file) ? 
                    { ...status, type: FILE_ERROR } : status
                )
            );
        }
    }, [files, setFiles, maxTotalSize]);

    const removeFile = useCallback((index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    }, [setFiles]);

    const removeErrorStatus = useCallback((index: number) => {
        setFileStatuses(prev => prev.filter((_, i) => i !== index));
    }, []);

    return {
        fileStatuses,
        handleFileUpload,
        removeFile,
        removeErrorStatus
    };
};