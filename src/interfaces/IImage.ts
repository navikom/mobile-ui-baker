export interface IProjectsImages {
  sorting: number;
}
export interface IImage {
  imageId: number;
  path(userId: number): string;
  width?: number;
  height?: number;
  ProjectsImages?: IProjectsImages;

  setSort: (sort: number) => void;
}
