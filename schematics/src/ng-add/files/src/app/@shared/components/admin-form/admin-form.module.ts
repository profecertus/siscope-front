import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminFormComponent } from './admin-form.component';
import { ButtonModule, DatepickerModule, DevUIModule, FormModule, SelectModule } from 'ng-devui';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, FormModule, DatepickerModule, FormsModule, SelectModule, ButtonModule, DevUIModule],
  declarations: [AdminFormComponent],
  exports: [AdminFormComponent],
})
export class AdminFormModule {}
