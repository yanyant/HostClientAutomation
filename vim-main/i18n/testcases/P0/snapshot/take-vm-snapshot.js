'use strict';

var LoginUtil = require('../../../../login/loginUtil.js');

var EsxuiPage = require('../../../../login/esxUI/esxuiPage.js');
var EsxuiUtil = require('../../../../login/esxUI/esxuiUtil.js');

var VMPage = require('../../../../login/esxUI/vm/vmPage.js');
var VMUtil = require('../../../../login/esxUI/vm/vmUtil.js');

var GlobalUtil = require('../../../../common/globalUtil.js');
var Racetrack = require('../../../../common/racetrack.js');

var Timeout = require('../../../../common/timeout.js');

describe('Take Non-ASCII Snapshot', function () {

    var loginUtil = new LoginUtil(),
        esxuiUtil = new EsxuiUtil(),
        vmUtil = new VMUtil(),
        globalUtil = new GlobalUtil(),
        racetrack = new Racetrack(),
        screenshotSavePath = browser.params.raceTrack.screenshotSavePath,
        vmName;

    beforeEach(function () {

        console.log("-----------------------------------------------------------------------------------------");
        console.log("                              Take Non-ASCII Snapshot                                    ");
        console.log("-----------------------------------------------------------------------------------------");

        browser.driver.manage().window().maximize();

        return racetrack.testCaseBegin('Take Non-ASCII Snapshot', 'Snapshot', 'Take Non-ASCII Snapshot', browser.params.i18n.lang, '', '', 'UI','P0','Automation').then(function(){
            return globalUtil.takeScreenshot(screenshotSavePath, 'Take_Non-ASCII_Snapshot_Start');
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
        }).then(function(){
            return vmUtil.createVMWithDefaultSettings(VMPage, vmName, EsxuiPage);
        });

    });

    afterEach(function (done) {
        return globalUtil.verifyResult('Take_Non-ASCII_Snapshot',screenshotSavePath).then(function(){
            done();
        });
    });

    it('should take non-ASCII VM snapshot', function () {

        var snapshotName =   browser.params.i18n.string;

        return racetrack.log('---------------------------------------Start Test Case--------------------------------------').then(function() {
            return racetrack.log("Create a non-ASCII Snapshot: " + snapshotName);
        }).then(function () {
            return vmUtil.createVMSnapshot(VMPage,EsxuiPage,vmName,snapshotName);
        }).then(function () {
            return racetrack.log("Verify that new non-ASCII snapshot is created");
        }).then(function () {
            return esxuiUtil.checkForRecentTask('Create Snapshot', vmName, browser.params.taskMsg.task.state.success,3);
        }).then(function () {
            return vmUtil.deleteVMFromGridByName(VMPage,vmName);
        }).then(function () {
            return browser.sleep(Timeout.WAIT_FOR_VM_DELETE);
        });
    });


});




