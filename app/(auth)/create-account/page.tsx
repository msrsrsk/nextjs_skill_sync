"use client"

import Breadcrumb from "@/components/ui/navigation/Breadcrumb"
import CreateAccountContent from "@/components/ui/auth/CreateAccountContent"
import EmailSent from "@/components/ui/auth/EmailSent"
import useCreateAccountForm from "@/hooks/form/useCreateAccountForm"

const CreateAccountPage = () => {
    const {
        createSuccess,
        errorMessage,
        email,
        timestamp,
        createFormAction,
    } = useCreateAccountForm();

    const isEmailSent = createSuccess && email;

    return <>
        <Breadcrumb />

        <div className="c-container-page">
            {isEmailSent ? (
                <EmailSent 
                    email={email}
                    success={createSuccess}
                    buttonText="アカウント作成"
                />
            ) : (
                <CreateAccountContent 
                    createFormAction={createFormAction}
                    errorMessage={errorMessage}
                    timestamp={timestamp}
                />
            )}
        </div>
    </>
}

export default CreateAccountPage