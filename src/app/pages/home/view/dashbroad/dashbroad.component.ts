import { Component, OnInit } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import ProductApi from '../../api/productApi';
import httpService from 'src/app/utils/httpconfig';

@Component({
  selector: 'app-dashbroad',
  templateUrl: './dashbroad.component.html',
  styleUrls: ['./dashbroad.component.scss'],
})
export class DashbroadComponent implements OnInit {
  constructor(private http: httpService) {}

  isVisible = false;

  todo: any[] = [

  ];

  inProgress: any[] = [

  ];

  done: any[] = [
  ];

  ngOnInit() {
    const test = this.getProduct();
    test.subscribe((data) => this.handleData(data.data.products));
  }

  handleData(data: any[]) {
    console.log(data);
    data.map((item): any => {
      if (item.status === "Backlog") {
        return this.todo.push(item)
      }
      if (item.status === "In Progress") {
        return this.inProgress.push(item)
      }
      if (item.status === "Done") {
        return this.done.push(item)
      }
    })
  }

  get myTodo() {
    return this.todo
  }
  set myTodo(value) {
    console.log('value', value);
  }

  getProduct() {
    return this.http.get(`auths/profile`);
  }

  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  handleClick() {
    this.showModal();
  }

  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    console.log('Button ok clicked!');
    this.isVisible = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }
}
