import { getRuleBasedAnswer } from "@/services/chat/rule-based"
import { findSimilarTemplate } from "@/services/chat/embedding"
import { CHAT_CONFIG, CHAT_SOURCE } from "@/constants/index"

const { RULE_BASED, EMBEDDING_SEARCH, STAFF_CONFIRMING } = CHAT_SOURCE;

export const handleChatMessage = async (userMessage: string) => {
    // 1. ルールベースの検索
    if (CHAT_CONFIG.ENABLE_RULE_BASED) {
        const ruleBasedResult = getRuleBasedAnswer(userMessage);
        if (ruleBasedResult.success) {
            return {
                ...ruleBasedResult,
                isAutoReply: true,
                source: RULE_BASED
            }
        }
    }

    // 2. OpenAI Embeddingによるベクトル検索
    if (CHAT_CONFIG.ENABLE_EMBEDDING) {
        const embeddingResult = await findSimilarTemplate(userMessage);
        if (embeddingResult.success) {
            return {
                success: true,
                message: embeddingResult.message,
                isAutoReply: true,
                source: EMBEDDING_SEARCH
            }
        }
    }

    // 3. スタッフ対応が必要な場合
    return {
        success: true,
        message: CHAT_CONFIG.DEFAULT_HUMAN_RESPONSE,
        isAutoReply: false,
        source: STAFF_CONFIRMING
    }
}