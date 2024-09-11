import React, { useContext, useRef } from 'react'
import ExtensionManagerStyles from './index.module.scss'
import { observer } from 'mobx-react-lite'
import extensionState from 'frontend/state/ExtensionState'
import OverlayState from 'frontend/state/OverlayState'
import ContextProvider from 'frontend/state/ContextProvider'
import ExtensionContents from './components/ExtensionContents'

const ExtensionManager = function () {
  const rootRef = useRef<HTMLDialogElement | null>(null)
  const { connectivity } = useContext(ContextProvider)
  const isOffline = connectivity.status !== 'online'

  const mmContainerStyle = {} as React.CSSProperties

  const isOverlay =
    OverlayState.title === 'NovaPlay Extension Overlay' ||
    OverlayState.title === 'NovaPlay Browser Game' ||
    OverlayState.title === 'NovaPlay Web Game'

  if (OverlayState.title === 'NovaPlay Extension') {
    mmContainerStyle.left = 0
    mmContainerStyle.right = 'unset'
    mmContainerStyle.top = 0
  } else if (isOverlay) {
    mmContainerStyle.left = 20
    mmContainerStyle.right = 'unset'
    mmContainerStyle.top = 20
  } else if (isOffline) {
    mmContainerStyle.top = 115
  }
  if (extensionState.isPopupOpen || extensionState.isNotificationOpen) {
    rootRef.current?.showModal()
  } else {
    rootRef.current?.close()
  }
  if (extensionState.isPopupOpen || extensionState.isNotificationOpen) {
    rootRef.current?.showModal()
  } else {
    rootRef.current?.close()
  }

  if (isOverlay) {
    return (
      <div
        className={ExtensionManagerStyles.mmContainer}
        style={mmContainerStyle}
      >
        <ExtensionContents />
      </div>
    )
  }

  /* eslint-disable react/no-unknown-property */
  return (
    <dialog
      className={ExtensionManagerStyles.mmContainer}
      ref={rootRef}
      style={mmContainerStyle}
    >
      <ExtensionContents />
    </dialog>
  )
}

export default observer(ExtensionManager)
