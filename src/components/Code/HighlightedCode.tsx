import React from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import classNames from 'classnames';
import { makeStyles } from '@material-ui/core';
import { blackOpacity } from 'assets/jss/material-dashboard-react';
import Button from '@material-ui/core/Button';
import { Dictionary, DictionaryService } from '../../services/Dictionary/Dictionary';
import Tooltip from '@material-ui/core/Tooltip';

const useStyles = makeStyles(theme => ({
  root: {
    position: 'relative',
  },
  code: {
    background: blackOpacity(.05) + '!important',
    borderRadius: theme.typography.pxToRem(5)
  },
  fullWidth: {
    width: '99%',
  },
  button: {
    position: 'absolute',
    right: 5,
    top: 5,
  },
  input: {
    position: 'absolute',
    left: -9999
  }
}));

interface CodeProps {
  id?: string;
  fullWidth?: boolean;
  content: string;
}

const HighlightedCode: React.FC<CodeProps> = ({id= 'code', fullWidth, content}) => {
  const [tooltip, setTooltip] = React.useState('copy');
  const classes = useStyles();

  const copyToClipboard = () => {
    const input = document.getElementById(id) as HTMLInputElement & { select: () => void; setSelectionRange: (a: number, b: number) => void };
    if (input) {
      input.select();
      input.setSelectionRange(0, 99999);
      console.log(111111, input.value);
      document.execCommand('copy');
      setTooltip('copied!');
      setTimeout(() => {
        setTooltip('copy');
      }, 2000);
    }

  }

  const root = classNames({
    [classes.root]: true,
    [classes.fullWidth]: fullWidth
  })

  const code = classNames({
    [classes.code]: true,
    [classes.fullWidth]: fullWidth
  });

  return (
    <div className={root}>
      <SyntaxHighlighter className={code} language="javascript" style={docco}>{content}</SyntaxHighlighter>
      <input id={id} type="text" defaultValue={content} className={classes.input}/>
      <Tooltip title={tooltip} placement="left">
        <Button variant="text" onClick={copyToClipboard} size="small" className={classes.button}>
          {Dictionary.defValue(DictionaryService.keys.copy)}
        </Button>
      </Tooltip>
    </div>
  )
  // return (
  //   <SyntaxHighlighter className={code} language="javascript" style={docco}>{content}</SyntaxHighlighter>
  // )
}
export default HighlightedCode;
