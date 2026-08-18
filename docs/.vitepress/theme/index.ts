import DefaultTheme from 'vitepress/theme'
import CaptchaPreview from '../../components/CaptchaPreview.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  components: {
    CaptchaPreview,
  },
}
