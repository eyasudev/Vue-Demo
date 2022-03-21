<template>
  <v-app>
    <div class="login backgruond"></div>
    <v-main class="d-flex justify-center align-center">
      <v-col cols="10" lg="4" class="mx-auto">
        <v-card class="pa-4">
          <div class="text-center">
            <v-avatar size="100" color="indigo lighten-4">
              <v-icon size="40" color="indigo">mdi-account</v-icon>
            </v-avatar>
            <h2 class="indigo--text">login</h2>
          </div>
          <v-form @submit.prevent="submitHandler" ref="form">
            <v-card-text>
              <v-text-field
                v-model="email"
                :rules="emailRules"
                type="email"
                label="Email"
                placeholder="Email"
                prepend-inner-icon="mdi-account"
                required
              />
              <v-text-field
                v-model="password"
                :rules="passwordRules"
                :type="passwordShow ? 'text' : 'password'"
                label="Password"
                placeholder="Password"
                prepend-inner-icon="mdi-key"
                :append-icon="passwordShow ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="passwordShow = !passwordShow"
                required
              />
            </v-card-text>
            <v-card-actions class="justify-center">
              <v-btn :loading="loading" type="submit" color="indigo">
                <span class="white--text px-8">Login</span>
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-col>
    </v-main>
    <v-snackbar top color="green" v-model="snackbar">
      {{ msg }}
    </v-snackbar>
    <v-snackbar top color="red" v-model="errorbar">
      {{ error }}
    </v-snackbar>
  </v-app>
</template>
<script>
import AuthService from "@/services/AuthService.js";
export default {
  name: "App",
  created() {
    if (this.$store.getters.isLoggedIn) {
      this.$router.push("/");
    }
  },
  data: () => ({
    loading: false,
    snackbar: false,
    errorbar: false,
    passwordShow: false,
    msg: "",
    error: "",
    email: "",
    emailRules: [
      (v) => !!v || "E-mail is required",
      (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
    ],
    password: "",
    passwordRules: [
      (v) => !!v || "Password is required",
      (v) => (v && v.length >= 6) || "Password must be 6  characters or more!",
    ],
  }),
  methods: {
    async submitHandler() {
      try {
        if (this.$refs.form.validate()) {
          this.loading = true;
          const credentials = {
            username: this.email,
            password: this.password,
          };
          const response = await AuthService.login(credentials);
          this.loading = false;
          if (response.token) {
            this.snackbar = true;
            this.msg = response.message;
            const token = response.token;
            const user = "demo_user";
            this.$store.dispatch("login", { token, user });
            this.$router.push("/");
          } else {
            this.errorbar = true;
            this.error = "Invalid credentials.";
          }
        }
      } catch (error) {
        console.log(error);
        this.msg = error.response.data.msg;
      }
    },
  },
};
</script>
<style>
.backgruond {
  background-image: url(../assets/login-bg.jpg) !important;
  height: 300px;
  width: 100%;
  display: block;
  position: absolute;
  top: 0;
  background-size: cover;
}
</style>