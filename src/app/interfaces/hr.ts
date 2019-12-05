export interface LeaveHistory {
    ACTION_BY: string;
    CODE: string;
    COMPANY: string;
    DEPARTMENT: string;
    FULLNAME: string;
    LEAVE_DATE: string;
    LEAVE_TYPE: string;
    RESPONSE_DATE: string;
    STATUS: string;
}

export interface LeaveBalance {
    ADVANCE: string;
    AVAILABLE: string;
    BALANCE: string;
    CF: string;
    CODE: string;
    COMPANY: string;
    DEPARTMENT: string;
    FCF: string;
    FULLNAME: string;
    FYE: string;
    FYP: string;
    LEAVE_CREDIT: string;
    LEAVE_TYPE: string;
    PENDING: string;
    PH_REPLACEMENT: string;
    TAKEN: string;
    TOTAL: string;
    TRANSFER: string;
    YTD: string;
    LEAVE_ACRONYM: string; // not coming from API
    LEAVE_TYPE_COLOR: string; // not coming from API
}

export interface PendingApproval {
    FULLNAME: string;
    ID: string;
    LEAVEDATE: string;
    LEAVETYPE: string;
    STATUS: string;
}

export interface OnLeaveOnMyCluster {
    CODE: string;
    FULLNAME: string;
    ID: string;
    LEAVEDATE: string;
    PHOTO: string; // not from the api
    EMAIL: string; // not from the api
}
