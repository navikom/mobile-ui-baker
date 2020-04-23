import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { sortable } from "react-sortable";
import { DropzoneDialog } from "material-ui-dropzone/dist";
import classNames from "classnames";
import { when } from "mobx";


// @material-ui/icons
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import { Delete, WallpaperOutlined } from "@material-ui/icons";

// @material-ui/core
import { Card, createStyles, makeStyles, Theme } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import CardMedia from "@material-ui/core/CardMedia";
import CardActions from "@material-ui/core/CardActions";
import Divider from "@material-ui/core/Divider";
import InputBase from "@material-ui/core/InputBase";

// services
import { Dictionary, DictionaryService } from "services/Dictionary/Dictionary";

// interfaces

// core components
import Button from "components/CustomButtons/Button";
import CustomInput from "components/CustomInput/CustomInput";
import ProgressButton from "components/CustomButtons/ProgressButton";
import Fab from "components/CustomButtons/Fab";

import useStyles from "assets/jss/material-dashboard-react/components/inputFieldStyle";
import { IImage } from "interfaces/IImage";
import ProjectDataStore from "views/Projects/store/ProjectDataStore";
import { matchPath } from "react-router";
import { RouteComponentProps } from "react-router-dom";
import { App } from "models/App";
import { blackOpacity } from "assets/jss/material-dashboard-react";

const useCardStyles = makeStyles((theme: Theme) => createStyles({
  card: {
    position: "relative",
    maxWidth: 200,
  },
  actions: {
    position: "absolute",
    top: 0,
    width: "93%",
    height: "12%",
    justifyContent: "flex-end"
  },
  button: {
    opacity: .5,
    "&:hover": {
      opacity: .7
    }
  }
}));

const Item = ({ ...props }) => {
  return (
    <Grid item {...props}>
      {props.children}
    </Grid>
  );
};

const SortableItem = sortable(Item);

interface PreloadItemProps {
  onDeleteItem: () => void;
  src: string;
}

const PreloadItem: React.FC<PreloadItemProps> = ({ src, onDeleteItem }) => {
  const classes = useCardStyles();
  return (
    <Grid item>
      <Card className={classes.card}>
        <CardMedia
          component="img"
          height={350}
          image={src}
        />
        <CardActions className={classes.actions}>
          <Fab color="primary" size="superSm" className={classes.button} onClick={onDeleteItem}>
            <Delete />
          </Fab>
        </CardActions>
      </Card>
    </Grid>
  )
};

type ImageItemType = {
  image: IImage;
  items?: IImage[];
  index: number;
  onSortItems(items: IImage[]): void;
  onDeleteItem(): void;
}

const ImageItem: React.FC<ImageItemType> =
  observer(({ onSortItems, image, onDeleteItem, index, items }) => {
    return <SortableItem
      onSortItems={onSortItems}
      items={items}
      sortId={index}>
      <PreloadItem src={image.path(App.user!.userId)} onDeleteItem={onDeleteItem} />
    </SortableItem>;
  });

interface ProjectDataProps {
  store: ProjectDataStore;
}

