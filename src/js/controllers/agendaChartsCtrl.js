agendaApp.controller('agendaChartsCtrl', ['$scope', '_', '$http', '$q', function ($scope, _, $http, $q) {

    function getAvailableAgendas() {
        //if (this.agendas.availableAgendas === null) {
        $http.get('/data/agendas.json').then(function onSuccess(response) {
            $scope.agendas.availableAgendas = response.data.availableAgendas;
        }, function onFailure(err) {
          //Not Implemented
        });
        //}
    }

    $scope.agendas = {
        selectedAgenda: null,

        availableAgendas: null
    };

    getAvailableAgendas();



    function getEventTimes(type) {
      return $q(function(resolve, reject) {
        // console.log('getEventTimes called.');
        $http.get('/data/eventTimes.json').then(function onSucess(response) {

          var eventTimes = _.filter(response.data, (event) => { return event.type === type; });
          // console.log('eventDetails:',eventTimes[0].eventDetails);
          resolve(eventTimes[0].eventDetails);

        }, function onFailure(err) {
          reject(err);
        });
      });
    }

    function getMeetingTime(agendaMeetingID) {
      return $q(function(resolve, reject) {
        // console.log('getMeetingTime called.');
        $http.get('./data/meetings.json').then(function onSuccess(response) {
          var agendaMeeting = _.filter(response.data.availableMeetings, (meeting) => { return meeting.id === agendaMeetingID; });
          // console.log('agendaMeeting:', agendaMeeting);
          var meetingDate = new Date(agendaMeeting[0].date);
          // console.log('meetingDate:', meetingDate);
          resolve(meetingDate);

        }, function onFailure(err) {
          reject(err);
        });
      });
    }

    $scope.meetingIDForAgenda = null;
    $scope.typeOfAgenda = null;
    $scope.agendaStatus = null;

    $scope.getChartData = function () {

        var agenda = _.filter($scope.agendas.availableAgendas,  (agendas) => { return agendas.id == $scope.agendas.selectedAgenda; })[0];
        $scope.meetingIDForAgenda = agenda.meetingID;
        $scope.typeOfAgenda = agenda.type;
        $scope.agendaStatus = agenda.status;

        var events = getEventTimes(agenda.type);
        var meetingTime = getMeetingTime(agenda.meetingID);

        $q.all([events, meetingTime]).then(function onSuccess(responses) {

          var eventTimes = responses[0];
          var meetingDate = responses[1];

          var today = new Date();
          var timeDifference = Math.abs(meetingDate.getTime() - today.getTime());
          var daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));

          var targetEvents = _.filter(eventTimes, (event) => { return event.days <= daysDifference; });
          //var target
          var seriesNames = _.map(eventTimes, 'event');
          var eventsOccured = _.filter(eventTimes, (event) => { return event.statusCode <= agenda.statusCode; });
          var seriesDataValues = _.map(eventsOccured, 'duration');
          var allEvents = _.map(eventTimes, 'duration');

          // var seriesData = [];
          //
          //
          // for (var i = 0; i < seriesNames.length; i++){
          //   var seriesObject = {
          //     name: seriesNames[i],
          //     data:[seriesDataValues[i]]
          //   };
          //   seriesData.push(seriesObject);
          // }
          console.log('totalEvents: %d, targetEvents: %d', eventTimes.length, targetEvents.length);

          $('#container').highcharts({
            chart: {
                type: 'areaspline'
            },
            title: {
                text: agenda.title
            },
            legend: {
                enabled: false,
                layout: 'vertical',
                align: 'left',
                verticalAlign: 'top',
                x: 100,
                y: 100,
                floating: true,
                borderWidth: 1,
                backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
            },
            xAxis: {
                categories: seriesNames,
                plotBands: [{ // visualize the weekend
                    from: targetEvents.length,
                    to: eventTimes.length,
                    color: 'rgba(68, 170, 213, .2)'
                }]
            },
            yAxis: {
                title: {
                    text: 'Days'
                }
            },
            tooltip: {
                shared: true,
                valueSuffix: ' units'
            },
            credits: {
                enabled: false
            },
            plotOptions: {
                areaspline: {
                    fillOpacity: 0.5
                }
            },
            series: [{
                name: agenda.title,
                data: seriesDataValues
              },{
                name: agenda.type,
                data: allEvents
            }
          ],
          colors: ['#2f7ed8', '#ECEDEE']

          });

        }, function onFailure(err) {
          //Not Implemented
        });


    };
}]);
