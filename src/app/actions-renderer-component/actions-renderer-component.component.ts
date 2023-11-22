
import { Component } from '@angular/core';

@Component({
  selector: 'app-actions-renderer',
  template: `
    <div class="row">
      <div class="col-3">
        <button (click)="edit()" type="button" class="btn btn-primary mx-2">Edit</button>
      </div>
      <div class="col-3" style="z-index: 100;">
        <button type="button" class="btn btn-danger mx-2" (click)="delete()">{{ params.data.isDeleting ? 'Deleting' : 'Delete' }}</button>
      </div>
      <div class="col">
        <button (click)="toggleDone()" class="btn btn-light">{{ params.data.done ? 'Mark Undone' : 'Mark Done' }}</button>
      </div>
    </div>
  `,
})
export class ActionsRendererComponentComponent {
  params: any;

  agInit(params: any): void {
    this.params = params;
  }

  edit(): void {
    this.params.edit(this.params.data);
  }

  delete(): void {
    this.params.delete(this.params.data);
  }

  toggleDone(): void {
    this.params.toggleDone(this.params.data);
  }
}

