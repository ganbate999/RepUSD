
import React, { useState, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from "@material-ui/core/Grid";
import { useSnackbar } from 'notistack';

import DialogWrapper, { dialogStyles } from 'hoc/DialogWrapper';
import ContainedButton from 'components/UI/Buttons/ContainedButton';
import { MemoizedOutlinedTextField } from 'components/UI/OutlinedTextField';
import { isEmpty, delay } from 'utils/utility';
import { contractInstance } from 'services/contractInstance';

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
  gridCls:{
    padding: theme.spacing(0)
  }
}));

const OwnerModal = ({ open, onClose, headerTitle, context }) => {
  const classes = useStyles();
  const dialogClasses = dialogStyles();
  const { enqueueSnackbar } = useSnackbar();

  const { account, chainId, library, error } = context
  const contract = contractInstance(account, chainId, library);
  
  const onFormSubmit = async (ev) => {
    ev.preventDefault()
    onClose();
  }

  const [state, setState] = useState({
    admin: '',
    owner: '',
    oper: '',
    mint: 0,
    interest: 0,
    profit: 0
  });
  const [loadingAdminStatus, setLoadingAdminStatus] = useState(false);
  const [loadingOwnerStatus, setLoadingOwnerStatus] = useState(false);
  const [loadingOperStatus, setLoadingOperStatus] = useState(false);
  const [loadingMintStatus, setLoadingMintStatus] = useState(false);
  const [loadingInterestStatus, setLoadingInterestStatus] = useState(false);
  const [loadingProfitStatus, setLoadingProfitStatus] = useState(false);

  const inputChangeHandler = useCallback(event => {
    const { name, value } = event.target;
    if(name === 'admin'){
      setState(prevState => ({
        ...prevState, [name]: value, 'admin': value
      }));
    } else if(name === 'owner') {
      setState(prevState => ({
        ...prevState, [name]: value, 'owner': value
      }));
    } else if(name === 'oper') {
      setState(prevState => ({
        ...prevState, [name]: value, 'oper': value
      }));
    } else if(name === 'mint') {
      setState(prevState => ({
        ...prevState, [name]: value, 'mint': value
      }));
    } else if(name === 'interest') {
      setState(prevState => ({
        ...prevState, [name]: value, 'interest': value
      }));
    } else if(name === 'profit') {
      setState(prevState => ({
        ...prevState, [name]: value, 'profit': value
      }));
    }
  }, []);

  const setAdmin = async () => {
    if(!!error || isEmpty(account))
    {
      enqueueSnackbar(`First, Please fix the error`, { variant: 'error' });
      return;
    }
    setLoadingAdminStatus(true);
    try{
      let loop = true
      let tx = null
      
      const { hash: flipSaleStateHash } = await contract.setAdmin(state.admin)
      while (loop) {
          tx = await library.getTransactionReceipt(flipSaleStateHash)
          if(isEmpty(tx)) {
            await delay(200)
          } else {
            loop = false
          }
      }
      if (tx.status === 1) {
        setLoadingAdminStatus(false)
        enqueueSnackbar(`setting admin success:`, { variant: 'success' });
        return;
      } else {
        setLoadingAdminStatus(false)
        enqueueSnackbar(`failed:`, { variant: 'error' });
        return;
      }
    }
    catch(error) {
        console.log('kevin===>', error)
        enqueueSnackbar(`setting admin  error ${error?.data?.message}`, { variant: 'error' });
        setLoadingAdminStatus(false)
    }
  }

  const setOwner = async () => {
    if(!!error || isEmpty(account))
    {
      enqueueSnackbar(`First, Please fix the error`, { variant: 'error' });
      return;
    }
    setLoadingOwnerStatus(true);
    try{
      let loop = true
      let tx = null
      
      const { hash: flipSaleStateHash } = await contract.transferOwnership(state.owner)
      while (loop) {
          tx = await library.getTransactionReceipt(flipSaleStateHash)
          if(isEmpty(tx)) {
            await delay(200)
          } else {
            loop = false
          }
      }
      if (tx.status === 1) {
        setLoadingOwnerStatus(false)
        enqueueSnackbar(`setting owner success:`, { variant: 'success' });
        return;
      } else {
        setLoadingOwnerStatus(false)
        enqueueSnackbar(`failed:`, { variant: 'error' });
        return;
      }
    }
    catch(error) {
        console.log('kevin===>', error)
        enqueueSnackbar(`setting owner  error ${error?.data?.message}`, { variant: 'error' });
        setLoadingOwnerStatus(false)
    }
  }

  const setOper = async () => {
    if(!!error || isEmpty(account))
    {
      enqueueSnackbar(`First, Please fix the error`, { variant: 'error' });
      return;
    }
    setLoadingOperStatus(true);
    try{
      let loop = true
      let tx = null
      
      const { hash: flipSaleStateHash } = await contract.setOperator(state.oper)
      while (loop) {
          tx = await library.getTransactionReceipt(flipSaleStateHash)
          if(isEmpty(tx)) {
            await delay(200)
          } else {
            loop = false
          }
      }
      if (tx.status === 1) {
        setLoadingOperStatus(false)
        enqueueSnackbar(`setting operator success:`, { variant: 'success' });
        return;
      } else {
        setLoadingOperStatus(false)
        enqueueSnackbar(`failed:`, { variant: 'error' });
        return;
      }
    }
    catch(error) {
        console.log('kevin===>', error)
        enqueueSnackbar(`setting operator  error ${error?.data?.message}`, { variant: 'error' });
        setLoadingOperStatus(false)
    }
  }

  const setMint = async () => {
    if(!!error || isEmpty(account))
    {
      enqueueSnackbar(`First, Please fix the error`, { variant: 'error' });
      return;
    }
    setLoadingMintStatus(true);
    try{
      let loop = true
      let tx = null
      
      const { hash: flipSaleStateHash } = await contract.setRewardMintRate(`${state.mint}`)
      while (loop) {
          tx = await library.getTransactionReceipt(flipSaleStateHash)
          if(isEmpty(tx)) {
            await delay(200)
          } else {
            loop = false
          }
      }
      if (tx.status === 1) {
        setLoadingMintStatus(false)
        enqueueSnackbar(`setting mint rate success:`, { variant: 'success' });
        return;
      } else {
        setLoadingMintStatus(false)
        enqueueSnackbar(`failed:`, { variant: 'error' });
        return;
      }
    }
    catch(error) {
        console.log('kevin===>', error)
        enqueueSnackbar(`setting mint rate  error ${error?.data?.message}`, { variant: 'error' });
        setLoadingMintStatus(false)
    }
  }

  const setInterest = async () => {
    if(!!error || isEmpty(account))
    {
      enqueueSnackbar(`First, Please fix the error`, { variant: 'error' });
      return;
    }
    setLoadingInterestStatus(true);
    try{
      let loop = true
      let tx = null
      
      const { hash: flipSaleStateHash } = await contract.setRewardInterestRate(`${state.interest}`)
      while (loop) {
          tx = await library.getTransactionReceipt(flipSaleStateHash)
          if(isEmpty(tx)) {
            await delay(200)
          } else {
            loop = false
          }
      }
      if (tx.status === 1) {
        setLoadingInterestStatus(false)
        enqueueSnackbar(`setting interest rate success:`, { variant: 'success' });
        return;
      } else {
        setLoadingInterestStatus(false)
        enqueueSnackbar(`failed:`, { variant: 'error' });
        return;
      }
    }
    catch(error) {
        console.log('kevin===>', error)
        enqueueSnackbar(`setting interest rate  error ${error?.data?.message}`, { variant: 'error' });
        setLoadingInterestStatus(false)
    }
  }

  const setProfit = async () => {
    if(!!error || isEmpty(account))
    {
      enqueueSnackbar(`First, Please fix the error`, { variant: 'error' });
      return;
    }
    setLoadingProfitStatus(true);
    try{
      let loop = true
      let tx = null
      
      const { hash: flipSaleStateHash } = await contract.setRewardProfitRate(`${state.profit}`)
      while (loop) {
          tx = await library.getTransactionReceipt(flipSaleStateHash)
          if(isEmpty(tx)) {
            await delay(200)
          } else {
            loop = false
          }
      }
      if (tx.status === 1) {
        setLoadingProfitStatus(false)
        enqueueSnackbar(`setting profit rate success:`, { variant: 'success' });
        return;
      } else {
        setLoadingProfitStatus(false)
        enqueueSnackbar(`failed:`, { variant: 'error' });
        return;
      }
    }
    catch(error) {
        console.log('kevin===>', error)
        enqueueSnackbar(`setting profit rate  error ${error?.data?.message}`, { variant: 'error' });
        setLoadingProfitStatus(false)
    }
  }
  
  return (
    <DialogWrapper open={open} onClose={onClose}>
      <form onSubmit={onFormSubmit} >
        <div className={dialogClasses.root}>
          <Typography variant='h6' className={classes.titleLine}>{headerTitle}</Typography>
          <DialogContent dividers className={classes.dialogContent}>
            <Grid container spacing={2} className={classes.container} justifyContent="space-between">
              <Grid item xs={12} style={{padding: '0px'}}>
                <Typography variant='subtitle1' className={classes.labelLine}>Admin</Typography>
              </Grid>
              <Grid item xs={12} md={7} style={{padding: '0px'}}>
                <MemoizedOutlinedTextField
                  placeholder=''
                  name={'admin'}
                  value={state.admin}
                  onChange={inputChangeHandler}
                />
              </Grid>
              <Grid item container style={{padding: '0px'}} justifyContent="center" alignItems="center" xs={12} md={5}>
                <ContainedButton
                  loading={loadingAdminStatus}
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '2.5rem',
                    borderRadius: '1rem',
                    borderColor: 'red',
                    cursor: 'pointer',
                    color: 'textSecondary'
                  }}
                  onClick={() => 
                    setAdmin()
                  }
                >
                  SETTING
                </ContainedButton>
              </Grid>

              <Grid item xs={12} style={{padding: '0px'}}>
                <Typography variant='subtitle1' className={classes.labelLine}>Owner</Typography>
              </Grid>
              <Grid item xs={12} md={7} style={{padding: '0px'}}>
                <MemoizedOutlinedTextField
                  placeholder=''
                  name={'owner'}
                  value={state.owner}
                  onChange={inputChangeHandler}
                />
              </Grid>
              <Grid item container style={{padding: '0px'}} justifyContent="center" alignItems="center" xs={12} md={5}>
                <ContainedButton
                  loading={loadingOwnerStatus}
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '2.5rem',
                    borderRadius: '1rem',
                    borderColor: 'red',
                    cursor: 'pointer',
                    color: 'textSecondary'
                  }}
                  onClick={() => 
                    setOwner()
                  }
                >
                  SETTING
                </ContainedButton>
              </Grid>

              <Grid item xs={12} style={{padding: '0px'}}>
                <Typography variant='subtitle1' className={classes.labelLine}>Operator</Typography>
              </Grid>      
              <Grid item xs={12} md={7} style={{padding: '0px'}}>
                <MemoizedOutlinedTextField
                  placeholder=''
                  name={'oper'}
                  value={state.oper}
                  onChange={inputChangeHandler}
                />
              </Grid>
              <Grid item container justifyContent="center" alignItems="center" xs={12} md={5} style={{padding: '0px'}}>
                <ContainedButton
                  loading={loadingOperStatus}
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '2.5rem',
                    borderRadius: '1rem',
                    borderColor: 'red',
                    cursor: 'pointer',
                    color: 'textSecondary'
                  }}
                  onClick={() => 
                    setOper()
                  }
                >
                  SETTING
                </ContainedButton>
              </Grid>
              <Grid item xs={12} style={{padding: '0px'}}>
                <Typography variant='subtitle1' className={classes.labelLine}>Reward Minting Rate</Typography>
              </Grid>
              <Grid item xs={12} md={7} style={{padding: '0px'}}>
                <MemoizedOutlinedTextField
                  placeholder='1'
                  type="number"
                  name={'mint'}
                  value={state.mint}
                  onChange={inputChangeHandler}
                />
              </Grid>
              <Grid item container justifyContent="center" alignItems="center" xs={12} md={5} style={{padding: '0px'}}>
                <ContainedButton
                  loading={loadingMintStatus}
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '2.5rem',
                    borderRadius: '1rem',
                    borderColor: 'red',
                    cursor: 'pointer',
                    color: 'textSecondary'
                  }}
                  onClick={() => 
                    setMint()
                  }
                >
                  SETTING
                </ContainedButton>
              </Grid>
              <Grid item xs={12} style={{padding: '0px'}}>
                <Typography variant='subtitle1' className={classes.labelLine}>Interest Rate</Typography>
              </Grid>
              <Grid item xs={12} md={7} style={{padding: '0px'}}>
                <MemoizedOutlinedTextField
                  placeholder='1'
                  type="number"
                  name={'interest'}
                  value={state.interest}
                  onChange={inputChangeHandler}
                />
              </Grid>
              <Grid item container justifyContent="center" alignItems="center" xs={12} md={5} style={{padding: '0px'}}>
                <ContainedButton
                  loading={loadingInterestStatus}
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '2.5rem',
                    borderRadius: '1rem',
                    borderColor: 'red',
                    cursor: 'pointer',
                    color: 'textSecondary'
                  }}
                  onClick={() => 
                    setInterest()
                  }
                >
                  SETTING
                </ContainedButton>
              </Grid>
              <Grid item xs={12} style={{padding: '0px'}}>
                <Typography variant='subtitle1' className={classes.labelLine}>Profit Sharing Rate</Typography>
              </Grid>
              <Grid item xs={12} md={7} style={{padding: '0px'}}>
                <MemoizedOutlinedTextField
                  placeholder='1'
                  type="number"
                  name={'profit'}
                  value={state.profit}
                  onChange={inputChangeHandler}
                />
              </Grid>
              <Grid
                item
                container
                justifyContent="center"
                alignItems="center"
                xs={12}
                md={5}
                style={{padding: '0px'}}
              >
                <ContainedButton
                  loading={loadingProfitStatus}
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '2.5rem',
                    borderRadius: '1rem',
                    borderColor: 'red',
                    cursor: 'pointer',
                    color: 'textSecondary'
                  }}
                  onClick={() => 
                    setProfit()
                  }
                >
                  SETTING
                </ContainedButton>
              </Grid>
            </Grid>
          </DialogContent>
        </div>
      </form>
    </DialogWrapper>
  );
}

export default OwnerModal;
