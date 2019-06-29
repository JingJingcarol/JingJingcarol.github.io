window.onload = function() {
    //canvas的宽高不加单位，坐标与px不对应
    var c = document.getElementById("canvas");
    c.width = window.innerWidth;
    c.height = window.innerHeight;
    var w = c.width,
        h = c.height,
        points = [],
        pQua = 750,
        ctx = c.getContext("2d"),
        maxD = 50,
        mouD = 100,
        mousePosition = {
            x: 30 * w / 100,
            y: 30 * h / 100
        };

    createPoints();
    drawPoint();

    function random(min, max) {
        return Math.random() * (max - min + 1) + min;
    }

    function createPoints() {
        for (var i = 0; i < pQua; i++) {
            var point = {
                x: random(0, w),
                y: random(0, h),
                c: '#' + (Math.random() * 0x404040 + 0xaaaaaa | 0).toString(16),
                r: random(0, 1),
                vx: -.5 + Math.random(),
                vy: -.5 + Math.random()
            }
            points.push(point);
        }
    }

    function drawPoint() {
        //每次清画布，合成：覆盖
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = 'rgba(255,255,255,1)';
        ctx.fillRect(0, 0, w, h);
        for (var i in points) {
            point = points[i]
            if (point.y < 0 || point.y > h) {
                point.vx = point.vx;
                point.vy = -point.vy;
            } else if (point.x < 0 || point.x > w) {
                point.vx = -point.vx;
                point.vy = point.vy;
            }
            point.x += point.vx;
            point.y += point.vy;
            ctx.beginPath();
            ctx.fillStyle = point.c;
            ctx.arc(point.x, point.y, point.r, 0, Math.PI * 2, false);
            ctx.fill();

        }
        conPoint();
        setTimeout(drawPoint, 1000 / 60)
    }

    function conPoint() {
        for (var i in points) {
            for (var j in points) {
                var iPoint = points[i];
                var jPoint = points[j];
                //当点点距离小于maxD，鼠标与点的距离小于mouD时连线
                if (Math.abs(iPoint.x - jPoint.x) < maxD && Math.abs(iPoint.y - jPoint.y) < maxD) {
                    if (Math.abs(iPoint.x - mousePosition.x) < mouD && Math.abs(iPoint.y - mousePosition.y) < mouD) {
                        ctx.beginPath();
                        //				            ctx.strokeStyle = averageColorStyles(iPoint, jPoint);
                        ctx.strokeStyle = iPoint.c;
                        ctx.moveTo(iPoint.x, iPoint.y);
                        ctx.lineTo(jPoint.x, jPoint.y);
                        ctx.lineWidth = .2;
                        ctx.stroke();
                        ctx.closePath();
                    }
                }
            }
        }

    }
    document.onmousemove = function(e) {
        mousePosition.x = e.pageX;
        mousePosition.y = e.pageY;
    };
}