import { Component, Input, OnInit } from '@angular/core';
import { Action } from '@mopopinball/engine/src/system/rule-engine/actions/action';
import { ActionTriggerType } from '@mopopinball/engine/src/system/rule-engine/actions/action-trigger';
import { GameService } from '../game.service';

@Component({
    selector: 'app-action-actions',
    templateUrl: './action-actions.component.html',
    styleUrls: ['./action-actions.component.scss']
})
export class ActionActionsComponent implements OnInit {
    @Input()trigger: ActionTriggerType;
    @Input()action: Action;

    constructor(protected gameService: GameService) { }

    ngOnInit(): void {
    }

    deleteAction(trigger, action): void {
        trigger.actions.splice(trigger.actions.indexOf(action), 1);
        this.gameService.update();
    }

    moveUp(trigger: ActionTriggerType, action): void {
        const currentPosition = trigger.actions.indexOf(action);
        trigger.actions.splice(currentPosition, 1);
        trigger.actions.splice(currentPosition - 1, 0, action);
        this.gameService.update();
    }

    moveDown(trigger, action): void {
        const currentPosition = trigger.actions.indexOf(action);
        trigger.actions.splice(currentPosition, 1);
        trigger.actions.splice(currentPosition + 1, 0, action);
        this.gameService.update();
    }

}
