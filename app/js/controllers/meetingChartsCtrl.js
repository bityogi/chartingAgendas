agendaApp.controller('meetingChartsCtrl', ['$scope', '_', '$q', 'chartData', function ($scope, _, $q, chartData) {

    $scope.meetings = {
        selectedMeeting: null,

        availableMeetings: null
    };

    chartData.getMeetings().then(function (meetings) {
        $scope.meetings.availableMeetings = meetings;
    });
}]);