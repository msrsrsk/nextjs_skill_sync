import { formatSoldOutNumber } from "@/lib/utils/format"
import { TREND_PRODUCT_SALES_VOLUME_THRESHOLD, TREND_STATUS_SIZES } from "@/constants/index"

const { TREND_STATUS_MEDIUM } = TREND_STATUS_SIZES;

interface TrendStatusProps {
    syncNum: number;
    size?: TrendStatusSizeType;
}

const TrendStatus = ({ 
    syncNum, 
    size = TREND_STATUS_MEDIUM
}: TrendStatusProps) => {
    const numericSyncNum = Number(syncNum) || 0;
    const threshold = Number(TREND_PRODUCT_SALES_VOLUME_THRESHOLD);

    return <>
        {numericSyncNum > 0 && numericSyncNum > threshold && (
            <div className={`trend-status${
                size === TREND_STATUS_MEDIUM ? " is-medium" : " is-large"
            }`}>
                <div className="trend-status-inner">
                    <div className="trend-status-anim">
                    </div>
                    <div className="trend-status-textbox">
                        <span className="trend-status-maintext">
                            {formatSoldOutNumber(syncNum)}
                        </span>
                        <span className="trend-status-subtext">
                            SYNC
                        </span>
                    </div>
                </div>
            </div>
        )}
    </>
}

export default TrendStatus