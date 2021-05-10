<template>
  <v-app>
    <v-app-bar app color="white" elevation="1" v-if="loggedIn">
      <v-app-bar-nav-icon
        class="d-flex d-sm-none"
        @click.stop="drawer = !drawer"
      ></v-app-bar-nav-icon>

      <v-spacer class="d-block d-sm-none"></v-spacer>
      <v-avatar color="teal" size="50"
        ><img id="company-logo" alt="receeve" src="./assets/logo.png"
      /></v-avatar>

      <v-spacer class="d-none d-sm-block"></v-spacer>

      <v-tabs color="teal" right class="d-none d-sm-block">
        <v-tab :to="{ name: 'Dashboard' }">Dashboard</v-tab>
        <v-tab :to="{ name: 'Accounts' }">Accounts</v-tab>
      </v-tabs>

      <v-btn icon class="ml-5 d-none d-sm-block" @click="signout"
        ><v-icon>fa-sign-out</v-icon></v-btn
      >
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" fixed app top temporary>
      <v-list nav>
        <v-list-item-group active-class="teal--text">
          <v-list-item :to="{ name: 'Dashboard' }">
            <v-list-item-icon>
              <v-icon>fa-th</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Dashboard</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item :to="{ name: 'Accounts' }">
            <v-list-item-icon>
              <v-icon>fa-btc</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Accounts</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
      <template v-slot:append>
        <div class="pa-2">
          <v-btn block @click="signout" color="red" text>
            <v-icon left>fa-sign-out</v-icon> Logout
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <v-main class="grey lighten-3"><router-view /></v-main>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import firebase from "firebase";

@Component
export default class App extends Vue {
  loggedIn = false;
  drawer = false;

  mounted(): void {
    this.checkAuthState();
  }
  /* @if user is `loggedin` show `Navbar`, @else hide */
  checkAuthState(): void {
    firebase.auth().onAuthStateChanged((res) => {
      if (firebase.auth().currentUser) {
        this.loggedIn = true;
      } else {
        this.loggedIn = false;
      }
    });
  }

  signout(): void {
    firebase
      .auth()
      .signOut()
      .then((res) => {
        this.loggedIn = false;
        this.$router.push({ name: "Login" });
      })
      .catch((err) => console.log(err.message));
  }
}
</script>

<style>
.challenge {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

#company-logo {
  width: 50px;
  vertical-align: middle;
}
</style>
