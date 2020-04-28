const fs = require('fs');
const path = require('path');

let list = [];
let respath = path.join(__dirname,'assets/img/resource/');
fs.readdir(respath,(err,dirs) => {
    dirs.forEach((d) => {
        if(d == '.DS_Store'){
            return;
        }
        let type = d;
        const files = fs.readdirSync(path.join(respath,d));
        
        files.forEach((f) => {
            if(/\.(jpg|png|gif|jpeg)$/.test(f) && f.indexOf('_300') == -1){
                list.push({
                    id:Math.random().toString(36).substr(2),
                    name:f,
                    type
                })
            }    
        })
            
    
    })
    fs.writeFileSync(path.join(__dirname,'models/resourceList.json'),JSON.stringify({list},null,2))
})