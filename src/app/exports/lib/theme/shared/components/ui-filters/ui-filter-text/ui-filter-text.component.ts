import { Component, forwardRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { FilterTypesEnum, IFilterOptions } from '../../../../../interfaces/ui-filter-criterion.interface';

import { BaseFilter } from '../base-filter.class';

@Component({
    selector: 'ui-text-filter',
    templateUrl: './ui-filter-text.component.html',
    providers: [
        {
            provide: BaseFilter,
            useExisting: forwardRef(() => UIFilterTextComponent),
            multi: true
        }
    ]
})
export class UIFilterTextComponent extends BaseFilter {

    filterOptions: Array<IFilterOptions> = [{
        label: 'igual a',
        value: FilterTypesEnum.Equals
    },
    {
        label: 'distinto a',
        value: FilterTypesEnum.NotEquals
    }, {
        label: 'contiene',
        value: FilterTypesEnum.Like
    }];

    initialize(): void {
        this.setInitialType(this._mode ? this._mode : FilterTypesEnum.Equals);
    }
}
