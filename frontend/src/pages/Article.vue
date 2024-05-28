<template>
  <main class="container mt-5">
    <div v-if="article">
      <!-- Article Card -->
      <div class="article-content">
        <h2 class="article-title">{{ article.title }}</h2>
        <p class="article-meta">
          Category: {{ getCategoryName(article.category) }}
        </p>
        <img
          :src="
            article.article_image ||
            article.tempArticleImageUrl ||
            article.articleImageUrl
          "
          alt="Article Image"
          class="article-img"
        />
        <p class="article-text">{{ article.content }}</p>
      </div>

      <!-- Comments Card -->
      <div class="comment-content">
        <div class="comment-content">
          <div v-if="comments && comments.length > 0">
            <h3 class="mt-3 mb-3">Comments:</h3>
            <ul class="list-unstyled">
              <li
                v-for="comment in sortedComments"
                :key="comment.id"
                class="mb-3"
              >
                <div class="d-flex">
                  <div class="flex-shrink-0">
                    <div class="avatar-circle text-white">
                      {{ comment.user.charAt(0).toUpperCase() }}
                    </div>
                  </div>
                  <div class="flex-grow-1 ms-2">
                    <strong>{{ comment.user }}:</strong> {{ comment.content }}
                  </div>
                  <div>
                    <button
                      v-if="isCurrentUserComment(comment)"
                      class="btn btn-primary btn-sm ml-2 ms-1 my-1"
                      @click="deleteComment(comment.id, article.id)"
                    >
                      Delete
                    </button>
                    <button
                      v-if="isCurrentUserComment(comment)"
                      class="btn btn-primary btn-sm ml-2 ms-1 my-1"
                      @click="enableEdit(comment)"
                    >
                      Edit
                    </button>
                    <button
                      class="btn btn-primary btn-sm ml-2 ms-1 my-1"
                      @click="enableReply(comment)"
                    >
                      Reply
                    </button>
                  </div>
                </div>

                <!-- Reply Form -->
                <div v-if="comment.showReplyForm" class="mt-3">
                  <textarea
                    v-model="comment.replyContent"
                    class="form-control"
                    rows="2"
                    placeholder="Your reply..."
                  ></textarea>
                  <button
                    class="btn btn-primary btn-sm mt-2"
                    @click="submitReplyOrNestedReply(comment, article.id)"
                  >
                    Submit Reply
                  </button>
                  <button
                    class="btn btn-secondary btn-sm mt-2 ml-2"
                    @click="cancelReply(comment)"
                  >
                    Cancel Reply
                  </button>
                </div>

                <!-- Edit Form -->
                <div v-if="comment.editing" class="mt-3">
                  <textarea
                    v-model="comment.editedContent"
                    class="form-control"
                    placeholder="Edit your comment..."
                  ></textarea>
                  <button
                    class="btn btn-primary btn-sm mt-2"
                    @click="saveEdit(comment, article.id)"
                  >
                    Save
                  </button>
                  <button
                    class="btn btn-secondary btn-sm mt-2 ml-2"
                    @click="cancelEdit(comment)"
                  >
                    Cancel
                  </button>
                </div>

                <!-- Display replies in a threaded format -->
                <ul v-if="comment.showReplies" class="list-unstyled ml-4">
                  <li
                    v-for="reply in comment.replies"
                    :key="reply.id"
                    class="mb-2 ms-4"
                  >
                    <div class="d-flex">
                      <div class="flex-shrink-0">
                        <div class="avatar-circle text-white">
                          {{ reply.user.charAt(0).toUpperCase() }}
                        </div>
                      </div>
                      <div class="flex-grow-1 ms-2">
                        <strong>{{ reply.user || "Anonymous" }}:</strong>
                        {{ reply.content }}
                      </div>
                      <div>
                        <button
                          v-if="isCurrentUserComment(reply)"
                          class="btn btn-primary btn-sm ml-2 ms-1 my-1"
                          @click="deleteComment(reply.id, article.id)"
                        >
                          Delete
                        </button>
                        <button
                          v-if="isCurrentUserComment(reply)"
                          class="btn btn-primary btn-sm ml-2 ms-1 my-1"
                          @click="enableEdit(reply)"
                        >
                          Edit
                        </button>
                        <button
                          class="btn btn-primary btn-sm ml-2 ms-1 my-1"
                          @click="enableReply(reply)"
                        >
                          Reply
                        </button>
                      </div>
                    </div>

                    <!-- Reply Form for nested replies -->
                    <div v-if="reply.showReplyForm" class="mt-3">
                      <textarea
                        v-model="reply.replyContent"
                        class="form-control"
                        rows="2"
                        placeholder="Your reply..."
                      ></textarea>
                      <button
                        class="btn btn-primary btn-sm mt-2"
                        @click="submitReplyOrNestedReply(reply, article.id)"
                      >
                        Submit Reply
                      </button>
                      <button
                        class="btn btn-secondary btn-sm mt-2 ml-2"
                        @click="cancelReply(reply)"
                      >
                        Cancel Reply
                      </button>
                    </div>

                    <!-- Edit Form for nested replies -->
                    <div v-if="reply.editing" class="mt-3">
                      <textarea
                        v-model="reply.editedContent"
                        class="form-control"
                        placeholder="Edit your reply..."
                      ></textarea>
                      <button
                        class="btn btn-primary btn-sm mt-2"
                        @click="saveEdit(reply, article.id)"
                      >
                        Save
                      </button>
                      <button
                        class="btn btn-secondary btn-sm mt-2 ml-2"
                        @click="cancelEdit(reply)"
                      >
                        Cancel
                      </button>
                    </div>
                  </li>
                </ul>

                <!-- View Replies button -->
                <button
                  v-if="comment.replies && comment.replies.length > 0"
                  type="button"
                  class="btn btn-link text-muted"
                  @click="toggleReplies(comment)"
                >
                  {{ comment.showReplies ? "Hide Replies" : "View Replies" }}
                </button>
              </li>
            </ul>
          </div>

          <!-- Display loading message while comments are being fetched -->
          <div v-else>
            <p>No comments. Be the first to comment!</p>
          </div>

          <!-- Form for adding a new comment -->
          <form @submit.prevent="submitNewComment" class="mt-2">
            <textarea
              v-model="newCommentContent"
              class="form-control"
              rows="3"
              placeholder="Add a comment..."
            ></textarea>
            <button type="submit" class="btn btn-primary mt-2">
              Submit Comment
            </button>
          </form>
        </div>
      </div>
    </div>

    <div v-else>
      <p>Fetching article...</p>
    </div>
    <router-link to="/" class="btn btn-primary mt-4"
      >Back to All Articles</router-link
    >
  </main>
