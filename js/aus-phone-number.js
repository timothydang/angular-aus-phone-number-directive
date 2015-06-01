'use strict';

var appDirectives = angular.module('appDirectives', []);

appDirectives.directive('ausPhoneNumber', function () {
    var AUS_PHONE_REGEX = /(^1300(| )[0-9]{3}(| )[0-9]{3}$)|(^1[800|900|902]{3}(| )[0-9]{3}(| )[0-9]{3}$)|(^0[2|3|7|8]{1}(| )[0-9]{4}(| )[0-9]{4}$)|(^13(| )[0-9]{4}$)|(^04[0-9]{2}(| )[0-9]{3}(| )[0-9]{3}$)/;

    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ctrl) {

            ctrl.$validators.phoneNumber = function (value) {
                if (ctrl.$isEmpty(value)) {
                    return true;
                }
                value = blockNonNumberOnInput(value);
                return AUS_PHONE_REGEX.test(stripCountryCodeAndWhitespaces(value));
            };

            function blockNonNumberOnInput(val) {
                // accept 0-9, +, - and brackets
                return val.toString().replace(/[^0-9()\+\-\( )]/g, '');
            }

            function stripCountryCodeAndWhitespaces(val) {
                val = val.replace(/[()\+\-\( )]/g, '');  // Acceptable characters and whitespaces
                return val.replace(/^61/, '0');          // Australian country code
            }

            function onInputBlur() {
                var updatedNumber = stripCountryCodeAndWhitespaces(element.val());
                element.val(updatedNumber);
                ctrl.$setViewValue(updatedNumber);
            }

            function onInputKeyup() {
                var el = element[0];

                // need to retain the caret position as user is typing
                var start = el.selectionStart;
                var end = el.selectionEnd;

                el.value = blockNonNumberOnInput(el.value);
                el.setSelectionRange(start, end);

                // Need to explicitly set the model back to empty to prevent showing an error when there's nothing in the input
                if(el.value === '') {
                    ctrl.$setViewValue('');
                }
            }

            element.on('input', onInputKeyup);
            element.on('blur', onInputBlur);

            // re-format the input value as soon as it's available so it is consistent across SF and local
            scope.$watch(ctrl, function() {
               element.triggerHandler('blur');
            });
        }
    };
});
