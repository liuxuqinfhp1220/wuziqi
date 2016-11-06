$(function(){
    var canvas=$("#canvas").get(0);
    var ctx=canvas.getContext('2d');
    var ROW=15;
    var cw=canvas.width;
    var sw=cw/15;
    var flag=true;
    var blocks={};
    var show=$(".show");
    var can=show.find('#can');
    var cancel=show.find('#cancel');
    var title=show.find('h4');
    var blank={};
    var ai=false;
    var computer=$('.computer');
    var two=$('.two');
    var start=$('.start');
    var end=$('.end');
    var audio=$('#audio').get(0);
    var time=0;
    var exit=$('.exit');
    for(var i=0;i<ROW;i++){
        for(var j=0;j<ROW;j++){
            blank[p2k(i,j)]=true;
        }
    }
    //坐标
    function p2k(x,y){
       return x+'_'+y;
    }
    //字符串  x_y
    function o2k(position){
        var arr=position.split('_');
        return {x:parseInt(arr[0]),y:parseInt(arr[1])}
    }
    //position={x:x,y:y}
    function k2o(position){
       return position.x+'_'+position.y;
    }
    //生成棋谱
    function review(){
        var i=1;
        for(var num in blocks){
            if(blocks[num]==="black"){
                drawtext(num,i,"#fff");
            }else if(blocks[num]==="white"){
                drawtext(num,i,"#000");
            }
            i++;
        }
    }
    function drawtext(position,text,color){
        ctx.beginPath();
        ctx.save();
        ctx.font="14px 微软雅黑";
        ctx.fillStyle=color;
        ctx.textAlign="center";
        ctx.textBaseline="middle";
        ctx.fillText(text,(o2k(position).x+0.5)*sw,(o2k(position).y+0.5)*sw);
        ctx.closePath();
        ctx.restore();
    }
    //横线
    function  hline() {
        for(var i=0;i<ROW;i++){
            ctx.beginPath();
            ctx.strokeStyle="#000";
            ctx.moveTo(sw/2+0.5,(i+0.5)*sw+0.5);
            ctx.lineTo(14.5*sw+0.5,(i+0.5)*sw+0.5);
            ctx.stroke();
            ctx.closePath();
        }

    }
    //竖线
    function zline(){
        for(var i=0;i<ROW;i++){
            ctx.beginPath();
            ctx.strokeStyle="#000";
            ctx.moveTo((i+0.5)*sw+0.5,sw/2+0.5);
            ctx.lineTo((i+0.5)*sw+0.5,14.5*sw+0.5);
            ctx.stroke();
            ctx.closePath();
        }

    }
    hline();
    zline();
    //小圆
    function makecircle(x,y){
        ctx.beginPath();
        ctx.arc(x*sw+0.5,y*sw+0.5,3,0,Math.PI*2);
        ctx.fill();
        ctx.closePath();
    }
    makecircle(3.5,3.5);
    makecircle(11.5,3.5);
    makecircle(7.5,7.5);
    makecircle(3.5,11.5);
    makecircle(11.5,11.5);
    //画棋
    function drawchess(position,color){
        ctx.save();
        ctx.translate(((position.x+0.5)*sw),((position.y+0.5)*sw));
        ctx.beginPath();
        // var bimg=new Image();
        // var wimg=new Image();
        // bimg.src="img/black.png";
        // wimg.src="img/white.png";
        if(color==="black"){
            var radialgradient = ctx.createRadialGradient(-3,-5,1,0,0,15);
            radialgradient.addColorStop(0,'#fff');
            radialgradient.addColorStop(0.5,'#111');
            radialgradient.addColorStop(1,'#000');
            ctx.fillStyle=radialgradient;
            // ctx.drawImage(bimg,0,0);
        }else{
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;
            ctx.shadowBlur = 2;
            ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
            ctx.fillStyle="#fff";
            // ctx.drawImage(wimg,0,0);
        }
        ctx.arc(0,0,15,0,2*Math.PI);
        ctx.fill();
        ctx.closePath();
        ctx.restore();
        blocks[k2o(position)]=color;
        audio.play();
        delete blank[k2o(position)];
    }
    //判断输赢
    function check(position,color){
        var tab={};
        var row=1;
        var zong=1;
        var shew=1;
        var shang=1;
        for(var i in blocks){
            if(blocks[i]===color){
                tab[i]=true;
            }
        }
        //横向
        var tx=position.x;
        var ty=position.y;
        while(tab[p2k((tx+1),ty)]){
             row++;
             tx++;
        }
        tx=position.x;
        while(tab[p2k((tx-1),ty)]){
            row++;
            tx--;
        }
        //纵向
        tx=position.x;
        while(tab[p2k(tx,(ty+1))]){
            zong++;
            ty++;
        }
        ty=position.y;
        while(tab[p2k(tx,(ty-1))]){
            zong++;
            ty--;
        }
        //斜向   zuo  you
        ty=position.y;
        while(tab[p2k((tx+1),(ty+1))]){
            shew++;
            tx++;
            ty++;
        }
        tx=position.x;
        ty=position.y;
        while(tab[p2k((tx-1),(ty-1))]){
            shew++;
            tx--;
            ty--;
        }
        //斜向   you zuo
        tx=position.x;
        ty=position.y;
        while(tab[p2k((tx+1),(ty-1))]){
            shang++;
            tx++;
            ty--;
        }
        tx=position.x;
        ty=position.y;
        while(tab[p2k((tx-1),(ty+1))]){
            shang++;
            tx--;
            ty++;
        }
        var max=Math.max(row,zong,shew,shang);
        return max;
    }
    //落子
    computer.on('click',function(){
        ai=!ai;
        $('.daojishi').css('display','block');
        var t=5;
        var ti=setInterval(function(){
            t--;
            $('.daojishi').text(t);
            if(t==0){
                clearInterval(ti);
                clear=setInterval(function(){
                    time++;
                    $('.date').text(format(time));
                },1000);
                $('.daojishi').css('display','none');
                $(canvas).on('click',handler);
            }
        },1000)
    })
    function handler(e){
        var position={x:Math.round((e.offsetX-sw/2)/sw),y:Math.round((e.offsetY-sw/2)/sw)};
        if(blocks[position.x+'_'+position.y]){
            return;
        }
        if(ai){
            drawchess(position,"black");
            drawchess(o2k(AI()),"white");
             if(check(position,"black")>=5){
                show.css('display','block');
                title.text('黑棋赢！是否生成棋谱?');
                clearInterval(clear);
                $(canvas).off('click');
                can.on('click',function(){
                    review();
                    show.css('display','none');
                })
                cancel.on('click',function(){
                    show.css('display','none');
                })
            }
            else if(check(o2k(AI()),"white")>=5){
                show.css('display','block');
                title.text('白棋赢！是否生成棋谱?');
                 clearInterval(clear);
                $(canvas).off('click');
                can.on('click',function(){
                    review();
                    show.css('display','none');
                })
                cancel.on('click',function(){
                    show.css('display','none');
                })
            }
            return;
        }
        if(flag){
            drawchess(position,"black");
            $('.black').addClass('white');
            if(check(position,"black")>=5){
                show.css('display','block');
                title.text('黑棋赢！是否生成棋谱?');
                $('.black').removeClass('white');
                clearInterval(clear);
                $(canvas).off('click');
                can.on('click',function(){
                    review();
                    show.css('display','none');
                })
                cancel.on('click',function(){
                    show.css('display','none');
                })
            }
        }else{
            drawchess(position,"white");
            $('.black').removeClass('white');
            if(check(position,"white")>=5){
                show.css('display','block');
                title.text('白棋赢！是否生成棋谱?');
                $('.black').removeClass('white');
                clearInterval(clear);
                $(canvas).off('click');
                can.on('click',function(){
                    review();
                    show.css('display','none');
                })
                cancel.on('click',function(){
                    show.css('display','none');
                })
            }
        }
        flag=!flag;
    }
    two.on('click',function(){
        $('.daojishi').css('display','block');
        var t=5;
        var ti=setInterval(function(){
         t--;
         $('.daojishi').text(t);
         if(t==0){
             clearInterval(ti);
             clear=setInterval(function(){
                 time++;
                 $('.date').text(format(time));
             },1000);
            $('.daojishi').css('display','none');
            $(canvas).on('click',handler);
         }
        },1000)

    })
    function AI(){
        var pos1,pos2;
        var max1=-10,max2=-10;
        var score1,score2;
        for(var pos in blank){
            score1=check(o2k(pos),"black");
            if(score1>max1){
                max1=score1;
                pos1=pos;
            }
            score2=check(o2k(pos),"white");
            if(score2>max2){
                max2=score2;
                pos2=pos;
            }
        }

        if(max1>=max2){
            return pos1
        }else if(max1<max2){
            return pos2;
        }
    }
    start.on('click',function(){
        clearInterval(clear);
        ctx.clearRect(0,0,cw,cw);
        blocks={};
        blank={};
        time=0;
        $('.date').text("00:00");
        for(var i=0;i<ROW;i++){
            for(var j=0;j<ROW;j++){
                blank[p2k(i,j)]=true;
            }
        }
        flag=true;
        hline();
        zline();
        makecircle(3.5,3.5);
        makecircle(11.5,3.5);
        makecircle(7.5,7.5);
        makecircle(3.5,11.5);
        makecircle(11.5,11.5);
        $(canvas).off('click');
        $('.daojishi').css('display','block').text('5');
        var t=5;
        var ti=setInterval(function(){
            t--;
            $('.daojishi').text(t);
            if(t==0){
                clearInterval(ti);
                clear=setInterval(function(){
                    time++;
                    $('.date').text(format(time));
                },1000);
                $('.daojishi').css('display','none');
                $(canvas).on('click',handler);
            }
        },1000)
    })
    end.on('click',function(){
        $(canvas).off('click');
        clearInterval(clear);
    })
    function format(time){
        m=parseInt(time/60);
        s=time%60;
        if(m<10){
            m='0'+m;
        }
        if(s<10){
            s='0'+s;
        }
        return m+":"+s;
    }
    $('.begin').on('click',function(){
        $('.cover').addClass('scale');
    })
    exit.on('click',function(){
        clearInterval(clear);
        ctx.clearRect(0,0,cw,cw);
        blocks={};
        blank={};
        time=0;
        $('.date').text("00:00");
        for(var i=0;i<ROW;i++){
            for(var j=0;j<ROW;j++){
                blank[p2k(i,j)]=true;
            }
        }
        flag=true;
        hline();
        zline();
        makecircle(3.5,3.5);
        makecircle(11.5,3.5);
        makecircle(7.5,7.5);
        makecircle(3.5,11.5);
        makecircle(11.5,11.5);
        $('.cover').removeClass('scale');
        $('.daojishi').css('display','none').text('5');
    })
})