import { TRANSACTION_STATE } from 'frontend/store/types'
import { t } from 'i18next'

type ModalText = Record<string, Record<TRANSACTION_STATE, () => string>>

const signatureRequestTexts = {
  [TRANSACTION_STATE.INITIATED]: () =>
    t(
      'novaplayOverlay.signatureRequest.INITIATED',
      'Signature request pending'
    ),
  [TRANSACTION_STATE.PENDING]: () => '',
  [TRANSACTION_STATE.FAILED]: () =>
    t('novaplayOverlay.signatureRequest.FAILED', 'Signature interrupted'),
  [TRANSACTION_STATE.CONFIRMED]: () =>
    t('novaplayOverlay.signatureRequest.CONFIRMED', 'Signature submitted')
}

const txnRequestTexts = {
  [TRANSACTION_STATE.INITIATED]: () =>
    t('novaplayOverlay.txnRequest.INITIATED', 'Transaction request pending'),
  [TRANSACTION_STATE.PENDING]: () =>
    t('novaplayOverlay.txnRequest.PENDING', 'Transaction submitted'),
  [TRANSACTION_STATE.FAILED]: () =>
    t('novaplayOverlay.txnRequest.FAILED', 'Transaction interrupted'),
  [TRANSACTION_STATE.CONFIRMED]: () =>
    t('novaplayOverlay.txnRequest.CONFIRMED', 'Transaction confirmed')
}

const chainTexts = {
  [TRANSACTION_STATE.INITIATED]: () =>
    t('novaplayOverlay.chainRequest.INITIATED', 'Custom network request'),
  [TRANSACTION_STATE.PENDING]: () => '',
  [TRANSACTION_STATE.FAILED]: () =>
    t('novaplayOverlay.chainRequest.FAILED', 'Custom network canceled'),
  [TRANSACTION_STATE.CONFIRMED]: () =>
    t('novaplayOverlay.chainRequest.CONFIRMED', 'Custom network added')
}

const walletWatchTexts = {
  [TRANSACTION_STATE.INITIATED]: () =>
    t(
      'novaplayOverlay.walletWatch.INITIATED',
      'Add custom token request pending'
    ),
  [TRANSACTION_STATE.PENDING]: () => '',
  [TRANSACTION_STATE.FAILED]: () =>
    t('novaplayOverlay.walletWatch.FAILED', 'Custom token request canceled'),
  [TRANSACTION_STATE.CONFIRMED]: () =>
    t('novaplayOverlay.walletWatch.CONFIRMED', 'Custom token added')
}

export const TITLE: ModalText = {
  default: txnRequestTexts,
  eth_sendTransaction: txnRequestTexts,
  eth_sendRawTransaction: txnRequestTexts,
  eth_signTransaction: signatureRequestTexts,
  eth_signTypedData_v1: signatureRequestTexts,
  eth_signTypedData_v3: signatureRequestTexts,
  eth_signTypedData_v4: signatureRequestTexts,
  eth_personalSign: signatureRequestTexts,
  wallet_watchAsset: walletWatchTexts,
  wallet_addEthereumChain: chainTexts,
  wallet_switchEthereumChain: chainTexts
}

export const DESCRIPTION: Record<TRANSACTION_STATE, () => string> = {
  [TRANSACTION_STATE.INITIATED]: () =>
    t(
      'novaplayOverlay.description.INITIATED',
      'A wallet confirmation is pending in your mobile wallet'
    ),
  [TRANSACTION_STATE.PENDING]: () =>
    t(
      'novaplayOverlay.description.PENDING',
      "Waiting for blockchain confirmation. We'll let you know when it's confirmed"
    ),
  [TRANSACTION_STATE.FAILED]: () =>
    t(
      'novaplayOverlay.description.FAILED',
      'The transaction was canceled or not submitted, please try again'
    ),
  [TRANSACTION_STATE.CONFIRMED]: () =>
    t(
      'novaplayOverlay.description.CONFIRMED',
      'The transaction was successfully confirmed!'
    )
}

// todo: import from novaplay/ui package
export type statusType =
  | 'pending'
  | 'submitted'
  | 'error'
  | 'alert'
  | 'success'
  | 'error'

type TxnStateToStatusMapType = {
  [key in TRANSACTION_STATE]: statusType
}
export const TxnStateToStatusMap: TxnStateToStatusMapType = {
  initiated: 'pending',
  pending: 'submitted',
  confirmed: 'success',
  failed: 'error'
}

interface NOTIFICATION_TYPE {
  TITLE: () => string
  DESCRIPTION: (isMac: boolean) => string
  STATUS: statusType
}

export const EXTENSION_NOTIFICATION: NOTIFICATION_TYPE = {
  TITLE: () =>
    t('novaplayOverlay.extensionNotification.TITLE', 'Transaction requested'),
  DESCRIPTION: (isMac: boolean) => {
    return t('novaplayOverlay.extensionNotification.DESCRIPTION', {
      defaultValue: 'Press {{overlayKeyMod}} + X to see this transaction',
      overlayKeyMod: isMac ? 'Option' : 'Alt'
    })
  },
  STATUS: 'pending'
}

export const INITIAL_TOAST: NOTIFICATION_TYPE = {
  TITLE: () => t('novaplayOverlay.greeting.title', 'NovaPlay Overlay'),
  DESCRIPTION: (isMac: boolean) => {
    return t('novaplayOverlay.greeting.description', {
      defaultValue:
        'NovaPlay Overlay is ready! Press {{overlayKeyMod}} + X to show or hide it.',
      overlayKeyMod: isMac ? 'Option' : 'Alt'
    })
  },
  STATUS: 'success'
}
