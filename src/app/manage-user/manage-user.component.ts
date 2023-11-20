import { Component, OnInit } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { DataService } from '../data.service';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.css']
})
export class ManageUserComponent implements OnInit {
  todos: any[] = [];
  filterTodos: any[] = [];
  todaysTodos: any[] = []

  selectedDate: Date | null = new Date();
  todosForSelectedDate: any[] = [];

  constructor(private dataService: DataService, private http: HttpClient, private toastr: ToastrService,) { }

  getUniqueUsernames() {
    return Array.from(new Set(this.todos.map(task => task.userslists)));
  }

  getTasksForUsername(username: string) {
    return this.todos.filter(task => task.userslists === username);
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



  ngOnInit() {
    // Filter todos for the initial selected date (today)
    this.dataService.getDataFromAPI().subscribe(
      (data: any[]) => {
        this.todos = data.filter((item: any) => !item.isdeleted && item.todoname.length > 0);
        this.filterTodos = this.todos;
        this.filterTodosForSelectedDate();
      },
      (error) => {
        console.error('Error fetching data from API:', error);
      }
    );
  }

  onDateChange(event: MatDatepickerInputEvent<Date>) {
    this.selectedDate = event.value;

    if (this.selectedDate) {
      this.filterTodosForSelectedDate();
      // Show a message if no todos are available for the selected date
      if (this.todosForSelectedDate.length === 0) {
        alert('No todos available on this date. Showing all todos.');
        const today = new Date();
        const todayTodos = this.filterTodos.filter(todo => new Date(todo.datetime).getDate() === today.getDate());
        this.displayFilteredTodos(todayTodos);
      }
    } else {
      // If no date is selected, show all todos
      this.todosForSelectedDate = [];
      this.displayFilteredTodos(this.filterTodos);
    }
  }

  filterTodosForSelectedDate() {
    this.todosForSelectedDate = this.filterTodos.filter(todo => {
      const todoDueDate = new Date(todo.datetime);
      return (
        todoDueDate.getDate() === (this.selectedDate as Date).getDate() &&
        todoDueDate.getMonth() === (this.selectedDate as Date).getMonth() &&
        todoDueDate.getFullYear() === (this.selectedDate as Date).getFullYear()
      );
    });

    this.displayFilteredTodos(this.todosForSelectedDate);

  }

  displayFilteredTodos(filteredTodos: any[]) {
    this.todos = filteredTodos;
  }


  sorting: boolean = false
  sortingOrders: { [key: string]: boolean } = {};
  sortByDateTime(username: string) {
    this.sortingOrders[username] = !this.sortingOrders[username];

    if (this.sorting) {
      this.sorting=false
      let userTasks = this.todosForSelectedDate.filter(task => task.userslists === username);
      if (userTasks.length > 0) {
        let sortedTasks = userTasks.sort((a, b) => {
          const dateA: Date = new Date(a.datetime);
          const dateB: Date = new Date(b.datetime);
          // Check if dateA and dateB are valid Date objects
          if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
            // Handle invalid dates if needed
            return 0;
          }
          return   dateB.getTime() - dateA.getTime()
        });
        // Replace the original tasks array with sorted tasks for the specified username
        let filterD = this.todosForSelectedDate.map(task => (task.userslists === username ? sortedTasks.shift() : task));
        this.displayFilteredTodos(filterD)
        console.log(filterD)
      }

    } else {
      this.sorting=true
      let userTasks = this.todosForSelectedDate.filter(task => task.userslists === username);
      if (userTasks.length > 0) {
        let sortedTasks = userTasks.sort((a, b) => {
          const dateA: Date = new Date(a.datetime);
          const dateB: Date = new Date(b.datetime);
          // Check if dateA and dateB are valid Date objects
          if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
            // Handle invalid dates if needed
            return 0;
          }
          return dateA.getTime() -  dateB.getTime() 
        });
        // Replace the original tasks array with sorted tasks for the specified username
        let filterD = this.todosForSelectedDate.map(task => (task.userslists === username ? sortedTasks.shift() : task));
        this.displayFilteredTodos(filterD)
        console.log(filterD)
      }
    }

  }






}
