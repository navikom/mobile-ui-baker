import React from 'react';
import classNames from 'classnames';
import GridItem from 'components/Grid/GridItem';
import GridContainer from 'components/Grid/GridContainer';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Dictionary, DictionaryService } from 'services/Dictionary/Dictionary';
import useStyles from './editorStyle';
import extraStyles from './figmaStyle';

const LaptopPng = '/images/computer.png';
const chat = '/images/chat.png';
const login = '/images/login.png';
const signup = '/images/signup.png';
const product = '/images/product.png';
const orders = '/images/orders.png';
const basket = '/images/basket.png';
const figmaLogo = '/images/figma-logo.png';
const figmaPopup = '/images/figma-popup.png'


export default function FigmaSection() {
  const classes = useStyles();
  const extraClasses = extraStyles();
  return (
    <div className={classes.section}>
      <GridContainer>
        <GridItem xs={12} sm={12} md={7} lg={7}>
          <div className={classes.laptopSection}>
            <LazyLoadImage
              className={classNames(classes.laptopWrapper, extraClasses.laptopWrapper)}
              src={LaptopPng}
            />
            <div className={extraClasses.figmaPopup}>
              <LazyLoadImage
                className={extraClasses.image}
                src={figmaPopup}
              />
            </div>

            {
              [chat, login, signup, product, orders, basket].map((src, i) => (
                <div key={src} className={classNames(extraClasses.img, extraClasses[`img${i}` as 'img'])}>
                  <LazyLoadImage
                    className={extraClasses.image}
                    src={src}
                  />
                </div>
              ))
            }
            <div className={extraClasses.cover} />
            <div className={extraClasses.figmaLogo}>
              <LazyLoadImage
                className={extraClasses.image}
                src={figmaLogo}
              />
            </div>

          </div>
        </GridItem>
        <GridItem xs={12} sm={12} md={4} lg={4} style={{ marginLeft: 'auto' }}>
          <div className={classes.descriptionWrapper}>
            <h3 className={classes.title}>{Dictionary.defValue(DictionaryService.keys.convertFigmaDesign)}</h3>
            <h6 className={classes.subTitle}>
              {Dictionary.defValue(DictionaryService.keys.downloadEditShare).toUpperCase()}
            </h6>
            <h5 className={classes.description}>
              {Dictionary.defValue(DictionaryService.keys.youGetTheConfiguredUI)}
            </h5>
          </div>
        </GridItem>
      </GridContainer>
    </div>
  )
}
