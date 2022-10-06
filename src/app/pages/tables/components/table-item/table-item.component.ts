import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-table-item',
  templateUrl: './table-item.component.html',
  styleUrls: ['./table-item.component.scss']
})
export class TableItemComponent implements OnInit {
  @Input() title!: string;

  constructor() { }

  ngOnInit(): void {
  }

}
