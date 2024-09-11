import { LogPrefix, logError } from 'backend/logger/logger'
import { NovaPlayAPI } from '@novaplay/utils'

export async function getHpOverlay() {
  try {
    const hpOverlay = await import('@novaplay/overlay')
    if (!Object.hasOwn(hpOverlay, 'toggleOverlay')) {
      return undefined
    }
    return hpOverlay
  } catch (err) {
    logError(`Error getting overlay ${err}`, LogPrefix.NovaPlay)
  }
  return undefined
}

export const initOverlay = async function (api: NovaPlayAPI) {
  try {
    const hpOverlay = await getHpOverlay()
    hpOverlay?.initOverlay(api)
  } catch (err) {
    logError(`Error initializing overlay ${err}`, LogPrefix.NovaPlay)
  }
}
