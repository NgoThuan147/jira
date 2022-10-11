import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';

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
  @Output() handleCancelEmit = new EventEmitter();
  constructor(
    private fb: FormBuilder,
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
    console.log(this.validateForm.value)
  }

  submitForm(): void {}

  handleClickSaveContent() {
    this.isEditDescribe = false;
    this.contentDescribe = this.validateForm.value.describe;
  }
}
