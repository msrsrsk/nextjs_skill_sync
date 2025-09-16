"use client"

import { useState } from "react"

import ConfirmModal from "@/components/common/modals/ConfirmModal"
import { signOutAction } from "@/lib/services/auth/actions"

const AccountLogoutButton = () => {
    const [modalActive, setModalActive] = useState(false);

    return <>
        <button
            className="text-sm leading-[32px] font-bold underline flex mx-auto mb-10"
            onClick={() => setModalActive(true)}
        >
            ログアウトする
        </button>

        <ConfirmModal 
            text="ログアウトしますか？"
            modalActive={modalActive}
            setModalActive={setModalActive}
            onConfirm={signOutAction}
        />
    </>
}

export default AccountLogoutButton