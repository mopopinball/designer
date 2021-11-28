import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Action } from '@mopopinball/engine/src/system/rule-engine/actions/action';
import { TimedActionStep } from '@mopopinball/engine/src/system/rule-engine/actions/timed-action';
import { TriggerType } from '@mopopinball/engine/src/system/rule-engine/actions/trigger';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { GameService } from '../game.service';

@Component({
    selector: 'app-action-actions',
    templateUrl: './action-actions.component.html',
    styleUrls: ['./action-actions.component.scss']
})
export class ActionActionsComponent implements OnInit {
    @Input() parent: TriggerType | TimedActionStep;
    @Input() action: Action;

    constructor(protected gameService: GameService, public dialog: MatDialog) { }

    ngOnInit(): void {

    }

    deleteAction(action): void {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: {
                action: 'Delete',
                prompt: `Are you sure you want to delete this action?`
            }
        });

        dialogRef.afterClosed().subscribe((result: boolean) => {
            if (result) {
                this.parent.actions.splice(this.parent.actions.indexOf(action), 1);
                this.gameService.update();
            }
        });
    }

    moveUp(action): void {
        const currentPosition = this.parent.actions.indexOf(action);
        this.parent.actions.splice(currentPosition, 1);
        this.parent.actions.splice(currentPosition - 1, 0, action);
        this.gameService.update();
    }

    moveDown(action): void {
        const currentPosition = this.parent.actions.indexOf(action);
        this.parent.actions.splice(currentPosition, 1);
        this.parent.actions.splice(currentPosition + 1, 0, action);
        this.gameService.update();
    }

}
