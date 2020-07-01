import React from 'react';
import { Dialog } from '@material-ui/core';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Slide from '@material-ui/core/Slide';
import { TransitionProps } from '@material-ui/core/transitions';
import Button from 'components/CustomButtons/Button';

const Transition: React.ComponentType<TransitionProps> =
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
    handleClose
  }: Props) {
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
              <DialogContentText key={i.toString()}>
                {entry.charAt(0).toUpperCase() + entry.slice(1)}
              </DialogContentText>)
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
        <Button onClick={onCancelHandler} variant="outlined">
          {cancelTitle || 'Cancel'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
