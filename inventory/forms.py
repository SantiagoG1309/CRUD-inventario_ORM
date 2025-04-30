from django import forms

class ProductoForm(forms.Form):
    nombre = forms.CharField(max_length=100, required=True)
    descripcion = forms.CharField(max_length=255, required=False, widget=forms.Textarea)
    cantidad = forms.IntegerField(min_value=0)
    precio = forms.FloatField(min_value=0.0)