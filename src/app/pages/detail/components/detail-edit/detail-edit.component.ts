import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import httpService from 'src/app/utils/httpconfig';

@Component({
  selector: 'app-detail-edit',
  templateUrl: './detail-edit.component.html',
  styleUrls: ['./detail-edit.component.scss'],
})
export class DetailEditComponent implements OnInit {
  @Input() isVisibleEdit!: boolean;
  @Input() valueItem: any = {
    name: '',
    subDescribe: '',
    priority: '',
    describe: '',
    assignees: [],
  };
  @Output() handleChangeItemStatusEmit = new EventEmitter();
  @Output() handleCancelEmit = new EventEmitter();
  @Output() handleChangeRemoveEmit = new EventEmitter();
  constructor(
    private fb: FormBuilder,
    private modal: NzModalService,
    private http: httpService,
    private noti: NzNotificationService
  ) {}

  validateForm!: any;
  listOfSelectedAssignees: any = []
  isEditDescribe: boolean = false;
  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
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
  contentDescribe = "";

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      name: [this.valueItem.name, [Validators.required]],
      subDescribe: [this.valueItem.subDescribe, [Validators.required]],
      priority: [this.valueItem.priority, [Validators.required]],
      describe: [this.valueItem.describe],
      assignees: [this.valueItem.assignees],
      status: [this.valueItem.status],
    });
    this.contentDescribe = this.valueItem.describe;
  }

  handleCancel() {
    this.handleCancelEmit.emit();
    this.valueItem = {
      ...this.valueItem,
      ...this.validateForm.value
    }
    this.handleChangeItemStatusEmit.emit({ ...this.valueItem, describe: this.contentDescribe })
  }

  submitForm(): void {}

  handleClickSaveContent() {
    this.isEditDescribe = false;
    this.contentDescribe = this.validateForm.value.describe;
  }

  showDeleteConfirm(): void {
    this.modal.confirm({
      nzTitle: `Bạn có chắc chắn là muốn xóa <span style="color: red;">${this.valueItem.id}</span>?`,
      nzContent: '',
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => this.handleChangeRemoveEmit.emit(this.valueItem.id),
      nzCancelText: 'No',
      nzOnCancel: () => console.log('Cancel')
    });
  }
}
