import React from "react";
import { observer } from "mobx-react-lite";
import { matchPath, RouteComponentProps } from "react-router";

// @material-ui/core
import { makeStyles } from "@material-ui/core";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import Slide from "@material-ui/core/Slide";
import Fade from "@material-ui/core/Fade";
import { Clear } from "@material-ui/icons";
import AddAlert from "@material-ui/icons/AddAlert";

// services
import { Dictionary, DictionaryService } from "services/Dictionary/Dictionary";

// core components
import CustomInput from "components/CustomInput/CustomInput";
import ProgressButton from "components/CustomButtons/ProgressButton";
import { PasswordType } from "models/User/ChangePasswordStore";
import Snackbar from "components/Snackbar/Snackbar";
import CardHeader from "components/Card/CardHeader";
import CardBody from "components/Card/CardBody";
import Card from "components/Card/Card";
import styles from "assets/jss/material-dashboard-react/views/singlePageStyle";
import ResetPasswordStore from "views/ResetPassword/ResetPasswordStore";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";



function ResetPassword(props: RouteComponentProps) {
  const match = matchPath<{ token: string }>(props.history.location.pathname, {
    path: "/reset/:token",
    exact: true,
    strict: false
  });
  const token = match ? match.params.token : "";
  const classes = makeStyles(styles)();
  const [passwordStore] = React.useState(new ResetPasswordStore(token));
  const store = passwordStore.store;

  const onChange = (name: PasswordType) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => store.onInput(name, e.target.value);

  return (
    <div>
      <GridContainer justify="center">
        <GridItem xs={12} sm={6} md={4}>
          <Slide direction="down" in={true} mountOnEnter unmountOnExit>
            <Fade in={true} mountOnEnter unmountOnExit>
              <div>
                <Card>
                  <CardHeader color="primary" style={{ textAlign: "center" }}>
                    <h4
                      className={classes.cardTitleWhite}>{Dictionary.defValue(DictionaryService.keys.resetPassword)}</h4>
                  </CardHeader>
                  <CardBody>
                      <GridContainer justify="center">
                        <GridItem xs={12} sm={10} md={10}>
                          <CustomInput
                            labelText={Dictionary.defValue(DictionaryService.keys.newPassword)}
                            formControlProps={{
                              fullWidth: true,
                              error: store.errors["newPassword"] !== undefined
                            }}
                            inputProps={{
                              type: "password",
                              onChange: onChange("newPassword"),
                              defaultValue: store.password,
                            }}
                            helperText={store.errors && store.errors["newPassword"]}
                          />
                        </GridItem>
                      </GridContainer>
                      <GridContainer justify="center">
                        <GridItem xs={12} sm={10} md={10}>
                          <CustomInput
                            labelText={Dictionary.defValue(DictionaryService.keys.confirmPassword)}
                            formControlProps={{
                              fullWidth: true,
                              error: store.errors["confirmPassword"] !== undefined
                            }}
                            inputProps={{
                              type: "password",
                              onChange: onChange("confirmPassword"),
                              defaultValue: store.password,
                            }}
                            helperText={store.errors && store.errors["confirmPassword"]}
                          />
                        </GridItem>
                      </GridContainer>
                      <ProgressButton
                        onClick={() => passwordStore.savePassword()}
                        disabled={!passwordStore.readyToSave}
                        variant="contained"
                        loading={passwordStore.fetching}
                        color="primary"
                        text={Dictionary.defValue(DictionaryService.keys.save)}
                        startIcon={<CloudUploadIcon />}
                      />
                  </CardBody>
                </Card>
              </div>
            </Fade>
          </Slide>
        </GridItem>
      </GridContainer>
      <Snackbar
        place="br"
        color="info"
        icon={AddAlert}
        message={passwordStore.successMessage}
        open={passwordStore.successRequest}
        closeNotification={() => passwordStore.setSuccessRequest(false)}
        close
      />
      <Snackbar
        place="br"
        color="danger"
        icon={Clear}
        message={passwordStore.error || ""}
        open={passwordStore.hasError}
        closeNotification={() => passwordStore.setError(null)}
        close
      />
    </div>
  );
}

export default observer(ResetPassword);
