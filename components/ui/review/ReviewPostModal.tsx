"use client"

import { useState, useEffect } from "react"
import { useFormStatus } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"

import Overlay from "@/components/common/display/Overlay"
import StarRatingInput from "@/components/ui/review/StarRatingInput"
import FormLabel from "@/components/common/forms/FormLabel"
import FormInput from "@/components/common/forms/FormInput"
import FormTextarea from "@/components/common/forms/FormTextarea"
import FormErrorText from "@/components/common/forms/FormErrorText"
import DropZone from "@/components/ui/form/DropZone"
import PendingContent from "@/components/common/buttons/PendingContent"
import useDisplayNameValidation from "@/hooks/validation/useDisplayNameValidation"
import useTextareaValidation from "@/hooks/validation/useTextareaValidation"
import usePreventScroll from "@/hooks/utils/usePreventScroll"
import { fadeScale } from "@/lib/utils/motion"
import { EventButtonPrimary, EventButtonSecondary } from "@/components/common/buttons/Button"
import { BUTTON_TEXT_TYPES, BUTTON_TYPES, TEXTAREA_SCHEMA_TYPES } from "@/constants/index"

const { BUTTON_JA } = BUTTON_TEXT_TYPES;
const { SUBMIT_TYPE } = BUTTON_TYPES;
const { REVIEW_TYPE } = TEXTAREA_SCHEMA_TYPES;

interface ReviewPostModalProps extends ModalStateProps {
    handleSubmit: ReviewSubmitHandler;
    productId: ProductId;
}

const ReviewPostModal = ({ 
    modalActive, 
    setModalActive, 
    handleSubmit, 
    productId,
}: ReviewPostModalProps) => {
    const [rating, setRating] = useState<number>(0);
    const [files, setFiles] = useState<File[]>([]);

    const { 
        displayName, 
        setDisplayName,
        errorList: displayNameErrorList, 
        isValid: displayNameIsValid,
        handleDisplayNameChange 
    } = useDisplayNameValidation();
    const { 
        textarea, 
        setTextarea,
        errorList: textareaErrorList, 
        isValid: textareaIsValid,
        handleTextareaChange 
    } = useTextareaValidation({ schemaType: REVIEW_TYPE });

    usePreventScroll(modalActive);

    const onSubmit = (formData: FormData) => {
        handleSubmit(formData, files);
    };

    const resetForm = () => {
        setRating(0);
        setDisplayName('');
        setTextarea('');
        setFiles([]);
    };

    useEffect(() => {
        if (modalActive) {
            resetForm();
        }
    }, [modalActive]);

    const isValid = displayNameIsValid && textareaIsValid && rating > 0;

    return <>
        <AnimatePresence mode="wait">
            {modalActive && (
                <div>
                    <div className="modal-container">
                        <motion.div 
                            initial="hidden"
                            animate="show"
                            exit="hidden"
                            variants={fadeScale()}
                            className="bg-white w-[calc(100vw-40px)] max-w-lg max-h-[calc(100vh-80px)] rounded-sm pt-5 pl-5 pr-1 pb-6 md:pt-8 md:pl-10 md:pb-[36px] flex flex-col"
                        >
                            <div className="overflow-y-auto flex-1 pr-4 md:pr-8 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-sub [&::-webkit-scrollbar-thumb]:rounded-full">
                                <form 
                                    action={onSubmit} 
                                    className="grid gap-5 md:gap-[28px] pb-[2px]"
                                >
                                    <div>
                                        <label className="review-form-label">
                                            評価
                                        </label>
                                        <input 
                                            type="hidden" 
                                            name="rating" 
                                            value={rating} 
                                        />
                                        <StarRatingInput 
                                            rating={rating}
                                            setRating={setRating}
                                            onChange={(value) => setRating(value)}
                                        />
                                    </div>
                                    <div>
                                        <FormLabel 
                                            name="name" 
                                            label="表示名" 
                                        />
                                        <FormInput 
                                            name="name" 
                                            type="text" 
                                            value={displayName}
                                            placeholder="お名前" 
                                            onChange={handleDisplayNameChange}
                                            error={displayNameErrorList}
                                            customClass="bg-form-bg"
                                        />
                                        <FormErrorText errorList={displayNameErrorList} />
                                    </div>
                                    <div>
                                        <FormLabel 
                                            name="textarea" 
                                            label="レビュー内容" 
                                        />
                                        <FormTextarea 
                                            name="textarea" 
                                            value={textarea}
                                            placeholder="ここにレビューをご入力ください" 
                                            onChange={handleTextareaChange}
                                            error={textareaErrorList}
                                            customClass="bg-form-bg h-[200px]"
                                        />
                                        <FormErrorText errorList={textareaErrorList} />
                                    </div>
                                    <div>
                                        <FormLabel 
                                            name="file" 
                                            label="添付ファイル" 
                                        />
                                        <DropZone 
                                            files={files}
                                            setFiles={setFiles}
                                        />
                                    </div>
                                    <div>
                                        <p className="text-[13px] md:text-sm leading-[24px] font-medium text-center mb-4 mt-3 md:mb-6">※送信されたレビューはストアオーナーの承認後に表示されます</p>
                                        <div className="flex justify-center items-center gap-4 md:gap-8">
                                            <EventButtonSecondary
                                                onClick={() => setModalActive(false)}
                                                text={BUTTON_JA}
                                            >
                                                戻る
                                            </EventButtonSecondary>
                                            <SubmitButton isValid={isValid} />
                                        </div>
                                    </div>
                                    {productId && 
                                        <input 
                                            type="hidden" 
                                            name="productId" 
                                            value={productId} 
                                        />
                                    }
                                </form>
                            </div>
                        </motion.div>
                    </div>
                    <Overlay 
                        isActive={modalActive} 
                        setActive={setModalActive}
                    />
                </div>
            )}
        </AnimatePresence>
    </>
}

const SubmitButton = ({ isValid }: { isValid: boolean }) => {
    const { pending } = useFormStatus();

    return (
        <EventButtonPrimary
            text={BUTTON_JA}
            type={SUBMIT_TYPE}
            disabled={!isValid || pending}
        >
            <PendingContent pending={pending} text="送信する" />
        </EventButtonPrimary>
    )
}

export default ReviewPostModal