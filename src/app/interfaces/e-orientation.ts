export interface OrientationStudentDetails {
    councelor_details: [
        {
            COUNCELOR_NAME: string,
            EMAIL: string,
            MOBILE_NO: string,
            SAMACCOUNTNAME: string
        }
    ];
    student_details: [
        {
            COUNTRY_OF_ORIGIN: string,
            COURSE: string,
            DOB: string,
            FEES_SCHEME: string,
            GENDER: string,
            GUARDIAN_EMAIL: string,
            GUARDIAN_MOBILE_TEL: string,
            GUARDIAN_NAME: string,
            GUARDIAN_RELATIONSHIP: string,
            IC: string,
            INTAKE_CODE: string,
            INTAKE_DATE: string,
            NATIONALITY: string,
            PARENTS_EMAIL: string,
            PARENTS_MOBILE_TEL: string,
            PARENTS_NAME: string,
            PARENTS_RELATIONSHIP: string,
            RACE: string,
            RELIGION: string,
            SCHOLARSHIP: string,
            STUDENT_EMAIL: string,
            STUDENT_MOBILE_NO: string,
            STUDENT_NAME: string,
            STUDENT_NUMBER: string,
            STUDENT_RESIDENTIAL_ADDRESS: string,
            STUDENT_PERMANENT_ADDRESS: string
        }
    ];
}

export interface OrientationStudentsList {
    COURSE: string;
    INTAKE: string;
    STUDENT_NAME: string;
    STUDENT_NUMBER: string;
}
