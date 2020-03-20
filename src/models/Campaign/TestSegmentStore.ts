import {ITestSegment, TestSegmentPropertyType} from "interfaces/ITestStep";
import {action, observable} from "mobx";
import {TestPropertyNames} from "models/Constants";
import {IUser} from "interfaces/IUser";

export class TestSegmentStore implements ITestSegment {
 @observable testSegmentId: number;
 @observable name = "";
 @observable propertyName: TestSegmentPropertyType = TestPropertyNames[0];
 @observable propertyValues: (string | number)[] = [];
 @observable users!: IUser[];

 constructor(id: number) {
  this.testSegmentId = id;
 }

 @action update(model: ITestSegment) {
  Object.assign(this, model);
 }

 @action updateUsers() {

 }
}
