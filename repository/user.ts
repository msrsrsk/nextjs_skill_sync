import prisma from "@/lib/clients/prisma/client"
import bcrypt from "bcryptjs"

import { GET_USER_DATA_TYPES, PASSWORD_HASH_ROUNDS } from "@/constants/index"

const { EMAIL_DATA, CUSTOMER_ID_DATA } = GET_USER_DATA_TYPES;

interface GetUserProps extends UserIdProps {
    getType?: GetUserDataTypes;
}

export const createUserRepository = () => {
    return {
        // ユーザーの作成
        createUserWithTransaction: async ({
            tx,
            userData 
        }: CreateUserWithTransactionProps) => {
            return await tx.user.create({
                data: userData
            })
        }
    }
}

export const getUserRepository = () => {
    return {
        // ユーザーデータの有無確認
        getUserByEmail: async ({ email }: { email: string }) => {
            return await prisma.user.findUnique({
                where: { email },
                include: {
                    user_profiles: true
                }
            })
        },
        // ユーザーのデータの取得
        getUser: async ({
            userId,
            getType = EMAIL_DATA
        }: GetUserProps) => {
            const getSelectFields = () => {        
                if (getType === CUSTOMER_ID_DATA) {
                    return {
                        user_stripes: {
                            select: {
                                customer_id: true
                            }
                        }
                    };
                }

                return {
                    email: true,
                }
            }
        
            return await prisma.user.findUnique({
                where: { id: userId },
                select: getSelectFields()
            })
        },
        // IDによるユーザーデータの取得
        getUserById: async ({ userId }: UserIdProps) => {
            return await prisma.user.findUnique({
                where: { id: userId },
                select: {
                    email: true,
                    user_profiles: {
                        select: {
                            icon_url: true,
                            lastname: true,
                            firstname: true,
                            tel: true,
                        }
                    },
                    shipping_addresses: {
                        where: {
                            is_default: true
                        },
                        select: {
                            name: true,
                            postal_code: true,
                            state: true,
                            city: true,
                            address_line1: true,
                            address_line2: true
                        }
                    }
                }
            })
        }
    }
}

export const updateUserRepository = () => {
    return {
        // ユーザーのメールアドレスの更新
        updateUserEmail: async ({
            userId,
            email
        }: UpdateUserEmailProps) => {
            return await prisma.user.update({
                where: { id: userId },
                data: { email }
            })
        },
        // ユーザーのパスワードの更新
        updateUserPassword: async ({
            userId,
            password
        }: UpdateUserPasswordProps) => {
            const hashedPassword = await bcrypt.hash(
                password, 
                PASSWORD_HASH_ROUNDS
            );

            return await prisma.user.update({
                where: { id: userId },
                data: { password: hashedPassword }
            })
        },
        // ユーザーのパスワードの更新（トークンの更新）
        updateUserPasswordWithTransaction: async ({
            tx,
            verificationToken,
            password
        }: UpdatedUserPasswordWithTransactionProps) => {
            const hashedPassword = await bcrypt.hash(password, PASSWORD_HASH_ROUNDS);

            return await tx.user.update({
                where: { email: verificationToken.identifier },
                data: { password: hashedPassword }
            })
        }
    }
}

export const deleteUserRepository = () => {
    return {
        // ユーザーの削除
        deleteUser: async ({ userId }: UserIdProps) => {
            return await prisma.user.delete({
                where: { id: userId }
            })
        },
        // ユーザーの削除(トランザクション)
        deleteUserWithTransaction: async ({ 
            tx, 
            userId 
        }: UserWithTransactionProps) => {
            return await tx.user.delete({
                where: { id: userId }
            })
        }
    }
}