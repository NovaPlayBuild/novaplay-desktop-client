import {
  faApple,
  faLinux,
  faWindows,
  faChrome
} from '@fortawesome/free-brands-svg-icons'

import React, { useContext, useEffect, useState } from 'react'

import ContextProvider from 'frontend/state/ContextProvider'
import {
  AppPlatforms,
  AvailablePlatforms,
  GameInfo,
  InstallPlatform,
  Runner,
  WineInstallation
} from 'common/types'
import { Dialog } from 'frontend/components/UI/Dialog'

import './index.scss'

import DownloadDialog from './DownloadDialog'
import SideloadDialog from './SideloadDialog'
import WineSelector from './WineSelector'
import { getPlatformName } from 'frontend/helpers'
import PlatformSelection from 'frontend/components/UI/PlatformSelection'
import ChannelNameSelection from 'frontend/components/UI/ChannelNameSelection'
import TextInputField from 'frontend/components/UI/TextInputField'
import { useTranslation } from 'react-i18next'
import styles from './index.module.scss'
import gameRequiresAccessCodes from 'frontend/helpers/gameRequiresAccessCodes'

type Props = {
  appName: string
  backdropClick: () => void
  runner: Runner
  gameInfo?: GameInfo | null
}

export default React.memo(function InstallModal({
  appName,
  backdropClick,
  runner,
  gameInfo = null
}: Props) {
  const { platform } = useContext(ContextProvider)

  const [winePrefix, setWinePrefix] = useState('...')
  const [wineVersion, setWineVersion] = useState<WineInstallation>()
  const [wineVersionList, setWineVersionList] = useState<WineInstallation[]>([])
  const [crossoverBottle, setCrossoverBottle] = useState('')
  const [accessCode, setAccessCode] = useState('')
  const [accessCodeVerified, setAccessCodeVerified] = useState(false)
  const [errorText, setErrorText] = useState('')
  const [successText, setSuccessText] = useState('')
  const { t } = useTranslation()

  const numberOfChannels =
    (gameInfo?.channels && Object.keys(gameInfo?.channels).length) ?? 0
  const initChannelName =
    gameInfo?.channels && numberOfChannels > 0
      ? Object.keys(gameInfo?.channels)[0]
      : 'main'
  const [channelNameToInstall, setChannelNameToInstall] =
    useState(initChannelName)

  const isMac = platform === 'darwin'
  const isWin = platform === 'win32'
  const isLinux = platform === 'linux'
  const isSideload = runner === 'sideload'

  const selectedChannel = gameInfo?.channels?.[channelNameToInstall]

  const channelPlatforms = selectedChannel?.release_meta.platforms ?? []
  let listingMarketplaceUrl = ''

  /*
   * This just returns the first token's marketplace url
   * TODO: return the licensing config info from /listings endpoint,
   * so we can link to the gating token's marketplace URL
   */
  if (
    gameInfo &&
    gameInfo.networks &&
    gameInfo.networks.length > 0 &&
    gameInfo.networks[0].marketplace_urls &&
    gameInfo.networks[0].marketplace_urls[0]
  ) {
    listingMarketplaceUrl = gameInfo.networks[0].marketplace_urls[0]
  }
  const hpPlatforms = Object.keys(channelPlatforms) as AppPlatforms[]
  const isHpGame = runner === 'novaplay'

  const isLinuxNative = isHpGame
    ? hpPlatforms.some((p) => getPlatformName(p) === 'Linux')
    : Boolean(gameInfo?.is_linux_native)
  const isMacNative = isHpGame
    ? hpPlatforms.some((p) => getPlatformName(p) === 'Mac')
    : Boolean(gameInfo?.is_mac_native)

  const platforms: AvailablePlatforms = [
    {
      name: 'Linux',
      available: isLinux && (isSideload || isLinuxNative),
      value: 'linux',
      icon: faLinux
    },
    {
      name: 'macOS',
      available: isMac && (isSideload || isMacNative),
      value: 'Mac',
      icon: faApple
    },
    {
      name: 'Windows',
      available: isHpGame
        ? hpPlatforms.some((p) => getPlatformName(p) === 'Windows')
        : true,
      value: 'Windows',
      icon: faWindows
    },
    {
      name: 'Browser',
      available:
        isSideload || hpPlatforms.some((p) => getPlatformName(p) === 'Browser'),
      value: 'Browser',
      icon: faChrome
    }
  ]

  const availablePlatforms: AvailablePlatforms = platforms.filter(
    (p) => p.available
  )

  const getDefaultplatform = () => {
    if (isLinux && (isSideload || isLinuxNative)) {
      return 'linux'
    }

    if (isMac && (isSideload || isMacNative)) {
      return 'Mac'
    }

    return 'Windows'
  }

  const [platformToInstall, setPlatformToInstall] = useState<InstallPlatform>(
    getDefaultplatform()
  )

  const hasWine = platformToInstall === 'Windows' && !isWin

  useEffect(() => {
    if (hasWine) {
      const getWine = async () => {
        const newWineList: WineInstallation[] =
          await window.api.getAlternativeWine()
        setWineVersionList(newWineList)
        if (wineVersion?.bin) {
          if (
            !newWineList.some(
              (newWine) => wineVersion && newWine.bin === wineVersion.bin
            )
          ) {
            setWineVersion(undefined)
          }
        }
      }
      getWine()
    }
  }, [hasWine])

  useEffect(() => {
    if (availablePlatforms.length === 1)
      setPlatformToInstall(availablePlatforms[0].value as InstallPlatform)
  }, [availablePlatforms])

  const channelRequiresAccessCode = gameInfo
    ? gameRequiresAccessCodes(gameInfo, channelNameToInstall)
    : false

  const channelRequiresToken = !!selectedChannel?.license_config.tokens

  useEffect(() => {
    async function validateAccessCode() {
      if (selectedChannel?.channel_id !== undefined) {
        const result = await window.api.checkNovaPlayAccessCode(
          selectedChannel?.license_config.id,
          accessCode
        )

        setAccessCodeVerified(result.valid)

        if (result.valid) {
          setErrorText('')
          setSuccessText(
            t(
              'novaplay.accesscodes.success.validation',
              'Success! Access code is valid'
            )
          )
        } else {
          setSuccessText('')
          setErrorText(
            t(
              'novaplay.accesscodes.error.validation',
              'Access code is invalid'
            )
          )
        }
      }
    }

    if (accessCode && channelRequiresAccessCode) validateAccessCode()
    else {
      setErrorText('')
      setSuccessText('')
      setAccessCodeVerified(false)
    }
  }, [selectedChannel, accessCode])

  const showDownloadDialog = !isSideload && gameInfo

  const disabledPlatformSelection = Boolean(runner === 'sideload' && appName)

  const enableCTAButton =
    !channelRequiresAccessCode ||
    (channelRequiresAccessCode && accessCodeVerified)

  return (
    <div className="InstallModal">
      <Dialog
        onClose={backdropClick}
        showCloseButton
        className={'InstallModal__dialog'}
      >
        {showDownloadDialog ? (
          <DownloadDialog
            appName={appName}
            runner={runner}
            winePrefix={winePrefix}
            wineVersion={wineVersion}
            availablePlatforms={availablePlatforms}
            backdropClick={backdropClick}
            platformToInstall={platformToInstall}
            gameInfo={gameInfo}
            crossoverBottle={crossoverBottle}
            channelNameToInstall={channelNameToInstall}
            channelId={selectedChannel?.channel_id}
            accessCode={accessCode}
            enableCTAButton={enableCTAButton}
            requiresToken={channelRequiresToken}
            marketplaceUrl={listingMarketplaceUrl}
          >
            <PlatformSelection
              disabled={disabledPlatformSelection}
              availablePlatforms={availablePlatforms}
              platformToInstall={platformToInstall}
              setPlatformToInstall={setPlatformToInstall}
            />
            {runner === 'novaplay' && numberOfChannels > 1 ? (
              <ChannelNameSelection
                channelNameToInstall={channelNameToInstall}
                setChannelNameToInstall={setChannelNameToInstall}
                gameInfo={gameInfo}
              />
            ) : null}
            {runner === 'novaplay' && channelRequiresAccessCode ? (
              <TextInputField
                placeholder={'Enter access code'}
                value={accessCode}
                onChange={(ev) => setAccessCode(ev.target.value)}
                htmlId="access_code_input"
                isError={!!errorText}
              ></TextInputField>
            ) : null}
            {errorText && (
              <div className={`caption ${styles.errorText}`}>{errorText}</div>
            )}
            {successText && (
              <div className={`caption ${styles.successText}`}>
                {successText}
              </div>
            )}
            {hasWine ? (
              <WineSelector
                winePrefix={winePrefix}
                wineVersion={wineVersion}
                wineVersionList={wineVersionList}
                title={gameInfo?.title}
                setWinePrefix={setWinePrefix}
                setWineVersion={setWineVersion}
                crossoverBottle={crossoverBottle}
                setCrossoverBottle={setCrossoverBottle}
              />
            ) : null}
          </DownloadDialog>
        ) : (
          <SideloadDialog
            setWinePrefix={setWinePrefix}
            winePrefix={winePrefix}
            wineVersion={wineVersion}
            availablePlatforms={availablePlatforms}
            backdropClick={backdropClick}
            platformToInstall={platformToInstall}
            appName={appName}
            crossoverBottle={crossoverBottle}
          >
            <PlatformSelection
              disabled={disabledPlatformSelection}
              availablePlatforms={availablePlatforms}
              platformToInstall={platformToInstall}
              setPlatformToInstall={setPlatformToInstall}
            />
            {hasWine ? (
              <WineSelector
                winePrefix={winePrefix}
                wineVersion={wineVersion}
                wineVersionList={wineVersionList}
                setWinePrefix={setWinePrefix}
                setWineVersion={setWineVersion}
                crossoverBottle={crossoverBottle}
                setCrossoverBottle={setCrossoverBottle}
              />
            ) : null}
          </SideloadDialog>
        )}
      </Dialog>
    </div>
  )
})