const ProjectDataComponent: React.FC<ProjectDataProps> = (
  { store }) => {
  const [open, setOpen] = React.useState(false);

  const classes = useStyles();
  const centerNote = classNames(classes.note, classes.center);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    open && (timeoutId = setTimeout(() => {
      setOpen(false);
    }, 2000));
    return () => {
      timeoutId && clearTimeout(timeoutId);
    };
  }, [open]);

  return (
    <Grid container>
      <Grid container justify="center" className={classes.container}>
        <Typography variant="subtitle1">
          {Dictionary.defValue(DictionaryService.keys.overview)}
        </Typography>
      </Grid>

      <Grid container item direction="row" className={classes.container}>
        <Typography variant="subtitle2" className={centerNote}>
          {Dictionary.defValue(DictionaryService.keys.createdAt)}:
        </Typography>
        <InputBase
          disabled
          value={Dictionary.timeDateString(store.project.createdAt)}
        />
      </Grid>
      <Grid container item direction="row" className={classes.container}>
        <Typography variant="subtitle2" className={centerNote}>
          {Dictionary.defValue(DictionaryService.keys.title)}:
        </Typography>
        <CustomInput
          error={store.errors && store.errors.title !== undefined}
          helperText={store.errors && store.errors.title}
          formControlProps={{
            margin: "none"
          }}
          inputProps={{
            onChange: ({ ...e }) => store.onInput("title")(e.target.value),
            value: (store.project.title || ""),
          }}
        />
      </Grid>
      <Grid container item direction="row" className={classes.container}>
        <Typography variant="subtitle2" className={classes.note}>
          {Dictionary.defValue(DictionaryService.keys.description)}:
        </Typography>
        <Grid item sm={10} md={10} xs={12}>
          <CustomInput
            error={store.errors && store.errors.description !== undefined}
            helperText={store.errors && store.errors.description}
            id="description"
            formControlProps={{
              fullWidth: true,
              style: { margin: 0 }
            }}
            inputProps={{
              onChange: ({ ...e }) => store.onInput("description")(e.target.value),
              value: (store.project.description || ""),
              placeholder: Dictionary.defValue(DictionaryService.keys.enterDescription),
              multiline: true,
              style: { border: "1px solid " + blackOpacity(.2), marginTop: 0, padding: "5px" },
              rows: 4
            }}
          />
        </Grid>
      </Grid>
      <Grid container item direction="row" className={classes.container}>
        <Typography variant="subtitle2" className={centerNote}>
          {Dictionary.defValue(DictionaryService.keys.price)}:
        </Typography>
        <CustomInput
          error={store.errors && store.errors.price !== undefined}
          helperText={store.errors && store.errors.price}
          formControlProps={{
            margin: "none"
          }}
          type="number"
          inputProps={{
            onChange: ({ ...e }) => store.onInput("price")(e.target.value),
            value: (store.project.price || ""),
          }}
        />
      </Grid>
      {
        store.files && (
          <Grid container justify="center">
            <Typography variant="subtitle1" className={classes.container}>
              {Dictionary.defValue(DictionaryService.keys.screenshots)} {Dictionary.defValue(DictionaryService.keys.preview)}
            </Typography>
            <Grid container justify="center" spacing={2} className={classes.container}>
              {
                store.files.map((image: any, i: number) =>
                  <PreloadItem key={i.toString()} src={URL.createObjectURL(image)}
                               onDeleteItem={() => store.onDeletePreloaded(i)} />)
              }
            </Grid>
          </Grid>
        )
      }
      <Grid container item sm={12} xs={12} justify="center">
        <ProgressButton
          onClick={() => store.save()}
          disabled={!store.readyToSave}
          variant="contained"
          loading={store.savingProject}
          color="primary"
          text={Dictionary.defValue(DictionaryService.keys.save)}
          startIcon={<CloudUploadIcon />}
        />
      </Grid>
      <Grid item xs={12}>
        <Divider variant="middle" className={classes.divider} />
      </Grid>
      <Grid container justify="center" className={classes.container}>
        <Typography variant="subtitle1">
          {Dictionary.defValue(DictionaryService.keys.screenshots)}
        </Typography>
      </Grid>
      <Grid container spacing={2} className={classes.container}>

        {
          (store.project.images || []).map((e: IImage, i: number) =>
            <ImageItem
              key={i}
              image={e}
              items={store.project.images}
              onSortItems={(items) => store.onSortImages(items)} index={i}
              onDeleteItem={() => store.deleteImage(e)}
            />)
        }
      </Grid>
      <Grid container item justify="center">
        <Button
          onClick={() => store.setLoaderOpen(true)}
          variant="contained"
          color="primary"
          startIcon={<WallpaperOutlined />}
        >{Dictionary.defValue(DictionaryService.keys.uploadMore)}</Button>
      </Grid>
      <DropzoneDialog
        dropzoneText={Dictionary.defValue(DictionaryService.keys.dragAndDrop)}
        open={store.loaderOpen}
        onSave={(e) => store.setFiles(e)}
        acceptedFiles={["image/jpeg", "image/png", "image/bmp"]}
        showPreviews={false}
        showPreviewsInDropzone={true}
        filesLimit={6}
        showAlerts={false}
        maxFileSize={5000000}
        onClose={() => store.setLoaderOpen(false)}
      />

    </Grid>
  );
};

const ProjectData = observer(ProjectDataComponent);
const ProjectItem: React.FC<RouteComponentProps> = ({ history }) => {
  const match = matchPath<{ id: string }>(history.location.pathname, {
    path: "/panel/projects/:id",
    exact: true,
    strict: false
  });
  const id = match ? Number(match.params.id) : null;
  const store = new ProjectDataStore();

  useEffect(() => {
    console.log("Project item mount");
    when(() => App.loggedIn, () => {
      store.fetchProjectData(id);
    });
  }, [store, id]);

  return <ProjectData store={store} />;
};

export default ProjectItem;
