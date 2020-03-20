import React from "react";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// utils
import { lazy } from "utils";

// services
import { Dictionary } from "services/Dictionary/Dictionary";
import { LazyLoadImage } from "react-lazy-load-image-component";

// core components
const GridContainer = lazy(() => import("components/Grid/GridContainer.tsx"));
const GridItem = lazy(() => import("components/Grid/GridItem.tsx"));
const Card = lazy(() => import("components/Card/Card.tsx"));
const CardHeader = lazy(() => import("components/Card/CardHeader.tsx"));
const CardBody = lazy(() => import("components/Card/CardBody.tsx"));
const Button = lazy(() => import("components/CustomButtons/Button.tsx"));


// images
const Image1 = "/images/guide/1.png";
const Image2 = "/images/guide/2.png";
const Image3 = "/images/guide/3.png";
const Image4 = "/images/guide/4.png";
const Image5 = "/images/guide/5.png";
const Image6 = "/images/guide/6.png";
const Image7 = "/images/guide/7.png";
const Image8 = "/images/guide/8.png";
const Image9 = "/images/guide/9.png";
const Image10 = "/images/guide/10.png";
const Image11 = "/images/guide/11.png";
const Image12 = "/images/guide/12.png";
const Image13 = "/images/guide/13.png";
const Image14 = "/images/guide/14.png";
const Image15 = "/images/guide/15.png";
const Image16 = "/images/guide/16.png";
const Image17 = "/images/guide/17.png";
const Image18 = "/images/guide/18.png";
const Image19 = "/images/guide/19.png";
const Image20 = "/images/guide/20.png";
const Image21 = "/images/guide/21.png";

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

class Guide extends React.Component {
  constructor(props) {
    super(props);
    this.container = React.createRef();
  }

  onBuild = () => {
  };

