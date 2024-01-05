import { readdir, stat } from 'node:fs/promises'
import sharp from 'sharp'
import path from 'node:path'

const extensions = new Set(['jpg', 'jpeg', 'png'])

const isImage = (filePath) => {
    return extensions.has(path.extname(filePath).substring(1).toLowerCase())
}

async function compressImages(destinationDirectory = '') {
    try {
        const files = await readdir('./')
        for (const [index, file] of files.entries()) {
            if (isImage(file)) {
                const newFileName = path.join(destinationDirectory, `compressed_${index + 1}.jpeg`)
                sharp(file)
                  .jpeg({ quality: 1 })
                  .withMetadata()
                  .toFile(newFileName, (err) => {
                      if (err) {
                          console.log('Error compressing image:', err)
                      } else {
                          console.log(`Image ${file} compressed successfully to ${newFileName}`)
                      }
                  })
            } else {
                console.log(`${file} is not a valid image and will not be compressed.`)
            }
        }   
    } catch (err) {
        console.error('Error reading current directory:', err)
    } 
}

async function getDestinationDirectory() {
    const argLength = process.argv.length
    if (argLength === 3) {
        const destinationDirectory = process.argv[2]
        try {
            const fileStats = await stat(destinationDirectory)
            if (fileStats.isDirectory()) {
                return destinationDirectory
            } else {
                console.error('Destination directory is not valid, compressing in the current directory instead')
            }
        } catch (err) {
            console.error('Error reading destination directory:', err)
        }
    }
    return ''
}

(async () => {
    await compressImages(await getDestinationDirectory())
})()