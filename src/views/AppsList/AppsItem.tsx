import React, {useEffect} from 'react';
import {when} from 'mobx';
import {observer, useDisposable} from 'mobx-react-lite';

// @material-ui/icons
import {InfoOutlined, Clear} from '@material-ui/icons';
import AddAlert from '@material-ui/icons/AddAlert';

// services
import {Dictionary, DictionaryService} from 'services/Dictionary/Dictionary';

// interfaces
import {IApp} from 'interfaces/IApp';
import {AppsItemProps} from 'interfaces/AppsItemProps';

// utils
import {lazy} from 'utils';


// models
import {App} from 'models/App';
import {Apps} from 'models/App/AppsStore';
import Snackbar from 'components/Snackbar/Snackbar';
import {AppDataStore} from 'models/App/AppDataStore';
import WaitingComponent from 'hocs/WaitingComponent';


// core components
import AppComponents from 'views/AppsList/components/AppComponents';
import useStyles from 'assets/jss/material-dashboard-react/views/cardStyle';

const CustomTabs = lazy(() => import('components/CustomTabs/CustomTabs'));
const GridContainer = lazy(() => import('components/Grid/GridContainer'));
const GridItem = lazy(() => import('components/Grid/GridItem'));
const Card = lazy(() => import('components/Card/Card'));
const CardHeader = lazy(() => import('components/Card/CardHeader.tsx'));
const CardBody = lazy(() => import('components/Card/CardBody.tsx'));
const AppData = lazy(() => import('views/AppsList/components/AppData/AppData'));

const Content = observer((props: { app: IApp; children: React.ReactNode }) => {
  AppDataStore.bindApp(props.app);
  const classes = useStyles();

  useEffect(() => {
    return () => {
      console.log('clear app');
      AppDataStore.bindApp(null);
    }
  }, []);

  const tabs = AppDataStore.tabs && [{
    tabName: Dictionary.defValue(DictionaryService.keys.basicInfo),
    tabIcon: InfoOutlined,
    tabContent: (<div className={classes.root}><AppData/></div>)
  },
    ...(AppDataStore.tabs || []).map(e => ({...e, tabContent: WaitingComponent(e.tabContent)}))
  ];

  return (
    <div>
      {
        tabs !== undefined ?
          <CustomTabs
            title={`${Dictionary.defValue(DictionaryService.keys.appDetails, AppDataStore.app!.title)}:`}
            headerColor="primary"
            tabs={tabs}
          /> :
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <Card>
                <CardHeader color="primary">
                  <h4 className={classes.cardTitleWhite}>{Dictionary.defValue(DictionaryService.keys.application)}</h4>
                  <p className={classes.cardCategoryWhite}>
                    {Dictionary.defValue(DictionaryService.keys.appDetails, AppDataStore.app!.title)}
                  </p>
                </CardHeader>
                <CardBody>
                  {props.children}
                </CardBody>
              </Card>
            </GridItem>
          </GridContainer>
      }

      <Snackbar
        place="br"
        color="info"
        icon={AddAlert}
        message={Dictionary.defValue(DictionaryService.keys.dataSavedSuccessfully, AppDataStore.app!.title)}
        open={AppDataStore.successRequest}
        closeNotification={() => AppDataStore.setSuccessRequest(false)}
        close
      />
      <Snackbar
        place="br"
        color="danger"
        icon={Clear}
        message={Dictionary.defValue(DictionaryService.keys.dataSaveError, [AppDataStore.app!.title || '', AppDataStore.error || ''])}
        open={AppDataStore.hasError}
        closeNotification={() => AppDataStore.setError(null)}
        close
      />
    </div>
  );
});

export const AppsItem = (props: AppsItemProps) => {
  const appId = Number(props.match.params.appId);
  const pageName = props.match.params.pageName;
  console.log('AppsItem=========== ', pageName);
  const app = Apps.getOrCreate({appId} as IApp) as IApp;

  const dispose = useDisposable(() =>
    when(() => App.sessionIsReady, async () => {
      await AppDataStore.loadFullData(app);
    }));

  useEffect(() => {
    return () => dispose()
  }, [dispose]);

  const key = pageName && `${pageName}_${appId}`;
  const ChildComponent = key && AppComponents[key];
  return <Content app={app}>
    {ChildComponent ? <ChildComponent/> : <AppData/>}
  </Content>;
};

export default AppsItem;
