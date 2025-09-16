import { auth } from "@/lib/auth"
import { supabase, createAuthClient } from "@/lib/clients/supabase/client"

// Prisma ではなく Supabase クライアントを用いたデータ取得のテスト
const TestPage = async () => {
    try {
        /* ============================== 
            Review 関連 （ログイン&ログアウトテスト OK）
        ============================== */

        // const supabase = await createAuthClient()

        // const session = await auth()
        // const testUserId = session?.user?.id
        // const testUserId = "c6c2f079-6fb6-4c45-9870-40e86dd7a2f9"

        // SELECT: 承認済みの全てのデータ取得可能 ✅

        // const { data, error } = await supabase.from('reviews').select('*')

        // if (error) {
        //     console.error('Select Reviews Table error:', error)
        //     return (
        //         <div className="c-container-page">
        //             <h1>エラーが発生しました</h1>
        //             <pre>{JSON.stringify(error, null, 2)}</pre>
        //         </div>
        //     )
        // }

        // const approvedCount = data?.filter(item => item.is_approved === true).length || 0
        // const unapprovedCount = data?.filter(item => item.is_approved === false).length || 0

        // INSERT: ログインユーザーのみ追加可能 ✅

        // const { data, error } = await supabase
        //     .from("reviews")
        //     .insert({
        //         user_id: testUserId,
        //         product_id: "8baedad7-8af3-441f-86de-42ab4b330a76",
        //         name: "Vitest User",
        //         rating: 5,
        //         comment: "Vitest User Comment",
        //         image_urls: [],
        //         is_approved: true,
        //     })
        //     .select()

        // if (error) {
        //     console.error('Insert Reviews Table error:', error)
        //     return (
        //         <div className="c-container-page">
        //             <h1>エラーが発生しました</h1>
        //             <pre>{JSON.stringify(error, null, 2)}</pre>
        //         </div>
        //     )
        // }

        // UPDATE: オーナーのみ更新可能 ✅

        // const { data, error } = await supabase
        //         .from("reviews")
        //         .update({
        //             comment: "Vitest User Comment Update",
        //         })
        //         .eq("id", "3df57ac3-ac40-4663-9b3a-9d2fdf1084f5")

        //     if (error) {
        //         console.error('Update Reviews Table error:', error)
        //         return (
        //             <div className="c-container-page">
        //                 <h1>エラーが発生しました</h1>
        //                 <pre>{JSON.stringify(error, null, 2)}</pre>
        //             </div>
        //         )
        //     }

        // DELETE: 自分のレビューのみ削除可能 ✅

        // 自分のレビュー削除テスト
        // const { data, error } = await supabase
        //     .from("reviews")
        //     .delete()
        //     .eq("id", "e4456365-dfaa-4780-bba1-b762d1184a73")

        // 他のユーザーのレビュー削除テスト
        // const { data, error } = await supabase
        //     .from("reviews")
        //     .delete()
        //     .eq("id", "3b2844aa-f78d-4ce8-baaa-1faa23f31781")

        // if (error) {
        //     console.error('Delete Reviews Table error:', error)
        //     return (
        //         <div className="c-container-page">
        //             <h1>エラーが発生しました</h1>
        //             <pre>{JSON.stringify(error, null, 2)}</pre>
        //         </div>
        //     )
        // }


        /* ============================== 
            User 関連 （ログイン&ログアウトテスト OK）
        ============================== */

        // SELECT: 自分のデータのみ取得可能  ✅

        // const { data, error } = await supabase.from('users').select('*')

        // if (error) {
        //     console.error('Select Users Table error:', error)
        //     return (
        //         <div className="c-container-page">
        //             <h1>エラーが発生しました</h1>
        //             <pre>{JSON.stringify(error, null, 2)}</pre>
        //         </div>
        //     )
        // }

        // INSERT: 誰でも追加可能 ✅

        // const { data, error } = await supabase
        //     .from("users")
        //     .insert({
        //         lastname: "北原",
        //         firstname: "テスト3",
        //         email: "test3@example.com",
        //         password: "password",
        //         icon_url: "/assets/icons/avatar02.png",
        //         updated_at: new Date().toISOString(),
        //     })

        // if (error) {
        //     console.error('Insert Users Table error:', error)
        //     return (
        //         <div className="c-container-page">
        //             <h1>エラーが発生しました</h1>
        //             <pre>{JSON.stringify(error, null, 2)}</pre>
        //         </div>
        //     )
        // }

        // UPDATE: 自分のデータのみ更新可能 ✅

        // 自分のデータ更新テスト
        // const { data, error } = await supabase
        //         .from("users")
        //         .update({
        //             lastname: "北原",
        //             firstname: "テスト2",
        //         })
                // .eq("id", testUserId)

        // 他のユーザーのデータ更新テスト
        // const { data, error } = await supabase
        //         .from("users")
        //         .update({
        //             lastname: "北原",
        //             firstname: "テスト2",
        //         })
        //         .eq("id", "74e26485-6424-4cd3-91cf-8aa3fa826279")

        //     if (error) {
        //         console.error('Update Users Table error:', error)
        //         return (
        //             <div className="c-container-page">
        //                 <h1>エラーが発生しました</h1>
        //                 <pre>{JSON.stringify(error, null, 2)}</pre>
        //             </div>
        //         )
        //     }

        // DELETE: 自分のデータのみ削除可能 ✅

        // const { data, error } = await supabase
        //     .from("users")
        //     .delete()
        //     .eq("id", testUserId)

        // if (error) {
        //     console.error('Delete Users Table error:', error)
        //     return (
        //         <div className="c-container-page">
        //             <h1>エラーが発生しました</h1>
        //             <pre>{JSON.stringify(error, null, 2)}</pre>
        //         </div>
        //     )
        // }


        /* ============================== 
            Product 関連
        ============================== */

        // SELECT: 誰でも取得可能  ✅

        // const { data, error } = await supabase.from('products').select('*')

        // if (error) {
        //     console.error('Select Products Table error:', error)
        //     return (
        //         <div className="c-container-page">
        //             <h1>エラーが発生しました</h1>
        //             <pre>{JSON.stringify(error, null, 2)}</pre>
        //         </div>
        //     )
        // }

        // INSERT: オーナーのみ追加可能 ✅

        // const { data, error } = await supabase
        //     .from("products")
        //     .insert({
        //         title: "テスト商品",
        //         description: "テスト商品の説明",
        //         price: 1000,
        //         category: "Unique",
        //         skill_type: "テスト",
        //         slug: "test-product",
        //     })

        // if (error) {
        //     console.error('Insert Products Table error:', error)
        //     return (
        //         <div className="c-container-page">
        //             <h1>エラーが発生しました</h1>
        //             <pre>{JSON.stringify(error, null, 2)}</pre>
        //         </div>
        //     )
        // }

        // UPDATE: オーナーのみ更新可能 ✅

        // const { data, error } = await supabase
        //         .from("products")
        //         .update({
        //             title: "Basketball Skill 2",
        //         })
        //         .eq("id", "0143900c-7a64-4021-ad11-5bf9cd66cb2f")

        //     if (error) {
        //         console.error('Update Products Table error:', error)
        //         return (
        //             <div className="c-container-page">
        //                 <h1>エラーが発生しました</h1>
        //                 <pre>{JSON.stringify(error, null, 2)}</pre>
        //             </div>
        //         )
        //     }

        // DELETE: オーナーのみ削除可能 ✅

        // const { data, error } = await supabase
        //     .from("products")
        //     .delete()
        //     .eq("id", "0143900c-7a64-4021-ad11-5bf9cd66cb2f")

        // if (error) {
        //     console.error('Delete Products Table error:', error)
        //     return (
        //         <div className="c-container-page">
        //             <h1>エラーが発生しました</h1>
        //             <pre>{JSON.stringify(error, null, 2)}</pre>
        //         </div>
        //     )
        // }


        /* ============================== 
            Notification 関連
        ============================== */

        // SELECT: オーナーのみ取得可能  ✅

        // const { data, error } = await supabase.from('notifications').select('*')

        // if (error) {
        //     console.error('Select Notifications Table error:', error)
        //     return (
        //         <div className="c-container-page">
        //             <h1>エラーが発生しました</h1>
        //             <pre>{JSON.stringify(error, null, 2)}</pre>
        //         </div>
        //     )
        // }

        // INSERT: オーナーのみ追加可能 ✅

        // const { data, error } = await supabase
        //     .from("notifications")
        //     .insert({
        //         type: "chat",
        //     })

        // if (error) {
        //     console.error('Insert Notifications Table error:', error)
        //     return (
        //         <div className="c-container-page">
        //             <h1>エラーが発生しました</h1>
        //             <pre>{JSON.stringify(error, null, 2)}</pre>
        //         </div>
        //     )
        // }

        // UPDATE: オーナーのみ更新可能 ✅

        // const { data, error } = await supabase
        //         .from("notifications")
        //         .update({
        //             type: "chat",
        //         })
        //         .eq("id", "722350b2-7b90-4a8b-93fc-05bda21dc3e4")

        //     if (error) {
        //         console.error('Update Notifications Table error:', error)
        //         return (
        //             <div className="c-container-page">
        //                 <h1>エラーが発生しました</h1>
        //                 <pre>{JSON.stringify(error, null, 2)}</pre>
        //             </div>
        //         )
        //     }

        // DELETE: オーナーのみ削除可能 ✅

        // const { data, error } = await supabase
        //     .from("notifications")
        //     .delete()
        //     .eq("id", "722350b2-7b90-4a8b-93fc-05bda21dc3e4")

        // if (error) {
        //     console.error('Delete Notifications Table error:', error)
        //     return (
        //         <div className="c-container-page">
        //             <h1>エラーが発生しました</h1>
        //             <pre>{JSON.stringify(error, null, 2)}</pre>
        //         </div>
        //     )
        // }


        /* ============================== 
            Chat Room 関連 （ログイン&ログアウトテスト OK）
        ============================== */

        // SELECT: 自分のデータのみ取得可能  ✅

        // const { data, error } = await supabase.from('chat_rooms').select('*')

        // if (error) {
        //     console.error('Select Chat Rooms Table error:', error)
        //     return (
        //         <div className="c-container-page">
        //             <h1>エラーが発生しました</h1>
        //             <pre>{JSON.stringify(error, null, 2)}</pre>
        //         </div>
        //     )
        // }

        // INSERT: ログインユーザーのみ追加可能 ✅

        // user_id UUID UNIQUE であることを確認済み
        // const { data, error } = await supabase
        //     .from("chat_rooms")
        //     .insert({
        //         user_id: testUserId,
        //     })

        // if (error) {
        //     console.error('Insert Chat Rooms Table error:', error)
        //     return (
        //         <div className="c-container-page">
        //             <h1>エラーが発生しました</h1>
        //             <pre>{JSON.stringify(error, null, 2)}</pre>
        //         </div>
        //     )
        // }

        // UPDATE: オーナーのみ更新可能 ✅

        // const { data, error } = await supabase
        //         .from("chat_rooms")
        //         .update({
        //             created_at: new Date().toISOString(),
        //         })
        //         .eq("user_id", testUserId)

        //     if (error) {
        //         console.error('Update Chat Rooms Table error:', error)
        //         return (
        //             <div className="c-container-page">
        //                 <h1>エラーが発生しました</h1>
        //                 <pre>{JSON.stringify(error, null, 2)}</pre>
        //             </div>
        //         )
        //     }

        // DELETE: 自分のデータのみ削除可能 ✅

        // const { data, error } = await supabase
        //     .from("chat_rooms")
        //     .delete()
        //     .eq("user_id", testUserId)

        // if (error) {
        //     console.error('Delete Chat Rooms Table error:', error)
        //     return (
        //         <div className="c-container-page">
        //             <h1>エラーが発生しました</h1>
        //             <pre>{JSON.stringify(error, null, 2)}</pre>
        //         </div>
        //     )
        // }


        /* ============================== 
            Chat 関連 （ログイン&ログアウトテスト OK）
        ============================== */

        // SELECT: 自分のデータのみ取得可能  ✅

        // const { data, error } = await supabase.from('chats').select('*')

        // if (error) {
        //     console.error('Select Chats Table error:', error)
        //     return (
        //         <div className="c-container-page">
        //             <h1>エラーが発生しました</h1>
        //             <pre>{JSON.stringify(error, null, 2)}</pre>
        //         </div>
        //     )
        // }

        // INSERT: 自分のデータのみ追加可能 ✅

        // const { data, error } = await supabase
        //     .from("chats")
        //     .insert({
        //         chat_room_id: "9db1d5c6-e5ab-4b3c-ab98-2a787cde323a",
        //         message: "テストメッセージ333",
        //         sender_type: "user",
        //         source: "user",
        //     })

        // if (error) {
        //     console.error('Insert Chats Table error:', error)
        //     return (
        //         <div className="c-container-page">
        //             <h1>エラーが発生しました</h1>
        //             <pre>{JSON.stringify(error, null, 2)}</pre>
        //         </div>
        //     )
        // }

        // UPDATE: オーナーのみ更新可能 ✅

        // const { data, error } = await supabase
        //         .from("chats")
        //         .update({
        //             message: "テストメッセージ222",
        //         })
        //         .eq("id", "369a197c-80b0-4ca5-af08-3aee811cc8dd")

        //     if (error) {
        //         console.error('Update Chats Table error:', error)
        //         return (
        //             <div className="c-container-page">
        //                 <h1>エラーが発生しました</h1>
        //                 <pre>{JSON.stringify(error, null, 2)}</pre>
        //             </div>
        //         )
        //     }

        // DELETE: 自分のデータのみ削除可能 ✅

        // 自分のデータ削除テスト
        // const { data, error } = await supabase
        //     .from("chats")
        //     .delete()
        //     .eq("id", "ad056eb7-562b-4352-9dfd-70e11ebbc309")

        // 他のユーザーのデータ削除テスト
        // const { data, error } = await supabase
        //     .from("chats")
        //     .delete()
        //     .eq("id", "30e7230f-10e6-4acf-86de-99afe31572e2")

        // if (error) {
        //     console.error('Delete Chats Table error:', error)
        //     return (
        //         <div className="c-container-page">
        //             <h1>エラーが発生しました</h1>
        //             <pre>{JSON.stringify(error, null, 2)}</pre>
        //         </div>
        //     )
        // }


        /* ============================== 
            Order 関連 （ログイン&ログアウトテスト OK）
        ============================== */

        // SELECT: 自分のデータのみ取得可能  ✅

        // const { data, error } = await supabase.from('orders').select('*')

        // if (error) {
        //     console.error('Select Orders Table error:', error)
        //     return (
        //         <div className="c-container-page">
        //             <h1>エラーが発生しました</h1>
        //             <pre>{JSON.stringify(error, null, 2)}</pre>
        //         </div>
        //     )
        // }

        // INSERT: ログインユーザーのみ追加可能 ✅

        // const { data, error } = await supabase
        //     .from("orders")
        //     .insert({
        //         user_id: testUserId,
        //         order_number: "11111",
        //         status: "processing",
        //         shipping_fee: 0,
        //         total_amount: 77777,
        //         delivery_name: "テストデリバリー2",
        //     })

        // if (error) {
        //     console.error('Insert Orders Table error:', error)
        //     return (
        //         <div className="c-container-page">
        //             <h1>エラーが発生しました</h1>
        //             <pre>{JSON.stringify(error, null, 2)}</pre>
        //         </div>
        //     )
        // }

        // UPDATE: 自分のデータのみ更新可能 ✅

        // 自分のデータ更新テスト
        // const { data, error } = await supabase
        //         .from("orders")
        //         .update({
        //             status: "processing",
        //         })
        //         .eq("id", "a7ea337a-68dc-4194-acf0-c0d9481739e3")

        // 他のユーザーのデータ更新テスト
        // const { data, error } = await supabase
        //         .from("orders")
        //         .update({
        //             status: "processing",
        //         })
        //         .eq("id", "49133621-c5a2-4592-b45c-1a24090c88e7")

        //     if (error) {
        //         console.error('Update Orders Table error:', error)
        //         return (
        //             <div className="c-container-page">
        //                 <h1>エラーが発生しました</h1>
        //                 <pre>{JSON.stringify(error, null, 2)}</pre>
        //             </div>
        //         )
        //     }

        // DELETE: 自分のデータのみ削除可能 ✅

        // 自分のデータ削除テスト
        // const { data, error } = await supabase
        //     .from("orders")
        //     .delete()
        //     .eq("id", "a7ea337a-68dc-4194-acf0-c0d9481739e3")

        // 他のユーザーのデータ削除テスト
        // const { data, error } = await supabase
        //     .from("orders")
        //     .delete()
        //     .eq("id", "49133621-c5a2-4592-b45c-1a24090c88e7")

        // if (error) {
        //     console.error('Delete Orders Table error:', error)
        //     return (
        //         <div className="c-container-page">
        //             <h1>エラーが発生しました</h1>
        //             <pre>{JSON.stringify(error, null, 2)}</pre>
        //         </div>
        //     )
        // }


        /* ============================== 
            Order Item 関連 （ログイン&ログアウトテスト OK）
        ============================== */

        // SELECT: 自分のデータのみ取得可能  ✅

        // const { data, error } = await supabase.from('order_items').select('*')

        // if (error) {
        //     console.error('Select Order Items Table error:', error)
        //     return (
        //         <div className="c-container-page">
        //             <h1>エラーが発生しました</h1>
        //             <pre>{JSON.stringify(error, null, 2)}</pre>
        //         </div>
        //     )
        // }

        // INSERT: ログインユーザーのみ追加可能 ✅

        // const { data, error } = await supabase
        //     .from("order_items")
        //     .insert({
        //         order_id: "a7ea337a-68dc-4194-acf0-c0d9481739e3",
        //         product_id: "0143900c-7a64-4021-ad11-5bf9cd66cb2f",
        //         quantity: "7",
        //         unit_price: 66666,
        //         total_price: 466662,
        //     })

        // if (error) {
        //     console.error('Insert Order Items Table error:', error)
        //     return (
        //         <div className="c-container-page">
        //             <h1>エラーが発生しました</h1>
        //             <pre>{JSON.stringify(error, null, 2)}</pre>
        //         </div>
        //     )
        // }

        // UPDATE: オーナーのみ更新可能 ✅

        // const { data, error } = await supabase
        //         .from("order_items")
        //         .update({
        //             quantity: "10",
        //         })
        //         .eq("id", "1e573884-d26c-4ad6-86d4-6b9eb76f5147")

        //     if (error) {
        //         console.error('Update Order Items Table error:', error)
        //         return (
        //             <div className="c-container-page">
        //                 <h1>エラーが発生しました</h1>
        //                 <pre>{JSON.stringify(error, null, 2)}</pre>
        //             </div>
        //         )
        //     }

        // DELETE: 自分のデータのみ削除可能 ✅

        // 自分のデータ削除テスト
        // const { data, error } = await supabase
        //     .from("order_items")
        //     .delete()
        //     .eq("id", "1e573884-d26c-4ad6-86d4-6b9eb76f5147")

        // 他のユーザーのデータ削除テスト
        // const { data, error } = await supabase
        //     .from("order_items")
        //     .delete()
        //     .eq("id", "69f8b5b1-8258-47e5-9087-24960c9addba")

        // if (error) {
        //     console.error('Delete Order Items Table error:', error)
        //     return (
        //         <div className="c-container-page">
        //             <h1>エラーが発生しました</h1>
        //             <pre>{JSON.stringify(error, null, 2)}</pre>
        //         </div>
        //     )
        // }


        /* ============================== 
            Shipping Address 関連 （ログイン&ログアウトテスト OK）
        ============================== */

        // SELECT: 自分のデータのみ取得可能  ✅

        // const { data, error } = await supabase.from('shipping_addresses').select('*')

        // if (error) {
        //     console.error('Select Shipping Addresses Table error:', error)
        //     return (
        //         <div className="c-container-page">
        //             <h1>エラーが発生しました</h1>
        //             <pre>{JSON.stringify(error, null, 2)}</pre>
        //         </div>
        //     )
        // }

        // INSERT: ログインユーザーのみ追加可能 ✅

        // const { data, error } = await supabase
        //     .from("shipping_addresses")
        //     .insert({
        //         user_id: testUserId,
        //         name: "テストデリバリー",
        //         postal_code: "123-4567",
        //         state: "北海道",
        //         address_line1: "テスト住所",
        //     })

        // if (error) {
        //     console.error('Insert Shipping Addresses Table error:', error)
        //     return (
        //         <div className="c-container-page">
        //             <h1>エラーが発生しました</h1>
        //             <pre>{JSON.stringify(error, null, 2)}</pre>
        //         </div>
        //     )
        // }

        // UPDATE: 自分のデータのみ更新可能 ✅

        // 自分のデータ更新テスト
        // const { data, error } = await supabase
        //         .from("shipping_addresses")
        //         .update({
        //             name: "テストデリバリー3",
        //         })
        //         .eq("id", "51fbfc45-7c78-4b26-b092-9853e598755a")

        // 他のユーザーのデータ更新テスト
        // const { data, error } = await supabase
        //         .from("shipping_addresses")
        //         .update({
        //             name: "投稿テスト2",
        //         })
        //         .eq("id", "8a9d00b0-b1ee-439c-8beb-cfa4f87bfdcb")

            // if (error) {
            //     console.error('Update Shipping Addresses Table error:', error)
            //     return (
            //         <div className="c-container-page">
            //             <h1>エラーが発生しました</h1>
            //             <pre>{JSON.stringify(error, null, 2)}</pre>
            //         </div>
            //     )
            // }

        // DELETE: 自分のデータのみ削除可能 ✅

        // 自分のデータ削除テスト
        // const { data, error } = await supabase
        //     .from("shipping_addresses")
        //     .delete()
        //     .eq("id", "51fbfc45-7c78-4b26-b092-9853e598755a")

        // 他のユーザーのデータ削除テスト
        // const { data, error } = await supabase
        //     .from("shipping_addresses")
        //     .delete()
        //     .eq("id", "8a9d00b0-b1ee-439c-8beb-cfa4f87bfdcb")

        // if (error) {
        //     console.error('Delete Shipping Addresses Table error:', error)
        //     return (
        //         <div className="c-container-page">
        //             <h1>エラーが発生しました</h1>
        //             <pre>{JSON.stringify(error, null, 2)}</pre>
        //         </div>
        //     )
        // }


        /* ============================== 
            Bookmark 関連 （ログイン&ログアウトテスト OK）
        ============================== */

        // SELECT: 自分のデータのみ取得可能  ✅

        // const { data, error } = await supabase.from('user_bookmarks').select('*')

        // if (error) {
        //     console.error('Select User Bookmarks Table error:', error)
        //     return (
        //         <div className="c-container-page">
        //             <h1>エラーが発生しました</h1>
        //             <pre>{JSON.stringify(error, null, 2)}</pre>
        //         </div>
        //     )
        // }

        // INSERT: ログインユーザーのみ追加可能 ✅

        // const { data, error } = await supabase
        //     .from("user_bookmarks")
        //     .insert({
        //         user_id: testUserId,
        //         product_id: "51a425e3-a7f2-4dd0-ad86-7423a316fabd",
        //     })

        // if (error) {
        //     console.error('Insert User Bookmarks Table error:', error)
        //     return (
        //         <div className="c-container-page">
        //             <h1>エラーが発生しました</h1>
        //             <pre>{JSON.stringify(error, null, 2)}</pre>
        //         </div>
        //     )
        // }

        // UPDATE: オーナーのみ更新可能 ✅

        // const { data, error } = await supabase
        //     .from("user_bookmarks")
        //     .update({
        //         product_id: "58dfb7ef-b1fa-422b-97f0-87dbb2c0092a",
        //     })
        //     .eq("product_id", "8baedad7-8af3-441f-86de-42ab4b330a76")

        // if (error) {
        //     console.error('Update User Bookmarks Table error:', error)
        //     return (
        //         <div className="c-container-page">
        //             <h1>エラーが発生しました</h1>
        //             <pre>{JSON.stringify(error, null, 2)}</pre>
        //         </div>
        //     )
        // }

        // DELETE: 自分のデータのみ削除可能 ✅

        // 自分のデータ削除テスト
        // const { data, error } = await supabase
        //     .from("user_bookmarks")
        //     .delete()
        //     .eq("product_id", "8baedad7-8af3-441f-86de-42ab4b330a76")

        // 他のユーザーのデータ削除テスト
        // const { data, error } = await supabase
        //     .from("user_bookmarks")
        //     .delete()
        //     .eq("user_id", "48c6bedb-76c5-45f9-bcdd-955254f61603")

        // if (error) {
        //     console.error('Delete User Bookmarks Table error:', error)
        //     return (
        //         <div className="c-container-page">
        //             <h1>エラーが発生しました</h1>
        //             <pre>{JSON.stringify(error, null, 2)}</pre>
        //         </div>
        //     )
        // }


        /* ============================== 
            Verification Token 関連 （ログイン&ログアウトテスト ）
        ============================== */

        // SELECT: 自分のデータのみ取得可能  ✅

        // const { data, error } = await supabase.from('verification_tokens').select('*')

        // if (error) {
        //     console.error('Select Verification Tokens Table error:', error)
        //     return (
        //         <div className="c-container-page">
        //             <h1>エラーが発生しました</h1>
        //             <pre>{JSON.stringify(error, null, 2)}</pre>
        //         </div>
        //     )
        // }

        // INSERT: 誰でも追加可能 ✅

        // const { data, error } = await supabase
        //     .from("verification_tokens")
        //     .insert({
        //         identifier: "test2@example.com",
        //         token: "333333",
        //         expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
        //     })

        // if (error) {
        //     console.error('Insert Verification Tokens Table error:', error)
        //     return (
        //         <div className="c-container-page">
        //             <h1>エラーが発生しました</h1>
        //             <pre>{JSON.stringify(error, null, 2)}</pre>
        //         </div>
        //     )
        // }

        // UPDATE: オーナーのみ更新可能 ✅

        // const { data, error } = await supabase
        //     .from("verification_tokens")
        //     .update({
        //         token: "000000",
        //     })
        //     .eq("token", "test")

        // if (error) {
        //     console.error('Update Verification Tokens Table error:', error)
        //     return (
        //         <div className="c-container-page">
        //             <h1>エラーが発生しました</h1>
        //             <pre>{JSON.stringify(error, null, 2)}</pre>
        //         </div>
        //     )
        // }

        // DELETE: 自分のデータのみ削除可能 ✅

        // 自分のデータ削除テスト
        // const { data, error } = await supabase
        //     .from("verification_tokens")
        //     .delete()
        //     .eq("token", "test")

        // 他のユーザーのデータ削除テスト
        // const { data, error } = await supabase
        //     .from("verification_tokens")
        //     .delete()
        //     .eq("token", "123456")

        // if (error) {
        //     console.error('Delete Verification Tokens Table error:', error)
        //     return (
        //         <div className="c-container-page">
        //             <h1>エラーが発生しました</h1>
        //             <pre>{JSON.stringify(error, null, 2)}</pre>
        //         </div>
        //     )
        // }


        /* ============================== 
            Storage - Review Images 関連 （ログイン&ログアウトテスト OK）
        ============================== */

        // SELECT: 誰でも読み取り可能 ✅
        // const { data, error } = await supabase.storage
        //     .from('review-images')
        //     .list()

        // if (error) {
        //     console.error('Select Review Images error:', error)
        //     return (
        //         <div className="c-container-page">
        //             <h1>エラーが発生しました</h1>
        //             <pre>{JSON.stringify(error, null, 2)}</pre>
        //         </div>
        //     )
        // }

        // const actualFiles = data && data.filter(file => file.name !== '.emptyFolderPlaceholder')

        // INSERT: ログインユーザーのみアップロード可能 ✅
        // テスト用のダミーファイルを作成
        // const testFile = new File(['test content'], 'test-review-image.jpg', { type: 'image/jpeg' })
        
        // const { data, error } = await supabase.storage
        //     .from('review-images')
        //     .upload(`${testUserId}/test-${Date.now()}.jpg`, testFile)

        // if (error) {
        //     console.error('Upload Review Images error:', error)
        //     return (
        //         <div className="c-container-page">
        //             <h1>アップロードエラー</h1>
        //             <pre>{JSON.stringify(error, null, 2)}</pre>
        //         </div>
        //     )
        // }

        // // DELETE: オーナーのみ削除可能 ✅
        // const { error: deleteError } = await supabase.storage
        //     .from('review-images')
        //     .remove([data.path])

        // if (deleteError) {
        //     console.error('Delete Review Images error:', deleteError)
        //     return (
        //         <div className="c-container-page">
        //             <h1>削除エラー</h1>
        //             <pre>{JSON.stringify(deleteError, null, 2)}</pre>
        //         </div>
        //     )
        // }


        /* ============================== 
            Storage - User Icon Images 関連 （ログイン&ログアウトテスト OK）
        ============================== */

        // SELECT: 自分のアイコン画像のみ読み取り可能 ✅
        // const { data, error } = await supabase.storage
        //     .from('user-icon-images')
        //     .list()

        // if (error) {
        //     console.error('Select User Icon Images error:', error)
        //     return (
        //         <div className="c-container-page">
        //             <h1>エラーが発生しました</h1>
        //             <pre>{JSON.stringify(error, null, 2)}</pre>
        //         </div>
        //     )
        // }

        // .emptyFolderPlaceholderを除外
        // const actualIconFiles = data && data.filter(file => file.name !== '.emptyFolderPlaceholder')

        // INSERT: ログインユーザーのみアップロード可能 ✅
        // テスト用のダミーファイルを作成
        // const testIconFile = new File(['test icon content'], 'test-user-icon.jpg', { type: 'image/jpeg' })
        
        // const { data, error } = await supabase.storage
        //     .from('user-icon-images')
        //     .upload(`test-icon-${Date.now()}.jpg`, testIconFile)

        // if (error) {
        //     console.error('Upload User Icon Images error:', error)
        //     return (
        //         <div className="c-container-page">
        //             <h1>アップロードエラー</h1>
        //             <pre>{JSON.stringify(error, null, 2)}</pre>
        //         </div>
        //     )
        // }

        // DELETE: 自分のアイコン画像のみ削除可能 ✅
        // const { error: deleteError } = await supabase.storage
        //     .from('user-icon-images')
        //     .remove(["1755954652469-t9fovfbkoti-icon.png"])

        // if (deleteError) {
        //     console.error('Delete User Icon Images error:', deleteError)
        //     return (
        //         <div className="c-container-page">
        //             <h1>削除エラー</h1>
        //             <pre>{JSON.stringify(deleteError, null, 2)}</pre>
        //         </div>
        //     )
        // }


        /* ============================== 
            Subscription Payment 関連 （ログイン&ログアウトテスト OK）
        ============================== */

        // SELECT: 自分のデータのみ取得可能  ✅

        // const { data, error } = await supabase.from('subscription_payments').select('*')

        // if (error) {
        //     console.error('Select Subscription Payments Table error:', error)
        //     return (
        //         <div className="c-container-page">
        //             <h1>エラーが発生しました</h1>
        //             <pre>{JSON.stringify(error, null, 2)}</pre>
        //         </div>
        //     )
        // }

        // INSERT: ログインユーザーのみ追加可能 ✅

        // const { data, error } = await supabase
        //     .from("subscription_payments")
        //     .insert({
        //         user_id: testUserId,
        //         payment_date: new Date().toISOString(),
        //         status: "pending",
        //         subscription_id: "sub_1S3BJ92fW93DD9tK1AYXBG58",
        //     })

        // if (error) {
        //     console.error('Insert Subscription Payments Table error:', error)
        //     return (
        //         <div className="c-container-page">
        //             <h1>エラーが発生しました</h1>
        //             <pre>{JSON.stringify(error, null, 2)}</pre>
        //         </div>
        //     )
        // }

        // UPDATE: 自分のデータのみ更新可能 ✅

        // 自分のデータ更新テスト
        // const { data, error } = await supabase
        //         .from("subscription_payments")
        //         .update({
        //             status: "succeeded",
        //         })
        //         .eq("id", "df881e6f-53d7-4f41-9f0f-dfa0d3f730de")

        // 他のユーザーのデータ更新テスト
        // const { data, error } = await supabase
        //         .from("subscription_payments")
        //         .update({
        //             status: "canceled",
        //         })
        //         .eq("id", "fb0fe6f5-771d-4278-a2f4-8212959a14f0")

        //     if (error) {
        //         console.error('Update Orders Table error:', error)
        //         return (
        //             <div className="c-container-page">
        //                 <h1>エラーが発生しました</h1>
        //                 <pre>{JSON.stringify(error, null, 2)}</pre>
        //             </div>
        //         )
        //     }

        // DELETE: オーナーのみ削除可能 ✅

        // const { data, error } = await supabase
        //     .from("subscription_payments")
        //     .delete()
        //     .eq("id", "7949e73d-9386-4052-919e-94719c252471")

        // if (error) {
        //     console.error('Delete Orders Table error:', error)
        //     return (
        //         <div className="c-container-page">
        //             <h1>エラーが発生しました</h1>
        //             <pre>{JSON.stringify(error, null, 2)}</pre>
        //         </div>
        //     )
        // }


        /* ============================== 
            User Image 関連
        ============================== */

        // SELECT: 自分のデータのみ取得可能 

        // const { data, error } = await supabase.from('user_images').select('*')

        // if (error) {
        //     console.error('Select User Images Table error:', error)
        //     return (
        //         <div className="c-container-page">
        //             <h1>エラーが発生しました</h1>
        //             <pre>{JSON.stringify(error, null, 2)}</pre>
        //         </div>
        //     )
        // }

        // INSERT: ログインユーザーのみ追加可能

        // const { data, error } = await supabase
        //     .from("user_images")
        //     .insert({
        //         user_id: testUserId,
        //         file_path: "profile/921bf795-f567-474e-9373-ad7ac97727ff/1757305907266-test-icon.png",
        //     })

        // if (error) {
        //     console.error('Insert User Images Table error:', error)
        //     return (
        //         <div className="c-container-page">
        //             <h1>エラーが発生しました</h1>
        //             <pre>{JSON.stringify(error, null, 2)}</pre>
        //         </div>
        //     )
        // }

        // UPDATE: 自分のデータのみ更新可能

        // 自分のデータ更新テスト
        // const { data, error } = await supabase
        //         .from("user_images")
        //         .update({
        //             file_path: "profile/921bf795-f567-474e-9373-ad7ac97727ff/1757305907266-test2-icon.png",
        //         })
        //         .eq("id", "921bf795-f567-474e-9373-ad7ac97727ff")

        // 他のユーザーのデータ更新テスト
        // const { data, error } = await supabase
        //         .from("user_images")
        //         .update({
        //             file_path: "profile/921bf795-f567-474e-9373-ad7ac97727ff/1757305907266-test3-icon.png",
        //         })
        //         .eq("id", "48c6bedb-76c5-45f9-bcdd-955254f61603",")

        //     if (error) {
        //         console.error('Update User Images Table error:', error)
        //         return (
        //             <div className="c-container-page">
        //                 <h1>エラーが発生しました</h1>
        //                 <pre>{JSON.stringify(error, null, 2)}</pre>
        //             </div>
        //         )
        //     }

        // DELETE: 自分のデータのみ削除可能 ✅

        // 自分のデータ削除テスト
        // const { data, error } = await supabase
        //     .from("user_images")
        //     .delete()
        //     .eq("id", "921bf795-f567-474e-9373-ad7ac97727ff")

        // 他のユーザーのデータ削除テスト
        // const { data, error } = await supabase
        //     .from("user_images")
        //     .delete()
        //     .eq("id", "48c6bedb-76c5-45f9-bcdd-955254f61603")

        // if (error) {
        //     console.error('Delete User Images Table error:', error)
        //     return (
        //         <div className="c-container-page">
        //             <h1>エラーが発生しました</h1>
        //             <pre>{JSON.stringify(error, null, 2)}</pre>
        //         </div>
        //     )
        // }
        
        return (
            <div className="c-container-page">
                <h1>Delete Test Results</h1>
                
                <h2>テスト結果</h2>
                {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
            </div>
        )
    } catch (err) {
        console.error('Other error:', err)

        return (
            <div className="c-container-page">
                <h1 className="page-title">Other error occurred</h1>
                <pre>{String(err)}</pre>
            </div>
        )
    }
}

export default TestPage