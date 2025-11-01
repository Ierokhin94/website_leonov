from django.contrib import admin
from .models import ClientModel, LeasingItemModel, LeasingAgreementModel, ClosingLeasingModel

admin.site.register(ClientModel)
admin.site.register(LeasingItemModel)
admin.site.register(LeasingAgreementModel)
admin.site.register(ClosingLeasingModel)
