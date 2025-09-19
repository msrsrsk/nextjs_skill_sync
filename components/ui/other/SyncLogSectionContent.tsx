"use client"

import { useState } from "react"
import { AnimatePresence } from "framer-motion"

import LoadingSpinner from "@/components/common/display/LoadingSpinner"
import NoDataText from "@/components/common/display/NoDataText"
import TabSwitcher from "@/components/common/display/TabSwitcher"
import FadeInUpContainer from "@/components/common/display/FadeInUpContainer"
import SyncLogCard from "@/components/ui/other/SyncLogCard"
import { LinkButtonPrimary } from "@/components/common/buttons/Button"
import { syncLogConfig } from "@/data"
import { MoreIcon } from "@/components/common/icons/SvgIcons"
import { SYNC_LOG_CATEGORIES, SYNC_LOG_DISPLAY_CONFIG } from "@/constants/index"

const { SYNC_ALL } = SYNC_LOG_CATEGORIES;
const { SECTION_LIMIT } = SYNC_LOG_DISPLAY_CONFIG;

const SyncLogSectionContent = ({ categoryData }: { categoryData: SyncLogListsData }) => {
    const [activeTab, setActiveTab] = useState(SYNC_ALL);

    const { logLists } = categoryData;

    const filteredLogLists = {
        [activeTab]: logLists?.[activeTab]
    };

    return (
        <div className="max-w-2xl mx-auto">
            {Object.keys(categoryData).length === 0 ? (
                <NoDataText />
            ) : !logLists ? (
                <LoadingSpinner />
            ) : <>
                <TabSwitcher 
                    categories={SYNC_LOG_CATEGORIES}
                    activeTab={activeTab} 
                    setActiveTab={setActiveTab}
                    customClass="mb-8 justify-start sm:justify-center"
                />
                
                {Object.entries(filteredLogLists).map(([key, value]) => {
                    if (!value) return null;

                    const { logList, totalCount } = value;

                    return (
                        <div key={key}>
                            {!logList ? (
                                <LoadingSpinner />
                            ) : logList.length === 0 ? (
                                <AnimatePresence mode="wait">
                                    <FadeInUpContainer animationKey={activeTab}>
                                        <NoDataText />
                                    </FadeInUpContainer>
                                </AnimatePresence>
                            ) : (
                                <AnimatePresence mode="wait">
                                    <FadeInUpContainer animationKey={activeTab}>
                                        <div className="border-b border-sub">
                                            {logList.map(({ 
                                                id, 
                                                thumbnail, 
                                                title, 
                                                content, 
                                                category, 
                                                createdAt 
                                            }) => (
                                                <SyncLogCard 
                                                    key={id} 
                                                    id={id} 
                                                    thumbnail={thumbnail} 
                                                    title={title} 
                                                    content={content} 
                                                    category={category} 
                                                    createdAt={createdAt} 
                                                />
                                            ))}
                                        </div>
            
                                        {totalCount > SECTION_LIMIT && (
                                            <LinkButtonPrimary
                                                link={syncLogConfig[activeTab]?.path || '/sync-log'}
                                                customClass="button-space-default uppercase"
                                                ariaLabel={`${
                                                    activeTab === SYNC_ALL ? 
                                                    "すべての記事一覧を見る" : `「${activeTab}」の記事一覧を見る`
                                                }`}
                                            >
                                                <span aria-hidden="true">More</span>
                                                <MoreIcon />
                                            </LinkButtonPrimary>
                                        )}
                                    </FadeInUpContainer>
                                </AnimatePresence>
                            )}
                        </div>
                    )
                })}
            </>}
        </div>
    )
}

export default SyncLogSectionContent