// const path = require("path");
import * as pages from '../../views/index.js'
class nav {
    constructor(list){
        this.routerlist = list;
        this.router = null;
    }
     render(){
        let navdom = document.createElement('nav');
        navdom.className = 'g-nav';
        let routers = [];
        for(let p = 0,len = this.routerlist.length;p < len;p++){
            routers.push(`<li><a href="${this.routerlist[p].url}" data-index="${p}">${this.routerlist[p].name}</a></li>`);
        }
        navdom.innerHTML = `<ul>${routers.join('')}</ul>`;
        const routerdom = navdom.getElementsByTagName('a');
        const self = this;
        for(let a of routerdom){
            a.addEventListener('click',async function(e){
                e.preventDefault();
                const routerIndex = e.target.getAttribute('data-index')
                const current = self.routerlist[routerIndex];
                history.pushState('/',current.name,current.name);
                self.router = current
                
                const pagebox = new pages[self.router.name]();
                let tmpNode = document.createElement('div')
                tmpNode.appendChild(pagebox.render()) 
                let str = tmpNode.innerHTML
                document.getElementById('page').innerHTML = str;
            })
        }
        
        return navdom
    }
}

export {
    nav
}