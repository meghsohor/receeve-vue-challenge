<template>
  <v-sheet class="px-8 py-15" height="100%" color="teal" dark>
    <v-form
      ref="form"
      v-model="valid"
      lazy-validation
      style="max-width: 350px"
      class="mx-auto mt-15"
    >
      <h1 class="display-1 text-center text--white">Login</h1>

      <v-divider class="mt-3 mb-5"></v-divider>

      <v-text-field
        v-model="email"
        :rules="emailRules"
        label="E-mail"
        required
        outlined
        prepend-inner-icon="fa-user"
        hint="Default Email: user@email.com"
        @change="handleChange"
      ></v-text-field>

      <v-text-field
        v-model="password"
        :append-icon="showPassword ? 'fa-eye' : 'fa-eye-slash'"
        :rules="passwordRules"
        :type="showPassword ? 'text' : 'password'"
        label="Password"
        required
        outlined
        @click:append="showPassword = !showPassword"
        @change="handleChange"
        hint="Default Password: user123"
      ></v-text-field>

      <v-alert dense type="error" v-if="validationError">
        {{ validationError }}
      </v-alert>

      <div class="d-flex justify-center">
        <v-btn
          class="mt-4 teal--text"
          color="white"
          elevation="2"
          @click="submit"
          rounded
          width="180px"
          large
        >
          <template v-if="!loading">Sign In</template>
          <template v-if="loading">
            <v-icon left>fa-circle-o-notch fa-spin</v-icon>
            Signing...
          </template>
        </v-btn>
      </div>
    </v-form>
  </v-sheet>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import firebase from "firebase";

@Component
export default class Login extends Vue {
  $refs!: {
    form: HTMLFormElement;
  };

  loading = false;
  validationError = "";

  valid = true;
  email: string = "user@email.com";
  password: string = "user123";
  emailRules = [
    (v: string) => !!v || "E-mail is required",
    (v: string) => /.+@.+\..+/.test(v) || "E-mail must be valid",
  ];
  passwordRules = [(v: string) => !!v || "Password is required"];
  showPassword = false;

  handleChange(): void {
    this.validationError = "";
  }

  submit(): void {
    if (this.loading) return;

    const isValid = this.$refs.form.validate();
    if (isValid) {
      this.loading = true;
      firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .then((res) => {
          this.loading = false;
          this.$router.push({ name: "Dashboard" });
        })
        .catch((err) => {
          this.validationError = err.message;
          this.loading = false;
        });
    }
  }
}
</script>