import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { DashbroadComponent } from './view/dashbroad/dashbroad.component';
import { MatNativeDateModule } from '@angular/material/core';
import { MaterialExampleModule } from 'src/material.module';
import { DemoNgZorroAntdModule } from 'src/app/ng-zorro-antd.module';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    DashbroadComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    MatNativeDateModule,
    MaterialExampleModule,
    DemoNgZorroAntdModule,
    HttpClientModule,
  ]
})
export class HomeModule { }
