from django.db import models

# ======= ESTRUTURA PARA O BANCO DE DADOS DAS COTACOES ======= #
class Cotacao(models.Model):
    data = models.DateField()
    moeda = models.TextField(max_length=3)
    valor = models.DecimalField(max_digits=20, decimal_places=6)

    class Meta:
        unique_together = ('data', 'moeda')
        ordering = ['data', 'moeda']
        verbose_name = "Cotação"
        verbose_name_plural = "Cotações" 

    def __str__(self):
        return f"{self.moeda} - {self.data}: {self.valor}"
