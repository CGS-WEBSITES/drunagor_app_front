import { ITemplateDesignerModules } from '@/type/templateDesigner';
import { Herald } from '@boardmeister/herald';
import { Event as CursorEvent, DownEvent, MoveEvent } from '@boardmeister/antetype-cursor';
import { Event as CoreEvent, DrawEvent } from '@boardmeister/antetype-core';
import { IConditionAwareDef } from '@boardmeister/antetype-conditions';

export enum Event {
  LayerActivated = 'antetype.layer.activated',
}

export type LayerActivationEvent = CustomEvent<{
  origin: MouseEvent,
  layer: IConditionAwareDef|null,
}>

export default class ActiveLayersHandler {
  herald: Herald;
  modules: ITemplateDesignerModules;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  activeLayer: IConditionAwareDef|null = null;

  constructor(
    herald: Herald,
    modules: ITemplateDesignerModules,
    canvas: HTMLCanvasElement,
  ) {
    this.herald = herald;
    this.modules = modules;
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.register();
  }

  register(): void {
    const unregister = this.herald.batch([
      {
        event: CursorEvent.MOVE,
        subscription: this.layerChange.bind(this)
      },
      {
        event: CursorEvent.DOWN,
        subscription: this.handleInput.bind(this)
      },
      {
        event: CoreEvent.CLOSE,
        subscription: () => {
          unregister();
        }
      },
      {
        event: CoreEvent.DRAW,
        subscription: [
          {
            method: (e: CustomEvent<DrawEvent>) => {
              const { element } = e.detail;
              const original = this.modules.core.clone.getOriginal(element);
              if (original !== this.activeLayer || this.modules.workspace.isExporting()) {
                return;
              }

              const clone = this.modules.core.clone.getClone(element);
              this.ctx.save();
              this.ctx.shadowColor = "rgb(255, 168, 1)";
              this.ctx.shadowBlur = Math.max(Math.min(clone.size.h, clone.size.w) * .1, 10);
            },
            priority: -255,
          },
          {
            method: (e: CustomEvent<DrawEvent>) => {
              const { element } = e.detail;
              const original = this.modules.core.clone.getOriginal(element);
              if (original !== this.activeLayer) {
                return;
              }
              this.ctx.restore();
            },
            priority: 255,
          },
        ]
      },
    ])
  }

  async handleInput(e: CustomEvent<DownEvent>): Promise<void> {
    const { origin } = e.detail;
    await this.herald.dispatch(new CustomEvent(Event.LayerActivated, {
      detail: {
        origin,
        layer: this.activeLayer,
      }
    }))
    await this.modules.core.view.recalculate().then(() => {
      this.modules.core.view.redraw();
    })
  }

  hoverLayer(activeLayer: IConditionAwareDef|null): void {
    this.activeLayer = activeLayer;
    this.modules.core.view.redraw();
  }

  layerChange(e: CustomEvent<MoveEvent>): void {
    const { target: { hover: { deep, layer }} } = e.detail;
    if (deep?.type === 'selection') {
      return;
    }

    const activeLayer = deep && this.#hasInputs(deep, layer);
    if (this.activeLayer === activeLayer) {
      return;
    }

    if (activeLayer) {
      this.hoverLayer(this.modules.core.clone.getOriginal(activeLayer))
      this.canvas.style.cursor = 'pointer';
    } else {
      this.hoverLayer(null)
      this.activeLayer = null;
      this.modules.core.view.redraw();
      this.canvas.style.cursor = 'default';
    }
  }

  #hasInputs(layer: IConditionAwareDef, stopParent: IConditionAwareDef): false|IConditionAwareDef {
    if (layer.conditions?.inputs && layer.conditions.inputs.length > 0) {
      return layer;
    }

    if (layer === stopParent || !layer.hierarchy?.parent) {
      return false;
    }

    return this.#hasInputs(layer.hierarchy?.parent, stopParent);
  }
}
