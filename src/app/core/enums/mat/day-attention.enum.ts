export enum DayOfWeekEnum {
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6,
  Sunday = 7
}

export interface IAttentionDay {
  id: DayOfWeekEnum;
  name: string;
}

export const attentionDaysLists: Array<IAttentionDay> = [
  {
    id: DayOfWeekEnum.Monday,
    name: 'Lunes'
  },
  {
    id: DayOfWeekEnum.Tuesday,
    name: 'Martes'
  },
  {
    id: DayOfWeekEnum.Wednesday,
    name: 'Miércoles'
  },
  {
    id: DayOfWeekEnum.Thursday,
    name: 'Jueves'
  },
  {
    id: DayOfWeekEnum.Friday,
    name: 'Viernes'
  },
  {
    id: DayOfWeekEnum.Saturday,
    name: 'Sábado'
  },
  {
    id: DayOfWeekEnum.Sunday,
    name: 'Domingo'
  },
];