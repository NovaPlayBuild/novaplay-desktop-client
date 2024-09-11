const { default: axios } = require('axios')
const fs = require('fs')
const package = require('../package.json')
const child_process = require('child_process')
const os = require('os')
const crypto = require('crypto')

if (require.main === module) {
    main();
}

async function main() {
    let placeholder = ""
    let releaseTime = ""
    if (process.argv[2] === "release") {
        const { data } = await axios.get("https://api.github.com/repos/NovaPlay-Gaming/novaplay-desktop-client/releases/latest")
        const tarxz = data.assets.find((asset) => asset.browser_download_url.includes("tar.xz"))
        const outputFile = `${os.tmpdir()}/novaplay.tar.xz`
        child_process.spawnSync("curl", ["-L", tarxz.browser_download_url, "-o", outputFile, "--create-dirs"])
        const outputContent = fs.readFileSync(outputFile)
        const hashSum = crypto.createHash('sha512');
        hashSum.update(outputContent);
        const sha512 = hashSum.digest('hex');
        fs.rmSync(outputFile)

        placeholder = [
            "type: file",
            `url: ${tarxz.browser_download_url}`,
            `sha512: ${sha512}`
        ].join("\n        ")
        releaseTime = data.published_at.split('T')[0]
    } else {
        placeholder = [
            "type: file",
            `path: "../dist/novaplay-${package.version}.tar.xz"`
        ].join("\n        ")
        releaseTime = new Date().toISOString().split('T')[0]
    }

    // generate flatpak-build
    if (!fs.existsSync("./flatpak-build")) {
        fs.mkdirSync('./flatpak-build', { recursive: true })
    }

    // generate manifest
    let templateManifest = fs.readFileSync(`./flatpak/templates/xyz.novaplay.NovaPlay.yml.template`, { encoding: 'utf-8' })
    templateManifest = templateManifest.replace("${novaplay-tarxz}", placeholder)
    fs.writeFileSync("./flatpak-build/xyz.novaplay.NovaPlay.yml", templateManifest)

    // generate metainfo
    let templateMetaInfo = fs.readFileSync(`./flatpak/templates/xyz.novaplay.NovaPlay.metainfo.xml.template`, { encoding: 'utf-8' })
    templateMetaInfo = templateMetaInfo.replace("${novaplay-version}", `v${package.version}`).replace("${novaplay-release-date}", releaseTime)
    fs.writeFileSync("./flatpak-build/xyz.novaplay.NovaPlay.metainfo.xml", templateMetaInfo)

    // copy extra files
    fs.copyFileSync("./flatpak/xyz.novaplay.NovaPlay.desktop", "./flatpak-build/xyz.novaplay.NovaPlay.desktop")
    fs.copyFileSync("./flatpak/xyz.novaplay.NovaPlay.png", "./flatpak-build/xyz.novaplay.NovaPlay.png")
    fs.copyFileSync("./flatpak/flathub.json", "./flatpak-build/flathub.json")
    fs.cpSync("./flatpak/patches", "./flatpak-build/patches", { recursive: true })
}
