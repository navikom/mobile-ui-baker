import React from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import ICSSProperty from 'interfaces/ICSSProperty';
import { Grid, makeStyles } from '@material-ui/core';
import EditorDictionary from 'views/Editor/store/EditorDictionary';
import Typography from '@material-ui/core/Typography';
import { primaryOpacity, whiteOpacity } from 'assets/jss/material-dashboard-react';
import IconButton from '@material-ui/core/IconButton';
import { InfoOutlined } from '@material-ui/icons';
import Link from '@material-ui/core/Link';
import Popover from '@material-ui/core/Popover';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import NumberInput from 'components/CustomInput/NumberInput';
import LabeledInput from 'components/CustomInput/LabeledInput';
import CustomSelect from 'components/CustomSelect/CustomSelect';
import Switch from '@material-ui/core/Switch';
import ColorPicker from '../ColorPicker';
import CSSPropertyBorders from './CSSPropertyBorders';

const useStyles = makeStyles(theme => ({
  root: {
    paddingLeft: 5,
    marginBottom: 5,
    cursor: 'pointer'
  },
  rootEnabled: {
    backgroundColor: primaryOpacity(.08)
  },
  container: {
    margin: '5px 3px 10px',
    padding: '5px 10px',
    backgroundColor: whiteOpacity(.5),
    width: '100%'
  },
  closed: {
    fontSize: 0,
    margin: 0,
    opacity: 0,
    padding: 0,
    height: 0,
    overflow: 'hidden',
    transition: 'all .1s ease-in-out'
  },
  opened: {
    transition: 'all .1s ease-in-out'
  },
  propKeyWrapper: {
    display: 'flex',
    alignItems: 'center'
  },
  pointer: {
    cursor: 'pointer'
  },
  unit: {
    maxWidth: '45%'
  },
  title: {
    fontSize: 14
  }
}));

interface CSSPropertyProps {
  prop: ICSSProperty;
  dictionary: EditorDictionary;
  setValue: (value: string | number) => void;
  switchExpanded: () => void;
  switchEnabled: () => void;
}

const CSSProperty: React.FC<CSSPropertyProps> = (
  {
    prop: {
      enabled,
      title,
      description,
      isString,
      isNumber,
      isColor,
      isBorder,
      options,
      expanded,
      unit,
      units,
      setUnit,
      controlProps,
      cssValue
    },
    setValue,
    switchExpanded,
    switchEnabled,
    dictionary,
  }
) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  const root = classNames({
    [classes.root]: true,
    [classes.rootEnabled]: enabled,
  });
  const container = classNames({
    [classes.container]: true,
    [classes.opened]: enabled,
    [classes.closed]: !enabled
  });
  const expand = classNames(classes.propKeyWrapper, classes.pointer);

  return (
    <>
      <Grid container alignItems="center" justify="space-between" className={root} onClick={switchEnabled}>
        <div className={classes.propKeyWrapper}>
          <Typography className={classes.title}>{title}</Typography>
          {
            description && (
              <IconButton onClick={(e) => {
                setAnchorEl(e.currentTarget);
                e.stopPropagation();
              }}>
                <InfoOutlined fontSize="small" />
              </IconButton>
            )
          }
          {
            description && (
              <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
                onBackdropClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <Card style={{ maxWidth: 300 }}>
                  <CardContent>
                    <Typography color="inherit">{dictionary.value(description[0])}
                      <Link target="_blank" href={description[1]}>
                        {' '}{dictionary.defValue(EditorDictionary.keys.learnMore)}</Link>
                    </Typography>
                  </CardContent>
                </Card>
              </Popover>
            )
          }
        </div>
        <Switch checked={enabled} color="primary" />
      </Grid>
      <div className={container}>
        <Grid container justify="space-between">
          {
            isNumber ? (
              <NumberInput
                disabled={expanded}
                value={cssValue as number}
                onChange={setValue} {...controlProps}
              />
            ) : isString ? (
              <LabeledInput fullWidth value={cssValue} onChange={setValue} />
            ) : isColor ? (
              <ColorPicker color={cssValue as string} onChange={setValue} dictionary={dictionary} />
            ) : isBorder ? (
              <CSSPropertyBorders
                setValue={setValue}
                value={cssValue as string}
              />
            ) : (
              <CustomSelect options={options || []} onChange={setValue} value={cssValue} />
            )
          }
          {
            units && (
              <CustomSelect
                className={classes.unit}
                onChange={setUnit}
                options={units || []}
                value={unit} />
            )
          }
        </Grid>
        {
          expanded !== undefined && (
            <div className={expand} onClick={switchExpanded}>
              <Typography>{dictionary.defValue(EditorDictionary.keys.moreOptions)} </Typography>
              <Switch checked={expanded} color="primary" />
            </div>
          )
        }
      </div>
    </>
  )
};

export default observer(CSSProperty);
