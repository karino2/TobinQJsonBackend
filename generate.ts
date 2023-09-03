import * as fs from 'fs/promises'
import * as path from 'path'
import * as encoder from 'html-entities'

interface Entry {
  _docId: string,
  title: string,
  _description: string,
  graphId: string,
  _script: string,
  _updatedAt: number
 };

const rootUrl = "https://karino2.github.io/TobinQJsonBackend"

const ensureDir = async (dir:string) => {
  try {
      await fs.access( dir, fs.constants.R_OK | fs.constants.W_OK )
  }
  catch(error) {
      await fs.mkdir( dir, { recursive: true } )
  }
}

const toHtmlPage = async(entry: Entry) => {
  let content = encoder.encode(entry._description)
  let contentHtml = content.replaceAll("\n", "<br>")
  let title = encoder.encode(entry.title)
  let relativeImgUrl = `imgs/${entry.graphId}.png`
  let imgUrl = `${rootUrl}/${relativeImgUrl}`

  return `<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
  <html>
  <head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  
  
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@karino2012" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${content}" />
  <meta name="twitter:image" content="${imgUrl}" />
  <meta property="og:title" content="${title}" />
  <meta property="og:type" content="article" />
  <meta property="og:image" content="${imgUrl}" />
  <meta property="og:description" content="${content}" />
  <title>${title} at 統計グラフ!</title>
  
  <style type="text/css">
  img.chartImgClass {
    float: left;
    margin-right: 2em;
    margin-bottom: 1em;
    width: 400px;
    height: 400px;
  }
  div.footer {
    float: left;
  }
  </style>
  
  </head>
  
  <body>
  <h1>${title}</h1>
  <hr>
  
  <img class="chartImgClass" id="chartImg" src="../${relativeImgUrl}">
  <div id="descriptionDiv">
${contentHtml}
  </div>
  
  <div class="footer">
  <hr>
  <ul>
  <li><a href="../index.html">このサイトについて</a>
  <li>「スマホに統計のグラフが降ってくる！」は下のバナーから<br><a href='https://play.google.com/store/apps/details?id=com.livejournal.karino2.tobinq.app&utm_source=global_co&utm_medium=prtnr&utm_content=Mar2515&utm_campaign=PartBadge&pcampaignid=MKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1'><img alt='Get it on Google Play' src='https://play.google.com/intl/en_us/badges/images/generic/en_badge_web_generic.png' height="80"/></a>
  </ul>
  </div>
  </body>
  
  </html>
`
}

const generatePage = async(entry: Entry) => {
  // path.join("pages", entry._docId)
  await ensureDir("pages")
  let fpath = path.join("pages", `${entry._docId}.html`)
  let html = await toHtmlPage(entry)
  await fs.writeFile(fpath, html)
}

(async ()=>{  
  const jsonStr = await fs.readFile("scripts.json")
  let json : Entry[] = JSON.parse(jsonStr.toString())

  for(const entry of json){
    generatePage(entry)
  }

  /*
  console.log(json.length)
  console.log(json[0]._updatedAt)
  json[0]._updatedAt = (new Date()).getTime()

  console.log(encoder.encode(json[0]._description).replaceAll("\n", "<br>"))


  const dirs = await fs.readdir("./")
  console.log(dirs.length)
  for(const dir of dirs){
    console.log(dir)
  }
  */
})()
