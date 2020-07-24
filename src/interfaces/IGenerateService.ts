import IMobileUIView from './IMobileUIView';
import IStoreContent from './IStoreContent';
import IGenerateComponent from './IGenerateComponent';

interface IGenerateService {
  store: IMobileUIView;
  leftDrawer: Map<string, string[]>;
  rightDrawer: Map<string, string[]>;
  tab: Map<string, string[]>;
  storeContent: Map<string, IStoreContent[]>;
  components: Map<string, IGenerateComponent>;
  screenNames: { id: string; title: string }[];
  tabScreens: string[][];
  rightDrawerScreens: string[][];
  leftDrawerWidth: string;
  rightDrawerWidth: string;
  bareScreens: { id: string; title: string }[];
  finished: boolean;
  generateRN(): IGenerateService;
  addToTransitionErrors(value: string): void;
  getComponentByControlId(id: string): IGenerateComponent | null;
  generateZip(): void;
  setFinished(): void;
}

export default IGenerateService;
