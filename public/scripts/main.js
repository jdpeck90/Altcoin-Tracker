$(document).ready(function() {
$(function(){

  console.log('connected')
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

function restructureData(rawData){
  var bldg = [];
  var counter = 0;

  for(var key in rawData){
    var obj = {}
    // var dateBySec = key.getTime()
    var replaceDate = key.replace("-",".").replace("-",".")
    var numDate = parseFloat(replaceDate)
    var splitDate = key.split("-")
    var splitYear = parseInt(splitDate[0])
    var splitMonth = parseInt(splitDate[1])
    var splitDay = parseInt(splitDate[2])
    var newDate = splitYear+"."+splitMonth+"."+splitDay;

    obj["Date"] = numDate;
    obj["Price"] = rawData[key]
    bldg.push(obj);
  }
 dataSet = bldg;
}

var getCoinData = function(){
  var $tickerDisplays = $('div#priceTicker');
    for(var i = 0; i < $tickerDisplays.length; i++){
      var $bitData = $tickerDisplays[i].dataset.coin
      var bitUrl = $bitData.replace('_btn','-usd')
      makeCallIn(bitUrl)
    }

}

getCoinData()
// $.getJSON("https://api.coindesk.com/v1/bpi/historical/close.json?start=2013-09-01&end="+todaysDate,
//   function(json) {
//   var object = json.bpi
//   console.log(object.length,'lengthObj')
//   var dataPoints = restructureData(object);
//   numOfDates = countProperties(object)
//   mapData(dataPoints)

// });
// var altSearchValue =

var deleteUser = function(){
  console.log('works')
  alert('You have deleted you account');
}

function makeCallOut(searchValue){
    $.ajax({
      url: 'https://api.cryptonator.com/api/ticker/'+searchValue
    }).success(function(data) {
      displayStatusOut(data.ticker)
    })
  }
function makeCallIn(searchValue){
    $.ajax({
      url: 'https://api.cryptonator.com/api/ticker/'+searchValue
    }).success(function(data) {
      displayStatusIn(data.ticker)
    })
  }
var tickerCount = 0;
function displayStatusIn(rawData) {
    // $('h2').remove()
    console.log(rawData,'raw')
    var base = rawData.base;
    var target = rawData.target;
    var price = rawData.price;
    var volume = rawData.volume;
    var change = rawData.change;

    if(volume === ""){
      volume = "no available information"
    }

    if(price === ""){
      price = "no available information"
    }

    if(change === ""){
      price = "no available information"
    }

    var $priceTicker = $('div#priceTicker')[tickerCount]
    console.log($priceTicker)
    var $volumeTicker = $('div#volumeTicker')[tickerCount]
    var $changeTicker = $('div#changeTicker')[tickerCount]
    var $ticker = $('div#ticker')[tickerCount]
    var $base = $('div#base')[tickerCount]
    var $displayGroup = $('div#bitTitle')[tickerCount]

    var $h2Base = $('<h2>'+base+'</h2>')
    var $displayPrice = $('<h2>'+price+'</h2>')
    console.log($displayPrice,'displayPrice')
    var $displayVolume = $('<h2>'+volume+'</h2>')
    var $displayChange = $('<h2>'+change+'</h2>')


    $($displayGroup).append($h2Base)
    $($priceTicker).append('$'+$displayPrice)
    $($volumeTicker).append($displayVolume)
    $($changeTicker).append($displayChange)

    tickerCount++;
}

function displayStatusOut(rawData) {
    $('h2').remove()

    var base = rawData.base;
    var target = rawData.target;
    var price = rawData.price;
    var volume = rawData.volume;
    var change = rawData.change;

    if(volume === ""){
      volume = "no available information"
    }

    if(price === ""){
      price = "no available information"
    }

    if(change === ""){
      price = "no available information"
    }

    var $priceTicker = $('div#priceTicker')[0]
    console.log(tickerCount)
    console.log($priceTicker)
    var $volumeTicker = $('div#volumeTicker')[0]
    var $changeTicker = $('div#changeTicker')[0]
    var $ticker = $('div#ticker')[0]
    var $base = $('div#base')[0]
    var $displayGroup = $('div#bitTitle')[0]

    var $h2Base = $('<h2>'+base+'</h2>')
    var $displayPrice = $('<h2>'+'$'+price+'</h2>')
    console.log($displayPrice,'displayPrice')
    var $displayVolume = $('<h2>'+volume+'</h2>')
    var $displayChange = $('<h2>'+change+'%'+'</h2>')


    $($displayGroup).append($h2Base)
    $($priceTicker).append($displayPrice)
    $($volumeTicker).append($displayVolume)
    $($changeTicker).append($displayChange)

    tickerCount++;
}
$( ".dropDownChoice" ).click(function(d) {
  var searchValue = d.target.dataset.searchvalue;
  makeCallOut(searchValue);
});

$('button.btn.btn-primary').click(function(){
  var $coinOptions = $('.altcoinBtn')
  for(var i = 0; i < $coinOptions.length; i++){
    if($coinOptions[i].checked){
    console.log($coinOptions[i])
    }

  }
})



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

 $('.dropdown-button').dropdown({
      inDuration: 300,
      outDuration: 225,
      constrain_width: false, // Does not change width of dropdown to that of the activator
      hover: true, // Activate on hover
      gutter: 0, // Spacing from edge
      belowOrigin: false, // Displays dropdown below the button
      alignment: 'left' // Displays dropdown with edge aligned to the left of button
    }
  );



})
})
