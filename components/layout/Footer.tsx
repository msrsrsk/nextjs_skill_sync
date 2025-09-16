"use client"

import Image from "next/image"
import Link from "next/link"
import { Send, Gamepad2 } from "lucide-react"

import SocialLinks from "@/components/common/icons/SocialLinks"
import useIsPrintPage from "@/hooks/layout/useIsPrintPage"
import { LinkButtonPrimary, LinkButtonSecondary } from "@/components/common/buttons/Button"
import { BackgroundGradientAnimation } from "@/components/ui/aceternity/BackgroundGradientAnimation"
import { footerLinks, legalLinks } from "@/data/links"
import { BUTTON_SIZES, BUTTON_POSITIONS, SITE_MAP } from "@/constants/index"

const { BUTTON_LARGE } = BUTTON_SIZES;
const { POSITION_LEFT } = BUTTON_POSITIONS;
const { CONTACT_PATH, IMAGE_PATH } = SITE_MAP;

const Footer = () => {
    const isPrintPage = useIsPrintPage();

    return (
        <footer className={`footer-container${isPrintPage ? ' hidden' : ''}`}>
            <div className="footer-wrapper">
                <div className="footer-inner">
                    <div>
                        <Image 
                            className="footer-logo"
                            src={`${IMAGE_PATH}/logo.png`} 
                            alt="SKILL SYNC" 
                            width={300} 
                            height={50} 
                        />
                        <SocialLinks customClass="gap-x-5 gap-y-2 mt-6 md:mt-8" />
                        <LinkButtonPrimary
                            link={CONTACT_PATH}
                            position={POSITION_LEFT}
                            customClass="mt-8 md:mt-10"
                        >
                            Contact
                            <Send className="w-[18px] h-[18px]" strokeWidth={1.5} />
                        </LinkButtonPrimary>
                        <LinkButtonSecondary
                            link="https://sweet-obstacle-race-with-r3f.netlify.app/"
                            size={BUTTON_LARGE}
                            position={POSITION_LEFT}
                            isExternal={true}
                            customClass="mt-4"
                            ariaLabel="ゲームで息抜きする"
                        >
                            Play a bit
                            <Gamepad2 className="w-[22px] h-[22px]" strokeWidth={2} />
                        </LinkButtonSecondary>
                    </div>
                    <div className="footer-navlink-wrapper">
                        {footerLinks.map((links) => (
                            <div key={links.label} className="footer-navlink-box">
                                <h2 
                                    className="footer-navlink-title"
                                    aria-label={links.label}
                                >
                                    <span aria-hidden="true">
                                        &lt; {links.label} &gt;
                                    </span>
                                </h2>
                                <ul role="list">
                                    {links.children && links.children.map((link) => (
                                        <li 
                                            key={link.label} 
                                            className="footer-navlink-item"
                                        >
                                            <Link 
                                                href={link.href} 
                                                className="footer-navlink-link"
                                            >
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="footer-legal-wrapper">
                    <ul role="list" className="footer-legal-linkbox">
                        {legalLinks.map((link) => (
                            <li 
                                key={link.label} 
                                className="footer-legal-linklist"
                            >
                                <Link href={link.href}>
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <p className="footer-copyright">© 2XXX - Skill Sync</p>
                </div>
            </div>
            <BackgroundGradientAnimation
                gradientBackgroundStart="rgba(240, 240, 240, 0)"
                gradientBackgroundEnd="rgba(240, 240, 240, 0)"
                firstColor="147, 201, 203"
                secondColor="149, 204, 195"
                thirdColor="152, 208, 180"
                fourthColor="147, 201, 203"
                fifthColor="149, 204, 195"
                pointerColor="147, 201, 203"
                containerClassName="z-0"
            >
            </BackgroundGradientAnimation>
        </footer>
    )
}

export default Footer