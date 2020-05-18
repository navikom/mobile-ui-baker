import React, { useEffect } from 'react';
import { when } from 'mobx';
import { observer } from 'mobx-react-lite';
import { NavLink } from 'react-router-dom';
import { App } from 'models/App';
import { makeStyles } from '@material-ui/core';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import { Edit } from '@material-ui/icons';

import { Dictionary, DictionaryService } from 'services/Dictionary/Dictionary';
import { SharedProjects } from 'models/Project/SharedProjectsStore';
import { OwnProjects } from 'models/Project/OwnProjectsStore';
import { ROUTE_EDITOR, TABS_HEIGHT } from 'models/Constants';
import EmptyProjectImg from 'assets/img/projects/empty-project.png';
import { blackOpacity, whiteOpacity } from 'assets/jss/material-dashboard-react';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    padding: 30,
    marginTop: TABS_HEIGHT
  },
  gridList: {
    height: 450,
    transform: 'translateZ(0)',
  },
  titleBar: {
    background:
      'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
  },
  title: {
    color: theme.palette.background.paper,
  },
  icon: {
    color: whiteOpacity(.4),
  },
  link: {
    padding: 5,
    display: 'flex',
    '&:hover': {
      backgroundColor: blackOpacity(.1),
      borderRadius: '50%'
    }
  },
  listTile: {
    transition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    border: '4px solid #aeb2b7',
    boxShadow: '9px 7px 22px -6px rgba(0,0,0,0.43)',
    borderRadius: '6px',
  },
  img: {
    transform: 'translateX(-50%) scale(1)',
    transition: 'all .3s cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    '&:hover': {
      transform: 'translateX(-50%) scale(1.05)',

    }
  }
}));

const ContextComponent: React.FC = () => {
  const classes = useStyles();
  const paths: string[] = []
  const tileData = [
    {
      title: Dictionary.defValue(DictionaryService.keys.emptyProject),
      img: EmptyProjectImg,
      author: Dictionary.defValue(DictionaryService.keys.mobileUiEditor),
      route: ROUTE_EDITOR
    },
    ...OwnProjects.previewList,
    ...SharedProjects.previewList
  ].filter(e => {
    if(paths.includes(e.route)) {
      return false;
    }
    paths.push(e.route);
    return true;
  });
  return (
    <div className={classes.root}>
      <GridList cellHeight={440} className={classes.gridList} cols={Math.min(6, tileData.length)}>
        {tileData.map((tile, i) => (
          <GridListTile
            key={i.toString()}
            classes={{
              tile: classes.listTile
            }}
            style={{
              width: 255,
              padding: 5
            }}
          >
            <img src={tile.img} alt={tile.title} className={classes.img} />
            <GridListTileBar
              title={tile.title}
              subtitle={<span
                className={classes.title}>by: {tile.author}</span>}
              classes={{
                root: classes.titleBar,
                title: classes.title,
              }}
              actionIcon={
                <NavLink to={tile.route} className={classes.link}>
                  <Edit className={classes.title} />
                </NavLink>
              }
            />
          </GridListTile>
        ))}
      </GridList>
    </div>
  )
};

const Context = observer(ContextComponent);

function ProjectsView() {
  useEffect(() => {
    SharedProjects.fetchItems().catch(err => console.log('Shared projects error %s', err.message));
    when(() => App.loggedIn, async () => {
      try {
        await OwnProjects.fetchItems();
      } catch (err) {
        console.log('Own projects error %s', err.message);
      }
    });

  }, []);
  return <Context />
}

export default ProjectsView;
