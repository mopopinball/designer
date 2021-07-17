import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss']
})
export class ActionComponent implements OnInit {
  @Input() icon: string;
  @Input() title: string;

  constructor() { }

  ngOnInit(): void {
  }

}
