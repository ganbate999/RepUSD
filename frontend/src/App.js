
import 'typeface-roboto';
import React, { useState, useEffect, Suspense } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useWeb3React } from '@web3-react/core'
import { useEagerConnect, useInactiveListener } from 'utils/hooks.js'
import { Switch, Route, withRouter } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import loadable from '@loadable/component';
import { SnackbarProvider } from 'notistack';
import pMinDelay from 'p-min-delay';
import axios from 'axios';

import theme from 'styles/theme';
import Layout from 'hoc/Layout';
import { AppContext } from 'contexts';
import { PAGES } from 'utils/links/pages';
import WalletModal from 'components/WalletModal';
import OperModal from 'components/OperModal';
import OwnerModal from 'components/OwnerModal';
import ClimbLoading from 'components/ClimbLoading'
import Notifications from 'components/Notifications';
import { serverAddress } from 'constants/serverAddress';

const DELAY_TIME = 100;
const Home = loadable(() => pMinDelay(import('containers/Home'), DELAY_TIME));
const Lend = loadable(() => pMinDelay(import('containers/Lend'), DELAY_TIME));
const Vault = loadable(() => pMinDelay(import('containers/Vault'), DELAY_TIME));
const Doc = loadable(() => pMinDelay(import('containers/Doc'), DELAY_TIME));

const useStyles = makeStyles(() => ({
  primaryTextColor: {
    color: '#fff'
  }
}));

const App = () => {
  const classes = useStyles();
  const context = useWeb3React();
  const { connector, library, chainId, account, deactivate, active, error } = context;
  const [isWalletDialog, setIsWalletDialog] = useState();
  const [isOwnerDialog, setIsOwnerDialog] = useState(false);
  const [isOperatorDialog, setIsOperatorDialog] = useState(false);
  const [activatingConnector, setActivatingConnector] = useState();
  const [token, setToken] = useState();
  const [markets, setMarkets] = useState([]);
  const [isSearchInvest, setSearchInvest] = useState(false);
  const [loadingSerach, setLoadingSearch] = useState(false);
  const [maxAmount, setMaxAmount] = useState(0)

  useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined)
    }
  }, [activatingConnector, connector])

  useEffect(() => {
    async function getToken() {
      const url = serverAddress + 'login';
      const response = await axios.post(url,{address: account});
      if(response.data.success)
        setToken(response.data.result.token);
    }
    if(!!account)
      getToken();
  },[account]);

  const triedEager = useEagerConnect();
  useInactiveListener(!triedEager || !!activatingConnector)

  const [loadingInfo, setLoadingInfo] = useState(false);
  const [layout] = useState(false)

  const openCloseDialogHandler = show => () => {
    setIsWalletDialog(show)
  }

  const openCloseOperDialogHandler = show => () => {
    setIsOperatorDialog(show)
  }

  const openCloseOwnerDialogHandler = show => () => {
    setIsOwnerDialog(show)
  }

  useEffect(() => {
    if (isWalletDialog || isOwnerDialog || isOperatorDialog) {
      document.body.style.overflow = 'hidden';
    }
    else {
      document.body.style.overflow = 'unset';
    }
  }, [isWalletDialog, isOwnerDialog, isOperatorDialog])

  return (
    <AppContext.Provider
      value={{
        loadingInfo,
        library,
        active,
        setLoadingInfo,
        setIsWalletDialog,
        setIsOwnerDialog,
        setIsOperatorDialog,
        token,
        account,
        chainId,
        deactivate,
        markets,
        setMarkets,
        error,
        isSearchInvest,
        setSearchInvest,
        loadingSerach,
        setLoadingSearch
      }}>
      <ThemeProvider theme={theme}>
        <SnackbarProvider
          classes={{
            variantSuccess: classes.primaryTextColor,
            variantError: classes.primaryTextColor,
            variantWarning: classes.primaryTextColor,
            variantInfo: classes.primaryTextColor
          }}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left'
          }}
          maxSnack={3}>
          <CssBaseline />
          <Notifications notifications={''} notificationType={'success'} />
          <Suspense fallback={<ClimbLoading wholeOverlay />}>
            <Layout layout={layout} account={account}>
              {
                isWalletDialog &&
                <WalletModal
                  headerTitle={'RepUSD'}
                  open={true}
                  onClose={openCloseDialogHandler(false)}
                  setActivatingConnector={setActivatingConnector}
                  activatingConnector={activatingConnector}
                  triedEager={triedEager}
                  context={context}
                />
              }
              {
                isOwnerDialog &&
                <OwnerModal
                  headerTitle={'SETTING'}
                  open={true}
                  onClose={openCloseOwnerDialogHandler(false)}
                  context={context}
                />
              }
              {
                isOperatorDialog &&
                <OperModal
                  headerTitle={'WITHDRAW'}
                  open={true}
                  onClose={openCloseOperDialogHandler(false)}
                  context={context}
                  maxAmount={maxAmount}
                  set={setMaxAmount}
                />
              }
              <Switch>
                <Route exact path={PAGES.HOME.url} component={Home} />
                <Route path={PAGES.LEND.url} component={Lend} />
                <Route path={PAGES.VAULT.url} component={Vault} />
                <Route path={PAGES.DOC.url} component={Doc} />
              </Switch>
            </Layout>
          </Suspense>
        </SnackbarProvider>
      </ThemeProvider>
    </AppContext.Provider>
  )
};

export default withRouter(App);