import { defineStore } from "pinia";

interface Comment {
  id: number;
  user: string;
  content: string;
}

interface Article {
  id: number;
  title: string;
  content: string;
  comments: Comment[];
}

interface User {
  email: string;
  date_of_birth: string | null;
  profileImage: string;
  favorite_categories: number[];
  username: string;
  profile_image: string;
  profileImageFile?: File;
}

interface Category {
  id: number;
  name: string;
}

export const useNewsPaperStore = defineStore("main", {
  state: () => ({
    currentUser: null as User | null,
    allArticles: [] as Article[],
    favoriteArticles: [] as Article[],
    editingCommentId: null,
    editedCommentContent: "",
    replyingToCommentId: null,
    user: null as User | null,
    editableUser: null as User | null,
    categories: [] as Category[],
    profile_image: "",
    profileImageUrl: "",
    tempProfileImageUrl: "",
    articleImageUrl: "",
    tempArticleImageUrl: "",
    favorite_categories: [],
    fetchedArticle: null as Article | null,
  }),
  getters: {
    getFetchedArticle: (state) => {
      return state.fetchedArticle;
    },
  },

  actions: {
    async fetchFavoriteArticles() {
      try {
        const response = await fetch(
          "http://localhost:8000/get_user_favorite_articles/",
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          this.favoriteArticles = data;
          for (let article of this.favoriteArticles) {
            await this.fetchAllArticleComments(article.id);
          }
        } else {
          console.error("Error fetching favorite articles");
        }
      } catch (error) {
        console.error("Error fetching favorite articles:", error);
      }
    },

    async fetchAllArticles() {
      try {
        const response = await fetch("http://localhost:8000/articles/", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          const data = await response.json();
          // console.log(data);
          this.allArticles = data;
          for (let article of this.allArticles) {
            await this.fetchAllArticleComments(article.id);
          }
        } else {
          console.error("Error fetching articles");
        }
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    },
    async fetchAllArticleComments(articleId: any) {
      try {
        const response = await fetch(
          `http://localhost:8000/articles/${articleId}/user-comments/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const comments = await response.json();
          let article = this.allArticles.find(
            (a: { id: any }) => a.id === articleId
          );

          if (article) {
            article.comments = this.sortComments(comments);
          }
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    },

    async fetchCurrentUser() {
      try {
        const response = await fetch("http://localhost:8000/api/profile/", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          const data = await response.json();
          this.currentUser = data;
          this.editableUser = {
            ...data,
            profileImage: data.profileImage || "",
          };
          // console.log(data);
        } else {
          console.error("Failed to fetch current user");
        }
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    },

    sortComments(comments: any[]) {
      const commentMap = new Map();

      comments.forEach((comment: { replies: never[]; id: any }) => {
        comment.replies = [];
        commentMap.set(comment.id, comment);
      });

      comments.forEach((comment: { parent_comment: any }) => {
        if (comment.parent_comment) {
          const parent = commentMap.get(comment.parent_comment);
          if (parent) {
            parent.replies.push(comment);
          }
        }
      });

      return comments.filter(
        (comment: { parent_comment: any }) => !comment.parent_comment
      );
    },

    isUserComment(comment: { user: any }) {
      return this.currentUser && comment.user === this.currentUser.username;
    },

    getCookie(name: string | any[]) {
      let cookieValue = null;
      if (document.cookie && document.cookie !== "") {
        const cookies = document.cookie.split(";");
        for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].trim();
          if (cookie.substring(0, name.length + 1) === name + "=") {
            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
            break;
          }
        }
      }
      return cookieValue;
    },

    async fetchUserProfile() {
      try {
        const response = await fetch("http://localhost:8000/api/profile/", {
          method: "GET",
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          this.user = data;
          this.editableUser = JSON.parse(JSON.stringify(data));

          if (this.editableUser) {
            this.editableUser.favorite_categories =
              data.favorite_categories?.map((cat: { id: number }) => cat.id) ??
              [];
            this.profileImageUrl = data.profile_image
              ? `http://localhost:8000${data.profile_image}`
              : "";
          }
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    },

    async fetchCategories() {
      try {
        const response = await fetch("http://localhost:8000/api/categories/", {
          method: "GET",
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          this.categories = data;
          // console.log("Categories:", data);
        } else {
          console.error("Failed to fetch categories");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    },

    async saveUserProfile() {
      if (!this.editableUser) {
        return;
      }
      try {
        const formData = new FormData();
        formData.append("email", this.editableUser.email);
        formData.append("date_of_birth", this.editableUser.date_of_birth ?? "");
        this.editableUser.favorite_categories.forEach((catId: any) => {
          formData.append("favorite_categories", String(catId));
        });
        if (this.editableUser.profileImageFile) {
          formData.append(
            "profile_image",
            this.editableUser.profileImageFile,
            this.editableUser.profileImageFile.name
          );
        }
        const response = await fetch(
          "http://localhost:8000/api/profile/update",
          {
            method: "POST",
            credentials: "include",
            body: formData,
          }
        );

        if (response.ok) {
        } else {
          console.error("Failed to update user profile");
        }
      } catch (error) {
        console.error("Error updating user profile:", error);
      }
    },

    previewImage(event: Event) {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files[0]) {
        const file = input.files[0];
        this.tempProfileImageUrl = URL.createObjectURL(file);
        if (this.editableUser) {
          this.editableUser.profileImageFile = file;
        }
      }
    },

    getFavoriteCategoryNames() {
      if (
        !this.editableUser ||
        !this.editableUser.favorite_categories ||
        this.editableUser.favorite_categories.length === 0
      ) {
        return "No favorite categories selected.";
      }

      const favoriteCategoryNames = this.editableUser.favorite_categories.map(
        (categoryId: any) => {
          const category = this.categories.find(
            (cat: { id: any }) => cat.id === categoryId
          );
          return category ? category.name : "Unknown";
        }
      );

      return favoriteCategoryNames.join(", ");
    },
    async fetchArticleById(articleId: number) {
      try {
        const response = await fetch(
          `http://localhost:8000/article/${articleId}`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();

          this.fetchedArticle = data;

          await this.fetchAllArticleComments(articleId);
        } else {
          console.error("Error fetching article by ID");
        }
      } catch (error) {
        console.error("Error fetching article by ID:", error);
      }
    },

    async logout() {
      try {
        const response = await fetch("http://localhost:8000/logout/", {
          method: "POST",
          credentials: "include",
        });

        if (response.ok) {
          window.location.href = "http://localhost:8000/";
        } else {
          console.error("Logout failed:", response.status, response.statusText);
        }
      } catch (error) {
        console.error("Logout failed:", error);
      }
    },
  },
});
