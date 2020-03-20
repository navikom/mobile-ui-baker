import {computed, observable} from "mobx";
import {IObject} from "interfaces/IObject";
import {Errors} from "models/Errors";

export class ObjectStore extends Errors implements IObject {
 readonly parent: string;
 @observable items: Map<string, IObject | string | number | Date | null>;

 get keys() {
  return Array.from(this.items.keys());
 }

 hasNext(key: string): boolean {
  return computed(() => this.items.get(key) instanceof ObjectStore).get();
 }

 constructor(parent: string, keys: string[]) {
  super();
  this.parent = parent;
  this.items = new Map<string, IObject | string | number | Date | null>(
    keys.map(key => [key, null])
  )
 }

}
