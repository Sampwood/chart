var canvas = document.getElementById('canvas');
if (canvas.getContext){
  var ctx = canvas.getContext('2d');

  var chartPanel = {
    x: 1,
    y: 50,
    width: 530,
    height:339,
    radius: 7,
    strokeColor: '#B1B1B1',
    fillColor: '#fff',
    direction: 'vertical',
    gridInterval: 45,
    draw: function () {
      roundedRect(ctx, this.x, this.y, this.width, this.height, this.radius, this.strokeColor, this.fillColor);
      // verticalGridLine (ctx, this.x,this.y,this.width,this.height,this.gridInterval,this.strokeColor);
    }
  };
  chartPanel.draw();

  // the data to show on the chart
  var sampleData = [
      { 'CE index': '10', iPhone3: 120, 'Nokia N9': 105},
      { 'CE index': '20', iPhone3: 115, 'Nokia N9': 106},
      { 'CE index': '30', iPhone3: 118, 'Nokia N9': 115},
      { 'CE index': '40', iPhone3: 112, 'Nokia N9': 107},
      { 'CE index': '50', iPhone3: 128, 'Nokia N9': 103},
      { 'CE index': '60', iPhone3: 110, 'Nokia N9': 110},
      { 'CE index': '70', iPhone3: 111, 'Nokia N9': 106},
      { 'CE index': '80', iPhone3: 109, 'Nokia N9': 100},
      { 'CE index': '90', iPhone3: 123, 'Nokia N9': 118},
      { 'CE index': '100', iPhone3: 110, 'Nokia N9': 106}
  ];
  var xAxis = {
    dataField: 'CE index',
  };
  var xCoordinates = xAxisDrow(ctx, chartPanel, xAxis, sampleData); 

  var valueAxis = {
    position: 'right',
    unitInterval: 20,
    minValue: 0,
    maxValue: 140,
    title: 'Number of subscribers'
  };
  var yStartCoordinate = valueAxisDrow(ctx, chartPanel, valueAxis, sampleData);

  var seriesGroups = {
    series: [{'dataField': 'iPhone3'}, {'dataField': 'Nokia N9'}]
  }

  var points = getPoints(ctx, chartPanel, sampleData, seriesGroups, xCoordinates, yStartCoordinate, valueAxis);
  for (var i in points) {
    drawPoints(ctx, points[i]);
    drawLines(ctx, points[i]);
  }

}

// 绘制折线
function getPoints(ctx, chartPanel, data, seriesGroups, xCoordinates, yStartCoordinate, valueAxis){
  var height = chartPanel.height;
  var minValue = valueAxis.minValue;
  var maxValue = valueAxis.maxValue;
  var dataPoints = [];

  for (var i=0;i<seriesGroups.series.length;i++) {
    var dataField = seriesGroups.series[i].dataField;
    var points = [];
    for (var j=0;j<data.length;j++){
      var value = data[j][dataField];
      var yCoordinate = yStartCoordinate - (height-24)*(value-minValue)/(maxValue-minValue);
      var point = [xCoordinates[j], yCoordinate];
      points.push(point);
    }
    dataPoints.push(points);
  }
  return dataPoints;
}

// 绘制y轴
function valueAxisDrow(ctx, chartPanel, axis){
  var x = chartPanel.x;
  var y = chartPanel.y;
  var width = chartPanel.width;
  var height = chartPanel.height;
  var strokeColor = chartPanel.strokeColor;
  var position = axis.position;
  var unitInterval = axis.unitInterval;
  var minValue = axis.minValue;
  var maxValue = axis.maxValue;
  var title = axis.title;

  var gridInterval = Math.floor((height-24)*unitInterval/(maxValue-minValue));
  var yCoordinates = verticalGridLine (ctx, x,y,width,height,gridInterval,strokeColor, minValue, unitInterval);
  var setting = {
    position: 'right'
  };
  textDrow(ctx, title, x+width+50, y + height/2, setting);
  return yCoordinates[yCoordinates.length-1];
}

