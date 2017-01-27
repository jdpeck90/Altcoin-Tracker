$(document).ready(function() {
$(function(){
console.log('connected')


/////////------GET DATA------/////////

function makeCallLoggedOut(searchValue){
    $.ajax({
      url: 'https://api.cryptonator.com/api/ticker/'+searchValue
    }).success(function(data) {
        console.log(data,'data-in')
      displayStatusOut(data.ticker)
    })
  }
function makeCallLoggedIn(searchValue){
    $.ajax({
      url: 'https://api.cryptonator.com/api/ticker/'+searchValue
    }).success(function(data) {
      console.log(data,'data-out')
      displayStatusIn(data.ticker)
    })
  }

function restructureData(rawData){
  var bldg = [];
  var counter = 0;

  for(var key in rawData){
    var obj = {}
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


/////////------GRAB DIVS FROM------/////////

var getCoinData = function(){
  var $tickerDisplays = $('div#priceTicker');
    for(var i = 0; i < $tickerDisplays.length; i++){
      var $bitData = $tickerDisplays[i].dataset.coin
      var bitUrl = $bitData.replace('_btn','-usd')
      makeCallLoggedIn(bitUrl)
    }
}
getCoinData()


/////////------DELETE USER------/////////

var deleteUser = function(){
  console.log('works')
  alert('You have deleted you account');
}

/////////------DISPLAY DATA------/////////
var tickerCount = 0;
function displayStatusIn(rawData) {
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
    var $volumeTicker = $('div#volumeTicker')[tickerCount]
    var $changeTicker = $('div#changeTicker')[tickerCount]
    var $ticker = $('div#ticker')[tickerCount]
    var $base = $('div#base')[tickerCount]
    var $displayGroup = $('div#bitTitle')[tickerCount]

    var $h2Base = $('<h2>'+base+'</h2>')
    $($h2Base).attr('id',base)

    var $displayPrice = $('<h2>'+'$'+price+'</h2>')
    var $displayVolume = $('<h2>'+volume+'</h2>')
    var $displayChange = $('<h2>'+change+'%'+'</h2>')

    var $altCoinMenu = $('ul.altNav')
    var $coinLi = $('<li><i class="material-icons">label_outline</i><a href="#'+base+'">'+base+'</a></li>');
    $($altCoinMenu).append($coinLi)


    $($displayGroup).append($h2Base)
    $($priceTicker).append($displayPrice)
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
    var $volumeTicker = $('div#volumeTicker')[0]
    var $changeTicker = $('div#changeTicker')[0]
    var $ticker = $('div#ticker')[0]
    var $base = $('div#base')[0]
    var $displayGroup = $('div#bitTitle')[0]

    var $h2Base = $('<h2>'+base+'</h2>')
    $($h2Base).attr('id',base)
    console.log($h2Base,'h2base')
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

$(document).ready(function(){
    $('.scrollspy').scrollSpy();
  });

/////////------CLICK LISTENERS------/////////
$( ".dropDownChoice" ).click(function(d) {
  var searchValue = d.target.dataset.searchvalue;
  makeCallLoggedOut(searchValue);
});



/////////------DROP BUTTON SPECS------/////////
 $('.dropdown-button').dropdown({
      inDuration: 300,
      outDuration: 225,
      constrain_width: true, // Does not change width of dropdown to that of the activator
      hover: true, // Activate on hover
      gutter: 0, // Spacing from edge
      belowOrigin: false, // Displays dropdown below the button
      alignment: 'left' // Displays dropdown with edge aligned to the left of button
    }
  );


$('select.alert').material_select();
})
})
