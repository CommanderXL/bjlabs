/**
 * Created by XRene on 2015/10/19.
 */
var app = angular.module('app', ['ui.router', 'oc.lazyLoad']);

app.run(function ($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
});

app.config(['$ocLazyLoadProvider', function ($ocLazyLoadProvider) {
    $ocLazyLoadProvider.config({});
}])

app.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/chart');

    $stateProvider.state('control', {
        url: '/control',
        templateUrl: './partials/control/control.html'
    })

    $stateProvider.state('develop', {
        url: '/develop',
        templateUrl: './partials/develop/develop.html'
    });

    $stateProvider.state('photos', {
        url: '/photo',
        templateUrl: './partials/photos/photo.html'
    })

    $stateProvider.state('chart', {
        url: '/chart',
        templateUrl: './partials/charts/chartOne.html'
    });

    $stateProvider.state('tables', {
        url: '/tables',
        templateUrl: './partials/tables/tables.html',
    });

    $stateProvider.state('tables.num0', {
        url: '/num0?areaID',
        views: {
            tables: {
                templateUrl: './partials/tables/tables.num0.html',
                controller: 'table0Ctrl'
            }
        },
    });

    $stateProvider.state('tables.num1', {
        url: '/num1?areaID&from&to',
        views: {
            'tables': {
                templateUrl: './partials/tables/tables.num1.html',
                controller: 'table1Ctrl'
            }
        },
    });

    $stateProvider.state('tables.num2', {
        url: '/num2?areaID&from&to',
        views: {
            'tables': {
                templateUrl: './partials/tables/tables.num2.html',
                controller: 'table2Ctrl'
            }
        }
    });

    $stateProvider.state('tables.num3', {
        url: '/num3?areaID&from&to',
        views: {
            'tables': {
                templateUrl: './partials/tables/tables.num3.html',
                controller: 'table3Ctrl'
            }
        }
    });

    $stateProvider.state('display', {
        url: '/display',
        templateUrl: './partials/display/display.html',
        /*resolve: {
            loadMyCtrl: function($ocLazyLoad){
                return $ocLazyLoad.load(['./partials/controllers/display_controller']);
            }
        }*/
    })
})