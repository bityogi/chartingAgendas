var agendaApp = angular.module('agendaApp', [])
  .constant('_', window._)
  .run(function ($rootScope) {
     $rootScope._ = window._;
  });


agendaApp.controller('TabsCtrl', ['$scope', '$templateRequest', '$sce', '$compile',
    function ($scope, $templateRequest, $sce, $compile) {
    $scope.tabs = [{
            title: 'Agenda',
            url: 'templates/agenda.html'
        }, {
            title: 'Meeting',
            url: 'templates/meeting.html'
        }, {
            title: 'Office',
            url: 'templates/office.html'
    }];

    $scope.currentTab = 'templates/agenda.html';

    $scope.onClickTab = function (tab) {

      var templateUrl = $sce.getTrustedResourceUrl(tab.url);

      $templateRequest(templateUrl).then(
        function(template) {
          // template is the HTML template as a string

          // Let's put it into an HTML element and parse any directives and expressions
          // in the code. (Note: This is just an example, modifying the DOM from within
          // a controller is considered bad style.)
            $compile($("#mainView").html(template).contents())($scope);
        }, function() {
          // An error has occurred
      });
        $scope.currentTab = tab.url;
    };

    $scope.isActiveTab = function(tabUrl) {
        return tabUrl == $scope.currentTab;
    };
}]);


agendaApp.controller('agendaChartsCtrl', ['$scope', '_', '$http', function($scope, _, $http) {

  function getAvailableAgendas() {
    //if (this.agendas.availableAgendas === null) {
      console.log('Getting Agendas');
      $http.get('/data/agendas.json')
        .then(function onSuccess(response) {
          console.log(response.data.availableAgendas);
          $scope.agendas.availableAgendas = response.data.availableAgendas;
        }, function onFailure(err) {

        });
    //}
  }

  $scope.agendas = {
    selectedAgenda: null,

    availableAgendas: null
  };

  getAvailableAgendas();

  $scope.getChartData = function(meeting) {

    $('#container').highcharts({
        chart: {
            type: 'bar'
        },
        title: {
            text: 'Procurement for Charts for EMIS'
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
        series: [{
            name: 'Submit to Board',
            data: [3] //[3, 4, 4, 2, 5]
        }, {
            name: 'GM Reviews',
            data: [3] //[3, 4, 4, 2, 5]
        }, {
            name: 'Revisions',
            data: [3] //[3, 4, 4, 2, 5]
        }, {
            name: 'AGM Reviews',
            data: [2] //[2, 2, 3, 2, 1]
        }, {
            name: 'Create Content',
            data: [5] //[5, 3, 4, 7, 2]
        }],
        colors: ['#2f7ed8', '#0d233a', '#0d233a', '#0d233a', '#0d233a']
    });

  };

}]);



agendaApp.controller('officeChartsCtrl', ['$scope', function($scope) {

}]);
