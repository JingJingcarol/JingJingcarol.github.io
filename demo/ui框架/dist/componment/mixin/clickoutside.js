document.addEventListener('click', function(e) {
    for (let i of wenui.clickoutside.listener) {
        if (i.isOutside(e)) {
            $(i.elem).trigger('clickoutside', e)
        }
    }
})
class clickoutsideRegister {
    constructor(elem) {
        this.elem = elem;
    }
    isOutside(evt) {

        if (this.elem.contains(evt.target)) {
            return false;
        }
        const boundary = this.elem.getBoundingClientRect()
        if (evt.pageX > boundary.left && evt.pageX < boundary.left + boundary.width && evt.pageY > boundary.top && evt.pageY < boundary.height + boundary.top) {
            return false;
        }
        return true
    }
}
class clickoutsidelistener {
    constructor() {
        this.listener = new Set()
    }
    register(elem) {
        const onlis = new clickoutsideRegister(elem)
        this.listener.add(onlis)
    }
}

wenui.clickoutside = new clickoutsidelistener()

// export default {
//     clickoutside
// }