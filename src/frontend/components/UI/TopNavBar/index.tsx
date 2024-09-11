import React, { useContext, useEffect, useState } from 'react'
import styles from './index.module.scss'
import { NovaPlayLogoWhite } from 'frontend/assets/novaplay'
import { Button, Images } from '@novaplay/ui'
import SearchBar from '../SearchBar'
import AccountDropdown from '../AccountDropdown'
import extensionStore from 'frontend/state/ExtensionState'
import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import ContextProvider from 'frontend/state/ContextProvider'
import { NavLink, useLocation } from 'react-router-dom'
import {
  EPIC_STORE_URL,
  GOG_STORE_URL,
  HYPERPLAY_STORE_URL
} from 'frontend/constants'
import webviewNavigationStore from 'frontend/store/WebviewNavigationStore'
import { extractMainDomain } from '../../../helpers/extract-main-domain'

const TopNavBar = observer(() => {
  const { t } = useTranslation()

  const { showMetaMaskBrowserSidebarLinks } = useContext(ContextProvider)
  const [badgeText, setBadgeText] = useState('0')
  const { pathname } = useLocation()

  /* eslint-disable-next-line  @typescript-eslint/no-explicit-any */
  function setBadgeString(err: any, text: string) {
    setBadgeText(text)
  }

  useEffect(() => {
    const removeHandleSetBadgeText =
      window.api.handleSetBadgeTextInRenderer(setBadgeString)

    return () => {
      removeHandleSetBadgeText()
    }
  }, [])

  function getStoreTextStyle(viewURL: string) {
    const { currentUrl } = webviewNavigationStore
    const inactiveStyle = { color: 'var(--color-neutral-400)' }
    const activeStyle = { color: '' }
    // initial value of currentUrl is ''
    if (!currentUrl) return inactiveStyle
    const viewURLMainDomain = extractMainDomain(viewURL)
    const currentURLMainDomain = extractMainDomain(currentUrl)
    const isActive = viewURLMainDomain === currentURLMainDomain
    return isActive ? activeStyle : inactiveStyle
  }

  return (
    <div className={styles.navBar}>
      <div>
        <NovaPlayLogoWhite
          height="27px"
          width="27px"
          className={styles.hpLogo}
        />
        <Images.NovaPlayTextLogo
          fill="var(--color-neutral-100)"
          className={styles.hpTextLogo}
        />
        <div className={styles.alphaBadge}>
          <div className={`caption ${styles.alphaCaption}`}>
            {t(`novaplay.publicAlpha`, `Public Alpha`)}
          </div>
        </div>
        <>
          <NavLink to="/novaplaystore">
            <Button
              type="link"
              size="small"
              style={getStoreTextStyle(HYPERPLAY_STORE_URL)}
            >
              NovaPlay
            </Button>
          </NavLink>
          <NavLink to="/epicstore">
            <Button
              type="link"
              size="small"
              style={getStoreTextStyle(EPIC_STORE_URL)}
            >
              {t('Epic Games', 'Epic Games')}
            </Button>
          </NavLink>
          <NavLink to="/gogstore">
            <Button
              type="link"
              size="small"
              style={getStoreTextStyle(GOG_STORE_URL)}
            >
              {t('GOG', 'GOG')}
            </Button>
          </NavLink>
        </>
      </div>
      <div>
        {pathname === '/library' ? <SearchBar /> : null}
        {showMetaMaskBrowserSidebarLinks && (
          <button
            className={styles.iconButton}
            onClick={() => extensionStore.toggleIsPopupOpen()}
            onMouseEnter={() => extensionStore.lockPopup()}
            onMouseLeave={() => extensionStore.unlockPopup()}
          >
            <Images.MetaMask fill="white" />
            {badgeText !== '' && badgeText !== '0' ? (
              <div className={styles.badge}>{badgeText}</div>
            ) : null}
          </button>
        )}
        <AccountDropdown />
      </div>
    </div>
  )
})

export default TopNavBar
