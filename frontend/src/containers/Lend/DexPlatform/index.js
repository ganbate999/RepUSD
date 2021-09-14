import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Typography } from '@material-ui/core';

import Image from 'components/UI/Image';
import { EXCHANGE_PLATFORMS } from 'constants/links/exchange-platforms';
import CustomCheckbox from 'components/UI/CustomCheckbox';
import { AppContext } from 'contexts';
import ContainedButton from 'components/UI/Buttons/ContainedButton';

const useStyles = makeStyles(theme => ({
  root: {
    boxShadow: '0px 0px 5px 0 rgba(243,243,243,.8)',
    background: 'rgb(255,255,255)',
    borderRadius: '10px',
    width: '100%',
    padding: theme.spacing(4,3)
  },
  exchangeLabel: {
    color: theme.palette.warning.dark,
    fontSize: '2em',
    fontFamily: 'LULO',
    marginLeft: theme.spacing(2)
  },
  searchInput: {
    marginTop: theme.spacing(1),
    maxWidth: 300
  },
  platforms: {
    display: 'block',
    height: `calc(100vh - ${theme.custom.layout.topAppBarHeight + theme.custom.layout.footerHeight + theme.spacing(12)}px)`,
    overflow: 'scroll',
    marginTop: theme.spacing(1),
    paddingTop: theme.spacing(1)
  },
  label: {
    fontSize: '22px',
    fontFamily: 'fontMedium',
    color: 'rgb(60,60,60)'
  },
  image: {
    width: 30,
    height: 30,
    marginTop: theme.spacing(0.5),
    [theme.breakpoints.down('sm')]: {
      width: 30,
      height: 20
    },
  },
  desc: {
    color: '#555',
    fontSize: 14,
    fontFamily: 'fontMedium',
    marginTop: theme.spacing(1)
  }
}));

const DexPlatform = props => {
  const { className, ...rest } = props;
  const classes = useStyles();
  const theme = useTheme();
  const { markets, setMarkets, setSearchInvest, loadingSerach } = useContext(AppContext);

  const handleChange = (event) => {
    var tmpArray = JSON.parse(JSON.stringify(markets));
    if(event.target.checked){
      tmpArray.push(event.target.name.toLowerCase());
      setMarkets(tmpArray);
    } else {
      const index = tmpArray.indexOf(event.target.name.toLowerCase());
      if(index > -1)
        tmpArray.splice(index,1);
      
      setMarkets(tmpArray);
    }
  };

  const searchInvest = () => {
    setSearchInvest(true);
  }
  
  return (
    <div className={clsx(classes.root, className)} {...rest}>
      <Grid container item justifyContent="center" xs={12} >
          <Typography className={classes.exchangeLabel}>MARKETS</Typography>
      </Grid>
      <Grid container item justifyContent="center" xs={12}>
        <Typography className={classes.desc}>Select the markets you have invested in below and click search to get the value of your reputation.</Typography>
      </Grid>
      <Grid item xs={12}>
        <div className={classes.platforms}>
          {EXCHANGE_PLATFORMS.map((index) => {
              return ( 
                <FormControlLabel
                  classes={{label: classes.label}}
                  key={index}
                  style={{marginBottom: theme.spacing(1), display: 'flex'}}
                  control={<CustomCheckbox name={index} onChange={handleChange} />}
                  label={index}
                />
              )
          })}
        </div>
      </Grid> 
      <Grid item container justifyContent="center" xs={12}>
        <ContainedButton onClick={searchInvest} loading={loadingSerach} style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '2.5rem',
                marginTop: '1rem',
                borderColor: 'red',
                cursor: 'pointer',
                color: 'textSecondary'
              }}>
          Search
        </ContainedButton>
      </Grid> 
    </div>
  );
};

DexPlatform.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
};

export default DexPlatform;
