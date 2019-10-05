if (location.protocol === 'http:' && location.hostname !== 'localhost')
    location.protocol = 'https:';
if ('paintWorklet' in CSS) {
    CSS.paintWorklet.addModule('http://localhost:8080/dist/js/cssPaintWorket.js');
} else {
    document.body.innerHTML = 'You need support for <a href="https://drafts.css-houdini.org/css-paint-api/">CSS Paint API</a> to view this demo :(';
}



// import clickoutside from '../componment/mixin/clickoutside.js';

class wenui {
    constructor() {

    }

}