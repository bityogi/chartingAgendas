agendaApp.controller('meetingChartsCtrl', ['$scope', '_', '$q', 'chartData', function ($scope, _, $q, chartData) {

  $scope.meetings = {

    selectedMeeting: 0,

    availableMeetings: null
  };

  $scope.agendas = [];

  chartData.getMeetings().then(function (meetings) {
    $scope.meetings.availableMeetings = meetings;
  });

  $scope.getChartData = function () {
    console.log('getChartData says Hello. meeting_id=', $scope.meetings.selectedMeeting);

    chartData.getAgendasForMeeting($scope.meetings.selectedMeeting).then(function (agendas) {
      console.log('agendas:', agendas);
      $scope.agendas = agendas;

      console.log('$scope.agendas now=', $scope.agendas);
    }, function (err) {});
  };
}]);