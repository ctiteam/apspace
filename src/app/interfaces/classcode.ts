export interface Classcode {
  CLASS_CODE: string;
  SUBJECT_CODE: string;
  LECTURER_CODE: string;
  CLASSES: Array<{
    DATE: string;
    TIME_FROM: string;
    TIME_TO: string;
    TYPE: string;
  }>;
}
