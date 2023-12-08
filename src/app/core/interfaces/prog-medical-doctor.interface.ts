export class ProgMedicalTurnDate {
  day: Date;
  title: string;
  progMedicalTurns: Array<any>
}

export class MedicalOfficeProg {
  medicalOfficeId: string;
  officeName: string;
  dates: Array<ProgMedicalTurnDate>
}

export class ProgMedicalCalendar {
  periodId: string;
  periodName: string;
  from: Date;
  to: Date;
  arrDates: Array<string>;
  medicalOffices: Array<MedicalOfficeProg>
}