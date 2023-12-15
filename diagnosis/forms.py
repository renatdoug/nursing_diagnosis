# diagnosis/forms.py
from django import forms
from .data.lista import sintomas

class DiagnosticoForm(forms.Form):
    sintomas = forms.MultipleChoiceField(
        choices=[(sintoma, sintoma) for sintoma in sintomas],
        widget=forms.SelectMultiple(attrs={'class': 'form-control'})
    )
