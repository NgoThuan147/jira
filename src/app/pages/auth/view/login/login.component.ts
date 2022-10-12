import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import httpService from 'src/app/utils/httpconfig';
import { getAccessToken, saveToken } from 'src/app/utils/jwt';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private http: httpService,
    private noti: NzNotificationService,
    private route: Router,
  ) {}

  validateForm: any;

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });
    this.handleCheckLogin();
  }

  handleCheckLogin() {
    const token = getAccessToken();

    if (token) {
      this.route.navigate(['list-table'])
    }
  }

  submitForm(): void {
    if (this.validateForm.valid) {
      const login = this.http.post('auths/login', {
        ...this.validateForm.value,
      });
      login.subscribe((res) => {
        if (res.statusCode == 200) {
          this.noti.create('success', 'Thành công!', '');
          saveToken(res.data.access_token);
          this.route.navigate(['list-table']);
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
}
