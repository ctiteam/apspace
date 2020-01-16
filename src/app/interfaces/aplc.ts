export interface APLCClassDescription {
    CLASS_DESCRIPTION: null | string;
    EDATE: string;
    LECTURER_NAME: string;
    SDATE: string;
}

export interface APLCStudentBehaviour {
    ACADEMIC_BEH: number;
    AVERAGE_BEH: number;
    CLASS_CODE: string;
    COMPLETING_BEH: number;
    CONCEPT_BEH: number;
    DATE_UPDATED: string;
    IC_PASSPORT: string;
    LECTURER_CODE: string;
    LECTURER_UPDATED: string;
    REMARK: string;
    SOCIAL_BEH: number;
    STUDENT_NAME: string;
    STUDENT_NUMBER: string;
    SUBJECT_CODE: string;
}

export interface APLCStudentBehaviourPDF {
    STUDENT_NAME: string;
    STUDENT_NUMBER: string;
    REMARK: string;
    AVERAGE_BEH: number;
}
