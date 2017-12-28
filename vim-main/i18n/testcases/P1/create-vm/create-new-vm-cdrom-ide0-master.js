'use strict';

var LoginUtil = require('../../../../login/loginUtil.js');

var EsxuiPage = require('../../../../login/esxUI/esxuiPage.js');
var EsxuiUtil = require('../../../../login/esxUI/esxuiUtil.js');

var VMPage = require('../../../../login/esxUI/vm/vmPage.js');
var VMUtil = require('../../../../login/esxUI/vm/vmUtil.js');

var Timeout = require('../../../../common/timeout.js');
var GlobalUtil = require('../../../../common/globalUtil.js');

var Racetrack = require('../../../../common/racetrack.js');

describe('Create New non-ASCII VM with CD ROM IDE 0 Master', function () {

    var loginUtil = new LoginUtil(),
        esxuiUtil = new EsxuiUtil(),
        vmUtil = new VMUtil(),
        globalUtil = new GlobalUtil(),
        screenshotSavePath = browser.params.raceTrack.screenshotSavePath,
        racetrack = new Racetrack();


    beforeEach(function () {

        console.log("-----------------------------------------------------------------------------------------");
        console.log("                    Create New non-ASCII VM with CD ROM IDE 0 Master                     ");
        console.log("-----------------------------------------------------------------------------------------");

        browser.driver.manage().window().maximize();

        return racetrack.testCaseBegin('Create New non-ASCII VM with CD ROM IDE 0 Master','Create VM','Create New non-ASCII VM with CD ROM IDE 0 Master',browser.params.i18n.lang,'','','UI','P1','Automation').then(function(){
            return globalUtil.takeScreenshot(screenshotSavePath, 'Create_New_non-ASCII_VM_with_CD_ROM_IDE_0_Master_Start');
        }).then(function() {
            return racetrack.log('----------------------------------------Precondition----------------------------------------');
        }).then(function(){
            return loginUtil.go();
        }).then(function(){
            return racetrack.log("Dismiss the CEIP dialog");
        }).then(function(){
            return esxuiUtil.dismissCEIPDialog(EsxuiPage);
        });

    });

    afterEach(function (done) {
        return globalUtil.verifyResult('Create_New_non-ASCII_VM_with_CD_ROM_IDE_0_Master_Stop',screenshotSavePath).then(function(){
            done();
        });
    });

    it('Create New non-ASCII VM with CD ROM IDE 0 Master', function () {

       var vmName = globalUtil.getTimeStamp();
       return racetrack.log('---------------------------------------Start Test Case--------------------------------------').then(function(){
            return racetrack.log("Click Virtual Machines menu.");
       }).then(function(){
            return globalUtil.waitForVisibility(EsxuiPage.navigator.vmMenu.self());
        }).then(function(){
            return EsxuiPage.navigator.vmMenu.self().click();
        }).then(function(){
            return racetrack.log("Click Create/Register VM button");
        }).then(function(){
            return globalUtil.waitForVisibility(VMPage.createRegisterVMButton.self());
        }).then(function(){
            return VMPage.createRegisterVMButton.self().click();
        }).then(function(){
            return racetrack.log("Create New non-ASCII VM with CD ROM IDE 0 Master " + vmName);
        }).then(function(){
           var newVMWizard = VMPage.createRegisterVMButton.newVMWizard;
           var windows = browser.params.vmMsg.vm.wizard.basics.osVersion.windowsGuest;
           return vmUtil.createVM(newVMWizard, EsxuiPage, vmName, windows, 'Windows 10 32', 512, 8, 'Add CDROM', 0, 0, 0);
        }).then(function () {
            // Wait for tasks to appear in recent tasks
            return browser.sleep(Timeout.WAIT_FOR_VM_CREATE);
        }).then(function () {
            // Check recent task for create VM task
            return racetrack.log("Verify that new non-ASCII vm is created successfully.");
        }).then(function(){
            return esxuiUtil.checkForRecentTask('Create VM', vmName, browser.params.taskMsg.task.state.success, 2);
        }).then(function () {
            return vmUtil.deleteVMFromGridByName(VMPage, vmName);
       }).then(function () {
           return browser.sleep(Timeout.WAIT_FOR_VM_DELETE);
        })

    });


});



