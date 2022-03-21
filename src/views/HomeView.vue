<template>
  <v-row align="center" class="list px-3 mx-auto">
    <v-col cols="12" sm="12" class="mt-15">
      <v-row>
        <v-col cols="4" sm="3">
          <v-select
            v-model="pageSize"
            :items="pageSizes"
            label="Items per Page"
            @change="handlePageSizeChange"
          ></v-select>
        </v-col>

        <v-col cols="12" sm="6">
          <v-pagination
            v-model="page"
            :length="totalPages"
            total-visible="6"
            next-icon="mdi-menu-right"
            prev-icon="mdi-menu-left"
            @input="handlePageChange"
          ></v-pagination>
        </v-col>
        <v-col cols="12" sm="3">
          <v-btn small to="/add"> Add New User </v-btn>
        </v-col>
      </v-row>
    </v-col>

    <v-col cols="12" sm="12">
      <v-card class="mx-auto" tile>
        <v-card-title>Users</v-card-title>

        <v-data-table
          :headers="headers"
          :items="users"
          disable-pagination
          :hide-default-footer="true"
        >
          <template v-slot:[`item.avatar`]="{ item }">
            <img :src="item.avatar" style="width: 50px; height: 50px" />
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <v-icon small class="mr-2" @click="editUser(item.id)">
              mdi-pencil
            </v-icon>
          </template>
        </v-data-table>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
import UserDataService from "../services/UserService";
export default {
  name: "users-list",
  data() {
    return {
      users: [],
      searchEmail: "",
      headers: [
        { text: "Avatar", align: "center", value: "avatar", sortable: false },
        { text: "Email", align: "start", sortable: true, value: "email" },
        { text: "First Name", value: "first_name", sortable: true },
        { text: "Last Name", value: "last_name", sortable: true },
        { text: "Action", value: "actions", sortable: false },
      ],
      page: 1,
      totalPages: 0,
      pageSize: 6,
      pageSizes: [3, 6, 9],
    };
  },
  created() {
    if (!this.$store.getters.isLoggedIn) {
      this.$router.push("/login");
    }

    this.username = this.$store.getters.getUser.username;
  },
  methods: {
    getRequestParams(searchEmail, page, pageSize) {
      let params = {};
      if (searchEmail) {
        params["email"] = searchEmail;
      }
      if (page) {
        params["page"] = page;
      }
      if (pageSize) {
        params["per_page"] = pageSize;
      }
      return params;
    },
    retrieveUsers() {
      const params = this.getRequestParams(
        this.searchEmail,
        this.page,
        this.pageSize
      );
      UserDataService.getAll(params, this.$store.getters.isLoggedIn)
        .then((response) => {
          const totalPages = response.data.total_pages;
          const users = response.data.data;
          this.users = users.map(this.getDisplayUser);
          this.totalPages = totalPages;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    handlePageChange(value) {
      this.page = value;
      this.retrieveUsers();
    },
    handlePageSizeChange(size) {
      this.pageSize = size;
      this.page = 1;
      this.retrieveUsers();
    },
    refreshList() {
      this.retrieveUsers();
    },
    removeAllUsers() {
      UserDataService.deleteAll()
        .then(() => {
          this.refreshList();
        })
        .catch((e) => {
          console.log(e);
        });
    },
    editUser(id) {
      this.$router.push({ name: "user-details", params: { id: id } });
    },
    deleteUser(id) {
      UserDataService.delete(id)
        .then(() => {
          this.refreshList();
        })
        .catch((e) => {
          console.log(e);
        });
    },
    getDisplayUser(user) {
      return {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        avatar: user.avatar,
      };
    },
    logout() {
      this.$store.dispatch("logout");
      this.$router.push("/login");
    },
  },
  mounted() {
    this.retrieveUsers();
  },
};
</script>

<style>
.list {
  max-width: 750px;
}
</style>
