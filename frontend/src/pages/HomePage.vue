<template>
  <div>
    <h2 class="title">All Articles</h2>
    <div v-if="newsPaperStore.allArticles.length > 0" class="row">
      <div
        class="col-md-4"
        v-for="article in newsPaperStore.allArticles"
        :key="article.id"
      >
        <div class="card mb-4">
          <img
            :src="article.article_image"
            alt="Article Image"
            class="card-img-top"
          />
          <div class="card-body">
            <span class="category-badge">{{
              getCategoryName(article.category)
            }}</span>
            <h5 class="card-title">{{ article.title }}</h5>
            <router-link
              :to="{ name: 'Article', params: { id: article.id } }"
              class="btn btn-primary"
            >
              View Article
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useNewsPaperStore } from "../store/NewsPaperStore";

export default {
  setup() {
    const newsPaperStore = useNewsPaperStore();
    newsPaperStore.fetchCurrentUser();
    newsPaperStore.fetchAllArticles();
    newsPaperStore.fetchCategories();
    return { newsPaperStore };
  },

  data() {
    return {
      currentUser: null,
      allArticles: [],
      favorite_categories: [],
    };
  },
  methods: {
    getCategoryName(categoryId) {
      const category = this.newsPaperStore.categories.find(
        (category) => category.id === categoryId
      );
      return category ? category.name : "Unknown Category";
    },
  },

  mounted() {
    this.newsPaperStore.fetchCurrentUser();
    this.newsPaperStore.fetchAllArticles();
  },
};
</script>

<style>
.title {
  font-family: "Times New Roman", Times, serif;
  font-weight: bold;
  color: #043576;
  padding-top: 20px;
  text-align: center;
  font-size: 50px;
}
.category {
  font-weight: bold;
  color: #043576;
  font-size: 18px;
  text-align: right;
}
.card-body {
  max-width: 500px;
  outline: 2px solid #80a3d1;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  flex-wrap: wrap;
  justify-content: space-between;
}
.col-md-4 {
  display: flex;
}
.btn-primary {
  background-color: #043576 !important;
  border-color: #043576 !important;
}
.row {
  padding: 20px;
}
.category-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #043576;
  color: white;
  padding: 5px 10px;
  border-radius: 3px;
  font-size: 14px;
}

.card-img-top {
  object-fit: cover;
  height: 200px;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
}
</style>
