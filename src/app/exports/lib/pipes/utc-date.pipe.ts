import { DatePipe } from "@angular/common"
import { Pipe, PipeTransform } from "@angular/core"

import { convertUTCDate } from "../utils/date-utc.util"

@Pipe({
  name: "utcDate",
})
export class UtcDatePipe extends DatePipe implements PipeTransform {
  transform(value: any, args?: any): any {

    const parseDate = convertUTCDate(value)

    return super.transform(parseDate, args ? args : "dd-MM-yyyy HH:mm")
  }
}
