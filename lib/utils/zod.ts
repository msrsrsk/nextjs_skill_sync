import { z } from "zod"

export const nameSchema = z.object({
    lastName: z.string()
    .min(1, 'お名前を入力してください')
    .max(50, '50文字以内で入力してください')
    .refine((value) => !value.includes(' '), 'スペースは使用できません'),
    firstName: z.string()
    .min(1, 'お名前を入力してください')
    .max(50, '50文字以内で入力してください')
    .refine((value) => !value.includes(' '), 'スペースは使用できません'),
});

export const emailSchema = z.object({
    email: z.string()
        .email('有効なメールアドレスを入力してください')
        .refine((value) => !value.includes(' '), 'スペースは使用できません')
});

export const passwordSchema = z.object({
    password: z.string()
        .min(8, '8文字以上で入力してください')
        .max(30, '30文字以内で入力してください')
        .refine((value) => !value.includes(' '), 'スペースは使用できません')
        .refine((value) => {
            const hasLetter = /[a-zA-Z]/.test(value);
            return hasLetter;
        }, '半角英字が含まれていません')
        .refine((value) => {
            const hasNumber = /[0-9]/.test(value);
            return hasNumber;
        }, '数字が含まれていません')
        .refine((value) => {
            const hasSymbol = /[@#$%^&*?:]/.test(value);
            return hasSymbol;
        }, '@#$%^&*?:の中から1文字以上記号を含めてください')
        .refine((value) => {
            return !/[^\x00-\x7F]/.test(value);
        }, '全角文字は使用できません')
});

export const doublePasswordSchema = z
    .object({
        password: z.string()
            .min(8, '8文字以上で入力してください')
            .max(30, '30文字以内で入力してください')
            .refine((value) => !value.includes(' '), 'スペースは使用できません')
            .refine((value) => {
                const hasLetter = /[a-zA-Z]/.test(value);
                return hasLetter;
            }, '半角英字が含まれていません')
            .refine((value) => {
                const hasNumber = /[0-9]/.test(value);
                return hasNumber;
            }, '数字が含まれていません')
            .refine((value) => {
                const hasSymbol = /[@#$%^&*?:]/.test(value);
                return hasSymbol;
            }, '@#$%^&*?:の中から1文字以上記号を含めてください')
            .refine((value) => {
                return !/[^\x00-\x7F]/.test(value);
            }, '全角文字は使用できません'),
        confirmPassword: z.string()
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "パスワードが一致していません",
        path: ["confirmPassword"]
    });

export const displayNameSchema = z.object({
    displayName: z.string()
        .min(1, 'お名前を入力してください')
        .max(10, '10文字以内で入力してください')
});

export const textareaSchema = z.object({
    textarea: z.string()
        .min(1, '内容を入力してください')
        .max(1000, '1000文字以内で入力してください')
});

export const chatMessageSchema = z.object({
    message: z.string()
        .min(1, '1文字以上で入力してください')
        .max(500, '500文字以内で入力してください')
});

export const reviewSchema = z.object({
    textarea: z.string()
        .min(1, '内容を入力してください')
        .max(200, '200文字以内で入力してください')
});

export const telSchema = z.object({
    tel: z.string()
        .refine(
            (val) => !/[０-９]/.test(val), '半角数字で入力してください')
        .transform((val) => val.replace(/-/g, ''))
        .refine(
            (val) => /^0\d{9,10}$/.test(val), '有効な電話番号を入力してください')
        .transform((val) => {
            return val.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
        })
});

export const postalCodeSchema = z.object({
    postal_code: z.string()
        .refine(
            (val) => !/[０-９]/.test(val), '半角数字で入力してください')
        .refine(
            (val) => /^\d{3}-\d{4}$/.test(val), '有効な郵便番号を入力してください')
        .refine(
            (val) => val.includes('-'), '半角ハイフン付きで入力してください（例: 123-4567）')
});

export const addressLine1Schema = z.object({
    address_line1: z.string()
        .min(1, '市区町村・番地を入力してください')
        .max(50, '50文字以内で入力してください')
});

export const addressLine2Schema = z.object({
    address_line2: z.string()
        .max(50, '50文字以内で入力してください')
});