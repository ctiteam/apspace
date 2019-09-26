export interface VisaDetails {
    applicant_fullname: string;
    applicant_id: string;
    applicant_traveldocno: string;
    found: string;
    increment_id: string;
    insurance_card_status: string;
    isValid: string;
    is_medical_valid: string;
    medical_numdays: string;
    medical_status: string;
    percent_desc: string;
    pmedical_numdays: string;
    pmedical_status: string;
    state: string;
    status: string;
    status_historys: StatusHistory[];
}

export interface StatusHistory {
    complete: string;
    created_at: string;
    progress_color: string;
    remark: string;
    status_title: string;
}
