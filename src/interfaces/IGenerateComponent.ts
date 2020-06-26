import IControl from './IControl';

interface IGenerateComponent {
  controls: IControl[];
  componentString: string;
  hash: string;
  nameSpace: string;
  depth: number;
  styles: Map<string, { [key: string]: any }>;

  addControl(control: IControl): void;
  generateNameSpace(cb: (name: string) => string): void;
  stylesString(): string;
  generateComponentString(): string;
  toString(): string;
}

export default IGenerateComponent;
