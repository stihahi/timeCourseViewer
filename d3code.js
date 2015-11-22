//設定項目
var xoffset = strtotime("2015/10/30 14:00:00");
var xnow = strtotime("2015/10/30 23:59:59");
var timespan = 12;//１２時間分を表示する。
var lineSpace = 3;//ライン同士のスペース
var lineHeight = 5;//ラインの縦幅
var yoffset = 30;
var svgWidth = 720;
var svgHeight = 160;







mysvg=d3.select("#graph")
	.append("svg")
	.attr("width",svgWidth)
	.attr("height",svgHeight)
	.attr("border","1px solid black")
//細かい計算。
var ySpace = lineSpace + lineHeight;
var widthRatio = timespan*60*60/svgWidth;
var nowposx = (xnow-xoffset)/widthRatio;
var xLast = xoffset + timespan*60*60;
var carray = [[nowposx,28], [nowposx,svgHeight]];

beg = xoffset;
end = xLast;
var dataSet = [300,130,5,60,240];
//搬送中,搬送遅れ,診察待ち,診察中
var col = ["#AEC1E3","#AAB1B3","#FFE600","#009F8C"];
var rectArray=new Array();

var timeCourse = [];
d3.text("./data.csv",function(error,text){
	var data = d3.csv.parseRows(text, function(d){
		return [d[0],d[1],d[2],d[3],d[4]];
	});
	timeCourse = data;
	//時間経過でソートする。
	timeCourse.sort(function(a,b){
		if(a[0] > b[0]) return 1;
		if(a[0] < b[0]) return -1;
		if(a[3] > b[3]) return 1;
		if(a[3] < b[3]) return -1;
		return 0;
	})
	var rowPos = 0;
	for(var a=0;a<timeCourse.length;a++){
		//レンジに入っていないものをまず吹っ飛ばす。
		var IsInRange = false;
		for(var k=0;k<5;k++){
			var targetTime = strtotime(timeCourse[a][k]);
			if(targetTime > 0 && targetTime <= end && targetTime >= beg){
				IsInRange = true;
			}
		}
		if(!IsInRange){
			continue;
		}
		var nyuden = strtotime(timeCourse[a][0]);//入電時間
		var yotei = strtotime(timeCourse[a][1]);//予定来院時間
		var uketuke = strtotime(timeCourse[a][2]);//受付時刻
		var kaisi = strtotime(timeCourse[a][3]);//開始時刻
		var syuryo = strtotime(timeCourse[a][4]);//終了時刻
		var r1;
		if(yotei == 0){//予定時刻の入っていないデータを飛ばす。(つまり、多分来院していない。)
			continue;
		}else if(nyuden > uketuke+12*60*60){
			continue;//受付時間が間違っていると思われる。
		}else if(nyuden + yotei + uketuke + kaisi + syuryo == 0){//なにもはいってねえじゃねーか！
			continue;
		}
		console.log(timeCourse[a]);
		if(uketuke == 0 && uketuke > yotei*30*60){//受付時間が入っておらず、予定を大幅に過ぎている場合は、入れ損ねとみなす。
			uketuke = yotei;
		}

		console.log(kaisi);
		//救急隊の搬送時間。
		if(uketuke != 0){
			r1 = new myRect(nyuden,(yotei>uketuke ? uketuke : yotei) , rowPos*ySpace, col[0]);
		}else{
			r1 = new myRect(nyuden, yotei, rowPos*ySpace, col[0]);
		}
		rectArray.push(r1);
		//救急隊、おくれ時間。(or 受付がまだされていない　の時間)
		if(yotei < xnow){
			if(uketuke == 0){
				r1 = new myRect(yotei, xnow, rowPos*ySpace,col[1]);
			}else{
				r1 = new myRect(yotei, (xnow > uketuke ? uketuke : xnow) , rowPos*ySpace, col[1]);
			}
			rectArray.push(r1);
		}
		//待ち時間 受付がされている時に発動。
		if(uketuke != 0){
			if(kaisi == 0){//まだ開始されていない。
				r1 = new myRect(uketuke, xnow, rowPos*ySpace, col[2]);//まだ診察されていない状態。
				rectArray.push(r1);
			}else if(kaisi > uketuke){//待ち時間が発生していた。
				r1 = new myRect(uketuke, kaisi, rowPos*ySpace, col[2]);//開始されている場合。
				rectArray.push(r1);
			}
		}


		//診察時間バー　開始されている時に発動。
		if(kaisi != 0){
			if(syuryo == 0){
				r1 = new myRect(kaisi,xnow, rowPos*ySpace, col[3]);
			}else{
				r1 = new myRect(kaisi,syuryo, rowPos*ySpace, col[3]);
			}
			rectArray.push(r1);
		}/*else{//開始されていない。または入れ損ね
			if(syuryo == 0){//終了されていない、つまり診察中。
				r1 = new myRect(uketuke,xnow, rowPos*ySpace, col[3]);
			}else{
				r1 = new myRect(uketuke,syuryo, rowPos*ySpace, col[3]);
			}
		}*/
		rowPos++;
	}
	console.log(rectArray);

//svg drawing starts here...
	mysvg.selectAll("rect")
		.data(rectArray)
		.enter()
		.append("rect")
		.attr("x",function(d,i){
	//		console.log((d.x-xoffset)/60);
			return (d.x-xoffset > 0 ? (d.x-xoffset)/widthRatio : 0);
		})
		.attr("y",function(d,i){
			return d.y + yoffset;
		})
		.attr("height",lineHeight+"px")
		.attr("width","0px")
		.transition()
		.delay(function(d,i){return i*30;})
		.duration(50)
		.attr("width",function(d,i){
			return (d.width/widthRatio >0 ? d.width/widthRatio : 0)+"px";
		})
		.style("fill",function(d,i){
			return d.col;
		})



//ラインを書くーーーーーーー
//prepare now line
var line=d3.svg.line()
	.x(function(d,i){
		return carray[i][0];
	})
	.y(function(d,i){
		return carray[i][1];
	})
	.interpolate("linear")


	mysvg.append("path")
		.attr("d",line(carray))
		.attr("stroke","black")
		.attr("stroke-width",2)

	});


