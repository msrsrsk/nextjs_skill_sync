import jwt from "jsonwebtoken"
import { createClient } from "@supabase/supabase-js"
import { requireServerAuth } from "@/lib/middleware/auth"

import { JWT_CONFIG } from "@/constants/index"

const { EXPIRES_SECONDS, SECONDS_TO_MILLISECONDS } = JWT_CONFIG;

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Required environment variables of Supabase are not set');
}

// 認証なしクライアント（公開データ用）
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 認証ありクライアント（保護データ用）
export const createAuthClient = async () => {
    const { session } = await requireServerAuth();

    const payload = {
        id: session.user.id,
        email: session.user.email,
        aud: 'authenticated',
        role: 'authenticated',
        exp: Math.floor(Date.now() / SECONDS_TO_MILLISECONDS) + (EXPIRES_SECONDS),
        iat: Math.floor(Date.now() / SECONDS_TO_MILLISECONDS)
    }

    const token = jwt.sign(payload, process.env.SUPABASE_JWT_SECRET!)

    const client = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_ANON_KEY!,
        {
            global: {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        }
    )
    return client;
}