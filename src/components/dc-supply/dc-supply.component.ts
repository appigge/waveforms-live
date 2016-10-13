import {Component, Output, EventEmitter, Input} from '@angular/core';

//Components
import {DeviceComponent} from '../../components/device/device.component';

//Services
import {DeviceManagerService} from '../../services/device/device-manager.service';

@Component({
  templateUrl: 'dc-supply.html',
  selector: 'dc-supply'
})
export class DcSupplyComponent { 
    @Output() headerClicked: EventEmitter<any> = new EventEmitter();
    @Input() contentHidden: boolean;
    public voltageSupplies: any[];
    public voltages: string[];
    public currents: string[];
    public dcOn: boolean[] = [];
    public maxVoltages: number[];
    public maxCurrents: number[];
    public correctVoltages: boolean[];
    public correctCurrents: boolean[];
    public voltageLimitFormats: string[] = [];

    public deviceManagerService: DeviceManagerService;
    public activeDevice: DeviceComponent;


    public intervalReference;

    public showCurrent: boolean = false;

    public readVoltages: string[] = [];
    
    constructor(_deviceManagerService: DeviceManagerService) {
        this.voltageSupplies = [0, 1, 2];
        this.contentHidden = true;
        this.voltages = ['5.00', '5.00', '-5.00'];
        this.currents = ['1.00', '1.00', '1.00'];
        this.maxVoltages = [6, 25, -25];
        this.maxCurrents = [1, 1, 1];
        this.correctCurrents = [true, true, true];
        this.correctVoltages = [true, true, true];

        this.deviceManagerService = _deviceManagerService;
        this.activeDevice = this.deviceManagerService.getActiveDevice();
        if (this.activeDevice.instruments.dc.chans[0].currentIncrement !== 0) {
            this.showCurrent = true;
        }
    }

    //If active device exists, populate values
    ngOnInit() {
        if (this.activeDevice !== undefined) {
            let channelNumArray = [];
            this.voltages = [];
            for (let i = 0; i < this.activeDevice.instruments.dc.numChans; i++) {
                channelNumArray[i] = i + 1;
                this.voltages[i] = "3.300";
                this.currents[i] = "1.000";
                this.readVoltages[i] = "-.--- V";
                this.formatExtremes(i);
                this.dcOn[i] = false;
            }
            this.voltageSupplies = channelNumArray;
        }
    }

    formatExtremes(channel: number) {
        let min = this.activeDevice.instruments.dc.chans[channel].voltageMin;
        let max = this.activeDevice.instruments.dc.chans[channel].voltageMax;
        let minString = (min / 1000).toString();
        let maxString = (max / 1000).toString();
        if (min > 0) {
            minString = ('+' + min / 1000);
        }
        if (max > 0) {
            maxString = ('+' + max / 1000);
        }
        if (Math.abs(min) === Math.abs(max)) {
            this.voltageLimitFormats.push('\xB1 ' + (max / 1000) + ' V');
        }
        else if (min === 0) {
            this.voltageLimitFormats.push('+ ' + maxString + ' V');
        }
        else if (max === 0) {
            this.voltageLimitFormats.push(minString + ' V');
        }
        else {
            this.voltageLimitFormats.push('' + minString + '\xA0\xA0:\xA0\xA0' + maxString + ' V');
        }
    }

    //Set dc voltages on OpenScope
    setVoltages(chans: Array<number>, voltages: Array<number>) {
        this.activeDevice.instruments.dc.setVoltages(chans, voltages).subscribe(
            (data) => {
                console.log('DC channels: ' + chans + ' set to ' + voltages);
            },
            (err) => {
                console.log(err);
            },
            () => {}
        );
    }

    //Receive desired voltages from OpenScope
    getVoltages(chans: Array<number>) {
        this.activeDevice.instruments.dc.getVoltages(chans).subscribe(
            (data) => {
                console.log(data);
                for (let channel in data.dc) {
                    this.readVoltages[parseInt(channel) - 1] = data.dc[channel][0].voltage.toFixed(3) + ' V';
                }
            },
            (err) => {
                console.log(err);
            },
            () => {
                //console.log('getVoltage Done');
            }
        )
    }
    
    //Toggle voltages on/off
    togglePower(channel: number) {
        for (let i = 0; i < this.voltageSupplies.length; i++) {
            if (this.correctCurrents[i] === false || this.correctVoltages[i] === false) {
                return;
            }
        }
        this.dcOn[channel] = !this.dcOn[channel];
        if (this.dcOn[channel]) {
            //this.getVoltages(this.voltageSupplies);
            this.setVoltages([channel + 1], [parseFloat(this.voltages[channel])]);
            setTimeout(() => {
                this.getVoltages([channel + 1]);
            }, 500);
        }
        else {
            this.readVoltages[channel] = '-.--- V';
            this.setVoltages([channel + 1], [0]);
        }
    }

    refreshDc(channel: number) {
        this.getVoltages([channel + 1]);
    }

    inputLeave(channel: number) {
        this.voltages[channel] = parseFloat(this.voltages[channel]).toFixed(3);
        if (this.dcOn[channel]) {
            this.setVoltages([channel + 1], [parseFloat(this.voltages[channel])]);
            setTimeout(() => {
                this.getVoltages([channel + 1]);
            }, 500);
        }
    }

    hideBar() {
        this.headerClicked.emit(null);
        clearInterval(this.intervalReference);
        for (let i = 0; i < this.activeDevice.instruments.dc.chans.length; i++) {
            this.dcOn[i] = false;
        }
    }

    //Validate voltage supplies 
    validateSupply(supplyNum: number) {
        if ((parseFloat(this.voltages[supplyNum]) < this.activeDevice.instruments.dc.chans[supplyNum].voltageMin || parseFloat(this.voltages[supplyNum]) > this.activeDevice.instruments.dc.chans[supplyNum].voltageMax)) {
            //Incorrect
            this.correctVoltages[supplyNum] = false;
            return;
        }
        this.correctVoltages[supplyNum] = true;
    }

    //Validate current supplies
    validateCurrent(supplyNum: number) {
        if (parseFloat(this.currents[supplyNum]) < 0 || parseFloat(this.currents[supplyNum]) > this.maxCurrents[supplyNum]) {
            console.log(supplyNum + ' is wrong mosuckra');
            this.correctCurrents[supplyNum] = false;
            return;
        }
        this.correctCurrents[supplyNum] = true;
    }
}