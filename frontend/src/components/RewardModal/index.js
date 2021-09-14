
import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from "@material-ui/core/Grid";
import RadioGroup from '@material-ui/core/RadioGroup';
import { FormControlLabel } from '@material-ui/core';
import { useSnackbar } from 'notistack';

import DialogWrapper, { dialogStyles } from 'hoc/DialogWrapper';
import ContainedButton from 'components/UI/Buttons/ContainedButton';
import { isEmpty, delay } from 'utils/utility';
import { contractInstance } from 'services/contractInstance';
import CustomRadio from 'components/UI/CustomRadio';
import Image from 'components/UI/Image';

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
  image: {
    width: 150, 
    height: 150, 
    background: 'none', 
    margin: '10px',
    borderRadius: '5px',
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
  },
  label: {
    fontSize: '20px',
    //fontFamily: 'fontMedium'
  }
}));

const RewardModal = ({ onClose, account, chainId, library, reward }) => {
  const classes = useStyles();
  const dialogClasses = dialogStyles();
  const { enqueueSnackbar } = useSnackbar();

  const contract = contractInstance(account, chainId, library);
  
  const onFormSubmit = async (ev) => {
    ev.preventDefault()
    onClose();
  }
  
  const[rewardMethod, setRewardMethod] = useState(reward);
  const[loadingStatus, setLoadingStatus] = useState(false);

  const handleChange = (event) => {
    setRewardMethod(event.target.value);
  }

  const chooseReward = async () => {
    if (!!account) {
      let w_rewardMethod = false;
      if(rewardMethod === 'sharing')
        w_rewardMethod = true;

      setLoadingStatus(true)
      try {
        let loop = true;
        let tx = null;
        const {hash: rewardMethodHash} = await contract.changeRewardMethod(w_rewardMethod)
        
        while (loop) {
            tx = await library.getTransactionReceipt(rewardMethodHash);
            console.log('kevin transaction tx', tx)
            if (isEmpty(tx)) {
                await delay(300)
            } else {
                loop = false
            }
        }
        if (tx.status === 1) {
          setLoadingStatus(false)
          enqueueSnackbar(`Reward Method Change Successful.`, { variant: 'success'});
          onClose();
          return;
        } else {
          setLoadingStatus(false)
          enqueueSnackbar(`failed:`, { variant: 'error' });
          onClose();
          return;
        }
      } catch (error) {
          enqueueSnackbar(`error: ${error?.data?.message}`, { variant: 'error' });
          setLoadingStatus(false)
          console.log('kevin===>', error)
      }
    }
  }  
  
  return (
    <DialogWrapper open={true} onClose={onClose}>
      <form onSubmit={onFormSubmit} >
        <div className={dialogClasses.root}>
          <Typography variant='h6' className={classes.titleLine}>Set Reward Method</Typography>
          <DialogContent dividers className={classes.dialogContent}>
            <Grid container spacing={2} className={classes.container} justifyContent="space-between">
              <Grid
                item
                container
                justifyContent="center"
                alignItems="center"
                xs={12}
                md={6}
                spacing={2}>
                  <Image
                      src="assets/images/RepUSD.png"
                      className={classes.image}
                      alt="Web3 Legal Engineering"
                  />
              </Grid>
              <Grid
                item
                xs={12}
                md={6}
                container
                justifyContent="center"
                alignItems="center"
              >
                <RadioGroup aria-label="gender" value={rewardMethod} onChange={handleChange}>
                    <FormControlLabel classes={{label: classes.label}} value="interest" control={<CustomRadio />} label="Earning interest" />
                    <FormControlLabel classes={{label: classes.label}} value="sharing" control={<CustomRadio />} label="Profit sharing" />
                </RadioGroup>
              </Grid>

              <Grid
                item
                xs={12}
                md={12}
                container
                justifyContent="center"
                alignItems="center"
              >
                {
                  reward !== "sharing" &&
                  <Typography>
                  Your default reward method is Earn Interest with 18% APY.<br/>
                  If you like to change your reward method to Profit Sharing with earnings of 16.5RepUSD 
                  per 100RepUSD per year, select the Profit Sharing option below and click change. <br/>
                  If you want to continue with Earn Interest reward method, click close. 
                  </Typography>
                }
              </Grid>

            </Grid>
          </DialogContent>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
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
                color: 'textSecondary',
              }}
              onClick={() => 
                chooseReward()
              }
            >
              Change
            </ContainedButton>
            <ContainedButton
              variant="outlined"
              color="primary"
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '2.3rem',
                marginTop: '1.1rem',
                borderRadius: '1rem',
                borderColor: 'white',
                cursor: 'pointer',
                color: 'textPrimary'
              }}
              onClick={() => 
                onClose()
              }
            >
              Close
            </ContainedButton>
          </div>
        </div>
      </form>
    </DialogWrapper>
  );
}

export default RewardModal;
