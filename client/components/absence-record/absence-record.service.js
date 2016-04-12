'use strict';

angular.module('app').factory('AbsenceRecord', function($resource) {
  return $resource(
    '/api/absence-records/:recordId/:controller/:selector/:filter', {}, {
      current: {
        method: 'GET',
        isArray: true,
        params: {
          selector: 'current'
        }
      },
      listCurrent: {
        method: 'GET',
        isArray: true,
        params: {
          controller: 'list',
          selector: 'current'
        }
      },
      students: {
        method: 'GET',
        isArray: true,
        params: {
          controller: 'students'
        }
      },
      school: {
        method: 'GET',
        isArray: true,
        params: {
          controller: 'school',
          filter: 'list'
        }
      }
    });
});
