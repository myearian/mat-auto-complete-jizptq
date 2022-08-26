import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { debounceTime, mergeMap, tap, map } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material';

import { Company } from './company';

@Component({
  selector: 'hello',
  templateUrl: './hello.component.html',
})
export class HelloComponent implements OnInit {
  @Input() companyForm: FormGroup;
  filteredCompanies: Observable<Company[]>;
  @Output() optionSelected = new EventEmitter();
  companydata: Observable<Company[]>;

  placeholder: string = 'state';

  companies: Company[] = [
    { companyName: 'Nebraska' },
    { companyName: 'Iowa' },
    { companyName: 'Wyoming' },
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.companydata = of(this.companies);
    this.filteredCompanies = this.companyForm
      .get('company')
      .valueChanges.pipe(
        tap((val) =>
          console.log('inside valueChanges Observable, val is: ', val)
        ),
        debounceTime(200)
      )
      .pipe(mergeMap((val) => this.filter(val)));
  }

  private filter(value: string | Company): Observable<Company[]> {
    const val = typeof value === 'string' ? value : value.companyName;
    console.log('inside filter, value is: ', value);
    if (val) {
      return this.companydata.pipe(
        map((cos: Company[]) => {
          return cos.filter((co: Company) => {
            return (
              co.companyName
                .toLowerCase()
                .search(
                  typeof val === 'string'
                    ? val.toLowerCase()
                    : (<Company>val).companyName.toLowerCase()
                ) !== -1
            );
          });
        })
      );
    } else {
      return this.companydata;
    }
  }

  click() {
    if (this.companyForm.get('company').value != '') {
      this.placeholder = this.companyForm.get('company').value;
    }
    this.companyForm.get('company').setValue('');
  }

  focusout() {
    this.companyForm.get('company').setValue(this.placeholder);
    console.log(this.companyForm.get('company').value);
  }

  onSelectionChanged(event: any) {
    console.log('event: option selected is ', event);
    this.optionSelected.emit(event);
    if (
      this.companyForm.get('company').value != '' &&
      this.isState(this.companyForm.get('company').value)
    ) {
      this.placeholder = this.companyForm.get('company').value;
    }
  }

  isState(val): boolean {
    let test = this.companies.find((e) => e.companyName == val);
    if (test.companyName != '') {
      return true;
    } else {
      return false;
    }
  }

  displayCo(company?: string): string {
    console.log(company);
    return company ? company : '';
  }
}
