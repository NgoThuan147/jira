import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TablesRoutingModule } from './tables-routing.module';
import { TablesListComponent } from './view/tables-list/tables-list.component';
import { DemoNgZorroAntdModule } from 'src/app/ng-zorro-antd.module';
import { TableItemComponent } from './components/table-item/table-item.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    TablesListComponent,
    TableItemComponent
  ],
  imports: [
    CommonModule,
    TablesRoutingModule,
    DemoNgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class TablesModule { }
