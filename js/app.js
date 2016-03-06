(function($angular) {
    'use strict';

    $angular
    .module('app', [
        'jamfu',
        'ui.router'
    ])
    .controller('appController', ['$scope', 'StorageService', function($scope, storage) {

        $scope.headline = 'Pikka Pokka';
        $scope.icon = 'tint';

    }]);

})(window.angular);
