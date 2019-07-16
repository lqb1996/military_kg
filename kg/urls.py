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
    url(r'^half_structure/equipment/$', views.half_structure_equ),
    url(r'^half_structure/extract/$', views.half_structure_ext),
    url(r'^half_structure/syn/$', views.half_structure_syn),
    # url(r'^half_structure/post/$', views.half_structure_post),
    url(r'^non_structure/get/$', views.non_structure),
    url(r'^baike/get/$', views.get_baike),
    url(r'^mix/get/$', views.get_mixed),
    url(r'^vector/get/$', views.show_vector),
    url(r'^temp/$', views.temp),
    url(r'^login/$', views.login, name='login'),

    url(r'^saveDB_settings_user/(.*)/(.*)/(.*)/$', views.saveDB_settings_user,
        name='saveDB_settings_user')

]
# (?P<id>[a-z0-9]{24})/(?P<subject>\w+)/(?P<predicate>\w+)/(?P<object>\w+)
