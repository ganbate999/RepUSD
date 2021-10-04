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
    borderRadius: theme.spacing(2),
    background: '#FFFFFF 0% 0% no-repeat padding-box',//'rgb(27,21,36)',
    boxShadow: '0px 4px 1px #0F123F08',
    border: "1px solid #E0E0E4EB",
    opacity: "1",
    width: '100%',
    padding: theme.spacing(4,3)
  },
  exchangeLabel: {
    color: theme.palette.warning.dark,
    fontSize: '2em',
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
    color: 'rgb(60,60,60)'
  },
  image: {
    width: 200,
    height: 100,
    marginTop: theme.spacing(0.5),
    [theme.breakpoints.down('sm')]: {
      width: 200,
      height: 100
    },
  },
  desc: {
    color: '#555',
    fontSize: 14,
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
      <Grid container direction="column" justifyContent="center" alignItems="center">
        <Grid item xs={12}>
          <Image
            src="assets/images/reputation.png"
            className={classes.image}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography className={classes.desc}>Select the markets you have invested in below and click search to get the value of your reputation.</Typography>
        </Grid>
        <Grid item xs={12}>
          <div className={classes.platforms}>
            {EXCHANGE_PLATFORMS.map((index) => {
                return ( 
                  <FormControlLabel
                    classes={{label: classes.label}}
                    key={index}
                    style={{marginBottom: theme.spacing(1), padding: theme.spacing(1.5), display: 'flex'}}
                    control={<CustomCheckbox name={index} onChange={handleChange} />}
                    label={index}
                  />
                )
            })}
          </div>
        </Grid> 
        <Grid item xs={12}>
          <ContainedButton onClick={searchInvest} loading={loadingSerach} style={{
                  height: '2.5rem',
                  marginTop: '1rem',
                  borderRadius: '5px',
                  borderColor: 'red',
                  cursor: 'pointer',
                  background: 'rgb(89,87,213)',
                  color: '#fff'
                }}>
            Search
          </ContainedButton>
        </Grid>
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
