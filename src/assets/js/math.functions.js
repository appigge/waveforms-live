var mathFunctions = (function() {

    /**************************************************
    * Function Definitions
    **************************************************/
    var getMax = function getMax(chartRef, seriesNum, minIndex, maxIndex) {
        //Spread operator '...' uses each index as the corresponding parameter in the function
        var activeIndices = this.chart.series[seriesNum].yData.slice(minIndex, maxIndex);
        var value = Math.max(...activeIndices);
        var vPerDiv = Math.abs(this.chart.yAxis[seriesNum].max - this.chart.yAxis[seriesNum].min) / 10;
        var i = 0;
        var unit = '';
        while (vPerDiv < 1) {
            i++;
            vPerDiv = vPerDiv * 1000;
        }
        if (i == 0) {
            unit = ' V';
        }
        else if (i == 1) {
            unit = ' mV';
        }
        else if (i == 2) {
            unit = ' uV';
        }
        else if (i == 3) {
            unit = ' nV';
        }

        var val = (value * Math.pow(1000, i)).toString();
        var wholeLength = val.indexOf('.');
        if (wholeLength === -1) { wholeLength = 4 }
        var fixedNum = 4 - wholeLength;

        return (parseFloat(val)).toFixed(fixedNum) + unit;

    }

    var getMin = function getMin(chartRef, seriesNum, minIndex, maxIndex) {
        var activeIndices = this.chart.series[seriesNum].yData.slice(minIndex, maxIndex);
        var value = Math.min(...activeIndices);
        var vPerDiv = Math.abs(this.chart.yAxis[seriesNum].max - this.chart.yAxis[seriesNum].min) / 10;
        var i = 0;
        var unit = '';
        while (vPerDiv < 1) {
            i++;
            vPerDiv = vPerDiv * 1000;
        }
        if (i == 0) {
            unit = ' V';
        }
        else if (i == 1) {
            unit = ' mV';
        }
        else if (i == 2) {
            unit = ' uV';
        }
        else if (i == 3) {
            unit = ' nV';
        }

        var val = (value * Math.pow(1000, i)).toString();
        var wholeLength = val.indexOf('.');
        if (wholeLength === -1) { wholeLength = 4 }
        var fixedNum = 4 - wholeLength;

        return (parseFloat(val)).toFixed(fixedNum) + unit;
    }

    var getLocalMax = function getLocalMax(chartRef, seriesNum, minIndex, maxIndex) {
        var maxCoordinates = [];
        var detector = true;
        for (var i = minIndex; i < maxIndex - 1; i++) {
            if (this.chart.series[seriesNum].yData[i] - this.chart.series[seriesNum].yData[i + 1] >= 0 && !detector) {
                maxCoordinates.push({
                    x: this.chart.series[seriesNum].xData[i],
                    y: this.chart.series[seriesNum].yData[i]
                });
                detector = true;
            }
            if (this.chart.series[seriesNum].yData[i] - this.chart.series[seriesNum].yData[i + 1] < 0 && detector) {
                detector = false;
            }
        }
    }

    var getLocalMin = function getLocalMin(chartRef, seriesNum, minIndex, maxIndex) {
        var minCoordinates = [];
        var detector = true;
        for (var i = minIndex; i < maxIndex - 1; i++) {
            if (this.chart.series[seriesNum].yData[i] - this.chart.series[seriesNum].yData[i + 1] < 0 && !detector) {
                minCoordinates.push({
                    x: this.chart.series[seriesNum].xData[i],
                    y: this.chart.series[seriesNum].yData[i]
                });
                detector = true;
            }
            if (this.chart.series[seriesNum].yData[i] - this.chart.series[seriesNum].yData[i + 1] >= 0 && detector) {
                detector = false;
            }
        }
    }

    var getAmplitude = function getAmplitude(chartRef, seriesNum, minIndex, maxIndex) {
        var max = this.getMax(seriesNum, minIndex, maxIndex);
        var min = this.getMin(seriesNum, minIndex, maxIndex);
        var amplitude = (parseFloat(max) - parseFloat(min)) / 2;
        var unit = max.substr(max.indexOf(' '));

        var wholeLength = amplitude.toString().indexOf('.');
        if (wholeLength === -1) { wholeLength = 4 }
        var fixedNum = 4 - wholeLength;

        return (amplitude).toFixed(fixedNum) + unit;
    }

    var getMean = function getMean(chartRef, seriesNum, minIndex, maxIndex) {
        var sum = 0;
        for (var i = minIndex; i < maxIndex; i++) {
            sum += this.chart.series[seriesNum].yData[i];
        }
        var value = sum / (maxIndex - minIndex);
        var vPerDiv = Math.abs(this.chart.yAxis[seriesNum].max - this.chart.yAxis[seriesNum].min) / 10;
        var i = 0;
        var unit = '';
        while (vPerDiv < 1) {
            i++;
            vPerDiv = vPerDiv * 1000;
        }
        if (i == 0) {
            unit = ' V';
        }
        else if (i == 1) {
            unit = ' mV';
        }
        else if (i == 2) {
            unit = ' uV';
        }
        else if (i == 3) {
            unit = ' nV';
        }

        var val = (value * Math.pow(1000, i)).toString();
        var wholeLength = val.indexOf('.');
        if (wholeLength === -1) { wholeLength = 4 }
        var fixedNum = 4 - wholeLength;

        return (parseFloat(val)).toFixed(fixedNum) + unit;
    }

    var getRMS = function getRMS(chartRef, seriesNum, minIndex, maxIndex) {
        var sum = 0;
        for (var i = minIndex; i < maxIndex; i++) {
            sum += Math.pow(this.chart.series[seriesNum].yData[i], 2);
        }
        var value = Math.sqrt(sum / (maxIndex - minIndex));
        var vPerDiv = Math.abs(this.chart.yAxis[seriesNum].max - this.chart.yAxis[seriesNum].min) / 10;
        var i = 0;
        var unit = '';
        while (vPerDiv < 1) {
            i++;
            vPerDiv = vPerDiv * 1000;
        }
        if (i == 0) {
            unit = ' V';
        }
        else if (i == 1) {
            unit = ' mV';
        }
        else if (i == 2) {
            unit = ' uV';
        }
        else if (i == 3) {
            unit = ' nV';
        }
        var val = (value * Math.pow(1000, i)).toString();
        var wholeLength = val.indexOf('.');
        if (wholeLength === -1) { wholeLength = 4 }
        var fixedNum = 4 - wholeLength;

        return (parseFloat(val)).toFixed(fixedNum) + unit;
    }

    var getPeakToPeak = function getPeakToPeak(chartRef, seriesNum, minIndex, maxIndex) {
        var max = this.getMax(seriesNum, minIndex, maxIndex);
        var min = this.getMin(seriesNum, minIndex, maxIndex);
        var unit = max.substr(max.indexOf(' '));
        var p2p = Math.abs(parseFloat(max)) + Math.abs(parseFloat(min));

        var wholeLength = p2p.toString().indexOf('.');
        if (wholeLength === -1) { wholeLength = 4 }
        var fixedNum = 4 - wholeLength;

        return (p2p).toFixed(fixedNum) + unit;
    }

    var getFrequency = function getFrequency(chartRef, seriesNum, minIndex, maxIndex) {
        var value = this.chart.series[seriesNum].yData[minIndex];
        var points = [];
        for (var i = minIndex; i < maxIndex - 1; i++) {
            if (this.chart.series[seriesNum].yData[i] <= value && this.chart.series[seriesNum].yData[i + 1] >= value) {
                points.push(this.chart.series[seriesNum].xData[i]);
                //Increment i twice in case one of the points was equal to the value
                i++;
            }
        }
        var sum = 0;
        for (var i = 0; i < points.length - 1; i++) {
            sum += (points[i + 1] - points[i]);
        }
        var toInverse = sum / (points.length - 1);
        var freqRange = 1 / toInverse;
        var i = 0;
        var unit = '';
        while (freqRange > 1) {
            i++;
            freqRange = freqRange / 1000;
        }
        i--;
        if (i == 0) {
            unit = ' Hz';
        }
        else if (i == 1) {
            unit = ' kHz';
        }
        else if (i == 2) {
            unit = ' Mhz';
        }
        else if (i == 3) {
            unit = ' GHz';
        }

        var val = ((1 / (toInverse)) / Math.pow(1000, i)).toString();
        var wholeLength = val.indexOf('.');
        if (wholeLength === -1) { wholeLength = 4 }
        var fixedNum = 4 - wholeLength;

        return (parseFloat(val)).toFixed(fixedNum) + unit;
    }

    var getPeriod = function getPeriod(chartRef, seriesNum, minIndex, maxIndex) {
        var value = this.chart.series[seriesNum].yData[minIndex];
        var points = [];
        for (var i = minIndex; i < maxIndex - 1; i++) {
            if (this.chart.series[seriesNum].yData[i] <= value && this.chart.series[seriesNum].yData[i + 1] >= value) {
                points.push(this.chart.series[seriesNum].xData[i]);
                //Increment i twice in case one of the points was equal to the value
                i++;
            }
        }
        var sum = 0;
        for (var i = 0; i < points.length - 1; i++) {
            sum += (points[i + 1] - points[i]);
        }

        var timeInterval = sum / (points.length - 1);
        var i = 0;
        var unit = '';
        while (timeInterval < 1) {
            i++;
            timeInterval = timeInterval * 1000;
        }
        if (i == 0) {
            unit = ' s';
        }
        else if (i == 1) {
            unit = ' ms';
        }
        else if (i == 2) {
            unit = ' us';
        }
        else if (i == 3) {
            unit = ' ns';
        }
        else if (i == 4) {
            unit = ' ps';
        }

        var val = ((sum / (points.length - 1)) * Math.pow(1000, i)).toString();
        var wholeLength = val.indexOf('.');
        if (wholeLength === -1) { wholeLength = 4 }
        var fixedNum = 4 - wholeLength;

        return (parseFloat(val)).toFixed(fixedNum) + unit;
    }
    
    /**************************************************
    * Return Functions
    **************************************************/
    return {
        getMax: getMax,
        getMin: getMin,
        getLocalMax: getLocalMax,
        getLocalMin: getLocalMin,
        getAmplitude: getAmplitude,
        getMean: getMean,
        getRMS: getRMS,
        getPeakToPeak: getPeakToPeak,
        getFrequency: getFrequency,
        getPeriod: getPeriod
    }

})()