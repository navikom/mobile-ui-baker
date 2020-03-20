import React from "react";
import classNames from "classnames";
import {observer} from "mobx-react-lite";

// @material-ui/core
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import IconButton from "@material-ui/core/IconButton";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import {createStyles, makeStyles, Theme} from "@material-ui/core";

// @material-ui/icons
import {AddCircleOutline, EditOutlined, Delete} from "@material-ui/icons";

// services
import {Dictionary, DictionaryService} from "services/Dictionary/Dictionary";

// core components
import CardBody from "components/Card/CardBody";
import Card from "components/Card/Card";
import AutocompleteAsyncInput from "components/CustomInput/AutocompleteAsyncInput";
import CustomSelect from "components/CustomSelect/CustomSelect";

// view stores
import CampaignViewStore from "views/Campaigns/store/CampaignViewStore";
import {TestStepStore} from "views/Campaigns/store/TestStepStore";

// assets
import useStyles from "assets/jss/material-dashboard-react/components/inputFieldStyle";
import {blackOpacity} from "assets/jss/material-dashboard-react";

// components
import SegmentDialog from "views/Campaigns/components/test/SegmentDialog";

const extraStyles = makeStyles((theme: Theme) =>
  createStyles({
   container: {
    marginTop: theme.typography.pxToRem(20)
   },
   label: {
    width: theme.typography.pxToRem(200),
    marginRight: theme.typography.pxToRem(30)
   },
   iconButton: {
    padding: theme.typography.pxToRem(9)
   },
   table: {
    border: "1px solid " + blackOpacity(.1),
    padding: theme.spacing(1)
   }
  }));

const TestStep = () => {

 const classes = useStyles();
 const extraClasses = extraStyles();
 const centerNote = classNames(classes.note, classes.center, classes.textToRight, extraClasses.label);

 const store = CampaignViewStore.testStepStore;
 if (!store) return null;

 return (
   <Card>
    <CardBody>
     <Grid container>
      <Grid container item direction="row">
       <Typography variant="subtitle2" className={centerNote}>
        {Dictionary.defValue(DictionaryService.keys.variants)}
       </Typography>
       <Grid item xs={12} sm={12} md={6}>
        <FormControl fullWidth>
         <CustomSelect
           value={store!.currentVariant}
           onChange={(e: number) => store.setCurrentVariant(e)}
           options={CampaignViewStore.contentStepStore!.variantOptions}
         />
        </FormControl>
       </Grid>
      </Grid>
     </Grid>
     <Grid container item direction="row" className={extraClasses.container}>
      <Typography variant="subtitle2" className={centerNote}>
       {Dictionary.defValue(DictionaryService.keys.sendTestTo)}
      </Typography>
      <Grid container item xs={12} sm={12} md={6}>
       <Grid item xs={12} sm={8} md={TestStepStore.testSegments.items.length > 0 ? 9 : 10}>
        <FormControl fullWidth>
         <CustomSelect
           value={store!.currentSegment.testSegmentId}
           onChange={(e: string) => store!.setCurrentTestSegmentById(e)}
           options={TestStepStore.options}
         />
        </FormControl>
       </Grid>
       <Grid container item xs={12} sm={4} md={TestStepStore.testSegments.items.length > 0 ? 3 : 2} justify="flex-end">
        <IconButton onClick={() => store.setOpen(true)} className={extraClasses.iconButton}>
         <EditOutlined color="primary" />
        </IconButton>
        {
         TestStepStore.testSegments.items.length > 0 && (
           <IconButton onClick={store!.deleteSegment} className={extraClasses.iconButton}>
            <Delete color="primary" />
           </IconButton>
         )
        }
        <IconButton onClick={store.createNewSegment} className={extraClasses.iconButton}>
         <AddCircleOutline color="primary" />
        </IconButton>
       </Grid>
      </Grid>
     </Grid>
     <Grid container item direction="row" className={extraClasses.container}>
      <Typography variant="subtitle2" className={centerNote}>
       {" "}
      </Typography>
      <Grid container item xs={12} sm={12} md={8}>
       <Table aria-label="simple table" className={extraClasses.table}>
        <TableHead>
         <TableRow>
          <TableCell>{Dictionary.defValue(DictionaryService.keys.userId)}</TableCell>
          <TableCell align="right">{Dictionary.defValue(DictionaryService.keys.name)}</TableCell>
          <TableCell align="right">{Dictionary.defValue(DictionaryService.keys.email)}</TableCell>
          <TableCell align="right">{Dictionary.defValue(DictionaryService.keys.phone)}</TableCell>
         </TableRow>
        </TableHead>
        <TableBody>
         <TableRow>
          <TableCell component="th" scope="row">
           123
          </TableCell>
          <TableCell align="right"> - </TableCell>
          <TableCell align="right"> - </TableCell>
          <TableCell align="right"> - </TableCell>
         </TableRow>
        </TableBody>
       </Table>
      </Grid>
     </Grid>
     <Grid container item direction="row" className={extraClasses.container}>
      <Typography variant="subtitle2" className={centerNote}>
       {Dictionary.defValue(DictionaryService.keys.variables)} {Dictionary.defValue(DictionaryService.keys.message)} {Dictionary.defValue(DictionaryService.keys.data)}
      </Typography>
      <Grid item xs={12} sm={12} md={6}>
       <RadioGroup onChange={store!.switchDataOfSegmentedUsers}>
        <FormControlLabel
          checked={store.dataOfSegmentedUsers}
          control={<Radio color="primary" />}
          label={Dictionary.defValue(DictionaryService.keys.useDataOfSegmentedUsers)}
        />
        <FormControlLabel
          checked={!store.dataOfSegmentedUsers}
          control={<Radio color="primary" />}
          label={Dictionary.defValue(DictionaryService.keys.useDataOfChosenUser)}
        />
       </RadioGroup>
      </Grid>
     </Grid>
     {
      !store.dataOfSegmentedUsers && (
        <Grid container item direction="row" className={extraClasses.container}>
         <Typography variant="subtitle2" className={centerNote}>
          {Dictionary.defValue(DictionaryService.keys.findUser)}
         </Typography>
         <Grid item xs={12} sm={12} md={6}>
          <AutocompleteAsyncInput
            label="userId | email | phone"
            options={[123, 234, 324]}
            loading={false} />
         </Grid>
        </Grid>
      )
     }
    </CardBody>
    <SegmentDialog store={store} />
   </Card>
 );
};

export default observer(TestStep);
