import { Component, OnInit } from '@angular/core';
import httpService from 'src/app/utils/httpconfig';
import { Validators, FormBuilder } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-tables-list',
  templateUrl: './tables-list.component.html',
  styleUrls: ['./tables-list.component.scss'],
})
export class TablesListComponent implements OnInit {
  constructor(
    private http: httpService,
    private fb: FormBuilder,
    private noti: NzNotificationService
  ) {}

  isModal = false;
  isOkLoading = false;
  listTable: any[] = [];
  validateForm!: any;

  ngOnInit(): void {
    this.getListTable();

    this.validateForm = this.fb.group({
      name: [null, [Validators.required]],
      selectSpace: [null, [Validators.required]],
      comments: [null, [Validators.required]],
    });
  }

  getListTable() {
    const list = this.http.get(`auths/profile`);
    return list.subscribe((data) =>
      this.listTable.push(...JSON.parse(data.data.list_table))
    );
  }

  showModal(): void {
    this.isModal = true;
  }

  handleOk(): void {
    console.log('Button ok clicked!');
    this.isModal = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isModal = false;
  }

  //form
  createTable(payload: any) {
    return this.http.post('tables/create', payload);
  }

  submitForm(): void {
    if (this.validateForm.valid) {
      this.isOkLoading = true;
      const create = this.createTable({ ...this.validateForm.value, select_space: this.validateForm.value.selectSpace });
      create.subscribe((res) => {
        if (res.data) {
          this.noti.create('success', 'Tạo bảng thành công!', '');
          this.isOkLoading = false;
          this.isModal = false;
          this.listTable.push({...res.data})
        }
      });
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

  getCaptcha(e: MouseEvent): void {
    e.preventDefault();
  }
}
