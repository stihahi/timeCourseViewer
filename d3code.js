var dataSet = [300,130,5,60,240];
//搬送中,搬送遅れ,診察待ち,診察中
var col = ["#AEC1E3","#AAB1B3","#FFE600","#009F8C"];
//入電 来院予定 受付 診察開始 診察終了
var timeCourse = [
["2015/10/30 7:50:46","2015/10/30 8:03:06","2015/10/30 8:03","",""],
["2015/10/30 8:03:05","2015/10/30 8:36:47","2015/10/30 9:08","2015/10/30 9:08","2015/10/30 10:39:23"],
["2015/10/30 9:18:13","2015/10/30 9:34:24","2015/10/30 10:02","2015/10/30 10:02","2015/10/30 13:00"],
["2015/10/30 12:18:50","2015/10/30 12:26:42","2015/10/30 12:31","2015/10/30 12:31","2015/10/30 13:48:03"],
["2015/10/30 14:06:11","2015/10/30 14:18:43","2015/10/30 14:24","2015/10/30 14:24","2015/10/30 16:08:43"],
["2015/10/30 14:11","2015/10/30 14:45:40","2015/10/30 15:07","2015/10/30 14:45:40","2015/10/30 18:00"],
["2015/10/30 14:33:41","2015/10/30 14:51:44","2015/10/30 14:58","2015/10/30 14:51:44","2015/10/30 18:30"],
["2015/10/30 15:33:39","2015/10/30 15:46:57","2015/10/30 15:59","2015/10/30 16:08","2015/10/30 22:13:16"],
["2015/10/30 16:46:20","2015/10/30 16:52:37","2015/10/30 16:59","2015/10/30 17:00","2015/10/30 19:20"],
["2015/10/30 19:56:55","2015/10/30 20:04:34","2015/10/30 20:21:11","2015/10/30 20:04:34","2015/10/30 22:18:58"],
["2015/10/30 20:53:45","2015/10/30 21:11:05","2015/10/30 21:16","","2015/10/30 23:55:08"],
["2015/10/30 22:36:21","2015/10/30 22:49:35","2015/10/30 22:49:35","","2015/10/31 0:26:30"],
["2015/10/31 9:17:25","2015/10/31 9:27:48","2015/10/31 9:32","2015/10/31 9:32","2015/10/31 13:10:06"],
["2015/10/31 10:11:06","2015/10/31 11:13:58","2015/10/31 11:18","2015/10/31 11:18","2015/10/31 13:24:31"],
["2015/10/31 10:24:25","2015/10/31 10:50:04","2015/10/31 10:55","2015/10/31 10:55","2015/10/31 15:09:45"],
["2015/10/31 11:58:40","2015/10/31 12:31:54","2015/10/31 12:31:54","2015/10/31 12:31:54","2015/10/31 12:40"],
["2015/10/31 12:25:58","2015/10/31 12:34:19","2015/10/31 12:44","2015/10/31 12:44","2015/10/31 15:19:38"],
["2015/10/31 14:50:49","2015/10/31 15:18:23","2015/10/31 15:18:23","2015/10/31 15:18:23","2015/10/31 18:50:37"],
["2015/10/31 15:05:17","2015/10/31 15:06:27","2015/10/31 15:06:27","2015/10/31 15:06:27","2015/10/31 18:23:48"],
["2015/10/31 15:17:58","2015/10/31 15:51:12","2015/10/31 15:51:12","2015/10/31 15:51:12","2015/10/31 20:01:55"],
["2015/10/31 15:40:32","","","",""],
["2015/10/31 17:22:47","2015/10/31 17:45:09","2015/10/31 17:56","2015/10/31 17:56","2015/10/31 20:02:20"],
["2015/10/31 19:46:28","2015/10/31 20:02","2015/10/31 20:12:36","","2015/10/31 23:57:47"],
["2015/10/31 20:31:52","2015/10/31 20:47:49","2015/10/31 20:54:23","","2015/10/31 22:43:55"],
["2015/10/31 21:47:35","2015/10/31 21:57:07","2015/10/31 21:57:07","","2015/10/31 22:18:54"],
["2015/10/31 22:34:22","2015/10/31 23:02:52","2015/10/31 23:02:52","","2015/10/31 23:39:49"],
["2015/10/31 23:04:01","2015/10/31 23:12:43","2015/10/31 23:21","","2015/11/01 1:59:26"]
];

