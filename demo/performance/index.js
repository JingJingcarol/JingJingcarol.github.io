class PerformanceConf {
    constructor(){

    }
    getDNS(){
        return performance.timing.domainLookupEnd - performance.timing.domainLookupStart;
    }
    getTCP(){
        return performance.timing.connectEnd - performance.timing.connectStart;
    }
    getrequest(){
        return performance.timing.responseEnd - performance.timing.responseStart;
    }
    getParseDom(){
        return performance.timing.domComplete - performance.timing.domInteractive;
    }
    getFirstP(){
        return performance.timing.responseStart - performance.timing.navigationStart;
    }
    getdomready(){
        return performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart;
    }
    getonload(){
        return performance.timing.loadEventEnd - performance.timing.navigationStart;
    }
    getentries(){
        const entries = performance.getEntries();
        let resource = {};
        for(let i = 0,len = entries.length;i < len;i++){
            const name = entries[i].initiatorType || entries[i].name;
            if(!resource[name]){
                resource[name] = [];
            }
            resource[name].push({
                entry:entries[i],
                startTime: entries[i].startTime,
                duration:entries[i].duration,
                size:entries[i].decodedBodySize || 0,
            })
        }
        return resource;
    }
    getentriesByname(name){
        return performance.getentriesByname(name);
    }
    getEntryType(){
        const type = ['网页通过点击链接、地址栏输入、表单提交、脚本操作等方式加载','网页通过重新加载按钮或location.reload()方法加载','网页通过前进或后退按钮加载','任何其他来源的加载'];
        return type[performance.navigation.type] || type[3]
    }
    getredirect(){
        return performance.navigation.redirectCount;
    }
    getmemory(){
        return performance.memory;
    }
    getNetworkType(){
        const ua = navigator.userAgent;
        let networkStr = ua.match(/NetType\/\w+/) ? ua.match(/NetType\/\w+/)[0] : 'NetType/other';
        networkStr = networkStr.toLowerCase().replace('nettype/', '');
        let networkType;
        switch (networkStr) {
            case 'wifi':
                networkType = 'wifi';
                break;
            case '4g':
                networkType = '4g';
                break;
            case '3g':
            case '3gnet':
                networkType = '3g';
                break;
            case '2g':
                networkType = '2g';
                break;
            default:
                networkType = 'other';
        }
        return networkType;
    }
    getBrowserInfo() {
        let agent = navigator.userAgent.toLowerCase();
        // console.log(agent);
        let arr = [];
        let system = agent.split(' ')[1].split(' ')[0].split('(')[1];
        arr.push(system);
        let REGSTR_EDGE = /edge\/[\d.]+/gi;
        let REGSTR_IE = /trident\/[\d.]+/gi;
        let OLD_IE = /msie\s[\d.]+/gi;
        let REGSTR_FF = /firefox\/[\d.]+/gi;
        let REGSTR_CHROME = /chrome\/[\d.]+/gi;
        let REGSTR_SAF = /safari\/[\d.]+/gi;
        let REGSTR_OPERA = /opr\/[\d.]+/gi;
        // IE
        if (agent.indexOf('trident') > 0) {
          arr.push(agent.match(REGSTR_IE)[0].split('/')[0]);
          arr.push(agent.match(REGSTR_IE)[0].split('/')[1]);
          return arr;
        }
        // OLD_IE
        if (agent.indexOf('msie') > 0) {
          arr.push(agent.match(OLD_IE)[0].split(' ')[0]);
          arr.push(agent.match(OLD_IE)[0].split(' ')[1]);
          return arr;
        }
        // Edge
        if (agent.indexOf('edge') > 0) {
          arr.push(agent.match(REGSTR_EDGE)[0].split('/')[0]);
          arr.push(agent.match(REGSTR_EDGE)[0].split('/')[1]);
          return arr;
        }
        // firefox
        if (agent.indexOf('firefox') > 0) {
          arr.push(agent.match(REGSTR_FF)[0].split('/')[0]);
          arr.push(agent.match(REGSTR_FF)[0].split('/')[1]);
          return arr;
        }
        // Opera
        if (agent.indexOf('opr') > 0) {
          arr.push(agent.match(REGSTR_OPERA)[0].split('/')[0]);
          arr.push(agent.match(REGSTR_OPERA)[0].split('/')[1]);
          return arr;
        }
        // Safari
        if (agent.indexOf('safari') > 0 && agent.indexOf('chrome') < 0) {
          arr.push(agent.match(REGSTR_SAF)[0].split('/')[0]);
          arr.push(agent.match(REGSTR_SAF)[0].split('/')[1]);
          return arr;
        }
        // Chrome
        if (agent.indexOf('chrome') > 0) {
          arr.push(agent.match(REGSTR_CHROME)[0].split('/')[0]);
          arr.push(agent.match(REGSTR_CHROME)[0].split('/')[1]);
          return arr;
        } else {
          arr.push('未获取到浏览器信息');
          return arr;
        }
      
    }
    getBrowser() {
      let browserInfo = this.getBrowserInfo();
      let browse = '';
      if (browserInfo[1] && browserInfo[2]) {
        browse = browserInfo[1] + ' ' + browserInfo[2];
      } else {
        browse = '未获取到浏览器信息';
      }
      switch (browse) {
        case 'msie 6.0':
          browse = 'Internet Explorer 6';
          break;
        case 'msie 7.0':
          browse = 'Internet Explorer 7';
          break;
        case 'trident 4.0':
          browse = 'Internet Explorer 8';
          break;
        case 'trident 5.0':
          browse = 'Internet Explorer 9';
          break;
        case 'trident 6.0':
          browse = 'Internet Explorer 10';
          break;
        case 'trident 7.0':
          browse = 'Internet Explorer 11';
          break;
      }
      return browse;
    }
}

