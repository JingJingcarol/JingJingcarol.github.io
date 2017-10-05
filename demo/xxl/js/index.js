$(function(){
	//绘制map
	drawMap();
	//绘制元素
	drawElem();
	//选中元素，交换位置
	$('#index-map').on('click','div',function(){
		if(hasEmptyFn() || hasXiaoFn()){
			return;
		}
		if($('.mapOne.active').length == 0){
			$(this).addClass('active');
			return;
		}
		if(!isNext($(this))){
			$('.mapOne').removeClass('active');
			$(this).addClass('active');
			return;
		}
		$(this).addClass('active');
		changePos($('.mapOne.active')[0],$('.mapOne.active')[1]);
		toXiao();
	})
	//关闭dialog
	$('.dialog_shade .close').off('click').on('click',function(){
		$('.dialog_shade').hide();
	})
	//next
	$('.success_dialog .btn_next').off('click').on('click',function(){
		alert('更多内容，敬请期待！！！！！')
	})
})
var clientWidth = getClientWidth();
var oneWidth = (clientWidth - 8) / 9;
var up = down = left = right = 0;//用于记录相同元素个数
var upList = [], downList = [], leftList = [], rightList = [];//用于记录相同元素
var xiao = [];//用于记录需消除元素
var elemList = ['chicken.png','bear.png','kua.png','fix.png','hai.png'];//元素内容图片
var score = 0;
var totalScore = 10000;
var totalStep = 20;
var step = 0;
var order = {score:10000}//通关目标，第一关总分达到10000，
var disappear = '<div class="disappear"><img src="img/disappear3.gif"/></div>';
function drawElem(){
	
	for(var i = 0; i < 9; i++){
		for(var j = 0; j < 9; j++){
			var radom = Math.floor(Math.random()*elemList.length);
			$('.map_' + (i+1) + '-' + (j+1)).attr('data-value',radom);
			while(getXiaoElem($('.map_' + (i+1) + '-' + (j+1)))){
				radom = Math.floor(Math.random()*elemList.length);
				$('.map_' + (i+1) + '-' + (j+1)).attr('data-value',radom);
			}
			$('.map_' + (i+1) + '-' + (j+1) + ' img').attr('src','img/' + elemList[radom]);
		}
	}
	
}
function drawMap(){
	var clientWidth = getClientWidth();
	var oneWidth = (clientWidth - 8) / 9;
	$('.con-map').css({'height':clientWidth + 'px'});
	for(var i = 0; i < 9; i++ ){
		for(var j = 0; j < 9; j++){
			$('.map_' + (i+1) + '-' + (j+1)).css({'width':oneWidth + 'px',
				'height': oneWidth + 'px',
				'top':oneWidth * i + i + 'px',
				'left':oneWidth * j + j + 'px'});
			$('.map_' + (i+1) + '-' + (j+1)).attr('data-pos','map_' + (i+1) + '-' + (j+1));
		}
	}
}
//绘制得分
function drawScore(){
	$('.score').text(score);
	var rescore = score;
	if(score > totalScore){
		rescore = totalScore;
	}
	if(score / totalScore *100 > 30){
		$('.progress .star').eq(0).removeClass('star-emplty').addClass('star-unemplty');
	}
	if(score / totalScore *100 > 60){
		$('.progress .star').eq(1).removeClass('star-emplty').addClass('star-unemplty');
	}
	if(score / totalScore *100 > 90){
		$('.progress .star').eq(2).removeClass('star-emplty').addClass('star-unemplty');
	}
	$('.progress-con').css({'width':rescore / totalScore *100 + '%'});
	checkSuccess();
}
//是否过关
function checkSuccess(){
	//通关目标，第一关总分达到10000，
	if(score >= order.score){
		$('.success_dialog').show();
		var starNum = $('.progress .star.star-unemplty').length;
		if(starNum < 3){
			$('.success_dialog .show_start img').eq(starNum).prevAll().show();
		}else{
			$('.success_dialog .show_start img').show();
		}
		
	}
}
//消除元素
function toXiao(){
	var hasXiao = false;
	step++;
	var clientWidth = getClientWidth();
	var oneWidth = (clientWidth - 8) / 9;
	$('.mapOne.active').each(function(){
		if(getXiaoElem($(this)))
			hasXiao = true;
		for(var i = 0; i < xiao.length; i++){
			xiao[i].remove();
			var xiaoPos = xiao[i].attr('data-pos');
			var xiaoX = xiaoPos.substr(4).split('-')[0];
			var xiaoY = xiaoPos.substr(4).split('-')[1];
			var diappearBox = $(disappear).clone(true);
			diappearBox.css({'width':oneWidth + 20 + 'px',
				'height': oneWidth + 20 + 'px',
				'top':oneWidth * (xiaoX-1) + (xiaoX - 1) - 10 + 'px',
				'left':oneWidth * (xiaoY-1) + (xiaoY - 1) - 10 + 'px'});
			diappearBox.appendTo($('.con-map'));
			score += 100;
			drawScore();
//			xiao[i].removeAttr('data-value');
//			xiao[i].attr('data-xiao',true);
//			setTimeout(function(){
//				$('.mapOne:hidden').remove();
//				
//			},3000)
			
		}
	})

	afterXiaoTODown();
//	addNewElem();
	setTimeout(function(){
		$('.disappear').remove();
		toXiaoAll();
	},1000)
	
	
	if(!hasXiao){
		step--;
		setTimeout(function(){
			changePos($('.mapOne.active')[0],$('.mapOne.active')[1]);
			$('.mapOne.active').removeClass('active');
		},1000)
		return;
	}
	$('.mapOne.active').removeClass('active');
}
//消除元素后上方元素下移
function afterXiaoTODown(){
	var first = getXiaoFirstLine();
	var last = getXiaolastLine();
	for(var i = 0; i < first.length;i++){
		if(first[i].x == 1){
			
		}else{
			var lastone = getlastByY(last,first[i].y);
			for(var j = first[i].x - 1; j > 0; j--){
				if($('.map_' + j + '-' + first[i].y).length > 0){
					makeElemToPos($('.map_' + j + '-' + first[i].y),lastone.x - first[i].x + j+1,first[i].y)
				}
				
			}
		}
		
	}
}
function makeElemToPos($e,x,y){
	var clientWidth = getClientWidth();
	var oneWidth = (clientWidth - 8) / 9;
	var oldclass = $e.attr('data-pos');
	$e.removeClass(oldclass).addClass('map_' + x + '-' + y);
	$e.attr('data-pos','map_' + x + '-' + y);
	$e.css({'top':oneWidth * (x-1) + (x-1) + 'px','left':oneWidth * (y-1) + (y-1) + 'px'})
}
//得到当前列最下方空缺元素位置
function getlastByY(last,y){
	var ret = null;
	for(var i = 0; i < last.length; i++){
		if(last[i].y == y)
			ret = last[i];
	}
	return ret;
}
//添加新的元素
function addNewElem(){
	var clientWidth = getClientWidth();
	var oneWidth = (clientWidth - 8) / 9;
	var last = getXiaolastLine(true);
	for(var i = 0; i < last.length; i++){
		for(var j = last[i].x; j > 0; j--){
			var elem = document.createElement('div');
			$(elem).addClass('mapOne map_' + j + '-' +last[i].y);
			var img = document.createElement('img');
			$(elem).append(img);
			$(elem).attr('data-pos','map_' + j + '-' + last[i].y)
			var radom = Math.floor(Math.random()*elemList.length);
			$(elem).attr('data-value',radom);
			while(getXiaoElem($(elem))){
				radom = Math.floor(Math.random()*elemList.length);
				$(elem).attr('data-value',radom);
			}
			$(elem).find('img').attr('src','img/' + elemList[radom]);
			$(elem).css({'width':oneWidth + 'px',
				'height': oneWidth + 'px',
				'top':oneWidth * (j-last[i].x-1) + j-last[i].x-1 + 'px',
				'left':oneWidth * (last[i].y-1) + last[i].y-1 + 'px'});
			$(elem).appendTo($('.con-map'));
			$(elem).animate({'top':oneWidth * (j-1) + j-1 + 'px'},1000);
		}
	}
}
//消除所有可消除元素
function toXiaoAll(){
	for(var i = 0; i < 9; i++){
		for(var j = 0; j < 9; j++){
			if(getXiaoElem($('.map_' + (i+1) + '-' + (j+1)))){
				for(var k = 0; k< xiao.length; k++){
					xiao[k].remove();
					var xiaoPos = xiao[k].attr('data-pos');
					var xiaoX = xiaoPos.substr(4).split('-')[0];
					var xiaoY = xiaoPos.substr(4).split('-')[1];
					var diappearBox = $(disappear).clone(true);
					diappearBox.css({'width':oneWidth + 20 + 'px',
						'height': oneWidth + 20 + 'px',
						'top':oneWidth * (xiaoX-1) + (xiaoX - 1) - 10 + 'px',
						'left':oneWidth * (xiaoY-1) + (xiaoY - 1) - 10 + 'px'});
					diappearBox.appendTo($('.con-map'));
					score += 100;
					drawScore();
//					xiao[k].removeAttr('data-value');
//					xiao[k].attr('data-xiao',true);
//					setTimeout(function(){
//						$('.mapOne:hidden').remove();
//						
//					},3000)
				}
				
				
				afterXiaoTODown();
			}
		}
	}
	
	addNewElem();
	setTimeout(function(){
		if(hasXiaoFn()){
			$('.disappear').remove();
			toXiaoAll()
		}else{
			if(step >= totalStep){
				//game over
				
			}
		}
	},1000)
}
//判断是否有可消除元素
function hasXiaoFn(){
	var hasXiao = false;
	for(var i = 0; i < 9; i++){
		for(var j = 0; j < 9; j++){
			if($('.map_' + (i+1) + '-' + (j+1)).length == 0){
				continue;
			}
			if(getXiaoElem($('.map_' + (i+1) + '-' + (j+1)))){
				hasXiao = true;
			}
		}
	}
	return hasXiao;
}
//判断是否有空缺元素
function hasEmptyFn(){
	var hasEmpty = false;
	for(var i = 0; i < 9; i++){
		for(var j = 0; j < 9; j++){
			if($('.map_' + (i+1) + '-' + (j+1)).length == 0){
				hasEmpty = true;
			}
		}
	}
	return hasEmpty;
}
//获取消除元素中位于最上方的所有元素
function getXiaoFirstLine(){
	var ret = [];
	for(var i = 0; i < 9; i++){
		for(var j = 0; j < 9; j++){
			if(($('.map_' + (j+1) + '-' + (i+1)).length == 0 
			|| $('.map_' + (j+1) + '-' + (i+1)).attr('data-xiao'))
			&& $('.map_' + j + '-' + (i+1)).length > 0 ){
				ret.push({x:j+1,y:i+1});
				break;
			}
			
		}
	}
	return ret;
}
//获取消除元素中位于最下方的所有元素
function getXiaolastLine(isadd){
	var ret = [];
	
	for(var i = 0; i < 9; i++){
		for(var j = 0; j < 9; j++){
			var checkUP = isadd ? true : hasElemONup(j+1,i+1);
			if(($('.map_' + (j+1) + '-' + (i+1)).length == 0 
			|| $('.map_' + (j+1) + '-' + (i+1)).attr('data-xiao'))
			&& ((!$('.map_' + (j+2) + '-' + (i+1)).attr('data-xiao') 
			&& $('.map_' + (j+2) + '-' + (i+1)).length == 1)
			|| j == 8)
			&& checkUP){
				ret.push({x:j+1,y:i+1});
				break;
			}
			
		}
	}
	return ret;
}
function hasElemONup(x,y){
	var hasElem = false;
	for(var i = 0; i < x; i++){
		if($('.map_' + (i+1) + '-' + y).length > 0)
			hasElem = true
	}
	return hasElem;
}
//交换元素位置
function changePos($e1,$e2){
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
//判断是否可消除
function getXiaoElem($e){
	if($e.length == 0) return;
	up = down = left = right = 0;//用于记录相同元素个数
	upList = [];downList = [];leftList = [];rightList = [];
	xiao = [];
	isXiao($e);
	var canXiao = false;
	if(up + down > 1){
		xiao.push($e);
		for(var i = 0; i < upList.length; i++){
			xiao.push(upList[i])
		}
		for(var i = 0; i < downList.length; i++){
			xiao.push(downList[i])
		}
		canXiao = true;
	}
	if(left + right > 1){
		xiao.push($e);
		for(var i = 0; i < leftList.length; i++){
			xiao.push(leftList[i])
		}
		for(var i = 0; i < rightList.length; i++){
			xiao.push(rightList[i])
		}
		canXiao = true;
	}
	return canXiao;
}
function isXiao($e,dir){
	var obj = getElemObj($e);
	var val = obj.val;
	var posX = obj.x;
	var posY = obj.y;
	
	if(isUp($e) && (!dir || dir == 'up')){
		up++;
		upList.push($('.map_' + (posX - 1) + '-' + posY));
		isXiao($('.map_' + (posX - 1) + '-' + posY),'up');
	} 
	if(isDown($e) && (!dir || dir == 'down')){
		down++;
		downList.push($('.map_' + (posX + 1) + '-' + posY));
		isXiao($('.map_' + (posX + 1) + '-' + posY),'down');
	} 
	if(isLeft($e) && (!dir || dir == 'left')){
		left++;
		leftList.push($('.map_' + posX + '-' + (posY - 1)));
		isXiao($('.map_' + posX + '-' + (posY - 1)),'left');
	} 
	if(isRight($e) && (!dir || dir == 'right')){
		right++;
		rightList.push($('.map_' + posX + '-' + (posY + 1)));
		isXiao($('.map_' + posX + '-' + (posY + 1)),'right');
	} 
}
//判断元素位置是否相邻
function isNext($e){
	var obj = getElemObj($e);
	var posX = obj.x;
	var posY = obj.y;
	var lastobj = getElemObj($('.mapOne.active'));
	var lastposX = lastobj.x;
	var lastposY = lastobj.y;
	if((Math.abs(posX - lastposX) == 1 && posY == lastposY)
	|| (Math.abs(posY - lastposY) == 1 && posX == lastposX)) return true;
	return false;
}
//判断当前元素与上方元素是否一致
function isUp($e){
	var obj = getElemObj($e);
	var val = obj.val;
	var posX = obj.x;
	var posY = obj.y;
	if(posX == '1') return false;
	var upVal = $('.map_' + (posX - 1) + '-' + posY).attr('data-value');
	if(!upVal) return false;
	
	if(val == upVal) return true;
	return false;
		
}
//判断当前元素与下方元素是否一致
function isDown($e){
	var obj = getElemObj($e);
	var val = obj.val;
	var posX = obj.x;
	var posY = obj.y;
	if(posX == '9') return false;
	var upVal = $('.map_' + (posX + 1) + '-' + posY).attr('data-value');
	if(!upVal) return false;
	
	if(val == upVal) return true;
	return false;
		
}
//判断当前元素与左方元素是否一致
function isLeft($e){
	var obj = getElemObj($e);
	var val = obj.val;
	var posX = obj.x;
	var posY = obj.y;
	if(posY == '1') return false;
	var upVal = $('.map_' + posX + '-' + (posY - 1)).attr('data-value');
	if(!upVal) return false;
	if(val == upVal) return true;
	return false;
		
}
//判断当前元素与右方元素是否一致
function isRight($e){
	var obj = getElemObj($e);
	var val = obj.val;
	var posX = obj.x;
	var posY = obj.y;
	if(posY == '9') return false;
	var upVal = $('.map_' + posX + '-' + (posY + 1)).attr('data-value');
	if(!upVal) return false;
	if(val == upVal) return true;
	return false;
		
}
function getElemObj($e){
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
function getClientWidth(){
	return $('.container').width();
}
