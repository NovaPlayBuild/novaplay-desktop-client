import { TFunction } from 'i18next'

export function getAchievementNavTranslations(t: TFunction) {
  return {
    addThisGameText: t('novaplay.achievements.addThisGame', 'Add this game'),
    gamesToMintLabelText: t(
      'novaplay.achievements.gamesToMint',
      'Games to mint'
    ),
    freeMintsLabel: t('novaplay.achievements.freeMints', 'Free Mints')
  }
}
