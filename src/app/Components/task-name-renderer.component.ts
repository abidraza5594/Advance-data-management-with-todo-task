// task-name-renderer.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-task-name-renderer',
  template: `
    <div [class.red-text]="!params.value" [class.green-text]="params.value">
      {{ params.value || 'No task for this user' }}
    </div>
  `,
  styles: [
    `
      .red-text {
        color: red;
      }

      .green-text {
        color: green;
      }
    `,
  ],
})
export class TaskNameRendererComponent {
  params: any;
}
