import { useState, useEffect } from "react"

import { handleChatMessage } from "@/services/chat/hybrid-search"
import { CHAT_CONFIG, CHAT_SENDER_TYPES, CHAT_SOURCE, SITE_MAP } from "@/constants/index"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { MAX_CHAT_MESSAGES } = CHAT_CONFIG;
const { SENDER_USER, SENDER_ADMIN } = CHAT_SENDER_TYPES;
const { CHAT_USER } = CHAT_SOURCE;
const { CHAT_API_PATH } = SITE_MAP;
const { CHAT_ERROR } = ERROR_MESSAGES;

type ChatMessageType = string;

const useChatSend = ({ chats }: { chats: ChatProps[] }) => {
    const [chatMessages, setChatMessages] = useState(chats);
    const [isChatLimitReached, setIsChatLimitReached] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setIsChatLimitReached(
            chatMessages.length >= MAX_CHAT_MESSAGES
        );
    }, [chatMessages.length]);

    const addUserMessageToUI = (message: ChatMessageType) => {
        const userMessage: ChatProps = {
            id: `temp-${Date.now()}`,
            message,
            sent_at: new Date(),
            sender_type: SENDER_USER as ChatSenderType,
            source: CHAT_USER
        };
    
        setChatMessages(prev => [...prev, userMessage]);
    }

    const saveUserMessageToDB = async (message: ChatMessageType) => {
        const response = await fetch(CHAT_API_PATH, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                message, 
                senderType: SENDER_USER,
                source: CHAT_USER
            })
        });
    
        const { 
            success: saveUserSuccess, 
            message: saveUserError 
        } = await response.json();
    
        if (!saveUserSuccess) {
            setError(saveUserError);
            return { success: false };
        }
    
        return { success: true };
    }

    const addAIMessageToUI = (message: ChatMessageType, source: ChatSourceType) => {
        const aiMessage: ChatProps = {
            id: `ai-${Date.now()}`,
            message,
            sender_type: SENDER_ADMIN as ChatSenderType,
            sent_at: new Date(),
            source
        };
        
        setChatMessages(prev => [...prev, aiMessage]);
    }

    const saveAIMessageToDB = async (message: ChatMessageType, source: ChatSourceType) => {
        const response = await fetch(CHAT_API_PATH, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                message,
                senderType: SENDER_ADMIN,
                source
            })
        });
    
        const { success: saveAiSuccess } = await response.json();
    
        if (!saveAiSuccess) {
            setError(CHAT_ERROR.FAILED_SAVE_AI_MESSAGE); // AIメッセージの送信エラー
            return { success: false };
        }
    
        return { success: true };
    }

    const sendMessage = async (message: ChatMessageType) => {
        setLoading(true);
        setError(null);

        // 制限チェック
        if (isChatLimitReached) {
            setLoading(false);
            return { success: false };
        };

        try {
            // ユーザーメッセージを楽観的UIで表示
            addUserMessageToUI(message);

            // ユーザーメッセージをデータベースに保存
            const saveUserResult = await saveUserMessageToDB(message);
            if (!saveUserResult.success) {
                return { success: false };
            }

            // AIによる回答を生成
            const { 
                success: aiResponseSuccess, 
                message: aiResponseError, 
                source: aiResponseSource 
            } = await handleChatMessage(message);

            if (aiResponseSuccess) {
                addAIMessageToUI(aiResponseError, aiResponseSource);
                
                const saveAiResult = await saveAIMessageToDB(
                    aiResponseError, 
                    aiResponseSource
                );
                if (!saveAiResult.success) {
                    return { success: false };
                }
            }

            return { success: true };
        } catch (error) {
            console.error('Hook Error - Send Chat Message error:', error);
            setError(CHAT_ERROR.SEND_FAILED);

            return { success: false };
        } finally {
            setLoading(false);
        }
    }

    return {
        chatMessages,
        loading,
        error,
        sendMessage,
        isChatLimitReached
    }
}

export default useChatSend