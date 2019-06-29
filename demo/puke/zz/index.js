$(function() {
    zz($('#zz'))
    $('#level').on('change', function() {
        zz($('#zz'), {
            level: $(this).val()
        })
    })
})

function zz($el, opts) {
    var defaultOpts = {
        level: 1,
        count: 10,
        color: ['ht', 'rt', 'mh', 'fp'],
        first: 70,
        col: 10,
        backbg: 'backbg1.png'
    };
    var options = $.extend(defaultOpts, opts);
    var G = {
        _init(opts) {
            G.el = $el;
            $el.empty();
            $el.addClass('puke-container');

            G.col = opts.col;
            G.level = opts.level;
            G.count = opts.count;
            G.color = opts.color;
            G.first = opts.first;
            G.backbg = opts.backbg;
            G.current = 0;
            G.puke = G.getpuke();
            G.pageX = null;
            G.pageY = null;
            G.timer = null;
            G.step = []; //from - to - count | push
            G.isCtrl = false;

            G.drawlist()

            var push = document.createElement('div');
            $(push).addClass('puke-push');
            $(push).append('<img src="../img/backbg1.png">').appendTo(G.el)
            G.push = $(push)

            var finish = document.createElement('div');
            $(finish).addClass('puke-finish-box');
            $(finish).appendTo(G.el);
            G.finish = $(finish)


            G.drawfirst()
            G.bind()

        },
        bind() {
            $(document).off('keydown').on('keydown', function(e) {
                if (e.metaKey || e.ctrlKey) {
                    G.isCtrl = true
                }
                if (G.isCtrl && e.which == 90) {
                    G.cancelstep()
                }
            })
            $(document).off('keyup').on('keyup', function() {
                G.isCtrl = false
            })
            G.push.off('click').on('click', function() {
                if (!G.canpush()) {
                    alert('每一列都有翻开的牌，才能发牌！');
                    return;
                }
                var once = G.puke.slice(G.current - 1, Math.min(G.current + G.col, G.count * 13));

                G.drawOnce(once, true)
                G.current += G.col;
                if (G.current >= G.count * 13) {
                    G.push.hide()
                }
                G.step.push('push')
            })
            G.el.off('click', '.pukeOne').on('click', '.pukeOne', function() {
                if ($(this).hasClass('open')) {
                    return
                }

                var one = $(this).attr('data-puke');
                $(this).find('img').attr('src', '../img/' + one + '.png');
                $(this).addClass('open')
                var from = $(this).parent().index()
                G.step.push('open-' + from)
            })
            G.el.off('dragstart', '.pukeOne').on('dragstart', '.pukeOne', function(e) {
                // e.preventDefault();
                if (!$(this).hasClass('open')) {
                    return
                }
                if (!G.isContinue($(this))) {
                    return
                }
                e.originalEvent.dataTransfer.dropEffect = "move";

                G.pageX = e.pageX;
                G.pageY = e.pageY;

            })
            G.el.off('drag', '.pukeOne').on('drag', '.pukeOne', function(e) {
                if (!G.pageX) {
                    return
                }
                var moveX = e.pageX;
                var moveY = e.pageY;
                $(this).css({
                    'transform': 'translate(' + (moveX - G.pageX) + 'px,' + (moveY - G.pageY) + 'px)'
                })
                $(this).nextAll().css({
                    'transform': 'translate(' + (moveX - G.pageX) + 'px,' + (moveY - G.pageY) + 'px)'
                })
            })
            G.el.off('dragend', '.pukeOne').on('dragend', '.pukeOne', function(e) {
                if (!G.pageX) {
                    return
                }
                var moveX = e.pageX - G.el[0].offsetLeft;
                var oneWidth = G.el.width() / G.col;
                var col = Math.round(moveX / oneWidth) - 1;
                G.pageX = null;
                G.pageY = null;

                $(this).css({
                    'animation': 'none',
                    'transform': 'none'
                })
                $(this).nextAll().css({
                    'animation': 'none',
                    'transform': 'none'
                })
                var dragkey = $(this).attr('data-puke').substr(2);
                var lastKey = G.el.find('.list').eq(col).find('.pukeOne').length > 0 ?
                    G.el.find('.list').eq(col).find('.pukeOne.open').last().attr('data-puke').substr(2) :
                    false;
                if (lastKey != false && parseInt(lastKey) != parseInt(dragkey) + 1) {
                    return
                }
                var next = $(this).nextAll()
                var from = $(this).parent().index()
                G.step.push(from + '-' + col + '-' + (next.length + 1))
                G.el.find('.list').eq(col).append(this);
                G.el.find('.list').eq(col).append(next);
                if (G.el.find('.list').eq(col).find('.pukeOne.open').length > 10) {
                    G.el.find('.list').eq(col).find('.pukeOne.open').addClass('arrowOpen')
                } else {
                    G.el.find('.list').eq(col).find('.pukeOne.open').removeClass('arrowOpen')
                }
                if (G.isContinue($(this), true)) {
                    G.finOnce($(this).parent())
                }

            })
        },
        cancelstep() {
            if (G.step.length == 0) {
                return
            }
            var step = G.step[G.step.length - 1];
            if (step == 'push') {
                G.el.find('.list').find('.pukeOne:last').remove()
                G.current -= G.col;
                G.push.show()
            } else if (step.indexOf('open') != -1) {
                step = step.split('-');
                G.el.find('.list').eq(step[1]).find('.pukeOne').last().removeClass('open');
                G.el.find('.list').eq(step[1]).find('.pukeOne').last().find('img').attr('src', '../img/' + G.backbg);
            } else {
                step = step.split('-');
                var count = G.el.find('.list').eq(step[1]).find('.pukeOne').length - step[2];
                var puke = G.el.find('.list').eq(step[1]).find('.pukeOne').eq(count);
                var pukenext = G.el.find('.list').eq(step[1]).find('.pukeOne').eq(count).nextAll();
                G.el.find('.list').eq(step[0]).append(puke).append(pukenext)

            }
            G.step.pop();

        },
        canpush() {
            var ret = true;
            G.el.find('.list').each(function() {
                if ($(this).find('.pukeOne.open').length == 0) {
                    ret = false;
                }
            })
            return ret;
        },
        isContinue(cur, full) {
            var ret = true;
            var count = null;
            if (!full) {
                count = parseInt(cur.attr('data-puke').substr(2))
                var color = cur.attr('data-puke').substr(0, 2)
                cur.nextAll().each(function() {
                    var key = parseInt($(this).attr('data-puke').substr(2));
                    var oneColor = $(this).attr('data-puke').substr(0, 2)
                    if (key == count - 1 && oneColor == color) {
                        count = key;
                    } else {
                        ret = false;
                        return
                    }
                })
            } else {
                var list = cur.parent();

                if (list.children().last().attr('data-puke').substr(2) == 1) {
                    var color = list.children().last().attr('data-puke').substr(0, 2)
                    var length = list.children().length;
                    for (var i = 0; i < 13; i++) {
                        var oneColor = list.children().eq(length - i - 1).attr('data-puke').substr(0, 2)
                        if (!(list.children().eq(length - i - 1).attr('data-puke').substr(2) == i + 1 &&
                                list.children().eq(length - i - 1).hasClass('open') && color == oneColor)) {
                            ret = false;
                            break
                        }
                    }
                } else {
                    ret = false
                }

            }
            return ret
        },
        finOnce(list) {
            var one = document.createElement('div');
            G.finish.append(one)
            var next = list.children().eq(list.children().length - 13).nextAll()
            list.children().eq(list.children().length - 13).addClass('puke-finish').css({
                'animation': 'none',
                'transform': 'none'
            }).appendTo(one)
            next.addClass('puke-finish').css({
                'animation': 'none',
                'transform': 'none'
            }).appendTo(one)
        },
        drawfirst() {
            var size = Math.ceil(G.first / G.count);
            for (var i = 0; i < size; i++) {
                var once = G.puke.slice(i * G.col, Math.min((i + 1) * G.col, G.first));
                var isopen = false;
                if ((i + 1) * G.col >= G.first) {
                    isopen = true
                }
                G.drawOnce(once, isopen, 0.1 * 13 * i)
            }
            G.current = G.first + 1;
        },
        drawOnce(data, open, duration) {
            var duration = duration || 0;
            // animation-duration: 
            for (var i = 0; i < data.length; i++) {

                var one = document.createElement('div');
                $(one).attr({
                    'draggable': "true",
                    'class': "pukeOne " + (open ? 'open' : ''),
                    'data-puke': data[i],
                    'style': "animation-duration:" + (duration + 0.1 * i) + "s"
                })
                $(one).append('<img src="../img/' + (open ? data[i] + '.png' : G.backbg) + '">').appendTo(G.el.find('.list').eq(i));
            }

        },
        getpuke() {
            var ret = [];
            var size = parseInt(G.count / G.level)
            for (var l = 0; l < size; l++) {
                for (var i = 0; i < G.level; i++) {
                    for (var j = 0; j < 13; j++) {
                        ret.push(G.color[i] + (j + 1));
                    }
                }
            }
            return ret;
            return ret.sort(function(a, b) {
                return Math.floor(Math.random() * 2 - 1)
            })
        },
        drawlist() {
            for (var i = 0; i < G.col; i++) {
                G.el.append('<div class="list"></div>')
            }
        }
    }
    G._init(options)
}