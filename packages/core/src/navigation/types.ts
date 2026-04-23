export interface MiniAppManifest {
  name: string;
  displayName: string;
  version: string;
  routes: RouteDefinition[];
  tabConfig?: TabConfig;
}

export interface RouteDefinition {
  name: string;
  screen: string;
}

export interface TabConfig {
  icon: string;
  label: string;
  order: number;
}
