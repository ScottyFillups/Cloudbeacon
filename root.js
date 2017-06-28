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
function TodoList(ngCookies, cookieKey) {
    this.expiry;
    this.load = function(expiry) {
        this.expiry = expiry;
        var tasks = [];
        var tasksJSON = ngCookies.get(cookieKey);
        if (tasksJSON) {
            tasks = JSON.parse(tasksJSON);
        }
        return tasks;
    };
    this.add = function(tasks, desc) {
        var newTask = { desc: desc, done: false };
        tasks.push(newTask);
        ngCookies.put(cookieKey, JSON.stringify(tasks), {expires: this.expiry});
        return tasks;
    };
    this.remove = function(tasks) {
        for (var i = 0; i < tasks.length; i++) {
            if (tasks[i].done) {
                tasks.splice(i, 1);
                i--;
            }
        }
        ngCookies.put(cookieKey, JSON.stringify(tasks), {expires: this.expiry});
        return tasks;
    };
    this.clear = function() {
        ngCookies.remove(cookieKey);
        return [];
    };
}


var app = angular.module("root", ["ngCookies", "clock", "todo"]);

app.controller("index", ["$scope", "$cookies", "$interval", "timer", "expiryDate", "todoList",
        function($scope, $cookies, $interval, timer, expiryDate, todoList) {
        $scope.name;
        $scope.isUser;

        $scope.todoList = todoList.load(expiryDate);
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
            $scope.todoList = todoList.add($scope.todoList, $scope.todoInput);
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
    .value("cookieKey", "cloudbeacon-tasks")
    .service("todoList", ["$cookies", "cookieKey", TodoList]); 
