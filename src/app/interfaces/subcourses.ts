export interface Subcourse {
  MODULE_CODE: string;
  MODULE_DESCRIPTION: string;
  CREDIT_HOURS: number;
  SUBJECT_GRADE_SU: string;
  GRADE: string;
  GRADE_NO_STAR: string;
  GRADE_POINT: number;
  GRADE_POINT_NO_STAR: string;
  INTERNAL_RESULT_RELEASE_DATE: string;
  INTERNAL_RESULT_RELEASE_DATE_ISO: string;
  RECOMMENDATION: string;
  SEMESTER: number;
  YEAR: string;
  GRADING_SCHEME: string;
  SUBJECT_PASS_FAIL?: string | null;
}
