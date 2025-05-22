<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Herald } from '@boardmeister/herald';
import {
  InitEvent,
  Event as CoreEvent,
  Layout,
  ISettings,
  ModulesEvent,
  CloseEvent,
} from '@boardmeister/antetype-core';
import Core from '@boardmeister/antetype-core/dist/core';
import { IConditionAwareDef } from '@boardmeister/antetype-conditions';
import Conditions from '@boardmeister/antetype-conditions/dist/module';
import Illustrator from '@boardmeister/antetype-illustrator/dist/module';
import Workspace from '@boardmeister/antetype-workspace/dist/module';
import Transform from '@boardmeister/antetype-transform/dist/module';
import Cursor from '@boardmeister/antetype-cursor/dist/module';
import { IInputComponent, ITemplateDesignerModules } from '@/type/templateDesigner';
import ActiveLayersHandler, { Event as ActiveLayerEvent, LayerActivationEvent }
  from "@/service/TemplateDesigner/ActiveLayersHandler";
import { handleSelectInput } from "@/components/HeroCreator/Input/Select";
import Title from "@/components/HeroCreator/Input/Title.vue";
import Multiselect from "@/components/HeroCreator/Input/Multiselect.vue";
import { handleImageInput } from "@/components/HeroCreator/Input/Image";

interface IInputModal {
  width: number|null;
  height: number|null;
  left: number;
  top: number|null;
  bottom: number|null;
}

let canvas = ref<HTMLCanvasElement|null>(null);
const inputModal = ref<IInputModal>({
  width: null,
  height: null,
  left: 0,
  top: 0,
  bottom: null,
});
const inputsCon = ref<HTMLDivElement|null>(null);
const downloadLoading = ref(false);
const ratioWidth = ref(1);
const ratioHeight = ref(1);
const inputs = ref<IInputComponent[]>([]);
let activeLayersHandler: ActiveLayersHandler;
let antetypeModules: ITemplateDesignerModules;
const herald = new Herald();
const getHerald = (): Herald => herald;
const manuallyRegisterModules = (): void => {
  const herald = getHerald();

  const unregister = herald.batch([
    {
      event: CoreEvent.MODULES,
      subscription: (event) => {
        const { modules, canvas } = event.detail;
        modules.core = Core({ canvas, modules, herald });
        modules.workspace = new Workspace(canvas, modules, herald);
        modules.transform = new Transform(canvas, modules, herald);
        modules.illustrator = new Illustrator(canvas, modules, herald);
        modules.cursor = Cursor({ canvas, modules, herald });
        modules.conditions = Conditions({ canvas, modules, herald });
      }
    },
    {
      event: CoreEvent.CLOSE,
      subscription: () => {
        unregister();
      }
    }
  ]);
}
const loadModules = async (): Promise<ITemplateDesignerModules> => {
  const event = new CustomEvent<ModulesEvent>(CoreEvent.MODULES, { detail: { modules: {}, canvas: canvas.value }});
  await getHerald().dispatch(event);

  return event.detail.modules as ITemplateDesignerModules;
}

const initAntetype = async (base: Layout, settings: ISettings): Promise<void> => {
  await getHerald().dispatch(new CustomEvent<InitEvent>(CoreEvent.INIT, { detail: { base, settings } }));
}

const setCursorSettings = (settings: ISettings): void => {
  if (!settings.cursor) {
    settings.cursor = {} as Record<string, any>;
  }
  const cursor = settings.cursor as any;
  for (const name of ['select', 'delete', 'resize']) {
    if (!cursor[name]) {
      cursor[name] = {};
    }
    cursor[name].disabled = true;
  }

  if (!cursor.detect) {
    cursor.detect = {};
  }

  if (!cursor.detect.move) {
    cursor.detect.move = {};
  }

  cursor.detect.move.skipSelection = true;
}

const downloadCard = async (): Promise<void> => {
  try {
    if (downloadLoading.value || !antetypeModules) {
      return;
    }

    downloadLoading.value = true;
    await antetypeModules.workspace.download({ filename: 'monster', dpi: 100 });
  } catch (e) {
    console.info('Handle errors', e)
    throw e;
  } finally {
    downloadLoading.value = false;
  }
}

const getLayerAbsoluteX = (layer: IConditionAwareDef): number => {
  let x = layer.start.x;

  if (layer.hierarchy?.parent) {
      x += getLayerAbsoluteX(layer.hierarchy?.parent)
  }

  return x;
}

const getLayerAbsoluteY = (layer: IConditionAwareDef): number => {
  let x = layer.start.y;

  if (layer.hierarchy?.parent) {
      x += getLayerAbsoluteY(layer.hierarchy?.parent)
  }

  return x;
}

