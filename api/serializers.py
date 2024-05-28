from rest_framework import serializers
from .models import Article, Comment
from rest_framework import serializers
from .models import AbsUser, Category


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = AbsUser
        fields = [
            "username",
            "email",
            "date_of_birth",
            "profile_image",
            "favorite_categories",
        ]
        depth = 1


class ArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Article
        fields = "__all__"


class CommentSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ["id", "user", "article", "content", "parent_comment"]

    def get_user(self, obj):
        return obj.user.username if obj.user else None


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name"]
