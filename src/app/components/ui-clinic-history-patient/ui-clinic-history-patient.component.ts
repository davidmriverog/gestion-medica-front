import { AfterContentInit, Component, Input, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { shareReplay } from "rxjs/operators";
import { SandboxAPIService } from "src/app/exports/lib";
import { PatientModel } from "src/app/project/models/clinic/patient.model";

import * as moment from "moment-timezone"

@Component({
  selector: "ui-clinic-history-patient",
  templateUrl: "./ui-clinic-history-patient.component.html"
})
export class UIClinicHistoryPatient implements OnInit, AfterContentInit {

  @Input()
  patientId: string

  patient$: Observable<any>

  constructor(
    private sandboxService: SandboxAPIService
  ) {}

  ngOnInit(): void {
    //
  }

  ngAfterContentInit(): void {
    //

    if (this.patientId) {
      this.infoPatient()
    }
  }

  showAge(date: Date): string {

    const now = moment()

    const diffAge = now.diff(moment(new Date(date)), "years")


    return `${diffAge} Año(s) ${now.format("M")} Mes(es)`
  }

  protected infoPatient(): void {
    this.patient$ = this.sandboxService.findById(PatientModel, this.patientId).pipe(
      shareReplay()
    )
  }
}
