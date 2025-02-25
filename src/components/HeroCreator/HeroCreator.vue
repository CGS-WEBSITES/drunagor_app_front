<script setup lang="ts">
import { ref, onMounted } from "vue";
import Marshal, { RegisterConfig } from '@boardmeister/marshal';
import Herald from '@boardmeister/herald';
import Minstrel from '@boardmeister/minstrel';
import Core, {
  InitEvent,
  Event as CoreEvent,
  Layout,
  ISettings,
  Modules,
  ModulesEvent
} from '@boardmeister/antetype-core';
import Conditions from '@boardmeister/antetype-conditions';
import Illustrator from '@boardmeister/antetype-illustrator';
import Workspace from '@boardmeister/antetype-workspace';
import Transform from '@boardmeister/antetype-transform';
import Cursor from '@boardmeister/antetype-cursor';
import Treasurer from '@boardmeister/treasurer';
import Diemut from '@boardmeister/diemut';
import Guard from '@boardmeister/guard';

let canvas = ref(null);
const version = '1.0.0';
const namespace = 'boardmeister';
const generateModuleConfig = (source: object, name: string, args: unknown[] = []): RegisterConfig => ({
  entry: {
    source,
    namespace: namespace,
    name,
    version: version,
    arguments: args,
  },
  type: 'module',
  tags: ['subscriber'],
  resource: {
    src: '/bm/cdn/' + name + '/dist/'
  },
  asset: {
    src: '/bm/cdn/' + name + '/asset/'
  }
})
let antetypeModules: Modules = {};
const modules: RegisterConfig[] = [
  generateModuleConfig(Herald, 'herald'),
  generateModuleConfig(Minstrel, 'minstrel'),
  generateModuleConfig(Guard, 'guard'),
  generateModuleConfig(Diemut, 'diemut', [
    {
      baseURL: '/bm/vizier/',
      headers: { 'X-HOST-REFERRER': 'cod-app.boardmeister.local' } // @TODO env variable
    }
  ]),
  generateModuleConfig(Treasurer, 'treasurer', ['_/']),
  generateModuleConfig(Core, 'antetype-core'),
  generateModuleConfig(Conditions, 'antetype-conditions'),
  generateModuleConfig(Illustrator, 'antetype-illustrator'),
  generateModuleConfig(Workspace, 'antetype-workspace'),
  generateModuleConfig(Transform, 'antetype-transform'),
  generateModuleConfig(Cursor, 'antetype-cursor'),
];
const marshal = new Marshal();
for (const module of modules) {
  marshal.register(module);
}
const getHerald = (): typeof Herald => marshal.get('boardmeister/herald');
const getTreasurer = (): typeof Herald => marshal.get('boardmeister/treasurer');
const loadModules = async (): Promise<Modules> => {
  const event = new CustomEvent<ModulesEvent>(CoreEvent.MODULES, { detail: { modules: {}, canvas: canvas.value }});
  await getHerald().dispatch(event);
  antetypeModules = event.detail.modules as Modules;

  return antetypeModules;
}

const initAntetype = async (base: Layout, settings: ISettings): Promise<void> => {
  await getHerald().dispatch(new CustomEvent<InitEvent>(CoreEvent.INIT, { detail: { base, settings } }));
}

onMounted(async (): Promise<void> => {
  try {
    await marshal.load()
    await loadModules();

    const payload = await getTreasurer().get({
      document: 'template',
      namespace: 'boardmeister',
      name: 'antetype',
      id: '6798ed1c0be82c03620a63b2', // @TODO pass as env variable
      dataset: [
        'data',
        'settings',
      ]
    });
    const layout = JSON.parse(payload.data);
    const settings = JSON.parse(payload.settings);
    await initAntetype(layout, settings);
  } catch (e) {
    console.info('Handle errors', e)
    throw e;
  }
})

</script>

<template>
  <v-container max-width="800" class="flex" align="center">
    <canvas ref="canvas" class="h-screen" style="aspect-ratio: 767 / 1169; max-height: 90vh;"/>
  </v-container>
</template>

<style scoped>

</style>
