import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../data.service';

@Component({
  selector: 'app-add-data',
  templateUrl: './add-data.component.html',
  styleUrls: ['./add-data.component.css']
})
export class AddDataComponent {
  name: string = '';
  age: any = '';
  contact: string = '';
  nameValidation: boolean = false;
  ageValidation: boolean = false;
  contactValidation: boolean = false;
  isEditShow: boolean = false;
  editData: any = [];
  URLid: number = 0;
  uniqueId: string = '';
  apiUrl = 'https://6544d3e45a0b4b04436d0bfc.mockapi.io/food';
  data:any

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private datafromapi: DataService
  ) {
    this.uniqueId = uuidv4();
    this.initializeForm();
  }

  async updateData(taskId: number, newData: any) {
    const resp = await this.http.put(`${this.apiUrl}/${taskId}`, newData).toPromise();
    resp ? this.isShowSubmitting=false : this.isShowSubmitting=true
    this.toastr.success('Data updated..!', 'Successful..!');
  }

  saveEdit(editData: any) {
    
    let age = parseInt(editData.age);
    if (age < 1 || age > 100) {
      alert('Age must be between 1 and 100.');
      return;
    }

    if (!editData.name) {
      this.nameValidation = true;
      return
    }

    if (parseInt(editData.age) === null || parseInt(editData.age) < 1 || parseInt(editData.age) > 100) {
      this.ageValidation = true;
      return
    }

    if (editData.contact.length !== 10 || !/^\d+$/.test(editData.contact)) {
      this.contactValidation = true;
      return
    }

    if (this.nameValidation || this.ageValidation || this.contactValidation) {
      console.log('Form validation failed. Please check the fields.');
      return;
    }else{
      this.isShowSubmitting=true
    }

    this.updateData(this.URLid, editData);
    fetch(this.apiUrl);
  }

  isShowSubmitting=false
  async postData(newData: any) {
    try {
      const resp = await this.http.post(`${this.apiUrl}`, newData).toPromise();
      resp? this.isShowSubmitting=false : this.isShowSubmitting=true
      this.toastr.success('Data added..!', 'Successful..!');
    } catch (error) {
      console.error('Error posting data:', error);
      this.toastr.error('Failed to add data!', 'Error..!');
    }
  }

  async submitData(data: any) {
    let submitD = { ...data, id: this.uniqueId };

    try {
      await this.postData(submitD);
      async function fetchData() {
        try {
          const response = await fetch('https://6544d3e45a0b4b04436d0bfc.mockapi.io/food');
          const data = await response.json();
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
      fetchData();
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  }

  initializeForm() {
    this.nameValidation = false;
    this.ageValidation = false;
    this.contactValidation = false;

    if (this.URLid) {
      this.editData = { ...this.editData };
      this.name = this.editData.name || '';
      this.age = this.editData.age || 0;
      this.contact = this.editData.contact || '';
    } else {
      this.name = '';
      this.age = '';
      this.contact = '';
    }
  }

  onSubmit() {
    
    this.nameValidation = false;
    this.ageValidation = false;
    this.contactValidation = false;

    if (!this.name) {
      this.nameValidation = true;
    }

    if (this.age === null || this.age < 1 || this.age > 100) {
      this.ageValidation = true;
    }

    if (this.contact.length !== 10 || !/^\d+$/.test(this.contact)) {
      this.contactValidation = true;
    }

    if (this.nameValidation || this.ageValidation || this.contactValidation) {
      console.log('Form validation failed. Please check the fields.');
      return;
    }else{
      this.isShowSubmitting=true
    }
    const formData = { name: this.name, age: this.age, contact: this.contact };
    if (!this.URLid) {
      this.submitData(formData);
    } else {
      this.saveEdit(formData);
    }
  }

  ngOnInit(): void {
    this.datafromapi.data$.subscribe((data:any) => {
      this.editData = data;
    });

    this.route.params.subscribe((params) => {
      this.URLid = +params['id'];
      console.log('ID from URL:', this.URLid);
    });
    this.initializeForm()
  }
}
