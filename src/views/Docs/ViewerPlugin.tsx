import React from 'react';
import { Dictionary, DictionaryService } from 'services/Dictionary/Dictionary';
import Typography from '@material-ui/core/Typography';
import HighlightedCode from 'components/Code/HighlightedCode';
import { Link } from '@material-ui/core';
import { ROUTE_DOCS_PLUGIN_EDITOR } from '../../models/Constants';
import Button from '@material-ui/core/Button';
import { App } from '../../models/App';
import Grid from '@material-ui/core/Grid';

const ViewerPlugin: React.FC = () => {
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <React.Fragment>
      <Typography variant="h1">{Dictionary.defValue(DictionaryService.keys.getStartedPluginForViewer)}</Typography>
      <br />
      <br />
      <Typography variant="h3">{Dictionary.defValue(DictionaryService.keys.runPluginWithReactJs)}.</Typography>
      <br />
      <Typography>
        {Dictionary.defValue(DictionaryService.keys.createPluginInstance)}{' '}
        <Link href={`${ROUTE_DOCS_PLUGIN_EDITOR}#plugin-instance`} target="_blank">
          {Dictionary.defValue(DictionaryService.keys.theSameAsInEditorPlugin)}
        </Link>.
      </Typography>

      <Typography>{Dictionary.defValue(DictionaryService.keys.getTokenAndStartViewer)}.</Typography>
      <HighlightedCode
        id="code2"
        content={
          `
  ...
  
  facetsUI
  .getToken(facetsUI.config.uid || "", facetsUI.config.secret || "")
  .then((token: string) => facetsUI.startViewer(token)});
  
  ...
`
        }
      />
      <br />
      <Typography>
        {Dictionary.defValue(DictionaryService.keys.completeExample)}{' '}
        <Link href="https://github.com/navikom/facetsui-plugin/tree/master/examples/react-sample" target="_blank">React component</Link>.
      </Typography>
      <br />
      <br />
      <Typography variant="h3">{Dictionary.defValue(DictionaryService.keys.runPluginWithVanillaJavascript)}.</Typography>
      <br />
      <Typography>
        {Dictionary.defValue(DictionaryService.keys.fetchPluginInScriptTag)}{' '}
        <Link href={`${ROUTE_DOCS_PLUGIN_EDITOR}#vanilla-javascript`} target="_blank">
          {Dictionary.defValue(DictionaryService.keys.theSameAsInEditorPlugin)}
        </Link>.
      </Typography>
      <Typography>{Dictionary.defValue(DictionaryService.keys.simpleRunPluginInsideHtmlFileInScriptTag)}.</Typography>
      <HighlightedCode
        id="code4"
        content={
          `
  facetsUI
    .getToken(facetsUI.config.uid || '', facetsUI.config.secret || '')
    .then((token) => {
      facetsUI.startViewer(token);
    });
`
        }
      />
      <br />
      <Typography>
        {Dictionary.defValue(DictionaryService.keys.completeExample)}{' '}
        <Link href="https://github.com/navikom/facetsui-plugin/blob/master/examples/browser-sample/index.html" target="_blank">Index HTML file</Link>.
      </Typography>
      <br />
      <br />
      <Grid container justify="space-between">
        <Button
          color="primary"
          variant="text"
          onClick={() => App.navigationHistory && App.navigationHistory.push(ROUTE_DOCS_PLUGIN_EDITOR)}>
          {Dictionary.defValue(DictionaryService.keys.goToPluginEditorUsage)}
        </Button>
      </Grid>
    </React.Fragment>
  )
}

export default ViewerPlugin;
