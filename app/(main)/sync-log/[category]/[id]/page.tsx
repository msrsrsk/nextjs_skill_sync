import Image from "next/image"
import parse from "html-react-parser"
import { notFound } from "next/navigation"
import { HTMLReactParserOptions, DOMNode, Element } from "html-react-parser"
import { Metadata } from "next"

import Breadcrumb from "@/components/ui/navigation/Breadcrumb"
import SyncLogTag from "@/components/common/labels/SyncLogTag"
import ProductTag from "@/components/common/labels/ProductTag"
import UnderlineLink from "@/components/common/buttons/UnderlineLink"
import LoadingSpinner from "@/components/common/display/LoadingSpinner"
import { getSyncLogDetail } from "@/services/microcms/actions"
import { generatePageMetadata } from "@/lib/metadata/page"
import { formatDate } from "@/lib/utils/format"
import { LinkButtonPrimary } from "@/components/common/buttons/Button"
import { extractProductLink } from "@/services/product/extractors"
import { extractSyncLogData } from "@/services/microcms/extractors"
import { MoreIcon } from "@/components/common/icons/SvgIcons"
import { 
    SYNC_LOG_CATEGORIES, 
    BUTTON_SIZES, 
    BUTTON_TEXT_TYPES, 
    BUTTON_POSITIONS,
    SYNC_LOG_TAG_SIZES,
    SITE_MAP,
    NOIMAGE_PRODUCT_IMAGE_URL,
    METADATA_TYPES
} from "@/constants/index"

const { SYNC_UPDATES, SYNC_VOICES } = SYNC_LOG_CATEGORIES;
const { BUTTON_LARGE } = BUTTON_SIZES;
const { BUTTON_JA } = BUTTON_TEXT_TYPES;
const { POSITION_LEFT } = BUTTON_POSITIONS;
const { TAG_MEDIUM } = SYNC_LOG_TAG_SIZES;
const { SYNC_LOG_PATH, PRODUCT_PATH } = SITE_MAP;
const { ARTICLE } = METADATA_TYPES;

export async function generateMetadata({ 
    params 
}: { params: { id: string } }): Promise<Metadata> {
    const { id } = params;
    const logDetail = await getSyncLogDetail(id);

    if (!logDetail.success) notFound();

    const { data } = logDetail;

    return generatePageMetadata({
        title: data.title,
        description: data.excerpt,
        url: `${SYNC_LOG_PATH}/${data.category.name.toLowerCase()}/${id}`,
        type: ARTICLE,
        image: data.thumbnail.url
    });
}

const createHtmlParserOptions = (): HTMLReactParserOptions => ({
    replace: (domNode: DOMNode) => {
        if (domNode.type === 'tag' && domNode.name === 'a') {
            const element = domNode as Element;

            return (
                <a 
                    href={element.attribs.href} 
                    className="flex justify-center mt-6 mb-0 md:mt-10 md:mb-6"
                >
                    <button 
                        className="button-primary button-large"
                    >
                        商品を見る
                        <MoreIcon />
                    </button>
                </a>
            );
        }
    }
})

const SyncLogDetailPage = async ({ params }: { params: { id: string } }) => {
    const { id } = params;
    const logDetail = await getSyncLogDetail(id);

    if (!logDetail.success) notFound();

    const { data } = logDetail;

    const productLink = extractProductLink(data.content);
    const options = createHtmlParserOptions();

    const { 
        imageUrl, 
        categoryName, 
        productName 
    } = extractSyncLogData(productLink);  

    const LinkimageUrl = imageUrl ? `${PRODUCT_PATH}/${imageUrl}.png` : NOIMAGE_PRODUCT_IMAGE_URL;

    const isCategoryCondition = data.category.name === SYNC_UPDATES || data.category.name === SYNC_VOICES;

    return <>
        <Breadcrumb />

        <div className="c-container-page">
            <div className="pt-6 md:pt-10 max-w-lg mx-auto">
                {!data ? (
                    <LoadingSpinner />
                ) : (
                    <article>
                        <div className="mb-6 md:mb-8">
                            <h2 className="text-lg md:text-2xl font-bold leading-[32px] text-center mb-3 md:mb-5">
                                {data.title}
                            </h2>
                            <div className="flex justify-center items-center gap-4">
                                <SyncLogTag 
                                    categoryName={data.category.name} 
                                    size={TAG_MEDIUM} 
                                />
                                <span className="text-sm md:text-base leading-none font-medium font-poppins">
                                    {formatDate(data.createdAt)}
                                </span>
                            </div>
                        </div>

                        <div className="p-5 px-5 pb-8 md:pt-10 md:px-10 md:pb-12 bg-grass rounded-md">
                            <div className="mb-4 md:mb-8">
                                <Image 
                                    src={data.thumbnail.url}
                                    alt={`${data.title}の記事のサムネイル`}
                                    width={640}
                                    height={640}
                                    className="image-common rounded-[16px] md:rounded-[34px]"
                                />
                            </div>
                            <div className="article-content-box">
                                {parse(data.content, options)}
                            </div>

                            {isCategoryCondition && (
                                <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
                                    <div className="max-w-[200px] w-full">
                                        <Image
                                            src={LinkimageUrl}
                                            alt=""
                                            width={800}
                                            height={800}
                                            className="image-common drop-shadow-main-sp md:drop-shadow-main transform-gpu"
                                        />
                                    </div>
                                    <div>
                                        <div className="mb-3">
                                            <ProductTag category={categoryName} />
                                        </div>
                                        <h3 className="product-title mb-4">
                                            {productName}
                                        </h3>
                                        <div className="flex justify-center md:justify-start">
                                            <LinkButtonPrimary
                                                link={productLink || ""}
                                                size={BUTTON_LARGE}
                                                text={BUTTON_JA}
                                                position={POSITION_LEFT}
                                            >
                                                商品を見る
                                                <MoreIcon />
                                            </LinkButtonPrimary>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </article>
                )}

                <UnderlineLink 
                    href={SYNC_LOG_PATH} 
                    text="Back" 
                    customClass="mt-10 md:mt-[64px]" 
                />
            </div>
        </div>
    </>
}

export default SyncLogDetailPage