  render() {
    const {classes} = this.props;
    return (
        <Card>
          <CardHeader color="primary">
            <h4 className={classes.cardTitleWhite}>{Dictionary.value("guide1")}</h4>
            <p className={classes.cardCategoryWhite}>
              {Dictionary.value("guide2")}
            </p>
          </CardHeader>
          <CardBody>
            <div className={classes.typo}>
              <h1>{Dictionary.value("guide3")}</h1>
            </div>
            <div className={classes.typo}>
              <a href="#step1">
                <div className={classes.note}>{Dictionary.value("step", 1)}</div>
                <h3>{Dictionary.value("guide1_2")}.</h3>
              </a>
            </div>
            <div className={classes.typo}>
              <a href="#step2">
                <div className={classes.note}>{Dictionary.value("step", 2)}</div>
                <h3>{Dictionary.value("guide4")}.</h3>
              </a>
            </div>
            <div className={classes.typo}>
              <a href="#step3">
                <div className={classes.note}>{Dictionary.value("step", 3)}</div>
                <h3>{Dictionary.value("guide5")}.</h3>
              </a>
            </div>
            <div className={classes.typo}>
              <a href="#step4">
                <div className={classes.note}>{Dictionary.value("step", 4)}</div>
                <h3>{Dictionary.value("guide6_1")}.</h3>
              </a>
            </div>
            <div className={classes.typo}>
              <a href="#step5">
                <div className={classes.note}>{Dictionary.value("step", 5)}</div>
                <h3>{Dictionary.value("guide6")}.</h3>
              </a>
            </div>
            <div className={classes.typo} id="step1">
              <h2>{Dictionary.value("guide1_2")}</h2>
            </div>
            <h4>{Dictionary.value("guide17", "Admin Panel")} <a target="_blank" rel="noopener noreferrer"
                                                                href="https://www.jetbrains.com/webstorm/">WebStorm</a> {Dictionary.value("guide18")}
            </h4>
            <h4>{Dictionary.value("guide19")}:</h4>
            <div className={classes.codeWrapper}>
              <code>npm install</code>
            </div>
            <h4>{Dictionary.value("guide1_3")}:</h4>
            <div className={classes.codeWrapper}>
              <code>npm start</code>
            </div>
            <h4>{Dictionary.value("guide1_4")} <a target="_blank" rel="noopener noreferrer"
                                                  href="http://localhost:3000/">http://localhost:3000</a> {Dictionary.value("guide1_5")}.
            </h4>
            <div className={classes.typo} id="step2">
              <h2>{Dictionary.value("guide4")}</h2>
            </div>
            <h4>{Dictionary.value("guide7")}
              <a href="https://console.firebase.google.com" target="_blank"
                 rel="noopener noreferrer"> https://console.firebase.google.com</a> {Dictionary.value("guide8")}
            </h4>
            {
              [[Image1], [Image2], [Image3], [Image4], [Image5], [Image6], [Image7], [Image8], [Image9],
                [Image10, <h4>{Dictionary.value("openFirebaseConfig")}</h4>],
                [Image11], [Image12],
                [Image13,
                  <h4>{Dictionary.value("insertFBCredentials")} <code>admin-panel/src/config/Firebase.js</code></h4>],
                [Image14, <h4>{Dictionary.value("createDatabase")}</h4>], [Image15], [Image16], [Image17], [Image18]]
                .map((entry, i) => (
                  <div key={i}>
                    <GridContainer justify="center">
                      <GridItem xs={12} sm={8} md={8}>
                        <LazyLoadImage
                          className={classes.media}
                          src={entry[0]}
                          height={300}
                        />
                      </GridItem>
                    </GridContainer>
                    {entry[1] ? entry[1] : <br/>}
                  </div>
                ))
            }
            <h4>{Dictionary.value("guide23")}</h4>
            <Button color="primary" onClick={this.onBuild}>{Dictionary.value("Build")}</Button>
            <div className={classes.typo} id="step3">
              <h2>{Dictionary.value("guide5")}</h2>
            </div>
            {
              ["guide9", "guide10", "guide11", "guide12"].map((e, i) => <h4 key={i}>{Dictionary.value(e)}</h4>)
            }
            <ul>
              <li>
                <h4><b>IOS</b> {Dictionary.value("guide13")}</h4>
              </li>
              <li>
                <h4><b>ANDROID</b> {Dictionary.value("guide14")} <a target="_blank" rel="noopener noreferrer"
                                                                    href="https://facebook.github.io/react-native/docs/getting-started.html">{Dictionary.value("guide15")}</a>)
                </h4>
              </li>
            </ul>
            <h4>{Dictionary.value("guide16")}:</h4>
            <div className={classes.codeWrapper}>
              <code>npm install -g react-native-cli</code>
            </div>
            <div className={classes.typo} id="step4">
              <h2>{Dictionary.value("guide6_1")}</h2>
            </div>
            <h4>{Dictionary.value("guide6_2")} <a target="_blank" rel="noopener noreferrer"
                                                  href="https://developers.google.com/places/web-service/intro">Google
              Maps Platform</a> {Dictionary.value("guide6_3")}.
            </h4>
            <h4>{Dictionary.value("guide6_4")}
              <code>taxi/android/app/src/main/AndroidManifest.xml</code> {Dictionary.value("guide6_5")}</h4>
            <div className={classes.codeWrapper}>
              <code>{
                `<meta-data
                android:name="com.google.android.geo.API_KEY"
                android:value="HERE SHOULD BE API KEY" />`
              }</code>
            </div>
            <h4>{Dictionary.value("on")}</h4>
            <div className={classes.codeWrapper}>
              <code>{
                `<meta-data
                android:name="com.google.android.geo.API_KEY"
                android:value="YOUR API KEY FROM GOOGLE MAPS PLATFORM" />`
              }</code>
            </div>
            <h4>{Dictionary.value("guide6_4")} <code>taxi/app/service/gps.js</code> {Dictionary.value("guide6_5")}</h4>
            <div className={classes.codeWrapper}>
              <code>export const API_KEY = 'HERE SHOULD BE API KEY';</code>
            </div>
            <h4>{Dictionary.value("on")}</h4>
            <div className={classes.codeWrapper}>
              <code>export const API_KEY = 'YOUR API KEY FROM GOOGLE MAPS PLATFORM';</code>
            </div>
            <div className={classes.typo} id="step5">
              <h2>{Dictionary.value("guide6")}</h2>
            </div>
            <h4>{Dictionary.value("guide17", "React-native app")} <a target="_blank" rel="noopener noreferrer"
                                                                     href="https://www.jetbrains.com/webstorm/">WebStorm</a> {Dictionary.value("guide18")}
            </h4>
            <h4>{Dictionary.value("guide19")}:</h4>
            <div className={classes.codeWrapper}>
              <code>npm install</code>
            </div>
            <GridContainer justify="center">
              <GridItem xs={12} sm={8} md={8}>
                <LazyLoadImage
                  className={classes.media}
                  src={Image21}
                />
              </GridItem>
            </GridContainer>
            <h4>{Dictionary.value("guide20")}:</h4>
            <div className={classes.codeWrapper}>
              <code>react-native run-ios</code>
            </div>
            <GridContainer justify="center">
              <GridItem xs={12} sm={8} md={8}>
                <LazyLoadImage
                  className={classes.media}
                  src={Image19}
                />
              </GridItem>
            </GridContainer>
            <br/>
            <GridContainer justify="center">
              <GridItem xs={12} sm={8} md={8}>
                <LazyLoadImage
                  className={classes.media}
                  src={Image20}
                />
              </GridItem>
            </GridContainer>
            <h4>{Dictionary.value("guide21")}:</h4>
            <div className={classes.codeWrapper}>
              <code>react-native run-android</code>
            </div>
            <h4>{Dictionary.value("guide22")}</h4>
          </CardBody>
        </Card>
    );
  }

}

export default withStyles(style)(Guide);
