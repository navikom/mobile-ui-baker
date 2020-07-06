import React from 'react';
import Typography from '@material-ui/core/Typography';
import { Link, makeStyles } from '@material-ui/core';
import { Dictionary, DictionaryService } from 'services/Dictionary/Dictionary';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { App } from 'models/App';
import {
  ROUTE_DOCS_EDITOR_SAMPLE, ROUTE_DOCS_PLUGIN_EDITOR,
} from 'models/Constants';
import Terminal from 'components/Code/Terminal';

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  cover: {
    width: '100%',
    minHeight: 300,
  },
  img: {
    height: 500
  }
});

const PressGenerateButton = 'https://muiditor-plugin.s3.amazonaws.com/generate-rn-package.png';

const GenerateReactNative: React.FC = () => {

  const classes = useStyles();
  return (
    <React.Fragment>
      <Typography variant="h1">
        {Dictionary.defValue(DictionaryService.keys.generateReactNativeSourceCode)}.
      </Typography>
      <br />
      <br />
      <Typography variant="h2">{Dictionary.defValue(DictionaryService.keys.convertTheMobileDesignInto)}.</Typography>
      <br />
      <Typography variant="h3">{Dictionary.defValue(DictionaryService.keys.howToUseIt)}</Typography>
      <br />
      <Typography component="li">
        {Dictionary.defValue(DictionaryService.keys.downloadOrCloneThe)}{' '}
        <Link href="https://github.com/navikom/facetsui-react-native" target="_blank">facetsui-react-native</Link>{' '}
        {Dictionary.defValue(DictionaryService.keys.npmProject)}
      </Typography>
      <br />
      <Typography component="li">
        {Dictionary.defValue(DictionaryService.keys.renameTheProject)}
      </Typography>
      <br />
      <Typography component="li">
        {Dictionary.defValue(DictionaryService.keys.openTheProjectInTheTerminal)}
      </Typography>
      <br />
      <Terminal>{`cd <absolute-path-to-the-project>`}</Terminal>
      <br />
      <Typography component="li">
        {Dictionary.defValue(DictionaryService.keys.initReactNativeInside)}
      </Typography>
      <br />
      <Terminal>npx react-native init YourProjectName</Terminal>
      <br />
      <Typography component="li">
        {Dictionary.defValue(DictionaryService.keys.moveFoldersAndFile)}
      </Typography>
      <br />
      <Terminal>
        mv YourProjectName/ios ios
        <br />
        mv YourProjectName/android android
        <br />
        mv YourProjectName/app.json app.json
      </Terminal>
      <br />
      <Typography component="li">
        {Dictionary.defValue(DictionaryService.keys.deleteTheObsoleteFolder)}
      </Typography>
      <br />
      <Terminal>rm -rf YourProjectName</Terminal>
      <br />
      <Typography component="li"
                  key="li2">{Dictionary.defValue(DictionaryService.keys.pressTheGenerateButton)}.</Typography>
      <br />
      <Grid container justify="center">
        <LazyLoadImage
          className={classes.img}
          src={PressGenerateButton}
        />
      </Grid>
      <br />
      {
        [DictionaryService.keys.unzipGeneratedPackage,
          DictionaryService.keys.dragAndDropUnzipped,
          DictionaryService.keys.pressReplaceIf,
          DictionaryService.keys.inTheTerminalPerform
        ].map((prop, i) => (
          <div key={i.toString()}>
            <Typography component="li">{Dictionary.defValue(prop)}</Typography>
            <br />
          </div>
        ))
      }
      <Typography variant="caption">YARN</Typography>
      <br />
      <Terminal>yarn install</Terminal>
      <br />
      <Typography variant="caption">NPM</Typography>
      <br />
      <Terminal>npm install</Terminal>
      <br />
      <Typography variant="h6">IOS</Typography>
      <br />
      <Terminal>
        cd ios && pod install && cd ..
        <br />
        yarn ios
      </Terminal>
      <br />
      <Typography variant="caption">{Dictionary.defValue(DictionaryService.keys.or)}</Typography>
      <br />
      <Terminal>npm run ios</Terminal>
      <br />
      <Typography variant="h6">ANDROID</Typography>
      <br />
      {
        [DictionaryService.keys.openTheEmulatorInAndroidStudio,
          DictionaryService.keys.compileIt,
        ].map((prop, i) => (
          <div key={i.toString()}>
            <Typography component="li">{Dictionary.defValue(prop)}</Typography>
            <br />
          </div>
        ))
      }
      <Terminal>yarn android</Terminal>
      <Typography variant="caption">{Dictionary.defValue(DictionaryService.keys.or)}</Typography>
      <br />
      <Terminal>npm run android</Terminal>
      <br />
      <Typography variant="h4">{Dictionary.defValue(DictionaryService.keys.afterFewMinutesYouCan)}</Typography>
      <br />
      <Typography>
        {Dictionary.defValue(DictionaryService.keys.tryItNowOpenTheSampleProject)}{' '}
        <Link href="https://facetsui.com/editor/1" target="_blank">&quot;Navigation Example&quot;</Link>
        {' '}{Dictionary.defValue(DictionaryService.keys.andGenerateYourFirstReactNativeProject)}.
      </Typography>
      <br />
      <br />
      <Grid container justify="space-between">
        <Button
          color="primary"
          variant="text"
          onClick={() => App.navigationHistory && App.navigationHistory.push(ROUTE_DOCS_EDITOR_SAMPLE)}>
          {Dictionary.defValue(DictionaryService.keys.goToTheProjectSample)}
        </Button>
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

export default GenerateReactNative;
