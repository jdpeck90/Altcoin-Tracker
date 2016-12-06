
var h = 1500;
var w = 2020;


var fullDate = new Date()
var getMonth = fullDate.getMonth() + 1;
var getDay = fullDate.getDate()
var getYear = fullDate.getFullYear()
var todaysDate = getYear +"-"+ getMonth +"-"+ getDay;



function countProperties(obj) {
    var count = 0;
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            ++count;
    }
    return count;
}


var mapData = function(data){
  var lineFun = d3.svg.line()
  .x(function(d,i){return (d.Date/numOfDates)*i;})
  .y(function(d){return d.Price;})
  .interpolate("linear");
  var svg = d3.select("div").append("svg").attr({ width:w, height:h});

  var viz = svg.append("path")
  .attr({ d:lineFun(dataSet),
    "stroke": "purple",
    "stroke-width": 2,
    "fill": "none"
   })
  }

// $.getJSON("https://api.coindesk.com/v1/bpi/historical/close.json?start=2013-09-01&end="+todaysDate,
//   function(json) {
//   var object = json.bpi
//   console.log(object.length,'lengthObj')
//   var dataPoints = restructureData(object);
//   numOfDates = countProperties(object)
//   mapData(dataPoints)

// });
// var
