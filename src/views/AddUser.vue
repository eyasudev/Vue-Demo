<template>
  <div class="submit-form mt-3 mx-auto">
    <p class="headline">Add User</p>

    <div>
      <v-form @submit.prevent="saveUser" ref="form" lazy-validation>
        <v-card v-if="url" class="mx-auto my-12" max-width="374">
          <template slot="progress">
            <v-progress-linear
              color="deep-purple"
              height="10"
              indeterminate
            ></v-progress-linear>
          </template>
          <v-img height="250" :src="url"></v-img>
        </v-card>

        <v-text-field
          v-model="user.email"
          :rules="user.emailRules"
          label="Email"
          required
        ></v-text-field>

        <v-text-field
          v-model="user.first_name"
          :rules="[(v) => !!v || 'First name is required']"
          label="First name"
          required
        ></v-text-field>

        <v-text-field
          v-model="user.last_name"
          :rules="[(v) => !!v || 'Last name is required']"
          label="Last name"
          required
        ></v-text-field>

        <v-text-field
          v-model="user.password"
          :rules="user.passwordRules"
          :type="passwordShow ? 'text' : 'password'"
          label="Password"
          placeholder="Password"
          prepend-inner-icon="mdi-key"
          :append-icon="passwordShow ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append="passwordShow = !passwordShow"
          required
        />

        <v-file-input
          @change="previewImage"
          v-model="user.avatar"
          :rules="[(v) => !!v || 'File is mandatory']"
          accept="image/png, image/jpeg, image/bmp"
          placeholder="Pick an avatar"
          prepend-icon="mdi-camera"
          required
        >
        </v-file-input>

        <v-btn color="green" small class="mr-2" @click="saveUser">Submit</v-btn>
        <v-btn color="primary" small @click="cancelUser"> Cancel </v-btn>
        <v-snackbar bottom color="green" v-model="submitted">
          Submitted successfully!
        </v-snackbar>
        <v-snackbar bottom color="red" v-model="errorBar">
          {{ error }}
        </v-snackbar>
      </v-form>
    </div>
  </div>
</template>

<script>
import UserDataService from "../services/UserService";
export default {
  name: "add-user",
  data() {
    return {
      user: {
        id: null,
        email: "",
        emailRules: [
          (v) => !!v || "E-mail is required",
          (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
        ],
        first_name: "",
        last_name: "",
        password: "",
        passwordRules: [
          (v) => !!v || "Password is required",
          (v) =>
            (v && v.length >= 6) || "Password must be 6  characters or more!",
        ],
        avatar: [],
      },
      passwordShow: false,
      url: null,
      submitted: false,
      errorBar: false,
      error: "",
    };
  },
  methods: {
    saveUser() {
      if (this.$refs.form.validate()) {
        var data = {
          email: this.user.email,
          firstName: this.user.first_name,
          lastName: this.user.last_name,
          password: this.user.password,
          avatar: this.user.avatar,
        };
        var formdata = new FormData();
        formdata.append("imageFile", data.avatar);
        UserDataService.updateFile(formdata, this.$store.getters.isLoggedIn)
          .then((response) => {
            if (response.data.status === 200) {
              let fileName = response.data.fileName; //response.data.fileName;
              data.avatar = fileName;
              UserDataService.create(data, this.$store.getters.isLoggedIn)
                .then((response) => {
                  if (response.data.status === 200) {
                    this.user.id = response.data.id;
                    this.submitted = true;
                    setTimeout(() => {
                      this.$router.push("/");
                    }, 5000);
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
    },
    newUser() {
      this.submitted = false;
      this.user = {};
    },
    previewImage() {
      this.url = this.user.avatar ? URL.createObjectURL(this.user.avatar) : "";
    },
    cancelUser() {
      this.$router.push({ name: "home" });
    },
  },
};
</script>

<style>
.submit-form {
  max-width: 300px;
}
</style>