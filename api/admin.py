from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import AbsUser, Category, Profile, Article, Comment


class AbsUserAdmin(BaseUserAdmin):
    fieldsets = BaseUserAdmin.fieldsets + (
        (None, {"fields": ("date_of_birth", "profile_image", "favorite_categories")}),
    )

    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        (None, {"fields": ("date_of_birth", "profile_image", "favorite_categories")}),
    )


# Register your models here
admin.site.register(AbsUser, AbsUserAdmin)
admin.site.register(Category)
admin.site.register(Profile)
admin.site.register(Article)
admin.site.register(Comment)
