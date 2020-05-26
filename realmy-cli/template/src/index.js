const path = require("path");

import style from "./css/global.css";
import { nav } from "./components/nav";
console.log('hello world')
const navdom = new nav([{
    url:'/',
    name:'home',
},
{
    url:'/logon',
    name:'logon',
}])
document.getElementById('root').appendChild(navdom.render());

const pagebox = document.createElement('div');
pagebox.id = 'page';
pagebox.innerHTML = '<h1 class="g-text-center g-padding-nomal">welcome</h1>'
document.getElementById('root').appendChild(pagebox);

