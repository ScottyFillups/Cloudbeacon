//put this in a service later? or look up how to do it "properly" in angular

function getExpiry(years) {
    return new Date(new Date().setFullYear(new Date().getFullYear()+years));
}
function getTimePeriod(hour) {
    if (hour >= 5 && hour < 12) {
        return 'morning';
    }
    else if (hour >= 12 && hour < 18) {
        return 'afternoon';
    }
    else if (hour >= 18 && hour < 22) {
        return 'evening';
    }
    else {
        return 'night';
    }
}



//have a collection of strings?





angular.module('root', ['ngCookies'])
    .controller('index', ['$scope', '$cookies', '$interval', function($scope, $cookies, $interval) {
        var expiry;
        $scope.name;
        $scope.isUser;
        $scope.time = Date.now();
        $scope.timeperiod = getTimePeriod(new Date($scope.time).getHours());
        function tick() {
            $scope.time = Date.now();
        }
        tick();
        $interval(tick, 1000);
        $scope.submit = function() {
            expiry = getExpiry(5);
            $cookies.put('user', $scope.name, {expires: expiry});
            $scope.isUser = true;
        };
        $scope.clear = function() {
            $cookies.remove('user');
            $scope.isUser = false;
        };
        if ($cookies.get('user') !== undefined) {
            $scope.isUser = true;
            $scope.name = $cookies.get('user');
        } else {
            $scope.isUser = false;
        }
        //https://stackoverflow.com/questions/30662405/angularjs-storing-an-object-in-a-cookie-giving-result-of-object-object
        $scope.todoList = [];
        $scope.todoAdd = function() {
            $scope.todoList.push({todoText: $scope.todoInput, done: false});
            $scope.todoInput = '';
        };
        $scope.remove = function() {
            var oldList = $scope.todoList;
            $scope.todoList = [];
            angular.forEach(oldList, function(item) {
                if (!item.done) {
                    $scope.todoList.push(item);
                }
            });
        };
    }])
