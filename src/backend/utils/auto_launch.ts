import AutoLaunch from 'auto-launch'
import { GlobalConfig } from 'backend/config'
import { isMac } from 'backend/constants'
import { ipcMain } from 'electron'

export const hyperPlayAutoLauncher = new AutoLaunch({
  name: 'NovaPlay',
  path: process.execPath
})

export async function updateAutoLaunch(enable: boolean) {
  if (enable) {
    return hyperPlayAutoLauncher.enable()
  } else {
    return hyperPlayAutoLauncher.disable()
  }
}

export async function hyperPlayAutoLaunchIsEnabled() {
  return hyperPlayAutoLauncher.isEnabled()
}

ipcMain.handle('updateAutoLaunch', async () => {
  const settings = GlobalConfig.get().getSettings()
  const { autoLaunchNovaPlay } = settings
  return updateAutoLaunch(autoLaunchNovaPlay)
})

const settings = GlobalConfig.get().getSettings()
const { autoLaunchNovaPlay } = settings

// default to true on fresh install. except for on Mac
// see: https://github.com/NovaPlay-Gaming/novaplay-desktop-client/issues/770
if (autoLaunchNovaPlay === undefined && !isMac) {
  updateAutoLaunch(true)
  GlobalConfig.get().setSetting('autoLaunchNovaPlay', true)
}
