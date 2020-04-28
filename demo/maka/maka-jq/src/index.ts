// import "font-awesome/css/font-awesome.css";
import "./css/global.css";
import * as comp from "./componment"
import { CardCollection } from "./models/card";
import { ResourceCollection } from "./models/resource";
import { cardResource } from "./interfaces/model";

class App {
    elem:JQuery<HTMLElement>;
    leftPages:comp.sortlist;
    constructor(opt){
        this.elem = opt.el;
        this.render();
    }
    async render(){
        const nav = new comp.nav();
        this.elem.append(nav.render());

        const main = document.createElement('div');
        $(main).addClass('main');
        const left = document.createElement('div');
        $(left).addClass('left');
        const content = document.createElement('div');
        $(content).addClass('content');
        const right = document.createElement('div');
        $(right).addClass('right');
        // 左侧页面
        const pages = new comp.sortlist();
        this.leftPages = pages;
        const pagesdata = new CardCollection()
        await pagesdata.getlist();
        $(left).append(pages.render(pagesdata))
        $(left).append('<div class="list-btns"><button class="g-btn" id="save">保存</button></div>')
        // 右侧资源
        const resources = new ResourceCollection();
        const types = resources.getTypes();
        const tags = types.map((t:string) => {
            return {
                title:t,
                href:`id_${t}`
            }
        })
        $(right).append('<div class="resourcebox"></div>');
        const tagsGroups = new comp.tagGroup();
        const resourceDom = new comp.resourcelist();
        $(right).prepend(tagsGroups.render(tags,{
            toggle:function(current){
                $(right).find('.resourcebox').html(resourceDom.render(resources.getResourceByType(current.title)));
                $(right).find('.resourcebox').scrollTop(0);
            }
        }));
        
        // setting
        const setting = new comp.setting({
            changeAction:function(crdata:cardResource){
                desk.updateOneResource(crdata)
            }
        });
        
        const settingopt = {
            '大小':[{
                name:'宽度',
                key:'width',
                type:'number',
                col:6
            },{
                name:'高度',
                key:'height',
                type:'number',
                col:6
            }],
            '位置':[{
                name:'x',
                key:'position.x',
                type:'number',
                col:6
            },{
                name:'y',
                key:'position.y',
                type:'number',
                col:6
            }],
            '变换':[{
                name:'旋转',
                key:'rotate',
                type:'number',
                col:6
            }],
            '层次':[{
                name:'<span title="上移一层" class="fa fa-arrow-up"></span>',
                key:'z-index-up',
                type:'button',
                col:3,
                action:function(crdata:cardResource){zIndexarrow(crdata,'up')}
            },{
                name:'<span title="下移一层" class="fa fa-arrow-down"></span>',
                key:'z-index-down',
                type:'button',
                col:3,
                action:function(crdata:cardResource){zIndexarrow(crdata,'down')}
            },{
                name:'<span title="置于顶层" class="fa fa-arrow-circle-up"></span>',
                key:'z-index-top',
                type:'button',
                col:3,
                action:function(crdata:cardResource){zIndexarrow(crdata,'top')}
            },{
                name:'<span title="置于底层" class="fa fa-arrow-circle-down"></span>',
                key:'z-index-bottom',
                type:'button',
                col:3,
                action:function(crdata:cardResource){zIndexarrow(crdata,'bottom')}
            }]
        }
        $(content).append(setting.render(settingopt))

        function zIndexarrow(crdata:cardResource,type:string = 'up'){
            desk.zIndexarrow(crdata,type)
        }
        // 中间画布
        const desk = new comp.desktop({pageid:pages.data[0].id,pagesort:pages,settingResAction:function(crdata:cardResource){
            setting.setCurrent(crdata)
        }});
        pages.setDesk(desk)
        $(content).append('<div class="contentbox"><div class="mark"></div></div>')
        $(content).find('.contentbox').append(desk.render());
        
        
        $(main).append([left,content,right]);
        this.elem.append(main);
        this.bind();
    }
    bind(){
        const self = this;
        self.elem.on('click','#save',function(e){
            self.leftPages.save();
        })
    }
}
const app = new App({
    el:$('#root')
});

