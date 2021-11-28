import { HardwareConfig, HardwareLampSchema, HardwareSwitchSchema } from '@mopopinball/engine/src/system/hardware-config.schema';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-hardware-overview',
  templateUrl: './hardware-overview.component.html',
  styleUrls: ['./hardware-overview.component.scss']
})
export class HardwareOverviewComponent implements OnInit {


  constructor(@Inject(MAT_DIALOG_DATA) public data: HardwareConfig) { }

  ngOnInit(): void {
  }

  getSwitches(): HardwareSwitchSchema[] {
    return Object.values(this.data.devices.switches);
  }

  getLamps(): HardwareLampSchema[] {
    return Object.values(this.data.devices.lamps);
  }

}
