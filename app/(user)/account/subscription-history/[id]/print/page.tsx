import { redirect } from "next/navigation"
import { SITE_MAP } from "@/constants/index"

const { SUBSCRIPTION_HISTORY_PATH } = SITE_MAP;

const SubscriptionPrintPage = () => {
    redirect(SUBSCRIPTION_HISTORY_PATH);
}

export default SubscriptionPrintPage