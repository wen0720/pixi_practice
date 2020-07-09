import * as PIXI from 'pixi.js'

let type = 'WebGL'
if (!PIXI.utils.isWebGLSupported()) {
  type='canvas'
}

PIXI.utils.sayHello(`${type} - hello`)


// alias
let
  Application = PIXI.Application,
  loader = PIXI.Loader, // 將 image 轉換成 texture 的工具
  resources = PIXI.LoaderResource,
  TextureCache = PIXI.utils.TextureCache,
  Sprite = PIXI.Sprite // PIXI append 進 stage 的格式

/**
 * .ref how to use resolution
 * http://www.goodboydigital.com/pixi-js-v2-fastest-2d-webgl-renderer/
 */

let app = new Application({
  width: 256,
  height: 256,
  antialias: true, // default false 反鋸齒，平滑圖片與字體
  transparent: false, // default false canvas 背景是否透明
  resolution: 1 // 裝置解析度，retina 是 2
})
document.body.appendChild(app.view)
console.log(app.view)

app.render.autoResize = true // 確認 canvas 在 resize 時，有 match 裝置的寬度
app.renderer.view.style.position = 'absolute'
app.renderer.view.style.display = 'block'
app.renderer.view.style.width = window.innerWidth
app.renderer.view.style.height = window.innerHeight

// 所有要被 pixi render 出來的物件，都要加入 app.stage
// app.stage 是一個 PIXI.Container，Pixi 裡的 root container

/* Sprites 要被加進 stage 的圖片，做 sprites
  create sprites 有 3 種方法
  1. 直接用單一 image 檔
  2. 從一個大圖拿取，有點像 雪碧圖
  3. 讀取雪碧圖的 JSON 檔（一個定義雪碧各項位置的檔案）
*/


/**
 Loading Image With Textures Cache
  因為 PIXI 透過 webgl(GPU) 渲染圖片，所以 image 需要用一個 GPU 可以讀取的 format
  這種格式被稱為 texture
  所以在你建立 sprite 去展示 image 時，需要先把原始 image 檔轉換成 webgl texture
  為了讓一切變得更有效率，PIXI 使用 ＊texture cache＊ 去儲存(store)與引用(reference)所有 sprite 需要的 textture
  可以透過相對於 images 的路徑，去呼叫 textures
 */

 // 轉換成 webgl 可用的格式 texture
 let texture = PIXI.utils.TextureCache['images/icon_css3.png']
 // 加進 PIXI 的 sprite
 let sprite = new PIXI.Sprite(texture)

 // But how do you load the image file and convert it into a texture? Use Pixi’s built-in loader object.
 //
 // pixi 強大的 loader 可以幫助你讀取所有類型的圖片，這裡展示如何 load image 並且執行 setup() 當 images 結束 loading
 const my_loader = new loader()
 my_loader
  .add([
    'images/icon_mail.png',
    'images/icon_js.png',
    'images/icon_medium.png'
  ])
  .load(setup)

  function setup(loader, resources) {
    // load 完之後，才會執行
    console.log('finish load')
    const sprite_ic_mail = new Sprite(resources['images/icon_mail.png'].texture)

    // remove sprite
    // sprite_ic_mail.visible = false

    app.stage.addChild(sprite_ic_mail)

    // 這 2 行同下面 .position()
    // sprite_ic_mail.x = 90
    // sprite_ic_mail.y = 90
    sprite_ic_mail.position.set(90, 90)

    // 直接指定寬高
    // sprite_ic_mail.width = 100
    // sprite_ic_mail.height= 100

    // 指定 scale
    // 直接指定寬高
    // sprite_ic_mail.scale.set(1, 1.5)
    sprite_ic_mail.scale.y = 1.5
    console.log(sprite_ic_mail.height, sprite_ic_mail.width, sprite_ic_mail.x)

    sprite_ic_mail.pivot.set(32, 32) // 將旋轉軸心定位在卡個點上
  }


  /**
    pixi loader 的其他提醒

    1. 透過原生 JS img object 或 canvas 製作 sprite
      理論上來說，為了效率與優化，透過 PIXI 的 texture cache 去 preload 會是一個較好的選擇
      但如果你要用 JS 原生 img obj，你可以使用 baseTexture 與 Texture class

      let base = new PIXI.BaseTexture(anyImageObject)
      let texture = new PIXI.Texture(base)
      let sprite = new PIXI.Sprite(texture)

      也可以載入 canvas
      let base = new PIXI.BaseTexture.fromCanvas(anyCanvasElement)

    2. 如果想要在已經展示的 sprite 更換 texture（我覺就是換圖，但不新增新的 sprite）
      anySprite.texture = PIXI.utils.TextureCache['anyImage.png']

    3. 有 .on() 這個 methods 可以在 load 時執行，會在每個資源 load 完的時後觸發

    4. loader.add() 的參數
      name: resourse 的名字，沒有此參數的話，就用 url
      url: 相較於 loader 的路徑
      options:
        crossOrigin
        loadType
        xhrType
      callbackFunction: complete loading 後觸發

    5. pixi 的loader 還有很多不同的設定，可以解析 binary file 等，詳請見
      https://github.com/englercj/resource-loader

   */


