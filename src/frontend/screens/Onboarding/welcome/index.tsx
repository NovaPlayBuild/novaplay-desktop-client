import React from 'react'
import { ONBOARDING_SCREEN } from '../types'
import { t } from 'i18next'
import { Button, Images } from '@novaplay/ui'
import { LanguageSelector } from 'frontend/components/UI'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { FlagPosition } from 'frontend/components/UI/LanguageSelector'
import { onboardingStore } from 'frontend/helpers/electronStores'
import WelcomeStyles from './index.module.scss'
import OnboardingStyles from '../index.module.scss'

interface WelcomeProps {
  setScreen: React.Dispatch<React.SetStateAction<ONBOARDING_SCREEN>>
}

const Welcome: React.FC<WelcomeProps> = function (props) {
  return (
    <>
      <Images.NovaPlayLogoColored className={OnboardingStyles.hpLogo} />
      <h5>
        {t(
          'novaplay.onboarding.welcome.title',
          'Welcome to NovaPlay Early Access!'
        )}
      </h5>
      <div className={`body ${WelcomeStyles.welcomeBodyTextContainer}`}>
        <div className={WelcomeStyles.boldText}>
          {t(
            'novaplay.onboarding.welcome.text.construction',
            `NovaPlay is under construction.`
          )}
        </div>
        <div>
          {t(
            'novaplay.onboarding.welcome.text.description',
            `NovaPlay is a game launcher and game store aggregator from the
          future. With NovaPlay, you can carry your wallet, tokens, and assets
          into every game. NovaPlay supports the entire library of the Epic
          Store, GOG, and our own NovaPlay store. By using NovaPlay, you agree
          to our`
          )}{' '}
          <a
            onClick={() =>
              window.api.openExternalUrl(
                `https://www.novaplay.xyz/terms-of-service`
              )
            }
          >
            {t('novaplay.onboarding.terms', `Terms of Service.`)}
          </a>
        </div>
        <div>
          {t(
            'novaplay.onboarding.welcome.text.bugs',
            `Please note that NovaPlay is a public alpha. Many features are still
          in development, and there will be bugs.`
          )}
        </div>
        <div>
          {t(
            'novaplay.onboarding.welcome.text.communityCTA_1',
            `We'd love your feedback and to have you join us in our`
          )}{' '}
          <a
            onClick={() =>
              window.api.openExternalUrl(`https://discord.gg/novaplay`)
            }
          >
            {t('novaplay.discordApp', `Discord`)}
          </a>{' '}
          {t(
            'novaplay.onboarding.welcome.text.communityCTA_2',
            `community. Together, let's shape the future of gaming!`
          )}
        </div>
      </div>
      <div className={WelcomeStyles.languageSelector}>
        <LanguageSelector flagPossition={FlagPosition.PREPEND} />
      </div>
      <div className={WelcomeStyles.actionButton}>
        <Button
          onClick={() => {
            onboardingStore.set('completedEarlyAccess', true)
            props.setScreen(ONBOARDING_SCREEN.ANALYTICS)
          }}
        >
          {t('button.continue', 'Continue')}{' '}
          <FontAwesomeIcon
            icon={faArrowRight}
            className={WelcomeStyles.actionButtonArrow}
          />
        </Button>
      </div>
    </>
  )
}

export default Welcome
