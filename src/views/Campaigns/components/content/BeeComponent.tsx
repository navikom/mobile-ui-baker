import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { LazyLoadImage } from "react-lazy-load-image-component";

// @material-ui/core
import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Slide from "@material-ui/core/Slide";
import { TransitionProps } from "@material-ui/core/transitions";
import GridListTile from "@material-ui/core/GridListTile";
import GridList from "@material-ui/core/GridList";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

// @material-ui/icons
import { Close, MoreVert } from "@material-ui/icons";

// stores
import { BeeStore } from "views/Campaigns/store/BeeStore";

// services
import { Dictionary, DictionaryService } from "services/Dictionary/Dictionary";

// assets
import basicECommerce from "assets/emailTemplates/templates/v2/BF-basic-e-commerce.json";
import basicNewsletter from "assets/emailTemplates/templates/v2/BF-basic-newsletter.json";
import oneColumn from "assets/emailTemplates/templates/v2/BF-basic-onecolumn.json";
import standard from "assets/emailTemplates/templates/v2/BF-basic-standard.json";
import blank from "assets/emailTemplates/templates/v2/BF-blank-template.json";
import eCommerce from "assets/emailTemplates/templates/v2/BF-ecommerce-template.json";
import newsletter from "assets/emailTemplates/templates/v2/BF-newsletter-template.json";
import promo from "assets/emailTemplates/templates/v2/BF-promo-template.json";
import simple from "assets/emailTemplates/templates/v2/BF-simple-template.json";
import { inheritColor } from "assets/jss/material-dashboard-react";
import responsiveTypeStyles from "assets/jss/material-dashboard-react/responsiveTypeStyles";

import CustomButton from "components/CustomButtons/Button";

const Templates = [
  ["Blank", null, blank],
  ["Basic eCommerce", "BF-basic-e-commerce.png", basicECommerce],
  ["Basic Newsletter", "BF-basic-newsletter.png", basicNewsletter],
  ["One Column", "BF-basic-onecolumn.png", oneColumn],
  ["Standard", "BF-basic-standard.png", standard],
  ["ECommerce", "BF-ecommerce-template.png", eCommerce],
  ["Newsletter", "BF-newsletter-template.png", newsletter],
  ["Promo", "BF-promo-template.png", promo],
  ["Simple", "BF-simple-template.png", simple]
];

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      minWidth: theme.typography.pxToRem(1100),
      height: `calc(100% - ${theme.typography.pxToRem(55)})`,
    },
    wrapper: {
      position: "relative",
      width: "100%",
      height: "100%"
    },
    editor: {
      position: "absolute",
      top: theme.typography.pxToRem(-55),
      right: 0,
      left: 0,
      bottom: 0
    },
    appBar: {
      position: "relative"
    },
    title: {
      marginLeft: theme.spacing(2),
      flex: 1
    },
    root: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-around",
      overflow: "hidden",
      backgroundColor: theme.palette.background.paper
    },
    blankWrapper: {
      width: "100%",
      height: "100%"
    },
    blank: {
      width: "100%",
      height: "84%",
      backgroundColor: inheritColor[0],
      opacity: .5
    },
    gridList: {
      padding: theme.spacing(1),
      width: "60%",
      height: theme.typography.pxToRem(450)
    },
    tile: {
      position: "relative"
    },
    imageCover: {
      position: "absolute",
      display: "flex",
      backgroundColor: inheritColor[0],
      opacity: 0,
      top: 0,
      width: "100%",
      height: "84%",
      fontSize: theme.typography.pxToRem(8),
      fontWeight: "bold",
      alignItems: "center",
      justifyContent: "center",
      "&:hover": {
        cursor: "pointer",
        opacity: .7
      }
    }
  }));

type IBeeComponent = {
  onSave(jsonFile: any, htmlFile: any): void;
  onSend(htmlFile: any): void;
  onSaveAsTemplate(jsonFile: any): void;
  onError(errorMessage: string): void;
  handleClose(): void;
}

const Transition = React.forwardRef<unknown, TransitionProps>(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function EmailTemplatesDialog(props: { open: boolean; handleClose: () => void; onSelect: (template: number) => void }) {
  const { open, handleClose, onSelect } = props;
  const classes = useStyles();

  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
      <div className={classes.root}>
        <GridList cellHeight={160} className={classes.gridList} cols={3}>
          {Templates.map((tile: (string | unknown)[], i: number) => (
            <GridListTile key={i} cols={1} onClick={() => onSelect(i)} className={classes.tile}>
              {
                tile[1] ? (
                  <LazyLoadImage
                    alt={tile[0] as string}
                    src={"/emailTemplates/previews/v2/" + tile[1]}
                  />
                ) : (
                  <div className={classes.blankWrapper}>
                    <div className={classes.blank} />
                  </div>
                )
              }
              <div className={classes.imageCover}>{Dictionary.value(tile[0] as string)}</div>
            </GridListTile>
          ))}
        </GridList>
      </div>
    </Dialog>
  );
}

