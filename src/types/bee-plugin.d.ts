declare module "@mailupinc/bee-plugin" {

 interface IBee {
  new(): IBee;
  start(config: any, templates: any): Promise<any>;
  load(template: any): IBee;
  getToken(clientId: string, clientSecret: string): Promise<any>;
  preview(): void;
  togglePreview(): void;
  toggleStructure(): void;
  save(): void;
  saveAsTemplate(): void;
  send(): void;
 }

 declare const Bee: IBee;

 export = Bee;
}
