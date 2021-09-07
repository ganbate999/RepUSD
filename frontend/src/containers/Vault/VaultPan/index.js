import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import { Typography } from '@material-ui/core';
import { useSnackbar } from 'notistack';

import ContainedButton from 'components/UI/Buttons/ContainedButton';
import Image from 'components/UI/Image';
import { isEmpty, delay } from 'utils/utility';
import { contractInstance } from 'services/contractInstance';
import { AppContext } from 'contexts';
import RewardModal from 'components/RewardModal';

const useStyles = makeStyles(theme => ({
  root: {},
  chooseProfit: {
    background: '#0F1014',
    boxShadow: '0px 0px 5px 0 rgba(243,243,243,.8)',
    borderRadius: theme.spacing(2),
    width: '100%',
    padding: theme.spacing(6,3),
    height: `calc(100vh - ${theme.custom.layout.topAppBarHeight + theme.custom.layout.footerHeight + theme.spacing(4)}px)`,
  },
  exchangeLabel: {
    color: theme.palette.warning.dark,
    fontSize: 34,
    fontWeight: 900,
    //fontFamily: 'LULO'
  },
  desc: {
    fontSize: 16,
    marginBottom: theme.spacing(3),
    color: 'rgb(60,60,60)',
    //color: 'rgb(131,132,112)',
    fontWeight: 900,
    //fontFamily: 'fontMedium'
  },
  val: {
    fontSize: '30px',
    color: 'rgb(40,40,40)',
    fontFamily: 'fontMedium',
    fontWeight: 600,
    display: 'inline-block'
  },
  valCurrency: {
    marginLeft: theme.spacing(1),
    fontSize: '20px',
    color: 'rgb(40,40,40)',
    //fontFamily: 'fontMedium',
    fontWeight: 600,
    display: 'inline-block'
  },
  image: {
    [theme.breakpoints.down('sm')]: {
      maxWidth: 200,
      marginBottom: 60
    },
    maxWidth: 200
  },
  label: {
    fontSize: '20px',
    fontFamily: 'fontMedium'
  },
  totalreward: {
    width: '100%',
    borderRadius: theme.spacing(2),
    backgroundColor: '#fff',//'rgb(27,21,36)',
    boxShadow: '0px 0px 5px 0 rgba(243,243,243,.8)',
    height: `calc(50vh - ${(theme.custom.layout.topAppBarHeight + theme.custom.layout.footerHeight + theme.spacing(8))/2}px)`,
  },
  claimamount: {
    width: '100%',
    borderRadius: theme.spacing(2),
    backgroundColor: '#fff',//'rgb(27,21,36)',
    boxShadow: '0px 0px 5px 0 rgba(243,243,243,.8)',
    //backgroundColor: '#0F1014',
    height: `calc(50vh - ${(theme.custom.layout.topAppBarHeight + theme.custom.layout.footerHeight + theme.spacing(8))/2}px)`,
  },
  secondRow: {
    width: '100%',
    borderRadius: theme.spacing(2),
    backgroundColor: '#fff',//'rgb(27,21,36)',
    boxShadow: '0px 0px 5px 0 rgba(243,243,243,.8)',
    //backgroundColor: '#0F1014',
    height: `calc(50vh - ${(theme.custom.layout.topAppBarHeight + theme.custom.layout.footerHeight + theme.spacing(8))/2}px)`,
  },
  gridClass: {
    padding: theme.spacing(2)
  },
  menuFont: {
    //fontFamily: 'Arial',
    fontWeight: 600,
    fontSize: '16px',
    color: 'rgb(40,40,40)',
    '&:hover': {
      color: 'rgb(0,0,200)'
    },
    marginTop: theme.spacing(2),
    cursor: 'pointer'
  }
}));

