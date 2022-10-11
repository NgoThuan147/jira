import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import httpService from 'src/app/utils/httpconfig';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  constructor(
    private http: httpService,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private noti: NzNotificationService
  ) {}

  isOkLoading = false;
  paramId: string = '';
  res: any = {};
  isVisibleCreate = false;
  todo: any[] = [];
  inProgress: any[] = [];
  done: any[] = [];
  listOfSelectedAssignees = []

  ngOnInit() {
    this.activatedRoute.params.subscribe((paramsId) => {
      this.paramId = paramsId.id;
    });
    this.getProduct();
  }

  handleData(data: any) {
    data.map((item: any): any => {
      if (item.status === 'Backlog') {
        return this.todo.push(item);
      }
      if (item.status === 'In Progress') {
        return this.inProgress.push(item);
      }
      if (item.status === 'Done') {
        return this.done.push(item);
      }
    });
  }

  getProduct() {
    const listProduct = this.http.get(`tables/${this.paramId}`);
    listProduct.subscribe((res) => {
      this.res = res.data;
      this.handleData(res.data.products);
    });
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
    this.isVisibleCreate = true;
  }

  handleCancel(): void {
    this.isVisibleCreate = false;
  }


  // Edit
  isVisibleEdit: boolean = false;
  valueItem: any = {}
  
  handleCancelEdit(): void {
    this.isVisibleEdit = false;
  }

  handleClickEdit(item: any) {
    this.isVisibleEdit = true;
    this.valueItem = item;
    console.log(this.valueItem)
  }
}
