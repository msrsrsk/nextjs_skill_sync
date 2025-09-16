import { ToggleIcon } from "@/components/common/icons/SvgIcons"
import { PRODUCT_QUANTITY_SIZES, PRODUCT_QUANTITY_CONFIG } from "@/constants/index"

const { QUANTITY_MEDIUM } = PRODUCT_QUANTITY_SIZES;
const { MIN_QUANTITY } = PRODUCT_QUANTITY_CONFIG;

interface QuantityInputProps {
    size?: ProductQuantitySizeType;
    stock: ProductStock;
    quantity: number;
    handleDecrement: () => void;
    handleIncrement: () => void;
    handleQuantityChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const QuantityInput = ({
    size = QUANTITY_MEDIUM,
    stock,
    quantity,
    handleDecrement,
    handleIncrement,
    handleQuantityChange
}: QuantityInputProps) => {
    return (
        <div className={`quantity-box${
            size === QUANTITY_MEDIUM ? " is-medium" : " is-large"
        }`}>
            <button 
                className="quantity-button"
                onClick={handleDecrement}
                disabled={quantity <= MIN_QUANTITY}
                aria-label="数量を減らす"
            >
                <ToggleIcon 
                    verticalClass="hidden" 
                    customClass="quantity-icon"
                />
            </button>
            <input 
                type="number" 
                min={MIN_QUANTITY} 
                max={stock} 
                value={quantity} 
                onChange={handleQuantityChange}
                className="quantity-input"
            />
            <button 
                className="quantity-button"
                onClick={handleIncrement}
                disabled={quantity >= stock}
                aria-label="数量を増やす"
            >
                <ToggleIcon customClass="quantity-icon" />
            </button>
        </div>
    )
}

export default QuantityInput