import prisma from "@/lib/database/prisma/client"

export const createShippingAddressRepository = () => {
    return {
        // 配送先住所の作成
        createShippingAddress: async ({ 
            address 
        }: { address: ShippingAddress }) => {
            return await prisma.shippingAddress.create({
                data: address
            })
        }
    }
}

export const getShippingAddressRepository = () => {
    return {
        // ユーザーのデフォルトの住所データの取得
        getUserDefaultShippingAddress: async ({ 
            userId 
        }: UserIdProps) => {
            return await prisma.shippingAddress.findFirst({
                where: { 
                    user_id: userId, 
                    is_default: true 
                }
            })
        },
        // 個別の住所データの取得
        getShippingAddressById: async ({ 
            addressId 
        }: { addressId: ShippingAddressId }) => {
            return await prisma.shippingAddress.findUnique({
                where: { 
                    id: addressId
                }
            })
        },
        // 全ての住所データの取得
        getUserAllShippingAddresses: async ({ 
            userId 
        }: UserIdProps) => {
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
            ])
        
            return {
                data: {
                    shippingAddresses,
                    totalCount
                }
            }
        }
    }
}

export const updateShippingAddressRepository = () => {
    return {
        // 住所の更新
        updateShippingAddress: async ({ 
            id,
            shippingAddress 
        }: UpdateShippingAddressProps) => {
            return await prisma.shippingAddress.update({
                where: { id },
                data: shippingAddress
            })
        },
        // デフォルトの住所の設定
        updateDefaultShippingAddressesWithTransaction: async ({ 
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
            })
        }
    }
}

export const deleteShippingAddressRepository = () => {
    return {
        // 住所の削除
        deleteShippingAddress: async ({ 
            id 
        }: { id: ShippingAddressId }) => {
            return await prisma.shippingAddress.delete({
                where: { id }
            })
        }
    }
}