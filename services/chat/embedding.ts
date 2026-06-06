import openai from "@/lib/clients/openai/client";

import { CHAT_TEMPLATES } from "@/data/chats";
import { CHAT_CONFIG, EMBEDDING_CONFIG } from "@/constants/index";
import { ERROR_MESSAGES } from "@/constants/errorMessages";

const { INITIAL_USAGE } = EMBEDDING_CONFIG;
const { CHAT_ERROR } = ERROR_MESSAGES;

let monthlyUsage = INITIAL_USAGE;

let templateCache: {
  model: string;
  templates: { embedding: number[]; answer: string }[];
} | null = null;

// コサイン類似度を計算（1に近いほど類似度が高い）
const cosineSimilarity = (a: number[], b: number[]): number => {
  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
};

// 埋め込みモデルの取得
const getEmbeddingModel = (): string | null => {
  return process.env.OPENAI_EMBEDDING_MODEL?.trim() ?? null;
};

// テンプレートの埋め込みの取得
const getTemplateEmbeddings = async (embeddingModel: string) => {
  // キャッシュに同じモデルのデータがあれば API を呼ばずに返す
  if (templateCache?.model === embeddingModel) {
    return templateCache.templates;
  }

  // API を呼び出してテンプレートの埋め込みを取得
  const response = await openai.embeddings.create({
    model: embeddingModel,
    input: CHAT_TEMPLATES.map((template) => template.question),
  });

  // テンプレートの埋め込みを配列に格納
  const templates = response.data.map((item, index) => ({
    embedding: item.embedding,
    answer: CHAT_TEMPLATES[index].answer,
  }));

  // キャッシュに保存
  templateCache = {
    model: embeddingModel,
    templates,
  };

  return templates;
};

// ベクトル検索用の関数
export const findSimilarTemplate = async (userMessage: string) => {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return {
      success: false,
      error: CHAT_ERROR.OPENAI_API_KEY_NOT_SET,
      message: null,
    };
  }

  const embeddingModel = getEmbeddingModel();
  if (!embeddingModel) {
    return {
      success: false,
      error: CHAT_ERROR.OPENAI_EMBEDDING_MODEL_NOT_SET,
      message: null,
    };
  }

  // 使用量が上限を超えている場合はエラーを返す
  if (monthlyUsage >= CHAT_CONFIG.MONTHLY_LIMIT) {
    return {
      success: false,
      error: CHAT_ERROR.MONTHLY_LIMIT_EXCEEDED,
      message: null,
    };
  }

  try {
    // テンプレートの埋め込みを取得
    const templates = await getTemplateEmbeddings(embeddingModel);

    // ユーザーのメッセージの埋め込みを取得
    const userResponse = await openai.embeddings.create({
      model: embeddingModel,
      input: userMessage,
    });

    const userEmbedding = userResponse.data[0].embedding;

    // 最も類似度が高いテンプレートの回答を取得
    let bestScore = -1;
    let bestAnswer: string | null = null;

    // テンプレートの埋め込みとユーザーのメッセージの埋め込みのコサイン類似度を計算
    for (const template of templates) {
      const score = cosineSimilarity(userEmbedding, template.embedding);

      if (score > bestScore) {
        bestScore = score;
        bestAnswer = template.answer;
      }
    }

    // 使用量をカウント
    monthlyUsage++;

    // 類似度が閾値以上の場合のみ回答
    if (bestScore >= CHAT_CONFIG.SIMILARITY_THRESHOLD) {
      return {
        success: true,
        error: null,
        message: bestAnswer,
      };
    }

    return {
      success: false,
      error: null,
      message: null,
    };
  } catch (error) {
    console.error("Actions Error - Embedding search error:", error);

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
    remaining: CHAT_CONFIG.MONTHLY_LIMIT - monthlyUsage,
  };
};
