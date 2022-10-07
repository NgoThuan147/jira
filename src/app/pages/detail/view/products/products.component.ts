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
  isVisible = false;
  todo: any[] = [];
  inProgress: any[] = [];
  done: any[] = [];
  validateForm!: any;
  listOfSelectedAssignees = []

  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [['bold']],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText',
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
  };

  ngOnInit() {
    this.activatedRoute.params.subscribe((paramsId) => {
      this.paramId = paramsId.id;
    });
    this.getProduct();

    this.validateForm = this.fb.group({
      name: [null, [Validators.required]],
      subDescribe: [null, [Validators.required]],
      priority: [null, [Validators.required]],
      describe: [null]
    });
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

  get myTodo() {
    return this.todo;
  }
  set myTodo(value) {
    console.log('value', value);
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
    this.isVisible = true;
  }

  handleOk(): void {
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  submitForm(): void {
    if (this.validateForm.valid) {
      const create = this.http.post('products/create', { 
        ...this.validateForm.value, 
        assignees: this.listOfSelectedAssignees, 
        status: 'Backlog', table_id: this.paramId 
      })
      create.subscribe((res) => {
        if (res.data) {
          this.isVisible = false;
          this.noti.create('success', 'Tạo bảng thành công!', '');
          this.todo.push({ ...res.data })
        }
      })

    } else {
      Object.values(this.validateForm.controls).forEach((control: any) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  updateConfirmValidator(): void {
    /** wait for refresh value */
    Promise.resolve().then(() =>
      this.validateForm.controls.checkPassword.updateValueAndValidity()
    );
  }

  confirmationValidator = (control: any): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.validateForm.controls.password.value) {
      return { confirm: true, error: true };
    }
    return {};
  };
}
