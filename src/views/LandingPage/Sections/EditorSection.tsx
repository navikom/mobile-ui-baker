import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import styles from './editorStyle';
import GridItem from 'components/Grid/GridItem';
import GridContainer from 'components/Grid/GridContainer';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Dictionary, DictionaryService } from 'services/Dictionary/Dictionary';

const useStyles = makeStyles(styles);

const LaptopPng = '/images/laptop-basics-3.png';

export default function EditorSection() {
  const classes = useStyles();
  return (
    <div className={classes.section}>
      <GridContainer>
        <GridItem xs={12} sm={12} md={5} lg={5}>
          <div className={classes.descriptionWrapper}>
            <h3 className={classes.title}>{Dictionary.defValue(DictionaryService.keys.dragNDrop)}</h3>
            <h6 className={classes.subTitle}>
              {Dictionary.defValue(DictionaryService.keys.completedWithExamples).toUpperCase()}
            </h6>
            <h5 className={classes.description}>
              {Dictionary.defValue(DictionaryService.keys.editorComesWithPrebuilt)}
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
