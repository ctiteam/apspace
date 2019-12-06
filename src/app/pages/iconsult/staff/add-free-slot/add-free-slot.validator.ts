import { DatePipe } from '@angular/common';
import { AbstractControl, FormArray, FormGroup } from '@angular/forms';

export class AddFreeSlotValidator {
    // Calculate total weightage of all assessment components is 100%
    static checkDuplicateTime(control: AbstractControl): { [key: string]: any } | null {
        const parent: FormGroup = control.parent as FormGroup;
        const datePipe: DatePipe = new DatePipe('en-US');

        if (
            !parent ||
            !parent.parent ||
            !parent.parent.parent
        ) {
            return null;
        }
        const selectedTime = parent.get('slotsTime').value;
        let isDuplicated = false;
        const timeSlots = parent.parent.parent.get('time') as FormArray;

        if (selectedTime !== '') {
            const checkDuplicationArray = timeSlots.controls.map(ts => {
                return datePipe.transform(ts.get('slotsTime').value, 'HH:mm');
            }).filter((mappedTimeSlot, index, mappedTimeSlots) =>
                mappedTimeSlots.indexOf(mappedTimeSlot) !== index && mappedTimeSlot !== null
            );

            if (checkDuplicationArray.length > 0) {
                isDuplicated = true;
            }
        }

        const error = (
            isDuplicated
        ) ? { isDuplicated: true } : null;

        return error;
    }
}
