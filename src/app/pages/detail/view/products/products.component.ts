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
import { io, Socket } from 'socket.io-client';
import { getAccessToken } from 'src/app/utils/jwt';

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
  listOfSelectedAssignees = [];
  statusEdit: string = '';
  indexEdit: number = 0;
  socket!: Socket;

  ngOnInit() {
    this.activatedRoute.params.subscribe((paramsId) => {
      this.paramId = paramsId.id;
    });
    this.getProduct();

    // install socket
    this.socket = io('http://localhost:3000', {
      query: { token: getAccessToken() },
      forceNew: true,
      transports: ['websocket'],
      upgrade: false,
      reconnectionAttempts: 10,
      reconnectionDelayMax: 10000,
      reconnectionDelay: 5000,
      closeOnBeforeunload: false,
    });

    this.socket.on(this.paramId, (msg) => {
      const data = JSON.parse(msg);
      this.todo = data.todo;
      this.inProgress = data.inProgress;
      this.done = data.done;
    });

    this.socket.on('disconnected', (msg) => {
      const data = JSON.parse(msg)
      this.noti.create('error', 'LỖI', data.message)
      this.socket.disconnect();
    })
  }

  handleEmitMessage(msg: any) {
    this.socket.emit(
      'message',
      JSON.stringify({
        jiraId: this.paramId,
        ...msg,
      })
    );
  }

  handleData(data: any) {
    this.todo = [];
    this.inProgress = [];
    this.done = [];
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
    this.handleSort();
  }

  handleSort() {
    this.todo.sort((a, b) => a.position - b.position);
    this.inProgress.sort((a, b) => a.position - b.position);
    this.done.sort((a, b) => a.position - b.position);
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
      console.log(event);
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
    this.handleChangePosition();
    this.handleEmitMessage({
      todo: this.todo,
      inProgress: this.inProgress,
      done: this.done,
    });
  }

  handleChangePosition() {
    this.todo.map((item, index) => {
      this.todo[index].position = index + 1;
      this.todo[index].status = 'Backlog';
    });
    this.inProgress.map((item, index) => {
      this.inProgress[index].position = index + 1;
      this.inProgress[index].status = 'In Progress';
    });
    this.done.map((item, index) => {
      this.done[index].position = index + 1;
      this.done[index].status = 'Done';
    });
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
  valueItem: any = {};

  handleCancelEdit(): void {
    this.isVisibleEdit = false;
  }

  handleClickEdit(item: any, status: string, index: number) {
    this.isVisibleEdit = true;
    this.valueItem = item;
    this.statusEdit = status;
    this.indexEdit = index;
  }

  handleChangeItemStatus(evt: any) {
    switch (this.statusEdit) {
      case 'todo':
        this.todo[this.indexEdit] = evt;
        break;
      case 'inProgress':
        this.inProgress[this.indexEdit] = evt;
        break;
      case 'done':
        this.done[this.indexEdit] = evt;
        break;
      default:
        break;
    }
    this.handleEmitMessage({
      todo: this.todo,
      inProgress: this.inProgress,
      done: this.done,
    });
  }

  handleChangeCreate(item: any) {
    this.todo.push({ ...item });
    this.handleEmitMessage({
      todo: this.todo,
      inProgress: this.inProgress,
      done: this.done,
    });
  }

  handleChangeRemove(id: number) {
    const remove = this.http.delete(`products/remove?id=${id}`);
    remove.subscribe((res) => {
      if (res.statusCode == 200) {
        this.handleCancelEdit();
        this.noti.create('success', 'Xóa thành công!', '');
        this.getProduct();
        setTimeout(() => {
          this.handleEmitMessage({
            todo: this.todo,
            inProgress: this.inProgress,
            done: this.done,
          });
        }, 1000);
      }
    });
  }
}
