class game {
    constructor(id){
        this.size = 4;
        this.el = document.getElementById(id);
        this.cellwidth = this.el.clientWidth/this.size;
        this.cells = new Array(this.size*this.size).fill(null);
        this.creatCell();
        this.creatCell();
        this.drawtool();
        this.bind();
        // this.test();
        
    }
    creatCell(p){
        const emptyCell = this.getEmptyCell();
        const pos = p || emptyCell[Math.floor(Math.random()*emptyCell.length)];
        const onecell = new cell(this.formatPos(pos),this.cellwidth);
        this.el.appendChild(onecell.cell);
        this.cells[pos] = onecell
        console.log('create',pos)
    }
    drawtool(){
        const tool = document.createElement('div');
        tool.className = 'toolbox';
        this.el.appendChild(tool);
        const up = document.createElement('div');
        up.innerHTML = 'W';
        up.className = 'tool';
        const left = document.createElement('div');
        left.innerHTML = 'A';
        left.className = 'tool';
        const down = document.createElement('div');
        down.innerHTML = 'S';
        down.className = 'tool';
        const right = document.createElement('div');
        right.innerHTML = 'D';
        right.className = 'tool';
        tool.appendChild(up);
        tool.appendChild(left);
        tool.appendChild(down);
        tool.appendChild(right);
    }
    bind(){
        let self = this;
        self.pageX = null;
        self.pageY = null;
        this.el.addEventListener('mousedown',function(e){
            self.pageX = e.pageX;
            self.pageY = e.pageY;
        })
        this.el.addEventListener('mouseup',function(e){
            if(!self.pageX){
                return;
            }
            const endX = e.pageX;
            const endY = e.pageY;
            const moveX = Math.abs(endX - self.pageX);
            const moveY = Math.abs(endY - self.pageY)
            if(moveX <= 20 && moveY <= 20){
                return;
            }
            let hasturn = false;
            if(moveX > moveY){
                hasturn = self.turn(endX > self.pageX);
            }else{
                hasturn = self.turn(endY > self.pageY,true);
            }
            self.pageX = null;
            self.pageY = null;
            if(hasturn){
                self.drawall();
                self.creatCell();
            }
            
        })
        document.getElementsByClassName('tool')[0].addEventListener('click',function(){
            const hasturn = self.turn(false,true)
            if(hasturn){
                self.drawall();
                self.creatCell();
            }
        })
        document.getElementsByClassName('tool')[1].addEventListener('click',function(){
            const hasturn = self.turn(false)
            if(hasturn){
                self.drawall();
                self.creatCell();
            }
        })
        document.getElementsByClassName('tool')[2].addEventListener('click',function(){
            const hasturn = self.turn(true,true)
            if(hasturn){
                self.drawall();
                self.creatCell();
            }
        })
        document.getElementsByClassName('tool')[3].addEventListener('click',function(){
            const hasturn = self.turn(true)
            if(hasturn){
                self.drawall();
                self.creatCell();
            }
        })
    }
    test(){
        this.creatCell(5);
        // this.creatCell(1);
        this.creatCell(9);
        this.creatCell(13)
    }
    getEmptyCell(){
        let ret = [];
        for(let i = 0;i < this.size;i++){
            for(let j = 0; j < this.size;j++){
                const pos = i*this.size + j;
                if(!this.cells[pos]){
                    ret.push(pos);
                }
            }
        }
        return ret;
    }
    formatPos(pos){
        return [pos%this.size,Math.floor(pos/this.size)];
    }
    drawall(){
        for(let i = 0,len = this.size*this.size;i < len;i++){
            if(this.cells[i]){
                this.cells[i].draw();
            }
        }
    }
    turn(isright,istop){
        let hasturn = false;
        const start = isright ? this.size - 1 : 0;
        const end = isright ? -1 : this.size;
        const dir = isright ? -1 : 1;
        const sizeX = istop ? 1 : this.size;
        const sizeY = istop ? this.size : 1;
        for(let i = 0;i < this.size;i++){
            for(let y = start; (isright && y > end) || y < end;y = y + dir){
                const posStart = i*sizeX + y*sizeY;
                
                
                for(let j = 1; j < Math.abs(end - y); j++){
                    const pos = posStart + dir*j*sizeY;
                    const onecell = this.cells[pos];
                    if(onecell){
                        const startCell = this.cells[posStart];
                        let startVal = null;
                        if(startCell){
                            startVal = startCell.getVal();
                        }
                        const endVal = onecell.getVal();
                        if(startVal == endVal || !startCell){

                            
                            onecell.setPos(this.formatPos(posStart));
                            
                            this.cells[posStart] = onecell;
                            this.cells[pos] = null;
                            hasturn = true;
                            console.log(posStart,pos,startVal,endVal);
                            if(startVal == endVal){
                                onecell.setVal(startVal + endVal );
                                startCell.destroyed();
                                break
                            }
                        }
                        if(startCell && startVal != endVal){
                            break
                        }
                        
                        // 
                    }
                }
                
            }
            
        }
        return hasturn;
    }
}

class cell {
    constructor(pos,cellwidth){
        // this.pos = pos;
        this.cellwidth = cellwidth;
        this.cell = document.createElement('div');
        this.cell.className = 'cell';
        
        this.draw(pos,(1 + Math.floor(Math.random()*2))*2);

        // return this.cell;
    }
    draw(pos,val){
        if(pos){
            this.setPos(pos)
        }
        if(val){
            this.setVal(val);
        }
        this.cell.style.left = this.pos[0]*this.cellwidth + 2 + 'px'; 
        this.cell.style.top = this.pos[1]*this.cellwidth + 2 + 'px';
        this.cell.style.fontSize = (this.cellwidth / 2 - this.val/100)   + 'px';
        this.cell.style.background = `rgba(0, 240, 253,${1 - 0.5/Math.log(this.val)})`;
        // this.cell.style.background = `hsl(${0.5/Math.log(this.val)},${100 - 0.5/Math.log(this.val)}%,${0.5/Math.log(this.val)}%)`;
        this.cell.innerHTML = this.val;
    }
    getPos(){
        return this.pos;
    }
    setPos(pos){
        this.pos = pos;
    }
    getVal(){
        return this.val;
    }
    setVal(val){
        this.val = val;
    }
    destroyed() {
        const onecell = this.cell;
        onecell.style.opacity = 0;
        setTimeout(function(){
            onecell.remove()
        },500)
    }
}
new game('container')
// export default game;
