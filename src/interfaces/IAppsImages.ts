export interface IAppsImages {
  imageId: number;
  sorting?: number;

  path(width?: number): string;
  setSort(value: number): void;
}
