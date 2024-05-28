<template>
  <div>
    <nav class="navbar navbar-expand-lg">
      <div class="container-fluid">
        <router-link class="navbar-brand" :to="{ name: 'Home Page' }">
          HART NEWS
        </router-link>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item">
              <router-link class="nav-link" :to="{ name: 'Home Page' }">
                Home
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" :to="{ name: 'Favourites Page' }">
                Favourites
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" :to="{ name: 'Profile Page' }">
                Profile
              </router-link>
            </li>
          </ul>
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <button class="btn btn-light" @click="newsPaperStore.logout()">
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useNewsPaperStore } from "../src/store/NewsPaperStore";

interface User {
  email: string;
  date_of_birth: string | null;
  profileImage: string;
  favorite_categories: number[];
  profileImageFile?: File;
}

export default defineComponent({
  setup() {
    const newsPaperStore = useNewsPaperStore();
    return { newsPaperStore };
  },
  data() {
    return {
      user: null as User | null,
    };
  },
  mounted() {
    this.newsPaperStore.fetchUserProfile();
  },
});
</script>

<style scoped>
a {
  color: white;
  font-size: 24px;
  font-family: "Times New Roman", Times, serif;
}

.navbar {
  background-color: #043576;
  height: 80px;
}

.nav-link {
  color: white !important;
}

.nav-link:hover,
.nav-link:active,
.nav-link:focus {
  color: white !important;
}

.nav-item {
  text-align: center;
  justify-content: center;
  margin-left: 20px;
}

@media (max-width: 991.98px) {
  .navbar-nav {
    padding-left: 0;
  }

  .nav-item:not(:last-child) {
    margin-right: 0;
  }
}
</style>
