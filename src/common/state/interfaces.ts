import { OverlayRenderState } from 'common/types'
import { Toast } from 'frontend/store/types'

export interface ExtensionStateInterface {
  isPopupOpen: boolean
  isNotificationOpen: boolean
}

export interface TransactionStateInterface {
  isInitialToastShown: boolean
  latestToast: Toast | null
}

export type OverlayMode =
  | 'NovaPlay Extension'
  | 'NovaPlay Exit Game'
  | 'NovaPlay Toasts'
  | 'NovaPlay Hint Text'
  | 'NovaPlay Browser Game'
  | 'NovaPlay Extension Overlay'
  | 'NovaPlay Web Game'

export interface OverlayStateInterface {
  renderState: OverlayRenderState
  showOverlay: boolean | null
  isFullscreenOverlay: boolean
  title: OverlayMode | null
}
