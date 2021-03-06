import React from 'react';
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useMediaQuery, Grid } from '@material-ui/core';

import ContainedButton from 'components/UI/Buttons/ContainedButton';
import Image from 'components/UI/Image';
import SectionHeader from 'components/UI/SectionHeader';

const useStyles = makeStyles(theme => ({
  root: {},
  image: {
    [theme.breakpoints.down('sm')]: {
      maxWidth: 500,
      marginBottom: 60
    },
  },
  mobileImageContainer: {
    [theme.breakpoints.down('sm')]: {
      position: 'absolute', left: 0, top: -70,
    },
    position: 'absolute', right: 0, top: -70,
  },
  menuLink: {
    textDecoration: 'none'
  }
}));

const LendDesc = props => {
  const { className, ...rest } = props;
  const classes = useStyles();
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });

  return (
    <div className={clsx(classes.root, className)} {...rest}>
      <Grid
        container
        justifyContent="space-between"
        spacing={4}
        direction={isMd ? 'row' : 'column-reverse'}
      >
        <Grid
          item
          container
          justifyContent="flex-start"
          alignItems="center"
          xs={12}
          md={5}
          data-aos={'fade-up'}
        >
          <Image
            src="assets/images/hand.png"
            alt="Web3 Legal Engineering"
            className={classes.image}
            data-aos="fade-right"
            data-aos-easing="ease-out-cubic"
            data-aos-duration="2000"
          />
          <div className={classes.mobileImageContainer}>
            <Image
              src="assets/images/cloud.svg"
              alt="Web3 Legal Engineering"
              className={classes.image}
              data-aos="fade-left"
              data-aos-easing="ease-out-cubic"
              data-aos-duration="2000"
            />
          </div>
        </Grid>
        <Grid
          item
          container
          alignItems="center"
          xs={12}
          md={7}
          data-aos={'fade-up'}
        >
          <SectionHeader
            title={
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ color: theme.palette.text.title }}>
                  ABOUT RepUSD
                  <br />
                </span>
                <span style={{ color: theme.palette.text.primary, fontSize: 18, fontWeight: '300', textAlign: 'justify', lineHeight: 1.8 }}>
                RepUSD is a reputation based lending protocol. Any person who has invested in DeFi protocols and smart contracts can get loans from RepUSD without the need to deposit collateral. Your reputation is your collateral. 
                  <br />
                  <br />
                </span>
                <span style={{ color: theme.palette.text.primary, fontSize: 18, fontWeight: '300', textAlign: 'justify', lineHeight: 1.8 }}>
                You calculate the value of your reputation by using the search engine on the reputation page. Select the smart contracts your have invested in and search. The value of your investments is your reputation. You can borrow up to 75% of the value of your reputation. If your investment is a pool containing RepUSD, you can borrow up to 90% of your reputation.
                  <br />
                  <br />
                </span>
                <span style={{ color: theme.palette.text.primary, fontSize: 18, fontWeight: '300', textAlign: 'justify', lineHeight: 1.8 }}>
                RepUSD also recognizes certain DeFi tokens such as WBTC, AVAX, Chainlink, DAI and Terra as your reputation. The balance of these tokens in your connected wallet also contributes to the value of your reputation. You can borrow immediately after your reputation is calculated. No deposit of collateral. Your collateral is your reputation. Ready to try?
                </span>
              </div>
            }
            ctaGroup={[
              <Link className={classes.menuLink} to="/lend">
                <ContainedButton onClick={()=>{}} variant="outlined" color="primary" size="large">
                Calculate Your Reputation and Borrow
                </ContainedButton>
              </Link>
            ]}
            align={isMd ? "left" : 'center'}
            disableGutter
            titleVariant="h3"
          />
        </Grid>
      </Grid>
    </div>
  );
};

LendDesc.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
};

export default LendDesc;
