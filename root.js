function Timer() {
    this.tick = function() {
        return Date.now();
    };
    this.getTimePeriod = function() {
        hour = new Date().getHours();
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
    };
}
function TodoList(ngCookies) {
    this.index = 0;
    this.list = [];
    this.load = function() {
        var tempTask;
        while (tempTask = $cookies.getObject("cloudbeacon-task" + index) !== undefined) {
            $scope.todoList.push(tempTask);
            index++;
        }
    };
    this.add = function(task, expiry) {
        var obj = {todoText: task, done: false};
        list.todoList.push(obj);
        ngCookies.putObject("cloudbeacon-task" + index, obj, {expires: expiry});
        index++;
    };
    this.remove = function() {
        for (var i = 0; i < index; i++) {
            if (this.list[i].done) {
                this.list.splice(i, 1);
                ngCookies.remove("cloudbeacon-task" + i);
            }
        }
    };
    this.clear = function() {
        for (var i = 0; i < index; i++) {
            ngCookies.remove("cloudbeacon-task" + i);
        }
        $scope.todoList = [];
    };
}


function getExpiry(years) {
    return new Date(new Date().setFullYear(new Date().getFullYear()+years));
}

var app = angular.module("root", ["ngCookies", "clock"]);

app.controller("index", ["$scope", "$cookies", "$interval", "timer", "expiryDate", 
        function($scope, $cookies, $interval, timer, expiryDate) {
        $scope.name;
        $scope.isUser;
       
        $scope.time = timer.tick();
        $scope.timestring = timer.getTimePeriod();
        $interval(function() {
            $scope.time = timer.tick();
        }, 1000);
        
        $scope.submit = function() {
            $cookies.put("user", $scope.name, {expires: expiryDate});
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
            $cookies.putObject("todo" + i, obj, {expires: expiryDate});
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

angular.module("clock", [])
    .service("timer", Timer)
    .value("yearsTillExpiry", 5)
    .factory("expiryDate", ["yearsTillExpiry", function(yearsTillExpiry) {
        return new Date(new Date().setFullYear(new Date().getFullYear() + yearsTillExpiry));
    }]);
angular.module("todo", ["ngCookies"])
    .service("todoList", ["$cookies", TodoList]); 
