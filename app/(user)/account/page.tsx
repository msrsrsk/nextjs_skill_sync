import Link from "next/link"
import { Metadata } from "next"

import Breadcrumb from "@/components/ui/navigation/Breadcrumb"
import PageTitle from "@/components/common/display/PageTitle"
import AccountLogoutButton from "@/components/ui/auth/AccountLogoutButton"
import { generatePageMetadata } from "@/lib/metadata/page"
import { requireUser } from "@/lib/middleware/auth"
import { accountLinks } from "@/data/links"
import { USER_METADATA } from "@/constants/metadata/user"

export const metadata: Metadata = generatePageMetadata({
    ...USER_METADATA.ACCOUNT
})

const AccountPage = async () => {
    const { user } = await requireUser();

    return <>
        <Breadcrumb />

        <div className="c-container-page">
            <PageTitle 
                title="Account" 
                customClass="mt-6 mb-8 md:mt-10 md:mb-[56px]" 
            />

            <h3 className="text-center text-lg md:text-xl leading-[32px] font-medium mb-1 md:mb-3">
                {user.name} 様
            </h3>

            <AccountLogoutButton />

            <div className="max-w-2xl mx-auto grid gap-10 md:gap-[48px]">
                {accountLinks.map((link) => (
                    <div key={link.title}>
                        <div className="product-subtitle mb-6">
                            <h3 className="account-title bg-background inline-block relative z-10 pr-4 md-lg:pr-8">
                                {link.title}
                            </h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-[41px]">
                            {link.links.map((link) => (
                                <Link 
                                    key={link.label}
                                    className="flex items-center gap-2 py-3 px-5 md:py-5 md:px-6 bg-soft-white rounded-sm"
                                    href={link.href}
                                >
                                    <div className="w-[64px] h-[64px] grid place-items-center text-brand">
                                        <link.icon className={link.iconClassName} />
                                    </div>
                                    <div className="grid gap-1">
                                        <h4 className="text-base leading-[28px] font-bold">
                                            {link.label}
                                        </h4>
                                        <span 
                                            className="text-sm leading-[20px] font-semibold font-poppins" 
                                            aria-hidden="true"
                                        >
                                            {link.sublabel}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </>
}

export default AccountPage