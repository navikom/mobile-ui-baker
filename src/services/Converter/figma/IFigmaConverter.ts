import IControl from 'interfaces/IControl';
import ZipGenerator from './ZipGenerator';

export interface IFigmaConverter {
  accessKey: string;
  fileKey: string;
  finished: boolean;
  screens: IControl[];
  progress: number;
  screensList: IControl[];
  zipGenerator: ZipGenerator;
  convert(): IFigmaConverter;
}
