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
  tabScreens: string[][];
  leftDrawerWidth: string;
  rightDrawerWidth: string;
  generateRN(): IGenerateService;
  addToTransitionErrors(value: string): void;
  getComponentByControlId(id: string): IGenerateComponent | null;
  generateZip(): void;
}

export default IGenerateService;
