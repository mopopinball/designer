import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { GameService } from '../game.service';

interface SwitchInfo {
  id: string;
  name: string;
}

@Component({
  selector: 'switch-selector',
  templateUrl: './switch-selector.component.html',
  styleUrls: ['./switch-selector.component.scss']
})
export class SwitchSelectorComponent implements OnInit {
  filteredSwitches: SwitchInfo[];

  @Input() switchId: string;
  @Output() switchSelect = new EventEmitter<string>();

  constructor(private gameService: GameService) { }

  ngOnInit(): void {
  }

  onSwitchChange(evt): void {
    this.filteredSwitches = Object.entries(this.gameService.getHardwareConfig().devices.switches)
      .map((entry) => {
        return { id: entry[0], name: entry[1].name };
      })
      .filter((details) => {
        return details.name.toLowerCase().indexOf(evt.target.value?.toLowerCase()) >= 0;
      }).sort((a, b) => {
        return a.name.localeCompare(b.name);
      });
  }

  onSwSelected(evt: MatAutocompleteSelectedEvent): void {
    console.log(evt.option.value);
    this.switchSelect.emit(evt.option.value);
  }

  onSwClosed(): void {
    // TODO: When closing without a selection somehow restore orig value in the text box.
    // (this.trigger as any).switchId =(this.trigger as any).switchId;
  }

}
