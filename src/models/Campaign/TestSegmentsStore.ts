import {action, computed, observable} from "mobx";
import {ITestSegment} from "interfaces/ITestStep";
import {ITestSegments} from "interfaces/ITestSegments";
import {Errors} from "models/Errors";
import {IErrors} from "interfaces/IErrors";

class TestSegmentsStore extends Errors implements ITestSegments, IErrors {
 @observable items = observable<ITestSegment>([]);

 has(id: number): boolean {
  return computed(() => this.items.some((e: ITestSegment) => id === e.testSegmentId)).get();
 }

 getById(id: number): ITestSegment {
  return computed(() => this.items.find((e: ITestSegment) => e.testSegmentId === id) as ITestSegment).get();
 }

 @action push(data: ITestSegment[]) {
  let l = data.length;
  while (l--) {
   if(!this.has(data[l].testSegmentId)) {
    this.items.push(data[l]);
   }
  }
 }

 @action removeItem(item: ITestSegment) {
  this.items.splice(this.items.indexOf(item), 1);
 }

 @action getOrCreate(data: ITestSegment): ITestSegment {
  if(!this.has(data.testSegmentId)) {
   this.push([data]);
  }
  return this.getById(data.testSegmentId) as ITestSegment;
 }

 @action async saveChanges(item: ITestSegment) {
  try {
   if(item.testSegmentId === 0) {
    item.update({testSegmentId: this.items.length + 1} as ITestSegment);
    this.push([item]);
   }
  } catch (err) {
   console.log("Error save changes segment %s", err.message);
   this.setError(err.message);
  }
 }
}

export const TestSegments = new TestSegmentsStore();
