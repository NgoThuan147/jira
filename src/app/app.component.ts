import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { getAccessToken } from './utils/jwt';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isCollapsed = false;
  isLogin = false;

  constructor(private route: Router,) {
    
  }

  ngOnInit() {
    this.handleCheckLogin();
  }

  handleCheckLogin() {
    const token = getAccessToken();

    if (token) {
      return this.isLogin = true;
    } else {
      this.route.navigate(['login'])
      return this.isLogin = false;
    }
  }
}
