import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TablesListComponent } from './view/tables-list/tables-list.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: TablesListComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TablesRoutingModule { }
