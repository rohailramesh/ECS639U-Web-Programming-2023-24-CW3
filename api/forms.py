from django import forms
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from .models import AbsUser, Category


class CustomUserCreationForm(UserCreationForm):
    email = forms.EmailField(required=True)
    date_of_birth = forms.DateField(
        required=True, widget=forms.widgets.DateInput(attrs={"type": "date"})
    )
    profile_image = forms.ImageField(required=True)
    favorite_categories = forms.ModelMultipleChoiceField(
        queryset=Category.objects.all(),
        widget=forms.CheckboxSelectMultiple,
        required=False,
        label="Select Your Favorite Categories",
    )

    class Meta:
        model = AbsUser
        fields = (
            "username",
            "email",
            "date_of_birth",
            "favorite_categories",
            "profile_image",
            "password1",
            "password2",
        )

    def save(self, commit=True):
        user = super().save(commit=False)
        user.email = self.cleaned_data["email"]
        user.date_of_birth = self.cleaned_data["date_of_birth"]
        user.profile_image = self.cleaned_data["profile_image"]
        if commit:
            user.save()
            for category in self.cleaned_data["favorite_categories"]:
                user.favorite_categories.add(category)
            user.save()

        return user


class CustomUserChangeForm(UserChangeForm):
    class Meta:
        model = AbsUser
        fields = ["email", "date_of_birth", "profile_image", "favorite_categories"]

    def save(self, commit=True):
        user = super().save(commit=False)

        if commit:
            user.save()
            self.save_m2m()

        return user
