import { IRegion } from "interfaces/IRegion";
import { Dictionary, DictionaryService } from "services/Dictionary/Dictionary";

export class RegionStore implements IRegion {
  city: string;
  country: string;
  ip!: string;
  lg!: number;
  lt!: number;
  region: string;
  regionId: number;
  timezone!: string;

  pk = "regionId";

  get plainData() {
    const data = [
      ["City", this.city || Dictionary.defValue(DictionaryService.keys.unknown)],
      ["Country", this.country || Dictionary.defValue(DictionaryService.keys.unknown)],
      ["Ip", this.ip || Dictionary.defValue(DictionaryService.keys.unknown)],
      ["Coordinates", this.lg ? `${this.lt}, ${this.lg}` :  Dictionary.defValue(DictionaryService.keys.unknown)],
      ["Timezone", this.timezone || Dictionary.defValue(DictionaryService.keys.unknown)],
    ];
    return data;
  }

  constructor(model: IRegion) {
    this.city = model.city;
    this.country = model.country;
    model.ip && (this.ip = model.ip);
    model.lg && (this.lg = model.lg);
    model.lt && (this.lt = model.lt);
    this.region = model.region;
    this.regionId = model.regionId;
    model.timezone && (this.timezone = model.timezone);
  }

  static from(model: IRegion) {
    return new RegionStore(model);
  }
}
