import { matchPath, RouteComponentProps } from 'react-router';
import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import ViewerViewStore from 'views/Viewer/store/ViewerViewStore';
import DeviceComponent from 'views/Editor/components/DeviceComponent';
import { IBackgroundColor } from 'interfaces/IProject';
import IControl from 'interfaces/IControl';

interface ContentProps {
  ios: boolean;
  background: IBackgroundColor;
  items: IControl[],
}

const ContentComponent: React.FC<ContentProps> = () => {
  return (
    <div></div>
  )
};

const Content = observer(ContentComponent);

interface ContextComponentProps {
  store: ViewerViewStore
}

const ContextComponent: React.FC<ContextComponentProps> = ({store}) => {
  return (
    <div>
      <DeviceComponent
        ios={store.ios}
        mode={store.mode}
        background={store.background}
        statusBarColor={store.statusBarColor}
        portrait={store.portrait}>
        <Content
          ios={store.ios}
          background={store.background}
          items={store.currentScreen.children}
        />
      </DeviceComponent>
    </div>
  )
};

const Context = observer(ContextComponent);

function Viewer(props: RouteComponentProps) {
  const match = matchPath<{ id: string }>(props.history.location.pathname, {
    path: '/viewer/:id',
    exact: true,
    strict: false
  });
  const id = match ? Number(match.params.id) : null;
  const [store] = React.useState(new ViewerViewStore(props.location.search));
  useEffect(() => {
    id && store.fetchProjectData(id);

    return () => {
      store.dispose();
    }
  }, [store, id]);
  return <Context store={store} />;
}

export default Viewer;
