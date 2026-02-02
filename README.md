<div align="center">
  <br />
    <img src="https://nextjs-skill-sync.vercel.app/assets/social/github-banner.png" alt="Project Banner">
  <br />
  
  <div>
    <img src="https://img.shields.io/badge/-Next.js-black?style=for-the-badge&logoColor=white&logo=next.js&color=000000" alt="Next.js" />
    <img src="https://img.shields.io/badge/-TypeScript-black?style=for-the-badge&logoColor=white&logo=typescript&color=3178C6" alt="TypeScript" />
    <img src="https://img.shields.io/badge/-Tailwind_CSS-black?style=for-the-badge&logoColor=white&logo=tailwindcss&color=06B6D4" alt="Tailwindcss" />
    <img src="https://img.shields.io/badge/-Supabase-black?style=for-the-badge&logoColor=white&logo=supabase&color=3ECF8E" alt="Supabase" />
    <img src="https://img.shields.io/badge/-Prisma-black?style=for-the-badge&logoColor=white&logo=prisma&color=2D3748" alt="Prisma" />
  </div>

  <h3 align="center">SKILL SYNC（スキルシンク）</h3>
  <br />
</div>

## 📋 <a name="table">目次</a>

1. 🔗 [サイトのURL](#link)
2. 🤖 [サイトの概要](#about)
3. 🌷 [制作のきっかけ](#opportunity)
4. ⚙️ [主な機能](#features)
5. 🔫 [使用技術](#tech)
6. 📙 [あとがき](#more)
7. 🍦 [その他](#etc)
<div>
  <br />
</div>

## <a name="link">🔗 サイトのURL</a>

<a href="https://nextjs-skill-sync.vercel.app" target="_blank" rel="noopener noreferrer">
SKILL SYNC（スキルシンク）
</a>
<div>
  <br />
</div>

## <a name="about">🤖 サイトの概要</a>

生体データに連動したスキルの学習支援を行うECサイトです。<br />
<br />
現在、実際にスウェーデンなどで手の甲にチップを埋め込み、<br />
ジムの会員カードや電車のチケットの予約を可能にする試みが実用化されていることを知りました。<br />
<br />
この内容を参考に、遠い未来に体内埋め込みチップが一般化し、<br />
チップの設定によって様々なシステムの認証などが可能になる時代を<br />
想定してECサイトの制作を進めました。

<div>
  <br />
</div>

## <a name="opportunity">🌷 制作のきっかけ</a>

Udemy や Youtube などで Next.js 関連の動画を見て学習をした後、<br />
アウトプットとして今回 EC サイトの制作をすることを決めました。<br />
<br />
なぜ EC サイトを選んだのかというと、Next.js で作成される主な機能（ログイン機能）や<br />
データベースとの併用で作成ができるデータ管理と投稿機能（レビュー・チャット）、<br />
Stripe との併用で決済機能も備わったツールなどを総合的に学べるのが EC サイトだと感じたからです。<br />
<br />
複数の機能が組み合わさっている分、実装時間も大きくなってしまいますが<br />
それだけ Next.js のアウトプット量を見込むことができると感じたため、<br />
Supabase のデータ管理の方法も合わせて今回チャレンジすることにしました。

<div>
  <br />
</div>

## <a name="features">⚙️ 主な機能</a>

| ログインページ                                                                                                                      | トレンドセクション                                                                                                                      |
| ----------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| [![Image from Gyazo](https://i.gyazo.com/e7ca423d514fa2af335c2df2980006f6.png)](https://gyazo.com/e7ca423d514fa2af335c2df2980006f6) | [![Image from Gyazo](https://i.gyazo.com/7999f58095d8d2fe8511db75680c7a59.png)](https://gyazo.com/7999f58095d8d2fe8511db75680c7a59) |
| ログインページに限らず、各フォームでは入力エラーの表示やボタンの非活性化を行い、視覚的に入力内容の確認ができるようにしました。                                          | 月間の売り上げ数が100万以上ある商品をフィルタリングし、現在の人気商品（トレンド）がユーザーに分かるようにしました。      |

| レビューセクション                                                                                                                          | おすすめ商品セクション                                                                                                                |
| ----------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| [![Image from Gyazo](https://i.gyazo.com/b6a6aa5f6ae14f3aa7aed8af4db99bb0.png)](https://gyazo.com/b6a6aa5f6ae14f3aa7aed8af4db99bb0) | [![Image from Gyazo](https://i.gyazo.com/b7b483d3c9b18a0eb0376188c7c257c7.png)](https://gyazo.com/b7b483d3c9b18a0eb0376188c7c257c7) |
| 商品詳細ページではレビューの統計を表示し、オーナーの承認による表示可否やPickupタグでの優先表示ができるようにしました。                                          | 商品詳細ページにて、その他必須購入商品 > 相性の良い商品 > 同カテゴリー商品　の順に最大9件の商品を表示し、ユーザーの購買意欲を高めるセクションを作成しました。                                           |

| カテゴリーページ                                                                                                                      | フィルタリング                                                                                                                           |
| ----------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| [![Image from Gyazo](https://i.gyazo.com/d5e5a2598fa1315a008b4de8789ccac7.png)](https://gyazo.com/d5e5a2598fa1315a008b4de8789ccac7) | [![Image from Gyazo](https://i.gyazo.com/50e0d611149a2af2280526ef3d1f269d.png)](https://gyazo.com/50e0d611149a2af2280526ef3d1f269d)  |
| カテゴリーページはページネーション化し、各タブで表示を切り替えられるようにしています。                                      | カテゴリーページでは在庫や料金に応じて商品のフィルタリングができるようにしました。 |

| サブスクリプション詳細ページ                                                                                                            | お届け先一覧ページ                                                                                                                      |
| ----------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| [![Image from Gyazo](https://i.gyazo.com/05b48db5dfe7bafc8b94857cec4b2539.png)](https://gyazo.com/05b48db5dfe7bafc8b94857cec4b2539) | [![Image from Gyazo](https://i.gyazo.com/740cfa9d18d752f4ffbe283421c61051.png)](https://gyazo.com/740cfa9d18d752f4ffbe283421c61051) |
| 契約の引き落とし毎に履歴を更新し、契約状況が分かるようにしました。また、注文に応じて領収書もダウンロードできるようにしています。                                                    | 配送先住所の登録ページを作成し、Stripeの顧客住所との紐付けができるようにしました。                                        |

| サポートチャットページ                                                                                                                    | 成功画面                                                                                                                  |
| ----------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| [![Image from Gyazo](https://i.gyazo.com/fab5caa5b873b5e253a8ee7755f71e95.png)](https://gyazo.com/fab5caa5b873b5e253a8ee7755f71e95) | [![Image from Gyazo](https://i.gyazo.com/2ca2593c0dcc108f1ea5c46effa6a093.png)](https://gyazo.com/2ca2593c0dcc108f1ea5c46effa6a093) |
| 個別にチャットができるページを作成し、AIによる簡単な自動回答機能を実装しました。            | 注文完了時やレビュー投稿成功時など、 完了画面に紙吹雪のアニメーションを追加し、達成感が感じられるように工夫をしました。                                                                         |

<div>
  <br />
</div>

## <a name="tech">🔫 使用技術</a>

| カテゴリー     | 使用技術                                                           |
| -------------- | ------------------------------------------------------------------ |
| Front-end      | Next.js 14, React 18, TypeScript, Tailwind CSS, Framer Motion, React Slick, React Hot Toast, Zustand |
| Back-end       | Next.js API Routes, Prisma, Supabase, Stripe, Resend, OpenAI, LangChain |
| Authentication | Auth.js (NextAuth.js) |
| Content Management | microCMS |
| Infrastructure | Supabase (Database), Cloudflare (Storage), Vercel (Hosting) |
| Design         | Figma, Figjam, Aceternity UI |

<div>
  <br />
</div>

## <a name="more">📙 あとがき</a>

今回、Next.js のアウトプットのために EC サイトという様々な機能が組み合わさったサイトの実装に挑戦し、<br />
Supabase, Prisma を用いたデータ管理から Stripe の決済機能など、実際に設計から実装まで手を動かし、<br />
様々なドキュメントを調べたりテスト検証を行いながら構築を進めることで、<br />
たくさんの知識を得ることができました。<br />
<br />
途中、多くの機能実装やエラーなどで EC サイトを作成することに後悔をした瞬間もありましたが、<br />
今まで実装したことが無かったことを一つ一つ実装ができるように変わっていくことが原動力となり、<br />
完成まで進めることができました。<br />
特に、これまで Shopify の表面的なコーディングの仕事に携わってきましたが、<br />
アプリの機能面の実装がどのように行われているかの理解ができたことが一番の収穫でした。<br />
<br />
また、今回の EC サイトの制作はあくまでも Next.js の実装勉強のためであり、<br />
実際に EC サイトを制作＆運用する場合は Shopify のような既存の EC 構築プラットフォーム <br />
を使用した方が良いということは言うまでもありません。<br />
そのことを改めて痛感し、Shopify などの便利なプラットフォームの<br />
恩恵を強く実感したチャレンジでもありました。<br />
<br />
今後もコードの責務に応じた実装や関数の細分化などの自己課題があるため、<br />
コードの改善を続けてレベルアップをしていけたらと思います。<br />
最後までお読みいただきありがとうございました！

<div>
  <br />
</div>

## <a name="etc">🍦 その他</a>

* <a href="https://github.com/msrsrsk/nextjs_skill_sync/blob/f0569295c329436f24912d1b9c8536719f9db5f7/prisma/ERD.md" target="_blank" rel="noopener noreferrer">
ER 図
</a>
<div>
  <br />
</div>