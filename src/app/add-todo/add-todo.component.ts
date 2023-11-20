import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../data.service';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-add-todo',
  templateUrl: './add-todo.component.html',
  styleUrls: ['./add-todo.component.css']
})
export class AddTodoComponent {
  @ViewChild('todoForm') todoForm!: NgForm;

  apiUrl = 'https://6544d3e45a0b4b04436d0bfc.mockapi.io/food';
  todo = {
    name: '',
    user: '',
    date: '',
    description: '',
    priority: ''
  };
  editTodo: any;
  URLid: any;
  formSubmitted = false;
  isShowSaving = false;
  getAllUsers: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private datafromapi: DataService,
    private http: HttpClient,
  ) {}

  ngOnInit() {
    this.datafromapi.data$.subscribe((data: any) => {
      this.editTodo = data;
      this.initializeFormWithEditTodo();
    });

    this.route.params.subscribe((params) => {
      this.URLid = +params['id'];
      console.log('ID from URL:', this.URLid);

      if (!this.editTodo) {
        this.initializeForm();
      }
    });

    this.datafromapi.getDataFromAPI().subscribe((data) => {
      this.getAllUsers = data.filter((item: any) => item.isdeleted === false);
    });
  }

  initializeForm() {
    this.todo.name = '';
    this.todo.user = '';
    this.todo.date = '';
    this.todo.description = '';
    this.todo.priority = '';
  }

  initializeFormWithEditTodo() {
    if (this.editTodo) {
      this.todo.name = this.editTodo.todoname || '';
      this.todo.user = this.editTodo.userslists || '';
      this.todo.date = this.editTodo.datetime || '';
      this.todo.description = this.editTodo.description || '';
      this.todo.priority = this.editTodo.priority || '';
    }
  }

  async updateTodo() {
    this.isShowSaving = true;
    let newData = {
      todoname: this.todo.name,
      userslists: this.todo.user,
      datetime: this.todo.date,
      description: this.todo.description,
      priority: this.todo.priority
    };

    const resp = await this.http.put(`${this.apiUrl}/${this.URLid}`, newData).toPromise();
    resp ? this.isShowSaving = false : this.isShowSaving = true;
    this.toastr.success('Todo updated!', 'Successful!');
  }

  async submitTodo() {
    this.isShowSaving = true;

    if (this.validateForm()) {
      if (!this.URLid) {
        await this.postTodo();
      }
      this.resetForm();
    } else {
      console.log('Form is invalid. Please check the fields.');
    }
  }

  private async postTodo() {
    let postData = {
      todoname: this.todo.name,
      userslists: this.todo.user,
      datetime: this.todo.date,
      description: this.todo.description,
      priority: this.todo.priority
    };

    try {
      const resp = await this.http.post(`${this.apiUrl}`, postData).toPromise();
      resp ? this.isShowSaving = false : this.isShowSaving = true;
      this.toastr.success('Data added!', 'Successful!');
    } catch (error) {
      console.error('Error posting data:', error);
      this.toastr.error('Failed to add data!', 'Error!');
    }

    async function fetchData() {
      try {
        const response = await fetch('https://6544d3e45a0b4b04436d0bfc.mockapi.io/food');
        const data = await response.json();
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData();
  }

  validateForm(): boolean {
    return (
      this.todo.name.trim() !== '' &&
      this.todo.description.trim() !== '' &&
      this.todo.date.trim() !== '' &&
      this.todo.user.trim() !== '' &&
      this.todo.priority.trim() !== ''
    );
  }

  resetForm() {
    this.todo = {
      name: '',
      user: '',
      date: '',
      description: '',
      priority: ''
    };
    this.formSubmitted = false;

    if (this.todoForm) {
      Object.keys(this.todoForm.controls).forEach(controlName => {
        this.todoForm.controls[controlName].markAsUntouched();
      });
    }
  }
}