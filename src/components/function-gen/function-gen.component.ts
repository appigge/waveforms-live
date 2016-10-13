import {Component, EventEmitter} from '@angular/core';
import {ModalController, PopoverController, ToastController} from 'ionic-angular';

//Pages
import {ModalFgenPage} from '../../pages/fgen-modal/fgen-modal';

//Components
import {DeviceComponent} from '../../components/device/device.component';
import {GenPopover} from '../../components/gen-popover/gen-popover.component';

//Services
import {DeviceManagerService} from '../../services/device/device-manager.service';

//Interfaces
import {SettingsObject} from '../instruments/awg/awg-instrument.component';

@Component({
  templateUrl: 'function-gen.html',
  selector: 'fgen'
})
export class FgenComponent { 
    public showDutyCycle: boolean;
    public waveType: string;
    public frequency: string;
    public amplitude: string;
    public offset: string;
    public dutyCycle: string;
    public showWaves: boolean;
    public powerOn: boolean;
    public deviceManagerService: DeviceManagerService;
    public activeDevice: DeviceComponent;
    public supportedSignalTypes: string[];
    public attemptingPowerOff: boolean = false;
    public storageEventListener: EventEmitter<any>;
    public modalCtrl: ModalController;
    public popoverCtrl: PopoverController;
    public toastCtrl: ToastController;
    
    constructor(_deviceManagerService: DeviceManagerService, 
                _modalCtrl: ModalController,
                _popoverCtrl: PopoverController,
                _toastCtrl: ToastController) 
    {
        this.modalCtrl = _modalCtrl;
        this.popoverCtrl = _popoverCtrl;
        this.toastCtrl = _toastCtrl;
        this.deviceManagerService = _deviceManagerService;
        this.activeDevice = this.deviceManagerService.getActiveDevice();
        this.supportedSignalTypes = this.activeDevice.instruments.awg.chans[0].signalTypes;
        this.showDutyCycle = false;
        this.waveType = 'sine';
        this.frequency = '1000';
        this.amplitude = '3';
        this.offset = '0';
        this.dutyCycle = '50';
        this.showWaves = false;
        this.powerOn = false;
    }
    
    //Toggle dropdown
    toggleWave(waveType: string) {
        this.showWaves = !this.showWaves;
        this.waveType = waveType;
    }
    
    //Toggle power to awg
    togglePower() {
        let chans = [];
        let settings = [];
        for (let i = 0; i < this.activeDevice.instruments.awg.numChans; i++) {
            chans[i] = i + 1;
            settings[i] = {
                signalType: this.waveType,
                signalFreq: parseFloat(this.frequency),
                vpp: parseFloat(this.amplitude),
                vOffset: parseFloat(this.offset)
            };
        }
        if (!this.powerOn) {
            this.setRegularWaveform(chans, settings);
            this.run(chans);
        }
        else {
            this.stop(chans);
            /*let numPoints = 30000;
            let waveform = {
                y: [],
                t0: 0,
                dt: 1
            };
            let period = 0;
            if (parseFloat(this.frequency) != 0) {
                period = 1 / parseFloat(this.frequency);
            }
            let dt = (2 * period) / numPoints;
            waveform.dt = dt;
            for (let i = 0; i < numPoints; i++) {
                waveform.y[i] = parseFloat(this.amplitude) * Math.sin(((Math.PI * 2) / (numPoints / 2)) * i) + parseFloat(this.offset);
            }
            this.setArbitraryWaveform(chans, [waveform], ['I16']);*/
        }
    }

    //Get settings from awg
    setArbitraryWaveform(chans: number[], waveforms, dataTypes: string[]) {
        this.activeDevice.instruments.awg.setArbitraryWaveform(chans, waveforms, ['I16']).subscribe(
            (data) => {
                console.log(data);
            },
            (err) => {
                console.log('AWG Set Arbitrary Failed');
            },
            () => {

            });
    }

    //Set regular waveform for awg
    setRegularWaveform(chans: number[], settings: Array<SettingsObject>) {
        this.activeDevice.instruments.awg.setRegularWaveform(chans, settings).subscribe(
            (data) => {
                //console.log(data);
            },
            (err) => {
                console.log('AWG Set Regular Failed');
            },
            () => {

            });
    }

    //Run awg
    run(chans: number[]) {
        this.activeDevice.instruments.awg.run(chans).subscribe(
            (data) => {
                //console.log(data);
                if (data.statusCode === undefined) {
                    console.log('AWG Run Successful');
                    this.powerOn = !this.powerOn;
                }
                else {
                    this.attemptingPowerOff = true;
                    this.stop(chans);
                }
            },
            (err) => {
                console.log('AWG Run Failed');
            },
            () => {

            });
    }

    //Stop awg
    stop(chans: number[]) {
        this.activeDevice.instruments.awg.stop(chans).subscribe(
            (data) => {
                //console.log(data);
                this.powerOn = false;
                if (data.awg['1'][0].statusCode === 0 && this.attemptingPowerOff) {
                    this.attemptingPowerOff = false;
                    let toast = this.toastCtrl.create({
                        message: 'Error Running AWG. AWG Has Been Stopped Automatically. Please Try Again',
                        showCloseButton: true,
                        position: 'bottom'
                    });
                    toast.present();
                }
            },
            (err) => {
                console.log('AWG Stop Failed');
            },
            () => {

            });
    }

    //Open function generator / awg modal
    openFgen(num) {
        let modal = this.modalCtrl.create(ModalFgenPage, {
            value: num, 
            waveType: this.waveType,
            frequency: this.frequency,
            amplitude: this.amplitude,
            offset: this.offset,
            dutyCycle: this.dutyCycle,
            fgenComponent: this
        });
        modal.present();
    }

    openPopover(event) {
        let genPopover = this.popoverCtrl.create(GenPopover, {
                dataArray: this.supportedSignalTypes
            });
        genPopover.present({
            ev: event
        });
        genPopover.onDidDismiss(data=> {
            this.toggleWave(data.option);
        });
    }
    
    //Determines if active wave type is a square wave
    isSquare() {
        if (this.waveType === 'square') {
            return true;
        }
        return false;
    }
    
}
