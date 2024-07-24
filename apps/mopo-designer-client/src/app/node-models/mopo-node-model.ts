import { DesignerAttributes } from '@mopopinball/engine/dist/src/system/rule-engine/actions/designer-attributes';
import { DefaultNodeModel } from '@projectstorm/react-diagrams';

export abstract class MopoNodeModel<
  T extends { designer: DesignerAttributes }
> extends DefaultNodeModel {
  abstract model: T;

  protected registerPositionListener(): void {
    this.registerListener({
      eventDidFire: (a2) => {
        if (a2.function === 'positionChanged') {
          this.model.designer.x = this.position.x;
          this.model.designer.y = this.position.y;
        }
      },
    });
  }

  onSelected(callback: (action: T) => void): void {
    this.registerListener({
      eventDidFire: (a2) => {
        if (a2['isSelected'] && a2['function'] === 'selectionChanged') {
          callback(this.model);
        } else if (!a2['isSelected'] && a2['function'] === 'selectionChanged') {
          callback(null);
        }
      },
    });
  }
}
