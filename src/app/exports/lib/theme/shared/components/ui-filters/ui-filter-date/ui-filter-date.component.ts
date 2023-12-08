import { Component, forwardRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { FilterTypesEnum, IFilterOptions } from '../../../../../interfaces/ui-filter-criterion.interface';

import { BaseFilter } from '../base-filter.class';

@Component({
    selector: 'ui-date-filter',
    templateUrl: './ui-filter-date.component.html',
    providers: [
        {
            provide: BaseFilter,
            useExisting: forwardRef(() => UIFilterDateComponent),
            multi: true
        }
    ]
})
export class UIFilterDateComponent extends BaseFilter {

    filterOptions: Array<IFilterOptions> = [{
        label: 'igual a',
        value: FilterTypesEnum.Equals
    },
    {
        label: 'distinto a',
        value: FilterTypesEnum.NotEquals
    },
    {
        label: 'entre',
        value: FilterTypesEnum.Between
    },
    {
        label: 'mayor que',
        value: FilterTypesEnum.GreatherThan
    },
    {
        label: 'menor que',
        value: FilterTypesEnum.LowerThanEquals
    }];

    filterTypesEnum = FilterTypesEnum;

    defineForm() {
        this.form = this.fb.group({
            type: ["", [Validators.required]],
            from: [],
            to: [],
            value: []
        })
    }

    initialize() {
        this.setInitialType(this._mode ? this._mode : FilterTypesEnum.Between);
    }

    getFilterData(): { type: FilterTypesEnum, value: any, property: string } {
        const filter: { type: FilterTypesEnum, value: any, to: any, from: any } = this.form.value;
        if (filter.type == FilterTypesEnum.Between) {
            filter.value = {
                from: filter.from,
                to: filter.to
            }
        } else if (filter.type == FilterTypesEnum.GreatherThan) {
            filter.value = filter.from
        } else if (filter.type == FilterTypesEnum.LowerThan) {
            filter.value = filter.to
        }

        const toRet = {
            type: filter.type,
            value: filter.value,
            property: this.property
        };

        return toRet
    }
}
