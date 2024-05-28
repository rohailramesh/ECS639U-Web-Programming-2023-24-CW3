<template>
  <div class="profile-page">
    <div v-if="newsStore.editableUser">
      <!-- User Information Preview -->
      <div class="text-center mb-4">
        <h1>{{ newsStore.editableUser.username }}'s Profile</h1>
      </div>

      <!-- Profile Picture and Choose File -->
      <div class="profile-picture-section">
        <div class="text-center mb-2">
          <img
            :src="
              newsStore.editableUser.profile_image ||
              newsStore.tempProfileImageUrl ||
              newsStore.profileImageUrl
            "
            alt="Profile Image"
            class="profile-image-preview img-thumbnail"
          />
        </div>
        <div class="text-center">
          <label class="btn btn-primary btn-sm">
            Choose File
            <input
              type="file"
              @change="newsStore.previewImage"
              class="image-upload-field visually-hidden"
            />
          </label>
        </div>
      </div>

      <hr class="separator-line" />

      <!-- Personal Information -->
      <div class="personal-info-box mt-3">
        <div class="title-outline">
          <h3 class="small-font mb-2">Personal Information</h3>
        </div>
        <p><strong>Email:</strong> {{ newsStore.editableUser.email }}</p>
        <p>
          <strong>Date of Birth:</strong>
          {{ newsStore.editableUser.date_of_birth || "Not provided" }}
        </p>
      </div>

      <!-- Favorite Category -->
      <div class="favorite-category-box mt-3">
        <div class="title-outline">
          <h3 class="small-font">Favorite Categories (Select at least 1!)</h3>
        </div>
        <div class="checkbox-options">
          <div
            class="form-check"
            v-for="category in newsStore.categories"
            :key="category.id"
          >
            <input
              type="checkbox"
              class="form-check-input"
              v-model="newsStore.editableUser.favorite_categories"
              :value="category.id"
            />
            <label class="form-check-label">{{ category.name }}</label>
          </div>
        </div>
        <button class="btn btn-primary btn-sm mt-2" @click="saveUserProfile">
          Save Favorite Categories
        </button>
        <!-- Display error message if no category is selected -->
        <p v-if="!isAtLeastOneCategorySelected" class="error-message">
          At least 1 category must be selected as favorites.
        </p>
        <!-- Display success message -->
        <div v-if="categoryAddedMessage" class="text-success mt-2">
          {{ categoryAddedMessage }}
        </div>
      </div>

      <hr class="separator-line" />

      <!-- Update Personal Information -->
      <div class="personal-info-box mt-3">
        <div class="title-outline">
          <h3 class="small-font mb-2">Update Personal Information</h3>
        </div>
        <div class="editable-fields">
          <input
            v-model="newsStore.editableUser.email"
            type="email"
            placeholder="Email"
            class="form-control mb-2"
          />
          <input
            v-model="newsStore.editableUser.date_of_birth"
            type="date"
            placeholder="Date of Birth"
            class="form-control mb-2"
          />
          <button
            class="btn btn-primary btn-sm mt-2"
            @click="newsStore.saveUserProfile"
          >
            Save
          </button>
        </div>
      </div>
    </div>

    <div v-else>
      <p>Loading profile...</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useNewsPaperStore } from "../store/NewsPaperStore";

interface Category {
  id: number;
  name: string;
}

interface User {
  email: string;
  date_of_birth: string | null;
  profileImage: string;
  favorite_categories: number[];
  profileImageFile?: File;
  categoryAddedMessage: string;
}

export default defineComponent({
  setup() {
    const newsStore = useNewsPaperStore();
    newsStore.fetchCurrentUser();
    newsStore.fetchFavoriteArticles();
    return { newsStore };
  },

  data() {
    return {
      user: null as User | null,
      editableUser: null as User | null,
      categories: [] as Category[],
      profile_image: "",
      profileImageUrl: "",
      tempProfileImageUrl: "",
      favorite_categories: [],
      isAtLeastOneCategorySelected: true,
      categoryAddedMessage: "",
    };
  },

  mounted() {
    this.newsStore.fetchUserProfile();
    this.newsStore.fetchCategories();
  },
  methods: {
    saveUserProfile() {
      if (
        this.newsStore.editableUser &&
        this.newsStore.editableUser.favorite_categories.length === 0
      ) {
        this.isAtLeastOneCategorySelected = false;

        setTimeout(() => {
          this.isAtLeastOneCategorySelected = true;
        }, 3000);
      } else {
        this.isAtLeastOneCategorySelected = true;
        this.newsStore.saveUserProfile();

        this.categoryAddedMessage = "Profile successfully updated";

        setTimeout(() => {
          this.categoryAddedMessage = "Test";
        }, 3000);
      }
    },
  },
});
</script>

<style scoped>
.separator-line {
  margin: 40px 0;
  border: 0;
  border-top: 1px solid #050505;
}

.checkbox-options {
  text-align: center;
}

.checkbox-options .form-check {
  display: inline-block;
  margin-right: 20px;
}

.profile-picture-section {
  text-align: center;
  margin-bottom: 20px;
}

.profile-image-preview {
  width: 170px;
  height: 170px;
  border-radius: 50%;
  object-fit: cover;
  display: block;
  margin: 0 auto;
}

.image-upload-field {
  display: none;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}

.personal-info-box,
.favorite-category-box {
  border: 1px solid #ddd;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 15px;
  text-align: center;
}

.personal-info-box h3,
.favorite-category-box h3 {
  font-size: 25px;
  color: #0056b3;
}

.small-font {
  font-size: 16px;
}

.profile-page {
  max-width: 700px;
  margin: 0px auto;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background-color: #ffffff;
}

.personal-info-box,
.favorite-category-box,
.editable-fields {
  background-color: #fff;
}

.form-control {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.btn {
  cursor: pointer;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.text-success {
  color: #28a745;
}
</style>
