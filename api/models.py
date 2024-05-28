from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.


class Category(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class AbsUser(AbstractUser):
    email = models.EmailField(unique=False, null=True, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    profile_image = models.ImageField(upload_to="media/", null=True, blank=True)
    favorite_categories = models.ManyToManyField(Category)

    def __str__(self):
        return self.username


class Profile(models.Model):
    user = models.OneToOneField(AbsUser, on_delete=models.CASCADE)
    profile_image = models.ImageField(upload_to="media/")
    favorite_categories = models.ManyToManyField(Category)


class Article(models.Model):
    title = models.CharField(max_length=255)
    content = models.TextField()
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    article_image = models.ImageField(upload_to="media/", null=True, blank=True)

    def __str__(self):
        return self.title


class Comment(models.Model):
    user = models.ForeignKey(AbsUser, on_delete=models.CASCADE)
    article = models.ForeignKey(Article, on_delete=models.CASCADE)
    parent_comment = models.ForeignKey(
        "self", on_delete=models.CASCADE, null=True, blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    content = models.TextField()

    def __str__(self):
        return f"{self.user.username} - {self.article.title} - {self.content}"
