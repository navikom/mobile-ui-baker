import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

// nodejs library that concatenates classes
import classNames from 'classnames';
// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles';
import { Web } from '@material-ui/icons';

// @material-ui/icons

// core components
import Header from 'components/Header/Header';
import Footer from 'components/Footer/LandingFooter';
import Button from 'components/CustomButtons/RegularButton';
import HeaderLinks from 'components/Header/HeaderLinks';
import Parallax from 'components/Parallax/Parallax';

import styles from 'assets/jss/material-kit-react/views/landingPage';

// Sections for this page
import ProductSection from './Sections/ProductSection';
import GridContainer from 'components/Grid/GridContainer';
import GridItem from 'components/Grid/GridItem';
import { TITLE, ROUTE_EDITOR } from 'models/Constants';
import EditorSection from './Sections/EditorSection';
import { Dictionary, DictionaryService } from 'services/Dictionary/Dictionary';
import SampleSection from './Sections/ShareSection';
import ViewerSection from './Sections/ViewerSection';
import CookiePopup from 'components/CookiePopup';
import useScreenSize from 'hooks/useScreenSize';
import ContactSection from './Sections/ContactSection';
import GenerateRNSection from './Sections/GenerateRNSection';
import FigmaSection from './Sections/FigmaSection';

const useStyles = makeStyles(styles);

const LandingPage: React.FC<RouteComponentProps> = (props) => {
  const isMobile = useScreenSize();
  const classes = useStyles();
  return (
    <React.Fragment>
      <Header
        color="transparent"
        brand={TITLE.toUpperCase()}
        rightLinks={<HeaderLinks {...props} />}
        fixed
        changeColorOnScroll={{
          height: 400,
          color: 'white'
        }}
        {...props}
      />
      <Parallax filter image={require('assets/img/landing-bg.jpg')}>
        <div className={classes.container}>
          <GridContainer>
            <GridItem xs={12} sm={12} md={6}>
              <h1 className={classes.title}>Create Mobile UI, fast.</h1>
              <h4>
                FacetsUI is the easiest, quickest way to design Mobile UI&apos;s
                and convert it into React Native code.
                <br />
                Create beautiful mobile UI&apos;s or embed Editor
                and/or Viewer to your own web application and allow
                your users do it.
              </h4>
              <br />
              <Button
                color="danger"
                size="lg"
                onClick={() => props.history.push(ROUTE_EDITOR)}
              >
                <Web />
                {Dictionary.defValue(DictionaryService.keys.getStarted)}
              </Button>
            </GridItem>
          </GridContainer>
        </div>
      </Parallax>
      <div className={classNames(classes.main, classes.mainRaised)}>
        <div className={classes.container}>
          <ProductSection />
        </div>
        <div className={classes.container}>
          <FigmaSection />
        </div>
        <GenerateRNSection />
        <div className={classes.container}>
          <EditorSection />
        </div>
        <SampleSection />
        <ViewerSection />
      </div>
      <ContactSection />
      <Footer isMobile={isMobile} />
      <CookiePopup />
    </React.Fragment>
  );
};

export default LandingPage;
