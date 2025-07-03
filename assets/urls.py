from django.urls import path, include
from rest_framework import routers
from .views import FixedDepositViewSet

router = routers.DefaultRouter()
router.register(r'deposits', FixedDepositViewSet, basename='deposit')

urlpatterns = [
    # URL patterns for Fixed Deposit API
    path('api/', include(router.urls))
]