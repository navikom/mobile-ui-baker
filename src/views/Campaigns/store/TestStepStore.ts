import {ITestSegment, ITestStep} from "interfaces/ITestStep";
import {action, computed, observable} from "mobx";
import {ITestSegments} from "interfaces/ITestSegments";
import {TestSegments} from "models/Campaign/TestSegmentsStore";
import {TestPropertyNames} from "models/Constants";
import {TestSegmentStore} from "models/Campaign/TestSegmentStore";
import {IUser} from "interfaces/IUser";

export class TestStepStore implements ITestStep {
 static propertyNames = TestPropertyNames;
 @observable static testSegments: ITestSegments = TestSegments;

 @observable currentVariant = 0;
 @observable currentSegment!: ITestSegment;
 @observable open = false;
 @observable dataOfSegmentedUsers = true;
 @observable userToTestData!: IUser;

 @computed get isValidStep(): boolean {
  return true;
 }

 constructor() {
  this.setCurrentTestSegment();
 }

 @action setTestUser(user: IUser): void {
  this.userToTestData = user;
 }

 @action switchDataOfSegmentedUsers = (): void => {
  this.dataOfSegmentedUsers = !this.dataOfSegmentedUsers;
 }

 @action setOpen(value: boolean) {
  this.open = value;
 }

 @action setCurrentVariant(variant: number): void {
  this.currentVariant = variant;
 }

 @action setCurrentTestSegment(testSegment: ITestSegment = new TestSegmentStore(0)): void {
  this.currentSegment = testSegment;
 }

 @action setCurrentTestSegmentById(id: string) {
  this.setCurrentTestSegment(TestSegments.getById(Number(id)));
 }

 @action save = () => {
  TestSegments.saveChanges(this.currentSegment);
  this.setOpen(false);
 };

 @action createNewSegment = (): void => {
  this.setCurrentTestSegment();
  this.setOpen(true);
 };

 @action deleteSegment = (): void => {
  TestSegments.removeItem(this.currentSegment);
  this.setCurrentTestSegment(TestSegments.items[0]);

 };

 //########### static ###########//
 @computed static get options() {
  return TestSegments.items.map((e: ITestSegment) => [e.testSegmentId, e.name]);
 }

}
