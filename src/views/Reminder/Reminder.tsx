import React from "react";
import { observer } from "mobx-react-lite";
import { RouteComponentProps } from "react-router";

// @material-ui/core components
import Slide from "@material-ui/core/Slide";
import Fade from "@material-ui/core/Fade";
import { makeStyles } from "@material-ui/core";

// models
import { Auth } from "models/Auth/Auth";

// core components
import GridItem from "components/Grid/GridItem";
import GridContainer from "components/Grid/GridContainer";
import Button from "components/CustomButtons/Button";
import Card from "components/Card/Card";
import CardHeader from "components/Card/CardHeader";
import CardBody from "components/Card/CardBody";
import CustomInput from "components/CustomInput/CustomInput";
import CardFooter from "components/Card/CardFooter";

import styles from "assets/jss/material-dashboard-react/views/singlePageStyle";
import { Dictionary, DictionaryService } from "services/Dictionary/Dictionary";
import { ROUTE_RECOVERY } from "models/Constants";
import Snackbar from "components/Snackbar/Snackbar";
import AddAlert from "@material-ui/icons/AddAlert";
import { Clear } from "@material-ui/icons";

type ReminderProps = RouteComponentProps

const Reminder: React.FC<ReminderProps> = ({history}) => {
  const [email, setEmail] = React.useState("");
  const [errors, setErrors] = React.useState<{email: string} | undefined>(undefined);

  const onInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrors(Auth.onInput({ email: e.target.value }, ROUTE_RECOVERY));
    setEmail(e.target.value);
  };

  const onSubmit = async () => {
    await Auth.recovery(email);
    setEmail("");
  };

  const classes = makeStyles(styles)();
    return (
      <div>
        <GridContainer justify="center">
          <GridItem xs={12} sm={6} md={4}>
            <Slide direction="down" in={true} mountOnEnter unmountOnExit>
              <Fade in={true} mountOnEnter unmountOnExit>
                <div>
                  <Card>
                    <CardHeader color="primary" style={{ textAlign: "center" }}>
                      <h4 className={classes.cardTitleWhite}>{Dictionary.defValue(DictionaryService.keys.passwordRecovery)}</h4>
                    </CardHeader>
                    <CardBody>
                      <GridContainer justify="center">
                        <GridItem xs={12} sm={10} md={10}>
                          <CustomInput
                            labelText="Email"
                            formControlProps={{
                              fullWidth: true,
                              error: errors !== undefined
                            }}
                            inputProps={{
                              onInput,
                              defaultValue: email,
                            }}
                            helperText={errors && errors!.email}
                          />
                        </GridItem>
                      </GridContainer>
                      <GridContainer justify="center">
                          <Button onClick={() => history.goBack()} link size="sm">
                            {Dictionary.defValue(DictionaryService.keys.doYouHaveAccount)}
                          </Button>
                      </GridContainer>
                    </CardBody>

                    <CardFooter justify="center" style={{ justifyContent: "center" }}>
                      <Button color="primary" disabled={email.length === 0 || errors !== undefined} onClick={onSubmit}>
                        {Dictionary.defValue(DictionaryService.keys.sendEmail)}
                      </Button>
                    </CardFooter>
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
          message={Auth.successMessage}
          open={Auth.successRequest}
          closeNotification={() => Auth.setSuccessRequest(false)}
          close
        />
        <Snackbar
          place="br"
          color="danger"
          icon={Clear}
          message={Auth.error || ""}
          open={Auth.hasError}
          closeNotification={() => Auth.setError(null)}
          close
        />
      </div>
    );
};

export default observer(Reminder);
