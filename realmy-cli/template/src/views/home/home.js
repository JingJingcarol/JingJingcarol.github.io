

class home {
    constructor(){
        this.template = `<h1 class="g-text-center g-padding-nomal">this is home</h1>`
    }
    render(){
        var div = document.createElement("div");
   
        div.innerHTML = this.template;
        return div;
    }
}

export {
    home
}