import prisma from "@/lib/database/prisma/client"
import bcrypt from "bcryptjs"

import { GET_USER_DATA_TYPES, PASSWORD_HASH_ROUNDS } from "@/constants/index"

const { EMAIL_DATA, CUSTOMER_ID_DATA } = GET_USER_DATA_TYPES;

interface CreateUserWithTransactionProps {
    tx: TransactionClient;
    userData: CreateUserData;
}

interface GetUserDataProps extends UserIdProps {
    getType: GetUserDataTypes;
}

interface UpdatedUserPasswordWithTransactionProps {
    tx: TransactionClient;
    verificationToken: VerificationData;
    password: UserPassword;
}

const defaultUserSelectFields = {
    icon_url: true,
    lastname: true,
    firstname: true,
    email: true,
    tel: true,
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

// ユーザーデータの有無確認
export const checkExistingUserData = async ({ email }: { email: string }) => {
    return await prisma.user.findUnique({
        where: { email }
    })
}

// ユーザーの作成
export const createUserWithTransaction = async ({
    tx,
    userData
}: CreateUserWithTransactionProps) => {
    return await tx.user.create({
        data: userData
    })
}

// ユーザーのデータの取得
export const getUserData = async ({
    userId,
    getType
}: GetUserDataProps) => {
    const getSelectFields = () => {
        if (getType === EMAIL_DATA) {
            return {
                email: true,
            };
        }

        if (getType === CUSTOMER_ID_DATA) {
            return {
                stripe_customer_id: true 
            };
        }

        return {
            ...defaultUserSelectFields
        };
    };

    return await prisma.user.findUnique({
        where: { id: userId },
        select: getSelectFields()
    })
}

// IDによるユーザーのデータの取得
export const getUserByIdData = async ({ userId }: { userId: UserId }) => {
    return await prisma.user.findUnique({
        where: { id: userId },
        select: {
            icon_url: true,
            lastname: true,
            firstname: true,
            email: true,
            tel: true,
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
    });
}

// ユーザーのStripeIDの更新（デフォルト住所の設定による更新）
export const updateStripeCustomerIdData = async ({
    userId,
    customerId
}: UpdateStripeCustomerIdProps) => {
    return await prisma.user.update({
        where: { id: userId },
        data: { stripe_customer_id: customerId }
    });
}

// ユーザーのアイコン画像の更新
export const updateUserIconUrlData = async ({
    userId,
    iconUrl
}: UpdateUserIconUrlProps) => {
    return await prisma.user.update({
        where: { id: userId },
        data: { icon_url: iconUrl }
    });
}

// ユーザーの名前の更新
export const updateUserNameData = async ({
    userId,
    lastname,
    firstname
}: UpdateUserNameProps) => {
    return await prisma.user.update({
        where: { id: userId },
        data: { lastname, firstname }
    });
}

// ユーザーの電話番号の更新
export const updateUserTelData = async ({
    userId,
    tel
}: UpdateUserTelProps) => {
    return await prisma.user.update({
        where: { id: userId },
        data: { tel }
    });
}

// ユーザーのメールアドレスの更新
export const updateUserEmailData = async ({
    userId,
    email
}: UpdateUserEmailProps) => {
    return await prisma.user.update({
        where: { id: userId },
        data: { email }
    });
}

// ユーザーのパスワードの更新
export const updateUserPasswordData = async ({
    userId,
    password
}: UpdateUserPasswordProps) => {
    const hashedPassword = await bcrypt.hash(password, PASSWORD_HASH_ROUNDS);

    return await prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword }
    });
}

// ユーザーのパスワードの更新（トークンの更新）
export const updatedUserPasswordWithTransaction = async ({
    tx,
    verificationToken,
    password
}: UpdatedUserPasswordWithTransactionProps) => {
    const hashedPassword = await bcrypt.hash(password, PASSWORD_HASH_ROUNDS);

    return await tx.user.update({
        where: { email: verificationToken.identifier },
        data: { password: hashedPassword }
    });
}

// ユーザーの削除
export const deleteUserData = async ({ userId }: { userId: string }) => {
    return await prisma.user.delete({
        where: { id: userId }
    })
}