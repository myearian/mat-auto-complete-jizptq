import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material';

import { Company } from './company';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  companyName: string;
  initialSelection: Company = { companyName: '' };
  companyForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.companyForm = this.setCompany(this.initialSelection.companyName);
  }

  onSelected(event: any) {
    console.log('In app component: ' + event);
    this.companyName = event;
    /* let newSelection = { 
        companyName: this.companyName,
        description: "additional data"
      };*/
    // this.companyForm.get('company').setValue(this.companyName);
  }

  setCompany(comp: string): FormGroup {
    return this.fb.group({ company: comp }) as FormGroup;
  }
}
