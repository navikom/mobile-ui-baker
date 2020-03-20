import React from "react";
import { when } from "mobx";
import { observer, useDisposable } from "mobx-react-lite";
import { DropzoneDialog } from "material-ui-dropzone/dist";

// @material-ui/core components
import { createStyles, Grid, makeStyles, Theme } from "@material-ui/core";
import TablePagination from "@material-ui/core/TablePagination";
import Avatar from "@material-ui/core/Avatar";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import { IconButtonProps } from "@material-ui/core/IconButton";

// @material-ui/icons

// interfaces
import { IPicture } from "interfaces/Pixart/IPicture";

// models
import { App } from "models/App";

// services
import { Dictionary, DictionaryService } from "services/Dictionary/Dictionary";

// core components
import PixartStore from "views/AppsList/components/Pixart/PixartStore";
import { AppDataStore } from "models/App/AppDataStore";
import { grayColor } from "assets/jss/material-dashboard-react";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import CardActionArea from "@material-ui/core/CardActionArea";
import { WallpaperOutlined } from "@material-ui/icons";
import Button from "components/CustomButtons/Button";

const useCardStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      width: "100%"
    },
    media: {
      height: 0,
      paddingTop: "80%"
    }
  })
);

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      width: "100%",
      boxShadow: "none"
    },
    container: {
      marginBottom: theme.typography.pxToRem(20)
    },
    note: {
      fontWeight: theme.typography.fontWeightBold,
      marginLeft: theme.typography.pxToRem(20),
      width: theme.typography.pxToRem(150),
      opacity: 0.4
    },
    header: {
      color: grayColor[0],
      marginRight: theme.typography.pxToRem(20)
    },
    avatar: {
      backgroundColor: grayColor[0]
    },
    actions: {
      justifyContent: "flex-end"
    }
  })
);

type PaginationType = {
  backIconButtonProps?: Partial<IconButtonProps>;
  count: number;
  labelRowsPerPage?: React.ReactNode;
  nextIconButtonProps?: Partial<IconButtonProps>;
  onChangePage: (
    event: React.MouseEvent<HTMLButtonElement> | null,
    page: number
  ) => void;
  onChangeRowsPerPage?: React.ChangeEventHandler<
    HTMLTextAreaElement | HTMLInputElement
  >;
  page: number;
  rowsPerPage: number;
  rowsPerPageOptions?: Array<number | { value: number; label: string }>;
};

function Pagination(props: PaginationType) {
  return (
    <TablePagination
      labelRowsPerPage={`${Dictionary.defValue(
        DictionaryService.keys.rowsPerPage,
        DictionaryService.keys.pictures
      )}:`}
      component="div"
      backIconButtonProps={{
        "aria-label": "previous page"
      }}
      nextIconButtonProps={{
        "aria-label": "next page"
      }}
      {...props}
    />
  );
}

type PictureCardProps = {
  picture: IPicture;
}

function PictureCard(props: PictureCardProps) {
  const classes = useCardStyles();
  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card className={classes.card}>
        <CardActionArea>
          <CardMedia
            className={classes.media}
            image={props.picture.path()}
            title="Contemplative Reptile"
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              Lizard
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              Lizards are a widespread group of squamate reptiles, with over
              6,000 species, ranging across all continents except Antarctica
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <Button link>Share</Button>
          <Button link>Learn More</Button>
        </CardActions>
      </Card>
    </Grid>
  );
}

function PPictures() {
  const classes = useStyles();
  PixartStore.setMainAppStore(AppDataStore);
  useDisposable(() =>
    when(() => App.sessionIsReady, () => PixartStore.pictures.fetchItems())
  );
  return (
    <Grid container>
      <Card className={classes.card}>
        <CardHeader
          avatar={
            <Avatar aria-label="recipe" className={classes.avatar}>
              P
            </Avatar>
          }
          action={
            <Grid container direction="row">
              <Button
                onClick={() => PixartStore.setDropZoneOpen()}
                variant="contained"
                color="white"
                startIcon={<WallpaperOutlined />}
              >
                {Dictionary.defValue(DictionaryService.keys.upload)}
              </Button>
              <Pagination
                rowsPerPageOptions={PixartStore.pictures.rowsPerPageOptions}
                count={PixartStore.pictures.count}
                rowsPerPage={PixartStore.pictures.viewRowsPerPage}
                page={PixartStore.pictures.viewPage}
                onChangePage={PixartStore.pictures.handleChangePageInView}
                onChangeRowsPerPage={
                  PixartStore.pictures.handleChangeRowsPerPage
                }
              />
            </Grid>
          }
          title={Dictionary.defValue(DictionaryService.keys.pictures)}
          subheader={
            PixartStore.pictures.size > 0
              ? `${Dictionary.defValue(
                  DictionaryService.keys.lastChanged,
                  Dictionary.timeDateString(
                    PixartStore.pictures.items[0].createdAt
                  ) || ""
                )}`
              : ""
          }
        />
        <CardContent>
          <Grid container spacing={2}>
            {PixartStore.pictures.pageData.map((e: IPicture, i: number) => (
              <PictureCard key={i} picture={e} />
            ))}
          </Grid>
        </CardContent>
        <CardActions className={classes.actions}>
          <Pagination
            rowsPerPageOptions={PixartStore.pictures.rowsPerPageOptions}
            count={PixartStore.pictures.count}
            rowsPerPage={PixartStore.pictures.viewRowsPerPage}
            page={PixartStore.pictures.viewPage}
            onChangePage={PixartStore.pictures.handleChangePageInView}
            onChangeRowsPerPage={PixartStore.pictures.handleChangeRowsPerPage}
          />
        </CardActions>
      </Card>
      <DropzoneDialog
        dropzoneText={Dictionary.defValue(DictionaryService.keys.dragAndDrop)}
        filesLimit={10}
        open={PixartStore.pictureDropZoneOpen}
        onSave={e => PixartStore.savePictures(e)}
        acceptedFiles={["image/jpeg", "image/png", "image/bmp"]}
        showPreviews={true}
        maxFileSize={5000000}
        onClose={() => PixartStore.setDropZoneOpen(false)}
      />
    </Grid>
  );
}

export default observer(PPictures);
