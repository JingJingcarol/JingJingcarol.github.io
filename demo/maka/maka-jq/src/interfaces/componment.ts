interface component {
    elem:HTMLElement;
    render(data?:any,option?:any):HTMLElement;
    bind?(opt?:any):void;
    data?:any
}

export {
    component
}