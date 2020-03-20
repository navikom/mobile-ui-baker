import { ISegmentRegionView } from "interfaces/ISegmentRegionView";
import { ExcludeType, IncludeType, IncludingExpressionTypesArray } from "types/expressions";
import { ALL, ContainsExpressions } from "models/Constants";
import { action, observable } from "mobx";
import { Regions } from "models/Region/RegionsStore";

export class SegmentRegionViewStore implements ISegmentRegionView {
  static containsList: IncludingExpressionTypesArray = ContainsExpressions;
  @observable static countries: string[] = [ALL];
  static readonly list = observable<SegmentRegionViewStore>([]);

  @observable areas?: string[];
  @observable cities?: string[];
  @observable currentContains: IncludeType | ExcludeType = ContainsExpressions[0];
  @observable currentArea?: string;
  @observable currentCountry: string = ALL;
  @observable currentCities?: string[];

  @action setContains(value: IncludeType | ExcludeType) {
    this.currentContains = value;
  }

  @action setCountry(value: string) {
    this.currentCountry = value;
    this.resetArea();
  }

  @action setArea(value: string) {
    this.currentArea = value;
    this.resetCities();
  }

  @action setCities(value: string[]) {
    this.currentCities = value;
  }

  @action resetArea() {
    const areas = Regions.areaNames(this.currentCountry);
    if(areas.length) {
      this.areas = [ALL, ...areas];
      this.currentArea = ALL;
    } else {
      this.areas = undefined;
      this.currentArea = undefined;
    }
    this.resetCities();
  }

  @action resetCities() {
    let cities;
    if(this.currentArea) {
      cities = Regions.cityNames(this.currentCountry, this.currentArea);
    }

    if(cities && cities.length) {
      this.cities = cities;
      this.currentCities = [];
    } else {
      this.cities = undefined;
      this.currentCities = undefined;
    }
  }

  //########### static ##############//

  @action static loadData() {
    this.countries = [ALL, ...Regions.countryNames];
  }

  @action static addNewItem() {
    this.list.push(new SegmentRegionViewStore());
  }

  @action static removeItem(index: number) {
    this.list.splice(index, 1);
  }

  @action static clear() {
    this.list.replace([
      new SegmentRegionViewStore()
    ]);
  }
}
