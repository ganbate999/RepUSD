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
        }
    },
    mobileImageContainer: {
        [theme.breakpoints.down('sm')]: {
            position: 'absolute', left: 0, top: -40,
        },
        position: 'absolute', right: 0, top: -40
    },
    menuLink: {
        textDecoration: 'none'
    }
}));

const VaultDesc = props => {
    const { setIsSwapDialog, account, className, ...rest } = props;
    const classes = useStyles();
    const theme = useTheme();
    const isMd = useMediaQuery(theme.breakpoints.up('md'), {
        defaultMatches: true,
    });
    const getTokenHandler = () => {
        if (account) {
            setIsSwapDialog(true)
        }
    }
    return (
        <div id='K9nite' className={clsx(classes.root, className)} {...rest}>
            <Grid
                container
                justifyContent="space-between"
                spacing={4}
                direction={isMd ? 'row' : 'column-reverse'}
            >
                <Grid
                    item
                    container
                    alignItems="center"
                    xs={12}
                    md={7}
                    data-aos={'fade-up'}>
                    <SectionHeader
                        title={
                            <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                                <span style={{ color: theme.palette.text.title }}>
                                Earnings on borrowed tokens
                                    <br />
                                </span>
                                <span style={{ color: theme.palette.text.primary, fontSize: 18, fontWeight: '300', textAlign: 'justify', lineHeight: 1.8 }}>
                                When you borrow based on your reputation, you receive RepUSD tokens. RepUSD is a stablecoin. 1RepUSD = $1. Your borrowed RepUSD tokens are deposited in an interest bearing vault on your behalf. 
                                    <br />
                                    <br />
                                </span>
                                <span style={{ color: theme.palette.text.primary, fontSize: 18, fontWeight: '300', textAlign: 'justify', lineHeight: 1.8 }}>
                                You earn interest of 36% APY on deposited RepUSD tokens. Your earned interest is added to your account daily. You can claim your earned RepUSD tokens daily to your wallet. As you invest in other dapps and smart contracts, always come back to RepUSD to revaluate your reputation and borrow more RepUSD tokens.
                                    <br />
                                    <br />
                                </span>
                            </div>
                        }
                        ctaGroup={[
                            <Link className={classes.menuLink} to="/vault">
                                <ContainedButton justify='flex-end' onClick={getTokenHandler} variant="outlined" color="primary" size="large">
                                    My Earnings
                                </ContainedButton>
                            </Link>
                          ]}
                        align={isMd ? "left" : 'center'}
                        ctaAlign={isMd ? "center" : 'center'}
                        disableGutter
                        titleVariant="h4"
                    />
                </Grid>
                <Grid
                    item
                    container
                    justifyContent="flex-start"
                    alignItems="center"
                    xs={12}
                    md={5}
                    data-aos={'fade-up'}>
                    <Image
                        src="assets/images/independence.png"
                        alt="Web3 Legal Engineering"
                        className={classes.image}
                        data-aos="fade-left"
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
            </Grid>
        </div>
    );
};

VaultDesc.propTypes = {
    /**
     * External classes
     */
    className: PropTypes.string,
};

export default VaultDesc;
