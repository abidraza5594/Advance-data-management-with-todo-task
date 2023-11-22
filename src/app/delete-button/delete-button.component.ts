import { Component } from '@angular/core';
import { ICellEditorAngularComp } from 'ag-grid-angular';
import { DataService } from '../data.service';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { UpdateDataService } from '../update-data.service';
import { ActionsService } from '../actions.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { UpdateDeleteData } from '../home/Servicess/update-delete-data';

@Component({
  selector: 'app-delete-button',
  template: `
    <button class="btn btn-light ml-3" (click)="editHandler()" *ngIf="action.edit">Edit</button>
    <button class="btn btn-light ml-3" (click)="deleteHandler()" *ngIf="action.del">{{deleting?'Deleting':'Delete'}}</button>
    <button class="btn btn-light ml-3" (click)="reStoreData()" *ngIf="action.res">{{reStore?'ReStoring':'ReStore'}}</button>
  `,
  styleUrls: ['./delete-button.component.css'] 
})
export class DeleteButtonComponent implements ICellEditorAngularComp {
  constructor(private datafromapi: DataService,private http: HttpClient,private toastr: ToastrService,
    private updatedata:UpdateDataService,private actions:ActionsService,
    private router: Router,private route: ActivatedRoute,
    private updatedeletedata:UpdateDeleteData){

    }

  apiUrl: any = "https://6544d3e45a0b4b04436d0bfc.mockapi.io/food"
  params: any;
  isShowEdit:boolean=false
  action:any={}
  rowData:any

  agInit(params: any): void {
    this.params = params;
    if (!this.params.data) {
      console.error('Row data is missing.');
    }
  }
  

  getValue(): any {
    // The return value here will be the new value of the cell
    return false;
  }

  
  updateData() {
    this.datafromapi.getDataFromAPI().subscribe((response: any) => {
      let updatedData = response.filter((item:any) => item.isdeleted === false);
      this.updatedata.sendUpdatedData(updatedData)

      let deletredData = response.filter((item:any) => item.isdeleted === true);
        this.updatedeletedata.sendData(deletredData);

    });
  }
  deleting:boolean=false
  async deleteHandler() {
    this.deleting=true
    let updatedD = { ...this.params.data, isdeleted: true };
    try {
      const resp = await this.http.put(`${this.apiUrl}/${this.params.data.id}`, updatedD).toPromise();
      resp ? this.deleting=false : this.deleting=true
    } catch (error) {
      console.log(error);
    }
    this.updateData();
    this.toastr.success('Data deleted..!', 'Successful..!');
  }


  // ----------------- Edit -------------------
  editHandler() {
    this.rowData = this.params.data;
    this.datafromapi.sendData(this.rowData);
    this.router.navigate([`edit/${this.params.data.id}`]);
  }

  reStore:boolean=false
  async reStoreData() {
    this.reStore=true
    let updatedD = { ...this.params.data, isdeleted: false };
    try {
      const resp = await this.http.put(`${this.apiUrl}/${this.params.data.id}`, updatedD).toPromise();
      resp?this.reStore=false:this.reStore=true
    } catch (error) {
      console.log(error);
    }
  
    this.datafromapi.getDataFromAPI().subscribe(
      (response: any) => {
        let deletredData = response.filter((item:any) => item.isdeleted === true);
        this.updatedeletedata.sendData(deletredData);

        let updatedData = response.filter((item:any) => item.isdeleted === false);
      this.updatedata.sendUpdatedData(updatedData)
      },
      (error) => {
        console.log(error);
      },
      () => {
        this.toastr.success('Data Re-store..!', 'Successful..!');
      }
    );
  }
  




  ngOnInit() {

    this.actions.data$.subscribe((data) => {
      this.action=data
    });
  
}



}
