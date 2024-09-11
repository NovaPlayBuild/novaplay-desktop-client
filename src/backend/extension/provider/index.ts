import { hpApi } from 'backend/utils/novaplay_api'
import './ipcHandler'
import { LogPrefix, logError, logInfo } from 'backend/logger/logger'
import { providerRequests } from './emitters'
import { getMainWindow } from 'backend/main_window'

async function initExtensionProvider() {
  try {
    const extensionProvider = await import('@novaplay/extension-provider')
    extensionProvider.initExtensionProvider(hpApi)
    logInfo('Extension provider initialized', LogPrefix.NovaPlay)
  } catch (err) {
    logError(
      `Error initializing extension provider ${err}`,
      LogPrefix.NovaPlay
    )
  }
}

initExtensionProvider()

providerRequests.on('request', (method, ...args) => {
  getMainWindow()?.webContents.send(method, ...args)
})
