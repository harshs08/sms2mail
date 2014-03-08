/**
 * Created with JetBrains WebStorm.
 * User: harshsingh
 * Date: 3/8/14
 * Time: 6:18 AM
 * To change this template use File | Settings | File Templates.
 */

var scotchTodo = angular.module('SMS2Gmail', []);

function mainController($scope, $http) {

    // when landing on the page, get all todos and show them
    $http.get('/api/usr')
        .success(function(data) {
            $scope.todos = data;
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    // when submitting the add form, send the text to the node API
    $scope.createTodo = function() {
        $http.post('/api/usr', $scope.formData)
            .success(function(data) {
                $('input').val('');
                $scope.todos = data;
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    // delete a todo after checking it
    $scope.deleteTodo = function(id) {
        $http.delete('/api/usr/' + id)
            .success(function(data) {
                $scope.todos = data;
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

}