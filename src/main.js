import '@/assets/icon/iconfont.css'
import { Button, Cell, CellGroup, Dialog, Divider, Field, Form, Icon, Image as VanImage, ImagePreview, List, Notify, Popup, Toast, Uploader } from 'vant'
import { createApp } from 'vue'
import vueClapButton from 'vue-clap-button'
import App from './App.vue'
import router from './router'
import store from './store'

// 将 Toast 等组件注册到 app 上
const app = createApp(App)
app.use(Toast)
app.use(Dialog)
app.use(Notify)
app.use(VanImage)
app.use(Button)
app.use(Divider)
app.use(ImagePreview)
app.use(List)
app.use(Cell)
app.use(CellGroup)
app.use(Icon)
app.use(Dialog)
app.use(Popup)
app.use(Field)
app.use(Uploader)
app.use(Form)
app.use(vueClapButton)
app.use(store)
app.use(router)
app.mount('#app')
