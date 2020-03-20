import React from "react";
import { observer } from "mobx-react-lite";

// @material-ui/icons
import { AddCircleOutline, DeleteOutline } from "@material-ui/icons";

// @material-ui/core
import { createStyles, Grid, makeStyles, Theme } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";

// services
import { Dictionary, DictionaryService } from "services/Dictionary/Dictionary";

// interfaces
import { ISegmentRegionView } from "interfaces/ISegmentRegionView";

// models
import { ALL } from "models/Constants";

// core components
import FiltarableComponent from "components/Filter/FiltarableComponent";

import { ExcludeType, IncludeType } from "types/expressions";

// view store
import SegmentViewStore from "views/Segments/store/SegmentViewStore";
import { SegmentRegionViewStore } from "views/Segments/store/SegmentRegionViewStore";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    marginTop: {
      marginTop: theme.spacing(2)
    },
    textRight: {
      textAlign: "right"
    }
  })
);

interface IPropsGeoView {
  item: ISegmentRegionView;
  containsList: string[];
  countries: string[];
  index: number;
  count: number;
  addNewItem(): void;
  deleteItem(): void;
}

const GeoLocationComponent = observer((props: IPropsGeoView) => {
  const classes = useStyles();
  const first = {
    value: props.item.currentContains,
    options: props.containsList,
    onChange: (e: string) => props.item.setContains(e as IncludeType | ExcludeType)
  };

  const second = {
    value: props.item.currentCountry,
    options: props.countries,
    onChange: (e: string) => props.item.setCountry(e),
    label: Dictionary.defValue(DictionaryService.keys.country).toLowerCase()
  };

  const third = {
    value: props.item.currentArea,
    options: props.item.areas,
    onChange: (e: string) => props.item.setArea(e),
    label: Dictionary.defValue(DictionaryService.keys.region).toLowerCase(),
    componentType: "select"
  };

  const fourth = {
    values: props.item.currentCities,
    options: props.item.cities,
    onChange: (e: any, values: string[]) => props.item.setCities(values),
    label: Dictionary.defValue(DictionaryService.keys.cities).toLowerCase(),
    placeholder: props.item.currentCities && props.item.currentCities.length ?
      Dictionary.defValue(DictionaryService.keys.more).toLowerCase()
      : Dictionary.value(ALL)
  };

  const showTrash = props.item.currentCities && props.count > 1;
  const showAdd = props.item.currentCities && props.index + 1 === props.count;

  return (
    <Grid container className={classes.marginTop}>
      <Grid item xs={12} sm={9} md={10}>
        <FiltarableComponent
          first={first}
          second={second}
          third={third}
          fourth={fourth}
        />
      </Grid>
      <Grid item xs={12} sm={3} md={2} className={classes.textRight}>
        {
          showAdd && (
            <IconButton onClick={props.addNewItem}>
              <AddCircleOutline color="primary"/>
            </IconButton>
          )
        }
        {
          showTrash && (
            <IconButton onClick={props.deleteItem}>
              <DeleteOutline color="primary"/>
            </IconButton>
          )
        }
      </Grid>
    </Grid>
  );
});

export default observer(() => {
  if (!SegmentViewStore.segment) return null;
  const { containsList, countries } = SegmentRegionViewStore;

  return (
    <div>
      {
        SegmentRegionViewStore.list.map((item: ISegmentRegionView, i: number) =>
          <GeoLocationComponent
            key={i}
            item={item}
            index={i}
            containsList={containsList}
            countries={countries}
            count={SegmentRegionViewStore.list.length}
            addNewItem={() => SegmentRegionViewStore.addNewItem()}
            deleteItem={() => SegmentRegionViewStore.removeItem(i)}
          />)
      }
    </div>
  );
});
