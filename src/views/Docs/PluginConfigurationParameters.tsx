import React from 'react';
import { Dictionary, DictionaryService } from 'services/Dictionary/Dictionary';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link/Link';
import { TableBody } from '@material-ui/core';
import HighlightedCode from 'components/Code/HighlightedCode';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableContainer from '@material-ui/core/TableContainer';
import {
  ROUTE_DOCS_PLUGIN,
  ROUTE_DOCS_PLUGIN_METHODS,
  ROUTE_DOCS_PRO_PLAN
} from 'models/Constants';
import Grid from '@material-ui/core/Grid';
import { StyledTableCell, StyledTableRow } from './components/Table';
import { App } from 'models/App';
import Button from '@material-ui/core/Button';
import Code from 'components/Code/Code';

const propertyRows = [
  ['container', 'identifiesTheIdOfTheHtmlElement', 'yes', 'muiditor-plugin-container'],
  ['uid', 'anAlphanumericString', 'yes', ''],
  ['secret', 'anAlphanumericString', 'yes', ''],
  ['data', 'jsonStringWithTheProject', 'no', 'emptyProject']
]

const extendedPropertyRows = [
  ['title', 'customTitle', 'no', ''],
  ['titleLink', 'titleLink', 'no', ''],
  ['hideHeader', 'hideMuiditorHeader', 'no', 'false'],
  ['dictionary', 'customDictionaryTranslation', 'no', '']
]

const PluginConfigurationParameters: React.FC = () => {
  React.useEffect(() => {
    if (window.location.hash) {
      const element = document.getElementById(window.location.hash.substring(1));
      element && element.scrollIntoView(true);
    } else {
      window.scrollTo(0, 0);
    }
  }, []);
  return (
    <div>
      <Typography variant="h1">{Dictionary.defValue(DictionaryService.keys.configurationParameters)}</Typography>
      <br />
      <Typography>{Dictionary.defValue(DictionaryService.keys.onceYouHaveInitialized)}</Typography>
      <HighlightedCode
        content={
          'interface config {\n\tcontainer: string; /* [mandatory] */\n\ttitleLink: string; /* [optional available for Pro Plan] */\n\ttitle: string; /* [optional available for Pro Plan] */\n\tuid: string; /* [mandatory] */\n\tsecret: string; /* [mandatory] */\n\thideHeader: boolean; /* [optional available for Pro Plan] */\n\tdictionary: { [key: string]: string }; /* [optional available for Pro Plan] */\n\tdata: { [key: string]: any }; /* [optional] */\n\tonLoad: (payload: { ios: boolean; portrait: boolean; autoSave: boolean }) => void; /* [optional] */\n\tonData: (data: { [key: string]: any }) => void; /* [optional] */\n\tonSaveProject: (data: { [key: string]: any }) => void; /* [optional] */\n\tonSaveComponent: (data: { [key: string]: any }, base64: string) => void; /* [optional] */\n\tonError: (error: string) => void; /* [optional] */\n\tonSwitchOS: (os: \'ios\' | \'android\') => void; /* [optional available for Pro Plan] */\n\tonSwitchOrientation: (orientation: \'portrait\' | \'landscape\') => void; /* [optional available for Pro Plan] */\n}'
        }
      />
      <br />
      <Typography>{Dictionary.defValue(DictionaryService.keys.hereIsABrief)}</Typography>
      <br />
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <StyledTableCell>{Dictionary.defValue(DictionaryService.keys.property)}</StyledTableCell>
              <StyledTableCell
                align="center">{Dictionary.defValue(DictionaryService.keys.description)}</StyledTableCell>
              <StyledTableCell align="center">{Dictionary.defValue(DictionaryService.keys.required)}</StyledTableCell>
              <StyledTableCell align="center">{Dictionary.defValue(DictionaryService.keys.default)}</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {propertyRows.map((row) => (
              <StyledTableRow key={row[0]}>
                <StyledTableCell component="th" scope="row">
                  <Code>{row[0]}</Code>
                </StyledTableCell>
                <StyledTableCell>{Dictionary.value(row[1])}</StyledTableCell>
                <StyledTableCell align="center">{Dictionary.value(row[2])}</StyledTableCell>
                <StyledTableCell align="center">{Dictionary.value(row[3])}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <br />
      <Typography variant="h2" id="pro-plan-properties">
        {Dictionary.defValue(DictionaryService.keys.advancedParametersAvailableIn)}.
      </Typography>
      <br />
      <Typography>
        {Dictionary.defValue(DictionaryService.keys.ifYouUse)}{' '}
        <Link href={ROUTE_DOCS_PRO_PLAN} target="_blank">Pro Plan</Link>
        {' '}{Dictionary.defValue(DictionaryService.keys.youCanHideTheTopToolbar)}:
      </Typography>
      <br />
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <StyledTableCell>{Dictionary.defValue(DictionaryService.keys.property)}</StyledTableCell>
              <StyledTableCell
                align="center">{Dictionary.defValue(DictionaryService.keys.description)}</StyledTableCell>
              <StyledTableCell align="center">{Dictionary.defValue(DictionaryService.keys.required)}</StyledTableCell>
              <StyledTableCell align="center">{Dictionary.defValue(DictionaryService.keys.default)}</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {extendedPropertyRows.map((row) => (
              <StyledTableRow key={row[0]}>
                <StyledTableCell component="th" scope="row">
                  <Code>{row[0]}</Code>
                </StyledTableCell>
                <StyledTableCell>{Dictionary.value(row[1])}</StyledTableCell>
                <StyledTableCell align="center">{Dictionary.value(row[2])}</StyledTableCell>
                <StyledTableCell align="center">{row[3]}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <br />
      <br />
      <Grid container justify="space-between">
        <Button
          color="primary"
          variant="text"
          onClick={() => App.navigationHistory && App.navigationHistory.push(ROUTE_DOCS_PLUGIN)}>
          {Dictionary.defValue(DictionaryService.keys.goToPluginOverview)}
        </Button>
        <Button
          color="primary"
          variant="text"
          onClick={() => App.navigationHistory && App.navigationHistory.push(ROUTE_DOCS_PLUGIN_METHODS)}>
          {Dictionary.defValue(DictionaryService.keys.goToPluginOverview)}
        </Button>
      </Grid>
    </div>
  )
}

export default PluginConfigurationParameters;
