export interface CgpaPerIntake {
    intakeCode: string;
    intakeDate: number;
    intakeDetails: {
        CREDIT_TRANSFERRED: number
        GPA: number,
        IMMIGRATION_GPA: number,
        SEMESTER: number,
        SEMESTER_ATTENDANCE: number,
        TOTAL_CREDIT_HOURS: number,
        TOTAL_MODULES_PASSED: number
    }[];
}
