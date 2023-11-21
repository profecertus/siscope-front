import { Component, OnInit, ViewChild } from '@angular/core';

import { CheckableRelation, DataTableComponent, TableWidthConfig } from 'ng-devui/data-table';
import { Subscription } from 'rxjs';
import { Item } from 'src/app/@core/data/listData';
import { ListDataService } from 'src/app/@core/mock/list-data.service';

@Component({
  selector: 'app-gastos-embarcacion',
  templateUrl: './gastos-embarcacion.component.html',
  styleUrls: ['./gastos-embarcacion.component.scss']
})
export class GastosEmbarcacionComponent implements OnInit{
  ngOnInit(): void {
  }

}
