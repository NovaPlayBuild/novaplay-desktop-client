import { NovaPlayAPI } from '@novaplay/utils'
import { captureException } from '@sentry/electron'
import { backendEvents } from 'backend/backend_events'
import {
  appConfigFolder,
  configFolder,
  fixAsarPath,
  icon,
  publicDir
} from 'backend/constants/folders'
import {
  errorExtensionRequestEvents,
  providerEvents,
  providerRequests,
  returnExtensionRequestEvents
} from 'backend/extension/provider/emitters'
import { LogPrefix, logError, logInfo } from 'backend/logger/logger'
import { getMainWindow } from 'backend/main_window'
import defaultProviderStore from 'backend/proxy/provider_store'
import { openUrlOrFile } from 'backend/utils'
import {
  DESCRIPTION,
  EXTENSION_NOTIFICATION,
  INITIAL_TOAST,
  TITLE
} from 'frontend/screens/TransactionNotification/constants'

function setMainWindowOnTop() {
  getMainWindow()?.restore()
  getMainWindow()?.focus()
  getMainWindow()?.moveTop()
}

export const hpApi: NovaPlayAPI = {
  backendEvents,
  updatePopupInOverlay: async (...args) => {
    const hpOverlay = await import('@novaplay/overlay')
    return hpOverlay?.updatePopupInOverlay(...args)
  },
  logError: (msg: string) => logError(msg, LogPrefix.NovaPlay),
  logInfo: (msg: string) => logInfo(msg, LogPrefix.NovaPlay),
  extensionProvider: undefined,
  getMainWindowId: () => getMainWindow()?.id ?? -1,
  /* eslint-disable-next-line */
  openMetaMaskHomePage: (...args: any) => {
    setMainWindowOnTop()
    getMainWindow()?.webContents.send('openMetaMaskHomePage', ...args)
  },
  openMetaMaskSnapsPage: () => {
    setMainWindowOnTop()
    getMainWindow()?.webContents.send('openMetaMaskSnapsPage')
  },
  /* eslint-disable-next-line */
  openMetaMaskPortfolioPage: (...args: any) => {
    setMainWindowOnTop()
    getMainWindow()?.webContents.send('openMetaMaskPortfolioPage', ...args)
  },
  setBadgeTextInRenderer: (text: string) =>
    getMainWindow()?.webContents.send('setBadgeTextInRenderer', text),
  openUrl: async (url: string) => openUrlOrFile(url),
  captureException,
  configFolder,
  appConfigFolder,
  publicDir,
  fixAsarPath,
  eventsToCloseMetaMaskPopupOn: [],
  appIconPath: icon,
  providerEvents,
  returnExtensionRequestEvents,
  errorExtensionRequestEvents,
  providerRequests,
  toggleOverlay: async (...args) => {
    const hpOverlay = await import('@novaplay/overlay')
    return hpOverlay?.toggleOverlay(...args)
  },
  removePopup: async () => {
    const mainWindow = getMainWindow()
    if (mainWindow) {
      const hpOverlay = await import('@novaplay/overlay')
      hpOverlay?.removePopup(mainWindow.id)
    }
  },
  getMetaMaskExtensionId: async () => {
    const extensionImporter = await import('@novaplay/extension-importer')
    return extensionImporter?.getExtensionId() ?? ''
  },
  getCurrentWeb3Provider: () => {
    return defaultProviderStore.get_nodefault('currentWeb3Provider')
  },
  i18n: {
    transactions: {
      TITLE: TITLE,
      DESCRIPTION: DESCRIPTION,
      EXTENSION_NOTIFICATION: EXTENSION_NOTIFICATION,
      INITIAL_TOAST: INITIAL_TOAST
    }
  }
}

async function initNovaPlayAPI() {
  try {
    const extensionProvPackage = await import('@novaplay/extension-provider')
    hpApi.extensionProvider = extensionProvPackage.extensionProvider
    logInfo('NovaPlayAPI initialized', LogPrefix.NovaPlay)
  } catch (err) {
    logError(`Error iniitalizing NovaPlayAPI ${err}`, LogPrefix.NovaPlay)
  }
}

initNovaPlayAPI()
