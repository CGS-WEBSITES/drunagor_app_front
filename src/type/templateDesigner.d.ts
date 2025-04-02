import Conditions, { IInputHandler, IConditionAwareDef } from '@boardmeister/antetype-conditions';
import { Modules } from "@boardmeister/antetype-core"
import Illustrator from '@boardmeister/antetype-illustrator';
import Workspace from '@boardmeister/antetype-workspace';
import Transform from '@boardmeister/antetype-transform';
import Cursor from '@boardmeister/antetype-cursor';

export interface ITemplateDesignerModules extends Modules {
  conditions: Conditions;
  illustrator: Illustrator;
  workspace: Workspace;
  transform: Transform;
  cursor: Cursor;
}

export interface IInputComponent {
  component: object;
  origin: MouseEvent,
  input: IInputHandler,
  layer: IConditionAwareDef,
  modules: ITemplateDesignerModules,
}
