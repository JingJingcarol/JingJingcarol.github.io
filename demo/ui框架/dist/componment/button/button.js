$(document).on('click', '.btn', evt => {
    let button = $(evt.currentTarget);
    button.addClass('animating');
    let [x, y] = [evt.offsetX, evt.offsetY];
    let start = performance.now();
    requestAnimationFrame(function raf(now) {
        const count = Math.floor(now - start);
        button.css({
            '--ripple-x': x,
            '--ripple-y': y,
            '--animation-tick': count
        })
        if (count > 1000) {
            button.removeClass('animating');
            button.css({
                '--animation-tick': 0
            })
            return;
        }
        requestAnimationFrame(raf);
    })
})