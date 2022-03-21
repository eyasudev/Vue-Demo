<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center" @click="home">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />
        <span class="mr-2">User Demo</span>
      </div>
      <v-btn text @click="home">
        <span class="mr-2">Home</span>
      </v-btn>
      <v-btn text @click="about">
        <span class="mr-2">About</span>
      </v-btn>
      <v-spacer></v-spacer>

      <v-btn text @click="logout" v-if="this.$store.getters.isLoggedIn">
        <span class="mr-2">Logout</span>
        <v-icon>mdi-minus-circle</v-icon>
      </v-btn>
      <v-btn text @click="logout" v-if="!this.$store.getters.isLoggedIn">
        <span class="mr-2">Login</span>
        <v-icon>mdi-checkbox-marked-circle</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",

  data: () => ({
    //
  }),
  methods: {
    home() {
      this.$router.push("/");
    },
    about() {
      this.$router.push("/about");
    },
    logout() {
      this.$store.dispatch("logout");
      this.$router.push("/login");
    },
  },
};
</script>
