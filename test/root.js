angular.module('root', ['ngCookies'])
    .controller('index', ['$scope', '$cookies', function($scope, $cookies) {
        $scope.name;
        $scope.welcome;
        $scope.submit = function() {
            $cookies.put('user', $scope.name);
             $scope.welcome = 'ur name is ' + $cookies.get('user');
        };
        if ($cookies.get('user') === undefined) {
            $scope.welcome = 'ur new! put in a name';
            $cookies.put('user', 'philip');
        } else {
            $scope.welcome = 'ur name is ' + $cookies.get('user');
        }
    }]);
