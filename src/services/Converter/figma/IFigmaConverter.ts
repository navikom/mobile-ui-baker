import IControl from 'interfaces/IControl';

export interface IFigmaConverter {
  accessKey: string;
  fileKey: string;
  finished: boolean;
  screens: IControl[];
  progress: number;
  screensList: IControl[];
  convert(): IFigmaConverter;
}
