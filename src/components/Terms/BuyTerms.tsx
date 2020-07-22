import React from 'react';
import { DialogContent, makeStyles } from '@material-ui/core';
import { Dictionary, DictionaryService } from 'services/Dictionary/Dictionary';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
  subsection: {
    margin: '20px 0 0 5px',
  }
}));

const BuyTerms: React.FC = () => {
  const classes = useStyles();
  return (
    <DialogContent>
      <Typography variant="subtitle1" className={classes.subsection} color="textSecondary">
        {Dictionary.defValue(DictionaryService.keys.agreement1)}
      </Typography>
      <ol type="a">
        {
          [
            Dictionary.defValue(DictionaryService.keys.agreement11),
            Dictionary.defValue(DictionaryService.keys.agreement12)
          ].map((prop, i) => (
            <Typography key={i.toString()} component="li" color="textSecondary">{Dictionary.defValue(prop)}</Typography>
          ))
        }
      </ol>
      <Typography variant="subtitle1" className={classes.subsection} color="textSecondary">
        {Dictionary.defValue(DictionaryService.keys.agreement2)}
      </Typography>
      <ol type="a">
        {
          [
            Dictionary.defValue(DictionaryService.keys.agreement21),
            Dictionary.defValue(DictionaryService.keys.agreement22),
            Dictionary.defValue(DictionaryService.keys.agreement23),
            Dictionary.defValue(DictionaryService.keys.agreement24)
          ].map((prop, i) => (
            <Typography key={i.toString()} component="li" color="textSecondary">{Dictionary.defValue(prop)}</Typography>
          ))
        }
      </ol>
      <Typography variant="subtitle1" className={classes.subsection} color="textSecondary">
        {Dictionary.defValue(DictionaryService.keys.agreement3)}
      </Typography>
      <ol type="a">
        {
          [
            Dictionary.defValue(DictionaryService.keys.agreement31),
            Dictionary.defValue(DictionaryService.keys.agreement32),
          ].map((prop, i) => (
            <Typography key={i.toString()} component="li" color="textSecondary">{Dictionary.defValue(prop)}</Typography>
          ))
        }
      </ol>
      <Typography variant="subtitle1" className={classes.subsection} color="textSecondary">
        {Dictionary.defValue(DictionaryService.keys.agreement4)}
      </Typography>
      <ol type="a">
        {
          [
            Dictionary.defValue(DictionaryService.keys.agreement41),
            Dictionary.defValue(DictionaryService.keys.agreement42),
            Dictionary.defValue(DictionaryService.keys.agreement421),
            Dictionary.defValue(DictionaryService.keys.agreement43),
            Dictionary.defValue(DictionaryService.keys.agreement44),
            Dictionary.defValue(DictionaryService.keys.agreement45),
            Dictionary.defValue(DictionaryService.keys.agreement46),
            Dictionary.defValue(DictionaryService.keys.agreement47),
            Dictionary.defValue(DictionaryService.keys.agreement48),
          ].map((prop, i) => (
            <Typography key={i.toString()} component="li" color="textSecondary">{Dictionary.defValue(prop)}</Typography>
          ))
        }
      </ol>
      <Typography variant="subtitle1" className={classes.subsection} color="textSecondary">
        {Dictionary.defValue(DictionaryService.keys.agreement5)}
      </Typography>
      <ol type="a">
        {
          [
            Dictionary.defValue(DictionaryService.keys.agreement51),
            Dictionary.defValue(DictionaryService.keys.agreement52),
          ].map((prop, i) => (
            <Typography key={i.toString()} component="li" color="textSecondary">{Dictionary.defValue(prop)}</Typography>
          ))
        }
      </ol>
    </DialogContent>
  );
}

export default BuyTerms;
