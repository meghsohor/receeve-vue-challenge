import Vue from 'vue'
import App from '@/App.vue'
import vuetify from './plugins/vuetify'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import 'font-awesome/css/font-awesome.css'
import router from './router'
import firebase from "firebase"
import { firebaseConfig } from '@/config/firebase'
// Global styles
import '@/assets/styles.scss'

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

Vue.config.productionTip = false
let app: any;

firebase.auth().onAuthStateChanged(() => {
  if (!app) {
    app = new Vue({
      vuetify,
      router,
      render: h => h(App)
    }).$mount('#app')
  }
});

