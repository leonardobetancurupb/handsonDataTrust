import django_filters
from .models import Person, Policy, Data

class PersonFilter(django_filters.FilterSet):
    name = django_filters.CharFilter(lookup_expr='iexact')
    class Meta:
        model = Person
        fields = ['name']

class PolicyFilter(django_filters.FilterSet):
    name = django_filters.CharFilter(lookup_expr='iexact')
    category=django_filters.CharFilter(lookup_expr='iexact')
    Value=django_filters.CharFilter(lookup_expr='iexact')
    class Meta:
        model = Policy
        fields = ['name','category','Value']

class DataFilter(django_filters.FilterSet):
    name = django_filters.CharFilter(lookup_expr='iexact')
    category=django_filters.CharFilter(lookup_expr='iexact')
    format=django_filters.CharFilter(lookup_expr='iexact')
    idPolicy=django_filters.CharFilter(lookup_expr='iexact')
    class Meta:
        model = Data
        fields = ['name','category','format','idPolicy']
