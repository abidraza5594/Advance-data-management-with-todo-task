import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../data.service';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { apiData } from '../Store/data.actions';

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
  tableSize: number = 7
  tableSizes: any = [5, 10, 15, 20]
  dropdownList: any = [];
  dropdownSettings: IDropdownSettings = {}
  dropdownListDeleted: any = [];
  selectedItemsDeleted: any = [];
  dropdownSettingsDeleted: IDropdownSettings = {};
  apiData$: Observable<any>
  agevalue:boolean=false
  contactvalue:boolean=true

  constructor(private http: HttpClient,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private datafromapi: DataService,
    private store: Store<{ apiData: any }>) {
    this.apiData$ = store.select("apiData")
    this.apiData$.subscribe((data: any) => {
      this.people = data.data
    })

  }

  showage: boolean = true;
  showcontact: boolean = true;
  checkboxChanged(checkboxId: string, event: any) {
    if (checkboxId === 'checkbox1') {
      this.showcontact = event.target.checked;
    } else if (checkboxId === 'checkbox2') {
      this.showage = event.target.checked;
    }
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

  onTableDataChange(event: any) {
    this.page = event
  }
  onTableSizeChange(event: any) {
    this.tableSize = event.target.value
    this.page = 1
  }

  selectAllDelete(value: string) {
    this.selectedRowData = []
    this.selectedFilterDataDeleted = []
    this.selectedItemsDeleted = []
    if (value === 'all') {
      this.isshowDeleteData = false
      this.isShowHome = true
      this.selectedFilterData = []
      this.selectedItems = []
      this.tableSize=7
      this.selectedRowData=[]
      this.selectedrownum=0
    } else {
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
    this.selectedFilterData = []
    this.selectedItems=[]
    this.selectedrownum = num
    this.tableSize = num
    this.onTableDataChange(1)
    this.onTableSizeChange(1)
    this.selectedRowNumber = num
    this.selectedRowData = this.filteredPeople.slice(0, num)
    
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

  async reStoreData(person: any) {
    let updatedD = { ...person, isdeleted: false }
    try {
      const resp = await this.http.put(`${this.apiUrl}/${person.id}`, updatedD).toPromise();
    }
    catch (error) {
      console.log(error);
    }
    this.updateData()
    this.toastr.success('Data Re-store..!', 'Successful..!');
    this.selectedFilterDataDeleted = this.selectedFilterDataDeleted.filter((item: any) => item.id !== person.id)
    this.selectedItemsDeleted = this.selectedItemsDeleted.filter((item: any) => item.item_id !== person.id)
  }

  editHandler(person: any) {
    this.datafromapi.sendData(person);
    this.editData.push(person)
    this.isEditShow = true
  }

  ngOnInit() {
    this.datafromapi.getDataFromAPI().subscribe((data: any) => {
      this.store.dispatch(apiData({ data: data }))
    })
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
    this.selectedRowData = []
    let selectItem = this.filteredPeople.filter((data: any) => data.id === item.item_id)
    this.selectedFilterData.unshift(selectItem[0])
  }
  onDeselect(valu: any) {
    this.selectedFilterData = this.selectedFilterData.filter((data: any) => data.id !== valu.item_id)
  }
  onSelectAll(items: any) {
    this.selectedFilterData = this.filteredPeople
  }
  onDeselectAll(items: any) {
    this.selectedFilterData = []
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













