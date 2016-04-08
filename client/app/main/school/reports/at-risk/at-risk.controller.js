'use strict';

var app = angular.module('app');

function AtRiskReportCtrl($scope, $timeout, uiGridGroupingConstants,
  AbsenceRecord) {
  $scope.loading = true;
  $scope.gridOptions = {
    rowHeight: 27,
    enableSorting: true,
    enableGridMenu: true,
    enableFiltering: true,
    treeRowHeaderAlwaysVisible: false,
    exporterMenuPdf: false
  };
  $scope.gridOptions.columnDefs = [{
    name: 'school.name',
    displayName: 'School Name',
    minWidth: 150,
    grouping: {groupPriority: 0},
    sort: {priority: 0, direction: 'asc'}
  }, {
    name: 'entries.student.studentId',
    displayName: 'Student Id',
    minWidth: 150,
    cellTemplate: '<div class="ui-grid-cell-contents">' +
                  '<a ui-sref="student.outreaches({studentId: ' +
                  'row.entity.entries.student._id})">' +
                  '{{row.entity.entries.student.studentId}}</a>' +
                  '</div>'
  }, {
    name: 'entries.student.firstName',
    displayName: 'First Name',
    minWidth: 150
  }, {
    name: 'entries.student.lastName',
    displayName: 'Last Name',
    minWidth: 150
  }, {
    name: 'entries.absences',
    displayName: 'Absences',
    type: 'number',
    minWidth: 100,
    treeAggregationType: uiGridGroupingConstants.aggregation.SUM
  }, {
    name: 'entries.absencesDelta',
    displayName: 'Δ',
    type: 'number',
    width: 50
  }, {
    name: 'entries.tardies',
    displayName: 'Tardies',
    type: 'number',
    minWidth: 100,
    treeAggregationType: uiGridGroupingConstants.aggregation.SUM
  }, {
    name: 'entries.tardiesDelta',
    displayName: 'Δ',
    type: 'number',
    width: 50
  }, {
    name: 'entries.present',
    displayName: 'Present',
    type: 'number',
    minWidth: 100
  }, {
    name: 'entries.enrolled',
    displayName: 'Enrolled',
    type: 'number',
    minWidth: 100
  }, {
    name: 'entries.student.iep',
    displayName: 'IEP',
    enableCellEdit: true,
    type: 'boolean',
    width: 100,
    treeAggregationType: uiGridGroupingConstants.aggregation.SUM
  }, {
    name: 'entries.student.cfa',
    displayName: 'CFA',
    enableCellEdit: true,
    type: 'boolean',
    width: 100,
    treeAggregationType: uiGridGroupingConstants.aggregation.SUM
  }, {
    name: 'entries.student.withdrawn',
    displayName: 'Withdrawn',
    enableCellEdit: true,
    type: 'boolean',
    width: 100,
    filter: {
      noTerm: true,
      condition: function(searchTerm, cellValue) {
        if ($scope.showWithdrawn) {
          return true;
        }
        return cellValue === false;
      }
    },
    visible: false
  }, {
    name: 'updated',
    field: 'updated()',
    displayName: 'Updated',
    type: 'date',
    cellFilter: 'date:\'MM/dd/yy\'',
    width: 125
  }];

  $scope.gridOptions.onRegisterApi = function(gridApi) {
    $scope.gridApi = gridApi;
    gridApi.edit.on.afterCellEdit($scope, function(rowEntity, colDef, n, o) {
      if (n !== o) {
        switch (colDef.name) {
          case 'entries.student.iep':
            $scope.updateIEP(rowEntity.entries.student);
            break;
          case 'entries.student.cfa':
            $scope.updateCFA(rowEntity.entries.student);
            break;
          case 'entries.student.withdrawn':
            $scope.updateWithdrawn(rowEntity.entries.student);
            break;
        }
      }
    });
    $scope.gridOptions.data = AbsenceRecord.listCurrent({filter: 'at-risk'});
    $scope.gridOptions.data.$promise.then(function(data) {
      _.forEach(data, function(row) {
        row.updated = function() {
          return row.entries.date || row.date;
        };
      });
      // NOTE: Hack to default to expanded rows on initial load.
      // https://github.com/angular-ui/ui-grid/issues/3841
      $timeout(gridApi.treeBase.expandAllRows);
      $scope.loading = false;
    });
  };

  $scope.$watch('showWithdrawn', function(n, o) {
    if (n !== o) {
      $scope.gridApi.grid.refresh();
      $timeout($scope.gridApi.treeBase.expandAllRows);
    }
  });
}

app.controller('AtRiskReportCtrl', AtRiskReportCtrl);