// 定义一个函数去绘制x坐标参数, TODO:把字弄成中间对齐，而不是从左边开始
function xAxisDrow(ctx, chartPanel, axis, data){
  var dataField = axis.dataField;
  var x = chartPanel.x;
  var y = chartPanel.y;
  var width = chartPanel.width;
  var height = chartPanel.height;
  var unitInterval = (width-20)/(data.length-1);
  var xCoordinates = [];

  for (var i=0;i<data.length;i++){
    var xCoordinate = x + i*unitInterval + 10;
    textDrow(ctx, data[i][dataField], xCoordinate, y + height + 24);
    xCoordinates.push(xCoordinate);
  }
  textDrow(ctx, dataField, x+width/2, y + height+50);
  return xCoordinates;
}

// 封装的一个用于绘制圆角矩形的函数.
function roundedRect(ctx,x,y,width,height,radius,strokeColor,fillColor){
  ctx.beginPath();
  ctx.moveTo(x,y+radius);
  ctx.lineTo(x,y+height-radius);
  ctx.quadraticCurveTo(x,y+height,x+radius,y+height);
  ctx.lineTo(x+width-radius,y+height);
  ctx.quadraticCurveTo(x+width,y+height,x+width,y+height-radius);
  ctx.lineTo(x+width,y+radius);
  ctx.quadraticCurveTo(x+width,y,x+width-radius,y);
  ctx.lineTo(x+radius,y);
  ctx.quadraticCurveTo(x,y,x,y+radius);
  if (strokeColor) {
    ctx.strokeStyle = strokeColor;
  }
  ctx.stroke();
  if (fillColor) {
    ctx.fillStyle = fillColor;
    ctx.fill();
  }
}

// 画水平栅格线 往右10px
function verticalGridLine (ctx,x,y,width,height,gridInterval,strokeColor, minValue, unitInterval) {
  var gridLines = [];
  ctx.beginPath();
  ctx.moveTo(x + 10, y + 12 + 0.5);
  ctx.lineTo(x + width + 10, y + 12 + 0.5);
  gridLines.push(y + 12 + 0.5);
  var y1 = y + 12 + gridInterval;
  while(y1 + 12 < y + height){
    ctx.moveTo(x + 10, y1 + 0.5);
    ctx.lineTo(x + width + 10, y1 + 0.5);
    gridLines.push(y1 + 0.5);
    y1 = y1 + gridInterval;
  }
  ctx.moveTo(x + 10, y + height - 12 + 0.5);
  ctx.lineTo(x + width + 10, y + height - 12 + 0.5);
  gridLines.push(y + height - 12 + 0.5);
  if (strokeColor) {
    ctx.strokeStyle = strokeColor;
  }
  ctx.stroke();
  for (var i=gridLines.length;i>0;i--){
    textDrow(ctx, minValue+ (gridLines.length-i)*unitInterval, x + width+24, gridLines[i-1]);
  }
  return gridLines;
}

// 在图表内添加文字
function textDrow(ctx, text, x, y, setting) {
  ctx.save();
  ctx.translate(x,y);
  ctx.font = '14px inherit';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#404040';
  if (setting) {
    if (setting.font) {
      ctx.font = setting.font;
    }
    if (setting.textAlign) {
      ctx.textAlign = setting.textAlign;
    }
    if (setting.fillStyle) {
      ctx.fillStyle = setting.fillStyle;
    }
    if (setting.position === 'right'){
      ctx.rotate(Math.PI*3/2);
    }
  }
  
  ctx.fillText(text,0,0);
  ctx.restore();
}

/**
 * draw points in specified position
 * @Author   Sam
 * @DateTime 2017-02-16
 * @param    {Object}  ctx    画笔
 * @param    {Array}   points 坐标信息，如[[x,y]...]
 * @return   none
 */
function drawPoints(ctx, points){
  ctx.beginPath();
  for (var i in points) {
    ctx.arc(points[i][0], points[i][1], 2, 0, 2*Math.PI);
  }
  ctx.stroke();
}

/**
 * draw lines
 * @Author   Sam
 * @DateTime 2017-02-16
 * @param    {Object}   ctx    画笔
 * @param    {Array}    points 坐标信息，如[[x,y]...]
 * @return   none
 */
function drawLines(ctx, points){
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (var i=1;i<points.length;i++) {
    ctx.lineTo(points[i][0], points[i][1]);
  }
  ctx.stroke();
}