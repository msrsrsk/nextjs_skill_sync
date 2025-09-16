"use client"

import Link from "next/link"
import parse from "html-react-parser"
import { motion } from "framer-motion"
import { HTMLReactParserOptions, DOMNode, Element, Text } from "html-react-parser"
import { ChevronDown } from "lucide-react"

import Breadcrumb from "@/components/ui/navigation/Breadcrumb"
import PageTitle from "@/components/common/display/PageTitle"
import useFaqAccordion from "@/hooks/layout/useFaqAccordion"
import { faqData } from "@/data/faq"
import { accordionAnimation } from "@/lib/motion"

interface FaqItemProps {
    itemKey: string
    isExpanded: boolean
    toggleAccordion: (
        categoryIndex: number, 
        faqIndex: number
    ) => void
    categoryIndex: number
    faqIndex: number,
    faq: {
        question: string
        answer: string
    }
}

const FaqPage = () => {
    const { toggleAccordion, getExpandedState } = useFaqAccordion();

    return <>
        <Breadcrumb />

        <div className="c-container-page">
            <PageTitle 
                title="Faq" 
                customClass="mt-6 mb-8 md:mt-10 md:mb-10"
            />

            <div className="max-w-xl mx-auto grid gap-8 md:gap-[56px]">
                {faqData.map((categoryData, categoryIndex) => (
                    <section key={categoryIndex}>
                        <h2 className="faq-title">
                            {categoryData.category}
                        </h2>
                        <div className="faq-wrapper">
                            {categoryData.faqs.map((faq, faqIndex) => {
                                const itemKey = `${categoryIndex}-${faqIndex}`
                                const isExpanded = getExpandedState(
                                    categoryIndex, 
                                    faqIndex
                                )

                                return (
                                    <FaqItem
                                        key={itemKey}
                                        itemKey={itemKey}
                                        isExpanded={isExpanded}
                                        toggleAccordion={toggleAccordion}
                                        categoryIndex={categoryIndex}
                                        faqIndex={faqIndex}
                                        faq={faq}
                                    />
                                )
                            })}
                        </div>
                    </section>
                ))}
            </div>
        </div>
    </>
}

const FaqItem = ({
    itemKey,
    isExpanded,
    toggleAccordion,
    categoryIndex,
    faqIndex,
    faq,
}: FaqItemProps) => {
    const createHtmlParserOptions = (): HTMLReactParserOptions => ({
        replace: (domNode:  DOMNode) => {
            if (domNode.type === 'tag' && domNode.name === 'a') {
                const element = domNode as Element;
                const textNode = element.children[0] as Text;

                return (
                    <Link 
                        href={element.attribs.href}
                        className={"text-brand underline"}
                        prefetch={true}
                    >
                        {textNode.data}
                    </Link>
                );
            }
        }
    });

    return (
        <article key={itemKey} className="faq-box">
            <button 
                className="faq-question__button"
                aria-expanded={isExpanded}
                aria-controls={`faq-${itemKey}`}
                onClick={() => toggleAccordion(categoryIndex, faqIndex)}
            >
                <div className="faq-question__inner">
                    <div className="faq-prefix__box">
                        <span className="faq-prefix faq-prefix__q">Q</span>
                    </div>
                    <p className="faq-question__text">
                        {faq.question}
                    </p>
                </div>
                <ChevronDown className={`faq-toggle${
                    isExpanded ? ' rotate-180' : ''
                }`} />
            </button>
            <motion.div
                id={`faq-${itemKey}`} 
                className="faq-answer__box overflow-hidden"
                role="region"
                aria-labelledby={`faq-${itemKey}`}
                variants={accordionAnimation()}
                initial="initial"
                animate={isExpanded ? 'animate' : 'exit'}
            >
                <div className="faq-answer__inner">
                    <div className="faq-prefix__box">
                        <span className="faq-prefix faq-prefix__a">A</span>
                    </div>
                    <p className="faq-answer__text">
                        {parse(faq.answer, createHtmlParserOptions())}
                    </p>
                </div>
            </motion.div>
        </article>
    )
}

export default FaqPage