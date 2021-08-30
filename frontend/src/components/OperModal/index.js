
import React, { useState, useCallback, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from "@material-ui/core/Grid";
import { useSnackbar } from 'notistack';

import DialogWrapper, { dialogStyles } from 'hoc/DialogWrapper';
import ContainedButton from 'components/UI/Buttons/ContainedButton';
import { MemoizedOutlinedTextField } from 'components/UI/OutlinedTextField';
// import Image from 'components/UI/Image';
import { isEmpty, delay } from 'utils/utility';
import { contractInstance } from 'services/contractInstance';
import { tokenInstance } from 'services/tokenInstance';
import { contractAddress } from '../../constants/contractAddresses';

const useStyles = makeStyles(theme => ({
  actionButton: {
    backgroundColor: theme.custom.palette.darkRed,
    minWidth: theme.spacing(1),
    border: 'none'
  },
  dialogActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: theme.spacing(3),
    marginRight: -theme.spacing(2 / 8)
  },
  titleLine: {
    marginBottom: theme.spacing(2.5)
  },
  labelLine: {
    marginBottom: theme.spacing(1)
  },
  labelLine1: {
    marginTop: theme.spacing(1),
    paddingRight: theme.spacing(1),
    float: 'right',
    color: '#16ACE2'
  },
  input: {
    display: 'none'
  },
  imagePad: {
    width:200, 
    height: 200, 
    background: 'none', 
    margin: '10px',
    borderRadius: '5px',
    border: '1px solid rgb(107,118,161)'
  },
  dialogContent: {
    [theme.breakpoints.down(360)]: {
      maxHeight: '200px',
      padding: theme.spacing(0.5),
    },
    [theme.breakpoints.down('xs')]: {
      maxHeight: '382px',
      padding: theme.spacing(1, 0, 1, .5),
    },
    display: 'flex',
    justifyContent: 'center',
    padding: theme.spacing(1),
    maxHeight: '460px',
    width: 'auto',
    overflowX: 'unset',
    overflowY: 'scroll',
    '&::-webkit-scrollbar-track': {
      borderRadius: 2,
      backgroundColor: theme.palette.background.default
    },
    '&::-webkit-scrollbar': {
      width: 5,
      backgroundColor: theme.palette.background.default
    },
  },
  container: {
    [theme.breakpoints.down('sm')]: {
      padding: 0
    },
    display: 'flex',
    padding: `2px 8px 8px 8px`,
    margin: 0,
    flexGrow: 1,
  },
  image: {
    borderRadius: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
        maxWidth: 500,
    },
    width: '198px',
    height: '198px'
  }
}));

