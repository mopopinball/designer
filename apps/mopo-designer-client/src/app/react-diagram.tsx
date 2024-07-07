import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges,
    OnDestroy, Output, SimpleChanges, ViewChild, ViewEncapsulation } from "@angular/core";
  import * as React from "react";
  import * as ReactDOM from "react-dom";

  import createEngine, { 
    DefaultLinkModel, 
    DefaultNodeModel,
    DiagramModel 
} from '@projectstorm/react-diagrams';

import {
    CanvasWidget
} from '@projectstorm/react-canvas-core';
  
  const containerElementRef = "customReactComponentContainer";
  
  @Component({
    standalone: true,
    selector: "app-my-component",
    template: `<span #${containerElementRef}></span>`,
    styleUrls: ['./react-diagram.scss'],
    encapsulation: ViewEncapsulation.None,
  })
  export class CustomReactWrapperComponent implements OnChanges, OnDestroy, AfterViewInit {
    @ViewChild(containerElementRef, { static: true }) containerRef!: ElementRef;
  
    @Input() public counter = 10;
    @Output() public componentClick = new EventEmitter<void>();
  
    constructor() {
      this.handleClick = this.handleClick.bind(this);
    }
  
    public handleClick() {
      if (this.componentClick) {
        this.componentClick.emit();
        this.render();
      }
    }
  
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
    //1) setup the diagram engine
	var engine = createEngine();

	//2) setup the diagram model
	var model = new DiagramModel();

	//3-A) create a default node
	var node1 = new DefaultNodeModel({
		name: 'Node 1',
		color: 'rgb(0,192,255)'
	});
	node1.setPosition(100, 100);
	let port1 = node1.addOutPort('Out');

	//3-B) create another default node
	var node2 = new DefaultNodeModel('Node 2', 'rgb(192,255,0)');
	let port2 = node2.addInPort('In');
	node2.setPosition(400, 100);

	// link the ports
	let link1 = port1.link<DefaultLinkModel>(port2);
	link1.getOptions().testName = 'Test';
	// link1.addLabel('Hello World!');

	//4) add the models to the root graph
	model.addAll(node1, node2, link1);

	//5) load model into engine
	engine.setModel(model);
  
      ReactDOM.render(
        <React.StrictMode>
            <div className="sebb" style={{width: '68vw', height: 'calc(100vh - 128px)', display: 'flex'}}>
                <CanvasWidget engine={engine} />
            </div>
        </React.StrictMode>,
        this.containerRef.nativeElement
      );
    }
  }