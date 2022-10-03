import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashbroadComponent } from './view/dashbroad/dashbroad.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: DashbroadComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
