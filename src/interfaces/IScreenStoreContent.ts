interface IScreenStoreContent {
  path: string[];
  id: string;
  classes: string[];
  action?: string[][];
  source?: string[][];
  text?: string;

  hasAction: boolean;
  hasSource: boolean;
}

export default IScreenStoreContent;
