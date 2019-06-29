$(function(){
	var setting = {
		successfn:function(ret,fn){
			var isSuccess = false;
			if(ret.score >= ret.order.score){
				fn();
				isSuccess = true;
			}
			return isSuccess;
		}
	}
	happyXXL._init($('#h-index'),setting)
})
//201712
//TODO 消除整行，区域，连坐
//TODO 关卡 地图
var happyXXL = {
	_map:[//地图0：null ；1：随机一般元素 ； 2：随机整行消除元素；3：随机整列消除元素 ； 4：随机区域消除元素；5：连坐元素
			[1,1,1,1,1,1,1,1,1]
			,[1,1,1,1,1,1,1,1,1]
			,[1,1,1,1,1,1,1,1,1]
			,[1,1,1,1,1,1,1,1,1]
			,[1,1,1,1,1,1,1,1,1]
			,[1,1,1,1,1,1,1,1,1]
			,[1,1,1,1,1,1,1,1,1]
			,[1,1,1,1,1,1,1,1,1]
			,[1,1,1,1,1,1,1,1,1]
		]
	,up:0, down:0, left:0, right:0 //用于记录相同元素个数
	,upList:[], downList:[], leftList:[], rightList:[] //用于记录相同元素
	,xiao:[] //用于记录需消除元素
	,elemList:['chicken.png','bear.png','kua.png','fix.png','hai.png']//一般元素内容图片
	,elemLineList:['chicken-line.png','bear-line.png','kua-line.png','fix-line.png','hai-line.png']//消除整行元素图片，20180225
	,elemAreaList:['chicken-area.png','bear-area.png','kua-area.png','fix-area.png','hai-area.png']//消除整行元素图片，20180225
	,score:0//当前得分
	,totalScore:10000//关卡总分
	,totalStep:20//关卡步数
	,step:0//当前步数
	,order:{score:10000}//通关目标，第一关总分达到10000，
	,disappear:'<div class="disappear"><img src="img/disappear3.gif"/></div>'//消除动画
	,disappearlineh:'<div class="disappear disappearlineh"></div>'//消除动画，20180225
	,disappearlinev:'<div class="disappear disappearlinev"></div>'//消除动画，20180225
	,disappearArea:'<div class="disappear disappearArea"><div class="boom"></div><div class="boom"></div></div>'//消除动画，20180225
	,_defaultOption:{
	}
	,getElemImgList: function(){
		return happyXXL.elemList;
	}
	,setElemImgList: function(list){
		happyXXL.elemList = list;
	}
	,getMap:function(){
		return happyXXL._map;
	}
	,setMap:function(maplist){
		happyXXL._map = maplist;
	}
	,getClientWidth:function(){
		return happyXXL.$map.width();
	}
	,_init:function($map,opt){
		happyXXL.$map = $map;
		var options = $.extend(happyXXL._defaultOption,opt) ;
		happyXXL.options = options;
		happyXXL._map = options._map ? options._map : happyXXL._map;
		happyXXL.elemList = options.elemList ? options.elemList : happyXXL.elemList;
		happyXXL.totalScore = options.totalScore ? options.totalScore : happyXXL.totalScore;
		happyXXL.totalStep = options.totalStep ? options.totalStep : happyXXL.totalStep;
		happyXXL.order = options.order ? options.order : happyXXL.order;
		happyXXL.disappear = options.disappear ? options.disappear : happyXXL.disappear;
		happyXXL.drawContainer($map);
		//绘制map
		happyXXL.drawMap();
		//绘制元素
		happyXXL.drawElem();
		happyXXL.drawStep();
		happyXXL.bind();
	}
	,drawContainer:function($map){
		$map.empty();
		$map.append('<div class="order">'
			+	'<img src="img/order.png" alt="" />'
			+ '</div>'
			+ '<div class="step">'
			+	'<img src="img/step.png" alt="" />'
			+   '<span></span>'
			+ '</div>'
			+ '<div class="progress">'
			+	'<div class="progress-con"></div>'
			+	'<div class="star star-emplty"></div>'
			+	'<div class="star star-emplty"></div>'
			+	'<div class="star star-emplty"></div>'
			+ '</div>'
			+ '<div class="score">0</div>'
			+ '<div id="index-map" class="con-map"></div>'
			+ '<div class="setting"><img src="img/setting.png" alt="" /></div>');
	}
	,drawStep:function(){
		happyXXL.$map.find('.step span').html(happyXXL.totalStep - happyXXL.step);
	}
	,drawMap:function(){
		//绘制地图
		happyXXL.$map.find('#index-map').empty();
		var clientWidth = happyXXL.getClientWidth();
		var oneWidth = (clientWidth - 8) / 9;
		happyXXL.$map.find('.con-map').css({'height':clientWidth + 'px'});
		for(var i = 0; i < 9; i++ ){
			for(var j = 0; j < 9; j++){
				if(happyXXL._map[i][j] != 0){
					var mapOne = document.createElement('div');
					$(mapOne).addClass('map_'+ (i+1) + '-' + (j+1) + ' mapOne');
					$(mapOne).attr({
						'data-pos':'map_'+ (i+1) + '-' + (j+1)
					})
					$(mapOne).append('<img src="" alt="" />');
//					var mapOne = '<div class="map_'+ (i+1) + '-' + (j+1) + ' mapOne" data-pos="map_'+ (i+1) + '-' + (j+1) + '">'
//								+ '<img src="" alt="" /></div>'
					$(mapOne).css({'width':oneWidth + 'px',
						'height': oneWidth + 'px',
						'top':oneWidth * i + i + 'px',
						'left':oneWidth * j + j + 'px'});
					$(mapOne).appendTo(happyXXL.$map.find('#index-map'));
				}
			}
		}
	}
	,drawElem:function(){
		//绘制元素
		var elemList = happyXXL.elemList;
		for(var i = 0; i < 9; i++){
			for(var j = 0; j < 9; j++){
				var elemOne = happyXXL.$map.find('.map_' + (i+1) + '-' + (j+1));
				if(elemOne.length == 0){
					continue;
				}
				var radom = Math.floor(Math.random()*elemList.length);
				elemOne.attr('data-value',radom);
				while(happyXXL.getXiaoElem(elemOne)){
					radom = Math.floor(Math.random()*elemList.length);
					elemOne.attr('data-value',radom);
				}
				elemOne.find('img').attr('src','img/' + elemList[radom]);
			}
		}
	}
	,bind:function(){
		//选中元素，交换位置
		happyXXL.$map.on('click','#index-map div',function(){
			if(happyXXL.hasEmptyFn() || happyXXL.hasXiaoFn()){
				return;
			}
			if(happyXXL.$map.find('.mapOne.active').length == 0){
				$(this).addClass('active');
				return;
			}
			if(!happyXXL.isNext($(this))){
				happyXXL.$map.find('.mapOne').removeClass('active');
				$(this).addClass('active');
				return;
			}
			$(this).addClass('active');
			happyXXL.changePos(happyXXL.$map.find('.mapOne.active')[0],happyXXL.$map.find('.mapOne.active')[1]);
			happyXXL.toXiao();
		})
		//关闭dialog
		$('.dialog_shade .close').off('click').on('click',function(){
			$('.dialog_shade').hide();
		})
		//next
		$('.success_dialog .btn_next').off('click').on('click',function(){
			alert('更多内容，敬请期待！！！！！')
		})
	}
	,drawScore:function(){
		//绘制得分
		happyXXL.$map.find('.score').text(happyXXL.score);
		var rescore = happyXXL.score;
		if(happyXXL.score > happyXXL.totalScore){
			rescore = happyXXL.totalScore;
		}
		if(happyXXL.score / happyXXL.totalScore *100 > 30){
			happyXXL.$map.find('.progress .star').eq(0).removeClass('star-emplty').addClass('star-unemplty');
		}
		if(happyXXL.score / happyXXL.totalScore *100 > 60){
			happyXXL.$map.find('.progress .star').eq(1).removeClass('star-emplty').addClass('star-unemplty');
		}
		if(happyXXL.score / happyXXL.totalScore *100 > 90){
			happyXXL.$map.find('.progress .star').eq(2).removeClass('star-emplty').addClass('star-unemplty');
		}
		happyXXL.$map.find('.progress-con').css({'width':rescore / happyXXL.totalScore *100 + '%'});
		happyXXL.checkSuccess();
	}
	,checkSuccess:function(){
	//是否过关
		var isSuccess = false;
		if(happyXXL.options.successfn){
			isSuccess = happyXXL.options.successfn({score:happyXXL.score,order:happyXXL.order},happyXXL.toSuccess)
		}else{
			//通关目标，第一关总分达到10000，
			if(happyXXL.score >= happyXXL.order.score){
				
				happyXXL.toSuccess();
				isSuccess = true;
			}
		}
		return isSuccess;
	}
	,toSuccess:function(){
		$('.success_dialog').show();
		var starNum = happyXXL.$map.find('.progress .star.star-unemplty').length;
		if(starNum < 3){
			$('.success_dialog .show_start img').eq(starNum).prevAll().show();
		}else{
			$('.success_dialog .show_start img').show();
		}
	}
	,toXiao:function(){
		var hasXiao = false;
		happyXXL.step++;
		var clientWidth = happyXXL.getClientWidth();
		var oneWidth = (clientWidth - 8) / 9;
		var activeElem = happyXXL.$map.find('.mapOne.active');
		activeElem.each(function(){
			if(happyXXL.getXiaoElem($(this)))
				hasXiao = true;
			for(var i = 0; i < happyXXL.xiao.length; i++){
				
				var xiaoPos = happyXXL.xiao[i].attr('data-pos');
				var xiaoX = xiaoPos.substr(4).split('-')[0];
				var xiaoY = xiaoPos.substr(4).split('-')[1];
				var xiaoValue = happyXXL.xiao[i].attr('data-value');
				var diappearBox = $(happyXXL.disappear).clone(true);
				if(xiaoValue.split('-')[1]){
					if(xiaoValue.split('-')[1] == 'l'){
						if(xiaoValue.split('-')[2] == 'h'){
							diappearBox = $(happyXXL.disappearlineh).clone(true);
							diappearBox.css({'top':oneWidth * (xiaoX-1) + (xiaoX - 1) - 10 + 'px'});
							happyXXL.toxiaoALLLine(xiaoX,'h')
						}else if(xiaoValue.split('-')[2] == 'v'){
							diappearBox = $(happyXXL.disappearlinev).clone(true);
							diappearBox.css({'left':oneWidth * (xiaoY-1) + (xiaoY - 1) - 10 + 'px'});
							happyXXL.toxiaoALLLine(xiaoY,'v')
						}
						happyXXL.score += 300;
					}else if(xiaoValue.split('-')[1] == 'a'){
						diappearBox = $(happyXXL.disappearArea).clone(true);
						diappearBox.css({'top':oneWidth * (xiaoX-1) + (xiaoX - 1) - oneWidth*2 + 'px',
							'left':oneWidth * (xiaoY-1) + (xiaoY - 1) - oneWidth*2 + 'px'});
						happyXXL.toxiaoArea(xiaoX,xiaoY);
						happyXXL.score += 500;
					}
				}else{
					diappearBox.css({'width':oneWidth + 20 + 'px',
						'height': oneWidth + 20 + 'px',
						'top':oneWidth * (xiaoX-1) + (xiaoX - 1) - 10 + 'px',
						'left':oneWidth * (xiaoY-1) + (xiaoY - 1) - 10 + 'px'});
					happyXXL.score += 100;
				}
				happyXXL.xiao[i].remove();
				diappearBox.appendTo(happyXXL.$map.find('.con-map'));
				
				
				happyXXL.drawScore();
			}
			if(happyXXL.xiao.length > 3){
				//整行消除+区域消除  20180225
				var xiaoacPos = $(this).attr('data-pos');
				var xiaoacX = xiaoacPos.substr(4).split('-')[0];
				var xiaoacY = xiaoacPos.substr(4).split('-')[1];
				var xiaoacValue = $(this).attr('data-value');
				var effElem = document.createElement('div');
				$(effElem).addClass('mapOne map_' + xiaoacX + '-' + xiaoacY);
				$(effElem).attr({
					'data-pos':'map_'+ xiaoacX + '-' + xiaoacY
				})
				$(effElem).append('<img src="" alt="" />');
				$(effElem).css({'width':oneWidth + 'px',
					'height': oneWidth+'px',
					'top':oneWidth * (xiaoacX-1) + (xiaoacX - 1) + 'px',
					'left':oneWidth * (xiaoacY-1) + (xiaoacY - 1) + 'px'});
				$(effElem).appendTo(happyXXL.$map.find('.con-map'));
				if(happyXXL.up + happyXXL.down + happyXXL.left + happyXXL.right > 3 ){
					$(effElem).attr({'data-value':xiaoacValue + '-a'});
					$(effElem).find('img').attr('src','img/' + happyXXL.elemAreaList[parseInt(xiaoacValue)]);
				}else if(happyXXL.up + happyXXL.down > 2 ){
					$(effElem).attr({'data-value':xiaoacValue + '-l-h'});
					$(effElem).find('img').attr('src','img/' + happyXXL.elemLineList[parseInt(xiaoacValue)]);
				}else if(happyXXL.left + happyXXL.right > 2){
					$(effElem).attr({'data-value':xiaoacValue + '-l-v'});
					$(effElem).find('img').attr('src','img/' + happyXXL.elemLineList[parseInt(xiaoacValue)]);
				}
			}
		})
	
		happyXXL.afterXiaoTODown();
		
		setTimeout(function(){
			happyXXL.$map.find('.disappear').remove();
			happyXXL.toXiaoAll();
		},1000)
		
		if(!hasXiao){
			happyXXL.step--;
			setTimeout(function(){
				happyXXL.changePos(activeElem[0],activeElem[1]);
				activeElem.removeClass('active');
			},1000)
			return;
		}
		activeElem.removeClass('active');
		happyXXL.drawStep();
	}
	,toxiaoALLLine:function(k,d){
		for(var i = 1;i < 10;i++){
			if(d == 'h'){
				happyXXL.$map.find('.map_' + k + '-' +i).remove();
			}else if(d == 'v'){
				happyXXL.$map.find('.map_' + i + '-' + k).remove();
			}
		}
		
	}
	,toxiaoArea:function(x,y){
		for(var i = parseInt(x)-2; i < parseInt(x) + 2;i++){
			for(var j = parseInt(x)-2; j < parseInt(x) + 2;j++){
				happyXXL.$map.find('.map_' + i + '-' + j).remove();
			}
		}
	}
	,toXiaoAll:function(){
		//消除所有可消除元素
		var clientWidth = happyXXL.getClientWidth();
		var oneWidth = (clientWidth - 8) / 9;
		for(var i = 0; i < 9; i++){
			for(var j = 0; j < 9; j++){
				if(happyXXL.getXiaoElem(happyXXL.$map.find('.map_' + (i+1) + '-' + (j+1)))){
					for(var k = 0; k< happyXXL.xiao.length; k++){
						var xiaoPos = happyXXL.xiao[k].attr('data-pos');
						var xiaoX = xiaoPos.substr(4).split('-')[0];
						var xiaoY = xiaoPos.substr(4).split('-')[1];
						var xiaoValue = happyXXL.xiao[k].attr('data-value');
						var diappearBox = $(happyXXL.disappear).clone(true);
						if(xiaoValue.split('-')[1]){
							if(xiaoValue.split('-')[1] == 'l'){
								if(xiaoValue.split('-')[2] == 'h'){
									diappearBox = $(happyXXL.disappearlineh).clone(true);
									diappearBox.css({'top':oneWidth * (xiaoX-1) + (xiaoX - 1) - 10 + 'px'});
									happyXXL.toxiaoALLLine(xiaoX,'h')
								}else if(xiaoValue.split('-')[2] == 'v'){
									diappearBox = $(happyXXL.disappearlinev).clone(true);
									diappearBox.css({'left':oneWidth * (xiaoY-1) + (xiaoY - 1) - 10 + 'px'});
									happyXXL.toxiaoALLLine(xiaoY,'v')
								}
								happyXXL.score += 300;
							}else if(xiaoValue.split('-')[1] == 'a'){
								diappearBox = $(happyXXL.disappearArea).clone(true);
								diappearBox.css({'top':oneWidth * (xiaoX-1) + (xiaoX - 1) - oneWidth*2 + 'px',
									'left':oneWidth * (xiaoY-1) + (xiaoY - 1) - oneWidth*2 + 'px'});
								happyXXL.toxiaoArea(xiaoX,xiaoY);
								happyXXL.score += 500;
							}
						}else{
							diappearBox.css({'width':oneWidth + 20 + 'px',
								'height': oneWidth + 20 + 'px',
								'top':oneWidth * (xiaoX-1) + (xiaoX - 1) - 10 + 'px',
								'left':oneWidth * (xiaoY-1) + (xiaoY - 1) - 10 + 'px'});
							happyXXL.score += 100;
						}
						happyXXL.xiao[k].remove();
						diappearBox.appendTo(happyXXL.$map.find('.con-map'));
						
						
						happyXXL.drawScore();
					}
					
					happyXXL.afterXiaoTODown();
				}
			}
		}
		
		happyXXL.addNewElem();
		setTimeout(function(){
			happyXXL.$map.find('.disappear').remove();
			if(happyXXL.hasXiaoFn()){
				
				happyXXL.toXiaoAll()
			}else{
				if(happyXXL.step >= happyXXL.totalStep){
					//game over
					if(!happyXXL.checkSuccess()){
						alert('挑战失败！')
					}
					
				}
			}
		},1000)
	}
	,addNewElem:function(){
		//添加新的元素
		var clientWidth = happyXXL.getClientWidth();
		var oneWidth = (clientWidth - 8) / 9;
		var last = happyXXL.getXiaolastLine(true);
		var elemList = happyXXL.elemList;
		for(var i = 0; i < last.length; i++){
			for(var j = last[i].x; j > 0; j--){
				var elem = document.createElement('div');
				$(elem).addClass('mapOne map_' + j + '-' +last[i].y);
				var img = document.createElement('img');
				$(elem).append(img);
				$(elem).attr('data-pos','map_' + j + '-' + last[i].y)
				var radom = Math.floor(Math.random()*elemList.length);
				$(elem).attr('data-value',radom);
				while(happyXXL.getXiaoElem($(elem))){
					radom = Math.floor(Math.random()*elemList.length);
					$(elem).attr('data-value',radom);
				}
				$(elem).find('img').attr('src','img/' + elemList[radom]);
				$(elem).css({'width':oneWidth + 'px',
					'height': oneWidth + 'px',
					'top':oneWidth * (j-last[i].x-1) + j-last[i].x-1 + 'px',
					'left':oneWidth * (last[i].y-1) + last[i].y-1 + 'px'});
				$(elem).appendTo(happyXXL.$map.find('.con-map'));
				$(elem).animate({'top':oneWidth * (j-1) + j-1 + 'px'},1000);
			}
		}
	}
	,afterXiaoTODown:function(){
		//消除元素后上方元素下移
		var first = happyXXL.getXiaoFirstLine();
		var last = happyXXL.getXiaolastLine();
		console.log(JSON.stringify(first) + '------' + JSON.stringify(last))
		for(var i = 0; i < first.length;i++){
			if(first[i].x == 1){
				
			}else{
				var lastone = happyXXL.getlastByY(last,first[i].y,first[i].x);
				console.log(first[i].y+'---'+first[i].x + '----lastone===='+JSON.stringify(lastone))
				for(var j = first[i].x - 1; j > 0; j--){
					var downOne = happyXXL.$map.find('.map_' + j + '-' + first[i].y)
					if(downOne.length > 0){
						happyXXL.makeElemToPos(downOne,lastone.x - first[i].x + j+1,first[i].y)
					}
					
				}
			}
			
		}
	}
	,makeElemToPos:function($e,x,y){
		var clientWidth = happyXXL.getClientWidth();
		var oneWidth = (clientWidth - 8) / 9;
		var oldclass = $e.attr('data-pos');
		$e.removeClass(oldclass).addClass('map_' + x + '-' + y);
		$e.attr('data-pos','map_' + x + '-' + y);
		$e.css({'top':oneWidth * (x-1) + (x-1) + 'px','left':oneWidth * (y-1) + (y-1) + 'px'})

	}
	,getlastByY:function(last,y,x){
		//得到当前列最下方空缺元素位置
		var ret = null;
		for(var i = 0; i < last.length; i++){
			if(last[i].y == y)
				if((!ret && last[i].x >= x) || (ret && last[i].x >= x && last[i].x - x <= ret.x - x)){
					ret = last[i];
				}
				
		}
		return ret;
	}
	,getXiaoEmptyELem:function(){
		var ret = [];
		for(var i = 0; i < 9; i++){
			for(var j = 0; j < 9; j++){
				if(happyXXL.$map.find('.map_' + (j+1) + '-' + (i+1)).length == 0 
					|| happyXXL.$map.find('.map_' + (j+1) + '-' + (i+1)).attr('data-xiao')){
						ret.push({x:j+1,y:i+1});
					}
			}
		}
		return ret;
	}
	,getXiaoFirstLine:function(){
		//获取消除元素中位于最上方的所有元素
		var ret = [];
		for(var i = 0; i < 9; i++){
			for(var j = 0; j < 9; j++){
				if((happyXXL.$map.find('.map_' + (j+1) + '-' + (i+1)).length == 0 
					|| happyXXL.$map.find('.map_' + (j+1) + '-' + (i+1)).attr('data-xiao'))
				&& happyXXL.$map.find('.map_' + j + '-' + (i+1)).length > 0 
					){
					ret.push({x:j+1,y:i+1});
//					break;
				}
				
			}
		}
		return ret;
	}
	,getXiaolastLine:function(isadd){
		//获取消除元素中位于最下方的所有元素
		var ret = [];
		
		for(var i = 0; i < 9; i++){
			for(var j = 0; j < 9; j++){
				var checkUP = isadd ? true : happyXXL.hasElemONup(j+1,i+1);
				if((happyXXL.$map.find('.map_' + (j+1) + '-' + (i+1)).length == 0 
					|| happyXXL.$map.find('.map_' + (j+1) + '-' + (i+1)).attr('data-xiao'))
				&& ((!happyXXL.$map.find('.map_' + (j+2) + '-' + (i+1)).attr('data-xiao') 
						&& happyXXL.$map.find('.map_' + (j+2) + '-' + (i+1)).length == 1)
					|| j == 8)
				&& checkUP){
					ret.push({x:j+1,y:i+1});
//					break;
				}
				
			}
		}
		return ret;
	}
	,hasElemONup:function(x,y){
		var hasElem = false;
		for(var i = 0; i < x; i++){
			if(happyXXL.$map.find('.map_' + (i+1) + '-' + y).length > 0)
				hasElem = true
		}
		return hasElem;
	}
	,getXiaoElem:function($e){
		//判断是否可消除

		if($e.length == 0) return;
		happyXXL.up = 0; happyXXL.down = 0; happyXXL.left = 0; happyXXL.right = 0;//用于记录相同元素个数
		happyXXL.upList = [];happyXXL.downList = [];happyXXL.leftList = [];happyXXL.rightList = [];
		happyXXL.xiao = [];
		happyXXL.isXiao($e);
		var canXiao = false;
		if(happyXXL.up + happyXXL.down > 1){
			happyXXL.xiao.push($e);
			for(var i = 0; i < happyXXL.upList.length; i++){
				happyXXL.xiao.push(happyXXL.upList[i])
			}
			for(var i = 0; i < happyXXL.downList.length; i++){
				happyXXL.xiao.push(happyXXL.downList[i])
			}
			canXiao = true;
		}
		if(happyXXL.left + happyXXL.right > 1){
			happyXXL.xiao.push($e);
			for(var i = 0; i < happyXXL.leftList.length; i++){
				happyXXL.xiao.push(happyXXL.leftList[i])
			}
			for(var i = 0; i < happyXXL.rightList.length; i++){
				happyXXL.xiao.push(happyXXL.rightList[i])
			}
			canXiao = true;
		}
		return canXiao;
	}
	,changePos:function($e1,$e2){
		//交换元素位置
		var class1 = $($e1).attr('data-pos');
		var class2 = $($e2).attr('data-pos');
		var pos1 = $($e1).attr('style');
		var pos2 = $($e2).attr('style');
		$($e1).removeClass(class1).addClass(class2);
		$($e2).removeClass(class2).addClass(class1);
		$($e1).attr('style', pos2);
		$($e2).attr('style', pos1);
		$($e1).attr('data-pos', class2);
		$($e2).attr('data-pos', class1);
	}
	,hasEmptyFn:function(){
		var hasEmpty = false;
		for(var i = 0; i < 9; i++){
			for(var j = 0; j < 9; j++){
				if(happyXXL.$map.find('.map_' + (i+1) + '-' + (j+1)).length == 0){
					hasEmpty = true;
				}
			}
		}
		return hasEmpty;
	}
	,hasXiaoFn:function(){
		//判断是否有可消除元素
		var hasXiao = false;
		for(var i = 0; i < 9; i++){
			for(var j = 0; j < 9; j++){
				if(happyXXL.$map.find('.map_' + (i+1) + '-' + (j+1)).length == 0){
					continue;
				}
				if(happyXXL.getXiaoElem(happyXXL.$map.find('.map_' + (i+1) + '-' + (j+1)))){
					hasXiao = true;
				}
			}
		}
		return hasXiao;
	}
	,isXiao:function($e,dir){
		var obj = happyXXL.getElemObj($e);
		var val = obj.val;
		var posX = obj.x;
		var posY = obj.y;
		
		if(happyXXL.isUp($e) && (!dir || dir == 'up')){
			happyXXL.up++;
			var xiaoOne = happyXXL.$map.find('.map_' + (posX - 1) + '-' + posY);
			happyXXL.upList.push(xiaoOne);
			happyXXL.isXiao(xiaoOne,'up');
		} 
		if(happyXXL.isDown($e) && (!dir || dir == 'down')){
			happyXXL.down++;
			var xiaoOne = happyXXL.$map.find('.map_' + (posX + 1) + '-' + posY);
			happyXXL.downList.push(xiaoOne);
			happyXXL.isXiao(xiaoOne,'down');
		} 
		if(happyXXL.isLeft($e) && (!dir || dir == 'left')){
			happyXXL.left++;
			var xiaoOne = happyXXL.$map.find('.map_' + posX + '-' + (posY - 1));
			happyXXL.leftList.push(xiaoOne);
			happyXXL.isXiao(xiaoOne,'left');
		} 
		if(happyXXL.isRight($e) && (!dir || dir == 'right')){
			happyXXL.right++;
			var xiaoOne = happyXXL.$map.find('.map_' + posX + '-' + (posY + 1));
			happyXXL.rightList.push(xiaoOne);
			happyXXL.isXiao(xiaoOne,'right');
		} 
	}
	,isNext:function($e){//判断元素位置是否相邻
		var obj = happyXXL.getElemObj($e);
		var posX = obj.x;
		var posY = obj.y;
		var lastobj = happyXXL.getElemObj(happyXXL.$map.find('.mapOne.active'));
		var lastposX = lastobj.x;
		var lastposY = lastobj.y;
		if((Math.abs(posX - lastposX) == 1 && posY == lastposY)
		|| (Math.abs(posY - lastposY) == 1 && posX == lastposX)) return true;
		return false;
	}
	,isUp:function($e){
		//判断当前元素与上方元素是否一致
		var obj = happyXXL.getElemObj($e);
		var val = obj.val.split('-')[0];
		var posX = obj.x;
		var posY = obj.y;
		if(posX == '1') return false;
		var upVal = happyXXL.$map.find('.map_' + (posX - 1) + '-' + posY).attr('data-value');
		if(!upVal) return false;
		
		if(val == upVal.split('-')[0]) return true;
		return false;
			
	}
	,isDown:function($e){
		//判断当前元素与下方元素是否一致
		var obj = happyXXL.getElemObj($e);
		var val = obj.val.split('-')[0];
		var posX = obj.x;
		var posY = obj.y;
		if(posX == '9') return false;
		var upVal = happyXXL.$map.find('.map_' + (posX + 1) + '-' + posY).attr('data-value');
		if(!upVal) return false;
		
		if(val == upVal.split('-')[0]) return true;
		return false;
			
	}
	,isLeft:function($e){
		//判断当前元素与左方元素是否一致
		var obj = happyXXL.getElemObj($e);
		var val = obj.val.split('-')[0];
		var posX = obj.x;
		var posY = obj.y;
		if(posY == '1') return false;
		var upVal = happyXXL.$map.find('.map_' + posX + '-' + (posY - 1)).attr('data-value');
		if(!upVal) return false;
		if(val == upVal.split('-')[0]) return true;
		return false;
			
	}
	,isRight:function($e){
		//判断当前元素与右方元素是否一致
		var obj = happyXXL.getElemObj($e);
		var val = obj.val.split('-')[0];
		var posX = obj.x;
		var posY = obj.y;
		if(posY == '9') return false;
		var upVal = happyXXL.$map.find('.map_' + posX + '-' + (posY + 1)).attr('data-value');
		if(!upVal) return false;
		if(val == upVal.split('-')[0]) return true;
		return false;
			
	}
	,getElemObj:function($e){
		var val = $e.attr('data-value');
		var pos = $e.attr('data-pos').split('_')[1];
		var posX = pos.split('-')[0];
		var posY = pos.split('-')[1];
		return {
			val : val,
			x   : parseInt(posX),
			y   : parseInt(posY)
		}
	}
}
