import { Component, OnInit } from '@angular/core';
import httpService from 'src/app/utils/httpconfig';

@Component({
  selector: 'app-tables-list',
  templateUrl: './tables-list.component.html',
  styleUrls: ['./tables-list.component.scss']
})
export class TablesListComponent implements OnInit {

  constructor(private http: httpService) {}

  listTable: any[] = []

  ngOnInit(): void {
    const list = this.getListTable()
    list.subscribe((data) => this.listTable.push(...data.data.list_table))
    console.log(this.listTable)
  }

  getListTable() {
    return this.http.get(`auths/profile`);
  }

}
