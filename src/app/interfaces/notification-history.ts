export interface NotificationHistory {
    history: NotificationBody[];
    num_of_unread_messages: number;
    version: string;
}


export interface NotificationBody {
    category: string;
    content: string;
    message_id: number;
    read: boolean;
    sent_on: string;
    staff_id: string;
    staff_name: string;
    subcategory: string;
    title: string;
}
