import { Component, OnInit } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { DataService } from '../data.service';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { PushNotificationService } from '../push-notification.service';

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

  constructor(private dataService: DataService, private http: HttpClient,
     private toastr: ToastrService,
     private pushNotificationService: PushNotificationService) { }

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
    today.setHours(0, 0, 0, 0); 
    // Filter todos that are after today
    const upcomingTodos = this.filterTodos.filter(todo => {
      const todoDate = new Date(todo.datetime);
      todoDate.setHours(0, 0, 0, 0); 
      return todoDate > today;
    });
    this.displayFilteredTodos(upcomingTodos);
  }
  
  showOverdue() {
    const today = new Date();
    const overdueTodos = this.filterTodos.filter(todo => 
        new Date(todo.datetime) < today && !todo.done && !todo.isdeleted && todo.todoname.length > 0
    );
    console.log(overdueTodos)
    this.displayFilteredTodos(overdueTodos);
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


  scheduleNotification() {
    const notificationData = {
      message: 'Your notification message',
      // other data as needed
    };

    this.pushNotificationService.scheduleNotification(notificationData);
  }

  ngOnInit() {
    this.pushNotificationService.requestNotificationPermission();
    this.scheduleNotification()

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
          if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
            return 0;
          }
          return   dateB.getTime() - dateA.getTime()
        });
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
          if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
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

  

    
  sortPriority(username: any) {
    if (this.sorting) {
      this.sorting = false;
      let userTasks = this.todosForSelectedDate.filter(task => task.userslists === username);
      if (userTasks.length > 0) {
        let sortedTasks = userTasks.sort((a, b) => {
          const priorityA = a.priority;
          const priorityB = b.priority;
  
          return priorityB - priorityA;
        });
        let filterD = this.todosForSelectedDate.map(task => (task.userslists === username ? sortedTasks.shift() : task));
        this.displayFilteredTodos(filterD);
        console.log(filterD);
      }
    } else {
      this.sorting = true;
      let userTasks = this.todosForSelectedDate.filter(task => task.userslists === username);
      if (userTasks.length > 0) {
        let sortedTasks = userTasks.sort((a, b) => {
          const priorityA = a.priority;
          const priorityB = b.priority;
  
          return priorityA - priorityB;
        });
        let filterD = this.todosForSelectedDate.map(task => (task.userslists === username ? sortedTasks.shift() : task));
        this.displayFilteredTodos(filterD);
        console.log(filterD);
      }
    }
  }
  



  getPriorityClass(priority: string): string {
    switch (priority) {
      case '1':
        return 'text-danger'; // for very high priority
      case '2':
        return 'text-warning'; // for high priority
      case '3':
        return 'text-info'; // for medium priority
      case '4':
        return 'text-success'; // for low priority
      default:
        return ''; 
    }
  }

  getPriorityLabel(priority: string): string {
    switch (priority) {
      case '1':
        return 'Very High';
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



}
