import { createStyles } from '@material-ui/core';
import { grayColor, title } from '../../../assets/jss/material-kit-react';

const productStyle = createStyles({
  section: {
    padding: '70px 0',
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  laptopSection: {
    height: '560px',
    position: 'relative',
  },
  laptopWrapper: {
    top: 0,
    left: '-120px',
    width: 'auto',
    height: '100%',
    position: 'absolute'
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
    marginTop: '5px',
    marginBottom: '30px',
    color: '#999',
    fontWeight: 500
  },
  description: {
  },
});

export default productStyle;