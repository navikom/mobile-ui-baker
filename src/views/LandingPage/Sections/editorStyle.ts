import { createStyles, makeStyles, Theme } from '@material-ui/core';
import { grayColor, title } from '../../../assets/jss/material-kit-react';

const productStyle = makeStyles((theme: Theme) => createStyles({
  section: {
    padding: '70px 0',
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  laptopSection: {
    height: '500px',
    position: 'relative',
    [theme.breakpoints.down("md")]: {
      height: '200px'
    }
  },
  laptopWrapper: {
    top: 0,
    left: '-121px',
    width: 'auto',
    height: '100%',
    position: 'absolute',
    [theme.breakpoints.down("md")]: {
      left: '-21px',
    }
  },
  descriptionWrapper: {
    color: grayColor,
    overflow: 'hidden'
  },
  title: {
    ...title,
    marginTop: '60px'
  },
  subTitle: {
    fontFamily: `"Roboto Slab", "Times New Roman", serif`,
    marginTop: '5px',
    marginBottom: '30px',
    color: '#999',
    fontWeight: 500
  },
  description: {
    fontFamily: `"Roboto Slab", "Times New Roman", serif`
  },
}));

export default productStyle;
