import React, {useContext, useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import { Typography } from '@material-ui/core';
import axios from 'axios';
import { useSnackbar } from 'notistack';

import ContainedButton from 'components/UI/Buttons/ContainedButton';
import { AppContext } from 'contexts';
import { serverAddress } from 'constants/serverAddress';
import { makeTokenHeader } from 'utils/headerConfig';
import Image from 'components/UI/Image';
import RewardModal from 'components/RewardModal';

const useStyles = makeStyles(theme => ({
  root: {},
  reputation: {
    fontSize: 24,
    fontWeight: 900,
    marginRight: theme.spacing(1),
    marginTop: theme.spacing(2)
  },
  infoboard: {
    padding: theme.spacing(1,3),
    width: '100%',
    border: '1px solid',
    borderColor: 'rgb(255,255,255,0.4)',
    borderRadius: '6px',
    marginBottom: theme.spacing(4),
    boxShadow: '0px 0px 5px 0 rgba(243,243,243,.8)',
    backgroundColor: 'rgb(255,255,255)'
  },
  divider: {
    border: '1px solid',
    borderColor: 'rgb(60,60,60,0.8)',
    width: '100%',
    margin: theme.spacing(1,0)
  },
  searchPan: {
    padding: theme.spacing(1,2),
    display: 'block',
    width: '100%',
    height: `calc(100vh - ${theme.custom.layout.topAppBarHeight + theme.custom.layout.footerHeight}px)`,
    overflow: 'scroll'
  },
  market: {
    fontSize: 20,
    fontWeight: 600,
    color: theme.palette.warning.dark,
    marginBottom: theme.spacing(2)
  },
  property: {
    fontFamily: 'fontMedium',
    fontSize: 16,
    fontWeight: 600,
    color: 'rgb(100,100,100)'
  },
  valinfo: {
    fontFamily: 'fontMedium',
    fontSize: 18,
    fontWeight: 600,
    color: 'rgb(60,60,60)'
  },
  image: {
    [theme.breakpoints.down('sm')]: {
      maxWidth: 200,
      marginBottom: 60
    },
    maxWidth: 400
  },
}));

const RepCalc = props => {
  const classes = useStyles();
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();

  const { markets, account, chainId, library, token, setLoadingSearch, isSearchInvest, setSearchInvest } = useContext(AppContext);
  const [ investInfo, setInvestInfo ] = useState([]);
  const [state, setState] = useState({reputation: 0, borrowAmount: 0 });
  const [loadingLendStatus, setLoadingLendStatus] = useState(false);
  const [firstLoadStatus, setFirstLoadStatus] = useState(true);
  const [isRewardDialog, setIsRewardDialog] = useState(false);

  useEffect(() => {
    async function getInvest(param) {
      const url = serverAddress + 'search';
      const response = await axios.post(url,{address: account.toLowerCase(), invested_platforms:param}, makeTokenHeader(token));
      if(response.data.success){
        setFirstLoadStatus(false);
        setInvestInfo(response.data.result.reputation);
        setState({reputation: parseFloat(response.data.result.totalReputation).toFixed(2), borrowAmount: parseFloat(response.data.result.borrowAmount).toFixed(2)});
        setLoadingSearch(false);
      } 
    }
    
    if(!!token && isSearchInvest) {
      setLoadingSearch(true);
      getInvest(markets);
    } else if( isSearchInvest ){
      setLoadingSearch(false);
      enqueueSnackbar(`Please wait until login success for a moment.`, { variant: 'error' });
    }  
    setSearchInvest(false)
  },[isSearchInvest]);

  useEffect(() => {
    async function getReputation() {
      const url = serverAddress + 'getreputation';
      const response = await axios.post(url,{address: account.toLowerCase()}, makeTokenHeader(token));
      if(response.data.success){
        setState({reputation: parseFloat(response.data.result).toFixed(2), borrowAmount: state.borrowAmount})
        setLoadingSearch(false);
      } 
    }
    
    if(!!token) {
      getReputation();
    }
  },[account, token])

  const handleLend = () => {
    async function lend(param) {
      const url = serverAddress + 'invest';
      const response = await axios.post(url,{address: account.toLowerCase(), invested_platforms:param}, makeTokenHeader(token));
      if(response.data.success){
        enqueueSnackbar(`Lending success.`, { variant: 'success' });
        setLoadingLendStatus(false);
        setIsRewardDialog(true);
      } else {
        enqueueSnackbar(`You borrowed RepUSD already.`, { variant: 'error' });
        setLoadingLendStatus(false);
      }
    }
    setLoadingLendStatus(true);
    if(!!token) {
      lend(markets);
    } else {
      setLoadingLendStatus(false);
      enqueueSnackbar(`Please wait until login success for a moment.`, { variant: 'error' });
    }  
  }

  const closeHandler = () => {
    setIsRewardDialog(false);
    window.location.href="/vault";
  }
  return (
    <Grid container spacing={4} justifyContent="space-between">
      <Grid container item xs={12} md={5}>
        <Typography style={{color: theme.palette.warning.dark}} className={classes.reputation}>My Reputation</Typography>
        <Typography className={classes.reputation}>$ </Typography>
        <Typography className={classes.reputation}>{state.reputation}</Typography>
      </Grid>
      <Grid container item xs={12} md={4}>
        <Typography style={{color: theme.palette.warning.dark}} className={classes.reputation}>Borrowable</Typography>
        <Typography className={classes.reputation}>$ </Typography>
        <Typography className={classes.reputation}>{state.borrowAmount}</Typography>
      </Grid>
      <Grid item container xs={12} md={3} justifyContent="flex-end">
        <ContainedButton loading={loadingLendStatus} onClick={handleLend} variant="outlined" color="primary" size="large">
        Borrow RepUSD
        </ContainedButton>
      </Grid>
      <div className={classes.searchPan}>
        {firstLoadStatus?
          <Grid container item xs={12} style={{height: '100%'}} justifyContent="center" alignContent="center">
            <Image
              src="assets/images/RepUSD white1.png"
              alt="Web3 Legal Engineering"
              className={classes.image}
              data-aos="fade-up"
              data-aos-easing="ease-out-cubic"
              data-aos-duration="2000" 
            />
          </Grid>
          :
          <></>
        }
        <Grid container item xs={12}>
          {investInfo.map((eachInfo, index) => {
            return(
              <div className={classes.infoboard} key={index}>
                <Grid item xs={12} key={index+'grid'}>
                  <Typography className={classes.market} key={index+'market'}>{eachInfo.dapp}</Typography>
                </Grid>
                {eachInfo.reputation.map((rep,index_rep) => {
                  let len = eachInfo.reputation.length - 1;
                  let bDisplay = ( len !== index_rep);
                  return(
                    <Grid container key={index+'row'+index_rep}>
                      <Grid item xs={12} md={3} key={index+'row'+index_rep+'col1'}>
                        <Typography className={classes.property} key={index+'row'+index_rep+'pool'}>Pool</Typography>
                        <Typography className={classes.valinfo} key={index+'row'+index_rep+'poolval'}>{rep.poolName}</Typography>
                      </Grid>
                      <Grid item xs={12} md={3} key={index+'row'+index_rep+'col2'}>
                        <Typography className={classes.property} key={index+'row'+index_rep+'token'}>Token</Typography>
                        <Typography className={classes.valinfo} key={index+'row'+index_rep+'symbol'}>{rep.symbol}</Typography>
                      </Grid>
                      <Grid item xs={12} md={3} key={index+'row'+index_rep+'col3'}>
                        <Typography className={classes.property} key={index+'row'+index_rep+'amount'}>Amount</Typography>
                        <Typography className={classes.valinfo} key={index+'row'+index_rep+'amountval'}>{parseFloat(rep.amount).toFixed(7)}</Typography>
                      </Grid>
                      <Grid item xs={12} md={3} key={index+'row'+index_rep+'col4'}>
                        <Typography className={classes.property} key={index+'row'+index_rep+'usd'}>Value USD</Typography>
                        <Typography className={classes.valinfo} key={index+'row'+index_rep+'usdval'}>{parseFloat(rep.repUSD).toFixed(2)}</Typography>
                      </Grid>
                      {bDisplay?
                        <div className={classes.divider} key={index+'row'+index_rep+'divid'}></div>
                        :
                        <></>
                      } 
                    </Grid>
                  )
                })}
              </div>
            )
          })}
        </Grid>
      </div>
      {isRewardDialog &&
        <RewardModal
          onClose={closeHandler}
          account={account}
          chainId={chainId}
          library={library}
        />
      }
    </Grid>
  );
};

RepCalc.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
};

export default RepCalc;
