$(function() {
    elsfk($('#elsfk'))
})

function elsfk($el, opts) {
    var defaultOpts = {
        models: [
            [
                [1, 1],
                [1, 1]
            ],
            [
                [1, 1],
                [0, 1],
                [0, 1]
            ],
            [
                [1, 1],
                [1, 0],
                [1, 0]
            ],
            [
                [1],
                [1],
                [1],
                [1]
            ],
            [
                [1, 1, 1],
                [0, 1, 0]
            ],
            [
                [0, 1],
                [1, 1],
                [1, 0]
            ],
            [
                [1, 0],
                [1, 1],
                [0, 1]
            ]
        ],
        colors: ['#f70f6f', '#0f87f7', '#0ff7ac', '#17f70f', '#ffe000'],
        col: 20,
        row: 40,
        faildiv: '<div class="dialog-box"><div class="dialog"><h1 style="white-space:nowrap">Game Over</h1></div></div>',
        slide: 1000,
    };
    var options = $.extend(defaultOpts, opts);
    var G = {
        _init() {
            G.el = $el;
            $el.addClass('elsfk-container');

            G.col = options.col;
            G.row = options.row;
            G.oneWidth = G.el.width() / G.col;

            G.sildeTimer = null;

            G.faildiv = options.faildiv;

            G.score = 0;
            G.level = 1;
            G.slide = options.slide

            // 游戏面板
            var main = document.createElement('div');
            $(main).addClass('elsfk-main')
            $(main).appendTo(G.el)
            G.main = $(main);

            // 下一个方块
            var next = document.createElement('div');
            $(next).addClass('elsfk-next')
            $(next).append('<p>下一个</p><div></div>').appendTo(G.el)
            G.nextDiv = $(next).find('div');

            // 按键提示
            var key = document.createElement('div');
            $(key).addClass('elsfk-keys')
            $(key).append('<span class="elsfk-action-left">←</span>' +
                '<span class="elsfk-action-right">→</span>' +
                '<span class="elsfk-action-down">↓</span>' +
                '<span class="elsfk-action-rolate">⌘</span>').appendTo(G.el)

            // 得分
            var score = document.createElement('div');
            $(score).addClass('elsfk-score')
            $(score).append('<p>得分</p><p class="score">0</p>').appendTo(G.el)
            G.scoreDiv = $(score).find('.score');

            // 关卡
            var level = document.createElement('div');
            $(level).addClass('elsfk-level')
            $(level).append('<p>关卡</p><p class="level">1</p>').appendTo(G.el)
            G.levelDiv = $(level).find('.level');

            G.drawmap()
            G.randommodel()
            G.bind()
        },
        bind() {
            $(document).on('keydown', function(e) {
                if (G.main.find('.modelOne').length == 0) {
                    return
                }
                clearInterval(G.sildeTimer)
                if (e.which == 39) {
                    // 右
                    G.changeModel('right')
                } else if (e.which == 37) {
                    // 左
                    G.changeModel('left')
                } else if (e.which == 32) {
                    //  space
                    G.changeModel('rolate')
                } else if (e.which == 40) {
                    // 下
                    G.changeModel('down')
                }
                G.sildeTimer = setTimeout(G.sildeDown, G.slide)
            })
            G.el.off('click', '.elsfk-action-left').on('click', '.elsfk-action-left', function() {
                if (G.main.find('.modelOne').length == 0) {
                    return
                }
                clearInterval(G.sildeTimer)
                G.changeModel('left')
                G.sildeTimer = setTimeout(G.sildeDown, G.slide)
            })
            G.el.off('click', '.elsfk-action-right').on('click', '.elsfk-action-right', function() {
                if (G.main.find('.modelOne').length == 0) {
                    return
                }
                clearInterval(G.sildeTimer)
                G.changeModel('right')
                G.sildeTimer = setTimeout(G.sildeDown, G.slide)
            })
            G.el.off('click', '.elsfk-action-down').on('click', '.elsfk-action-down', function() {
                if (G.main.find('.modelOne').length == 0) {
                    return
                }
                clearInterval(G.sildeTimer)
                G.changeModel('down')
                G.sildeTimer = setTimeout(G.sildeDown, G.slide)
            })
            G.el.off('click', '.elsfk-action-rolate').on('click', '.elsfk-action-rolate', function() {
                if (G.main.find('.modelOne').length == 0) {
                    return
                }
                clearInterval(G.sildeTimer)
                G.changeModel('rolate')
                G.sildeTimer = setTimeout(G.sildeDown, G.slide)
            })
        },
        changeModel(type) {
            var modelOne = G.main.find('.modelOne');
            var left = parseFloat(modelOne.attr('data-left')).toFixed(2);
            var widlength = $.parseJSON($(modelOne).attr('data-model'))[0].length * G.oneWidth;
            if (type == 'left') {
                if (left == 0) {
                    return
                }
                if (G.isEnd('left')) {
                    return
                }
                modelOne.css({
                    left: (left - G.oneWidth) + 'px'
                })
                modelOne.attr('data-left', (left - G.oneWidth))
            } else if (type == 'right') {
                if (left >= G.main.width() - widlength) {
                    return
                }
                if (G.isEnd('right')) {
                    return
                }
                modelOne.css({
                    left: (parseFloat(left) + G.oneWidth) + 'px'
                })
                modelOne.attr('data-left', (parseFloat(left) + G.oneWidth))
            } else if (type == 'rolate') {
                var model = $.parseJSON(modelOne.attr('data-model'));
                G.drawmodel(G.rolateModel(model));
                if (left + widlength > G.main.width()) {
                    modelOne.css({
                        left: (G.main.width() - widlength) + 'px'
                    })
                    modelOne.attr('data-left', (G.main.width() - widlength))
                }
            } else if (type == 'down') {
                var modelLeft = Math.round(left / G.oneWidth);
                var maptop = G.getMapTop();
                var end = maptop[modelLeft]
                var widlength = widlength / G.oneWidth;
                var heilength = $.parseJSON($(modelOne).attr('data-model')).length;
                for (var i = 0; i < widlength; i++) {
                    end = Math.max(end, maptop[modelLeft + i]);
                }
                modelOne.css({
                    top: (G.main.height() - (end + heilength) * G.oneWidth) + 'px'
                })
                modelOne.attr('data-top', (G.main.height() - (end + heilength) * G.oneWidth))
            }
        },
        rolateModel(model) {
            var ret = [];
            for (var i = 0; i < model[0].length; i++) {
                var one = [];
                for (var j = 0; j < model.length; j++) {
                    one.push(model[j][i])
                }
                ret.unshift(one)
            }
            return ret;
        },
        randommodel() {
            var model = G.nextModel || options.models[parseInt(Math.random() * options.models.length)];
            var color = G.nextModel ? G.nextDiv.attr('data-color') : false
            G.drawmodel(model, false, color)
            G.nextModel = options.models[parseInt(Math.random() * options.models.length)];
            G.drawmodel(G.nextModel, G.nextDiv)
            G.sildeTimer = setTimeout(G.sildeDown, G.slide)
            G.isGameOver()
        },
        isGameOver() {
            var maptop = G.getMapTop();
            var modelOne = G.main.find('.modelOne');
            var heilength = $.parseJSON($(modelOne).attr('data-model')).length;
            var widlength = $.parseJSON($(modelOne).attr('data-model'))[0].length;
            for (var i = 0; i < widlength; i++) {
                if (maptop[G.col / 2 - 1 + i] >= (G.row - heilength)) {
                    clearInterval(G.sildeTimer)
                    $('body').append(G.faildiv)
                        // alert('Game over');
                    break
                }
            }

        },
        sildeDown() {
            if (G.isEnd()) {
                clearInterval(G.sildeTimer)
                G.drawEnd();
                G.score += 4;
                G.clear()
                G.randommodel()
                G.showscore()
                return
            }
            var top = parseFloat(G.main.find('.modelOne').attr('data-top')).toFixed(2);
            G.main.find('.modelOne').css({
                top: (parseFloat(top) + G.oneWidth) + 'px'
            })
            G.main.find('.modelOne').attr('data-top', parseFloat(top) + G.oneWidth)
            G.sildeTimer = setTimeout(G.sildeDown, G.slide)
        },
        showscore() {
            G.scoreDiv.html(G.score)
            if (G.score >= 500 * G.level) {
                G.level++;
                G.slide = G.slide * 0.8;
                G.levelDiv.html(G.level)
            }
        },
        clear() {
            for (var i = 0; i < G.map.length; i++) {
                if (eval(G.map[i].join('+')) == G.map[i].length) {
                    for (var row = i; row < G.map.length; row++) {
                        for (var col = 0; col < G.map[i].length; col++) {
                            var one = $('.elsfk-one[data-pos="' + row + '-' + col + '"]')
                            if (one.length > 0) {
                                if (row == i) {
                                    one.remove();
                                    G.map[row][col] = 0;
                                    G.score += 10;
                                }
                                if (row > i) {
                                    one.attr('data-pos', (row - 1) + '-' + col);
                                    one.css({
                                        top: (G.row - row) * G.oneWidth + 'px'
                                    })
                                    G.map[row][col] = 0;
                                    G.map[row - 1][col] = 1
                                }
                            }
                        }
                    }
                    i--
                }
            }
        },
        drawEnd() {
            var modelTop = Math.round(parseFloat(G.main.find('.modelOne').attr('data-top')) / G.oneWidth);
            var modelLeft = Math.round(parseFloat(G.main.find('.modelOne').attr('data-left')) / G.oneWidth);
            G.main.find('.modelOne span').each(function() {
                var top = Math.round(parseFloat($(this).css('top')) / G.oneWidth);
                var left = Math.round(parseFloat($(this).css('left')) / G.oneWidth);
                $(this).css({
                    top: (modelTop + top) * G.oneWidth + 'px',
                    left: (modelLeft + left) * G.oneWidth + 'px'
                })
                $(this).attr('data-pos', (G.row - 1 - (modelTop + top)) + '-' + (modelLeft + left));
                $(this).addClass('elsfk-one')
                G.map[G.row - 1 - (modelTop + top)][modelLeft + left] = 1;
                $(this).appendTo(G.main)
                G.main.find('.modelOne').remove();
            })
        },
        isEnd(type) {
            var ret = false
            var maptop = G.getMapTop();
            var modelTop = Math.round(parseFloat(G.main.find('.modelOne').attr('data-top')) / G.oneWidth);
            var modelLeft = Math.round(parseFloat(G.main.find('.modelOne').attr('data-left')) / G.oneWidth);
            G.main.find('.modelOne span').each(function() {
                var top = Math.round(parseFloat($(this).css('top')) / G.oneWidth);
                var left = Math.round(parseFloat($(this).css('left')) / G.oneWidth);
                var currentLeft = modelLeft + left;
                if (type == 'left') {
                    currentLeft--
                } else if (type == 'right') {
                    currentLeft++
                }
                if (maptop[currentLeft] >= G.row - 1 - (modelTop + top)) {
                    ret = true
                }
            })
            return ret;
        },
        getMapTop() {
            var ret = [];
            for (var i = 0; i < G.map[0].length; i++) {
                var flag = 0
                for (var j = 0; j < G.map.length; j++) {
                    if (G.map[j][i] == 1) {
                        flag = j + 1
                    }
                }
                ret.push(flag)
            }
            return ret;
        },
        drawmodel(model, $el, color) {

            var modelOne = document.createElement('div');
            var random = Math.floor(Math.random() * options.colors.length);
            var color = color || options.colors[random]
            if ($el) {
                modelOne = $el;
                modelOne.empty();
            } else if (G.main.find('.modelOne').length > 0) {
                modelOne = G.main.find('.modelOne');
                modelOne.empty();
                color = $(modelOne).attr('data-color')
            } else {
                var el = $el || G.main
                $(modelOne).addClass('modelOne');
                $(modelOne).appendTo(el);



                $(modelOne).attr({
                    'data-top': 0,
                    'data-left': G.main.width() / 2 - G.oneWidth
                })
                $(modelOne).css({
                    left: (G.main.width() / 2 - G.oneWidth) + 'px'
                })
            }
            $(modelOne).attr({
                'data-color': color,
                'data-model': JSON.stringify(model)
            })
            for (var i = 0; i < model.length; i++) {
                for (var j = 0; j < model[i].length; j++) {
                    if (model[i][j] == 1) {
                        var one = document.createElement('span');
                        $(one).css({
                            top: G.oneWidth * i + 'px',
                            left: G.oneWidth * j + 'px',
                            background: color,
                            width: G.oneWidth + 'px',
                            height: G.oneWidth + 'px'
                        })
                        $(modelOne).append(one)
                    }
                }
            }
        },
        drawmap() {
            var map = [];
            for (var i = 0; i < G.row; i++) {
                var row = [];
                for (var j = 0; j < G.col; j++) {
                    row.push(0);
                }
                map.push(row);
            }
            G.map = map;
        }
    }
    G._init();
}