const OperModal = ({ open, onClose, headerTitle, context, maxAmount, set }) => {
  const classes = useStyles();
  const dialogClasses = dialogStyles();
  const { enqueueSnackbar } = useSnackbar();

  const { account, chainId, library, error } = context
  const contract = contractInstance(account, chainId, library);
  const token = tokenInstance(account, chainId, library);

  const onFormSubmit = async (ev) => {
    ev.preventDefault()
    onClose();
  }

  const [state, setState] = useState({
    withdrawValue: 0,
    repayValue: 0
  })
  const [loadingStatus, setLoadingStatus] = useState(false);
  // const [maxAmount, setMaxAmount] = useState(1000);
  
  useEffect(() => {
    async function getInfo(){
      try{
        const w_maxAmount = await contract.getAvailableWithdrawAmount()/1e18; 
        set(Math.floor(w_maxAmount*100)/100); 
      } catch(error) {
        
      }
    }
    if(!!account)
      getInfo();
  })

  const inputChangeHandler = useCallback(event => {
    const { name, value } = event.target;
    if(name === 'withdraw'){
      if(value > maxAmount || value < 0)
      {
        enqueueSnackbar(`Please input amount lower than max amount`, { variant: 'error' });
        setState(prevState => ({
          ...prevState, [name]: value, 'withdrawValue': 0
        }));
      } else {
        setState(prevState => ({
          ...prevState, [name]: value, 'withdrawValue': value
        }));
      }
    } else {
      setState(prevState => ({
        ...prevState, [name]: value, 'repayValue': value
      }));
    }
    
  }, [maxAmount]);

  const withdraw = async () => {
    if(!!error || isEmpty(account))
    {
      enqueueSnackbar(`First, Please fix the error`, { variant: 'error' });
      return;
    }
    setLoadingStatus(true);
    try{
      let loop = true
      let tx = null
      
      const { hash: flipSaleStateHash } = await contract.withdraw(`${state.withdrawValue * 1e18}`)
      while (loop) {
          tx = await library.getTransactionReceipt(flipSaleStateHash)
          if(isEmpty(tx)) {
            await delay(200)
          } else {
            loop = false
          }
      }
      if (tx.status === 1) {
        setLoadingStatus(false)
        enqueueSnackbar(`withdraw success:`, { variant: 'success' });
        return;
      } else {
        setLoadingStatus(false)
        enqueueSnackbar(`failed:`, { variant: 'error' });
        return;
      }
    }
    catch(error) {
        console.log('kevin===>', error)
        enqueueSnackbar(`withdraw  error ${error?.data?.message}`, { variant: 'error' });
        setLoadingStatus(false)
    }
  }
  
  const repay = async () => {
    if(!!error || isEmpty(account))
    {
      enqueueSnackbar(`First, Please fix the error`, { variant: 'error' });
      return;
    }
    setLoadingStatus(true);
    try{
      let loop = true
      let tx = null
      
      const { hash: approveHash } = await token.increaseAllowance(`${contractAddress}`, `${state.repayValue * 1e18}`)
      while (loop) {
        tx = await library.getTransactionReceipt(approveHash)
        if(isEmpty(tx)) {
          await delay(200)
        } else {
          const { hash: repayHash } = await contract.repay(`${state.repayValue * 1e18}`)
          while(loop) {
            tx = await library.getTransactionReceipt(repayHash)
            if(isEmpty(tx)) {
              await delay(200)
            } else {
              loop = false
            }
          }
        }
      }
      
      if (tx.status === 1) {
        setLoadingStatus(false)
        enqueueSnackbar(`repay success:`, { variant: 'success' });
        return;
      } else {
        setLoadingStatus(false)
        enqueueSnackbar(`failed:`, { variant: 'error' });
        return;
      }
    }
    catch(error) {
        console.log('kevin===>', error)
        enqueueSnackbar(`repay  error caused`, { variant: 'error' });
        setLoadingStatus(false)
    }
  }

  return (
    <DialogWrapper open={open} onClose={onClose}>
      <form onSubmit={onFormSubmit} >
        <div className={dialogClasses.root}>
          <Typography variant='h6' className={classes.titleLine}>{headerTitle}</Typography>
          <DialogContent dividers className={classes.dialogContent}>
            <Grid container spacing={2} className={classes.container} justifyContent="space-between">
              <Grid
                item
                container
                // justifyContent="center"
                // alignItems="center"
                xs={12}
                md={6}
                // spacing={2}
                >
                  {/* <Image
                      src="assets/images/RepUSD.png"
                      className={classes.image}
                      alt="Web3 Legal Engineering"
                  /> */}
                  <Typography variant='subtitle1' className={classes.labelLine}>Repay</Typography>
                  <MemoizedOutlinedTextField
                    placeholder='1'
                    type="number"
                    name={'repay'}
                    value={state.repayValue}
                    onChange={inputChangeHandler}
                  />
                  <Grid item container xs={12} justifyContent="center">
                    <ContainedButton
                      loading={loadingStatus}
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '2.5rem',
                        marginTop: '1rem',
                        borderRadius: '1rem',
                        borderColor: 'red',
                        cursor: 'pointer',
                        color: 'textSecondary'
                      }}
                      onClick={() => 
                        repay()
                      }
                    >
                      REPAY
                    </ContainedButton>
                  </Grid>
              </Grid>
              <Grid
                  item
                  container
                  xs={12}
                  md={6}
              >
                <Typography variant='subtitle1' className={classes.labelLine}>Max Withdraw Amount: {maxAmount}</Typography>
                <MemoizedOutlinedTextField
                  placeholder='1'
                  type="number"
                  name={'withdraw'}
                  value={state.withdrawValue}
                  onChange={inputChangeHandler}
                />
                <Grid item container xs={12} justifyContent="center">
                  <ContainedButton
                    loading={loadingStatus}
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '2.5rem',
                      marginTop: '1rem',
                      borderRadius: '1rem',
                      borderColor: 'red',
                      cursor: 'pointer',
                      color: 'textSecondary'
                    }}
                    onClick={() => 
                      withdraw()
                    }
                  >
                    WITHDRAW
                  </ContainedButton>
                </Grid>
                
              </Grid>
            </Grid>
          </DialogContent>
          {/* <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <ContainedButton
              loading={loadingStatus}
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '2.5rem',
                marginTop: '1rem',
                borderRadius: '1rem',
                borderColor: 'red',
                cursor: 'pointer',
                color: 'textSecondary'
              }}
              onClick={() => 
                withdraw()
              }
            >
              WITHDRAW
            </ContainedButton>
          </div> */}
        </div>
      </form>
    </DialogWrapper>
  );
}

export default OperModal;
