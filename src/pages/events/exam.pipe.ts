import { Pipe, PipeTransform } from '@angular/core';
import { ExamSchedule } from '../../interfaces';

/**
 * Filter day for bus tracking.
 */
@Pipe({ name: 'nextExams' })
export class ExamPipe implements PipeTransform {
    /**
     * Filter trips for given day.
     *
     * @param exams - all exams of student
     */
    transform(exams: ExamSchedule[] | null): ExamSchedule[] {
        const now = new Date();
        return (exams || []).filter(exam => new Date(exam.since) >= now);
    }
}
