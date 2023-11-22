// actions-renderer.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-actions-renderer',
    template: `
    <div class="row">
      <div class="col-4 ">
        <button (click)="edit()" type="button" class="btn btn-primary ">Edit</button>
      </div>
      <div class="col-4" >
        <button type="button" class="btn btn-danger " (click)="delete()">{{ isDeleting ? 'Deleting' : 'Delete' }}</button>
      </div>
      <!-- <div class="col-4">
        <button (click)="toggleDone()" class="btn btn-light">{{ params.data.done ? 'Mark Undone' : 'Mark Done' }}</button>
      </div> -->
    </div>
  `,
})
export class ActionsRendererComponent {
    constructor(private router: Router, private dataService: DataService,
        private http: HttpClient,private toastr: ToastrService,) { }

    apiUrl: any = "https://6544d3e45a0b4b04436d0bfc.mockapi.io/food"
    params: any;

    agInit(params: any): void {
        this.params = params;
        console.log(params)
    }

    edit(): void {
        this.router.navigate([`/managetodo/edittodo/${this.params.data.id}`]);
        this.dataService.sendTodoEditData(this.params.data)
    }

    deleteHandler(): void {
        console.log("delete working")
        this.params.delete(this.params.data);
    }
    updateData() {
        this.dataService.getDataFromAPI().subscribe((response: any) => {
            let updateData = response.filter((item: any) => item.isdeleted === false);
            this.dataService.sendData(updateData)
        });
    }
    isDeleting:boolean=false 
    async delete() {
        this.isDeleting=true
        try {
            const resp = await this.http.put(`${this.apiUrl}/${this.params.data.id}`, { ...this.params.data, isdeleted: true }).toPromise();
            resp?this.isDeleting=false:this.isDeleting=true
            this.updateData();
            this.toastr.success('Data deleted Successful..!');
        } catch (error) {
            console.log(error);
            this.toastr.error('Failed to delete data', 'Error');
        }
    }

    toggleDone(): void {
        console.log("toggle working")
        this.params.toggleDone(this.params.data);
    }
}
