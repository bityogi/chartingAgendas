agendaApp.factory('chartData', ['$http', '$q', function ($http, $q) {

  var chartDataService = {};

  chartDataService.getAvailableAgendas = function getAvailableAgendas() {

    return $q(function (resolve, reject) {
      $http.get('/data/agendas.json').then(function onSuccess(response) {
        resolve(response.data.availableAgendas);
      }, function onFailure(err) {
        reject(err);
      });
    });
  };

  chartDataService.getEventTimes = function getEventTimes(type) {
    return $q(function (resolve, reject) {
      // console.log('getEventTimes called.');
      $http.get('/data/eventTimes.json').then(function onSucess(response) {

        var eventTimes = _.filter(response.data, event => {
          return event.type === type;
        });
        // console.log('eventDetails:',eventTimes[0].eventDetails);
        resolve(eventTimes[0].eventDetails);
      }, function onFailure(err) {
        reject(err);
      });
    });
  };

  chartDataService.getMeetingTime = function getMeetingTime(agendaMeetingID) {
    return $q(function (resolve, reject) {
      // console.log('getMeetingTime called.');
      $http.get('./data/meetings.json').then(function onSuccess(response) {
        var agendaMeeting = _.filter(response.data.availableMeetings, meeting => {
          return meeting.id === agendaMeetingID;
        });
        // console.log('agendaMeeting:', agendaMeeting);
        var meetingDate = new Date(agendaMeeting[0].date);
        // console.log('meetingDate:', meetingDate);
        resolve(meetingDate);
      }, function onFailure(err) {
        reject(err);
      });
    });
  };

  return chartDataService;
}]);