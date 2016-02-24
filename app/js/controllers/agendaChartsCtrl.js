agendaApp.controller('agendaChartsCtrl', ['$scope', '_', '$q', 'chartData', function ($scope, _, $q, chartData) {

    $scope.agendas = {
        selectedAgenda: 0,

        availableAgendas: null
    };

    chartData.getAvailableAgendas().then(function (agendas) {
        $scope.agendas.availableAgendas = agendas;
    });
}]);