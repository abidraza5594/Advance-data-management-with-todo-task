import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-manage-todo',
  templateUrl: './manage-todo.component.html',
  styleUrls: ['./manage-todo.component.css']
})
export class ManageTodoComponent implements OnInit {
  todos: any[] = []

  filterTodos: any[] = []
  apiUrl: any = "https://6544d3e45a0b4b04436d0bfc.mockapi.io/food"

  constructor(private dataService: DataService, private http: HttpClient, private toastr: ToastrService,) { }

  isMarkDone: boolean = false
  async markDoneTodo(todo: any) {
    console.log(todo.done)
    this.isMarkDone = true
    let newData = { ...todo, done:  true }
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
      this.isShowDone=false
      const doneTodos = this.filterTodos.filter(todo => todo.done);
      this.displayFilteredTodos(doneTodos);
    } else {
      const doneTodos = this.filterTodos.filter(todo => !todo.done);
      this.displayFilteredTodos(doneTodos);
      this.isShowDone=true
    }
  }

  selectedPriority: string = '';
  showPriority() {
    if (this.selectedPriority) {
      const priority = this.filterTodos.filter(todo => todo.priority === this.selectedPriority);
      this.displayFilteredTodos(priority);
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
  


  sendTodoEditData(data: any) {
    this.dataService.sendTodoEditData(data)
  }


  ngOnInit() {
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
