import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { getCookie } from './utils/helpers';
import { destroyLogged, getAccessToken } from './utils/jwt';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isCollapsed = false;
  isLogin = false;
  auth: any;
  environment: any;

  constructor(private route: Router,) {
    
  }

  ngOnInit() {
    this.environment = environment
    this.handleCheckLogin();
    const authCookie = getCookie('AUTH_JIRA')
    if (authCookie) {
      this.auth = JSON.parse(authCookie)
    }
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

  logout() {
    this.isLogin = false;
    destroyLogged();
    this.route.navigate(['login']);
  }
}
