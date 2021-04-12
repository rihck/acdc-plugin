/*setTimeout(function(){
        createCalculateButtonOnDOM();
    }, 2000);*/


var waitForEl = function(selector, callback) { 
  if (jQuery(selector).length) {
        callback();
      } else {
        setTimeout(function() {
          waitForEl(selector, callback);
        }, 100);
      }
  };

waitForEl('.infoButtonTimesheet', function() {
  createCalculateButtonOnDOM();  
  calculateWorkedHoursByProject();
});

var calculateWorkedHoursByProject = function (){
  var map = {};
  document.querySelectorAll('.time-slot').forEach(function(el) {

    var taskName = el.querySelector('p.time-slot-info-text').textContent.trim();
    var taskHour = el.querySelector('div.time-slot-info small').textContent;

    if(!map[taskName]){
      map[taskName] = 0;
    }

    var beingAndEnd = taskHour.split('to');
    var begin = beingAndEnd[0].trim();
    var end = beingAndEnd[1].trim();

    map[taskName] += getDifferenceInMsBetweenTwoTimes(begin, end);
});

  var oldSpans = document.getElementsByClassName('tasksSpan');

  while(oldSpans[0]) {
    oldSpans[0].parentNode.removeChild(oldSpans[0]);
  }

  var weekTotalReference = document.querySelector('.week-total');

  for( var i of Object.keys(map)){
      var convertedInHourMinuteFormat = convertMsDifferenceInHourMinuteFormat(map[i]);

    weekTotalReference.insertAdjacentHTML('beforebegin', `<p class="mr-4 mb-0 tasksSpan">${i} &nbsp;<strong>${convertedInHourMinuteFormat}</strong></p>`);
  }
  var map = {};
};

function getDifferenceInMsBetweenTwoTimes(initHourAndMinute, endHourAndMinute){
  var initSplited = initHourAndMinute.split(':');
  var endSplited  = endHourAndMinute.split(':');
  var date1 = new Date(2000, 0, 1,  initSplited[0], initSplited[1]);
  var date2 = new Date(2000, 0, 1,  endSplited[0],  endSplited[1]);
  
  //To handle when times are oposite of midnight
  if (date2 < date1) {
      date2.setDate(date2.getDate() + 1);
  }
  
  return date2 - date1;
}

function convertMsDifferenceInHourMinuteFormat(diff){
  var msec = diff;
  var hh = `0${Math.floor(msec / 1000 / 60 / 60)}`;
  msec -= hh * 1000 * 60 * 60;
  var mm = `0${Math.floor(msec / 1000 / 60)}`;
  msec -= mm * 1000 * 60;
  var ss = `0${Math.floor(msec / 1000)}`;
  msec -= ss * 1000;
  return hh.slice(-2) + ":" + mm.slice(-2);
}

var createCalculateButtonOnDOM = function(){
    var htmlToAppend = `&nbsp;&nbsp;<button id="buttonCalculateHours" class="btn btn-sm btn-outline-primary">Calculate Hours by Project</button>`;
    $("span.week-info-create-request").first().append(htmlToAppend);

    $("#buttonCalculateHours").on("click", function(){
      calculateWorkedHoursByProject();  
      //window.location.href = "https://acdc2.avenuecode.com/monthly-report";
    });
};

