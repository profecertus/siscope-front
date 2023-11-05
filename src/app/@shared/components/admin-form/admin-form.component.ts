import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormLayout } from 'ng-devui';
import { FormConfig } from './admin-form.type';

@Component({
  selector: 'da-admin-form',
  templateUrl: './admin-form.component.html',
  styleUrls: ['./admin-form.component.scss'],
})
export class AdminFormComponent implements OnInit {
  @Input() formConfig: FormConfig = {
    layout: FormLayout.Horizontal,
    labelSize: 'sm',
    items: [],
  };

  _formData: any = {};

  @Input() set formData(val: any) {
    console.log("INGRESO")
    console.log(val);
    this._formData = JSON.parse(JSON.stringify(val));
    console.log(
      this._formData
    )
  }

  @Output() submitted = new EventEmitter();

  @Output() canceled = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  submitPlanForm({ valid }: { valid: boolean }) {
    console.log(this._formData);
    if (valid) {
      this.submitted.emit(this._formData);
    }
  }

  cancel() {
    this.canceled.emit();
  }


}
