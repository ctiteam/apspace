export interface Classcode {
  CLASS_CODE: string;
  SUBJECT_CODE: string;
  LECTURER_CODE: string;
  COURSE_CODE_ALIAS: string;
  CLASSES: Array<{
    DATE: string;
    TIME_FROM: string;
    TIME_TO: string;
    TYPE: string;
    TOTAL: {
      PRESENT: number;
      LATE: number;
      ABSENT: number;
      ABSENT_REASON: number;
    };
  }>;
}
