import React, { Suspense } from "react";
import validate from "validate.js";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// utils
import { lazy } from "utils";

// services
import { Dictionary } from "services/Dictionary/Dictionary";

// core components
const Card = lazy(() => import("components/Card/Card.tsx"));
const CardHeader = lazy(() => import("components/Card/CardHeader.tsx"));
const CardBody = lazy(() => import("components/Card/CardBody.tsx"));
const ProgressButton = lazy(() => import("components/CustomButtons/ProgressButton"));
const CustomInput = lazy(() => import("components/CustomInput/CustomInput.tsx"));

const style = {
  typo: {
    paddingLeft: "25%",
    marginBottom: "40px",
    position: "relative"
  },
  note: {
    fontFamily: "\"Josefin Sans\", \"Helvetica\", \"Arial\", sans-serif",
    bottom: "10px",
    color: "#c0c1c2",
    display: "block",
    fontWeight: "400",
    fontSize: "13px",
    lineHeight: "13px",
    left: "0",
    marginLeft: "20px",
    position: "absolute",
    width: "260px"
  },
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0"
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Josefin Sans', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none"
  },
  codeWrapper: {
    width: "100%",
    padding: "5px",
    backgroundColor: "#f4f4f4"
  },
  media: {
    backgroundSize: "contain",
    height: "300px"
  }
};

const constraints = {
  appName: {
    presence: {
      message: `^${Dictionary.value("cantBeEmpty", Dictionary.value("appName"))}`
    },
    format: {
      pattern: "[a-zA-Z]+",
      flags: "i",
      message: `^${Dictionary.value("canOnlyContain", Dictionary.value("appName"))}`
    }
  }
};

class Build extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputs: {
        appName: "mobile"
      }
    };
  }

  onBuild = () => {
    this.npmInstall();
  };

  async npmInstall() {
    try {
      const res = await new ServerApi().callShell({command: "cd .. && ls"});
      const folder = res.result[0].split("\n").filter(e => e.length && e !== "server")[0];
      // await new ServerApi().callShell({command: `cd ../${folder} && npm install`});
      const res2 = await new ServerApi().callShell({command: `cd ../${folder} && npm run android`});
      console.log(res2);
    } catch (e) {
      console.log("error", e);
      alert(e.message);
    }
  }

  onInput = (key, e) => {
    const errors = validate(
      Object.assign({
        ...this.state.inputs
      }, {[key]: e.target.value}), constraints) || {};
    this.setState(
      {
        inputs: {
          ...this.state.inputs,
          [key]: e.target.value
        },
        errorMessage: null,
        errors
      }
    );
  };

  input(key, labelText, id, icon, inputProps = {}) {
    const props = {labelText, id};
    const formControlProps = {style: {float: "left"}};
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
          ...formControlProps
        }}
        inputProps={{
          onInput: e => this.onInput(key, e),
          defaultValue: this.state.inputs[key],
          ...inputProps
        }}
        helperText={helperText}
      />
    );
  }

  render() {
    const {classes} = this.props;
    return (
        <Card>
          <CardHeader color="primary">
            <h4 className={classes.cardTitleWhite}>{Dictionary.value("build")}</h4>
            <p className={classes.cardCategoryWhite}>
              {Dictionary.value("build")}
            </p>
          </CardHeader>
          <CardBody>
            <div className={classes.typo}>
              <h1>{Dictionary.value("setUpApp")}</h1>
            </div>
            {this.input("appName", Dictionary.value("appName"), "appName")}
            <ProgressButton loading={true} text="Save name"/>
          </CardBody>
        </Card>
    );
  }

}

export default withStyles(style)(Build);
