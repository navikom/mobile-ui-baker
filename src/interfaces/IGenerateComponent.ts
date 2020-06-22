import IControl from './IControl';

interface IGenerateComponent {
  controls: IControl[];
  componentString: string;
  hash: string;
  nameSpace: string;
  depth: number;

  addControl(control: IControl): void;
  generateNameSpace(cb: (name: string) => string): void;
  generateChildren(getNameSpace: (hash: string) => string): string;
  stylesString(): string;
  generateComponentString(): string;
  toString(): string;
}

export default IGenerateComponent;
