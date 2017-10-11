import { NgModule } from '@angular/core';
import { SharedModule } from '../../app/shared/shared.module';
import { IonicModule } from 'ionic-angular';

import { LoggerPage } from './logger';

//Components
import { LoggerComponent } from '../../components/logger/logger.component';
import { LoggerChartComponent } from '../../components/logger-chart/logger-chart.component';
import { LoggerXAxisComponent } from '../../components/logger-xaxis/logger-xaxis.component';
import { LoggerTimelineComponent } from '../../components/logger-timeline/logger-timeline.component';

//Services
import { LoggerPlotService } from '../../services/logger-plot/logger-plot.service';
 
@NgModule({
    imports: [
        SharedModule,
        IonicModule.forRoot(LoggerPage)
    ],
    declarations: [
        LoggerPage,
        LoggerComponent,
        LoggerChartComponent,
        LoggerXAxisComponent,
        LoggerTimelineComponent
    ],
    exports: [LoggerPage],
    providers: [
        LoggerPlotService
    ]
})
export class LoggerModule { }