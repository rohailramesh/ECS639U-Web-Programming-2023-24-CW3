from django.conf import settings
from django.urls import path
from . import views
from .views import eachNewsArticleView
from django.conf.urls.static import static
from .views import list_categories, edit_comment


urlpatterns = [
    # user related views
    path("", views.login_view, name="login"),
    path("signup/", views.signup_view, name="signup"),
    path("api/profile/", views.UserProfileView.as_view(), name="user-profile"),
    path("logout/", views.logout_view, name="logout"),
    path("images/", views.getImage),
    path("api/profile/update", views.update_user_details, name="update-user-profile"),
    # articles and categoires related views
    path(
        "articles/",
        views.ArticleListCreateAPIView.as_view(),
        name="article-list-create",
    ),
    path("article/<int:article_id>/", eachNewsArticleView.as_view(), name="article"),
    path(
        "get_user_favorite_articles/",
        views.get_user_favorite_articles,
        name="user_favorite_categories",
    ),
    path("api/categories/", list_categories, name="list-categories"),
    # article comments related views
    path(
        "articles/<int:article_id>/user-comments/",
        views.get_comments,
        name="article-comments",
    ),
    path(
        "api/<int:article_id>/submit-comment/",
        views.create_comment,
        name="create-comment",
    ),
    path("comments/<int:comment_id>/edit", edit_comment, name="edit-comment"),
    path(
        "comments/<int:comment_id>/delete", views.delete_comment, name="delete-comment"
    ),
    path(
        "comments/<int:article_id>/reply/<int:parent_comment_id>",
        views.reply_to_comment,
        name="reply-to-comment",
    ),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# test comment to remove
