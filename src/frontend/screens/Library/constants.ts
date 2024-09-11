import { Category } from 'frontend/types'
import { TFunction } from 'i18next'

export function getLibraryTitle(
  category: Category,
  t: TFunction<'translation'>
) {
  switch (category) {
    case 'all':
      return t('title.allGames', 'All Games')
    case 'legendary':
      return t('Epic Games', 'Epic Games')
    case 'gog':
      return t('GOG', 'GOG')
    case 'novaplay':
      return 'NovaPlay'
    default:
      return t('Other', 'Other')
  }
}

export function translateChannelName(
  channelNameEnglish: string,
  t: TFunction<'translation'>
) {
  switch (channelNameEnglish) {
    case 'demo':
      return t('gameRelease.demo', 'Demo')
    case 'prototype':
      return t('gameRelease.prototype', 'Prototype')
    case 'alpha':
      return t('gameRelease.alpha', 'Alpha')
    case 'beta':
      return t('gameRelease.beta', 'Beta')
    case 'main':
      return t('gameRelease.main', 'Main')
    default:
      return channelNameEnglish
  }
}

export function getMessage(
  t: TFunction<'translation'>,
  status:
    | 'extracting'
    | 'paused'
    | 'installing'
    | 'installed'
    | 'distributables'
): string | undefined {
  switch (status) {
    case 'distributables':
      return t(
        'novaplay.gamecard.distributables',
        'Installing Distributables...'
      )
    case 'extracting':
      return t('novaplay.gamecard.extracting', 'Extracting...')
    case 'paused':
      return t('novaplay.gamecard.paused', 'Paused')
    case 'installing':
      return t('novaplay.gamecard.installing', 'Downloading...')
    case 'installed':
      return t('novaplay.gamecard.installed', 'Ready to play')
  }
}
