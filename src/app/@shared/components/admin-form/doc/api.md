```ts
import { AdminFormModule } from "src/app/@shared/admin-form/admin-form.module";
```

```html
<da-admin-form
  [formConfig]="formConfig"
  [formData]="formData"
  (submitted)="onSubmitted($event)"
  (canceled)="onCanceled($event)"
>
</da-admin-form>
```

```ts
export interface FormConfig {
  layout: "horizontal" | "vertical" | "columns";
  labelSize: "sm" | "" | "lg";
  items: any;
}
```
