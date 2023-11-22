import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../data.service';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { apiData } from '../Store/data.actions';

import { AgGridAngular } from 'ag-grid-angular';
import { CellClickedEvent, ColDef, GridReadyEvent } from 'ag-grid-community';
import {ICellRendererAngularComp} from 'ag-grid-angular';
import {ICellRendererParams} from "ag-grid-community";
import { DeleteButtonComponent } from '../delete-button/delete-button.component';
import { UpdateDataService } from '../update-data.service';
import { ActionsService } from '../actions.service';
import { UpdateDeleteData } from './Servicess/update-delete-data';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  apiUrl: any = "https://6544d3e45a0b4b04436d0bfc.mockapi.io/food"
  people: any[] = [];
  filteredPeople: any = []
  deletedData: any = []
  isEditShow: boolean = false
  editData: any = []
  selectedFilter: string = '';
  searchText: string = '';
  selectedAllDetel: string = '';
  isshowDeleteData: boolean = false
  isShowHome: boolean = true
  dropDownData: any = []
  selectedRowNumber: number = 0
  selectedItems: any = [];
  selectedFilterData: any = []
  selectedFilterDataDeleted: any = []
  dataFromAPI: any = []
  page: number = 1
  count: number = 0
  tableSize: number = 9
  selectedFilterDataTableSize = this.selectedFilterData.length
  tableSizes: any = [5, 10, 15, 20]
  dropdownList: any = [];
  dropdownSettings: IDropdownSettings = {}
  dropdownListDeleted: any = [];
  selectedItemsDeleted: any = [];
  dropdownSettingsDeleted: IDropdownSettings = {};
  apiData$: Observable<any>
  agevalue: boolean = false
  contactvalue: boolean = true

  constructor(private http: HttpClient,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private datafromapi: DataService,
    private updatedata:UpdateDataService,
    private actions:ActionsService,
    private updatedeleteddata:UpdateDeleteData,
    private store: Store<{ apiData: any }>) {

      this.updatedata.data$.subscribe((data) => {
        this.filteredPeople = data
      });

      

    this.apiData$ = store.select("apiData")
    this.apiData$.subscribe((data: any) => {
      
      this.people = data.data
    })

  }

  colDefs: ColDef[] = [
    {
      field: 'name', sortable: true,
      filter: true,
    },
    {
      field: 'age', sortable: true,
      filter: true,
    },
    {
      field: 'contact', sortable: true,
      filter: true,
    },
    { headerName: 'Actions', field: 'isdeleted',type: 'rightAligned'  ,cellRenderer:DeleteButtonComponent},
  ]


  showage: boolean = true;
  showcontact: boolean = true;
  checkboxChanged(checkboxId: string, event: any) {
    if (checkboxId === 'checkbox1') {
      this.showcontact = event.target.checked;
    } else if (checkboxId === 'checkbox2') {
      this.showage = event.target.checked;
    }
  }

  getIndex(params: any): number {
    return (this.page - 1) * this.tableSize + params.node.rowIndex + 1;
  }

  updateData() {
    this.datafromapi.getDataFromAPI().subscribe((response: any) => {
      this.people = response;
      this.filteredPeople = this.people.filter(item => item.isdeleted === false);

      this.dropdownList = this.filteredPeople.map((item: any) => ({ item_id: item.id, item_text: item.name }))
      this.deletedData = this.people.filter(item => item.isdeleted === true)
      this.dropdownListDeleted = this.deletedData.map((item: any) => ({ item_id: item.id, item_text: item.name }))
    });
  }
  
  async deleteHandler(person: any) {
    let updatedD = { ...person, isdeleted: true }
    try {
      const resp = await this.http.put(`${this.apiUrl}/${person.id}`, updatedD).toPromise();
    }
    catch (error) {
      console.log(error);
    }
    this.updateData()
    this.toastr.success('Data deleted..!', 'Successful..!');
    this.selectedFilterData = this.selectedFilterData.filter((item: any) => item.id !== person.id)
    this.selectedItems = this.selectedItems.filter((item: any) => item.item_id !== person.id)
  }

  onTableDataChange(event: any) {
    this.page = event
  }
  onTableSizeChange(event: any) {
    this.tableSize = event.target.value
    this.page = 1
  }

  isShowEdit:boolean=true
  isShowDelete:boolean=true
  isShowRestore:boolean=false
  
  selectAllDelete(value: string) {
    this.selectedRowData = []
    this.selectedFilterDataDeleted = []
    this.selectedItemsDeleted = []
    if (value === 'all') {

      this.isShowEdit=true
      this.isShowDelete=true
      this.isShowRestore=false

      this.actions.setData({edit:this.isShowEdit,del:this.isShowDelete,res:this.isShowRestore});

      this.isshowDeleteData = false
      this.isShowHome = true
      this.selectedFilterData = []
      this.selectedItems = []

      this.selectedRowData = []
      this.selectedrownum = 0
    } else {
      this.isShowRestore=true
      this.isShowDelete=false
      this.isShowEdit=false
      this.actions.setData({edit:this.isShowEdit,del:this.isShowDelete,res:this.isShowRestore});

      this.isshowDeleteData = true
      this.selectedFilterData = []
    }
  }

  selectNameContact(filter: string) {
    this.selectedFilter = filter;
  }

  selectedRowData: any = []
  selectedrownum: any = 0
  selectRow(num: number) {
    // this.selectedFilterData = []
    // this.selectedItems=[]
    this.selectedrownum = num
    this.tableSize = num
    this.onTableDataChange(1)
    this.onTableSizeChange(1)
    this.selectedRowNumber = num
    this.selectedFilterData = this.selectedFilterData.slice(0, num)

  }




  

  ngOnInit() {
    this.actions.setData({edit:this.isShowEdit,del:this.isShowDelete,res:this.isShowRestore});

    this.datafromapi.getDataFromAPI().subscribe((data: any) => {
      this.store.dispatch(apiData({ data: data }))
    })

    this.updatedeleteddata.getData().subscribe((data) => {
      this.deletedData = data;
    });
    
    this.updateData();
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
    };
  }

  onItemSelect(item: any) {
    console.log(this.selectedItems)
    this.selectedRowData = []
    let selectItem = this.filteredPeople.filter((data: any) => data.id === item.item_id)
    this.selectedFilterData.unshift(selectItem[0])
    if (this.selectedItems.length > 0) {
      this.selectedFilterData = this.filteredPeople.filter((item: any) => this.selectedItems.some((arrItem: any) => arrItem.item_id === item.id));
      console.log(this.selectedFilterData)
    }
  }
  onDeselect(valu: any) {
    this.selectedFilterData = this.selectedFilterData.filter((data: any) => data.id !== valu.item_id)
    if (this.selectedItems.length > 0) {
      this.selectedFilterData = this.filteredPeople.filter((item: any) => this.selectedItems.some((arrItem: any) => arrItem.item_id === item.id));
      console.log(this.selectedFilterData)
    }
  }
  onSelectAll(items: any) {
    this.selectedFilterData = this.filteredPeople
  }
  onDeselectAll(items: any) {
    this.selectedFilterData = []
    this.selectedRowData = []
  }
  // ----------- Deleted ------------
  onItemSelectDeleted(item: any) {
    this.selectedRowData = []
    let selectItem = this.deletedData.filter((data: any) => data.id === item.item_id)
    this.selectedFilterDataDeleted.unshift(selectItem[0])
  }
  onDeselectDeleted(valu: any) {
    this.selectedFilterDataDeleted = this.selectedFilterDataDeleted.filter((data: any) => data.id !== valu.item_id)
  }
  onSelectAllDeleted(items: any) {
    this.selectedFilterDataDeleted = this.deletedData
  }
  onDeselectAllDeleted(items: any) {
    this.selectedFilterDataDeleted = []
  }

}













