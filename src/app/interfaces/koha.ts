export interface Checkouts {
    author: string;
    date_due: Date;
    issue_date: Date;
    title: string;
}

export interface History {
    author: string;
    date_due: Date;
    issue_date: Date;
    return_date: Date;
    title: string;
}

export interface Fines {
    fine: string;
    name: string;
    user_id: string;
}

export interface LatestAdditions {
    author: string;
    date_created: Date;
    title: string;
}
