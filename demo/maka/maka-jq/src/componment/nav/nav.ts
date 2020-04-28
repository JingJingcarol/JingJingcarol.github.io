import { component } from "../../interfaces/componment";
import avatar from "../avatar/avatar";

class nav implements component{
    elem:HTMLElement;
    render(){
        this.elem = $('<nav class="g-nav g-gradient"><h3>PMAKA</h3></nav>')[0];
        const avatarcomp = new avatar();
        $(this.elem).append(avatarcomp.render())
        return this.elem;
    }
}

export default nav;