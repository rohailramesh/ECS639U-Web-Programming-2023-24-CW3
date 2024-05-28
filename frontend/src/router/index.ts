// Example of how to use Vue Router

import { createRouter, createWebHistory } from "vue-router";

// Import your components for All Articles and Article
import AllArticles from "../pages/HomePage.vue";
import Article from "../pages/Article.vue";
import ProfilePage from "../pages/ProfilePage.vue";
import FavouritesPage from "../pages/FavouritesPage.vue";

let base =
  import.meta.env.MODE == "development" ? import.meta.env.BASE_URL : "";

// Define some routes
const router = createRouter({
  history: createWebHistory(base),
  routes: [
    { path: "/", name: "Home Page", component: AllArticles },
    { path: "/profile", name: "Profile Page", component: ProfilePage },
    {
      path: "/favourites/",
      name: "Favourites Page",
      component: FavouritesPage,
    },
    { path: "/article/:id", name: "Article", component: Article, props: true },
  ],
});

export default router;
