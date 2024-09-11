import * as HpStoreUtils from '../utils'
import { GameInfo, NovaPlayRelease } from '../../../../common/types'
jest.mock('electron')
jest.mock('../../../logger/logger')
jest.mock('../../../logger/logfile')

const TESTS_ENABLED = false
const testIf = (condition: boolean) => (condition ? test : test.skip)

describe('backend/storeManagers/novaplay/utils.ts', () => {
  testIf(!TESTS_ENABLED)('should do nothing', function () {
    console.log('novaplay utils tests skipped')
  })

  testIf(TESTS_ENABLED)(
    'getGameInfoFromHpRelease and getNovaPlayStoreRelease should not throw for every game',
    async () => {
      // cast so that we get types in this file
      const releaseMap = (await HpStoreUtils.getNovaPlayReleaseMap()) as Map<
        string,
        NovaPlayRelease
      >
      for (const [projectId, release] of releaseMap.entries()) {
        // just testing if it throws, can add zod type checking for validation as well in the future
        const gameInfo_i = HpStoreUtils.getGameInfoFromHpRelease(
          release
        ) as GameInfo

        if (gameInfo_i.channels === undefined) throw 'channels undefined'
        expect(Object.keys(gameInfo_i.channels).length).toBeGreaterThan(0)

        //check that browser only games with one channel are installed on add to library
        const platforms = release.channels[0].release_meta.platforms
        const platformKeys = Object.keys(platforms)
        if (
          release.channels.length === 1 &&
          platformKeys.length === 1 &&
          platformKeys[0] === 'web'
        ) {
          expect(gameInfo_i.is_installed).toBe(true)
          expect(gameInfo_i.install.platform).toBe('web')
          expect(gameInfo_i.install.channelName).toBe(
            release.channels[0].channel_name
          )
          expect(gameInfo_i.browserUrl).toBe(platforms['web']?.external_url)
        }

        // check that individual listing endpoint doesn't throw and matches the bulk listings endpoint data
        /* eslint-disable-next-line */
        const individualRelease = await HpStoreUtils.getNovaPlayStoreRelease(
          projectId
        )
        expect(release).toEqual(individualRelease)
      }
    },
    30000
  )

  testIf(TESTS_ENABLED)(
    'loadEpicNovaPlayGameInfoMap should not throw',
    async () => {
      await HpStoreUtils.loadEpicNovaPlayGameInfoMap()
    }
  )
})
