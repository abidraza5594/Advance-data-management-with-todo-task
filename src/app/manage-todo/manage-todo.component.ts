import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { TaskNameRendererComponent } from '../Components/task-name-renderer.component';
import { ActionsRendererComponent } from '../Components/actions-renderer.component';
import { format } from 'date-fns';


@Component({
  selector: 'app-manage-todo',
  templateUrl: './manage-todo.component.html',
  styleUrls: ['./manage-todo.component.css']
})
export class ManageTodoComponent implements OnInit {
  todos: any[] = []

  filterTodos: any[] = []
  apiUrl: any = "https://6544d3e45a0b4b04436d0bfc.mockapi.io/food"

  constructor(private dataService: DataService, 
    private http: HttpClient, 
    private toastr: ToastrService,) { }




  columnDefs: any = [
    { headerName: '#', valueGetter: 'node.rowIndex + 1',width: 100,sortable: true, },
    { headerName: 'User Name', field: 'userslists',type: 'leftAligned',sortable: true, },
    {
      headerName: 'Task Name', type: 'leftAligned',sortable: true,
      field: 'todoname',
      valueFormatter: (params: any) => params.value.length === 0 ? 'No task asign' : params.value,
      // cellClass: (params: any) => params.data.iscomplete ? ' green-text' : 'red-text',
      cellRendererFramework: TaskNameRendererComponent,
    },
    {
      headerName: 'Date time',
      sortable: true,
      field: 'datetime',
      width: 300,
      valueFormatter: (params: any) => {
        const formattedDate = format(new Date(params.value), 'dd/MM/yyyy HH:mm:ss');
        return formattedDate;
      }
    }
  ,    
    { headerName: 'Description', field: 'description' },
    { headerName: 'Priority',sortable: true, field: 'priority', valueFormatter: (params: any) => this.formatPriority(params.value) },
    
    // {
    //   headerName: 'Status',
    //   field: 'done',
    //   cellStyle: { color: (params: any) => params.value ? 'green' : 'red' },
    //   valueFormatter: (params: any) => params.value ? 'Done' : 'Pending',
    // }
    
    {
      headerName: 'Actions',sortable: true,
      width: 300,
      type: 'centerAligned',
      cellRenderer: ActionsRendererComponent,
    //   cellRendererParams: {
    //     edit: this.sendTodoEditData.bind(this),
    //     delete: this.deleteHandler.bind(this),
    //     toggleDone: this.toggleDone.bind(this),
    //   },
    },
  ];



  onGridReady(params: { api: any }) {
    params.api.sizeColumnsToFit();
  }

  formatPriority(priority: string): string {
    switch (priority) {
      case '1':
        return 'Very high';
      case '2':
        return 'High';
      case '3':
        return 'Medium';
      case '4':
        return 'Low';
      default:
        return '';
    }
  }






  isMarkDone: boolean = false
  async markDoneTodo(todo: any) {
    console.log(todo.done)
    this.isMarkDone = true
    let newData = { ...todo, done: true }
    const resp = await this.http.put(`${this.apiUrl}/${todo.id}`, newData).toPromise();
    console.log(resp)
    resp ? this.isMarkDone = false : this.isMarkDone = true
    this.toastr.success('Todo updated!', 'Successful!');
  }
  toggleDone(todo: any) {
    console.log(todo)
    todo.done = true

    this.markDoneTodo(todo)
  }

  showToday() {
    console.log(this.filterTodos)
    const today = new Date();
    const todayTodos = this.filterTodos.filter(todo => new Date(todo.datetime).getDate() === today.getDate());
    this.displayFilteredTodos(todayTodos);
  }

  showUpcoming() {
    const today = new Date();
    const upcomingTodos = this.filterTodos.filter(todo => new Date(todo.datetime) > today);
    this.displayFilteredTodos(upcomingTodos);
  }

  isShowDone: boolean = false
  showDone() {
    if (this.isShowDone) {
      this.isShowDone = false
      const doneTodos = this.filterTodos.filter(todo => todo.done);
      this.displayFilteredTodos(doneTodos);
    } else {
      const doneTodos = this.filterTodos.filter(todo => !todo.done);
      this.displayFilteredTodos(doneTodos);
      this.isShowDone = true
    }
  }

  selectedPriority: string = '';
  showPriority() {
    console.log(this.selectedPriority)
    if (this.selectedPriority!=='') {
      const priority = this.filterTodos.filter(todo => todo.priority === this.selectedPriority);
      this.displayFilteredTodos(priority);
    }else{
      this.todos=this.filterTodos
    }
  }

  showDateTime() {
    const sortedDateTimeTodos = this.filterTodos.slice().sort((a, b) => {
      return new Date(a.datetime).getTime() - new Date(b.datetime).getTime();
    });
    this.displayFilteredTodos(sortedDateTimeTodos);
  }

  displayFilteredTodos(filteredTodos: any[]) {
    this.todos = filteredTodos;
  }

  updateData() {
    this.dataService.getDataFromAPI().subscribe((response: any) => {
      this.todos = response.filter((item: any) => item.isdeleted === false);
    });
  }

  async deleteHandler(person: any) {
    person.isDeleting = true;
    try {
      const resp = await this.http.put(`${this.apiUrl}/${person.id}`, { ...person, isdeleted: true }).toPromise();
      person.isDeleting = false;
      this.updateData();
      alert('Data deleted Successful..!');
    } catch (error) {
      console.log(error);
      person.isDeleting = false;
      this.toastr.error('Failed to delete data', 'Error');
    }
  }



  // sendTodoEditData(data: any) {
  //   this.dataService.sendTodoEditData(data)
  // }


  ngOnInit() {

    this.dataService.getData().subscribe((data)=>{
      console.log(data)
      this.todos=data
    })



    this.dataService.getDataFromAPI().subscribe(
      (data: any[]) => {
        this.todos = data.filter((item: any) => item.isdeleted === false);
        this.filterTodos = this.todos
      },
      (error) => {
        console.error('Error fetching data from API:', error);
      }
    );
  }
}
