agendaApp.controller('officeChartsCtrl', ['$scope', 'chartData', function ($scope, chartData) {

  $scope.offices = {

    selectedOffice: 0,

    availableOffices: null
  };

  $scope.agendas = [];

  chartData.getOffices().then(function (offices) {
    $scope.offices.availableOffices = offices;
  });

  $scope.getChartData = function() {
    console.log('getChartData says Hello. officeID=', $scope.offices.selectedOffice);

    chartData.getAgendasForOffice($scope.offices.selectedOffice).then(
      function (agendas) {
        console.log('agendas:', agendas);
        $scope.agendas = agendas;

        console.log('$scope.agendas now=', $scope.agendas);
      },
      function (err) {

      }
    );
  };

}]);
