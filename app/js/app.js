var agendaApp = angular.module('agendaApp', []).constant('_', window._).run(function ($rootScope) {
    $rootScope._ = window._;
});

agendaApp.controller('TabsCtrl', ['$scope', '$templateRequest', '$sce', '$compile', function ($scope, $templateRequest, $sce, $compile) {
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

        $templateRequest(templateUrl).then(function (template) {
            // template is the HTML template as a string

            // Let's put it into an HTML element and parse any directives and expressions
            // in the code. (Note: This is just an example, modifying the DOM from within
            // a controller is considered bad style.)
            $compile($("#mainView").html(template).contents())($scope);
        }, function () {
            // An error has occurred
        });
        $scope.currentTab = tab.url;
    };

    $scope.isActiveTab = function (tabUrl) {
        return tabUrl == $scope.currentTab;
    };
}]);



agendaApp.controller('meetingChartsCtrl', ['$scope', function ($scope) {}]);

agendaApp.controller('officeChartsCtrl', ['$scope', function ($scope) {}]);
