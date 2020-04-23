import { action } from 'mobx';
import DisplayViewStore from 'models/DisplayViewStore';
import { App } from 'models/App';
import { ROUTE_VIEWER } from 'models/Constants';

class ViewerViewStore extends DisplayViewStore {

  constructor(urlQuery: string) {
    super(urlQuery)
  }

  @action async fetchProjectData(projectId: number) {
    this.setFetchingProject(true);
    try {
      await super.fetchProjectData(projectId);
    } catch (err) {
      console.log("Fetch full instance data error %s", err.message);
      App.navigationHistory && App.navigationHistory.replace(ROUTE_VIEWER);
    }
    this.setFetchingProject(false);
  }
}

export default ViewerViewStore;
