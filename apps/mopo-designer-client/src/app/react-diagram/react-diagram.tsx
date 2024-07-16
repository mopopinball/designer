import { AfterViewInit, Component, ElementRef, Input, OnChanges,
    OnDestroy, SimpleChanges, ViewChild, ViewEncapsulation } from "@angular/core";
import * as React from "react";
import * as ReactDOM from "react-dom";

import  { 
  DiagramEngine,
} from '@projectstorm/react-diagrams';

import {
    CanvasWidget
} from '@projectstorm/react-canvas-core';
  
  const containerElementRef = "customReactComponentContainer";
  
  @Component({
    standalone: true,
    selector: "mopo-react-diagram",
    template: `<span #${containerElementRef}></span>`,
    styleUrls: ['./react-diagram.scss'],
    encapsulation: ViewEncapsulation.None,
  })
  export class CustomReactWrapperComponent implements OnChanges, OnDestroy, AfterViewInit {
    @ViewChild(containerElementRef, { static: true }) containerRef!: ElementRef;
  
    @Input() diagramEngine: DiagramEngine;
  
    ngOnChanges(changes: SimpleChanges): void {
      this.render();
    }
  
    ngAfterViewInit() {
      this.render();
    }
  
    ngOnDestroy() {
      ReactDOM.unmountComponentAtNode(this.containerRef.nativeElement);
    }
  
    private render() {
       ReactDOM.render(
        <React.StrictMode>
            <div className="sebb" style={{width: '68vw', height: 'calc(100vh - 128px)', display: 'flex'}}>
                <CanvasWidget engine={this.diagramEngine} />
            </div>
        </React.StrictMode>,
        this.containerRef.nativeElement
      );
    }
  }