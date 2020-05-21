import React from 'react';
import { Dictionary, DictionaryService } from 'services/Dictionary/Dictionary';
import Typography from '@material-ui/core/Typography';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { TableBody } from '@material-ui/core';
import { StyledTableCell, StyledTableRow } from './components/Table';
import Grid from '@material-ui/core/Grid';
import { ROUTE_DOCS_PLUGIN_PROPERTIES, ROUTE_DOCS_PRO_PLAN } from '../../models/Constants';
import Button from '@material-ui/core/Button';
import { App } from 'models/App';
import Link from '@material-ui/core/Link';
import Code from 'components/Code/Code';

const PluginMethods: React.FC = () => {
  React.useEffect(() => {
    if (window.location.hash) {
      const element = document.getElementById(window.location.hash.substring(1));
      element && element.scrollIntoView(true);
    } else {
      window.scrollTo(0, 0);
    }
  }, []);

  const methodRows = [
    [
      <Code key="code_1">muiPlugin.getToken(uid: string, secret: string)</Code>,
      <>{Dictionary.defValue(DictionaryService.keys.methodReturns)}
        <Code key="code_2">token</Code> {Dictionary.defValue(DictionaryService.keys.by)}
        <Code key="code_3">uid</Code> {Dictionary.defValue(DictionaryService.keys.and)} <Code>secret</Code>.</>,
    ],
    [
      <Code key="code_4">muiPlugin.startEditor(token: string)</Code>,
      <>{Dictionary.defValue(DictionaryService.keys.startsTheEditor)}.</>
    ],
    [
      <Code key="code_5">muiPlugin.startViewer(token: string)</Code>,
      <>{Dictionary.defValue(DictionaryService.keys.startsTheViewer)}.</>
    ],
    [
      <Code key="code_6">muiPlugin.dispose()</Code>,
      <>{Dictionary.defValue(DictionaryService.keys.unmountEventListeners)}.</>
    ]
  ];

  const advancedMethodRows = [
    [
      <Code key="code_7">muiPlugin.switchOrientation()</Code>,
      <>{Dictionary.defValue(DictionaryService.keys.switchesDeviceOrientation)}
        <Code key="code_8">portrait</Code> | <Code key="code_9">landscape</Code>.</>,
    ],
    [
      <Code key="code_10">muiPlugin.setIOSMode(value: boolean)</Code>,
      <>{Dictionary.defValue(DictionaryService.keys.setIOSMode)} <Code key="code_11">true</Code>.</>
    ],
    [
      <Code key="code_12">muiPlugin.switchAutoSave()</Code>,
      <>{Dictionary.defValue(DictionaryService.keys.allowsToSwitchEditorAutoSaveFunctionality)}.</>
    ],
    [
      <Code key="code_13">muiPlugin.makeScreenshot()</Code>,
      <>{Dictionary.defValue(DictionaryService.keys.triggersMakeScreenshotAction)}.</>
    ],
    [
      <Code key="code_14">{'muiPlugin.setProject(data: {[key: string]: any})'}</Code>,
      <>{Dictionary.defValue(DictionaryService.keys.allowsToSetProject)}
        <Code key="code_15">data</Code> {Dictionary.defValue(DictionaryService.keys.intoTheEditorOrViewer)}.</>
    ]
  ];

  const eventRows = [
    [
      <Code key="code_16">onLoad</Code>,
      <>{Dictionary.defValue(DictionaryService.keys.firedWhenJsonLoaded)}.</>,
      <Code key="code_18">{'{ ios: boolean; portrait: boolean; autoSave: boolean }'}</Code>
    ],
    [
      <Code key="code_17">onData</Code>,
      <>{Dictionary.defValue(DictionaryService.keys.firedEveryTimeWhenUserMakeSomeChangeInTheProject)}.</>,
      <Code key="code_29">{'{ [key: string]: any }'}</Code>
    ],
    [
      <Code key="code_19">onSaveProject</Code>,
      <>{Dictionary.defValue(DictionaryService.keys.firedWhenSaveProject)}.</>,
      <Code key="code_20">{'{ [key: string]: any }'}</Code>
    ],
    [
      <Code key="code_21">onSaveComponent</Code>,
      <>{Dictionary.defValue(DictionaryService.keys.firedWhenSaveProject)}.</>,
      <Code key="code_22">{'{ [key: string]: any }, base64: string'}</Code>
    ],
    [
      <Code key="code_23">onError</Code>,
      <>{Dictionary.defValue(DictionaryService.keys.firedEveryTimeWhenError)}.</>,
      <Code key="code_24">{'error: string'}</Code>
    ],
    [
      <Code key="code_25">onSwitchOS</Code>,
      <>{Dictionary.defValue(DictionaryService.keys.firedEveryTimeWhenIos)}.</>,
      <Code key="code_26">{'os: \'ios\' | \'android\''}</Code>
    ],
    [
      <Code key="code_27">onSwitchOrientation</Code>,
      <>{Dictionary.defValue(DictionaryService.keys.firedEveryTimeWhenOrientation)}.</>,
      <Code key="code_28">{'orientation: \'portrait\' | \'landscape\''}</Code>
    ],
  ]
  return (
    <React.Fragment>
      <Typography variant="h1">{Dictionary.defValue(DictionaryService.keys.methodsAndEvents)}</Typography>
      <br />
      <Typography variant="h2" id="plugin-methods">
        {Dictionary.defValue(DictionaryService.keys.instanceMethods)}
      </Typography>
      <br />
      <Typography>
        {Dictionary.defValue(DictionaryService.keys.assumingThat)}{' '}
        <Code>muiPlugin</Code>
        {' '}{Dictionary.defValue(DictionaryService.keys.isTheInstance)}
      </Typography>
      <br />
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <StyledTableCell>{Dictionary.defValue(DictionaryService.keys.method)}</StyledTableCell>
              <StyledTableCell>{Dictionary.defValue(DictionaryService.keys.description)}</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {methodRows.map((row, i) => (
              <StyledTableRow key={i.toString()}>
                <StyledTableCell component="th" scope="row">{row[0]}</StyledTableCell>
                <StyledTableCell>{row[1]}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <br />
      <br />
      <Typography variant="h2" id="plugin-events">
        {Dictionary.defValue(DictionaryService.keys.instanceEvents)}
      </Typography>
      <br />
      <Typography>
        {Dictionary.defValue(DictionaryService.keys.theseAreTheCallbacksThatAreTriggers)}
      </Typography>
      <br />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>{Dictionary.defValue(DictionaryService.keys.events)}</StyledTableCell>
              <StyledTableCell>{Dictionary.defValue(DictionaryService.keys.description)}</StyledTableCell>
              <StyledTableCell>{Dictionary.defValue(DictionaryService.keys.returnedValues)}</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {eventRows.map((row, i) => (
              <StyledTableRow key={i.toString()}>
                <StyledTableCell component="th" scope="row">{row[0]}</StyledTableCell>
                <StyledTableCell>{row[1]}</StyledTableCell>
                <StyledTableCell>{row[2]}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <br />
      <br />
      <Typography variant="h2" id="advanced-plugin-methods">
        {Dictionary.defValue(DictionaryService.keys.advancedInstanceMethodsAvailableIn)}.
      </Typography>
      <br />
      <Typography>
        {Dictionary.defValue(DictionaryService.keys.ifYouUse)}{' '}
        <Link href={ROUTE_DOCS_PRO_PLAN} target="_blank">Pro Plan</Link>
        {' '}{Dictionary.defValue(DictionaryService.keys.youCanTriggerTheTopToolbar)}:
      </Typography>
      <br />
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <StyledTableCell>{Dictionary.defValue(DictionaryService.keys.method)}</StyledTableCell>
              <StyledTableCell>{Dictionary.defValue(DictionaryService.keys.description)}</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {advancedMethodRows.map((row, i) => (
              <StyledTableRow key={i.toString()}>
                <StyledTableCell component="th" scope="row">{row[0]}</StyledTableCell>
                <StyledTableCell>{row[1]}</StyledTableCell>
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
          onClick={() => App.navigationHistory && App.navigationHistory.push(ROUTE_DOCS_PLUGIN_PROPERTIES)}>
          {Dictionary.defValue(DictionaryService.keys.goToPluginProperties)}
        </Button>
        <Button
          color="primary"
          variant="text"
          onClick={() => App.navigationHistory && App.navigationHistory.push(ROUTE_DOCS_PRO_PLAN)}>
          {Dictionary.defValue(DictionaryService.keys.gotToProPlan)}
        </Button>
      </Grid>
    </React.Fragment>
  )
}

export default PluginMethods;
