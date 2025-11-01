from django.urls import path
from . import views

urlpatterns = [
    path("clients/", views.ClientView.as_view(), name="clients"),
    path("leasing-item/", views.LeasingItemView.as_view(), name="leasing-item-view"),
    path("leasing-agreement/", views.LeasingAgreementView.as_view(), name="leasing-agreement-view"),
    path("closing-agreement/", views.ClosingLeasingView.as_view(), name="closing-leasing-agreement-view"),
    path("anketa/docx/", views.GenerateAnketaDocxView.as_view(), name="document-docx"),
    path("leasing-closing/docx/", views.GenerateLeasingClosingDocxView.as_view(), name="document-docx"),
    path("application-for-transfer/docx/", views.GenerateApplicationForTransfer.as_view(), name="document-docx"),
    path("dfa/docx/", views.GenerateDfaDocxView.as_view(), name="document-docx"),
    path("login/", views.LoginStatusView.as_view(), name="login"),
    path("logout/", views.LogoutStatusView.as_view(), name="logout"),

    path("anketa/pdf/", views.GenerateAnketaPdfView.as_view(), name="document-pdf"),
    path("leasing-closing/pdf/", views.GenerateLeasingClosingPdfView.as_view(), name="document-pdf"),
    path("application-for-transfer/pdf/", views.GenerateApplicationForTransferPdf.as_view(), name="document-pdf"),
    path("dfa/pdf/", views.GenerateDfaPdfView.as_view(), name="document-pdf"),
]