const VaultPan = () => {
  const classes = useStyles();
  const theme = useTheme();
  
  const { account, chainId, library } = useContext(AppContext);
  const { enqueueSnackbar } = useSnackbar();
  const contract = contractInstance(account, chainId, library);
  
  const[loadingClaimStatus, setLoadingClaimStatus] = useState(false);
  const[totalReward, setTotalReward] = useState('');
  const[apy, setApy] = useState('18%');
  const[lendingAmount, setLendingAmount] = useState('');
  const[totalLockedAmount, setTotalLockedAmount] = useState('');
  const[totalLifeTimeEarned, setTotalLifeTimeEarned] = useState('')
  const[lastLoanedTime, setLastLoanedTime] = useState('')
  const[rewardMehtod, setRewardMethod] = useState('interest');
  const [isRewardDialog, setIsRewardDialog] = useState(false);

  const claimReward = async() => {
    if (!!account) {
      
      setLoadingClaimStatus(true)
      let w_totalReward = await contract.getUserTotalReward(account.toLowerCase())
      if (w_totalReward <= 0) {
        enqueueSnackbar(`No available reward!`);
        return;
      }
      try {
        let loop = true;
        let tx = null;
        const {hash: claimHash} = await contract.claimReward(`${w_totalReward}`)
        
        while (loop) {
            tx = await library.getTransactionReceipt(claimHash);
            console.log('kevin transaction tx', tx)
            if (isEmpty(tx)) {
                await delay(300)
            } else {
                loop = false
            }
        }
        if (tx.status === 1) {
          setLoadingClaimStatus(false)
          w_totalReward = await contract.getUserTotalReward(account.toLowerCase());
          setTotalReward(Math.round(w_totalReward*100)/100);
          enqueueSnackbar(`withdraw success:`, { variant: 'success' });
          return;
        } else {
          setLoadingClaimStatus(false)
          enqueueSnackbar(`failed:`, { variant: 'error' });
          return;
        }
      } catch (error) {
          enqueueSnackbar(`unknow error`, { variant: 'error' });
          setLoadingClaimStatus(false)
          console.log('kevin===>', error)
      }
    }
  }  

  const handleInterest = () => {
    setIsRewardDialog(true);
  }
  
  const closeHandler = () => {
    setIsRewardDialog(false);
    async function getRewardMethodInfo(userAccount) {
      try {
        const w_userInfo = await contract.userInfo(userAccount.toLowerCase())
        if(w_userInfo.rewardMethod)
        {
          setRewardMethod('sharing')
          setApy('16.5%');
        } else {
          setApy('18%');
          setRewardMethod('interest')
        }
      }
      catch(error) {
        enqueueSnackbar(`An unknown error occurred.`, { variant: 'error' });
      }
    }
    if (!!account) {
      getRewardMethodInfo(account);
    }
  }

  useEffect(() => {
    async function getInfo(userAccount){
      try{
        const w_totalReward = await contract.getUserTotalReward(userAccount.toLowerCase()) / 1e18
        const w_userInfo = await contract.userInfo(userAccount.toLowerCase())
        const w_lendingAmount = w_userInfo.reputation / 1e18
        const w_lastLoanTime = Math.round(w_userInfo.lastLoanDate * 10000 ) / 10 
        const w_totalLifeTime = await contract.getUserTotalLifetimeEarnings(userAccount.toLowerCase()) / 1e18
        const w_totalLockedAmount = await contract.totalBorrowedAmount() / 1e18

        setTotalReward(Math.round(w_totalReward*100)/100); //available earned interest
        setLendingAmount(Math.round(w_lendingAmount*100)/100); //current loaned amount
        setTotalLockedAmount(Math.round(w_totalLockedAmount*100)/100); // total value locked
        setTotalLifeTimeEarned(Math.round(w_totalLifeTime*100)/100); //total life time earned
        
        let w_loantime = new Date(w_lastLoanTime);
        w_loantime = (w_loantime.getMonth()+1) + '/' + w_loantime.getDate() + '/' + w_loantime.getFullYear();
        if(w_lastLoanTime !== 0)
        {
          setLastLoanedTime(w_loantime); //last loaned time
        }
        
        if(w_userInfo.rewardMethod)
        {
          setRewardMethod('sharing')
          setApy('16.5%');
        } else {
          setApy('18%');
          setRewardMethod('interest')
        }
      } catch(error) {
        enqueueSnackbar(`An unknown error occurred.`, { variant: 'error' });
      }
    }
    if(!!account)
      getInfo(account.toLowerCase());
    
  }, [account])

  return (
    <Grid container justifyContent="space-between" spacing={4}>
      <Grid
        item
        container
        justifyContent="flex-start"
        alignItems="center"
        xs={12}
        md={3}
        data-aos={'fade-right'}
        className={classes.gridClass}
      >
        <div className={classes.chooseProfit}>
          <Grid container item justifyContent="center" xs={12} >
            <Typography className={classes.exchangeLabel}>My Earnings</Typography>
          </Grid>
          <Grid container item justifyContent="center" alignItems="center" xs={12} style={{height:'98%'}}>
            <Image
              src="assets/images/handRep.png"
              alt="Web3 Legal Engineering"
              className={classes.image}
              data-aos="fade-right"
              data-aos-easing="ease-out-cubic"
              data-aos-duration="2000" 
            />
          </Grid>
        </div>
      </Grid>
      <Grid
        item
        container
        xs={12}
        md={9}
        data-aos={'fade-up'}
        style={{padding: 0}}
      >
        <Grid item container xs={12} md={6} data-aos={'fade-down'} className={classes.gridClass}>
          <div className={classes.totalreward}>
            <Grid container alignItems="center" style={{height: '100%'}}>
              <Grid item xs={12} md={8} style={{paddingLeft: theme.spacing(4)}}>
                <Typography className={classes.desc}>Available Earned Interest</Typography>
                <Typography className={classes.val}>{totalReward}</Typography>
                <Typography className={classes.valCurrency}>RepUSD</Typography>
              </Grid>
              <Grid container justifyContent="center" item xs={12} md={4} style={{paddingLeft: theme.spacing(4)}}>
                <ContainedButton loading={loadingClaimStatus} onClick={() => claimReward()} size="large" style={{
                  height: '2.5rem',
                  marginTop: '1rem',
                  borderRadius: '5px',
                  borderColor: 'red',
                  cursor: 'pointer',
                  color: 'textSecondary'
                }}>
                  Claim
                </ContainedButton>
              </Grid>
            </Grid>
          </div>
        </Grid>
        <Grid item xs={12} md={6} data-aos={"fade-left"} className={classes.gridClass}>
          <div className={classes.secondRow}>
            <Grid container alignItems="center" style={{height: '100%'}}>
              <Grid item xs={12} md={6}  style={{paddingLeft: theme.spacing(4)}}>
                <Typography className={classes.desc}>Total Value Locked</Typography>
                <Typography className={classes.val}>{totalLockedAmount}</Typography>
                <Typography className={classes.valCurrency}>RepUSD</Typography>
              </Grid>
              <Grid item xs={12} md={6} style={{paddingLeft: theme.spacing(4)}}>
                <Typography className={classes.desc}>Total Life Time Earned</Typography>
                <Typography className={classes.val}>{totalLifeTimeEarned}</Typography>
                <Typography className={classes.valCurrency}>RepUSD</Typography>
              </Grid>
            </Grid>
          </div>
        </Grid>
        <Grid item xs={12} md={6} data-aos={"fade-up"} className={classes.gridClass}>
          <div className={classes.secondRow}>
            <Grid container alignItems="center" style={{height: '100%'}}>
              <Grid item xs={12} style={{paddingLeft: theme.spacing(4)}}>
                <Typography className={classes.desc}>APY</Typography>
                <Typography className={classes.val}>{apy}</Typography>
                <Typography onClick={handleInterest} className={classes.menuFont}>If you like to change your reward settings, click here</Typography>
              </Grid>
            </Grid>
          </div>
        </Grid>
        <Grid item xs={12} md={6} data-aos={"fade-up"} className={classes.gridClass}>
          <div className={classes.secondRow}>
            <Grid container alignItems="center" style={{height: '100%'}}>
              <Grid item xs={12} md={6} style={{paddingLeft: theme.spacing(4)}}>
                <Typography className={classes.desc}>Current Loaned Amount</Typography>
                <Typography className={classes.val}>{lendingAmount}</Typography>
                <Typography className={classes.valCurrency}>RepUSD</Typography>
              </Grid>
              <Grid item xs={12} md={6} style={{paddingLeft: theme.spacing(4)}}>
                <Typography className={classes.desc}>Last Loaned Time</Typography>
                <Typography className={classes.val}>{lastLoanedTime}</Typography>
              </Grid>
            </Grid>
          </div>
        </Grid>
      </Grid>
      {isRewardDialog &&
        <RewardModal
          onClose={closeHandler}
          account={account}
          chainId={chainId}
          library={library}
          reward={rewardMehtod}
        />
      }
    </Grid>
  );
};

VaultPan.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
};

export default VaultPan;
