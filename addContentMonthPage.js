var map = {};
setTimeout(function(){
        iniciaAplicacao();
        createCalculateButtonOnDOM();
    }, 3000);

var iniciaAplicacao = function (){
    $('.day-row').find('li').find('.time-entry-activity').each(function(a){
        var hoursNoFormat = $(this).find('span.time-entry-activity-hours');
        var $spanProjectName = $(this).find('span.time-entry-activity-name');
        var projectName = $spanProjectName.parents('li:first').attr('title');
        var hoursSplited = hoursNoFormat.text().split(" to ");

        getInitAndFinalHoursToAddToProject(hoursSplited[0], hoursSplited[1], projectName)
    });

    appendValueOnDOM();
};

var createCalculateButtonOnDOM = function(){
    var htmlToAppend = `&nbsp;&nbsp;<button id="buttonCalculateHours" class="btn btn-sm btn-outline-primary">Calculate Hours by Project</button>`;
    $(".subheader-wrapper").first().append(htmlToAppend);

    $("#buttonCalculateHours").on("click", function(){
        iniciaAplicacao();
    });
};

var appendValueOnDOM = function(){
    var divContainerToBeCreatedId = "containerSumHours";
    $(`#${divContainerToBeCreatedId}`).remove();

    var baseHtml = `
<div class="container" id="${divContainerToBeCreatedId}">
<table style="width:100%">
  <tbody id="tbodyToSumHours">
  <tr style="font-weight: bold;font-size:140%;">
    <th>Project Name</th>
    <th>Hours/Minutes</th>
  </tr>
  </tbody>
</table>
</div>`;

    var $divToAppendBefore = $(".monthly-report-pane").first();
    $divToAppendBefore.before(baseHtml);
    var $tbodySumHoursByProject = $("#tbodyToSumHours");

    for( var i of Object.keys(map)){
        console.log(i +" : "+ convertMinutesInFormatedHours(map[i]));
        $tbodySumHoursByProject.append(`<tr class="trCreateByScript"><td>${i}</td> <td>${convertMinutesInFormatedHours(map[i])}</td></tr>`);
    }
    map = {};
};

var getInitAndFinalHoursToAddToProject = function(initHour, finalHour, projectLabel){
    if(!map[projectLabel]){
        map[projectLabel] = 0;
    }

    var differenceBetweenTime = differenceBetweenTimeInMinutes(initHour, finalHour)
    map[projectLabel] = map[projectLabel] + differenceBetweenTime;
};

var convertMinutesInFormatedHours = function(totalMinutes){
    var hours = Math.floor(totalMinutes / 60);
    var minutes = totalMinutes % 60;
    return "" + hours + ":" + minutes;
};

var differenceBetweenTimeInMinutes = function(hourWithMinutesInit, hourWithMinutesEnd){
    var initHourSplited = hourWithMinutesInit.split(":");
    var endHourSplited = hourWithMinutesEnd.split(":");
    var initHourInSeconds = (initHourSplited[0]*60) + parseInt(initHourSplited[1], 10);
    var endHourInSeconds = (endHourSplited[0]*60) + parseInt(endHourSplited[1], 10);
    var differenceInMinutesBetweenBoth = endHourInSeconds - initHourInSeconds;
    return differenceInMinutesBetweenBoth;
};
