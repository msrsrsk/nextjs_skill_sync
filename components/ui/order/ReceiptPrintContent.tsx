"use client"

import { PDFViewer } from "@react-pdf/renderer"
import ReceiptPDF from "@/components/common/display/ReceiptPDF"

const ReceiptPrintContent = ({ 
    order,
    isSubscription = false,
    subscriptionPaymentId
}: ReceiptPDFProps) => {
    return (
        <div style={{ width: '100%', height: '100vh' }}>
            <PDFViewer style={{ width: '100%', height: '100%' }}>
                <ReceiptPDF 
                    order={order} 
                    isSubscription={isSubscription}
                    subscriptionPaymentId={subscriptionPaymentId}
                />
            </PDFViewer>
        </div>
    )
}

export default ReceiptPrintContent