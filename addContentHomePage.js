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

var calculateWorkedHoursByProject = function (){
  var map = {};
  document.querySelectorAll('.time-slot').forEach(function(el) {

    var taskName = el.querySelector('p').textContent.trim();
    var taskHour = el.querySelector('span.time-slot-hours-total').textContent;

    if(!map[taskName]){
      map[taskName] = 0;
    }

    map[taskName] = map[taskName] + parseFloat(taskHour);
  })

  var oldSpans = document.getElementsByClassName('tasksSpan');

  while(oldSpans[0]) {
      oldSpans[0].parentNode.removeChild(oldSpans[0]);
  }
  var weekTotalReference = document.querySelector('.weekly-pane-footer-total').querySelector('p');
  for( var i of Object.keys(map)){
      weekTotalReference.insertAdjacentHTML('beforebegin', 
          `<p class="mr-4 mb-0 tasksSpan">${i} &nbsp;<strong>${map[i]}</strong></p>`);
  }
  var map = {};
};

var createCalculateButtonOnDOM = function(){
    var htmlToAppend = `&nbsp;&nbsp;<button id="buttonCalculateHours" class="btn btn-sm btn-outline-primary">Calculate Hours by Project</button>`;
    $("span.week-info-create-request").first().append(htmlToAppend);

    $("#buttonCalculateHours").on("click", function(){
      calculateWorkedHoursByProject();  
      //window.location.href = "https://acdc2.avenuecode.com/monthly-report";
    });
};

