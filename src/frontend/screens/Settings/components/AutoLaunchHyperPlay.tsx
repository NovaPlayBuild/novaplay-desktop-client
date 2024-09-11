import React, { useEffect } from 'react'
import { ToggleSwitch } from 'frontend/components/UI'
import useSetting from 'frontend/hooks/useSetting'
import { useTranslation } from 'react-i18next'

const AutoLaunchNovaPlay = () => {
  const { t } = useTranslation()

  const [autoLaunchNovaPlay, setAutoLaunchNovaPlay] = useSetting(
    'autoLaunchNovaPlay',
    true
  )

  useEffect(() => {
    async function init() {
      const platform = await window.api.getPlatform()
      // currently set as opt in on mac
      if (platform === 'darwin') {
        setAutoLaunchNovaPlay(false)
      }
    }
    init()
  })

  return (
    <ToggleSwitch
      htmlId="AutoLaunchNovaPlay"
      value={autoLaunchNovaPlay}
      handleChange={() => {
        setAutoLaunchNovaPlay(!autoLaunchNovaPlay)
        window.api.updateAutoLaunch()
      }}
      title={t('setting.autoLaunchNovaPlay', 'Auto Launch NovaPlay')}
    />
  )
}

export default AutoLaunchNovaPlay
