import React from 'react';
import { Link, makeStyles, Theme, Typography } from '@material-ui/core';
import { Dictionary, DictionaryService } from 'services/Dictionary/Dictionary';
import { App } from 'models/App';
import { ROUTE_DOCS_GET_STARTED } from 'models/Constants';
import InfoBox from './InfoBox';

const useStyles = makeStyles((theme: Theme) => ({
  link: {
    color: '#00BBFF',
    '&:hover': {
      color: '#31708f'
    }
  },
  ul: {
    margin: 0,
    listStyleType: 'circle'
  }
}));

const BeforeStartBox = () => {
  const classes = useStyles();
  return (
    <InfoBox>
      <Typography variant="h4">
        {Dictionary.defValue(DictionaryService.keys.beforeYouStart)}
      </Typography>
      <br />
      <Typography>
        {Dictionary.defValue(DictionaryService.keys.forAnyTypeOfQuestion)}:
      </Typography>
      <ul className={classes.ul}>
        <Typography component="li">
          {Dictionary.defValue(DictionaryService.keys.readThe)}{' '}
          <Link
            className={classes.link}
            underline="none"
            onClick={() => App.navigationHistory && App.navigationHistory.push(ROUTE_DOCS_GET_STARTED)}>
            {Dictionary.defValue(DictionaryService.keys.documentation)}
          </Link>
        </Typography>
        <Typography component="li">
          {Dictionary.defValue(DictionaryService.keys.checkTheIssuesOn)}{' '}
          <Link
            className={classes.link}
            underline="none"
            href="https://github.com/navikom/facetsui-plugin/issues"
            target="_blank"
          >
            GitHub
          </Link>
        </Typography>
      </ul>
    </InfoBox>
  )
}

export default BeforeStartBox;
