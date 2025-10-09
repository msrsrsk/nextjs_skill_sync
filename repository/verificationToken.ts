import prisma from "@/lib/clients/prisma/client"

export const createVerificationTokenRepository = () => {
    return {
        // トークンの作成
        createVerificationToken: async ({ 
            verificationData 
        }: { verificationData: VerificationData }) => {
            await prisma.verificationToken.create({
                data: verificationData
            })
        },
        // メールアドレスの認証のトークンの作成
        createEmailVerificationToken: async ({ 
            emailVerificationData 
        }: { emailVerificationData: Omit<VerificationData, 'password' | 'userData'> }) => {
            await prisma.verificationToken.create({
                data: emailVerificationData
            })
        }
    }
}

export const getVerificationTokenRepository = () => {
    return {
        // トークンの取得
        getVerificationToken: async ({ token }: TokenProps) => {
            const verificationToken = await prisma.verificationToken.findUnique({
                where: { token }
            })
            
            return verificationToken;
        }
    }
}

export const deleteVerificationTokenRepository = () => {
    return {
        // トークンの削除（トランザクション）
        deleteVerificationTokenWithTransaction: async ({ 
            tx, 
            token 
        }: DeleteVerificationTokenWithTransactionProps) => {
            return await tx.verificationToken.delete({
                where: { token }
            })
        }
    }
}