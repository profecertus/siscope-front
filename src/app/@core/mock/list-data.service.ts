import { Injectable } from '@angular/core';
import { Observable, of as observableOf } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Item, ListData, Card, ListPager } from '../data/listData';

@Injectable()
export class ListDataService extends ListData {
  private basicData: Item[] = [
    {
      id: 'G001',
      nombre: 'Fesa',
      direccion: 'Los Nogales 234',
      estado: 'Activo',
    },
  ];

  private cardSource: Card[] = [
    {
      name: 'Angular9',
      title: 'Angular9',
      content: 'DevUI 是面向企业中后台产品的开源前端解决方案，其设计价值观基于"至简"、"沉浸"、"灵活"三种自然与人文相结合的理念...',
      actions: [
        {
          icon: 'icon-star-o',
          num: '200',
        },
        {
          icon: 'icon-fork',
          num: '300',
        },
      ],
    },
    {
      name: 'NG-evUI',
      title: 'NG-DevUI',
      content:
        'DevUI 是面向企业中后台产品的开源前端解决方案，其设计价值观基于"至简"、"沉浸"、"灵活"三种自然与人文相结合的理念，旨在为设计...',
      actions: [
        {
          icon: 'icon-star-o',
          num: '2000',
        },
        {
          icon: 'icon-fork',
          num: '2000',
        },
      ],
    },
    {
      name: 'BootStrap',
      title: 'BootStrap',
      content: 'DevUI 是面向企业中后台产品的开源前端解决方案，其设计价值观基于"至简"、"沉浸"、"灵活"三种自然与人文相...',
      actions: [
        {
          icon: 'icon-star-o',
          num: '3000',
        },
        {
          icon: 'icon-fork',
          num: '3000',
        },
      ],
    },
    {
      name: 'React',
      title: 'React',
      imgSrc: 'https://codingthesmartway.com/wp-content/uploads/2019/12/logo_react.png',
      content: 'DevUI 是面向企业中后台产品的开源前端解决方案，其设计价值观基于"至简"、"沉浸"、"灵活"...',
      actions: [
        {
          icon: 'icon-star-o',
          num: '4000',
        },
        {
          icon: 'icon-fork',
          num: '4000',
        },
      ],
    },
    {
      name: 'Vue',
      title: 'Vue',
      imgSrc: 'https://vuejs.org/images/logo.png',
      content:
        'DevUI 是面向企业中后台产品的开源前端解决方案，其设计价值观基于"至简"、"沉浸"、"灵活"三种自然与人文相结合的理念，旨在为设计blablabla....',
      actions: [
        {
          icon: 'icon-star-o',
          num: '5000',
        },
        {
          icon: 'icon-fork',
          num: '5000',
        },
      ],
    },
    {
      name: 'Webpack',
      title: 'Webpack',
      imgSrc: 'https://webpack.js.org/icon-square-small.85ba630cf0c5f29ae3e3.svg',
      content:
        'DevUI 是面向企业中后台产品的开源前端解决方案，其设计价值观基于"至简"、"沉浸"、"灵活"三种自然与人文相结合的理念，旨在为设计lalalalala....',
      actions: [
        {
          icon: 'icon-star-o',
          num: '6000',
        },
        {
          icon: 'icon-fork',
          num: '6000',
        },
      ],
    },
    {
      name: 'DevUI13',
      title: 'DevUI13',
      content:
        'DevUI是面向企业中后台产品的开源前端解决方案，其设计价值观基于"至简"、"沉浸"、"灵活"三种自然与人文相结合的理念，旨在为设计...',
      actions: [
        {
          icon: 'icon-star-o',
          num: '7000',
        },
        {
          icon: 'icon-fork',
          num: '7000',
        },
      ],
    },
    {
      name: 'BootStrap22',
      title: 'BootStrap22',
      content:
        'DevUI 是面向企业中后台产品的开源前端解决方案，其设计价值观基于"至简"、"沉浸"、"灵活"三种自然与人文相结合的理念，旨在为设计....',
      actions: [
        {
          icon: 'icon-star-o',
          num: '8000',
        },
        {
          icon: 'icon-fork',
          num: '8000',
        },
      ],
    },
    {
      name: 'React11',
      title: 'React11',
      imgSrc: 'https://codingthesmartway.com/wp-content/uploads/2019/12/logo_react.png',
      content:
        'DevUI 是面向企业中后台产品的开源前端解决方案，其设计价值观基于"至简"、"沉浸"、"灵活"三种自然与人文相结合的理念，旨在为设计....',
      actions: [
        {
          icon: 'icon-star-o',
          num: '9000',
        },
        {
          icon: 'icon-fork',
          num: '9000',
        },
      ],
    },
    {
      name: 'Vue11',
      title: 'Vue22',
      imgSrc: 'https://vuejs.org/images/logo.png',
      content:
        'DevUI 是面向企业中后台产品的开源前端解决方案，其设计价值观基于"至简"、"沉浸"、"灵活"三种自然与人文相结合的理念，旨在为设计....',
      actions: [
        {
          icon: 'icon-star-o',
          num: '1234',
        },
        {
          icon: 'icon-fork',
          num: '1234',
        },
      ],
    },
    {
      name: 'Webpack33',
      title: 'Webpack33',
      imgSrc: 'https://webpack.js.org/icon-square-small.85ba630cf0c5f29ae3e3.svg',
      content:
        'DevUI 是面向企业中后台产品的开源前端解决方案，其设计价值观基于"至简"、"沉浸"、"灵活"三种自然与人文相结合的理念，旨在为设计....',
      actions: [
        {
          icon: 'icon-star-o',
          num: '2345',
        },
        {
          icon: 'icon-fork',
          num: '2345',
        },
      ],
    },
    {
      name: 'DevUI12',
      title: 'DevUI12',
      content:
        'DevUI是面向企业中后台产品的开源前端解决方案，其设计价值观基于"至简"、"沉浸"、"灵活"三种自然与人文相结合的理念，旨在为设计...',
      actions: [
        {
          icon: 'icon-star-o',
          num: '3456',
        },
        {
          icon: 'icon-fork',
          num: '3456',
        },
      ],
    },
    {
      name: 'BootStrap44',
      title: 'BootStrap44',
      content:
        'DevUI 是面向企业中后台产品的开源前端解决方案，其设计价值观基于"至简"、"沉浸"、"灵活"三种自然与人文相结合的理念，旨在为设计....',
      actions: [
        {
          icon: 'icon-star-o',
          num: '4567',
        },
        {
          icon: 'icon-fork',
          num: '4567',
        },
      ],
    },
    {
      name: 'React55',
      title: 'React55',
      imgSrc: 'https://codingthesmartway.com/wp-content/uploads/2019/12/logo_react.png',
      content:
        'DevUI 是面向企业中后台产品的开源前端解决方案，其设计价值观基于"至简"、"沉浸"、"灵活"三种自然与人文相结合的理念，旨在为设计....',
      actions: [
        {
          icon: 'icon-star-o',
          num: '5678',
        },
        {
          icon: 'icon-fork',
          num: '5678',
        },
      ],
    },
    {
      name: 'Vue123',
      title: 'Vue123',
      imgSrc: 'https://vuejs.org/images/logo.png',
      content:
        'DevUI 是面向企业中后台产品的开源前端解决方案，其设计价值观基于"至简"、"沉浸"、"灵活"三种自然与人文相结合的理念，旨在为设计....',
      actions: [
        {
          icon: 'icon-star-o',
          num: '7890',
        },
        {
          icon: 'icon-fork',
          num: '7890',
        },
      ],
    },
    {
      name: 'DevUI Admin',
      title: 'DevUI Admin',
      imgSrc: 'https://webpack.js.org/icon-square-small.85ba630cf0c5f29ae3e3.svg',
      content:
        'DevUI 是面向企业中后台产品的开源前端解决方案，其设计价值观基于"至简"、"沉浸"、"灵活"三种自然与人文相结合的理念，旨在为设计....',
      actions: [
        {
          icon: 'icon-star-o',
          num: '10000',
        },
        {
          icon: 'icon-fork',
          num: '10000',
        },
      ],
    },
  ];

  private pagerList(data: Item[] | Card[], pager: ListPager) {
    return data.slice(pager.pageSize! * (pager.pageIndex! - 1), pager.pageSize! * pager.pageIndex!);
  }

  getListData(pager: ListPager): Observable<any> {
    return observableOf({
      pageList: this.pagerList(this.basicData, pager),
      total: this.basicData.length,
    }).pipe(delay(1000));
  }

  getOriginSource(pager: ListPager): Observable<any> {
    return observableOf({
      pageList: this.pagerList(this.basicData, pager),
      total: this.basicData.length,
    }).pipe(delay(1000));
  }

  getTreeSource(pager: ListPager): Observable<any> {
    return observableOf({
      pageList: this.pagerList(this.basicData, pager),
      total: this.basicData.length,
    }).pipe(delay(1000));
  }

  getCardSource(pager: ListPager): Observable<any> {
    return observableOf({
      pageList: this.pagerList(this.cardSource, pager),
      total: this.cardSource.length,
    }).pipe(delay(1000));
  }
}
