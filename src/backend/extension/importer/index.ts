import { session } from 'electron'
import store from './store'
import { NovaPlayAPI } from '@novaplay/utils'
import './backendEventHandlers'
import './ipcHandler'
import { LogPrefix, logError } from 'backend/logger/logger'

export const initExtension = async function (api: NovaPlayAPI) {
  try {
    const extensionImporter = await import('@novaplay/extension-importer')
    const isInitialized = store.get('isInitialized', false)
    extensionImporter.initExtension(api, session.defaultSession, isInitialized)
  } catch (err) {
    logError(`Error initializing extension ${err}`, LogPrefix.NovaPlay)
  }
}
