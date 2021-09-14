
import React, { useState, memo, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { loadCSS } from 'fg-loadcss';
import ListItem from '@material-ui/core/ListItem';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { useMediaQuery } from '@material-ui/core';
import Icon from '@material-ui/core/Icon';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import { AppContext } from 'contexts';
import OutlinedButton from 'components/UI/Buttons/OutlinedButton';
import { contractInstance } from 'services/contractInstance';

const useStyles = makeStyles(theme => ({
  menuItem: {
    flexDirection: 'row',
    width: 'fit-content',
    minHeight: '100%',
    padding: 0
  },
  menuFont: {
    fontFamily: 'Arial',
    color: theme.palette.text.secondary,
    '&:hover': {
      color: theme.palette.warning.main
    }
  },
  menuLink: {
    textDecoration: 'none'
  }
}));

const TopAppBarMenu = () => {
  const classes = useStyles();
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true
  });

  const { account, chainId, library, setIsOperatorDialog, setIsOwnerDialog } = useContext(AppContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [specPriv, setSpecPriv] = useState('');
  const isSpec = specPriv !== '';
  const contract = contractInstance(account, chainId, library);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event) => {
    handleSpec()
    setAnchorEl(null);
  };

  const handleSpec = () => {
    if(specPriv === 'Withdraw')
      setIsOperatorDialog(true)
    else if(specPriv === 'Setting')
      setIsOwnerDialog(true)
  }

  useEffect(() => {
    const node = loadCSS(
      'https://use.fontawesome.com/releases/v5.12.0/css/all.css',
      document.querySelector('#font-awesome-css'),
    );

    return () => {
      node.parentNode.removeChild(node);
    };
  },[]);

  useEffect(() => {
    async function getInfo(userAccount){
      try{
        const w_operAddress = await contract.operatorAddress();
        const w_ownerAddress = await contract.owner();
        
        if(userAccount === w_operAddress.toLowerCase())
        {
          setSpecPriv('Withdraw')
        } else if(userAccount === w_ownerAddress.toLowerCase())
        {
          setSpecPriv('Setting')
        } else {
          setSpecPriv('')
        }
        
        setSpecPriv('Setting')
      } catch(error) {
        
      }
    }
    if(!!account)
      getInfo(account.toLowerCase());
  },[account])

  return (
    <>
      {isMd?
      <ListItem className={classes.menuItem}>
        {isSpec?
          <div>
            <OutlinedButton onClick={() => {}} style={{ border: 'none' }}>
              <Link className={classes.menuLink} to="/lend">
                <Typography variant='body2' className={classes.menuFont}>Get Reputation</Typography>
              </Link>
            </OutlinedButton>
            <OutlinedButton onClick={() => {}} style={{ border: 'none' }}>
              <Link className={classes.menuLink} to="/vault">
                <Typography variant='body2' className={classes.menuFont}>My Earnings</Typography>
              </Link>
            </OutlinedButton>
            <OutlinedButton onClick={() => {}} style={{ border: 'none' }}>
              <Link className={classes.menuLink} to="/doc">
                <Typography variant='body2' className={classes.menuFont}>Doc</Typography>
              </Link>
            </OutlinedButton>
            <OutlinedButton onClick={handleSpec} style={{ border: 'none' }}>
              <Typography variant='body2' className={classes.menuFont}>{specPriv}</Typography>
            </OutlinedButton>
          </div>
          :
          <div>
            <OutlinedButton onClick={() => {}} style={{ border: 'none' }}>
              <Link className={classes.menuLink} to="/lend">
                <Typography variant='body2' className={classes.menuFont}>Get Reputation</Typography>
              </Link>
            </OutlinedButton>
            <OutlinedButton onClick={() => {}} style={{ border: 'none' }}>
              <Link className={classes.menuLink} to="/vault">
                <Typography variant='body2' className={classes.menuFont}>My Earnings</Typography>
              </Link>
            </OutlinedButton>
            <OutlinedButton onClick={() => {}} style={{ border: 'none' }}>
              <Link className={classes.menuLink} to="/doc">
                <Typography variant='body2' className={classes.menuFont}>Doc</Typography>
              </Link>
            </OutlinedButton>
          </div>
        }
      </ListItem>
      :
      <div>
        <OutlinedButton onClick={handleClick} style={{ border: 'none' }}>
          <Icon className="fa fa-bars" style={{color: '#fff'}} />
        </OutlinedButton>
        {isSpec?
          <Menu
            id="simple-menu"
            anchorEl={anchorEl} 
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem style={{color: '#000'}} onClick={handleClose}>
              <Link className={classes.menuLink} to="/lend">
                <Typography variant='body2' className={classes.menuFont}>Get Reputation</Typography>
              </Link></MenuItem>
            <MenuItem  style={{color: '#000'}} onClick={handleClose}>
              <Link className={classes.menuLink} to="/vault">
                <Typography variant='body2' className={classes.menuFont}>My Earnings</Typography>
              </Link>
            </MenuItem>
            <MenuItem  style={{color: '#000'}} onClick={handleClose}>
              <Link className={classes.menuLink} to="/doc">
                <Typography variant='body2' className={classes.menuFont}>Doc</Typography>
              </Link>
            </MenuItem>
            <MenuItem style={{color: '#000'}} onClick={handleClose}>
              <Typography variant='body2' className={classes.menuFont}>{specPriv}</Typography>
            </MenuItem>
          </Menu>
          :
          <Menu
          id="simple-menu"
            anchorEl={anchorEl} 
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem style={{color: '#000'}} onClick={handleClose}>
              <Link className={classes.menuLink} to="/lend">
                <Typography variant='body2' className={classes.menuFont}>Get Reputation</Typography>
              </Link></MenuItem>
            <MenuItem  style={{color: '#000'}} onClick={handleClose}>
              <Link className={classes.menuLink} to="/vault">
                <Typography variant='body2' className={classes.menuFont}>My Earnings</Typography>
              </Link>
            </MenuItem>
            <MenuItem  style={{color: '#000'}} onClick={handleClose}>
              <Link className={classes.menuLink} to="/doc">
                <Typography variant='body2' className={classes.menuFont}>Doc</Typography>
              </Link>
            </MenuItem>
          </Menu>
        }
      </div>
      }
    </>
  );
};

export default memo(TopAppBarMenu);
