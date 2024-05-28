<template>
  <div>
    <h2 class="title">Favourites</h2>

    <div v-if="newsPaperStore.favoriteArticles.length > 0">
      <div
        v-for="categoryGroup in groupedFavoriteArticles"
        :key="categoryGroup.categoryId"
      >
        <h3 class="category-title">
          <hr />
          {{ getCategoryName(categoryGroup.categoryId) }}
        </h3>

        <div class="row">
          <div
            v-for="article in categoryGroup.articles"
            :key="article.id"
            class="col-md-4"
          >
            <div class="card mb-4">
              <img
                :src="article.article_image"
                alt="Article Image"
                class="card-img-top"
              />
              <div class="card-body">
                <span class="category-badge">{{
                  getCategoryName(categoryGroup.categoryId)
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
    </div>

    <div v-else>
      <p class="category-title">
        Please select a favourite category on your profile page
      </p>
    </div>
  </div>
</template>

<script>
import { useNewsPaperStore } from "../store/NewsPaperStore";

export default {
  setup() {
    const newsPaperStore = useNewsPaperStore();
    newsPaperStore.fetchCurrentUser();
    newsPaperStore.fetchFavoriteArticles();
    newsPaperStore.fetchCategories();
    return { newsPaperStore };
  },

  computed: {
    groupedFavoriteArticles() {
      const groupedArticles = {};
      this.newsPaperStore.favoriteArticles.forEach((article) => {
        const categoryId = article.category;
        if (!groupedArticles[categoryId]) {
          groupedArticles[categoryId] = {
            categoryId,
            articles: [],
          };
        }
        groupedArticles[categoryId].articles.push(article);
      });

      return Object.values(groupedArticles);
    },
  },

  methods: {
    getCategoryName(categoryId) {
      const category = this.newsPaperStore.categories.find(
        (category) => category.id === categoryId
      );
      return category ? category.name : "Unknown Category";
    },
  },
};
</script>

<style>
.flex {
  display: flex;
}
.title {
  font-family: "Times New Roman", Times, serif;
  font-weight: bold;
  color: #043576;
  padding-top: 20px;
  text-align: center;
  font-size: 50px;
}
.category-title {
  font-family: "Times New Roman", Times, serif;
  font-size: 30px;
  font-weight: bold;
  color: #043576;
  text-align: center;
  margin-bottom: 15px;
}
.card-body {
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
  justify-content: space-evenly;
}
.col-md-12 {
  display: flex;
  width: 200% !important;
}
.btn-primary {
  background-color: #043576 !important;
  border-color: #043576 !important;
}
.row {
  padding: 20px;
}
.card-img-top {
  object-fit: cover;
  height: 200px;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
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
</style>
