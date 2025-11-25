import { fileURLToPath } from 'url'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

class PageController {
    static async paginaProduto(req,res) {
     res.sendFile(path.join(__dirname, '../views/produtos.html'))
    }
}

export default PageController