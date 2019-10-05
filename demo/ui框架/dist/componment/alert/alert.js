/* 
 *
 * alert 
 *
 * params 
 * type:info | warning | danger | success
 * message: 显示内容
 * opts:{
 *  pos:string = 'top | middle | bottom  left | center | right',
 *  autoclose:boolean = true,
 *  hasIcon:boolean = false,
 *  timeout:number,单位：s
 *  message:string
 * }
 *
 * 20190707
 *
 */
wenui.alert = function(type, message, opts) {
    const arg = arguments;
    if (arg.length == 0) {
        return
    } else if (arg.length == 1) {
        message = arg[0];
        type = 'info'
    }
    const defaultOpt = {
        pos: 'top right',
        autoclose: true,
        hasIcon: false,
        timeout: 5
    }
    const option = $.extend(defaultOpt, opts);
    let className = 'alert-box alert-' + option.pos.split(' ').join('-')

    if (!this.el) {
        let box = document.createElement('div');
        $(box).addClass(className);
        $('body').append(box);
        this.el = box;
    }


    let div = document.createElement('div')
    $(div).addClass('alert alert-' + type)
    $(div).html('<span>' + message + '</span>')
    $(this.el).append(div)
    if (option.hasIcon) {
        $(div).append('<span class="alert-close">&times;</span>')
    }
    if (option.autoclose) {
        const that = this;
        setTimeout(function() {
            $(div).remove();
            if ($(that.el).children().length == 0) {
                $(that.el).remove()
                that.el = null
            }
        }, option.timeout * 1000)
    }
}