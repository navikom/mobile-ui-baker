import { action, computed, observable } from "mobx";

// interfaces
import { IRegion } from "interfaces/IRegion";

// models
import { Pagination } from "models/Pagination";
import { RegionStore } from "models/Region/RegionStore";

class RegionsStore extends Pagination<IRegion> {
  @observable items: IRegion[] = [];

  @computed get countryNames() {
    const countries: string[] = [];
    let l = this.items.length;
    while (l--) {
      const item = this.items[l];
      item.country && item.country.length && !countries.includes(item.country) && countries.push(item.country);
    }
    return countries;
  }

  areaNames(country: string) {
    return computed(
      () => this.items
        .filter((e: IRegion) => e.country && country === e.country)
        .map((e: IRegion) => e.region).reduce((e: string[], r: string) => {
          !e.includes(r) && e.push(r);
          return e;
        }, [])
    ).get();
  }

  cityNames(country: string, region: string) {
    return computed(
      () => this.items
        .filter((e: IRegion) => e.country && e.region && country === e.country && region === e.region)
        .map((e: IRegion) => e.city).reduce((e: string[], c: string) => {
          !e.includes(c) && e.push(c);
          return e;
        }, [])
    ).get();
  }

  constructor() {
    super("regionId", "region", 10000, "pagination")
  }

  @action push(data: IRegion[]) {
    let l = data.length;
    while (l--) {
      if(!this.has(data[l].regionId)) {
        this.items.push(RegionStore.from(data[l]));
      }
    }
  }

  @action addFakeRegions() {
    this.push([{regionId:2, country: "USA", region: "California", city: "Los Angeles"},
      {regionId:3, country: "USA", region: "California", city: "San Francisco"},
      {regionId:4, country: "USA", region: "California", city: "San Jose"},
      {regionId:5, country: "USA", region: "California", city: "San Diego"},
      {regionId:6, country: "USA", region: "Arizona", city: "Phoenex"},
      {regionId:7, country: "USA", region: "Arizona", city: "Tucson"},
      {regionId:8, country: "England", region: "South East", city: "London"},
      {regionId:9, country: "England", region: "South East", city: "Reading"},
      {regionId:10, country: "England", region: "South East", city: "Brighton"},
      {regionId:11, country: "England", region: "South East", city: "Croydon"},
      {regionId:12, country: "England", region: "South West", city: "Plymouth"},
      {regionId:13, country: "England", region: "South West", city: "Exeter"},
      {regionId:14, country: "England", region: "South West", city: "Exmouth"},
      {regionId:15, country: "England", region: "South West", city: "Taunton"}] as IRegion[]);
  }
}

export const Regions = new RegionsStore();
