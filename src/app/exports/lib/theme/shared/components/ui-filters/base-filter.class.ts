import { Directive, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { FilterTypesEnum, IFilterCriterion, IFilterOptions } from '../../../../interfaces/ui-filter-criterion.interface';

@Directive({
    selector: 'base-filter'
})
export class BaseFilter implements OnInit {

    @Input() showMode = true;
    @Input() canChangeMode = true;
    @Input() label!: string;
    @Input() property!: string;

    protected _mode!: FilterTypesEnum;

    @Input() set mode(mode: FilterTypesEnum) {
        this._mode = mode;
    }

    get mode(): FilterTypesEnum {
        return this._mode;
    }

    form: FormGroup;

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
    }, {
        label: 'entre',
        value: FilterTypesEnum.Between
    }];

    constructor(public fb: FormBuilder) {
        //
    }

    ngOnInit() {
        this.defineForm();
        this.initialize();
        this.disableTypeIfNeeded();
    }

    defineForm() {
        this.form = this.fb.group({
            type: new FormControl(),
            value: new FormControl()
        });
    }

    initialize() {
        this.setInitialType((this._mode) as FilterTypesEnum != null ? this._mode : FilterTypesEnum.Equals);
    }

    setInitialType(type: FilterTypesEnum) {
        this.form.get('type').setValue(type);
    }

    disableTypeIfNeeded() {
        if (!this.canChangeMode) {
            this.form.get('type').disable();
        }
    }

    get criterion(): IFilterCriterion | null {
        const filterData = this.getFilterData();

        return {
            type: filterData.type as FilterTypesEnum,
            value: filterData.value,
            property: this.property
        };
    }

    getFilterData(): { type: FilterTypesEnum; value: any; property: string } | null {

        const formCriterial = this.form.getRawValue();

        if (formCriterial) {
            return {
                type: this.form.value.type ? this.form.value.type : this.mode,
                property: this.property,
                value: this.form.value.value
            };
        } else {
            return null;
        }
    }
}