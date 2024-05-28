import { defineStore } from "pinia";

interface Comment {
  id: number;
  user: string;
  content: string;
}

export const useArticleCommentsStore = defineStore("articleComments", {
  state: () => ({
    comments: [] as Comment[],
    replyingToCommentId: null,
    editingCommentId: null,
    editedCommentContent: "",
  }),

  getters: {
    getComments: (state) => state.comments,
  },

  actions: {
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
    async fetchArticleComments(articleId: number) {
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
          this.comments = comments;
          // console.log(comments);
        } else {
          console.error(`HTTP error! status: ${response.status}`);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    },

    async submitComment(articleId: number, content: string) {
      try {
        const response = await fetch(
          `http://localhost:8000/api/${articleId}/submit-comment/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ content }),
          }
        );

        if (response.ok) {
          await this.fetchArticleComments(articleId);
        } else {
          console.error(`HTTP error! status: ${response.status}`);
        }
      } catch (error) {
        console.error("Error submitting comment:", error);
      }
    },
    async deleteComment(commentId: any, articleId: any) {
      try {
        const response = await fetch(
          `http://localhost:8000/comments/${commentId}/delete`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              "X-CSRFToken": this.getCookie("csrftoken") || "",
            },
            credentials: "include",
          }
        );

        if (response.ok) {
          await this.fetchArticleComments(articleId);
        } else {
          console.error(
            "Error deleting comment - User not authorised:",
            response.status,
            await response.text()
          );
        }
      } catch (error) {
        console.error("Error deleting comment - User not authorised:", error);
      }
    },
    enableReply(comment: { showReplyForm: boolean; id: any }) {
      comment.showReplyForm = true;
      this.replyingToCommentId = comment.id;
    },

    async submitNestedReply(
      reply: { replyContent: string; showReplyForm: boolean },
      articleId: any,
      parentCommentId: any
    ) {
      // console.log("Parent Comment ID:", parentCommentId);

      if (!reply.replyContent.trim()) {
        console.error("Reply cannot be empty");
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:8000/comments/${articleId}/reply/${parentCommentId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ content: reply.replyContent.trim() }),
          }
        );

        if (response.ok) {
          reply.showReplyForm = false;
          await this.fetchArticleComments(articleId);
        } else {
          console.error("Error submitting nested reply");
        }
      } catch (error) {
        console.error("Error submitting nested reply:", error);
      }
    },

    async submitReply(
      comment: { replyContent: string; id: any; showReplyForm: boolean },
      articleId: any
    ) {
      if (!comment.replyContent.trim()) {
        console.error("Reply cannot be empty");
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:8000/comments/${articleId}/reply/${comment.id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ content: comment.replyContent.trim() }),
          }
        );

        if (response.ok) {
          comment.showReplyForm = false;
          this.replyingToCommentId = null;
          await this.fetchArticleComments(articleId);
        } else {
          console.error("Error submitting reply");
        }
      } catch (error) {
        console.error("Error submitting reply:", error);
      }
    },
    enableEdit(comment: { id: any; content: any }) {
      this.editingCommentId = comment.id;
      this.editedCommentContent = comment.content;
    },

    async saveEdit(comment: { id: any; editedContent: any }, articleId: any) {
      try {
        if (!comment.editedContent.trim()) {
          console.error("Edited content cannot be empty");
          return;
        }

        const response = await fetch(
          `http://localhost:8000/comments/${comment.id}/edit`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "X-CSRFToken": this.getCookie("csrftoken") || "",
            },
            credentials: "include",
            body: JSON.stringify({ content: comment.editedContent }),
          }
        );

        if (response.ok) {
          this.editingCommentId = null;
          this.editedCommentContent = "";

          await this.fetchArticleComments(articleId);
        } else {
          console.error("Error updating comment:", await response.text());
        }
      } catch (error) {
        console.error("Error updating comment:", error);
      }
    },

    cancelEdit() {
      this.editingCommentId = null;
      this.editedCommentContent = "";
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
  },
});
