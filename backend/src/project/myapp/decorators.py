from rest_framework.response import Response

def admin_required(func):
    def wrapper(self, request, *args, **kwargs):
        user = request.user
        if user.role != 'admin':
            return Response({'error': 'Solo los administradores pueden ejecutar esta vista'})
        return func(self, request, *args, **kwargs)
    return wrapper

def holder_required(func):
    def wrapper(self, request, *args, **kwargs):
        user = request.user
        if user.role != 'holder':
            return Response({'error': 'Solo los holders pueden ejecutar esta vista'})
        return func(self, request, *args, **kwargs)
    return wrapper

def consumer_required(func):
    def wrapper(self, request, *args, **kwargs):
        user = request.user
        if user.role != 'consumer':
            return Response({'error': 'Solo los consumer pueden ejecutar esta vista'})
        return func(self, request, *args, **kwargs)
    return wrapper
