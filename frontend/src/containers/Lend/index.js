
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import AOS from 'aos';
import 'aos/dist/aos.css';
import 'react-lazy-load-image-component/src/effects/blur.css';
import 'react-lazy-load-image-component/src/effects/opacity.css';

import Section from 'hoc/Section';
import DexPlatform from './DexPlatform';
import RepCalc from './RepCalc';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000'
  },
  section: {
    padding: theme.spacing(3, 1),
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(4, 5),
    },
  }
}));

const Lend = () => {
  const classes = useStyles();

  AOS.init({
    once: true,
    delay: 50,
    duration: 500,
    easing: 'ease-in-out',
  });

  return (
    <div className={classes.root}>
      <Section className={classes.section}>
        <div className={classes.root}>
          <Grid
            container
            justifyContent="space-between"
            spacing={4}
          >
            <Grid
              container
              item
              xs={12}
              md={3}
            >
              <DexPlatform />
            </Grid>
            <Grid
              item
              xs={12}
              md={9}
            >
              <RepCalc />
            </Grid>
          </Grid>
        </div>
      </Section>
    </div >
  );
};

export default Lend;
