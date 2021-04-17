import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DataOperation } from '@mopopinball/engine/src/system/rule-engine/actions/data-action';

@Component({
  selector: 'app-data-operation',
  templateUrl: './data-operation.component.html',
  styleUrls: ['./data-operation.component.scss']
})
export class DataOperationComponent implements OnInit {
  @Input() operation: DataOperation;
  @Output() changed = new EventEmitter<DataOperation>();
  DataOperation: typeof DataOperation = DataOperation;

  constructor() { }

  ngOnInit(): void {
  }

  onChange(): void {
    this.changed.emit(this.operation);
  }

}
