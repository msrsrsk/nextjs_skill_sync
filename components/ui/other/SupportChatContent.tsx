"use client"

import Image from "next/image"
import TextareaAutosize from 'react-textarea-autosize'

import FormErrorText from "@/components/common/forms/FormErrorText"
import LoadingSpinner from "@/components/common/display/LoadingSpinner"
import ErrorMessage from "@/components/common/display/ErrorMessage"
import AlertBox from "@/components/common/forms/AlertBox"
import useChatSend from "@/hooks/chat/useChatSend"
import useChatMessageValidation from "@/hooks/validation/useChatMessageValidation"
import useScrollToBottom from "@/hooks/utils/useScrollToBottom"
import { formatDateTime } from "@/lib/utils/format"
import { 
    CHAT_HISTORY_DELETE_MONTH, 
    CHAT_SENDER_TYPES, 
    CHAT_SOURCE,
    ANONYMOUS_USER_ICON_URL
} from "@/constants/index"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { SENDER_USER, SENDER_ADMIN } = CHAT_SENDER_TYPES;
const { RULE_BASED, EMBEDDING_SEARCH, STAFF_CONFIRMING } = CHAT_SOURCE;
const { CHAT_ERROR } = ERROR_MESSAGES;

interface SupportChatContentProps {
    chats: ChatProps[]
    user: {
        user_profiles: {
            icon_url: string;
        } | null;
    }
}

const SupportChatContent = ({ chats, user }: SupportChatContentProps) => {
    const { 
        chatMessage, 
        handleChatMessageChange,
        errorList,
        isValid,
        resetChatMessage
    } = useChatMessageValidation();
    
    const { 
        chatMessages, 
        loading, 
        error, 
        sendMessage,
        isChatLimitReached
    } = useChatSend({ chats });
    
    const { scrollRef, scrollToBottom } = useScrollToBottom();

    if (error) return <ErrorMessage message={error} />

    const isAIResponse = (chat: ChatProps) => {
        return chat.sender_type === SENDER_ADMIN && 
            (chat.source === RULE_BASED || chat.source === EMBEDDING_SEARCH || chat.source === STAFF_CONFIRMING);
    }
    
    const handleSendMessage = async () => {
        const result = await sendMessage(chatMessage);
        if (result.success) {
            resetChatMessage();
            scrollToBottom();
        };
    }

    const iconUrl = user?.user_profiles?.icon_url || ANONYMOUS_USER_ICON_URL;

    const isDisabled = !isValid || loading || isChatLimitReached;

    return <>
        <p className="text-sm leading-[26px] font-medium text-center mb-4">
            ※毎月 {CHAT_HISTORY_DELETE_MONTH} 日に過去のチャットデータは<br className="md:hidden" />
            自動的に削除されます
        </p>

        <div className="max-w-xl mx-auto grid gap-3 md:gap-4">
            <div className="bg-soft-white rounded-sm pt-5 pl-5 pr-[10px] pb-6 md:pt-10 md:pl-10 md:pr-3 md:pb-11 min-h-[400px] max-h-[600px] md:max-h-[800px] flex flex-col relative">

                {/* チャット送信中のローディング */}
                {loading && <>
                    <div className="absolute inset-0 flex items-center justify-center z-20">
                        <LoadingSpinner />
                    </div>
                    <div className="absolute inset-0 bg-white/50 z-10 rounded-sm" />
                </>}

                {/* チャットの内容 */}
                <div 
                    className="overflow-y-auto flex-1 pr-[10px] md:pr-7 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-sub [&::-webkit-scrollbar-thumb]:rounded-full"
                    ref={scrollRef}
                >
                    <div className="grid gap-5 md:gap-4">
                        {chatMessages.map((chat, index) => {
                            const isUser = chat.sender_type === SENDER_USER;
                            const isAdmin = chat.sender_type === SENDER_ADMIN;

                            return (
                                <div 
                                    key={chat.id}
                                    className={`chat-message-item${
                                        isUser ? " flex-row-reverse" : ""
                                    }`}
                                >
                                    <div className="chat-message-imagebox">
                                        <Image 
                                            src={
                                                isAdmin 
                                                ? "/assets/icons/support-chat-icon.png"
                                                : iconUrl
                                            }
                                            alt="アイコン画像"
                                            width={56}
                                            height={56}
                                            className="image-common"
                                        />
                                    </div>
                                    <div className={`chat-message-textwrap${
                                        isUser ? " justify-end" : ""
                                    }`}>
                                        {isAdmin && (
                                            <p className="chat-message-label font-bold">
                                                サポート担当者{isAIResponse(chat) ? "（AI）" : ""}
                                            </p>
                                        )}
                                        <div className={`chat-message-textbox${
                                            isAdmin ? " rounded-ee-sm" : " rounded-es-sm"
                                        }`}>
                                            <p className="chat-message-text whitespace-pre-line">
                                                {chat.message}
                                            </p>
                                        </div>
                                        {index !== 0 && (
                                            <p className={`chat-message-label font-semibold font-poppins${
                                                isUser ? " text-right" : ""
                                            }`}>
                                                {formatDateTime(chat.sent_at)}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* チャット送信フォーム */}
            <div className="max-w-[640px] w-full mx-auto">
                <div className="flex gap-2 md:gap-0 items-end border-b border-foreground">
                    <TextareaAutosize 
                        name="chatMessage"
                        className="w-full bg-transparent box-border py-4 px-3 md:p-5 text-base leading-[24px] font-medium placeholder:text-sub focus:outline-none resize-none"
                        placeholder="メッセージを入力してください"
                        value={chatMessage}
                        onChange={handleChatMessageChange}
                        disabled={isChatLimitReached}
                    />
                    <button 
                        className="text-sm button-primary min-w-[64px] min-h-[34px] disabled:opacity-40 mb-[11px] md:mb-[11px]"
                        onClick={handleSendMessage}
                        disabled={isDisabled}
                    >
                        送信
                    </button>
                </div>
                <div className="px-3 md:px-5">
                    <FormErrorText errorList={errorList} />
                </div>
                {isChatLimitReached && (
                    <div className="mt-6">
                        <AlertBox 
                            message={CHAT_ERROR.LIMIT_WARNING} 
                            showError={isChatLimitReached}
                        />
                    </div>
                )}
            </div>
        </div>
    </>
}

export default SupportChatContent