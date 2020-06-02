export interface EventComponentConfigurations {
    title?: string;
    color: string;
    pass: boolean;
    passColor: string;
    outputFormat: 'event-with-time-only' | 'event-with-date-only' | 'event-with-time-and-hyperlink' | 'event-with-date-and-hyperlink';
    type?: string;
    dateOrTime: string;   // TIME FORMAT 'HH mm A', DATE FORMAT: 'DAY MONTH YEAR'
    firstDescription?: string;
    secondDescription?: string;
    secondDescriptionIsDate?: boolean;
    thirdDescription?: string;
}
