import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'trigger-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input() name: string;
  @Input() icon: string;

  constructor() { }

  ngOnInit(): void {
  }

}
