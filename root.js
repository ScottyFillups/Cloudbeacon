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
    //bug: you'll need to set a second cookie keeping track of max #
    //list can't be stored as a isntance variable because done property updates on user input
    this.index = 0;
    this.load = function() {
        var tempTask;
        var list = [];
        while ((tempTask = ngCookies.getObject("cloudbeacon-task" + this.index)) !== undefined) {
            list.push(tempTask);
            this.index++;
        }
        return list;
    };
    this.add = function(list, task, expiry) {
        var obj = {todoText: task, done: false};
        list.push(obj);
        ngCookies.putObject("cloudbeacon-task" + this.index, obj, {expires: expiry});
        this.index++;
        return list;
    };
    this.remove = function(list) {
        for (var i = 0; i < this.index; i++) {
            if (list[i].done) {
                ngCookies.remove("cloudbeacon-task" + i);
                list.splice(i, 1);
                this.index--;
                i--;
            }
        }
        return list;
    };
    this.clear = function() {
        for (var i = 0; i < this.index; i++) {
            ngCookies.remove("cloudbeacon-task" + i);
        }
        this.index = 0;
        return [];
    };
}


function getExpiry(years) {
    return new Date(new Date().setFullYear(new Date().getFullYear()+years));
}

var app = angular.module("root", ["ngCookies", "clock", "todo"]);

app.controller("index", ["$scope", "$cookies", "$interval", "timer", "expiryDate", "todoList",
        function($scope, $cookies, $interval, timer, expiryDate, todoList) {
        $scope.name;
        $scope.isUser;

        $scope.todoList = todoList.load();
        $scope.time = timer.tick();
        $scope.timestring = timer.getTimePeriod();
        $interval(function() {
            console.log($scope.todoList);
            $scope.time = timer.tick();
        }, 1000);
        
        $scope.submit = function() {
            $cookies.put("user", $scope.name, {expires: expiryDate});
            $scope.isUser = true;
        };
        $scope.clear = function() {
            $cookies.remove("user");
            $scope.name = "";
            $scope.isUser = false;
            $scope.todoList = todoList.clear();
        };
        if ($cookies.get("user") !== undefined) {
            $scope.isUser = true;
            $scope.name = $cookies.get("user");
        } else {
            $scope.isUser = false;
        }
        
        $scope.todoAdd = function() {
            $scope.todoList = todoList.add($scope.todoList, $scope.todoInput, expiryDate);
            $scope.todoInput = "";
        };
        $scope.remove = function() {
            $scope.todoList = todoList.remove($scope.todoList);
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
