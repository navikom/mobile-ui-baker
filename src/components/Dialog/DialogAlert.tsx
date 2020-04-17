import React from "react";
import { Dialog } from "@material-ui/core";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Slide from "@material-ui/core/Slide";
import { TransitionProps } from "@material-ui/core/transitions";
import Button from "components/CustomButtons/Button";

const Transition: React.ComponentType<TransitionProps> =
  React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface Props {
  open: boolean;
  title: string;
  content: string;
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
  }, [onOk]);

  const onCancelHandler = React.useCallback(() => {
    onCancel && onCancel();
    handleClose();
  }, [onCancel]);

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
        <DialogContentText id="alert-dialog-slide-description">
          {content.charAt(0).toUpperCase() + content.slice(1)}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onOkHandler} color="primary" variant="outlined">
          {okTitle || "Ok"}
        </Button>
        <Button onClick={onCancelHandler} variant="outlined">
          {cancelTitle || "Cancel"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
