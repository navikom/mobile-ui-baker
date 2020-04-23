import { action, computed, observable, runInAction } from "mobx";
import IProject from "interfaces/IProject";
import { Dictionary, DictionaryService } from "services/Dictionary/Dictionary";
import validate from "validate.js";
import { IImage } from "interfaces/IImage";
import { App } from "models/App";
import { ROUTE_PROJECTS_LIST } from "models/Constants";
import ProjectsStore from "models/Project/ProjectsStore";
import { Errors } from "models/Errors";
import ProjectStore from "models/Project/ProjectStore";
import ProjectEnum from "enums/ProjectEnum";
import { api, Apis } from "api";

export default class ProjectDataStore extends Errors {
   constraints = {
    title: {
      presence: {
        message: `^${Dictionary.defValue(DictionaryService.keys.cantBeEmpty, Dictionary.defValue(DictionaryService.keys.title))}`
      },
      length: {
        minimum: 2,
        maximum: 50,
        message: `^${Dictionary.defValue(DictionaryService.keys.cantBeMoreAndLessThan, [DictionaryService.keys.message, "50", "2"])}`
      }
    },
    description: {
      length: {
        maximum: 400,
        message: `^${Dictionary.defValue(DictionaryService.keys.cantBeMoreThan, [DictionaryService.keys.message, "400"])}`
      }
    },
     price: {
       numericality: {
         message: `^${Dictionary.defValue(DictionaryService.keys.mustBeANumber, DictionaryService.keys.price)}`
       }
     }
  };
  @observable project: IProject = ProjectStore.createEmpty(ProjectEnum.PROJECT);
  @observable errors?: {[key: string]: string};
  @observable loaderOpen: boolean = false;
  @observable fetchingProject: boolean = false;
  @observable savingProject: boolean = false;
  @observable changed: boolean = false;
  @observable successMessage: string = "";
  @observable files: any;

  @computed get readyToSave() {
    return ((this.changed || (this.files && this.files.length))) && !this.errors && !this.savingProject;
  }

  @action onInput = (key: "title" | "description" | "price") => (value: string) => {
    this.errors = validate(
      {title: this.project.title, description: this.project.description, ...{[key]: value}},
      this.constraints);
    this.project.update({ [key]: value } as unknown as IProject);
    this.changed = true;
  };

  @action setSavingProject(value: boolean) {
    this.savingProject = value;
  }

  @action setFetchingProject(value: boolean) {
    this.fetchingProject = value;
  }

  async save() {
    this.setSavingProject(true);
    try {
      await ProjectsStore.saveWithImages(this.project, this.files);
      this.setSuccessRequest(true);
      this.setTimeOut(() => this.setSuccessRequest(false), 5000);
      this.setFiles(undefined);

      runInAction(() => {
        this.successMessage = Dictionary.defValue(DictionaryService.keys.dataSavedSuccessfully, this.project.title);
        this.changed = false;
        this.files = undefined;
      });
      this.setSuccessRequest(true);
      this.setTimeOut(() => {
        this.setSuccessRequest(false);
      }, 5000);
    } catch (err) {
      this.setError(Dictionary.defValue(DictionaryService.keys.dataSaveError, [this.project.title, Dictionary.value(err.message)]));
      this.setTimeOut(() => this.setError(null), 5000);
    }
    this.setSavingProject(false);
  }

  @action async fetchProjectData(projectId: number | null) {
    if(!projectId) {
      return;
    }
    this.setFetchingProject(true);
    try {
      const project = await ProjectsStore.fetchFullData(projectId);
      runInAction(() => {
        this.project = project;
      });
    } catch (err) {
      console.log("Fetch full instance data error %s", err.message);
      this.setError(Dictionary.defValue(DictionaryService.keys.dataFetchError, [this.project.title, Dictionary.value(err.message)]));
      this.setTimeOut(() => {
        App.navigationHistory && App.navigationHistory.replace(ROUTE_PROJECTS_LIST);
      }, 5000);
    }
    this.setFetchingProject(false);
  }

  @action setFiles(files: any) {
    this.files = files;
    this.setLoaderOpen(false);
  }

  @action onDeletePreloaded(index: number) {
    this.files.splice(index, 1);
  };

  @action async onSortImages(images: IImage[]) {
    const data = images.map((e,i) => ({imageId: e.imageId, sort: i}));
    try {
      await api(Apis.Main).project.sortImages(this.project.projectId, data);
      images.forEach((e, i) => e.setSort(i));
    } catch (e) {
      console.log("Images sorting store error: %s", e.message);
    }
  }

  @action async deleteImage(item: IImage) {
    try {
      await api(Apis.Main).project.deleteImage(this.project.projectId, item.imageId);
      this.project.images!.splice(this.project.images!.indexOf(item), 1);
    } catch (e) {
      console.log("Delete App Image error: %s", e.message);
    }
  }

  @action setLoaderOpen(value: boolean) {
    this.loaderOpen = value;
  }
}
