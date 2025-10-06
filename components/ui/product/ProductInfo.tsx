import ProductCountup from "@/components/ui/product/ProductCountup"
import ProductSyncConditions from "@/components/ui/product/ProductSyncConditions"
import { parseNewlineToArray } from "@/lib/utils/format"
import { formatCategory } from "@/services/product/format"

const ProductInfo = ({ product }: { product: ProductWithRelationsAndDetails }) => {
    if (!product) return null

    const { 
        category,
        product_pricings,
        product_details,
        product_relations
    } = product;

    const sold_count = product_pricings?.sold_count;
    const optimal_syncs_required_id = product_relations?.optimal_syncs_required_id;
    
    const { 
        sync_time, 
        target_level, 
        effective_date, 
        obtainable_skills, 
        side_effect, 
        skill_effects 
    } = product_details || {};

    const productInfoItems = [
        { key: 'sync_time', label: '同期時間　　：', value: sync_time },
        { key: 'target_level', label: '対象レベル　：', value: target_level },
        { key: 'effective_date', label: '有効期限　　：', value: effective_date },
        { key: 'category', label: 'カテゴリー　：', value: formatCategory(category) },
        { key: 'obtainable_skills', label: '取得スキル　：', value: obtainable_skills },
        { key: 'side_effect', label: '副作用　　　：', value: side_effect },
    ].filter(item => item.value);

    const skillEffectArray = parseNewlineToArray(skill_effects || '');
    const optimalSyncsArray = parseNewlineToArray(optimal_syncs_required_id || '');

    return (
        <div className="product-info">
            <div className="product-info-box">
                <div className="product-subtitle">
                    <h3 className="product-info-title">Global Syncs</h3>
                </div>
                <ProductCountup syncNum={sold_count || 0} />
            </div>

            <div className="product-info-box">
                <div className="product-subtitle">
                    <h3 className="product-info-title">Skill Spec</h3>
                </div>

                <dl>
                    {productInfoItems.map(({ key, label, value }) => (
                        <div key={key} className="product-info-dlbox">
                            <dt className="product-info-dt">{label}</dt>
                            <dd className="product-info-dd">{value}</dd>
                        </div>
                    ))}
                </dl>
            </div>

            {skillEffectArray.length > 0 && (
                <div className="product-info-box">
                    <div className="product-subtitle">
                        <h3 className="product-info-title">Skill Effects</h3>
                    </div>
                    <ul className="product-info-listbox">
                        {skillEffectArray.map((text, index) => (
                            <li key={index}>-  {text}</li>
                        ))}
                    </ul>
                </div>
            )}

            {optimalSyncsArray.length > 0 && (
                <ProductSyncConditions optimalSyncsArray={optimalSyncsArray} />
            )}
        </div>
    )
}

export default ProductInfo