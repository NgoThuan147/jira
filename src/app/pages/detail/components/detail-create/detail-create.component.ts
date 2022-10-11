import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import httpService from 'src/app/utils/httpconfig';

@Component({
  selector: 'app-detail-create',
  templateUrl: './detail-create.component.html',
  styleUrls: ['./detail-create.component.scss'],
})
export class DetailCreateComponent implements OnInit {
  @Input() paramId!: string;
  @Input() isVisible!: boolean;
  @Input() todo!: any;
  @Input() isOkLoading!: boolean;
  @Input() res!: any;
  @Output() handleCancelEmit = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private http: httpService,
    private noti: NzNotificationService
  ) {}
  
  validateForm!: any;
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
  listOfSelectedAssignees = [];

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      name: [null, [Validators.required]],
      subDescribe: [null, [Validators.required]],
      priority: [null, [Validators.required]],
      describe: [null],
      assignees: [null]
    });
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
          this.handleCancel();
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

  handleCancel() {
    this.handleCancelEmit.emit()
  }
}
