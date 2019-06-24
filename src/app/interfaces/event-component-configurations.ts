export interface EventComponentConfigurations {
    title?: string,
    color: string,
    pass: boolean,
    type: string,
    primaryDateTime?: string,
    secondaryDateTime?: string,
    quaternaryDateTime?: string,
    firstDescription?: string,
    secondDescription?: string,
    thirdDescription?: string
}

/*
EVENT TYPE COULD BE:
  1. events-with-time-only:
    LEFT ITEM HAS TIME NOT DATE

  2. events-with-date-only:
    LEFT ITEM HAS DATE

  3. events-with-time-and-hyperlink:
    LEFT ITEM HAS TIME AND THE SECOND DESCRIPTION IS WRAPPED WITH <a>

  4. events-with-date-and-hyperlink:
    LEFT ITEM HAS DATE AND THE SECOND DESCRIPTION IS WRAPPED WITH <a>
*/