const EditorHeader = observer((props: { handleClose: () => void; store: BeeStore }) => {
  const { handleClose, store } = props;
  const classes = useStyles();
  const responsiveClasses = responsiveTypeStyles();
  const [structureEnabled, setStructureEnabled] = useState(false);
  const [templatesOpen, setTemplatesOpen] = useState(false);
  const [dialogBeforeLeave, setDialogBeforeLeave] = useState(false);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState<null | HTMLElement>(null);

  const onToggleStructure = () => {
    setStructureEnabled((value: boolean) => !value);
    store.toggleStructure();
  };
  const onTemplateSelect = (index: number) => {
    store.load(Templates[index][2]);
    setTemplatesOpen(false);
  };

  const okHandler = () => {
    store.save();
    setDialogBeforeLeave(false);
    setTimeout(() => {
      handleClose();
    }, 3000);
  };
  const cancelHandler = () => {
    setDialogBeforeLeave(false);
    handleClose();
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const mobileMenuId = "primary-menu";
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMobileButtonClick = (cb: () => void) => () => {
    cb();
    handleMobileMenuClose();
  };

  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem
        onClick={handleMobileButtonClick(() => setTemplatesOpen(true))}>
        {Dictionary.defValue(DictionaryService.keys.templates)}
      </MenuItem>
      <MenuItem
        onClick={handleMobileButtonClick(onToggleStructure)}>
        {Dictionary.defValue(DictionaryService.keys.structure)}
      </MenuItem>
      <MenuItem
        onClick={handleMobileButtonClick(store.preview)}>
        {Dictionary.defValue(DictionaryService.keys.preview)}
      </MenuItem>
      <MenuItem
        onClick={handleMobileButtonClick(store.save)}>
        {Dictionary.defValue(DictionaryService.keys.save)}
      </MenuItem>
    </Menu>
  );

  return (
    <AppBar className={classes.appBar}>
      <Toolbar variant="dense">
        <IconButton disabled={!store.started} edge="start" color="inherit"
                    onClick={() => setDialogBeforeLeave(true)} aria-label="close">
          <Close />
        </IconButton>
        <Typography variant="h6" className={classes.title}>
          {Dictionary.defValue(DictionaryService.keys.email)} {Dictionary.defValue(DictionaryService.keys.editor)}
        </Typography>
        <div className={responsiveClasses.sectionDesktop}>
          <Button disabled={!store.started} color="inherit" onClick={() => setTemplatesOpen(true)}>
            {Dictionary.defValue(DictionaryService.keys.templates)}
          </Button>
          <Button
            disabled={!store.started}
            variant={structureEnabled ? "outlined" : "text"}
            color="inherit"
            onClick={onToggleStructure}>
            {Dictionary.defValue(DictionaryService.keys.structure)}
          </Button>
          <Button disabled={!store.started} color="inherit" onClick={store.preview}>
            {Dictionary.defValue(DictionaryService.keys.preview)}
          </Button>
          <Button disabled={!store.started} color="inherit" onClick={store.save}>
            {Dictionary.defValue(DictionaryService.keys.save)}
          </Button>
        </div>
        <div className={responsiveClasses.sectionMobile}>
          <IconButton
            disabled={!store.started}
            aria-label="show more"
            aria-controls={mobileMenuId}
            aria-haspopup="true"
            onClick={handleMobileMenuOpen}
            color="inherit"
          >
            <MoreVert />
          </IconButton>
        </div>
      </Toolbar>
      <EmailTemplatesDialog
        handleClose={() => setTemplatesOpen(false)}
        open={templatesOpen}
        onSelect={onTemplateSelect} />
      <CloseEditorDialog open={dialogBeforeLeave} onOk={okHandler} onCancel={cancelHandler} />
      {renderMobileMenu}
    </AppBar>
  );
});

function CloseEditorDialog(props: { open: boolean; onOk: () => void; onCancel: () => void }) {
  const { open, onOk, onCancel } = props;
  return (
    <Dialog open={open} aria-labelledby="form-dialog-title" maxWidth="md" fullWidth={true}>
      <DialogContent id="form-dialog-title">
        <DialogContentText>
          {Dictionary.defValue(DictionaryService.keys.emailContentDidNotSave)}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <CustomButton onClick={onCancel} color="info">
          {Dictionary.defValue(DictionaryService.keys.discardAndClose)}
        </CustomButton>
        <CustomButton onClick={onOk} color="primary">
          {Dictionary.defValue(DictionaryService.keys.saveAndClose)}
        </CustomButton>
      </DialogActions>
    </Dialog>
  );
}

function Editor(props: IBeeComponent) {
  const classes = useStyles();
  const store = new BeeStore();
  const { handleClose, ...rest } = props;
  useEffect(() => {

    store.onFetchBeeToken().then(() => store.start(rest)).catch((err) => console.log("Beefree error %s", err.message));
    return () => {
      console.log("Clear Editor");
    };
  }, [store, rest]);
  return (
    <div className={classes.container}>
      <EditorHeader handleClose={handleClose} store={store} />
      <div className={classes.wrapper}>
        <div id="bee-plugin-container" className={classes.editor} />
      </div>
    </div>
  );
}

function BeeComponent(props: IBeeComponent & { open: boolean }) {
  const { open, handleClose, ...rest } = props;
  return (
    <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
      <Editor handleClose={handleClose} {...rest} />
    </Dialog>
  );
}

export default React.memo(BeeComponent);
