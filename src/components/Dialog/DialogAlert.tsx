import React from 'react';
import { createStyles, Dialog, Theme } from '@material-ui/core';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Slide from '@material-ui/core/Slide';
import { TransitionProps } from '@material-ui/core/transitions';
import Button from 'components/CustomButtons/Button';
import { makeStyles } from '@material-ui/core/styles';
import { blackOpacity } from 'assets/jss/material-dashboard-react';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    border: {
      padding: '12px 0',
      '&:not(:last-child)': {
        borderBottom: '1px solid ' + blackOpacity(.07),
      }
    }
  })
);

export const Transition: React.ComponentType<TransitionProps> =
  React.forwardRef(function Transition({ children, ...rest }, ref) {
    return <Slide direction="up" ref={ref} {...rest}>{children as undefined}</Slide>;
  });

interface Props {
  open: boolean;
  title: string;
  content: string | string[];
  okTitle?: string;
  onOk?: () => void;
  cancelTitle?: string;
  onCancel?: () => void;
  handleClose: () => void;
  showCancel?: boolean;
}

export default function AlertDialogSlide(
  {
    open,
    title,
    content,
    okTitle,
    onOk,
    cancelTitle,
    onCancel,
    handleClose,
    showCancel = true
  }: Props) {
  const classes = useStyles();
  const onOkHandler = React.useCallback(() => {
    onOk && onOk();
    handleClose();
  }, [onOk, handleClose]);

  const onCancelHandler = React.useCallback(() => {
    onCancel && onCancel();
    handleClose();
  }, [onCancel, handleClose]);

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle id="alert-dialog-slide-title">{title.charAt(0).toUpperCase() + title.slice(1)}</DialogTitle>
      <DialogContent>
        {
          Array.isArray(content) ? (
            content.map((entry, i) => (
              <Typography key={i.toString()} className={classes.border}>
                {entry.charAt(0).toUpperCase() + entry.slice(1)}
              </Typography>)
            )
          ) : (
            <DialogContentText>
              {content.charAt(0).toUpperCase() + content.slice(1)}
            </DialogContentText>
          )
        }
      </DialogContent>
      <DialogActions>
        <Button onClick={onOkHandler} color="primary" variant="outlined">
          {okTitle || 'Ok'}
        </Button>
        {
          showCancel && (
            <Button onClick={onCancelHandler} variant="outlined">
              {cancelTitle || 'Cancel'}
            </Button>
          )
        }
      </DialogActions>
    </Dialog>
  );
}
