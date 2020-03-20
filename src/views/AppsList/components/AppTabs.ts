import { IAppTab } from "interfaces/IAppTab";
import { Dictionary, DictionaryService } from "services/Dictionary/Dictionary";
import { lazy } from "utils";
import { PhotoLibrary } from "@material-ui/icons";
const PPicture = lazy(() =>
  import("views/AppsList/components/Pixart/PPictures")
);

const appTabs: { [k: number]: IAppTab[] } = {
  1: [
    {
      tabName: Dictionary.defValue(DictionaryService.keys.pictures),
      tabIcon: PhotoLibrary,
      tabContent: PPicture
    }
  ]
};

export default appTabs;
