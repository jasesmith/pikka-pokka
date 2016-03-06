(function($angular, _, Hammer) {
    'use strict';

    var _colors = [
      // '#B51917',
      '#E7302F',
      '#F26091',
      '#FF3B80',
      '#AC41BE',
      '#7E53C5',
      '#5B69C3',
      '#3BA3F8',
      '#18B5F9',
      '#0EC6DC',
      '#19A79A',
      '#63BC66',
      '#9BCE5F',
      // '#D4E34A',
      // '#FFF048',
      '#FFCB00',
      '#FBA900',
      '#FF9900',
      '#FF703A',
      '#8E6E62',
      '#7A5547',
      // '#4F342D',
      '#77909D',
      '#536E7B'
    ];

    var _icons = [
        'adjust',
        'ambulance',
        'anchor',
        'archive',
        'asterisk',
        'balance-scale',
        'bar-chart',
        'barcode',
        'bed',
        'bell',
        'bicycle',
        'birthday-cake',
        'binoculars',
        'bolt',
        'bomb',
        'book',
        'bookmark',
        'briefcase',
        'bug',
        'building',
        'bullhorn',
        // 'bus',
        // 'calculator',
        // 'camera',
        // 'camera-retro',
        // 'car',
        // 'certificate',
        // 'chrome',
        // 'cloud',
        // 'code',
        // 'codepen',
        // 'coffee',
        // 'cog',
        // 'cogs',
        // 'compass',
        // 'credit-card',
        // 'cube',
        // 'cutlery',
        // 'diamond',
        // 'envelope',
        // 'flag',
        // 'flask',
        // 'file',
        // 'film',
        // 'fire',
        // 'fighter-jet',
        // 'folder',
        // 'frown-o',
        // 'futbol-o',
        // 'gamepad',
        // 'gavel',
        // 'gift',
        // 'globe',
        // 'github',
        // 'hand-paper-o',
        // 'hand-peace-o',
        // 'hand-rock-o',
        // 'hand-scissors-o',
        // 'hand-spock-o',
        // 'headphones',
        // 'heart',
        // 'heartbeat',
        // 'home',
        // 'keyboard-o',
        // 'laptop',
        // 'lightbulb-o',
        // 'life-ring',
        // 'line-chart',
        'leaf',
        // 'magic',
        // 'map',
        // 'meh-o',
        // 'microphone',
        // 'mobile',
        // 'music',
        // 'motorcycle',
        // 'paint-brush',
        // 'paper-plane',
        // 'paw',
        // 'pencil',
        // 'phone',
        // 'picture-o',
        // 'plane',
        // 'pie-chart',
        // 'puzzle-piece',
        // 'rebel',
        // 'rocket',
        // 'shopping-cart',
        // 'space-shuttle',
        // 'spoon',
        // 'smile-o',
        'star',
        'subway',
        'suitcase',
        'tablet',
        'television',
        'thumbs-o-up',
        'thumbs-o-down',
        'ticket',
        'tint',
        'train',
        'tree',
        'trophy',
        'truck',
        'umbrella',
        'user',
        'user-secret',
        'users',
        'video-camera',
        'wheelchair',
        'wrench'
    ];

    $angular.module('app')

    // .controller('mainController', ['$scope', 'StorageService', 'UtilityService', function($scope, storage, utils){
    .controller('mainController', ['$scope', 'UiHelpers', function($scope, ui){
      $scope.colors = _colors;
      $scope.icons = _icons;
      $scope.model = {
        icon: _icons[_.random(0, _icons.length-1)],
        color: _colors[_.random(0, _colors.length-1)]
      };

      $scope.rings = {
        1: '.palette',
        2: '.icons'
      };

      $scope.rotateIcon = function(index, sign) {
        var degrees = ui.maxDegrees / _icons.length * index;
        sign = sign || '';
        return {
          transform: 'rotate(' + sign + degrees + 'deg)'
        };
      };

      $scope.setIcon = function(index){
        $scope.model.icon = _icons[index];
      };

      $scope.rotateColor = function(index) {
        var degrees = ui.maxDegrees / _colors.length * index;
        return {
          transform: 'rotate(' + degrees + 'deg)'
        };
      };

      $scope.setColor = function(index){
        $scope.model.color = _colors[index];
      };

      $scope.wedgie = function(c, l){
        var d = ui.maxDegrees/(l+2);
        var w = d * 0.01;
        return {
          color: c,
          transform: 'translate(-50%, -50%) rotateX('+d+'deg)',
          width: w+'em'
        };
      };

      window.console.log('icons:', _icons.length, '\ncolors:', _colors.length);

    }])

    .directive('tap', [function() {
      return function(scope, element, attr) {
        var hammerTap = new Hammer(element[0], {});
        hammerTap.on('tap', function() {
          scope.$apply(function() {
            scope.$eval(attr.tap);
          });
        });
      };
    }])

    .directive('pokkaDial', ['$document', 'UiHelpers', function($document, ui) {
      return {
        restrict: 'E',
        replace: true,

        scope: {
          model: '=?',
          rings:'=?'
        },

        template: '' +
          '<div class="bezel" ng-class="{\'active-touch\': touching}">' +
            '<div class="crown hour"><span></span></div>' +
            '<div class="crown minute"><span></span></div>' +
          '</div>' +
          '',

        link: function(scope, element) {
          var rings = [];
          window.console.log(scope.rings);
          _.each(scope.rings, function(ring, i){
            rings[i] = window.document.querySelector(ring);
          });
          window.console.log(scope.rings, rings);

          var minute = {
            deg: 0,
            max: _icons.length - 1,
            step: ui.maxDegrees/_icons.length,
            element: $angular.element(element[0].querySelector('.minute')),
            canvas: $angular.element(rings[2])
          };
          var hour = {
            deg: 0,
            max: _colors.length - 1,
            step: ui.maxDegrees/_colors.length,
            element: $angular.element(element[0].querySelector('.hour')),
            canvas: $angular.element(rings[1])
          };

          var input, l, n, k;
          var d, deg = 0, lastDeg = 0, pointerDeg, relativeDeg, rotationDeg;

          var _getIndexByDeg = function(l, d, s){
            var i = l - Math.floor(Math.abs(d + s/2)/s);
            var k = (i === 0 ? 0 : (l - i < 0 ? 0 : (l - i > l ? l : l - i)));
            return k;
          };

          var _getDegByIndex = function(item, collection){
            var i = _.findIndex(collection, function(el){
              return el === item;
            });
            return ui.maxDegrees/collection.length * i;
          };

          var _rotate = function(el, degrees) {
            $angular.element(el).css({
              transform: 'rotate(' + degrees + 'deg)'
            });
          };

          var start = function(e, collection, crown){
            l = collection.length;
            n = ui.maxDegrees/l;
            input = e.srcEvent && e.srcEvent.changedTouches ? e.srcEvent.changedTouches : e.pointers;
            deg = ui.getDegrees(input[0], element[0]);
            lastDeg = crown.deg;
          };

          var pan = function(e, collection){
            input = e.srcEvent && e.srcEvent.changedTouches ? e.srcEvent.changedTouches : e.pointers;
            pointerDeg = ui.getDegrees(input[0], element[0]);
            relativeDeg = pointerDeg - deg;
            rotationDeg = lastDeg + relativeDeg;
            rotationDeg = isNaN(rotationDeg) ? lastDeg : rotationDeg;
            rotationDeg = rotationDeg <= 0 ? ui.maxDegrees-Math.abs(rotationDeg) : rotationDeg;
            rotationDeg = rotationDeg >= ui.maxDegrees ? rotationDeg-ui.maxDegrees :  rotationDeg;
            deg = pointerDeg;
            k = _getIndexByDeg(l, rotationDeg, n);
            lastDeg = rotationDeg;
            return collection[k];
          };

          var end = function(collection, crown){
            d = n*(k);
            crown.deg = d;
            return collection[k];
          };

          // hammer time
          var hammerMinute = new Hammer(minute.canvas[0], {});
          var hammerHour = new Hammer(hour.canvas[0], {});
          var hammerOptions = {
            direction: Hammer.DIRECTION_ALL,
            threshold: 0
          };

          hammerMinute.get('pan').set(hammerOptions);
          hammerMinute.on('panstart', function(e) {
            start(e, _icons, minute);
          }).on('pan panmove', function(e) {
            scope.model.icon = pan(e, _icons);
            _rotate(minute.element[0], rotationDeg);
            scope.$apply();
          }).on('panend pancancel', function() {
            scope.model.icon = end(_icons, minute);
            _rotate(minute.element[0], d);
            scope.$apply();
          });

          hammerHour.get('pan').set(hammerOptions);
          hammerHour.on('panstart', function(e) {
            start(e, _colors, hour);
          }).on('pan panmove', function(e) {
            scope.model.color = pan(e, _colors);
            _rotate(hour.element[0], rotationDeg);
            scope.$apply();
          }).on('panend pancancel', function() {
            scope.model.color = end(_colors, hour);
            _rotate(hour.element[0], d);
            scope.$apply();
          });

          var _syncTheThings = function(item, crown, collection) {
            var deg = _getDegByIndex(item, collection);
            crown.deg = deg;
            _rotate(crown.element[0], deg);
          };

          var init = function(){
            _syncTheThings(scope.model.icon, minute, _icons);
            _syncTheThings(scope.model.color, hour, _colors);
          };

          init();

          scope.$watch('model.icon', function(val){
            _syncTheThings(val, minute, _icons);
          });
          scope.$watch('model.color', function(val){
            _syncTheThings(val, hour, _colors);
          });
        }
      };
    }])
    .factory('UiHelpers', [function(){
      var maxDegrees = 360;
      var maxRadians = 6.283185307179586;

      // helpers
      var _getNumbers = function(target){
        var numbers = {};
        if(target) {
          numbers = {
            t: target.offsetTop,
            r: target.offsetLeft + target.offsetWidth,
            b: target.offsetTop + target.offsetHeight,
            l: target.offsetLeft,
            w: target.offsetWidth,
            h: target.offsetHeight,
          };
          // find x|y center
          numbers.cx = (numbers.l + (numbers.w/2));
          numbers.cy = (numbers.t + (numbers.h/2));
        }
        return numbers;
      };

      var _getRadians = function(input, el){
        var metrics = _getNumbers(el);
        var radians = Math.atan2((input.clientY - metrics.cy), (input.clientX - metrics.cx));
        radians += maxRadians/4;
        if(radians < 0) {
          radians += maxRadians;
        }
        return radians;
      };

      var _getDegrees = function(input, el){
        var radians = _getRadians(input, el);
        var degree = radians * 180/Math.PI;
        return degree;
      };

      return {
        maxRadians: maxRadians,
        maxDegrees: maxDegrees,
        getNumbers: _getNumbers,
        getRadians: _getRadians,
        getDegrees: _getDegrees
      };
    }])
    ;

})(window.angular, window._, window.Hammer);
