"use client"

import { useEffect } from "react"
import { useFormStatus } from "react-dom"

import FormLabel from "@/components/common/forms/FormLabel"
import FormInput from "@/components/common/forms/FormInput"
import FormSelect from "@/components/common/forms/FormSelect"
import FormErrorText from "@/components/common/forms/FormErrorText"
import Modal from "@/components/common/modals/Modal"
import PendingContent from "@/components/common/buttons/PendingContent"
import useDisplayNameValidation from "@/hooks/validation/useDisplayNameValidation"
import usePostalCodeValidation from "@/hooks/validation/usePostalCodeValidation"
import useAddressLine1Validation from "@/hooks/validation/useAddressLine1Validation"
import useStateSelection from "@/hooks/validation/useStateSelection"
import useAddressLine2Validation from "@/hooks/validation/useAddressLine2Validation"
import usePreventScroll from "@/hooks/utils/usePreventScroll"
import { EventButtonPrimary } from "@/components/common/buttons/Button"
import { formStates } from "@/data"
import { FORM_DEFAULT_STATE, BUTTON_TEXT_TYPES, BUTTON_TYPES } from "@/constants/index"

const { BUTTON_JA } = BUTTON_TEXT_TYPES;
const { BUTTON_TYPE } = BUTTON_TYPES;

interface AccountInfoModalProps extends ModalStateProps {
    text: string;
    onConfirm: (formData: FormData) => void | Promise<void>;
    defaultValues: ShippingDefaultValues;
}

const AccountInfoModal = ({ 
    text, 
    modalActive, 
    setModalActive, 
    onConfirm,
    defaultValues,
}: AccountInfoModalProps) => {
    const { 
        displayName, 
        setDisplayName,
        errorList: displayNameErrorList, 
        isValid: displayNameIsValid,
        handleDisplayNameChange,
        resetDisplayName,
        validateName
    } = useDisplayNameValidation();
    const { 
        postalCode,
        setPostalCode,
        errorList: postalCodeErrorList, 
        isValid: postalCodeIsValid, 
        handlePostalCodeChange,
        resetPostalCode,
        validatePostalCode
    } = usePostalCodeValidation();
    const { 
        selectedState, 
        setSelectedState,
        handleStateChange,
        resetSelectedState
    } = useStateSelection();
    const { 
        addressLine1,
        setAddressLine1,
        errorList: addressLine1ErrorList, 
        isValid: addressLine1IsValid, 
        handleAddressLine1Change,
        resetAddressLine1,
        validateAddressLine1
    } = useAddressLine1Validation();
    const { 
        addressLine2,
        setAddressLine2,
        errorList: addressLine2ErrorList, 
        handleAddressLine2Change,
        resetAddressLine2,
        validateAddressLine2
    } = useAddressLine2Validation();

    usePreventScroll(modalActive);

    const handleFormSubmit = () => {
        const formData = new FormData();
        formData.append('name', displayName);
        formData.append('postal_code', postalCode);
        formData.append('state', selectedState);
        formData.append('address_line1', addressLine1);
        formData.append('address_line2', addressLine2);
        
        if (defaultValues?.id) formData.append('id', defaultValues.id);
        
        onConfirm(formData);
    }

    useEffect(() => {
        if (modalActive && Object.keys(defaultValues).length > 0) {
            const name = defaultValues.name || '';
            const postalCode = defaultValues.postal_code || '';
            const state = defaultValues.state || FORM_DEFAULT_STATE;
            const addressLine1 = defaultValues.address_line1 || '';
            const addressLine2 = defaultValues.address_line2 || '';

            setDisplayName(name);
            setPostalCode(postalCode);
            setSelectedState(state);
            setAddressLine1(addressLine1);
            setAddressLine2(addressLine2);

            validateName(name);
            validatePostalCode(postalCode);
            validateAddressLine1(addressLine1);
            validateAddressLine2(addressLine2);
        } else if (!modalActive) {
            resetDisplayName();
            resetPostalCode();
            resetSelectedState();
            resetAddressLine1();
            resetAddressLine2();
        }
    }, [modalActive, defaultValues]);

    const isValid = displayNameIsValid && postalCodeIsValid && addressLine1IsValid;

    return (
        <Modal
            modalActive={modalActive}
            setModalActive={setModalActive}
        >
            <p className="account-modal-title">{text}</p>

            <form className="pl-[2px]">
                <div className="form-box">
                    <div>
                        <FormLabel 
                            name="name" 
                            label="お名前" 
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
                            name="postal_code" 
                            label="郵便番号" 
                        />
                        <FormInput 
                            name="postal_code" 
                            type="text" 
                            value={postalCode}
                            placeholder="000-0000" 
                            onChange={handlePostalCodeChange}
                            error={postalCodeErrorList}
                            customClass="bg-form-bg"
                        />
                        <FormErrorText errorList={postalCodeErrorList} />
                    </div>
                    <div>
                        <FormLabel 
                            name="state" 
                            label="都道府県" 
                        />
                        <FormSelect 
                            name="state" 
                            value={selectedState}
                            options={formStates}
                            onChange={handleStateChange}
                            customClass="bg-form-bg"
                        />
                    </div>
                    <div>
                        <FormLabel 
                            name="address_line1" 
                            label="市区町村・番地" 
                        />
                        <FormInput 
                            name="address_line1" 
                            type="text" 
                            value={addressLine1}
                            placeholder="未来市仮想区1-2-3"
                            onChange={handleAddressLine1Change}
                            error={addressLine1ErrorList}
                            customClass="bg-form-bg"
                        />
                        <FormErrorText errorList={addressLine1ErrorList} />
                    </div>
                    <div>
                        <FormLabel 
                            name="address_line2" 
                            label="建物名・部屋番号" 
                        />
                        <FormInput 
                            name="address_line2" 
                            type="text" 
                            value={addressLine2}
                            placeholder="スキルシティ・シンクタワー 11F"
                            onChange={handleAddressLine2Change}
                            error={addressLine2ErrorList}
                            customClass="bg-form-bg"
                        />
                        <FormErrorText errorList={addressLine2ErrorList} />
                    </div>
                </div>

                {defaultValues?.id && (
                    <input type="hidden" name="id" value={defaultValues.id} />
                )}

                <SubmitButton 
                    isValid={isValid} 
                    handleFormSubmit={handleFormSubmit}
                />
            </form>
        </Modal>
    )
}

const SubmitButton = ({ 
    isValid, 
    handleFormSubmit
}: EditButtonProps) => {
    const { pending } = useFormStatus();

    return (
        <EventButtonPrimary
            customClass="button-space-default"
            text={BUTTON_JA}
            type={BUTTON_TYPE}
            disabled={pending || !isValid}
            onClick={handleFormSubmit}
        >
            <PendingContent pending={pending} text="保存する" />
        </EventButtonPrimary>
    )
}

export default AccountInfoModal