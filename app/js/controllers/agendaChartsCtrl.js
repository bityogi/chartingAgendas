agendaApp.controller('agendaChartsCtrl', ['$scope', '_', '$http', '$q', function ($scope, _, $http, $q) {

    function getAvailableAgendas() {
        //if (this.agendas.availableAgendas === null) {
        console.log('Getting Agendas');
        $http.get('/data/agendas.json').then(function onSuccess(response) {
            console.log(response.data.availableAgendas);
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
        console.log('Getting event timelines');
        $http.get('/data/eventTimes.json').then(function onSucess(response) {
          console.log(response.data);

          var eventTimes = _.filter(response.data, (events) => { return events.type === type; });
          resolve(eventTimes[0].eventDetails);

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

        events.then(function onSuccess(eventTimes) {
          var seriesNames = _.map(eventTimes, 'event');
          var seriesDataValues = _.map(eventTimes, 'duration');

          var seriesData = [];


          for (var i = 0; i < seriesNames.length; i++){
            var seriesObject = {
              name: seriesNames[i],
              data:[seriesDataValues[i]]
            };
            seriesData.push(seriesObject);
          }

          $('#container').highcharts({
            chart: {
              type: 'bar'
          },
          title: {
              text: agenda.title,
          },
          xAxis: {
              categories: [' '] //['Apples', 'Oranges', 'Pears', 'Grapes', 'Bananas']
          },
          yAxis: {
              min: 0,
              title: {
                  text: 'Agenda Timeline'
              }
          },
          legend: {
              reversed: true
          },
          plotOptions: {
              series: {
                  stacking: 'normal'
              }
          },
          series: seriesData,
          // series: [{
          //     name: 'Submit to Board',
          //     data: [3] //[3, 4, 4, 2, 5]
          // }, {
          //     name: 'GM Reviews',
          //     data: [3] //[3, 4, 4, 2, 5]
          // }, {
          //     name: 'Revisions',
          //     data: [3] //[3, 4, 4, 2, 5]
          // }, {
          //     name: 'AGM Reviews',
          //     data: [2] //[2, 2, 3, 2, 1]
          // }, {
          //     name: 'Create Content',
          //     data: [5] //[5, 3, 4, 7, 2]
          // }],
          colors: ['#2f7ed8', '#0d233a', '#0d233a', '#0d233a', '#0d233a']

          });

        }, function onFailure(err) {
          //Not Implemented
        });


    };
}]);
