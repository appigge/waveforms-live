import {Component} from '@angular/core';

//Services
import {SimulatedDeviceService} from '../../../services/simulated-device/simulated-device.service';

@Component({
})
export class SimulatedTriggerComponent {
    public simulatedDeviceService: SimulatedDeviceService;
    public sources: Array<Object> = [{
        "instrument": null,
        "channel": null,
        "type": null,
        "lowerThreshold": null,
        "upperThreshold": null
    }];
    public targets: Object = {};

    constructor(_simulatedDeviceService: SimulatedDeviceService) {
        this.simulatedDeviceService = _simulatedDeviceService;
    }

    setParameters(chan, source, targets) {
        this.sources[chan] = source;
        this.targets = targets;
        this.simulatedDeviceService.setTriggerTargets(targets);
        return {
            "command": "setParameters",
            "statusCode": 0,
            "wait": 0
        };
    }

    single() {
        return {
            "command": "single",
            "statusCode": 0,
            "wait": -1,
            "acqCount": 27
        };
    }

    forceTrigger() {
        return {
            "command": "forceTrigger",
            "statusCode": 0
        };
    }

}