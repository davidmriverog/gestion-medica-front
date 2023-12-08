import { Component, OnDestroy, OnInit, ViewChild, AfterContentInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';

import * as moment from 'moment';
import { Observable } from 'rxjs';
import * as UUID from 'uuid';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Calendar, createDuration, OptionsInput, View } from '@fullcalendar/core';
import { FullCalendar } from 'primeng/fullcalendar';

import { SandboxAPIService, getPeriod, IAppState, convertUTCDate } from 'src/app/exports/lib';
import { AccountingPeriodModel } from 'src/app/project/models/ac/accounting-period.model';

import { MedicalOfficeModel } from 'src/app/project/models/clinic/medical-office.model';
import { PlanningMedicalTurnService } from 'src/app/project/services/prog/planning-medical-turn.service';
import { map, shareReplay, tap } from 'rxjs/operators';

@Component({
  selector: 'programming',
  templateUrl: './programming.component.html',
  styleUrls: ['./programming.component.scss']
})
export class ProgramingTurnComponent implements OnInit, AfterContentInit, AfterViewInit {

  medicalOffices$: Observable<MedicalOfficeModel[]>;
  periods$: Observable<AccountingPeriodModel[]>;

  filterForm: FormGroup;

  @ViewChild('fullCalendar', { static: true }) fullCalendar: FullCalendar;
  calendar: Calendar;
  options: OptionsInput;

  startDate: Date;
  endDate: Date;

  currentPeriod: any;

  events$: Observable<any[]>;

  constructor(
    private sandboxService: SandboxAPIService,
    private formBuilder: FormBuilder,
    private store: Store<IAppState>,
    private router: Router,
    private planningMedicalTurnService: PlanningMedicalTurnService
  ) {
    this.filterForm = this.formBuilder.group({
      accountingPeriodId: [''],
      medicalOfficeId: ['']
    });
  }

  ngOnInit() {

    this.options = {
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      locale: 'es',
      selectable: true,
      defaultDate: new Date(),
      timeZone: "UTC",
      defaultView: 'dayGridMonth',
      header: {
        right: 'prevButton, nextButton',
      },
      buttonText: {
        day: 'dia',
        week: 'semana',
        month: 'mes',
        today: 'hoy'
      },
      validRange: {
        start: this.startDate,
        end: this.endDate
      },
      dateClick: this.dateClick
    };

    this.medicalOffices$ = this.sandboxService.findAll<MedicalOfficeModel>(MedicalOfficeModel).pipe(
      tap((medicals) => {

        const first = medicals[0];

        if (first) {
          this.filterForm.get('medicalOfficeId').setValue(first._id);
        }
      }),
      shareReplay()
    )

    this.periods$ = this.sandboxService.findAll<AccountingPeriodModel>(AccountingPeriodModel);

    this.store.pipe(
      select(getPeriod)
    ).subscribe((period) => {

      this.currentPeriod = period;

      this.filterForm.get('accountingPeriodId').setValue(period._id);
    });

    this.filterForm.valueChanges.subscribe((result) => this.fetchCalendarTurn());

  }

  fetchCalendarTurn() {
    this.events$ = this.planningMedicalTurnService.progMedicalTurnCalendar(this.filterForm.get('accountingPeriodId').value, this.filterForm.get('medicalOfficeId').value).pipe(
      map((result) => result.events),
      map((events) => events.map(r => {
        const eventId = UUID.v1();

        return {
          id: eventId,
          title: `${r._id.speciality.name} (${r.total})`,
          start: r._id.attentionDate,
          color: `${r._id.speciality.color}`,
          allDay: true
        };
      })),
      shareReplay()
    )
  }

  ngAfterViewInit(): void {
    this.calendar = this.fullCalendar.getCalendar() as Calendar;

    if (this.currentPeriod) {
      this.selectPeriod(this.currentPeriod);
    }
  }

  ngAfterContentInit(): void {
    this.calendar = this.fullCalendar.getCalendar() as Calendar;
  }

  selectPeriod(period: any): void {
    this.currentPeriod = period;

    this.calendar.setOption('validRange', {
      start: this.currentPeriod.startDate,
      end: this.currentPeriod.endDate
    });
  }

  dateClick = (arg: { date: Date; dateStr: string; allDay: boolean; resource?: any; dayEl: HTMLElement; jsEvent: MouseEvent; view: View; }) => {

    this.router.navigate(['/prog/reprograming-list-by-date'], {
      queryParams: {
        day: arg.dateStr,
        medicalOfficeId: this.filterForm.get('medicalOfficeId').value
      }
    });
  }
}
