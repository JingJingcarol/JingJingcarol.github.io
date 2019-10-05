class chart {
    constructor($elem, opt) {
        this.$elem = $elem;
        this.data = opt.data;
        this.type = opt.type;
        switch (this.type) {
            case 'line':
                this.view = new lineChart($elem, opt)
                break;
            default:
                this.view = new chartView($elem, opt);
                break
        }

    }
    update(data) {

    }
}
class chartView {
    constructor($elem, opt) {
        const defaultOpt = {
            title: null
        }
        opt = $.extend({}, defaultOpt, opt)
        this.$elem = $elem;
        this.$elem.addClass('chart-box')
        this.data = opt.data;
        this.type = opt.type;
        this.title = opt.title;
        this.series = opt.series;
        this.point = []
        this.colors = ['#f1b8e4', '#d9b8f1', '#f1ccb8', '#f1f1b8', '#b8f1ed', '#b8f1cc', '#e7dac9']
        this.draw();
    }
    draw() {
        console.log('is not support! please wait')
    }
    drawtitle() {
        if (this.title) {
            const title = document.createElement('div');
            $(title).addClass('chart-title');
            if (this.title.style) {
                $(title).css(this.title.style);
            }
            if (this.title.text) {
                $(title).html(this.title.text);
            }

            return title;
        }
        return null
    }
    getPixel() {
        this.relaxPixel = {
            x: $(this.seriesNode).outerWidth() / this.max.x,
            y: $(this.seriesNode).outerHeight() / this.maxCate
        }
        return this.relaxPixel
    }
    getMax() {
        let x = 0;
        let y = null;
        for (let i in this.series) {
            if (x < this.series[i].length) {
                x = this.series[i].length
            }
            for (let j in this.series[i]) {
                const val = typeof this.series[i][j] != 'object' ? this.series[i][j] : this.series[i][j].value;
                if (!y || y < val) {
                    y = val
                }
            }
        }
        this.max = { x, y }
        return this.max
    }

}
class lineChart extends chartView {
    draw() {
        this.$elem.find('.chart-series').remove();
        const series = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        $(series).addClass('chart-series');
        $(series).appendTo(this.$elem);
        this.seriesNode = series;
        this.getMax();
        this.drawAxis();

        this.getPixel();
        this.drawSeries();

    }

    drawAxis() {
        const axisY = document.createElement('div');
        $(axisY).addClass('chart-axisy')
        this.$elem.append(axisY)
        const categoryY = this.getCategoryY();
        for (let i in categoryY) {
            $(axisY).append('<p>' + categoryY[i] + '</p>')
        }

    }
    getCategoryY() {
        const len = Math.floor(this.max.y).toString().length;
        let space = 2 * Math.pow(5, len - 1);
        let start = space;
        let ret = [0]
        if (Math.floor(this.max.y / (Math.pow(10, len))) > 5) {
            space = space * 2
        }
        if (start < this.max.y) {
            while (start <= this.max.y + space) {
                ret.push(start);
                start += space;
            }
        } else {
            ret = [0, this.max.y / 2, this.max.y]
        }
        this.maxCate = ret[ret.length - 1];
        this.categoryY = ret;
        return ret;
    }
    get CategoryX() {
        let ret = [];
        for (let i in this.series) {
            for (let j in this.series[i]) {}
        }
    }
    drawGrid() {}
    drawLegend() {}
    drawSeries() {


        for (let i in this.series) {
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            $(this.seriesNode).append(path);
            this.point[i] = [];
            let d = 'M'
            for (let j in this.series[i]) {
                let point = this.series[i][j];
                if (typeof point != 'object') {
                    point = {
                        value: this.series[i][j]
                    }
                }
                point.x = j;
                point.y = point.value
                point.pixelX = point.x * this.relaxPixel.x;
                point.pixelY = (this.maxCate - point.y) * this.relaxPixel.y;
                this.point[i].push(point)
                d += point.pixelX + ',' + point.pixelY + ' '
            }
            path.setAttribute('d', d);
            // path.setAttribute('stroke', this.max.x * this.relaxPixel.x * 10);
            path.setAttribute('style', 'fill:transparent;stroke:' + this.colors[i] + ';stroke-width:2;')
        }
    }
}
/*
 * chart
 *
 * params
 * $elem
 * opt :{
 *    type:string line
 *    data:object []
 *    title:{
 *      text:'',
 *      align:'',
 *      style:any
 *    }
 *}
 */
wenui.chart = function($elem, opt) {
    return new chart($elem, opt)
}