<template>
  <div v-if="currentUser" class="edit-form py-3">
    <p class="headline">Edit User</p>
    <v-snackbar bottom color="green" v-model="snackbar">
      {{ message }}
    </v-snackbar>
    <v-snackbar bottom color="red" v-model="errorBar">
      {{ error }}
    </v-snackbar>
    <v-form ref="form" @submit.prevent="updateUser" lazy-validation>
      <v-card class="mx-auto my-12" max-width="374">
        <template slot="progress">
          <v-progress-linear
            color="deep-purple"
            height="10"
            indeterminate
          ></v-progress-linear>
        </template>

        <v-img
          height="250"
          :src="!isUpload ? currentUser.avatarUrl : imgUrl"
        ></v-img>
      </v-card>

      <v-text-field
        v-model="currentUser.email"
        :rules="emailRules"
        label="Email"
        required
      ></v-text-field>

      <v-text-field
        v-model="currentUser.firstName"
        :rules="[(v) => !!v || 'First name is required']"
        label="First name"
        required
      ></v-text-field>

      <v-text-field
        v-model="currentUser.lastName"
        :rules="[(v) => !!v || 'Last name is required']"
        label="Last name"
        required
      ></v-text-field>

      <v-file-input
        @change="previewImage"
        v-model="currentUser.avatar"
        accept="image/png, image/jpeg, image/bmp"
        placeholder="Pick an avatar"
        prepend-icon="mdi-camera"
      ></v-file-input>

      <v-btn color="success" small @click="updateUser" class="mr-2">
        Update
      </v-btn>
      <v-btn color="primary" small @click="cancelUser"> Cancel </v-btn>
    </v-form>
  </div>
</template>

<script>
import UserDataService from "../services/UserService";
export default {
  name: "User-View",
  data() {
    return {
      isUpload: false,
      snackbar: false,
      errorBar: false,
      error: "",
      currentUser: null,
      message: "",
      imgUrl: "",
      emailRules: [
        (v) => !!v || "E-mail is required",
        (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
      ],
    };
  },
  methods: {
    getUser(id) {
      UserDataService.get(id, this.$store.getters.isLoggedIn)
        .then((response) => {
          this.currentUser = {
            id: response.data.data.id,
            email: response.data.data.email,
            firstName: response.data.data.first_name,
            lastName: response.data.data.last_name,
            avatar: response.data.data.avatar,
            avatarUrl: response.data.data.avatarUrl,
          };
        })
        .catch((e) => {
          console.log(e);
        });
    },
    updateUser() {
      if (this.$refs.form.validate()) {
        var formdata = new FormData();
        formdata.append("imageFile", this.currentUser.avatar);
        if (this.isUpload == false) {
          UserDataService.update(
            this.currentUser,
            this.$store.getters.isLoggedIn
          )
            .then((response) => {
              if (response.data.status === 200) {
                this.message = "The user was updated successfully!";
                this.snackbar = true;
              } else {
                this.errorBar = true;
                this.error = response.data.message;
              }
            })
            .catch((e) => {
              console.log(e);
            });
        } else {
          UserDataService.updateFile(formdata, this.$store.getters.isLoggedIn)
            .then((response) => {
              if (response.data.status === 200) {
                let fileName = response.data.fileName;
                this.currentUser.avatar = fileName;
                UserDataService.update(
                  this.currentUser,
                  this.$store.getters.isLoggedIn
                )
                  .then((response) => {
                    if (response.data.status === 200) {
                      this.message = "The user was updated successfully!";
                      this.snackbar = true;
                    } else {
                      this.errorBar = true;
                      this.error = response.data.message;
                    }
                  })
                  .catch((e) => {
                    console.log(e);
                  });
              } else {
                this.errorBar = true;
                this.error = response.data.message;
              }
            })
            .catch((e) => {
              console.log(e);
            });
        }
      }
    },
    deleteUser() {
      UserDataService.delete(this.currentUser.id)
        .then(() => {
          this.$router.push({ name: "home" });
        })
        .catch((e) => {
          console.log(e);
        });
    },
    cancelUser() {
      this.$router.push({ name: "home" });
    },
    previewImage() {
      this.isUpload = true;
      this.imgUrl = URL.createObjectURL(this.currentUser.avatar);
    },
  },
  mounted() {
    this.message = "";
    this.getUser(this.$route.params.id);
  },
};
</script>

<style>
.edit-form {
  max-width: 600px;
  margin: auto;
}
</style>