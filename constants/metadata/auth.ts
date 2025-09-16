import { SITE_MAP } from "@/constants/index"

const { 
    CREATE_ACCOUNT_VERIFY_PATH,
    CREATE_ACCOUNT_PATH,
    DELETE_ACCOUNT_PUBLIC_PATH,
    LOGIN_PATH,
    RESET_PASSWORD_NEW_PASSWORD_PATH,
    RESET_PASSWORD_VERIFY_PATH,
    RESET_PASSWORD_PATH
} = SITE_MAP;

export const ACCOUNT_METADATA = {
    CREATE_ACCOUNT_VERIFY: {
        title: 'アカウントの作成完了',
        description: 'アカウントの作成が完了しました。ログインをしてからアカウントページにアクセスしてください。',
        url: CREATE_ACCOUNT_VERIFY_PATH,
        robots: {
            index: false,
            follow: false,
        }
    },
    CREATE_ACCOUNT: {
        title: 'アカウントの作成',
        description: '新しいアカウントを作成します。お名前・メールアドレス・パスワードを入力の上、「アカウントを作成」ボタンをクリックしてください。',
        url: CREATE_ACCOUNT_PATH,
        robots: {
            index: false,
            follow: false,
        }
    },
    DELETE_ACCOUNT_PUBLIC: {
        title: '退会手続き完了',
        description: 'アカウントの退会手続きが完了しました。またの再会をお待ちしております。',
        url: DELETE_ACCOUNT_PUBLIC_PATH,
        robots: {
            index: false,
            follow: false,
        }
    },
    LOGIN: {
        title: 'ログイン',
        description: 'メールアドレス・パスワードを入力の上、「ログイン」ボタンをクリックしてください。',
        url: LOGIN_PATH,
        robots: {
            index: false,
            follow: false,
        }
    },
    RESET_PASSWORD_NEW_PASSWORD: {
        title: '新しいパスワードの認証',
        description: '新しいパスワードの認証結果が表示されます。',
        url: RESET_PASSWORD_NEW_PASSWORD_PATH,
        robots: {
            index: false,
            follow: false,
        }
    },
    RESET_PASSWORD_VERIFY: {
        title: 'パスワードの変更完了',
        description: 'パスワードの変更が完了しました。ログインをしてからアカウントページにアクセスしてください。',
        url: RESET_PASSWORD_VERIFY_PATH,
        robots: {
            index: false,
            follow: false,
        }
    },
    RESET_PASSWORD: {
        title: 'パスワードの変更',
        description: 'ご登録のメールアドレスを入力してください。パスワードの再設定メールを送信いたします。',
        url: RESET_PASSWORD_PATH,
        robots: {
            index: false,
            follow: false,
        }
    }
}