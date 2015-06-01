'use strict';

describe('Directive: ausPhoneNumber', function () {

    var element, form, $scope;

    // load the directive's module
    beforeEach(function () {
        module('appDirectives');
    });

    beforeEach(inject(function ($compile, $rootScope) {
        $scope = $rootScope;

        var formTemplate = '<form name="form"><input type="tel" name="phoneNumber" ng-model="phoneNumber" aus-phone-number></form>';
        var formElement = $compile(formTemplate)($scope);
        $scope.model = {phoneNumber: null};

        $scope.$digest();
        form = $scope.form;
        element = angular.element(formElement.find('input'));
    }));

    function checkFieldValue(value, expectedValue) {
        element.val(value);
        element.triggerHandler('input');
        expect(element.val()).toBe(expectedValue);
    }

    function checkForValidFieldValueAndModel(value, expectedValue) {
        element.val(value);
        element.triggerHandler('blur');

        expect(element.val()).toBe(expectedValue);
        expect(form.phoneNumber.$viewValue).toBe(expectedValue);
        expect(form.phoneNumber.$valid).toBe(true);
    }

    it('should be valid initially', function () {
        expect(form.phoneNumber.$valid).toBe(true);
    });

    it('should be valid when no value', function () {
        form.phoneNumber.$setViewValue(null);
        expect(form.phoneNumber.$valid).toBe(true);
        form.phoneNumber.$setViewValue('');
        expect(form.phoneNumber.$valid).toBe(true);
        form.phoneNumber.$setViewValue(undefined);
        expect(form.phoneNumber.$valid).toBe(true);
    });

    it('should be invalid when user enters an invalid phone number', function () {

        // Not a number
        form.phoneNumber.$setViewValue('adasd');
        expect(form.phoneNumber.$valid).toBe(false);

        form.phoneNumber.$setViewValue('114ada155sd');
        expect(form.phoneNumber.$valid).toBe(false);

        // Not enough number
        form.phoneNumber.$setViewValue('045556666');
        expect(form.phoneNumber.$valid).toBe(false);

        // not 1300, 1800, 1800, land line or mobile
        form.phoneNumber.$setViewValue('1234567890');
        expect(form.phoneNumber.$valid).toBe(false);

        // not 02, 03, 04, 07 or 08 area code
        form.phoneNumber.$setViewValue('0512341234');
        expect(form.phoneNumber.$valid).toBe(false);
    });

    it('should be valid when user enters a valid phone number', function () {

        form.phoneNumber.$setViewValue('+61 452 226 100');
        expect(form.phoneNumber.$valid).toBe(true);

        form.phoneNumber.$setViewValue('(61)452226100');
        expect(form.phoneNumber.$valid).toBe(true);

        form.phoneNumber.$setViewValue('(61)452226100');
        expect(form.phoneNumber.$valid).toBe(true);

        form.phoneNumber.$setViewValue('61) 452226100');
        expect(form.phoneNumber.$valid).toBe(true);
    });

    it('should only accept numbers and certain characters on key stroke', function() {
        checkFieldValue(''          , '');
        checkFieldValue('as1ad'     , '1');
        checkFieldValue('*1'        , '1');
        checkFieldValue('+61as4df'  , '+614');
        checkFieldValue('+asdf61'   , '+61');
    });

    it('should format the user\'s phone number to an accepted one on blur event', function() {
        // with spaces
        checkForValidFieldValueAndModel('+61 452 226 100', '0452226100');

        // invalid characters
        checkForValidFieldValueAndModel('---'  , '');
        checkForValidFieldValueAndModel('+++()', '');
        checkForValidFieldValueAndModel('++++61452226100', '0452226100');
    });
});
