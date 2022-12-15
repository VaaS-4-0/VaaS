export interface IAction {
  type: string;
  payload: any;
}

export interface IClusterAction {
  type: string;
  payload: IClusterPayload;
}

export interface IClusterPayload {
  clusterId: string;
  clusterMetrics: IClusterMetrics;
}

export interface IClusterMetrics {
  cpuLoad: any | unknown;
  memoryLoad: any;
  totalDeployments: any;
  totalPods: any;
  allNodes: any;
  allNamespaces: any;
  allServices: any;
  allNameList?: any;
}

export interface IClusterUIAction {
  type: string;
  payload: IClusterUIPayload;
}

export interface IClusterUIPayload {
  clusterId?: string;
  clusterUIState?: IClusterUIState;
  darkMode?: boolean;
}

export interface IClusterUIState {
  clusterId?: string;
  currentModule: string;
  fullscreen: boolean;
  modules: any;
  darkmode?: boolean;
}

export interface IOFAction {
  type: string;
  payload: string | [];
}
export interface IOFPayload {
  selectedDeployedFunction?: string;
  selectedOpenFaaSFunction?: string;
  openFaaSFunctions?: [];
  deployedFunctions?: [];
}
