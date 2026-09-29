// Every item from every box, and which boxes each one comes in.
import type { ItemData } from "@/data/repository/ItemData";
import type { ItemDataRepository } from "@/data/repository/ItemDataRepository";
import type { ItemType } from "@/data/type/ItemType";
import type { ArmorType } from "@/data/type/ArmorType";
import type { ConsumableType } from "@/data/type/ConsumableType";
import type { OffHandType } from "@/data/type/OffHandType";
import type { WeaponType } from "@/data/type/WeaponType";
import type { ItemSource } from "@/data/heroMeta";
import { CoreItemDataRepository } from "@/data/repository/campaign/core/CoreItemDataRepository";
import { AwakeningsItemDataRepository } from "@/data/repository/campaign/awakenings/AwakeningsItemDataRepository";
import { ApocalypseItemDataRepository } from "@/data/repository/campaign/apocalypse/ApocalypseItemDataRepository";
import { UnderKeepItemDataRepository } from "@/data/repository/campaign/underkeep/UnderKeepItemDataRepository";
import { UnderKeep2ItemDataRepository } from "@/data/repository/campaign/underkeep2/UnderKeep2ItemDataRepository";

const SOURCES: [ItemSource, ItemDataRepository][] = [
  ["core", new CoreItemDataRepository()],
  ["awakenings", new AwakeningsItemDataRepository()],
  ["apocalypse", new ApocalypseItemDataRepository()],
  ["season-1", new UnderKeepItemDataRepository()],
  ["season-2", new UnderKeep2ItemDataRepository()],
];

export class AllItemsRepository implements ItemDataRepository {
  private items = new Map<string, ItemData>();
  private sources = new Map<string, ItemSource[]>();

  constructor() {
    for (const [source, repository] of SOURCES) {
      for (const item of repository.findAll()) {
        // The first box listed wins for the item's text.
        if (!this.items.has(item.id)) this.items.set(item.id, item);
        const list = this.sources.get(item.id) ?? [];
        list.push(source);
        this.sources.set(item.id, list);
      }
    }
  }

  find(id: string): ItemData | undefined {
    return this.items.get(id);
  }

  findAll(): ItemData[] {
    return [...this.items.values()];
  }

  findByType(
    type: ItemType,
    subType: ArmorType | ConsumableType | OffHandType | WeaponType | null = null,
  ): ItemData[] {
    const seen = new Set<string>();
    const result: ItemData[] = [];
    for (const [, repository] of SOURCES) {
      for (const item of repository.findByType(type, subType)) {
        if (seen.has(item.id)) continue;
        seen.add(item.id);
        result.push(this.items.get(item.id) ?? item);
      }
    }
    return result;
  }

  sourcesOf(id: string): ItemSource[] {
    return this.sources.get(id) ?? [];
  }
}

export const allItemsRepository = new AllItemsRepository();
