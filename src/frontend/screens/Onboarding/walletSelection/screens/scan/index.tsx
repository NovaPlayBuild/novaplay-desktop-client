import React from 'react'
import { t } from 'i18next'
import QrCodeGradientBorder from '../../../components/qrCodeGradientBorder'
import ScanScreenStyles from './index.module.scss'
import { WarningIcon } from 'frontend/assets/novaplay'
import { Button } from '@novaplay/ui'
import walletStore from 'frontend/state/WalletState'
import { observer } from 'mobx-react-lite'

interface ScanScreenProps {
  qrCodeSvg: string
  providerName: string
}

const ScanScreen = (props: ScanScreenProps) => {
  const blob = new Blob([props.qrCodeSvg], { type: 'image/svg+xml' })
  const url = URL.createObjectURL(blob)
  const oneTimePasscode = walletStore.otp

  return (
    <>
      <div className={`title ${ScanScreenStyles.title}`}>
        {t(
          'novaplay.onboarding.walletSelection.screens.scan.title',
          `Scan QR with `
        )}
        {props.providerName}
      </div>
      <div className={`body ${ScanScreenStyles.caption}`}>
        {t(
          'novaplay.onboarding.walletSelection.screens.scan.details',
          `Create an encrypted communication channel. Your keys will never be shared with NovaPlay.`
        )}
      </div>
      <QrCodeGradientBorder qrUrl={url} imageMargin="-14px" />
      <div className={`body-sm ${ScanScreenStyles.getWalletText}`}>
        {t(
          'novaplay.onboarding.walletSelection.screens.scan.dontHaveWallet',
          `Don’t have a wallet?`
        )}{' '}
        <a
          onClick={() =>
            window.api.openExternalUrl('https://metamask.io/download/')
          }
          className="button-sm"
        >
          {t(
            'novaplay.onboarding.walletSelection.screens.scan.getMetamask',
            `Get MetaMask`
          )}
        </a>
      </div>
      {!props.providerName.toLowerCase().includes('metamask') ? (
        <Button
          size="small"
          type="secondary"
          style={{ width: '200px', margin: '0px auto var(--space-xs) auto' }}
          onClick={() => window.api.copyWalletConnectBaseURIToClipboard()}
        >
          {t('novaplay.copyUrl', 'Copy URL')}
        </Button>
      ) : null}

      {props.providerName.toLowerCase().includes('metamask') &&
      oneTimePasscode !== '' ? (
        <div className={`body-sm  ${ScanScreenStyles.otp}`}>
          {t('novaplay.otp', 'One Time Passcode')}: {oneTimePasscode}
        </div>
      ) : null}
      <div className={`body-sm ${ScanScreenStyles.walletWarning}`}>
        <WarningIcon height={15} fill={'var(--color-status-alert)'} />
        <div>
          {t(
            'novaplay.onboarding.walletSelection.screens.scan.updateWarning',
            'Having issues? Make sure MetaMask is up to date.'
          )}
        </div>
      </div>
    </>
  )
}

export default observer(ScanScreen)
