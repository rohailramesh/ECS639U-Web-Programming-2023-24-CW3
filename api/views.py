from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.shortcuts import render
from django.contrib.auth import authenticate, login as auth_login
from django.urls import reverse
from api.models import Article
from .forms import CustomUserChangeForm, CustomUserCreationForm
from django.contrib.auth.forms import AuthenticationForm
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import ArticleSerializer, CategorySerializer, CommentSerializer
from rest_framework.permissions import IsAuthenticated
from .models import AbsUser, Category, Article, Comment
from .serializers import UserSerializer
from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import logout
from django.contrib import messages
import json


# -----------------------------------------
# User related functions
class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


def signup_view(request):
    if request.method == "POST":
        form = CustomUserCreationForm(request.POST, request.FILES)
        if form.is_valid():
            user = form.save()
            messages.success(request, "Signup successful. Please log in.")
            return redirect("login")
    else:
        form = CustomUserCreationForm()
    return render(request, "signup.html", {"form": form})


def login_view(request):
    if request.method == "POST":
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            username = form.cleaned_data.get("username")
            password = form.cleaned_data.get("password")
            user = authenticate(username=username, password=password)
            if user is not None:
                auth_login(request, user)
                return redirect("http://localhost:5173/")
    else:
        form = AuthenticationForm()
    return render(request, "login.html", {"form": form})


@csrf_exempt
def logout_view(request):
    logout(request)
    return redirect(reverse("login"))


@csrf_exempt
def update_user_details(request) -> JsonResponse:
    user = request.user
    form = CustomUserChangeForm(request.POST, request.FILES, instance=user)
    if form.is_valid():
        user_obj = form.save(commit=False)
        user_obj.save()

        if "favorite_categories" in request.POST:
            categories_ids = request.POST.getlist("favorite_categories")
            user_obj.favorite_categories.set(categories_ids)

        return JsonResponse({"status": "success"}, status=200)
    else:
        return JsonResponse(form.errors, status=400)


# -----------------------------------------------------
# Articles and categories related views
def getImage(self, request):
    profile = AbsUser.objects.get_or_create(user=request.user)[0]
    image = profile.Profile_image.all()
    serializer = UserSerializer(image)
    return Response(serializer.data)


@csrf_exempt
def get_user_favorite_articles(request):
    user = request.user
    if user.is_authenticated:
        profile = AbsUser.objects.get_or_create(username=user)[0]
        favorite_categories = profile.favorite_categories.all()
        articles = Article.objects.filter(category__in=favorite_categories)
        serializer = ArticleSerializer(articles, many=True)
        return JsonResponse(serializer.data, safe=False)
    else:
        return JsonResponse({"error": "User not authenticated"}, status=401)


class GetUserFavoriteArticlesAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile = AbsUser.objects.get_or_create(user=request.user)[0]
        favorite_categories = profile.favorite_categories.all()
        articles = Article.objects.filter(category__in=favorite_categories)
        serializer = ArticleSerializer(articles, many=True)
        return Response(serializer.data)


class ArticleListCreateAPIView(APIView):
    def get(self, request):
        articles = Article.objects.all()
        serializer = ArticleSerializer(articles, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ArticleSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class eachNewsArticleView(APIView):
    def get(self, request, article_id):
        article = Article.objects.get(id=article_id)
        serializer = ArticleSerializer(article)
        return Response(serializer.data)


@api_view(["GET"])
def list_categories(request):
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)


# --------------------------------------------------------------------------

# CRUD Operations for Comment functionality


@csrf_exempt
def create_comment(request, article_id):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            content = data.get("content", "").strip()

            if not content:
                return JsonResponse(
                    {"error": "Comment content cannot be empty"}, status=400
                )

            try:
                article = Article.objects.get(id=article_id)
            except Article.DoesNotExist:
                return JsonResponse({"error": "Article not found"}, status=404)

            # Create the comment
            Comment.objects.create(user=request.user, article=article, content=content)
            return JsonResponse({"status": "success"})

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)
    else:
        return JsonResponse({"error": "Invalid request method"}, status=405)


@api_view(["GET"])
def get_comments(request, article_id):
    comments = Comment.objects.filter(article_id=article_id)
    serializer = CommentSerializer(comments, many=True)
    return Response(serializer.data)


@api_view(["PUT"])
@csrf_exempt
def edit_comment(request, comment_id):
    try:
        comment = Comment.objects.get(id=comment_id, user=request.user)
        data = json.loads(request.body)
        comment.content = data.get("content", "").strip()
        if not comment.content:
            return JsonResponse(
                {"error": "Comment content cannot be empty"}, status=400
            )
        comment.save()
        return JsonResponse({"status": "success"})
    except Comment.DoesNotExist:
        return JsonResponse(
            {"error": "Comment not found or not authorized"}, status=404
        )


@api_view(["DELETE"])
@csrf_exempt
def delete_comment(request, comment_id):
    try:
        comment = Comment.objects.get(id=comment_id, user=request.user)
        comment.delete()
        return JsonResponse({"status": "success"})
    except Comment.DoesNotExist:
        return JsonResponse(
            {"error": "Comment not found or not authorized"}, status=404
        )


@csrf_exempt
def reply_to_comment(request, article_id, parent_comment_id):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            content = data.get("content", "").strip()

            if not content:
                return JsonResponse(
                    {"error": "Reply content cannot be empty"}, status=400
                )

            try:
                parent_comment = Comment.objects.get(id=parent_comment_id)
                article = Article.objects.get(id=article_id)
            except Comment.DoesNotExist:
                return JsonResponse({"error": "Parent comment not found"}, status=404)
            except Article.DoesNotExist:
                return JsonResponse({"error": "Article not found"}, status=404)

            Comment.objects.create(
                user=request.user,
                article=article,
                content=content,
                parent_comment=parent_comment,
            )
            return JsonResponse({"status": "success"})

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)
    else:
        return JsonResponse({"error": "Invalid request method"}, status=405)
