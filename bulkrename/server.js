import { readdir, rename, stat } from 'node:fs/promises'
import path from 'node:path'

const directoryPath = './files'
const prefix = 'test'

async function bulkRename(directoryPath, prefix) {
    try {
        const files = await readdir(directoryPath)
        for (const [index, file] of files.entries()) {
            const oldFilePath = path.join(directoryPath, file)

            const fileStats = await stat(oldFilePath)

            if (fileStats.isFile()) {
                const newFileName = `${prefix}_${index + 1}${path.extname(file)}`
                const newFilePath = path.join(directoryPath, newFileName)
      
                await rename(oldFilePath, newFilePath)
                console.log(`Renamed ${file} to ${newFileName}`)
            } else {
                console.log(`${file} is a directory and will not be renamed.`)
            }
        }
    } catch (err) {
        console.error('Error reading directory:', err)
    }  
}

(async () => {
    await bulkRename(directoryPath, prefix)
})()