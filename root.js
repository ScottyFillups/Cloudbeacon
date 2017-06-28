function Timer(ngInterval) {
    this.tick = function() {
        return Date.now();
    };
}


function getExpiry(years) {
    return new Date(new Date().setFullYear(new Date().getFullYear()+years));
}
function getTimePeriod(hour) {
    if (hour >= 5 && hour < 12) {
        return "Good morning";
    }
    else if (hour >= 12 && hour < 18) {
        return "Good afternoon";
    }
    else if (hour >= 18 && hour < 22) {
        return "Good evening";
    }
    else {
        return "It's getting late, ";
    }
}

var app = angular.module("root", ["ngCookies", "services"]);

app.controller("index", ["$scope", "$cookies", "$interval", "timer", function($scope, $cookies, $interval, timer) {
        var expiry = getExpiry(5)
        $scope.name;
        $scope.isUser;
        $scope.time = timer.tick();
        $interval(function() {
            $scope.time = timer.tick();
        }, 1000);
        $scope.timestring = getTimePeriod(new Date($scope.time).getHours());
        
        $scope.submit = function() {
            $cookies.put("user", $scope.name, {expires: expiry});
            $scope.isUser = true;
        };
        $scope.clear = function() {
            $cookies.remove("user");
            $scope.isUser = false;
            angular.forEach($scope.todoList, function(item, index) {
                $cookies.remove("todo" + index);
            });
            $scope.todoList = [];
        };
        if ($cookies.get("user") !== undefined) {
            $scope.isUser = true;
            $scope.name = $cookies.get("user");
        } else {
            $scope.isUser = false;
        }
        $scope.todoList = [];
        var i = 0;
        var temp;
        while ((temp = $cookies.getObject("todo" + i)) !== undefined) {
            $scope.todoList.push(temp);
            i++;
        }
        $scope.todoAdd = function() {
            var obj = {todoText: $scope.todoInput, done: false};
            $scope.todoList.push(obj);
            $scope.todoInput = "";
            console.log(i);
            $cookies.putObject("todo" + i, obj, {expires: expiry});
            i++;
        };
        $scope.remove = function() {
            var oldList = $scope.todoList;
            $scope.todoList = [];
            angular.forEach(oldList, function(item, index) {
                if (!item.done) {
                    $scope.todoList.push(item);
                } else {
                    $cookies.remove("todo" + index);
                }
            });
        };
    }]);

angular.module("services", [])
    .service("timer", ["$interval", Timer]);
