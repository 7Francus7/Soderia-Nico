export type StopStatus = "pending" | "delivered" | "absent" | "confirmed" | "cancelled" | "rejected";

export interface DeliveryStop {
       orderId: number;
       clientId: number;
       clientName: string;
       clientAddress: string;
       clientPhone?: string;
       clientBalance: number;
       items: { name: string; qty: number }[];
       totalAmount: number;
       status: StopStatus;
}
