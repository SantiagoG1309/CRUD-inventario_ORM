from django.shortcuts import render, redirect
from django.contrib import messages
from .models import Producto
from .forms import ProductoForm
from .database import session_scope

def lista_productos(request):
    with session_scope() as session:
        productos = session.query(Producto).all()
        return render(request, 'inventory/lista_productos.html', {'productos': productos})

def crear_producto(request):
    if request.method == 'POST':
        form = ProductoForm(request.POST)
        if form.is_valid():
            with session_scope() as session:
                producto = Producto(
                    nombre=form.cleaned_data['nombre'],
                    descripcion=form.cleaned_data['descripcion'],
                    cantidad=form.cleaned_data['cantidad'],
                    precio=form.cleaned_data['precio']
                )
                session.add(producto)
                messages.success(request, 'Producto creado exitosamente')
                return redirect('lista_productos')
    else:
        form = ProductoForm()
    return render(request, 'inventory/crear_producto.html', {'form': form})

def editar_producto(request, producto_id):
    with session_scope() as session:
        producto = session.query(Producto).get(producto_id)
        if request.method == 'POST':
            form = ProductoForm(request.POST)
            if form.is_valid():
                producto.nombre = form.cleaned_data['nombre']
                producto.descripcion = form.cleaned_data['descripcion']
                producto.cantidad = form.cleaned_data['cantidad']
                producto.precio = form.cleaned_data['precio']
                messages.success(request, 'Producto actualizado exitosamente')
                return redirect('lista_productos')
        else:
            form = ProductoForm(initial={
                'nombre': producto.nombre,
                'descripcion': producto.descripcion,
                'cantidad': producto.cantidad,
                'precio': producto.precio
            })
        return render(request, 'inventory/editar_producto.html', {'form': form, 'producto': producto})

def eliminar_producto(request, producto_id):
    with session_scope() as session:
        producto = session.query(Producto).get(producto_id)
        if request.method == 'POST':
            session.delete(producto)
            messages.success(request, 'Producto eliminado exitosamente')
            return redirect('lista_productos')
        return render(request, 'inventory/eliminar_producto.html', {'producto': producto})
