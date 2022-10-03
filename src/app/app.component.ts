import { Component, OnInit } from '@angular/core';
import { getAccessToken } from './utils/jwt';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isCollapsed = false;
  isLogin = false;

  ngOnInit() {
    this.handleCheckLogin();
  }

  handleCheckLogin() {
    const token = getAccessToken();

    if (token) {
      return this.isLogin = true;
    } else {
      return this.isLogin = false;
    }
  }
}
