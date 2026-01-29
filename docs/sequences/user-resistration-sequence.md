sequenceDiagram
    participant User as ユーザー
    participant Form as 登録フォーム
    participant FormAction as createAccountWithEmailAction
    participant Repository as UserRepository
    participant AuthAction as createVerificationTokenWithPassword
    participant DB as Database<br/>(VerificationToken)
    participant EmailService as sendVerificationEmail
    participant Resend as Resend API
    participant VerifyPage as メール認証ページ
    participant VerifyAction as verifyEmailToken
    participant RegisterAction as registerUserWithChat
    participant StripeAPI as Stripe API

    Note over User,StripeAPI: 【フェーズ1: アカウント作成リクエスト】

    User->>Form: フォーム入力<br/>(姓, 名, メール, パスワード)
    Form->>FormAction: createAccountWithEmailAction(formData)

    FormAction->>FormAction: lastname / firstname / email / password 取得
    alt いずれか未入力
        FormAction-->>Form: { success: false, error: CREATE_ACCOUNT_MISSING_DATA }
        Form-->>User: エラーメッセージ表示
    else 入力あり
        FormAction->>Repository: getUserByEmail(email)
        Repository-->>FormAction: existingUser (null or User)

        alt メールアドレスが既に存在
            FormAction-->>Form: { success: false, error: EMAIL_EXISTS }
            Form-->>User: エラーメッセージ表示
        else メールアドレスが新規
            FormAction->>AuthAction: createVerificationTokenWithPassword(userData)

            Note over AuthAction: パスワードをbcryptでハッシュ化

            AuthAction->>DB: createVerificationToken<br/>(email, token, hashedPassword, userData)
            DB-->>AuthAction: verificationToken
            AuthAction-->>FormAction: { success: true, token }

            FormAction->>EmailService: sendVerificationEmail(email, token, CREATE_ACCOUNT_TYPE)
            EmailService->>Resend: resend.emails.send()
            Resend-->>EmailService: メール送信成功
            EmailService-->>FormAction: { success: true }

            FormAction-->>Form: { success: true, email }
            Form-->>User: 認証メール送信完了メッセージ
        end
    end

    Note over User,StripeAPI: 【フェーズ2: メール認証とユーザー登録】

    User->>VerifyPage: メール内の認証リンクで遷移 (?token=xxx)

    VerifyPage->>VerifyAction: verifyEmailToken(token, VERIFY_CREATE_ACCOUNT)

    VerifyAction->>DB: getVerificationTokenAndVerify(token)
    DB-->>VerifyAction: verificationToken

    alt トークンが無効または期限切れ
        VerifyAction-->>VerifyPage: { success: false, error }
        VerifyPage-->>User: エラーメッセージ表示
    else トークンが有効
        VerifyAction->>RegisterAction: registerUserWithChat(userData, userProfileData, token)

        Note over RegisterAction,DB: 【トランザクション開始】

        RegisterAction->>DB: createUser(userData)
        DB-->>RegisterAction: user

        RegisterAction->>DB: createUserProfile(userId, userProfileData)
        DB-->>RegisterAction: userProfile

        RegisterAction->>DB: createUserImage(userId)
        DB-->>RegisterAction: userImage

        RegisterAction->>DB: createChatRoom(userId)
        DB-->>RegisterAction: chatRoom

        RegisterAction->>DB: createInitialChat(chatRoomId)
        DB-->>RegisterAction: initialChat

        RegisterAction->>DB: deleteVerificationToken(token)
        DB-->>RegisterAction: deleted

        Note over RegisterAction,DB: 【トランザクションコミット】

        RegisterAction-->>VerifyAction: { success: true, data: user }

        VerifyAction->>StripeAPI: createStripeCustomer(email, name)
        StripeAPI-->>VerifyAction: stripeCustomer

        alt Stripe顧客作成失敗
            VerifyAction->>DB: deleteUser(userId)
            VerifyAction-->>VerifyPage: { success: false, error }
            VerifyPage-->>User: エラーメッセージ表示
        else Stripe顧客作成成功
            VerifyAction->>DB: createUserStripeCustomerId(userId, customerId)
            DB-->>VerifyAction: { success: true }

            alt Stripe顧客ID保存失敗
                VerifyAction->>DB: deleteUser(userId)
                VerifyAction->>StripeAPI: deleteStripeCustomer(customerId)
                VerifyAction-->>VerifyPage: { success: false, error }
                VerifyPage-->>User: エラーメッセージ表示
            else すべて成功
                VerifyAction-->>VerifyPage: { success: true }
                VerifyPage-->>User: アカウント作成完了<br/>ログインページへリダイレクト
            end
        end
    end