import { getNovaPlayNameToReleaseMap } from 'backend/storeManagers/novaplay/utils'
import { GameInfo } from 'common/types'

export async function gameIsEpicForwarderOnNovaPlay(gameInfo: GameInfo) {
  const gameNameMap = await getNovaPlayNameToReleaseMap()
  let hyperPlayListing = undefined
  const gameInfoTitle = gameInfo.title.toLowerCase()
  const gameIsEpicForwarderOnHP =
    gameInfo.runner === 'legendary' && gameNameMap.has(gameInfoTitle)
  if (gameIsEpicForwarderOnHP) {
    hyperPlayListing = gameNameMap.get(gameInfoTitle)
  }
  return { hyperPlayListing, gameIsEpicForwarderOnHP }
}

export async function launchingGameShouldOpenOverlay(gameInfo?: GameInfo) {
  if (!gameInfo) {
    return { shouldOpenOverlay: false }
  }
  const { hyperPlayListing, gameIsEpicForwarderOnHP } =
    await gameIsEpicForwarderOnNovaPlay(gameInfo)
  const gameIsDirectOnNovaPlay = gameInfo.runner === 'novaplay'
  const gameIsSideloadedWithWeb3 =
    gameInfo.runner === 'sideload' && !!gameInfo.web3?.supported
  return {
    shouldOpenOverlay:
      gameIsDirectOnNovaPlay ||
      gameIsSideloadedWithWeb3 ||
      gameIsEpicForwarderOnHP,
    hyperPlayListing
  }
}
