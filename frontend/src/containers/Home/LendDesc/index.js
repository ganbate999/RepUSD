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
                <span style={{ color: theme.palette.text.primary }}>
                  LENDING
                  <br />
                </span>
                <span style={{ color: theme.palette.text.primary, fontSize: 18, fontWeight: '300', textAlign: 'justify', lineHeight: 1.8 }}>
                RepUSD is a reputation based lending dapp. A user who has being investing in dapps can get loans from RepUSD without the need to deposit collateral. 
                  <br />
                  <br />
                </span>
                <span style={{ color: theme.palette.text.primary, fontSize: 18, fontWeight: '300', textAlign: 'justify', lineHeight: 1.8 }}>
                The user can borrow up to 75% of his reputation. But if any of his investment contains a RepUSD pool, the user can borrow up to 90% of that reputation.
                  <br />
                  <br />
                </span>
                <span style={{ color: theme.palette.text.primary, fontSize: 18, fontWeight: '300', textAlign: 'justify', lineHeight: 1.8 }}>
                When a user borrows on RepUSD, RepUSD tokens are minted. The minted RepUSD are sent to an Interest yielding vault.
                </span>
              </div>
            }
            ctaGroup={[
              <Link className={classes.menuLink} to="/lend">
                <ContainedButton onClick={()=>{}} variant="outlined" color="primary" size="large">
                  View My Reputation
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
