/*eslint-disable*/
import React from 'react';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
// react components for routing our app without refresh
import { Link, RouteComponentProps } from 'react-router-dom';
import { History } from 'history';
import classNames from 'classnames';

// @material-ui/core components
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

// @material-ui/icons
import { AccountCircle, SupervisedUserCircleOutlined } from '@material-ui/icons';

// core components
import CustomDropdown from 'components/CustomDropdown/CustomDropdown';
import Button from 'components/CustomButtons/RegularButton';

import useStyles from 'assets/jss/material-kit-react/components/headerLinksStyle';
import { ROUTE_LOGIN, ROUTE_USER_PROFILE } from 'models/Constants';
import { Dictionary, DictionaryService } from 'services/Dictionary/Dictionary';
import { App } from 'models/App';
import { mainNavRoutes } from 'routes';
import { IRoute } from 'interfaces/IRoute';

import { Auth } from '../../models/Auth/Auth';
import { observer } from 'mobx-react-lite';

function nav(history: History, classes: any) {

  return mainNavRoutes.map((route: IRoute, i: number) => {
    if (!route.path) return null;
    const listItem = classNames({
      [classes.listItem]: true,
      [classes.navLinkActive]: route.path === history.location.pathname
    });
    const path = route.auth ? `${route.layout}${route.path}` : route.path;
    return (
      <ListItem className={listItem} key={i.toString()}>
        <Button
          color="transparent"
          className={classes.navLink}
          onClick={() => history.push(path)}
        >
          {route.icon && React.createElement(route.icon, { className: classes.icons })}
          <Link
            style={{ color: 'inherit' }}
            to={route.auth ? `${route.layout}${route.path}` : route.path}
          >
            {Dictionary.value(route.name).toUpperCase()}
          </Link>
        </Button>
      </ListItem>
    );
  });
}

const HeaderLinks: React.FC<RouteComponentProps> = ({ history }) => {
  const classes = useStyles();

  return (
    <List className={classes.list}>
      {nav(history, classes)}
      {
        App.loggedIn ? (
          <ListItem className={classes.listItem}>
            <CustomDropdown
              noLiPadding
              buttonText={App.user ? App.user.fullName : Dictionary.defValue(DictionaryService.keys.unknown)}
              buttonProps={{
                className: classes.navLink,
                color: 'transparent'
              }}
              buttonIcon={AccountCircle}
              dropdownList={[
                <Link to={ROUTE_USER_PROFILE} className={classes.dropdownLink}>
                  {Dictionary.defValue(DictionaryService.keys.profile)}
                </Link>,
                <Button
                  size="sm"
                  variant="text"
                  link
                  onClick={() => {
                    Auth.logout();
                  }}
                  className={classNames(classes.dropdownLink, classes.buttonInDropdown)}
                >
                  {Dictionary.defValue(DictionaryService.keys.logout)}
                </Button>
              ]}
            />
          </ListItem>
        ) : (
          <ListItem className={classes.listItem}>
            <Button
              color="transparent"
              className={classes.navLink}
              onClick={() => history.push(ROUTE_LOGIN)}
            >
              <SupervisedUserCircleOutlined className={classes.icons }/>
              {Dictionary.defValue(DictionaryService.keys.login)}
            </Button>
          </ListItem>
        )
      }
    </List>
  );
};

export default observer(HeaderLinks);
