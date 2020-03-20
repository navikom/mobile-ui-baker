/* eslint-disable */
import React from "react";
import { observable } from "mobx";
import { observer } from "mobx-react";
// @material-ui/core components
import withStyles, { WithStyles } from "@material-ui/core/styles/withStyles";
import Slide from "@material-ui/core/Slide";
import Fade from "@material-ui/core/Fade";
import FormHelperText from "@material-ui/core/FormHelperText";

// models
import { Auth } from "models/Auth/Auth.ts";

// core components
import GridItem from "components/Grid/GridItem";
import GridContainer from "components/Grid/GridContainer.tsx";
import Button from "components/CustomButtons/Button.tsx";
import Card from "components/Card/Card.tsx";
import CardHeader from "components/Card/CardHeader.tsx";
import CardBody from "components/Card/CardBody.tsx";
import CustomInput from "components/CustomInput/CustomInput.tsx";
import CardFooter from "components/Card/CardFooter.tsx";
import { RouteComponentProps } from "react-router";

import styles from "assets/jss/material-dashboard-react/views/singlePageStyle.tsx";
import { Dictionary, DictionaryService } from "services/Dictionary/Dictionary";

interface FormControlInterface {
  error?: boolean;
}

interface PropsInterface {
  icon?: string;
  error?: boolean;
  success?: boolean;
  labelText: string;
  id: string;
}

interface SignUpProps extends RouteComponentProps, WithStyles<typeof styles> {
}

type SignUpState = {
  errors: any,
  formCompleted: boolean
}

type InputsTypes = "email" | "password" | "confirmPassword";

@observer
class SignUp extends React.Component<SignUpProps, SignUpState> {
  @observable email: string = "";
  @observable password: string = "";
  @observable confirmPassword: string = "";

  state: Readonly<SignUpState> = {
    errors: null,
    formCompleted: false
  };

  onInput = (key: InputsTypes, e: React.ChangeEvent<HTMLInputElement>) => {
    this[key] = e.target.value;
    const errors = Auth.onInput(
      Object.assign({ email: this.email, password: this.password, confirmPassword: this.confirmPassword }, { [key]: e.target.value })
    );

    this.setState({ errors, formCompleted: errors == null });
  };

  onSubmit = async () => {
    Auth.signup(this.email, this.password);
  };

  input(key: InputsTypes, labelText: string, id: string, icon: string, inputProps = {}) {
    const props: PropsInterface = { labelText, id };
    const formControlProps: FormControlInterface = {};
    let helperText = null;
    if (this.state.errors) {
      const error = this.state.errors[key];
      props[error ? "error" : "success"] = true;
      if (error) {
        formControlProps.error = true;
        helperText = error;
      }
    } else {
      props.icon = icon;
    }

    return (
      <CustomInput
        {...props}
        formControlProps={{
          fullWidth: true,
          ...formControlProps
        }}
        inputProps={{
          onInput: (e: React.ChangeEvent<HTMLInputElement>) => this.onInput(key, e),
          defaultValue: this[key],
          ...inputProps
        }}
        helperText={helperText}
      />
    );
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <GridContainer justify="center">
          <GridItem xs={6} sm={6} md={4}>
            <Slide direction="down" in={true} mountOnEnter unmountOnExit>
              <Fade in={true} mountOnEnter unmountOnExit>
                <div>
                  <Card>
                    <CardHeader color="primary" style={{ textAlign: "center" }}>
                      <h4 className={classes.cardTitleWhite}>{Dictionary.defValue(DictionaryService.keys.SignUp)}</h4>
                    </CardHeader>
                    <CardBody>
                      <GridContainer justify="center">
                        <GridItem xs={12} sm={10} md={10}>
                          {this.input("email", "Email", "email-address", "email")}
                        </GridItem>
                      </GridContainer>
                      <GridContainer justify="center">
                        <GridItem xs={12} sm={10} md={10}>
                          {this.input("password", Dictionary.defValue(DictionaryService.keys.password), "password", "lock", { type: "password" })}
                        </GridItem>
                      </GridContainer>
                      <GridContainer justify="center">
                        <GridItem xs={12} sm={10} md={10}>
                          {this.input("confirmPassword", Dictionary.defValue(DictionaryService.keys.confirmPassword), "confirmPassword", "lock", { type: "password" })}
                        </GridItem>
                      </GridContainer>
                      {Auth.hasError && (
                        <GridContainer justify="center">
                          <GridItem xs={12} sm={10} md={10}>
                            <FormHelperText
                              error
                              className={classes.helper}>
                              {Auth.error}
                            </FormHelperText>
                          </GridItem>
                        </GridContainer>
                      )}
                      <GridContainer justify="flex-end">
                        <GridItem xs={12} sm={10} md={10}>
                          <Button onClick={() => this.props.history.goBack()} link size="sm">
                            {Dictionary.defValue(DictionaryService.keys.doYouHaveAccount)}
                          </Button>
                        </GridItem>
                      </GridContainer>
                    </CardBody>

                    <CardFooter justify="center" style={{ justifyContent: "center" }}>
                      <Button color="primary" disabled={!this.state.formCompleted} onClick={this.onSubmit}>
                        {Dictionary.defValue(DictionaryService.keys.SignUp)}
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </Fade>
            </Slide>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

export default withStyles(styles)(SignUp);
