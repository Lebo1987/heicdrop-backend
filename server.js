// server.js
import express from 'express'
import multer from 'multer'
import fs from 'fs'
import path from 'path'
import cors from 'cors'
import { exec } from 'child_process'

const app = express()
const PORT = 4000

app.use(cors())
app.use(express.static('output'))

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname)
  },
})
const upload = multer({ storage })

if (!fs.existsSync('./uploads')) fs.mkdirSync('./uploads')
if (!fs.existsSync('./output')) fs.mkdirSync('./output')

app.post('/convert', upload.single('file'), async (req, res) => {
  const inputPath = req.file.path
  const outputFilename = path.basename(req.file.originalname, path.extname(req.file.originalname)) + '.jpg'
  const outputPath = path.join('output', outputFilename)

  const command = `convert "${inputPath}" "${outputPath}"`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error('❌ ImageMagick Error:', error)
      return res.status(500).send('Conversion failed.')
    }

    fs.unlinkSync(inputPath)

    res.setHeader('Content-Disposition', `attachment; filename="${outputFilename}"`)
    res.setHeader('Content-Type', 'image/jpeg')
    const readStream = fs.createReadStream(outputPath)
    readStream.pipe(res)
    readStream.on('close', () => fs.unlinkSync(outputPath))
  })
})

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`)
})