</template>

<script>
import { useNewsPaperStore } from "../store/NewsPaperStore";
import { useArticleCommentsStore } from "../store/ArticleCommentsStore";

export default {
  data() {
    return {
      article: null,
      comments: null,
      newCommentContent: "",
      sortedComments: [],
      favorite_categories: [],
      currentUser: null,
    };
  },
  mounted() {
    this.fetchData();
    this.fetchCurrentUser();
  },
  methods: {
    async fetchData() {
      const newsPaperStore = useNewsPaperStore();
      const articleCommentsStore = useArticleCommentsStore();
      const articleId = this.$route.params.id;

      try {
        // Fetch the article using the NewsPaperStore
        await newsPaperStore.fetchArticleById(articleId);
        await newsPaperStore.fetchCategories();
        // Fetch comments for the article
        await articleCommentsStore.fetchArticleComments(articleId);
        console.log("Fetched Categories:", newsPaperStore.categories);
        this.article = newsPaperStore.fetchedArticle;
        this.comments = articleCommentsStore.getComments;
        this.sortedComments = articleCommentsStore.sortComments(this.comments);
      } catch (error) {
        console.error("Error fetching data in Article.vue:", error);
      }
    },
    async fetchCurrentUser() {
      const newsPaperStore = useNewsPaperStore();
      try {
        await newsPaperStore.fetchCurrentUser();
        this.currentUser = newsPaperStore.currentUser;
      } catch (error) {
        console.error("Error fetching current user in Article.vue:", error);
      }
    },
    async submitNewComment() {
      if (this.newCommentContent.trim()) {
        const articleCommentsStore = useArticleCommentsStore();
        await articleCommentsStore.submitComment(
          this.$route.params.id,
          this.newCommentContent.trim()
        );
        this.newCommentContent = "";
        await this.fetchData();
      }
    },
    async deleteComment(commentId, articleId) {
      const articleCommentsStore = useArticleCommentsStore();
      await articleCommentsStore.deleteComment(commentId, articleId);
      await this.fetchData();
    },
    async submitReplyOrNestedReply(comment, articleId) {
      if (comment.replyContent.trim()) {
        const articleCommentsStore = useArticleCommentsStore();

        if (comment.parent_comment) {
          // If it's a reply to a reply, call submitNestedReply
          await articleCommentsStore.submitNestedReply(
            { replyContent: comment.replyContent.trim(), showReplyForm: false },
            articleId,
            comment.parent_comment
          );
        } else {
          // If it's a main comment or a reply to a main comment, call submitReply
          await articleCommentsStore.submitReply(
            {
              replyContent: comment.replyContent.trim(),
              id: comment.id,
              showReplyForm: false,
            },
            articleId
          );
        }

        await this.fetchData();
      }
    },
    isCurrentUserComment(comment) {
      return this.currentUser && comment.user === this.currentUser.username;
    },
    toggleReplies(comment) {
      comment.showReplies = !comment.showReplies;
    },
    enableReply(comment) {
      comment.showReplyForm = true;
    },
    cancelReply(comment) {
      comment.showReplyForm = false;
      comment.replyContent = "";
    },
    enableEdit(comment) {
      comment.editing = true;
      comment.editedContent = comment.content;
    },
    async saveEdit(comment, articleId) {
      if (comment.editedContent.trim()) {
        const articleCommentsStore = useArticleCommentsStore();
        await articleCommentsStore.saveEdit(comment, articleId);
        comment.editing = false;
        await this.fetchData();
      }
    },
    cancelEdit(comment) {
      comment.editing = false;
      comment.editedContent = "";
    },
    getCategoryName(categoryId) {
      const newsPaperStore = useNewsPaperStore();
      const category = newsPaperStore.categories.find(
        (category) => category.id === categoryId
      );

      return category ? category.name : "Unknown Category";
    },
  },
};
</script>

<style scoped>
.avatar-circle {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  display: flex;
  background-color: #043576;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
}

.card-img-top {
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  width: 400px;
  height: auto;
}
.article-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.article-title {
  font-size: 2em;
  margin-bottom: 10px;
}

.article-meta {
  color: #555;
  margin-bottom: 20px;
}

.article-img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin-bottom: 20px;
}

.article-text {
  font-size: 1.1em;
  line-height: 1.6;
  color: #333;
}

.comment-content {
  max-width: 800px;
  margin: 40px auto;
}
</style>