//設定項目
var xoffset = strtotime("2015/10/30 14:00:00");
var xnow = strtotime("2015/10/30 23:59:59");
var timespan = 12;//１２時間分を表示する。
var lineSpace = 3;//ライン同士のスペース
var lineHeight = 5;//ラインの縦幅
var yoffset = 30;


//細かい計算。
var svgWidth = 720;//d3.select("#myGraph").style("width");//width(); // 720
var svgHeight = 640; //d3.select("#myGraph").style("height"); // 640

var ySpace = lineSpace + lineHeight;

var widthRatio = timespan*60*60/svgWidth;
var nowposx = (xnow-xoffset)/widthRatio;

var xLast = xoffset + timespan*60*60;

var rectArray=new Array();
for(var a=0;a<timeCourse.length;a++){
	var nyuden = strtotime(timeCourse[a][0]);
	var yotei = strtotime(timeCourse[a][1]);//予定来院時間
	var uketuke = strtotime(timeCourse[a][2]);//受付時刻
	var kaisi = strtotime(timeCourse[a][3]);//開始時刻
	var syuryo = strtotime(timeCourse[a][4]);//終了時刻
	var r1;
	//救急隊の搬送時間。
	if(uketuke != 0){
		r1 = new myRect(nyuden,(yotei>uketuke ? uketuke : yotei) , a*ySpace, col[0]);
	}else{
		r1 = new myRect(nyuden, yotei, a*ySpace, col[0]);
	}
	rectArray.push(r1);
	//救急隊、おくれ時間。(or 受付がまだされていない　の時間)
	if(yotei < xnow){
		if(uketuke == 0){
			r1 = new myRect(yotei, xnow, a*ySpace,col[1]);
		}else{
			r1 = new myRect(yotei, (xnow > uketuke ? uketuke : xnow) , a*ySpace, col[1]);
		}
		rectArray.push(r1);
	}
	//待ち時間 受付がされている時に発動。
	if(uketuke != 0
		 && (kaisi == 0 || kaisi > uketuke)){

		if(kaisi == 0){
			r1 = new myRect(uketuke,xnow, a*ySpace, col[2]);//まだ診察されていない状態。
		}else{
			r1 = new myRect(uketuke, kaisi, a*ySpace, col[2]);//開始されている場合。
		}
		rectArray.push(r1);
	}
	//診察時間バー　開始されている時に発動。
	if(kaisi != 0){
		if(syuryo == 0){
			r1 = new myRect(kaisi,xnow, a*ySpace, col[3]);
		}else{
			r1 = new myRect(kaisi,syuryo, a*ySpace, col[3]);
		}
		rectArray.push(r1);
	}
}

d3.select("#myGraph")
	.selectAll("rect")
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
	.delay(function(d,i){return i*20;})
	.duration(500)
	.attr("width",function(d,i){
		return (d.width/widthRatio >0 ? d.width/widthRatio : 0)+"px";
	})
	.style("fill",function(d,i){
		return d.col;
	})


var carray = [[nowposx,0], [nowposx,svgHeight]];

//now line
var line=d3.svg.line()
	.x(function(d,i){
		return carray[i][0];
	})
	.y(function(d,i){
		return carray[i][1];
	})
	.interpolate("linear")

d3.select("#myGraph")
	.append("path")
	.attr("d",line(carray))
	.attr("stroke","black")
	.attr("stroke-width",2)

//時刻目盛り。
var xScale = d3.time.scale()
	.domain([
		new Date(xoffset*1000),
		new Date(xLast*1000)
		])
	.range([0,svgWidth]);

d3.select("#myGraph")
	.append("g")
	.attr("class","axis")
	.attr("transform","translate(0,20)")
	.call(d3.svg.axis()
			.scale(xScale)
			.orient("top")
			.tickFormat(d3.time.format('%H:00'))
			.innerTickSize(3)
			.outerTickSize(0)
			.tickPadding(3)
	)




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
	var ret = new Date(str).getTime()/1000;
	return ret;
}
