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

waitForEl('div.not-loading', function() {
  createCalculateButtonOnDOM();  
  calculateWorkedHoursByProject();
});

var extractTime = function(time){
  var hours = 0;
  var minutes = 0;
  if (time.includes("h")){
      prefix = time.split("h");
      hours = parseInt(prefix[0]);
      time = prefix.length > 1 ? prefix[1].trim() : time;
  }

  if (time.includes("m")){
    time = parseInt(time.split("m")[0]);
    minutes += (time/60);
  }

  return Math.round((hours + minutes + Number.EPSILON) * 100) / 100;
  
};

var isHourly = function(){
  var footerHours = document.querySelectorAll(".mr-4.mb-0 strong");
  return footerHours[footerHours.length - 1].textContent.match('([A-Za-z])');
};

var calculateWorkedHoursByProject = function (){
  var map = {};
  document.querySelectorAll('.time-slot').forEach(function(el) {

    var taskName = el.querySelector('p').textContent.trim();
    var taskHour = el.querySelector('span.time-slot-hours-total').textContent;

    if(!map[taskName]){
      map[taskName] = 0;
    }

    var hasCharacters = taskHour.match('([A-Za-z])');
    map[taskName] += hasCharacters ? extractTime(taskHour) : parseFloat(taskHour);
  })

  var oldSpans = document.getElementsByClassName('tasksSpan');

  while(oldSpans[0]) {
      oldSpans[0].parentNode.removeChild(oldSpans[0]);
  }
  var weekTotalReference = document.querySelector('.weekly-pane-footer-total').querySelector('p');
  for( var i of Object.keys(map)){
      var valueString = map[i].toString();
      map[i] = isHourly() ? valueString.split(".")[0] + "h " + decimalStringToMinutes(valueString) + "m" : map[i];
      weekTotalReference.insertAdjacentHTML('beforebegin', 
          `<p class="mr-4 mb-0 tasksSpan">${i} &nbsp;<strong>${map[i]}</strong></p>`);
  }
  var map = {};
};

var decimalStringToMinutes = function(valueString){
  return Math.round((parseInt(valueString.split(".")[1].substring(0,2))/100) * 60);
};

var createCalculateButtonOnDOM = function(){
    var htmlToAppend = `&nbsp;&nbsp;<button id="buttonCalculateHours" class="btn btn-sm btn-outline-primary">Calculate Hours by Project</button>`;
    $("span.week-info-create-request").first().append(htmlToAppend);

    $("#buttonCalculateHours").on("click", function(){
      calculateWorkedHoursByProject();  
      //window.location.href = "https://acdc2.avenuecode.com/monthly-report";
    });
};

