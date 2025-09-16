import { Metadata } from "next"

import Breadcrumb from "@/components/ui/navigation/Breadcrumb"
import PageTitle from "@/components/common/display/PageTitle"
import { SUBSCRIPTION_CANCEL_THRESHOLD, SHIPPING_FEE_250 } from "@/constants/index"
import { generatePageMetadata } from "@/lib/metadata/page"
import { MAIN_METADATA } from "@/constants/metadata/main"

export const metadata: Metadata = generatePageMetadata({
    ...MAIN_METADATA.TOKUSHOHO
})

const TokushohoPage = () => {
    return <>
        <Breadcrumb />

        <div className="c-container-page">
            <PageTitle 
                title="Tokushoho"
                customClass="mt-6 mb-3 md:mt-10 md:mb-4" 
            />

            <div className="max-w-xl mx-auto">
                <p className="legal-subtitle">
                    特定商法取引法に基づく表記
                </p>

                <dl className="legal-table">
                    <dt>事業者名</dt>
                    <dd>SKILL SYNC</dd>

                    <dt>運営責任者</dt>
                    <dd>素喜流　芯來</dd>

                    <dt>所在地</dt>
                    <dd>
                        〒004-0068<br />
                        北海道札幌市厚別区厚別○-○-○<br />
                        スキルシティ・シンクタワー 11F
                    </dd>

                    <dt>電話番号</dt>
                    <dd>00-0000-0000</dd>

                    <dt>メールアドレス</dt>
                    <dd>XXXXXX@skill-sync.com</dd>

                    <dt>URL</dt>
                    <dd>https://nextjs-skill-sync.vercel.app</dd>

                    <dt>販売価格</dt>
                    <dd>商品ページに表示された金額（税込）</dd>

                    <dt>商品代金以外の付帯費用</dt>
                    <dd>
                        10個未満のスキルの購入：配送料として別途{SHIPPING_FEE_250}円（税込）<br />
                        10個以上のスキルの購入：配送料無料<br />
                        ※本サイトはデモサイトのため、実際の配送料は発生しません
                    </dd>

                    <dt>代金の支払方法</dt>
                    <dd>各種クレジットカード：ご利用のクレジットカード会社のご請求時</dd>

                    <dt>商品等の引き渡し時期</dt>
                    <dd>ご注文から7営業日以内</dd>

                    {/* サブスクリプション関連の追加項目 */}
                    <dt>継続課金サービス</dt>
                    <dd>
                        サブスクリプション商品は継続課金サービスです。<br />
                        選択された周期（毎日・毎週・毎月・3ヶ月毎・6ヶ月毎・1年毎）に応じて自動的に課金されます。
                    </dd>

                    <dt>継続課金の解約</dt>
                    <dd>
                        サブスクリプションの解約は、ご利用開始から最低{SUBSCRIPTION_CANCEL_THRESHOLD}ヶ月間は解約できません。<br />
                        {SUBSCRIPTION_CANCEL_THRESHOLD}ヶ月経過後は、マイページの「サブスクリプションの詳細」ページから解約可能です。<br />
                        解約後は次回の課金日からサービスが停止されます。
                    </dd>

                    <dt>継続課金の支払い時期</dt>
                    <dd>
                        初回支払い：ご注文時<br />
                        継続支払い：選択された周期の翌日（例：毎月契約の場合、翌月の同日）
                    </dd>

                    <dt>継続課金の支払い方法</dt>
                    <dd>
                        初回登録時にご指定いただいたクレジットカードから自動引き落とし<br />
                    </dd>

                    <dt>継続課金の配送料</dt>
                    <dd>
                        配送料として別途{SHIPPING_FEE_250}円（税込）がかかります。
                    </dd>

                    <dt>返品の可否</dt>
                    <dd>ご注文完了後のお客様都合によるキャンセル・変更・返品不可</dd>
                </dl>
            </div>
        </div>
    </>
}

export default TokushohoPage