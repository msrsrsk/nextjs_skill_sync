import { OpenAIEmbeddings } from "@langchain/openai"
import { MemoryVectorStore } from "langchain/vectorstores/memory"

import { CHAT_TEMPLATES } from "@/data/chats"
import { CHAT_CONFIG, EMBEDDING_CONFIG } from "@/constants/index"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { INITIAL_USAGE, SEARCH_RESULTS_COUNT } = EMBEDDING_CONFIG;
const { CHAT_ERROR } = ERROR_MESSAGES;

const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY,
});

let monthlyUsage = INITIAL_USAGE;

// ベクトル検索用の関数
export const findSimilarTemplate = async (userMessage: string) => {
    // 使用量のチェック
    if (monthlyUsage >= CHAT_CONFIG.MONTHLY_LIMIT) {
        return {
            success: false,
            error: CHAT_ERROR.MONTHLY_LIMIT_EXCEEDED,
            message: null,
        };
    }

    try {
        // テンプレートの質問文をベクトル化
        const texts = CHAT_TEMPLATES.map(template => template.question);
        const metadatas = CHAT_TEMPLATES.map(template => ({
            id: template.id,
            category: template.category,
            answer: template.answer
        }));

        // ベクトルストアを作成
        const vectorStore = await MemoryVectorStore.fromTexts(
            texts,
            metadatas,
            embeddings
        );

        // ユーザーメッセージと類似度検索
        const results = await vectorStore.similaritySearchWithScore(
            userMessage,
            SEARCH_RESULTS_COUNT
        );

        // 使用量をカウント
        monthlyUsage++;

        if (results.length > 0) {
            const [document, score] = results[0];
            
            // 類似度が閾値以上の場合のみ回答
            if (score > CHAT_CONFIG.SIMILARITY_THRESHOLD) {
                return {
                    success: true,
                    error: null,
                    message: document.metadata.answer,
                };
            }
        }

        return {
            success: false,
            error: null,
            message: null,
        };
    } catch (error) {
        console.error('Actions Error - Embedding search error:', error);

        return {
            success: false,
            error: CHAT_ERROR.EMBEDDING_SEARCH_FAILED,
            message: null,
        };
    }
};

// 使用量のリセット（月次）
export const resetMonthlyUsage = () => {
    monthlyUsage = INITIAL_USAGE;
};

// 使用量の取得
export const getUsageStats = () => {
    return {
        currentUsage: monthlyUsage,
        limit: CHAT_CONFIG.MONTHLY_LIMIT,
        remaining: CHAT_CONFIG.MONTHLY_LIMIT - monthlyUsage
    };
};