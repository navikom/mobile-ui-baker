import { ExcludeType, IncludeType } from "types/expressions";
import { AllType } from "types/commonTypes";

export interface ISegmentRegionView {
  currentContains: IncludeType | ExcludeType;
  currentCountry: string;
  areas?: string[];
  currentArea?: string;
  cities?: string[];
  currentCities?: string[] | AllType;

  setContains(value: IncludeType | ExcludeType): void;
  setCountry(value: string): void;
  setArea(value: string): void;
  setCities(value: string[]): void;
}
