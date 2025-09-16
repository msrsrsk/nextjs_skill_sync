import prisma from "@/lib/database/prisma/client"

import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { SHIPPING_ADDRESS_ERROR } = ERROR_MESSAGES;

// 配送先住所の作成
export const createShippingAddressData = async ({
    address
}: { address: ShippingAddress }) => {
    return await prisma.shippingAddress.create({
        data: address
    })
}

// ユーザーのデフォルトの住所データの取得
export const getDefaultShippingAddressByUserIdData = async ({
    userId
}: { userId: UserId }) => {
    return await prisma.shippingAddress.findFirst({
        where: { 
            user_id: userId, 
            is_default: true 
        }
    })
}

// 個別の住所データの取得
export const getShippingAddressByIdData = async ({
    addressId
}: { addressId: ShippingAddressId }) => {
    return await prisma.shippingAddress.findUnique({
        where: { 
            id: addressId
        }
    })
}

// 全ての住所データの取得
export const getAllShippingAddressesData = async ({
    userId
}: { userId: UserId }) => {
    const [shippingAddresses, totalCount] = await Promise.all([
        prisma.shippingAddress.findMany({
            where: {
                user_id: userId
            },
            orderBy: [
                { created_at: "desc" }
            ]
        }),
        prisma.shippingAddress.count({
            where: {
                user_id: userId
            }
        })
    ]);

    return {
        data: {
            shippingAddresses,
            totalCount
        }
    };
}

// 住所の更新
export const updateShippingAddressData = async ({
    id,
    shippingAddress
}: UpdateShippingAddressProps) => {
    return await prisma.shippingAddress.update({
        where: { id },
        data: shippingAddress
    })
}

// デフォルトの住所の設定
export const setDefaultShippingAddressData = async ({
    addressId
}: { addressId: ShippingAddressId }) => {
    await prisma.$transaction(async (tx) => {
        await tx.shippingAddress.updateMany({
            data: {
                is_default: false
            }
        });

        await tx.shippingAddress.update({
            where: {
                id: addressId
            },
            data: {
                is_default: true
            }
        });
    });
};

// 住所の削除
export const deleteShippingAddressData = async ({ id }: { id: ShippingAddressId }) => {
    return await prisma.shippingAddress.delete({
        where: { id }
    });
}