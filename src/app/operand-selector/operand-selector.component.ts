import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RuleEngine } from '@mopopinball/engine/src/system/rule-engine/rule-engine';

type OperandType = number | string;

@Component({
  selector: 'app-operand-selector',
  templateUrl: './operand-selector.component.html',
  styleUrls: ['./operand-selector.component.scss']
})
export class OperandSelectorComponent implements OnInit {
  @Input() ruleEngine: RuleEngine;
  @Input() operand: OperandType;
  @Output() operandChange = new EventEmitter<OperandType>();
  @Output() change = new EventEmitter<void>();

  numOperand: number = null;
  keyOperand: string = null;

  constructor() { }

  ngOnInit(): void {
    this.updateOperands();
  }

  private updateOperands(): void {
    if (typeof this.operand === 'number') {
      this.numOperand = this.operand;
      this.keyOperand = null;
    } else {
      this.numOperand = null;
      this.keyOperand = this.operand;
    }
  }

  onNumChange(): void {
    this.keyOperand = null;
    this.operandChange.emit(this.numOperand);
    this.change.emit();
  }

  onKeyChange(newKey: string): void {
    this.numOperand = null;
    this.keyOperand = newKey;
    this.operandChange.emit(newKey);
    this.change.emit();
  }

}
