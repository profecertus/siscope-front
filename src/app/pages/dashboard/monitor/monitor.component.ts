import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { TimeAxisData } from 'ng-devui/time-axis';
import { monitorOption, echartServiceOption } from '../echarts';


@Component({
  selector: 'da-monitor',
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.scss'],
})
export class MonitorComponent implements OnInit, OnDestroy, AfterViewInit {
  time_axis_data_horizontal: TimeAxisData | undefined;

  timerForOccupation: any;
  timerForTotalUser: any;
  timerForLive: any;
  timerForService: any;

  monitorOptions = monitorOption;
  serviceOptions = echartServiceOption;

  totalUsers = 5000;

  occupationChart: any;
  serviceChart: any;

  constructor() {}

  ngOnInit(): void {
    this.timerForOccupation = setInterval(() => {
      let random = Number((Math.random() * 100).toFixed(0));
      this.monitorOptions.series[0].data[0].value = random;
      this.occupationChart.setOption(this.monitorOptions, true);
    }, 1500);

    this.timerForTotalUser = setInterval(() => {
      this.totalUsers++;
    }, 140);


    this.timerForService = setInterval(() => {
      let temp = this.serviceOptions.series[0].data.pop()!;
      this.serviceOptions.series[0].data.unshift(temp);
      this.serviceChart.setOption(this.serviceOptions, true);
    }, 1500);
  }

  getOccupationChart(event: any) {
    this.occupationChart = event;
  }

  getServiceChart(event: any) {
    this.serviceChart = event;
  }

  ngOnDestroy(): void {
    clearInterval(this.timerForOccupation);
    clearInterval(this.timerForTotalUser);
    clearInterval(this.timerForLive);
    clearInterval(this.timerForService);
  }

  ngAfterViewInit(): void {
    window.dispatchEvent(new Event('resize'));
  }
}
