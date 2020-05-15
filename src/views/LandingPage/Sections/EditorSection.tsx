import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import styles from './editorStyle';
import GridItem from 'components/Grid/GridItem';
import GridContainer from 'components/Grid/GridContainer';
import { LazyLoadImage } from 'react-lazy-load-image-component';

const useStyles = makeStyles(styles);

const LaptopPng = '/images/laptop-basics-2.png';

export default function EditorSection() {
  const classes = useStyles();
  return (
    <div className={classes.section}>
      <GridContainer>
        <GridItem xs={12} sm={12} md={5} lg={5}>
          <div className={classes.descriptionWrapper}>
            <h3 className={classes.title}>Drag & drop editor</h3>
            <h6 className={classes.subTitle}>{'Completed with examples'.toUpperCase()}</h6>
            <h5 className={classes.description}>
              The Editor comes with pre-built Mobile UI{'\''}s to help you get started
              faster. You can change the text and images and you{'\''}re good to
              go. More importantly, looking at them will give you a picture of
              what you can build with this powerful editor.
            </h5>
          </div>
        </GridItem>
        <GridItem xs={12} sm={12} md={6} lg={6} style={{ marginLeft: 'auto' }}>
          <div className={classes.laptopSection}>
            <LazyLoadImage
              className={classes.laptopWrapper}
              src={LaptopPng}
            />
          </div>
        </GridItem>
      </GridContainer>
    </div>
  )
}
