(function () {
'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.directive('foundItems', FoundItemsDirective);

// Controller
NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService) {
  var ctrl = this;
  ctrl.searchTerm = "";
  ctrl.found = [];
  ctrl.nothingFound = false;

  ctrl.narrowDown = function () {
    if (!ctrl.searchTerm.trim()) {
      ctrl.found = [];
      ctrl.nothingFound = true;
      return;
    }

    MenuSearchService.getMatchedMenuItems(ctrl.searchTerm)
      .then(function (items) {
        ctrl.found = items;
        ctrl.nothingFound = items.length === 0;
      });
  };

  ctrl.removeItem = function (index) {
    ctrl.found.splice(index, 1);
  };
}

// Service
MenuSearchService.$inject = ['$http'];
function MenuSearchService($http) {
  var service = this;

  service.getMatchedMenuItems = function (searchTerm) {
    return $http({
      method: "GET",
      url: "https://coursera-jhu-default-rtdb.firebaseio.com/menu_items.json"
    }).then(function (response) {
      var allItems = response.data.menu_items;
      var matchedItems = [];

      for (var i = 0; i < allItems.length; i++) {
        if (allItems[i].description.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) {
          matchedItems.push(allItems[i]);
        }
      }

      return matchedItems;
    });
  };
}

// Directive
function FoundItemsDirective() {
  var ddo = {
    restrict: 'E',
    scope: {
      items: '<',
      onRemove: '&'
    },
    template:
      `<ul>
         <li ng-repeat="item in items track by $index">
           {{ item.name }}, {{ item.short_name }}, {{ item.description }}
           <button ng-click="onRemove({ index: $index })">Don't want this one!</button>
         </li>
       </ul>`
  };

  return ddo;
}

})();
