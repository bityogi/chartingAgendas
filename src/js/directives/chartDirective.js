agendaApp.directive('chartDirective', ['_', '$q', 'chartData', function(_, $q, chartData) {
  return {
    restrict: 'E',
    transclude: true,
    scope: {
        agendaId: '@'
      },
    templateUrl: 'templates/chart.html',
    link: function(scope, element, attrs) {
      scope.availableAgendas = [];

      console.log('Directive function was called!');

      scope.$watch('agendaId', function(newValue, oldValue) {
        console.log('agenda value changed!!!');

        getAgendas().then(function(agendas) {

          drawChart(newValue);

        }, function(err) {
          //Not Implemented.
        });

      });

      function getAgendas() {
        return $q(function(resolve, reject) {
          if (scope.availableAgendas.length === 0) {

            chartData.getAvailableAgendas().then(function(agendas) {
              scope.availableAgendas = agendas;

            }, function(err) {
              reject(err);
            });
          }
          resolve(scope.availableAgendas);
        });
      }

      function drawChart(agenda_id) {
        if (scope.agendaId > 0) {


          var agenda = _.filter(scope.availableAgendas,  (a) => { return a.id == agenda_id; })[0];

          console.log('agenda:', agenda);
          // $scope.meetingIDForAgenda = agenda.meetingID;
          // $scope.typeOfAgenda = agenda.type;
          // $scope.agendaStatus = agenda.status;

          var events = chartData.getEventTimes(agenda.type);
          var meetingTime = chartData.getMeetingTime(agenda.meetingID);

          $q.all([events, meetingTime]).then(function onSuccess(responses) {

            var eventTimes = responses[0];
            var meetingDate = responses[1];

            var today = new Date();
            var timeDifference = Math.abs(meetingDate.getTime() - today.getTime());
            var daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));

            var targetEvents = _.filter(eventTimes, (event) => { return event.days <= daysDifference; });
            var targetCode = _.sortBy(targetEvents, 'statusCode')[0].statusCode;

            var targetColor = '';
            if (agenda.statusCode < targetCode) {
              targetColor = 'rgb(232, 60, 17)';
            } else {
              targetColor = 'rgb(137, 216, 59)';
            }

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
                      from: eventTimes.length - targetEvents.length,
                      to: eventTimes.length,
                      color: targetColor
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
        }
      }
    }
  };
}]);
