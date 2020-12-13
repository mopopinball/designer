import { Component, OnInit } from '@angular/core';
import { RuleComponent } from './rule/rule.component';
import { RuleEngine } from '@mopopinball/engine/src/system/rule-engine/rule-engine';
import { GameService } from './game.service';
import { MatDialog } from '@angular/material/dialog';
import { SelectHardwareDialogComponent } from './select-hardware-dialog/select-hardware-dialog.component';
import { HardwareConfig } from '@mopopinball/engine/src/system/hardware-config.schema';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    root: RuleEngine;
    hardwareConfig: HardwareConfig;
    selectedTabIndex = 0;
    engineTabs: RuleEngine[] = [];

    constructor(public dialog: MatDialog, private gameService: GameService) {
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
        this.test();

        this.gameService.newTab.subscribe((engine) => {
            if (this.engineTabs.indexOf(engine) < 0) {
                this.engineTabs.push(engine);
            }
            this.selectedTabIndex = this.engineTabs.indexOf(engine) + 1;
        });

        // auto save
        this.gameService.tick.subscribe(() => this.save());
    }

    new(): void {
        const dialogRef = this.dialog.open(SelectHardwareDialogComponent, {
        });

        dialogRef.afterClosed().subscribe((result: HardwareConfig) => {
            if (result) {
                this.hardwareConfig = result;
                this.root = new RuleEngine('root', true);
                this.root.start();
                this.gameService.setRoot(this.root);
            }
        });

    }

    save(): void {
        localStorage.setItem('mopo-hardware', JSON.stringify(this.hardwareConfig));
        localStorage.setItem('mopo-rules', JSON.stringify(this.root));
    }

    test() {
        console.log(this.root.getDevices());
        this.gameService.update();
    }

    closeTab(engine: RuleEngine) {
        this.engineTabs.splice(this.engineTabs.indexOf(engine), 1);
    }
}
