export interface SurveyIntake {
    COURSE_CODE_ALIAS: string;
    COURSE_DESCRIPTION: string;
    INTAKE_CODE: string;
    INTAKE_NUMBER: string;
    PERIOD_FROM: string;
    PROGRAM_APPRAISAL: string | null;
    PROGRAM_APPRAISAL_DATE: string;
    STUDY_MODE: string;
    TYPE_OF_COURSE: string;
}

export interface SurveyModule {
    APPRAISAL_START_DATE: string;
    CLASS_CODE: string;
    COURSE_APPRAISAL: string | null;
    COURSE_APPRAISAL2: string | null;
    COURSE_CODE_ALIAS: string;
    COURSE_LEVEL: number;
    END_DATE: string;
    IC_PASSPORT: string;
    LECTURER_CODE: string;
    LECTURER_NAME: string | null;
    LECTURER_SCHOOL: string | null;
    LECTURER_TYPE: string | null;
    SAMACCOUNTNAME: string;
    START_DATE: string;
    STUDY_MODE: string;
    SUBJECT_CODE: string;
    SUBJECT_DESCRIPTION: string;
    TYPE_OF_COURSE: string;
}
