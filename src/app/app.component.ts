import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RuleComponent } from './rule/rule.component';
import { RuleEngine } from '@mopopinball/engine/src/system/rule-engine/rule-engine';
import { GameService } from './game.service';
import { MatDialog } from '@angular/material/dialog';
import { SelectHardwareDialogComponent } from './select-hardware-dialog/select-hardware-dialog.component';
import { HardwareConfig } from '@mopopinball/engine/src/system/hardware-config.schema';
import { ExportDialogComponent } from './export-dialog/export-dialog.component';
import { HttpClient } from '@angular/common/http';
import { CoilType } from '@mopopinball/engine/src/system/devices/coil-type';
import { DesiredOutputState, DesiredOutputStateType } from '@mopopinball/engine/src/system/rule-engine/desired-output-state';
import { OutputDeviceType } from '@mopopinball/engine/src/system/devices/output-device-type';
import { LightState } from '@mopopinball/engine/src/system/devices/light';
import { LampRole } from '@mopopinball/engine/src/system/devices/lamp-role';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    @ViewChild('dllink') el: ElementRef;
    root: RuleEngine;
    hardwareConfig: HardwareConfig;
    selectedTabIndex = 0;
    engineTabs: RuleEngine[] = [];
    remoteMachineAddress: string = JSON.parse(localStorage.getItem('mopo-remote'));
    remoteMachineReady: boolean = false;
    uploadComplete = false;
    autoCollapse: boolean = true;
    downloadHref: SafeUrl = '';

    constructor(
        public dialog: MatDialog, private gameService: GameService, private http: HttpClient,
        private domSanatizer: DomSanitizer
    ) {
    }

    ngOnInit() {
        const workingHardware = JSON.parse(localStorage.getItem('mopo-hardware'));
        const workingRules = JSON.parse(localStorage.getItem('mopo-rules'));
        if (!workingHardware || !workingRules) {
            return;
        }
        this.hardwareConfig = workingHardware
        this.root = RuleEngine.load(workingRules);
        this.root.start();
        this.gameService.setRoot(this.root);
        this.gameService.newTab.subscribe((engine) => {
            if (this.engineTabs.indexOf(engine) < 0) {
                this.engineTabs.push(engine);
            }
            this.selectedTabIndex = this.engineTabs.indexOf(engine) + 1;
        });

        // auto save
        this.gameService.tick.subscribe(() => this.save());

        this.updateRemoteStatus();
        this.onCollapseChange();
    }

    onCollapseChange(): void {
        this.gameService.autoCollapse = this.autoCollapse;
    }

    new(): void {
        const dialogRef = this.dialog.open(SelectHardwareDialogComponent, {
        });

        dialogRef.afterClosed().subscribe((result: HardwareConfig) => {
            if (result) {
                this.hardwareConfig = result;
                this.root = new RuleEngine('root', true, null);
                this.root.start();
                this.gameService.setRoot(this.root);
                this.populateRootDevices();       
            }
        });
    }

    populateRootDevices(): void {
        // the root should define all non-instantaneous devices (eg. lamps, relays) in their off state,
        // which will ensure they turn off when exiting a child.
        this.root.devices.clear();
        for(const coilEntry of Object.entries(this.hardwareConfig.devices.coils)) {
            const result = new DesiredOutputState(coilEntry[0], OutputDeviceType.COIL, false);
            this.root.devices.set(result.id, result);
        }
        for(const displayEntry of Object.entries(this.hardwareConfig.displays)) {
            const result = new DesiredOutputState(displayEntry[0], OutputDeviceType.DISPLAY, '');
            this.root.devices.set(result.id, result);
        }
        for(const displayEntry of Object.entries(this.hardwareConfig.sounds)) {
            const result = new DesiredOutputState(displayEntry[0], OutputDeviceType.SOUND, false);
            this.root.devices.set(result.id, result);
        }
        for(const lampEntry of Object.entries(this.hardwareConfig.devices.lamps)) {
            let outputType: OutputDeviceType;
            let initState: DesiredOutputStateType;
            if (lampEntry[1].role === LampRole.COIL) {
                outputType = OutputDeviceType.COIL;
                initState = false;
            }
            else if (lampEntry[1].role === LampRole.LAMP) {
                outputType = OutputDeviceType.LIGHT;
                initState = LightState.OFF;
            } else {
                continue;
            }
            const result = new DesiredOutputState(lampEntry[0], outputType, initState);
            this.root.devices.set(result.id, result);
        }
    }

    save(): void {
        localStorage.setItem('mopo-hardware', JSON.stringify(this.hardwareConfig));
        localStorage.setItem('mopo-rules', JSON.stringify(this.root));
    }

    test() {
        const dialogRef = this.dialog.open(ExportDialogComponent, {
            width: '75%',
            height: '75%'
        });

        this.downloadHref = this.domSanatizer.bypassSecurityTrustUrl("data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.root)));
        this.el.nativeElement.click();
    }

    closeTab(engine: RuleEngine) {
        this.engineTabs.splice(this.engineTabs.indexOf(engine), 1);
    }

    selectRemoteMachine(): void {
        localStorage.setItem('mopo-remote', JSON.stringify(this.remoteMachineAddress));
        this.updateRemoteStatus();
    }

    updateRemoteStatus(): void {
        if (!this.remoteMachineAddress) {
            return;
        }

        this.http.get(`/update/ruleEngine/status`).subscribe(
            (res: any) => {
                this.remoteMachineReady = res.debugEnabled;
            }
        );
    }

    applyToRemoteMachine(): void {
        this.http.get(`/update/ruleEngine/status`)
            .subscribe(() => {
                this.http.post<void>(`/update/ruleEngine/schema`, this.root)
                    .subscribe(() => {
                        this.uploadComplete = true;
                        setTimeout(() => {
                            this.uploadComplete = false;
                        }, 2000);
                    });
            });
    }
}
