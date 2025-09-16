import prisma from "@/lib/database/prisma/client"

interface TokenActionsProps {
    token: string;
}

interface DeleteVerificationTokenWithTransactionProps extends TokenActionsProps {
    tx: TransactionClient;
}

// トークンの作成
export const createVerificationTokenData = async ({
    verificationData
}: { verificationData: VerificationData }) => {
    await prisma.verificationToken.create({
        data: verificationData
    })
}

// メールアドレスの認証のトークンの作成
export const createEmailVerificationTokenData = async ({
    emailVerificationData
}: { emailVerificationData: Omit<VerificationData, 'password' | 'userData'> }) => {
    await prisma.verificationToken.create({
        data: emailVerificationData
    })
}

// トークンの取得
export const getVerificationTokenData = async ({
    token
}: TokenActionsProps) => {
    const verificationToken = await prisma.verificationToken.findUnique({
        where: { token }
    })
    return verificationToken;
}

// トークンの削除
export const deleteVerificationTokenData = async ({
    token
}: TokenActionsProps) => {
    await prisma.verificationToken.delete({
        where: { token }
    })
}

// トークンの削除（トランザクション）
export const deleteVerificationTokenWithTransaction = async ({
    tx,
    token
}: DeleteVerificationTokenWithTransactionProps) => {
    return await tx.verificationToken.delete({
        where: { token }
    })
}