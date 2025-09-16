import Link from "next/link"
import Image from "next/image"

import SyncLogTag from "@/components/common/labels/SyncLogTag"
import { formatHtmlToPlainText } from "@/lib/utils/format"
import { formatDate } from "@/lib/utils/format"
import { SITE_MAP } from "@/constants/index"

const { SYNC_LOG_PATH } = SITE_MAP;

const SyncLogCard = ({ 
    id, 
    thumbnail, 
    title, 
    content, 
    category, 
    createdAt 
}: SyncLogCardProps) => {
    const plainText = formatHtmlToPlainText(content);
    const formattedDate = formatDate(createdAt);

    return (
        <article>
            <Link 
                href={`${SYNC_LOG_PATH}/${category.name.toLowerCase()}/${id}`} 
                className="log-link"
                aria-label={`「${title}」の記事の詳細を見る`}
            >
                <div className="log-imagebox">
                    <Image 
                        src={thumbnail.url}
                        alt={`${title}の記事のサムネイル`}
                        width={350}
                        height={350}
                        className="image-common rounded-[8px] md:rounded-[14px]"
                    />
                </div>
                <div className="w-full">
                    <h3 className="log-title mb-2 md:mb-[10px]">{title}</h3>
                    <p className="log-text">
                        <span className="line-clamp-2">{plainText}</span>
                    </p>
                    <div className="log-metabox">
                        <SyncLogTag categoryName={category.name} />
                        <span className="log-date">{formattedDate}</span>
                    </div>
                </div>
            </Link>
        </article>
    );
};

export default SyncLogCard