class Dashboard {
    constructor(elem,setting){

    }
}

class Cell {
    constructor(options){
        const defaultopt = {
            top:0,
            left:0,
            width:'10rem',
            height:'10rem',
            type:'text',
            title:'',
            data:null
        };
        this.opt = $.extends({},defaultopt,options);
    }
    drawCell(){

    }
    drawTitle(){}

}

class NumberCell extends Cell{
  drawCell(){

  }
}
$('.clock').each((i,c) => {
  const size = $(c).attr('data-size');
  const realwidth = parseInt($(c).css('--width'));
  const width = realwidth * 0.928 / 2 - 1;
  let deg = parseInt(size) / 100;
  $(c).css({
    '--size':size,
    '--bound':`${width * Math.sin( Math.PI * 2 * deg )}px ${-width * Math.cos( Math.PI * 2 * deg)}px 1px ${realwidth * 0.036}px`
  })
})
$('.num').each((i,c) => {
  c.className = 'num num-0';
  tocountdown(c)
})

function tocountdown(c){
  const size = $(c).attr('size') || 8;
  let currentsize = parseInt($(c).attr('currentsize')) || 0;
  
  if(currentsize == size ){
    return;
  }
  currentsize++;
  c.className = 'num num-' + currentsize;
  $(c).attr('currentsize',currentsize);
  
  setTimeout(() => {
    tocountdown(c)
  },100)
}

$('.num-box').each((i,c) => {
  tocountdownNumber(c)
})
function tocountdownNumber(c){
  const size = $(c).attr('size') || 0
  let currentsize = parseInt($(c).attr('currentsize')) || 0;
  if(currentsize == size ){
    return;
  }
  currentsize += parseInt((size - currentsize)/20) || 1 ;
  const numbers = '<div class="num num-'+currentsize.toString().split('').join('"></div><div class="num num-')+'"></div>';
  $(c).html(numbers);
  $(c).attr('currentsize',currentsize);
  setTimeout(() => {
    tocountdownNumber(c)
  },100/60)
}

function drawPeakChart(el,data){
  $(el).empty();
  const colorArr = ['hsl(192, 60%, 60%)','hsl(207, 32%, 60%)','hsl(234, 32%, 60%)','hsl(345, 58%, 60%)','hsl(185, 27%, 60%)','hsl(298, 29%, 60%)','hsl(220,  6%, 90%)','hsl(220,  6%, 90%)','hsl(220,  6%, 90%)'];
  const len = data.length;
  const r   = el[0].offsetWidth / 2
      , charth = 1.5 * r;
  for(let i = 0; i < len;i++){
    let slice    = 2 * Math.PI / len;
    let npos     = i * slice - Math.PI;
    let val      = data[i];
    let h        = val * charth / 100;
    let fang     = slice/2
      , chord    = 2 * r * Math.sin(fang/2)
      , chang    = (Math.PI - fang) / 2
      , alt2mp   = chord * Math.sin(chang)
      , slope    = Math.atan(h / alt2mp)
      , slopeLen = Math.sqrt(Math.pow(h,2) + Math.pow(alt2mp,2))
      , scaleY   = slopeLen / r
      , skew     = Math.atan(chord * Math.cos(chang) / slopeLen);
    const color = colorArr[i%colorArr.length]
    $(el).append(`<div class="face" style="transform:rotateZ(${npos}rad) rotateX(${(slope - Math.PI)}rad) skewX(${skew}rad) scaleY(${scaleY});background-image:-webkit-linear-gradient(bottom right, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.25) 50%, transparent 50%), -webkit-linear-gradient(bottom right, ${color}, ${color} 50%, transparent 50%)"></div>
    <div class="face" style="transform:rotateZ(${(npos + slice)}rad) rotateX(${(-slope)}rad) skewX(${skew}rad) scaleY(${scaleY});background-image:-webkit-linear-gradient(bottom right, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.25) 50%, transparent 50%), -webkit-linear-gradient(bottom right, ${color}, ${color} 50%, transparent 50%)"></div>`)
  }
}
