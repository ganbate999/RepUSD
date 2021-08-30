
import React from 'react';
import { withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import CircleButton from 'components/UI/Buttons/CircleButton';

import Logo from 'components/Logo';
import { PAGES } from 'utils/links/pages';

const useStyles = makeStyles(theme => ({
  root: {
    [theme.breakpoints.down('sm')]: {
      paddingLeft: theme.spacing(1)
    },
    display: 'flex',
    alignItems: 'center',
    '&:hover': {
      cursor: 'pointer'
    },
    paddingLeft: theme.spacing(2)
  },
  height: {
    height: '100%'
  },
  logo: {
    display: 'flex',
    background: 'none',
    '&:hover': {
      backgroundColor: 'transparent'
    }
  }
}));

const LogoWithTitle = ({ history, titleVariant, className }) => {
  const classes = useStyles();

  const onClickHandler = () => {
    history.push(PAGES.HOME.url);
  }

  return (
    <div className={clsx(classes.root, className)}>
      <CircleButton className={classes.logo} onClick={onClickHandler} icon={<Logo height = {45} width = {155}/>} />
    </div>
  );
};

export default withRouter(LogoWithTitle);
