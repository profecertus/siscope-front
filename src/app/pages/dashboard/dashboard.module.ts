import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard.component';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { SharedModule } from 'src/app/@shared/shared.module';
import { MonitorComponent } from './monitor/monitor.component';
import { WorkSpaceComponent } from './work-space/work-space.component';
import { GanttModule, ProgressModule, TimeAxisModule, QuadrantDiagramModule, DragDropModule } from 'ng-devui';
import { EchartsModule } from 'src/app/@shared/components/echarts/echarts.module';
import { MonitorProgressComponent } from './monitor/monitor-progress/monitor-progress.component';
import { WorkSpaceHeaderComponent } from './work-space/work-space-header/work-space-header.component';
import { WorkSpaceBodyComponent } from './work-space/work-space-body/work-space-body.component';
import { WorkManagementComponent } from './work-space/work-space-body/work-management/work-management.component';
import { WorkItemTableComponent } from './work-space/work-item-table/work-item-table.component';
import { WorkOperationComponent } from './work-space/work-space-body/work-operation/work-operation.component';
import { DashboardModule as DashboardContainerModule } from 'ng-devui/dashboard';
import { AnalysisModule } from 'materials/blocks/analysis/src/analysis.module';

@NgModule({
  declarations: [
    DashboardComponent,
    MonitorComponent,
    WorkSpaceComponent,
    MonitorProgressComponent,
    WorkSpaceHeaderComponent,
    WorkSpaceBodyComponent,
    WorkManagementComponent,
    WorkItemTableComponent,
    WorkOperationComponent,
  ],
  imports: [
    SharedModule,
    DashboardRoutingModule,
    GanttModule,
    ProgressModule,
    TimeAxisModule,
    EchartsModule,
    QuadrantDiagramModule,
    DragDropModule,
    DashboardContainerModule,
    AnalysisModule
  ],
  providers: [],
})
export class DashboardModule {}
