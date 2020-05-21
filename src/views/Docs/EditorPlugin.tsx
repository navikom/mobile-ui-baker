import React from 'react';
import { Dictionary, DictionaryService } from 'services/Dictionary/Dictionary';
import Typography from '@material-ui/core/Typography';
import HighlightedCode from 'components/Code/HighlightedCode';
import { Link } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { App } from 'models/App';
import {
  ROUTE_DOCS_PLUGIN_VIEWER,
  ROUTE_DOCS_PRO_PLAN
} from 'models/Constants';
import Grid from '@material-ui/core/Grid';

const EditorPlugin: React.FC = () => {
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <React.Fragment>
      <Typography variant="h1">{Dictionary.defValue(DictionaryService.keys.getStartedPluginForEditor)}</Typography>
      <br />
      <br />
      <Typography variant="h3">{Dictionary.defValue(DictionaryService.keys.runPluginWithReactJs)}.</Typography>
      <br />
      <Typography id="plugin-instance">{Dictionary.defValue(DictionaryService.keys.createPluginInstance)}.</Typography>
      <HighlightedCode
        id="code1"
        content={
` ...

  const onLoad = (payload: { ios: boolean; portrait: boolean; autoSave: boolean }) => {
    console.log(payload);
  }
  
  const onData = (payload: { [key: string]: any }) => {
    console.log(payload);
  };
  
  const config = {
    uid: 'your_client_uid',
    secret: 'your_client_secret',
    container: 'muiditor-plugin-container',
    data: {/* here is a project JSON object */},
    hideHeader: true, /* available in Pro Plan */
    dictionary: {/* here is a dictionary JSON object */}, /* available in Pro Plan */
    onLoad,
    onData
  };
 
  const muiPlugin = new MuiditorPlugin(config);
  
  ...
`
        }
      />
      <br />
      <Typography>{Dictionary.defValue(DictionaryService.keys.getTokenAndStartEditor)}.</Typography>
      <HighlightedCode
        id="code2"
        content={
`
  ...
  
  muiPlugin
  .getToken(muiPlugin.config.uid || "", muiPlugin.config.secret || "")
  .then((token: string) => muiPlugin.startEditor(token)});
  
  ...
`
        }
        />
      <br />
      <Typography>
        {Dictionary.defValue(DictionaryService.keys.completeExample)}{' '}
        <Link href="https://github.com/navikom/muiditor-plugin/tree/master/examples/react-sample" target="_blank">React component</Link>.
      </Typography>
      <br />
      <br />
      <Typography variant="h3" id="vanilla-javascript">{Dictionary.defValue(DictionaryService.keys.runPluginWithVanillaJavascript)}.</Typography>
      <br />
      <Typography>{Dictionary.defValue(DictionaryService.keys.fetchPluginInScriptTag)}.</Typography>
      <HighlightedCode
        id="code3"
        content={
`
  <script src="https://unpkg.com/muiditor-plugin@1.7.2/dist/muiditor-plugin.min.js"/>
`
        }
        />
      <br />
      <Typography>{Dictionary.defValue(DictionaryService.keys.simpleRunPluginInsideHtmlFileInScriptTag)}.</Typography>
      <HighlightedCode
        id="code4"
        content={
`
  var onLoad = (data) => {
    console.log(data);
  };
  var onData = (data) => {
    console.log(data);
  };
  var onSaveComponent = (data, base64) => {
    console.log(data, base64);
  };

  document.getElementById('btn').onclick = () => {
    setProjectData(projectData);
  };

  var muiPlugin = new MuiditorPlugin({
    uid: 'change_to_your_uid',
    secret: 'change_to_your_secret',
    container: 'muiditor-plugin-container',
    data: {/* initial project data */},
    onLoad,
    onData,
    onSaveComponent });

  muiPlugin
    .getToken(muiPlugin.config.uid || '', muiPlugin.config.secret || '')
    .then((token) => {
      muiPlugin.startEditor(token);
    });

  var projectData = {/*here is a project data*/};

  /* available in Pro Plan */
  var setProjectData = (project) => {
    muiPlugin.setProject(project);
  };
`
        }
      />
      <br />
      <Typography>
        {Dictionary.defValue(DictionaryService.keys.completeExample)}{' '}
        <Link href="https://github.com/navikom/muiditor-plugin/blob/master/examples/browser-sample/index.html" target="_blank">Index HTML file</Link>.
      </Typography>
      <br />
      <br />
      <Grid container justify="space-between">
        <Button
          color="primary"
          variant="text"
          onClick={() => App.navigationHistory && App.navigationHistory.push(ROUTE_DOCS_PRO_PLAN)}>
          {Dictionary.defValue(DictionaryService.keys.gotToProPlan)}
        </Button>
        <Button
          color="primary"
          variant="text"
          onClick={() => App.navigationHistory && App.navigationHistory.push(ROUTE_DOCS_PLUGIN_VIEWER)}>
          {Dictionary.defValue(DictionaryService.keys.goToPluginViewerUsage)}
        </Button>
      </Grid>
    </React.Fragment>
  )
}

export default EditorPlugin;
