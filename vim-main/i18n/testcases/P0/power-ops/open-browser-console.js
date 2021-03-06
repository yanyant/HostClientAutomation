'use strict';

var LoginUtil = require('../../../../login/loginUtil.js');

var EsxuiPage = require('../../../../login/esxUI/esxuiPage.js');
var EsxuiUtil = require('../../../../login/esxUI/esxuiUtil.js');

var VMPage = require('../../../../login/esxUI/vm/vmPage.js');
var VMUtil = require('../../../../login/esxUI/vm/vmUtil.js');

var GlobalUtil = require('../../../../common/globalUtil.js');
var Racetrack = require('../../../../common/racetrack.js');

var Timeout = require('../../../../common/timeout.js');

describe('Open Browser Console of non-ASCII VM', function () {

    var loginUtil = new LoginUtil(),
        esxuiUtil = new EsxuiUtil(),
        vmUtil = new VMUtil(),
        globalUtil = new GlobalUtil(),
        racetrack = new Racetrack(),
        screenshotSavePath = browser.params.raceTrack.screenshotSavePath,
        vmName = '啊门氘媵_15_56_24';


    beforeEach(function () {

        console.log("-----------------------------------------------------------------------------------------");
        console.log("                        Open Browser Console of non-ASCII VM                             ");
        console.log("-----------------------------------------------------------------------------------------");


        browser.driver.manage().window().maximize();

        return racetrack.testCaseBegin('Open Browser Console of non-ASCII VM', 'Power ops', 'Open Browser Console of non-ASCII VM', browser.params.i18n.lang, '', '', 'UI','P0','Automation').then(function(){
            return globalUtil.takeScreenshot(screenshotSavePath, 'Open_Browser_Console_of_non-ASCII_VM_Start');
        }).then(function() {
            return browser.sleep(Timeout.WAIT_FOR_START_STOP_VIDEO_RECORDING);
        }).then(function() {
            return racetrack.log('----------------------------Precondition-------------------------------------------------');
        }).then(function(){
            return loginUtil.go();
        }).then(function(){
            return racetrack.log("Dismiss the CEIP dialog");
        }).then(function(){
            return esxuiUtil.dismissCEIPDialog(EsxuiPage);
        }).then(function(){
            return racetrack.log("Click Virtual Machines in esx UI");
        }).then(function(){
            return globalUtil.waitForVisibility(EsxuiPage.navigator.vmMenu.self());
        }).then(function(){
            return EsxuiPage.navigator.vmMenu.self().click();
        }).then(function(){
            vmName = globalUtil.getTimeStamp();
            return racetrack.log("Create a new non-ASCII VM with default settings: " + vmName);
        }).then(function() {
            return vmUtil.createVMWithDefaultSettings(VMPage, vmName, EsxuiPage);
        })

    });

    afterEach(function (done) {
        return globalUtil.verifyResult('Open_Browser_Console_of_non-ASCII_VM_Stop',screenshotSavePath).then(function(){
            done();
        });
    });

    it('Open Browser Console of non-ASCII VM', function () {
        return racetrack.log('---------------------------------------Start Test Case--------------------------------------').then(function() {
            return racetrack.log("Power on the non-ASCII VM");
        }).then(function () {
            return vmUtil.powerOnVMFromGridByName(VMPage,vmName);
        }).then(function () {
            return browser.sleep(Timeout.WAIT_FOR_VM_POWER_ON);
        }).then(function () {
            return racetrack.log('Open browser console of the non-ASCII VM');
        }).then(function () {
            return vmUtil.openVMBrowserConsoleFromGridByName(VMPage, vmName);
        }).then(function () {
            return racetrack.log('Verify browser console of the non-ASCII VM is opened');
        }).then(function () {
            return expect(VMPage.webMKSConsole.self().isPresent()).toBe(true);
        }).then(function () {
            return racetrack.log('Close browser console');
        }).then(function () {
            return VMPage.webMKSConsole.closeButton().click();
        }).then(function () {
            return racetrack.log('Power off the non-ASCII VM');
        }).then(function () {
            return vmUtil.powerOffVMFromGridByName(VMPage,vmName);
        }).then(function () {
            return racetrack.log('Delete the non-ASCII VM');
        }).then(function () {
            return vmUtil.deleteVMFromGridByName(VMPage,vmName);
        }).then(function () {
            return browser.sleep(Timeout.WAIT_FOR_VM_DELETE);
        });
    });
});
