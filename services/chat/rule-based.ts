import { CHAT_TEMPLATES } from "@/data/chats"
import { CHAT_SOURCE } from "@/constants/index"

const { RULE_BASED } = CHAT_SOURCE;

// ルールベースの回答を取得する関数
export const getRuleBasedAnswer = (userMessage: string) => {
    const message = userMessage.toLowerCase();
    
    // キーワードによるマッチング
    for (const template of CHAT_TEMPLATES) {
        const matchedKeyword = template.keywords.find(keyword => 
            message.includes(keyword)
        );
        
        if (matchedKeyword) {
            return {
                success: true,
                message: template.answer,
                matchedKeyword,
                source: RULE_BASED
            };
        }
    }
    
    return {
        success: false,
        message: null,
    }
}