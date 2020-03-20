import { withStyles } from "@material-ui/core";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";

const CustomExpansionPanelDetails = withStyles({
  root: {
    padding: "0px 24px 24px"
  }
})(ExpansionPanelDetails);

export default CustomExpansionPanelDetails;
