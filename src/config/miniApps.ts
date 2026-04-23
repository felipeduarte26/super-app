import type {MiniAppManifest} from '@super-app/core';

export interface MiniAppRegistry {
  manifest: MiniAppManifest;
  getNavigator: () => React.ComponentType;
}

const registry: MiniAppRegistry[] = [];

export function registerMiniApp(entry: MiniAppRegistry): void {
  const exists = registry.some(r => r.manifest.name === entry.manifest.name);
  if (!exists) {
    registry.push(entry);
  }
}

export function getMiniApps(): ReadonlyArray<MiniAppRegistry> {
  return registry
    .slice()
    .sort(
      (a, b) =>
        (a.manifest.tabConfig?.order ?? 99) -
        (b.manifest.tabConfig?.order ?? 99),
    );
}
