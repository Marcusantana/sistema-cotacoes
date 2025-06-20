from django.contrib import admin
from .models import Cotacao


@admin.register(Cotacao)
class CotacaoAdmin(admin.ModelAdmin):
    list_display = ('data', 'moeda', 'valor')
    list_filter = ('moeda', 'data')
    search_fields = ('moeda',)