angular.module('root', ['ngCookies'])
    .controller('index', ['$scope', '$cookies', function($scope, $cookies) {
        if ($cookies.get('user') === undefined) {
            $scope.welcome = 'ur new!';
            $cookies.put('user', 'philip');
        } else {
            $scope.welcome = 'ur name is ' + $cookies.get('user');
        }
    }]);
