'use strict';

var LoginUtil = require('../../../../login/loginUtil.js');

var EsxuiPage = require('../../../../login/esxUI/esxuiPage.js');
var EsxuiUtil = require('../../../../login/esxUI/esxuiUtil.js');

var NetworkingPage = require('../../../../login/esxUI/network/networkingPage.js');

var VSwitchPage = require('../../../../login/esxUI/network/vSwitch/vswitchPage.js');
var VSwitchUtils = require('../../../../login/esxUI/network/vSwitch/vswitchUtil.js');

var PortGroupPage = require('../../../../login/esxUI/network/portGroup/portGroupPage.js');
var PortGroupUtil = require('../../../../login/esxUI/network/portGroup/portGroupUtil.js');

var GlobalUtil = require('../../../../common/globalUtil.js');
var Racetrack = require('../../../../common/racetrack.js');

var Timeout = require('../../../../common/timeout.js');

describe('Add Uplink to Non-ASCII Switch', function () {

    var loginUtil = new LoginUtil(),
        esxuiUtil = new EsxuiUtil(),
        vswitchUtils = new VSwitchUtils(),
        portGroupUtil = new PortGroupUtil(),
        globalUtil = new GlobalUtil(),
        racetrack = new Racetrack(),
        screenshotSavePath = browser.params.raceTrack.screenshotSavePath,
        hostName,vSwitchName,portGroupName;


    beforeEach(function () {

        console.log("-----------------------------------------------------------------------------------------");
        console.log("                          Add Uplink to Non-ASCII Switch                                 ");
        console.log("-----------------------------------------------------------------------------------------");

        browser.driver.manage().window().maximize();

        return racetrack.testCaseBegin('Add Uplink to Non-ASCII Switch', 'vSwitch', 'Add Uplink to Non-ASCII Switch', browser.params.i18n.lang, '', '', 'UI','P0','Automation').then(function(){
            return globalUtil.takeScreenshot(screenshotSavePath, 'Add_Uplink_Start');
        }).then(function() {
            return browser.sleep(Timeout.WAIT_FOR_START_STOP_VIDEO_RECORDING);
        }).then(function() {
            return racetrack.log('----------------------------Precondition-------------------------------------------------');
        }).then(function(){
            return loginUtil.go();
        }).then(function(){
            return racetrack.log("Dismiss the CEIP dialog");
        }).then(function() {
            return esxuiUtil.dismissCEIPDialog(EsxuiPage);
        }).then(function(){
            return esxuiUtil.getHostName();
        }).then(function (host) {
            hostName = host;
        }).then(function() {
            return globalUtil.waitForVisibility(EsxuiPage.navigator.networkMenu());
        }).then(function () {
            return racetrack.log("Click Networking in esx UI");
        }).then(function () {
            return EsxuiPage.navigator.networkMenu().click();
        }).then(function () {
            return racetrack.log("Click vSwitches tab");
        }).then(function () {
            return globalUtil.waitForVisibility(NetworkingPage.vSwitchTab());
        }).then(function () {
            return NetworkingPage.vSwitchTab().click();
        }).then(function () {
            vSwitchName = globalUtil.getTimeStamp();
            return racetrack.log("Create a non-ASCII vSwitch: " + vSwitchName);
        }).then(function () {
            return vswitchUtils.createVswitch(VSwitchPage, EsxuiPage, vSwitchName);
        });

    });

    afterEach(function (done) {
        return globalUtil.verifyResult('Add_Uplink_Stop',screenshotSavePath).then(function(){
            done();
        });
    });


    it('should add a non-ASCII port group and delete', function () {

        var vSwitch, okButton, cancelButton;

        return racetrack.log('---------------------------------------Start Test Case--------------------------------------').then(function() {
            return racetrack.log("Add a uplink to the new added non-ASCII vSwitch");
        }).then(function () {
            return vswitchUtils.addUplink(VSwitchPage, EsxuiPage, vSwitchName);
        }).then(function () {
            return racetrack.log("Verify that the new uplink is added successfully.");
        }).then(function () {
            return esxuiUtil.checkForRecentTask('Update Network Config', hostName, browser.params.taskMsg.task.state.success,3);
        }).then(function () {
            return racetrack.log("Try to add uplink again when there is no free physical adapters.");
        }).then(function () {
            vSwitch = VSwitchPage.vSwitchGrid.getVSwitchLinkByName(vSwitchName);
            return globalUtil.waitForVisibility(vSwitch);
        }).then(function () {
            return browser.actions().mouseMove(vSwitch).perform();
        }).then(function () {
            return browser.sleep(1000);
        }).then(function () {
            return browser.actions().click(protractor.Button.RIGHT).perform();
        }).then(function () {
            return browser.sleep(2000);
        }).then(function () {
            return racetrack.log("Select Add uplink menu.");
        }).then(function () {
            return browser.actions().mouseMove(VSwitchPage.rightClickContextMenu.addUplink.self()).perform();
        }).then(function () {
            return browser.sleep(1000);
        }).then(function () {
            return VSwitchPage.rightClickContextMenu.addUplink.self().click();
        }).then(function () {
            return racetrack.log("Verify that error message pops up: " + browser.params.networkMsg.network.vswitch.noAdapters);
        }).then(function () {
            return expect(VSwitchPage.popUpDialog.errorMsg(browser.params.networkMsg.network.vswitch.noAdapters).isPresent()).toBe(true);
        }).then(function () {
            okButton = VSwitchPage.popUpDialog.okButton(1);
            return globalUtil.waitForVisibility(okButton);
        }).then(function () {
            return okButton.click();
        }).then(function () {
            cancelButton = VSwitchPage.popUpDialog.cancelButton();
            return globalUtil.waitForVisibility(cancelButton);
        }).then(function () {
            return cancelButton.click();
        }).then(function () {
            return racetrack.log("Delete new added uplink");
        }).then(function () {
            return vswitchUtils.deleteUplink(VSwitchPage, EsxuiPage, vSwitchName,1)
        }).then(function () {
            return vswitchUtils.deleteVswitch(VSwitchPage, EsxuiPage, vSwitchName);
        });

    });
});