//時刻目盛りを書くーーーーー
var xScale = d3.time.scale()
	.domain([
		new Date(xoffset*1000),
		new Date(xLast*1000)
		])
	.range([0,svgWidth]);

mysvg.append("g")
	.attr("class","axis")
	.attr("transform","translate(0,28)")
	.call(d3.svg.axis()
			.scale(xScale)
			.orient("top")
			.tickFormat(d3.time.format('%H:00'))
			.innerTickSize(3)
			.outerTickSize(0)
			.tickPadding(3)
	)
	.style("stroke-width",2)

mysvg.append("g")
	.attr("class","axis")
	.attr("transform","translate(0,10)")
	.call(d3.svg.axis()
			.scale(xScale)
			.ticks(d3.time.hour, 6)
			.orient("top")
			.tickFormat(d3.time.format('%m/%d'))
			.innerTickSize(0)
			.outerTickSize(0)
			.tickPadding(0)
	)
	.style("stroke-width",0)





d3.select("#updateButton")
	.on("click",function(){
		dataSet=[20,230,150,10,20];
		d3.select("#myGraph")
		.selectAll("rect")
		.data(dataSet)
		.transition()
		.attr("width",function(d,i){
			return d+"px";
		})
	})



//横バークラス
function myRect(beg,end,y,col){//コンストラクタ
	this.x=beg;
	this.y=y;
	this.col = col;
	if(beg != "" && end != "")
	{
		this.width = end-beg;
	}else{
		this.width = 0;
	}
	this.height = 20;
}

function strtotime(str){
	if(str == ""){return 0;}
	var ret = new Date(str).getTime()/1000;
	return ret;
}

