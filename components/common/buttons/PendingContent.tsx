interface PendingContentProps {
    pending: boolean;
    text: string;
}

const PendingContent = ({ 
    pending, 
    text 
}: PendingContentProps) => {
    return <>
        {pending ? <>
            処理中...
            <span className="loading-spinner"></span>
        </> : (
            text
        )}
    </>
}

export default PendingContent