import { formatOptimalSyncsStatus } from "@/services/product/format";
import { OPTIMAL_SYNC_TAG_TYPES } from "@/constants/index";

const { REQUIRED_TAG, OPTION_TAG, PICKUP_TAG } = OPTIMAL_SYNC_TAG_TYPES;

interface StatusBadgeProps {
  status: OptimalSyncTagType;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  return (
    <div
      className={`status-budge${status === REQUIRED_TAG ? " is-active" : ""}${
        status === OPTION_TAG ? " is-option" : ""
      }${status === PICKUP_TAG ? " is-pickup" : ""}`}
      aria-label={formatOptimalSyncsStatus(status)}
    >
      <span aria-hidden="true">{status}</span>
    </div>
  );
};

export default StatusBadge;
