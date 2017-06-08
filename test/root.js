//put this in a service later? or look up how to do it "properly" in angular

function getExpiry(years) {
    return new Date(new Date().setFullYear(new Date().getFullYear()+years));
}

angular.module('root', ['ngCookies'])
    .controller('index', ['$scope', '$cookies', function($scope, $cookies) {
        var expiry = getExpiry(5);
        $scope.name;
        $scope.welcome;
        $scope.isuser = true;
        $scope.submit = function() {
            $cookies.put('user', $scope.name, {expires: expiry});
            $scope.welcome = 'ur name is ' + $cookies.get('user');
            $scope.isuser = true;
        };
        $scope.clear = function() {
            $cookies.put('user', undefined);
            $scope.isuser = false;
        };
        if ($cookies.get('user') === undefined) {
            $scope.welcome = 'ur new! put in a name';
            $scope.isuser = false;
        } else {
            $scope.welcome = 'ur name is ' + $cookies.get('user');
            $scope.isuser = true;
        }
    }]);
