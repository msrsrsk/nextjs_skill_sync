import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import { CHAT_CONFIG } from "@/constants";
import { CHAT_TEMPLATES } from "@/data/chats";
import { ERROR_MESSAGES } from "@/constants/errorMessages";

const { CHAT_ERROR } = ERROR_MESSAGES;

const HIGH_SIMILARITY_EMBEDDING = [1, 0, 0];
const LOW_SIMILARITY_EMBEDDING = [0, 1, 0];
const TEST_EMBEDDING_MODEL = "text-embedding-ada-002";

const { mockEmbeddingsCreate } = vi.hoisted(() => ({
  mockEmbeddingsCreate: vi.fn(),
}));

vi.mock("@/lib/clients/openai/client", () => ({
  default: {
    embeddings: {
      create: mockEmbeddingsCreate,
    },
  },
}));

let findSimilarTemplate: typeof import("@/services/chat/embedding").findSimilarTemplate;
let resetMonthlyUsage: typeof import("@/services/chat/embedding").resetMonthlyUsage;
let getUsageStats: typeof import("@/services/chat/embedding").getUsageStats;

const setEnv = (key: string, value?: string) => {
  if (value === undefined) {
    delete process.env[key];
  } else {
    process.env[key] = value;
  }
};

const createEmbeddingResponse = (embeddings: number[][]) => ({
  data: embeddings.map((embedding, index) => ({
    embedding,
    index,
  })),
});

const setupHighSimilarityMock = () => {
  mockEmbeddingsCreate.mockImplementation(
    async ({ input }: { input: string | string[] }) => {
      if (Array.isArray(input)) {
        return createEmbeddingResponse(
          input.map(() => HIGH_SIMILARITY_EMBEDDING),
        );
      }

      return createEmbeddingResponse([HIGH_SIMILARITY_EMBEDDING]);
    },
  );
};

const setupLowSimilarityMock = () => {
  mockEmbeddingsCreate.mockImplementation(
    async ({ input }: { input: string | string[] }) => {
      if (Array.isArray(input)) {
        return createEmbeddingResponse(
          input.map(() => HIGH_SIMILARITY_EMBEDDING),
        );
      }

      return createEmbeddingResponse([LOW_SIMILARITY_EMBEDDING]);
    },
  );
};

const getModule = async () => {
  const mod = await import("@/services/chat/embedding");

  findSimilarTemplate = mod.findSimilarTemplate;
  resetMonthlyUsage = mod.resetMonthlyUsage;
  getUsageStats = mod.getUsageStats;
};

/* ====================================
  findSimilarTemplate Test
==================================== */
describe("embedding", () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    vi.resetModules();

    setEnv("OPENAI_API_KEY", "test-key");
    setEnv("OPENAI_EMBEDDING_MODEL", TEST_EMBEDDING_MODEL);

    setupHighSimilarityMock();
    await getModule();
    resetMonthlyUsage();
  });

  afterEach(() => {
    vi.unstubAllEnvs?.();
  });

  it("作成成功（類似スコアが閾値を超えた場合）", async () => {
    const result = await findSimilarTemplate("question");

    expect(result.success).toBe(true);
    expect(result.error).toBeNull();
    expect(result.message).toBe(CHAT_TEMPLATES[0].answer);
  });

  it("作成失敗（APIキー未設定）", async () => {
    setEnv("OPENAI_API_KEY", undefined);

    const result = await findSimilarTemplate("hello");

    expect(result.success).toBe(false);
    expect(result.error).toBe(CHAT_ERROR.OPENAI_API_KEY_NOT_SET);
    expect(result.message).toBeNull();
  });

  it("作成失敗（埋め込みモデル未設定）", async () => {
    setEnv("OPENAI_EMBEDDING_MODEL", undefined);

    const result = await findSimilarTemplate("hello");

    expect(result.success).toBe(false);
    expect(result.error).toBe(CHAT_ERROR.OPENAI_EMBEDDING_MODEL_NOT_SET);
    expect(result.message).toBeNull();
  });

  it("作成失敗（月次上限超過）", async () => {
    for (let i = 0; i < CHAT_CONFIG.MONTHLY_LIMIT; i++) {
      await findSimilarTemplate("hello");
    }

    const result = await findSimilarTemplate("hello");

    expect(result.success).toBe(false);
    expect(result.error).toBe(CHAT_ERROR.MONTHLY_LIMIT_EXCEEDED);
    expect(result.message).toBeNull();
  });

  it("作成失敗（類似スコアが閾値以下）", async () => {
    setupLowSimilarityMock();

    const result = await findSimilarTemplate("question");

    expect(result.success).toBe(false);
    expect(result.error).toBeNull();
    expect(result.message).toBeNull();
  });

  it("作成失敗（例外発生）", async () => {
    mockEmbeddingsCreate.mockRejectedValue(new Error("api error"));

    const result = await findSimilarTemplate("question");

    expect(result.success).toBe(false);
    expect(result.error).toBe(CHAT_ERROR.EMBEDDING_SEARCH_FAILED);
    expect(result.message).toBeNull();
  });

  it("使用量のカウントとリセットの機能確認", async () => {
    const before = getUsageStats();

    await findSimilarTemplate("q1");

    const mid = getUsageStats();

    resetMonthlyUsage();

    const after = getUsageStats();

    expect(mid.currentUsage).toBe(before.currentUsage + 1);
    expect(after.currentUsage).toBe(0);
  });
});
