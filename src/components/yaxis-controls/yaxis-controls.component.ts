import {Component, Output, EventEmitter, Input} from '@angular/core';
import {NavParams, ViewController, PopoverController} from 'ionic-angular';

//Components
import {SilverNeedleChart} from '../chart/chart.component';
import {GenPopover} from '../gen-popover/gen-popover.component';
import {SeriesPopover} from '../series-popover/series-popover.component';

//Services
import {StorageService} from '../../services/storage/storage.service';

@Component({
    templateUrl: 'yaxis-controls.html',
    selector: 'yaxis-controls'
})
export class YAxisComponent {
    @Input() chart: SilverNeedleChart;
    public numSeries: number[] = [0, 1];
    public storageService: StorageService;
    public storageEventListener: EventEmitter<any>;
    public viewCtrl: ViewController;
    public params: NavParams;
    public popoverCtrl: PopoverController;
    public names: string[] = [];
    public showSeriesSettings: boolean[] = [];
    public configHover: boolean = false;
    public timeoutRef: any;
    
    constructor(_storageService: StorageService, _viewCtrl: ViewController, _params: NavParams, _popoverCtrl: PopoverController) {
        this.popoverCtrl = _popoverCtrl;
        this.viewCtrl = _viewCtrl;
        this.params = _params;
        this.storageService = _storageService;
        this.storageEventListener = this.storageService.saveLoadEventEmitter.subscribe((data) => {
            if (data === 'save') {
                this.storageService.saveData('yaxis', JSON.stringify({
                    voltBase: this.chart.voltBase,
                    voltsPerDiv: this.chart.voltDivision
                }));
            }
            else if (data === 'load') {
                this.storageService.getData('yaxis').then((data) => {
                    let dataObject = JSON.parse(data);
                    dataObject.voltBase.forEach((element, index, array) => {
                        this.chart.setSeriesSettings({
                            seriesNum: index,
                            voltsPerDiv: dataObject.voltsPerDiv[index],
                            voltBase: dataObject.voltBase[index]
                        });
                    });
                });
            }
        });
    }

    //Remove storage event listener to prevent memory leaks
    ngOnDestroy() {
        this.storageEventListener.unsubscribe();
    }

    ngOnInit() {
        for (let i = 0; i < this.chart.oscopeChansActive.length; i++) {
            this.names.push('Osc ' + (i + 1));
            this.showSeriesSettings.push(this.chart.oscopeChansActive[i]);
        }
    }

    //Toggle Series visibility
    toggleSeriesSettings(seriesNum: number) {
        this.showSeriesSettings[seriesNum] = !this.showSeriesSettings[seriesNum];
    }

    toggleVisibility(seriesNum: number, event) {
        event.stopPropagation();
        this.chart.toggleVisibility(seriesNum);
    }

    //Open series popover
    openSeriesPopover(seriesNum) {
        let popover = this.popoverCtrl.create(SeriesPopover, {
            chart: this.chart,
            yComponent: this,
            seriesNum: seriesNum
        });

        popover.present({
            ev: event
        });
        popover.onDidDismiss(data => {
        });
    }

    //Toggle chart autoscaling for all axes
    turnOnAutoscale() {
        this.chart.toggleAutoscale();
    }

    //Called when series settings are changed. Updates chart series settings
    seriesChanged(seriesNum: number) {
        this.chart.setSeriesSettings({
            seriesNum: seriesNum,
            voltsPerDiv: this.chart.voltDivision[seriesNum],
            voltBase: this.chart.voltBase[seriesNum]
        });
    }

    //Set active series on the chart component
    setActiveSeries(i) {
        this.chart.setActiveSeries(i + 1);
    }

    //Autoscale a specific y axis
    autoscaleY(i) {
        this.chart.autoscaleAxis('y', i);
    }
}