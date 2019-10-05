$(document).on('focus', 'input', evt => {
    $(evt.target).parent().addClass('__focus')
})
$(document).on('blur', 'input', evt => {
    $(evt.target).parent().removeClass('__focus')
})

$(document).on('click', '.md-select', evt => {
    const dom = $(evt.currentTarget);
    if (dom.find('.md-select-list').length > 0 && dom.find('.md-select-list ul')[0].contains(evt.target)) {
        return
    }
    dom.addClass('__focus');
    dom.find('select').attr('disabled', true);
    let data = [];
    dom.find('option').each((i, a) => {
        let one = {}
        one.text = $(a).html();
        one.value = $(a).attr('value') || one.text;
        data.push(one)
    })
    wenui.mdselect(dom, data)
})

// select
// param $elem:$('.md-select'),data;[{value:'',text:'',attr:''}]; opt:{mul:是否多选}
wenui.mdselect = function($elem, data, opt) {
    // $elem.find('.md-select-list').remove();

    $elem.find('select').css({
        'visibility': 'hidden'
    })
    let box = document.createElement('div');
    $(box).addClass('md-select-list');
    if ($elem.find('.md-select-list').length > 0) {
        box = $elem.find('.md-select-list')[0]
        $(box).find('ul').remove()
    } else {
        $(box).appendTo($elem)
        const select = document.createElement('div')
        $(select).addClass('md-select-select')
        $(select).html(data[0].text)
        $(box).append(select)
    }

    const ul = document.createElement('ul');
    $(ul).addClass('list md-list');
    $(box).append(ul)
    for (let i = 0; i < data.length; i++) {
        const li = document.createElement('li');
        if ($elem.find('select').val() == data[i].value) {
            $(li).addClass('active')
        }
        $(ul).append(li);
        $(li).html(data[i].text);
        $(li).attr(data[i])
        $(li).on('click', evt => {
            const val = $(evt.currentTarget).attr('value');
            $elem.find('select').val(val);
            $(box).find('.md-select-select').html($(evt.currentTarget).html())
            $(ul).hide()
            $elem.removeClass('__focus');
        })
    }
    wenui.clickoutside.register($elem[0])
    $elem.off('clickoutside').on('clickoutside', function(e) {
        $(this).find('.md-select-list ul').hide()
    })
}