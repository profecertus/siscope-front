import { Component, OnInit } from '@angular/core';
import { DialogService, EditableTip, FormLayout, TableWidthConfig } from 'ng-devui';
import { Subscription } from 'rxjs';
import { Item } from 'src/app/@core/data/listData';
import { ListDataService } from 'src/app/@core/mock/list-data.service';
import { FormConfig } from 'src/app/@shared/components/admin-form';

@Component({
  selector: 'da-editable-list',
  templateUrl: './editable-list.component.html',
  styleUrls: ['./editable-list.component.scss'],
})
export class EditableListComponent implements OnInit {
  editableTip = EditableTip.btn;
  busy: Subscription | undefined;

  source = [
    { title: '首页' },
    { title: '列表页' },
    {
      title: '编辑列表',
      link: '/pages/list/editable',
    },
  ];

  pager = {
    total: 0,
    pageIndex: 1,
    pageSize: 10,
  };

  listData: any[] = [];

  headerNewForm = false;

  formConfig: FormConfig = {
    layout: FormLayout.Horizontal,
    items: [
      {
        label: 'Id',
        prop: 'id',
        type: 'input',
      },
      {
        label: 'Title',
        prop: 'title',
        type: 'input',
        required: true,
        rule: {
          validators: [{ required: true }],
        },
      },
      {
        label: 'Priority',
        prop: 'priority',
        type: 'select',
        options: ['Low', 'Medium', 'High'],
        required: true,
        rule: {
          validators: [{ required: true }],
        },
      },
      {
        label: 'Iteration',
        prop: 'iteration',
        type: 'input',
      },
      {
        label: 'Assignee',
        prop: 'assignee',
        type: 'input',
        required: true,
        rule: {
          validators: [{ required: true }],
        },
      },
      {
        label: 'Status',
        prop: 'status',
        type: 'select',
        options: ['Stuck', 'Done', 'Working on it'],
      },
      {
        label: 'Timeline',
        prop: 'timeline',
        type: 'datePicker',
      },
    ],
    labelSize: '',
  };

  defaultRowData = {
    id: '',
    title: '',
    priority: 'Low',
    iteration: '',
    assignee: '',
    status: 'Stuck',
    timeline: new Date(),
  };

  priorities = ['Low', 'Medium', 'High'];

  tableWidthConfig: TableWidthConfig[] = [
    {
      field: 'id',
      width: '150px',
    },
    {
      field: 'title',
      width: '200px',
    },
    {
      field: 'priority',
      width: '100px',
    },
    {
      field: 'iteration',
      width: '100px',
    },
    {
      field: 'assignee',
      width: '100px',
    },
    {
      field: 'status',
      width: '100px',
    },
    {
      field: 'timeline',
      width: '100px',
    },
    {
      field: 'operator',
      width: '100px',
    },
  ];

  constructor(private listDataService: ListDataService, private dialogService: DialogService) {}

  ngOnInit() {
    this.getList();
  }

  onEditEnd(rowItem: any, field: any) {
    rowItem[field] = false;
  }

  getList() {
    this.busy = this.listDataService.getListData(this.pager).subscribe((res) => {
      const data = JSON.parse(JSON.stringify(res.pageList));
      data.$expandConfig = { expand: false };
      this.listData = data;
      this.pager.total = res.total;
    });
  }

  beforeEditStart = (rowItem: any, field: any) => {
    return true;
  };

  beforeEditEnd = (rowItem: any, field: any) => {
    if (rowItem && rowItem[field].length < 3) {
      return false;
    } else {
      return true;
    }
  };

  newRow() {
    this.headerNewForm = true;
  }

  getuuid() {
    return new Date().getTime() + 'CNWO';
  }

  quickRowAdded(e: any) {
    const newData = { ...e };
    this.listData.unshift(newData);
    this.headerNewForm = false;
  }

  quickRowCancel() {
    this.headerNewForm = false;
  }

  subRowAdded(index: number) {
    this.listData[index].$expandConfig.expand = false;
    const newData = { ...this.defaultRowData };
    this.listData.splice(index + 1, 0, newData);
  }

  subRowCancel(index: number) {
   // (this.listData[index] as Item).$expandConfig.expand = false;
  }

  toggleExpand(rowItem: any) {
    if (rowItem.$expandConfig) {
      rowItem.$expandConfig.expand = !rowItem.$expandConfig.expand;
    }
  }

  onPageChange(e: number) {
    this.pager.pageIndex = e;
    this.getList();
  }

  onSizeChange(e: number) {
    this.pager.pageSize = e;
    this.getList();
  }

  deleteRow(index: number) {
    const results = this.dialogService.open({
      id: 'delete-dialog',
      width: '346px',
      maxHeight: '600px',
      title: 'Delete',
      showAnimate: false,
      content: 'Are you sure you want to delete it?',
      backdropCloseable: true,
      onClose: () => {},
      buttons: [
        {
          cssClass: 'primary',
          text: 'Ok',
          disabled: false,
          handler: () => {
            this.listData.splice(index, 1);
            results.modalInstance.hide();
          },
        },
        {
          id: 'btn-cancel',
          cssClass: 'common',
          text: 'Cancel',
          handler: () => {
            results.modalInstance.hide();
          },
        },
      ],
    });
  }
}
