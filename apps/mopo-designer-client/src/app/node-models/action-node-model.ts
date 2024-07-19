import { Action } from '@mopopinball/engine/dist/src/system/rule-engine/actions/action';
import {
  DefaultNodeModel,
  DefaultNodeModelOptions,
} from '@projectstorm/react-diagrams';

export class ActionNodeModel<A extends Action> extends DefaultNodeModel {
  constructor(
    public readonly action: A,
    options?: DefaultNodeModelOptions
  ) {
    super(options);
  }
}
