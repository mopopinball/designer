import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { Network } from 'vis-network/peer';
import { DataSet } from 'vis-data/peer';
import { RuleEngine } from '@mopopinball/engine';
import { InputDialogComponent } from '../input-dialog/input-dialog.component';

@Component({
  selector: 'mopo-engine-diagram-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatDialogModule],
  templateUrl: './engine-diagram-dialog.component.html',
  styleUrl: './engine-diagram-dialog.component.scss',
})
export class EngineDiagramDialogComponent implements AfterViewInit {
  nodes = new DataSet([
    // { id: 1, label: 'Node 1' },
    // { id: 5, label: 'Node 5' },
  ]);
  // create an array with edges
  edges = new DataSet([
    // { from: 1, to: 3 } as unknown,
    // { from: 2, to: 5 },
    // { from: 3, to: 3 },
  ]);

  constructor(
    public dialogRef: MatDialogRef<InputDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RuleEngine
  ) {}

  ngAfterViewInit(): void {
    this.addChild(this.data);

    // create a network
    const container = document.getElementById('myDiagramDiv');
    const data = {
      nodes: this.nodes,
      edges: this.edges,
    };
    const options = {
      interaction: { hover: true },
    };
    const network = new Network(container, data, options);
    network.on('click', (params) => {
      if (!params.nodes.length) {
        return;
      }
      const clickedId = params.nodes[0];
      const clickedEngine = Array.from(this.data.getAllEngines().values()).find(
        (e) => e.id === clickedId
      );
      this.dialogRef.close(clickedEngine);
    });
  }

  private addChild(parent: RuleEngine): void {
    this.nodes.add({ id: parent.id, label: parent.id });

    for (const child of parent.children) {
      this.edges.add({
        from: parent.id,
        to: child.id,
        arrows: 'to',
      } as unknown);
      this.addChild(child);
    }
  }
}
