"""
    Decorator is a tag that you stablish above a function, indicating privileges or restrictions for execute it
    In this case, decorators indicate what type of role is allowed for execute a function. 
    This decorators you can tag with @admin_required, @holder_required, @consumer_required, above the functions.
"""

from rest_framework.response import Response

def admin_required(func):
    def wrapper(self, request, *args, **kwargs):
        user = request.user
        if user.role != 'admin':
            return Response({'error': 'Only admin can execute this view'})
        return func(self, request, *args, **kwargs)
    return wrapper

def holder_required(func):
    def wrapper(self, request, *args, **kwargs):
        user = request.user
        if user.role != 'holder':
            return Response({'error': 'Only subject can execute this view'})
        return func(self, request, *args, **kwargs)
    return wrapper

def consumer_required(func):
    def wrapper(self, request, *args, **kwargs):
        user = request.user
        if user.role != 'consumer':
            return Response({'error': 'Only consumer can execute this view'})
        return func(self, request, *args, **kwargs)
    return wrapper
