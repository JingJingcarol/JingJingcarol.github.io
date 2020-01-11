$(document).on('click','.footer li',function(){
    const footer = $(this).parents('.footer');
    $(this).addClass('active').siblings().removeClass('active');
    footer.css({
        '--atpos' : (4.5 + $(this).index()*100/footer.find('li').length) + '%'
    })
})