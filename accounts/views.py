from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.db import IntegrityError, transaction
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.core.mail import send_mail
from django.urls import reverse
from django.contrib.auth.decorators import login_required

from .forms import RegistrationForm


# =========================
# USER REGISTRATION
# =========================

def register(request):
    if request.method == 'POST':
        form = RegistrationForm(request.POST)

        if form.is_valid():
            try:
                with transaction.atomic():
                    user = form.save(commit=False)

                    # User must verify email before logging in
                    user.is_active = False
                    user.save()

            except IntegrityError:
                form.add_error(
                    None,
                    "This username or email is already registered. "
                    "Please try another."
                )

            else:
                # Generate verification link
                uid = urlsafe_base64_encode(force_bytes(user.pk))
                token = default_token_generator.make_token(user)

                verification_url = request.build_absolute_uri(
                    reverse(
                        'verify_email',
                        kwargs={
                            'uidb64': uid,
                            'token': token
                        }
                    )
                )

                # Send verification email
                send_mail(
                    subject='Verify Your College Portal Account',
                    message=f"""
Hello {user.username},

Thank you for registering on the College Portal.

Please verify your email address by clicking the link below:

{verification_url}

If you did not create this account, please ignore this email.

Regards,
College Portal Team
""",
                    from_email='webmaster@localhost',
                    recipient_list=[user.email],
                    fail_silently=False,
                )

                return render(
                    request,
                    'accounts/registration_success.html'
                )

    else:
        form = RegistrationForm()

    return render(
        request,
        'accounts/register.html',
        {'form': form}
    )


# =========================
# EMAIL VERIFICATION
# =========================

def verify_email(request, uidb64, token):

    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)

    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None

    if user is not None and default_token_generator.check_token(user, token):

        user.is_active = True
        user.save()

        return render(
            request,
            'accounts/email_verified.html'
        )

    return render(
        request,
        'accounts/verification_failed.html'
    )


# =========================
# USER PROFILE
# =========================

@login_required
def profile(request):
    return render(
        request,
        'accounts/profile.html',
        {'user': request.user}
    )