const onLayerActivated = async (e: LayerActivationEvent) => {
  const { origin, layer } = e.detail;
  inputs.value = [];
  if (layer === null) {
    return;
  }

  const clone = antetypeModules.core.clone.getClone(layer);
  const layerAbsX = getLayerAbsoluteX(clone);
  let left = canvas.value!.offsetLeft + layerAbsX;
  const layerAbsY = getLayerAbsoluteY(clone);
  let top: number|null = canvas.value!.offsetTop + layerAbsY + clone.size.h;
  let bottom: number|null = null;
  let width: number|null = clone.size.w;
  let height: number|null = null;

  const fullHeight = antetypeModules.workspace.calc('100h%');
  const fullWidth = antetypeModules.workspace.calc('100w%');
  const hasMoreSpaceAtTheTop = fullHeight - layerAbsY - clone.size.h < fullHeight/2;
  const hasMoreSpaceAtTheLeft = fullWidth - layerAbsX - clone.size.w < fullWidth/2;
  if (hasMoreSpaceAtTheTop) {
    top = null;
    bottom = canvas.value!.offsetTop + fullHeight - layerAbsY;
  }

  if (clone.size.h > width) {
    top = layerAbsY;
    bottom = null;
    if (hasMoreSpaceAtTheLeft) {
      left -= width;
    } else {
      left += width;
    }
    width = null;
    height = clone.size.h;
  }

  inputModal.value = {
    left,
    top,
    bottom,
    width,
    height,
  };
  const inputTypeToComponent: Record<string, object> = {
    'select': handleSelectInput,
    'multiselect': Multiselect,
    'title': Title,
    'image': handleImageInput,
  }
  const newInputs: IInputComponent[] = [];
  for (const input of layer.conditions?.inputs ?? []) {
    const inputHandle = inputTypeToComponent[input.type];
    if (!inputHandle) {
      continue;
    }

    const inputProps = {
      component: inputTypeToComponent[input.type],
      input,
      origin,
      layer,
      modules: antetypeModules,
    } as IInputComponent;
    if (typeof inputHandle == 'function') {
      inputHandle(inputProps)
      continue;
    }

    newInputs.push(inputProps)
  }
  nextTick(() => {
    inputs.value = newInputs;
  });
}

const handleLayerActivationSubscriptions = (): void => {
  const herald = getHerald();
  const unregister = herald.batch([
    {
      event: CoreEvent.CLOSE,
      subscription: () => {
        unregister();
      }
    },
    {
      event: ActiveLayerEvent.LayerActivated,
      subscription: onLayerActivated,
    }
  ])
}

const hideInputsOnClickOutsideCanvas = (e: MouseEvent) => {
  if (
    e.target != canvas.value
    && e.target != inputsCon.value
    && !inputsCon.value?.contains(e.target as Node)
  ) {
    inputs.value = [];
  }
}

const getInputModalCoords = (): string => {
  const coords = inputModal.value;
  let result = 'left:' + coords.left + 'px;';
  if (coords.top) {
    result += 'top:' + coords.top + 'px;';
  } else if (coords.bottom) {
    result += 'bottom:' + coords.bottom + 'px;';
  }

  if (coords.width) {
    result += 'width:' + coords.width + 'px;';
  }

  if (coords.height) {
    result += 'height:' + coords.height + 'px;';
  }

  return result;
}

onUnmounted(() => {
  void getHerald().dispatch(new CustomEvent<CloseEvent>(CoreEvent.CLOSE));
  document.body.removeEventListener('click', hideInputsOnClickOutsideCanvas, false);
});

onMounted(async (): Promise<void> => {
  try {
    document.body.addEventListener('click', hideInputsOnClickOutsideCanvas, false);
    (canvas.value! as HTMLCanvasElement).addEventListener('contextmenu', e => { e.preventDefault(); });
    manuallyRegisterModules();
    antetypeModules = await loadModules();

    const payload = await (await fetch(import.meta.env.VITE_HERO_CREATOR_FILE_URL)).json() as {
      layout: Layout;
      settings: ISettings;
    };
    handleLayerActivationSubscriptions();
    const layout = payload.layout;
    const settings = payload.settings;
    const { workspace: { height, width } } = settings;

    ratioWidth.value = width;
    ratioHeight.value = height;

    setCursorSettings(settings);
    await initAntetype(layout, settings);
    activeLayersHandler = new ActiveLayersHandler(getHerald(), antetypeModules, canvas.value!);
  } catch (e) {
    console.error('Handle errors', e)
    throw e;
  }
})
</script>

<template>
  <v-container class="d-flex justify-center align-center">
    <v-card class="px-3 py-3 d-block mx-auto w-100 text-center" style="max-width:300px;" @click="downloadCard">
      <span v-if="downloadLoading">Loading...</span>
      <span v-if="!downloadLoading">Download</span>
    </v-card>
  </v-container>
  <div class="d-flex justify-center align-center position-relative" max-width="800">
    <div :style="getInputModalCoords()"
         ref="inputsCon"
         class="position-absolute v-card--variant-flat px-1 py-1 rounded shadow-white overflow-auto"
         v-if="inputs.length > 0">
      <template v-for="input in inputs">
        <component :is="input.component" :input="input" :modules="antetypeModules"/>
      </template>
    </div>
    <canvas ref="canvas" class="h-screen" :style="'aspect-ratio:' + ratioWidth + '/' + ratioHeight + '; max-height: 90vh;'"/>
  </div>
</template>

<style scoped>
  .shadow-white {
    box-shadow: 0 0 10px #FFF;
  }
</style>
