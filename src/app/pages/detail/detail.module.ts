import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DetailRoutingModule } from './detail-routing.module';
import { ProductsComponent } from './view/products/products.component';
import { MatNativeDateModule } from '@angular/material/core';
import { MaterialExampleModule } from 'src/material.module';
import { DemoNgZorroAntdModule } from 'src/app/ng-zorro-antd.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { DetailCreateComponent } from './components/detail-create/detail-create.component';
import { DetailEditComponent } from './components/detail-edit/detail-edit.component';



@NgModule({
  declarations: [
    ProductsComponent,
    DetailCreateComponent,
    DetailEditComponent
  ],
  imports: [
    CommonModule,
    DetailRoutingModule,
    MatNativeDateModule,
    MaterialExampleModule,
    DemoNgZorroAntdModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AngularEditorModule
  ]
})
export class DetailModule { }
