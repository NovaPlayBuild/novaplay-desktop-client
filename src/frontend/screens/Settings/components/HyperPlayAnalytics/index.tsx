import { Button } from '@novaplay/ui'
import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import AnalyticsStyles from './index.module.scss'
import classNames from 'classnames'
import { MetricsOptInStatus } from 'common/types'
import ContextProvider from 'frontend/state/ContextProvider'

const NovaPlayAnalytics = () => {
  const { t } = useTranslation()

  const { metricsOptInStatus } = useContext(ContextProvider)

  const analyticsOn = metricsOptInStatus === MetricsOptInStatus.optedIn

  function toggleAnalytics() {
    const newOptInStatus =
      metricsOptInStatus === MetricsOptInStatus.optedIn
        ? MetricsOptInStatus.optedOut
        : MetricsOptInStatus.optedIn
    window.api.changeMetricsOptInStatus(newOptInStatus)
  }

  return (
    <div style={{ textAlign: 'left' }}>
      <div className={classNames('eyebrow', AnalyticsStyles.title)}>
        {t('analytics', 'Analytics')}
      </div>
      <div className="body">
        {t(
          'novaplay.onboarding.analytics.body',
          `NovaPlay would like to gather usage data to better understand how our users interact with the application. This information helps us understand how you use the app and lets us make NovaPlay even better for you.`
        )}
      </div>
      <div className={classNames('body', AnalyticsStyles.status)}>
        {analyticsOn
          ? t('novaplay.analyticsOn', `Analytics is turned on`)
          : t('novaplay.analyticsOff', `Analytics is turned off`)}
      </div>
      <Button type="tertiary" onClick={toggleAnalytics}>
        {analyticsOn
          ? t('novaplay.turnAnalyticsOff', `Turn off`)
          : t('novaplay.turnAnalyticsOn', `Turn on`)}
      </Button>
    </div>
  )
}

export default NovaPlayAnalytics
