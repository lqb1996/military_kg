from django.conf.urls import url
from . import views
from django.contrib.staticfiles import views as static_views

app_name = 'kg'
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    # url(r'^add/((?:-|\d)+)/((?:-|\d)+)/$', views.add, name='add'),
    # url(r'^static/(?P<path>.*)$', static_views.serve, name='static'),
    # url(r'^remove_action(?P<nid>[a-z0-9]{24})/$',views.remove_action,name='remove_action'),
    # url(r'^modify_action(?P<id>[a-z0-9]{24})/$', views.modify_action, name='modify_action'),
    # url(r'^add/action$', views.add_action,name='add_action'),
    url(r'^$', views.login, name='login'),
    url(r'^index/$', views.index),
    url(r'^temp/$', views.temp),
    url(r'^login/$', views.login, name='login'),

    url(r'^saveDB_settings_user/(.*)/(.*)/(.*)/$', views.saveDB_settings_user,
        name='saveDB_settings_user')

]
# (?P<id>[a-z0-9]{24})/(?P<subject>\w+)/(?P<predicate>\w+)/(?P<object>\w+)
