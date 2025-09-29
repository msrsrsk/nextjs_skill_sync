import { useState, useEffect } from "react"

import { handleChatMessage } from "@/lib/services/chat/hybrid-search"
import { CHAT_CONFIG, CHAT_SENDER_TYPES, CHAT_SOURCE, SITE_MAP } from "@/constants/index"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { MAX_CHAT_MESSAGES } = CHAT_CONFIG;
const { SENDER_USER, SENDER_ADMIN } = CHAT_SENDER_TYPES;
const { CHAT_USER } = CHAT_SOURCE;
const { CHAT_API_PATH } = SITE_MAP;
const { CHAT_ERROR } = ERROR_MESSAGES;

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

    const sendMessage = async (message: string) => {
        setLoading(true);
        setError(null);

        // 制限チェック
        if (isChatLimitReached) {
            setLoading(false);
            return { success: false };
        };

        try {
            // ユーザーメッセージを楽観的UIで表示
            const userMessage: ChatProps = {
                id: `temp-${Date.now()}`,
                message,
                sent_at: new Date(),
                sender_type: SENDER_USER as ChatSenderType,
                source: CHAT_USER
            };

            setChatMessages(prev => [...prev, userMessage]);

            // ユーザーメッセージをデータベースに保存
            const saveUserMessage = await fetch(CHAT_API_PATH, {
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
            } = await saveUserMessage.json();

            if (!saveUserSuccess) {
                setError(saveUserError);
                return { success: false };
            }

            // AIによる回答を生成
            const { 
                success: aiResponseSuccess, 
                message: aiResponseError, 
                source: aiResponseSource 
            } = await handleChatMessage(message);

            if (aiResponseSuccess) {
                const aiMessage: ChatProps = {
                    id: `ai-${Date.now()}`,
                    message: aiResponseError,
                    sender_type: SENDER_ADMIN as ChatSenderType,
                    sent_at: new Date(),
                    source: aiResponseSource 
                };
                
                setChatMessages(prev => [...prev, aiMessage]);

                const saveAiMessage = await fetch(CHAT_API_PATH, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ 
                        message: aiResponseError,
                        senderType: SENDER_ADMIN,
                        source: aiResponseSource
                    })
                });

                const { success: saveAiSuccess } = await saveAiMessage.json();

                if (!saveAiSuccess) {
                    setError(CHAT_ERROR.FAILED_SAVE_AI_MESSAGE); // AIメッセージの送信エラー
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