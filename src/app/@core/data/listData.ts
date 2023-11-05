import { Observable } from 'rxjs';


export interface Item {
  id?: string;
  nombre?: string;
  direccion?: string;
  estado?: string;
}


export interface ListPager {
  pageSize?: number;
  pageIndex?: number
}


export interface CardAction {
  icon?: string;
  num?: string;
}

export interface Card {
  name?: string;
  id?: number;
  ame?: string;
  title?: string;
  imgSrc?: string;
  subTitle?: string;
  content?: string;
  agreeNum?: number;
  starsNum?: number;
  messageNum?: number;
  actions?: CardAction[];
}

export abstract class ListData {
  abstract getListData(pager: ListPager): Observable<Item[]>;
  abstract getOriginSource(pager: ListPager): Observable<Item[]>;
  abstract getTreeSource(pager: ListPager): Observable<Item[]>;
  abstract getCardSource(pager: ListPager): Observable<Card[]>;
}
