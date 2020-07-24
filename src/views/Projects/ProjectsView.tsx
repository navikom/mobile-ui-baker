import React, { useEffect } from 'react';
import { when } from 'mobx';
import { observer } from 'mobx-react-lite';
import classNames from 'classnames';

import { Edit } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';

import { App } from 'models/App';
import { Dictionary, DictionaryService } from 'services/Dictionary/Dictionary';
import { SharedProjects } from 'models/Project/SharedProjectsStore';
import { OwnProjects } from 'models/Project/OwnProjectsStore';
import { MODE_DEVELOPMENT, ROUTE_EDITOR } from 'models/Constants';
import EmptyProjectImg from 'assets/img/projects/empty-project.png';
import nexus_6_outer from 'assets/img/device/nexus_6_outer.png';
import Chip from '@material-ui/core/Chip';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    '& > *': {
      width: 320,
      height: 250,
    },
  },
  title: {
    color: theme.palette.background.paper,
    marginBottom: 50
  },
  root: {
    display: 'flex',
    margin: 10,
    justifyContent: 'space-around'
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    width: '60%'
  },
  content: {
    flex: '1 0 auto',
  },
  device: {
    position: 'relative',
    width: '40%',
    height: '95%',
    transform: 'translate(0, 2%)'
  },
  cover: {
    width: '100%',
    height: '100%',
    position: 'absolute'
  },
  image: {
    top: 26,
    left: 9,
    position: 'absolute',
    width: '85%',
    height: '79%'
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  description: {
    margin: '10px 0 0',
    overflow: 'hidden',
    display: '-webkit-box',
    textOverflow: 'ellipsis',
    maxHeight: '3em',
    boxOrient: 'vertical',
    lineClamp: 2
  },
  'img': {
    animation: '$Img 27s ease-in-out infinite',
  },
  img1: {
    animationDelay: '-3s'
  },
  img2: {
    animationDelay: '-6s'
  },
  img3: {
    animationDelay: '-9s'
  },
  img4: {
    animationDelay: '-12s'
  },
  img5: {
    animationDelay: '-15s'
  },
  img6: {
    animationDelay: '-18s'
  },
  img7: {
    animationDelay: '-21s'
  },
  img8: {
    animationDelay: '-24s'
  },
  img9: {
    animationDelay: '-27s'
  },
  '@keyframes Img': {
    '0%': {
      opacity: 0,
    },
    '8%, 11%': {
      opacity: 1,
    },
    '19%, 100%': {
      opacity: 0,
    }
  }
}));

interface ProjectCardProps {
  id: number;
  title: string;
  img: string[];
  route: string;
  author: string;
  description: string;
  index: number;
  price: number;
}

const ProjectCard: React.FC<ProjectCardProps> = (
  { id, title, img, route, author, price, description, index }) => {
  const classes = useStyles();
  const descriptionClasses = classNames({
    [classes.description]: true
  });
  return (
    <Card className={classes.root}>
      <div className={classes.details}>
        <CardContent className={classes.content}>
          <Typography component="h5" variant="h5">
            {title}
          </Typography>
          <Typography variant="body2" className={descriptionClasses}>
            {description}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            {Dictionary.defValue(DictionaryService.keys.author)}: {author}
          </Typography>

          <Chip
            label={price > 0 ? '$' + (price / 100).toFixed(2) : Dictionary.defValue(DictionaryService.keys.free)}
            />


        </CardContent>
        <div className={classes.controls}>
          <Button
            onClick={() => App.navigationHistory && App.navigationHistory.push(route)}
            endIcon={<Edit />}
            color="primary"
            variant="outlined"
          >
            {Dictionary.defValue(index ? DictionaryService.keys.openInViewer : DictionaryService.keys.openInEditor)}
          </Button>
        </div>
      </div>
      <div className={classes.device}>
        {
          img.map((src, i) => {
            return <img
              key={i.toString()}
              src={src}
              className={i === 0 ? classes.image : classNames(classes.image, classes.img, classes[`img${i}` as 'img1'])}
              alt={title} />
          })
        }
        <img
          className={classes.cover}
          src={nexus_6_outer}
          title={title}
          alt={title}
        />
      </div>
    </Card>
  )
}

const ContextComponent: React.FC = () => {
  const classes = useStyles();
  const paths: string[] = []
  const tileData = [
    {
      id: 0,
      title: Dictionary.defValue(DictionaryService.keys.newApp),
      img: [EmptyProjectImg],
      price: 0,
      description: Dictionary.defValue(DictionaryService.keys.startFromWhitePage),
      author: Dictionary.defValue(DictionaryService.keys.muiditorTeam),
      route: ROUTE_EDITOR
    },
    ...OwnProjects.previewList,
    ...SharedProjects.previewList
  ].filter(e => {
    if (paths.includes(e.route)) {
      return false;
    }
    paths.push(e.route);
    return true;
  });

  return (
    <Container component="main">
      <Typography variant="h2" align="center" className={classes.title}>
        {Dictionary.defValue(DictionaryService.keys.mobileDesignAvailableSamples)}
      </Typography>
      <div className={classes.container}>
        {tileData.map((tile, i) => (
          <ProjectCard
            key={i.toString()}
            description={tile.description || ''}
            author={tile.author as string}
            price={tile.price}
            id={tile.id}
            index={i}
            title={tile.title}
            img={tile.img as string[]}
            route={tile.route} />
        ))}
      </div>
    </Container>
  )
};

const Context = observer(ContextComponent);

function ProjectsView() {
  useEffect(() => {
    SharedProjects.fetchItems()
      .catch(err => process.env.NODE_ENV === MODE_DEVELOPMENT && console.log('Shared projects error %s', err.message));
    when(() => App.loggedIn, async () => {
      try {
        await OwnProjects.fetchItems();
      } catch (err) {
        process.env.NODE_ENV === MODE_DEVELOPMENT && console.log('Own projects error %s', err.message);
      }
    });

  }, []);
  return <Context />
}

export default ProjectsView;
