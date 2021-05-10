import { Directive, Input } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { DataItem } from "@mopopinball/engine/src/system/rule-engine/rule-data";
import { RuleEngine } from "@mopopinball/engine/src/system/rule-engine/rule-engine";
import { ConfirmDialogComponent } from "./confirm-dialog/confirm-dialog.component";
import { GameService } from "./game.service";

@Directive()
export abstract class DataItemComponent {
    @Input() ruleEngine: RuleEngine;
    
    constructor(protected gameService: GameService, public dialog: MatDialog) {}
    
    onDataChange(): void {
        this.gameService.update();
    }

    setDataRoS(data: DataItem, val): void {
        if (!data.attributes) {
            data.attributes = {};
        }
        data.attributes.resetOnStateStop = val;
        this.gameService.update();
    }

    deleteData(key: string): void {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: {
                action: 'Delete',
                prompt: `Are you sure you want to delete the data item "${key}"?`
            }
        });
  
        dialogRef.afterClosed().subscribe((result: boolean) => {
            if (result) {
                this.ruleEngine.data.delete(key);
                this.gameService.update();
            }
        });
    }
}