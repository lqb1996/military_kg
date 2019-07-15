# encoding='utf-8'
# _*_ coding:utf-8 _*_
from django.shortcuts import render, redirect
from django.http import HttpResponse, HttpResponseRedirect
from pymongo import MongoClient
from django.conf import settings
# from django.views.decorators.csrf import csrf_exempt, csrf_protect  # Add this
from bson.objectid import ObjectId
import sys
import json
import requests
from bson import json_util as jsonb
import datetime
import os
import configparser
sys.path.append(r'F:\eclipse-workspace\kg_mil_process')
from script import 非结构化知识抽取 as Non
from script.半结构化环球军事网抽取 import equipment, extract_structure, syn_words
from script import 多源知识融合 as mul_res


'''
#从settings文件中获取数据库配置信息
client = MongoClient(settings.CLIENT_URI)
# client = MongoClient('mongodb://localhost:32017/')
# client.admin.authenticate(settings.DB_USERNAME,settings.DB_PASSWORD,mechanism='SCRAM-SHA-1')
db = client[settings.DB_NAME]
'''


progressSession = None  # session记录进度
newProgress = True


# This skips csrf validation. Use csrf_protect to have validation
def index(request):

    ets = {}
    # if triples_editable=='True':
    #     ets.append('triples')
    # if entities_editable=='True':
    #     ets.append('entities')
    # if ment2ent_editable=='True':
    #     ets.append('ment2ent')
    # if types_editable=='True':
    #     ets.append('types')
    # ets.append('triples')
    name = '歼-16'
    pro = '名称'
    selection = ['歼-16战机', '歼16战机']

    ets['name'] = name
    ets['pro'] = pro
    ets['selection'] = selection

    return render(request, "kg/index.html", {"ets": ets})


def half_structure_equ(request):
    e = equipment.get_equ()
    e = json.dumps({'equ': e}, ensure_ascii=False)
    return HttpResponse(e)


def half_structure_ext(request):
    ext = extract_structure.extract_structure()
    ext = ext.jsonpro
    ext = json.dumps({'ext': ext}, ensure_ascii=False)
    return HttpResponse(ext)


def half_structure_syn(request):
    syn = syn_words.gen_word()
    # print(syn.syn_list)
    syn = syn.syn_list
    syn = json.dumps({'syn': syn}, ensure_ascii=False)
    return HttpResponse(syn)


def half_structure_post(request):
    return 0


def get_mixed(request):
    print(mul_res.django_return())
    return mul_res.django_return()


def non_structure(request):
    non_structure_content = Non.get_data()
    non_structure_content = json.dumps({'non_structure_content': non_structure_content}, ensure_ascii=False)
    return HttpResponse(non_structure_content)


def show_vector(request):
    if request.method == 'GET':
        name = request.GET.get('name', default='F-22')
        url = "http://192.168.12.102:8888/cgi-bin/get_similar_target.py"
        querystring = {"name": name}
        headers = {
            'Content-Type': "application/x-www-form-urlencoded",
            'User-Agent': "PostmanRuntime/7.15.0",
            'Accept': "*/*",
            'Cache-Control': "no-cache",
            'Postman-Token': "8bf8ea43-fe7c-4945-999c-0c9201e7130c,b771d6b5-136d-4356-8025-73d8966fa9d7",
            'Host': "192.168.12.102:8888",
            # 'Content-Type': 'application/json;charset=UTF-8',
            'accept-encoding': "gzip, deflate",
            'Connection': "keep-alive",
            'cache-control': "no-cache"
        }
        response = requests.request("GET", url, headers=headers, params=querystring)
        # print(response.encoding)
        vector_content = response.text.encode(response.encoding).decode(response.apparent_encoding)
        vector_content = json.dumps({'vector_content': vector_content}, ensure_ascii=False)
        return HttpResponse(vector_content)
    return HttpResponse(0)


def temp(request):
    return render(request, "kg/temp.html")


def settings(request):

    server = {'DB_NAME':DB_NAME,'DB_HOST':DB_HOST,'DB_PORT':DB_PORT,'DB_USERNAME':DB_USERNAME,'DB_PASSWORD':DB_PASSWORD}
    user = {'userTableName':userTableName,'user_username':user_username,'user_password':user_password}
    triples = {'triplesTableName':triplesTableName,'triples_s':triples_s,'triples_p':triples_p,'triples_o':triples_o,
             'triples_timestamp':triples_timestamp,'triples_editable':triples_editable}
    ment2ent = {'ment2entTableName':ment2entTableName,'ment2ent_m':ment2ent_m,'ment2ent_e':ment2ent_e,'ment2ent_strategy':ment2ent_strategy,
              'ment2ent_reason':ment2ent_reason,'ment2ent_timestamp':ment2ent_timestamp,'ment2ent_editable':ment2ent_editable}
    entities = {'entitiesTableName':entitiesTableName,'entities_id':entities_id,'entities_timestamp':entities_timestamp,'entities_editable':entities_editable}
    types = {'typesTableName':typesTableName,'types_entity':types_entity,'types_type':types_type,'types_timestamp':types_timestamp,
           'types_editable':types_editable}
    print(148, server)
    res = {'server': server, 'user': user, 'triples': triples, 'ment2ent': ment2ent, 'entities': entities, 'types': types}
    return render(request, "kg/settings.html",{'res':res})


def getLink(request, s):
    res = batch.getLink(s)
    link = res[1]
    linkStr = jsonb.dumps(link)
    return HttpResponse(linkStr)


def getProgress(request):
    global progressSession
    if progressSession == None:
        return HttpResponse('0')
    print(83, progressSession['progress'])
    if progressSession['progress'] == 1:
        print(84, '当前导入任务结束', progressSession['progress'])
        progressSession = None
        return HttpResponse('1')
    return HttpResponse(str(progressSession['progress']))


def upload(request, type, needLink):
    file = request.FILES.get('file')
    fileDir = os.path.join('static', file.name)
    f = open(os.path.join('static', file.name), 'wb')
    for chunk in file.chunks(chunk_size=1024):
        f.write(chunk)
    f.close()
    fin = open(fileDir, 'r', encoding='utf-8')
    content = fin.read().encode('utf-8')

    global progressSession
    progressSession = request.session
    request.session['progress'] = 0

    if type == 'triples':
        if needLink == 'true':
            res = batch.insertTriple(triplesTable, entitiesTable, fileDir, request.session)
        else:
            res = batch.insertTripleNoLink(fileDir, request.session)
        return HttpResponse(res)
    elif type == 'ment2ent':
        res = batch.insertMent2ent(ment2entTable, entitiesTable, fileDir, request.session)
        return HttpResponse(res)
    elif type == 'types':
        res = batch.insertType(typesTable, entitiesTable, fileDir, request.session)
        return HttpResponse(res)
    elif type == 'entities':
        exists = batch.insertEntity(entitiesTable, fileDir, request.session)
        return HttpResponse(exists)
    return HttpResponse(content)


# @csrf_exempt
def login(request):
    user = request.POST.get('user')
    pwd = request.POST.get('pwd')
    print(user, pwd)
    cnt = 0
    if user == 'admin' and pwd == 'admin':
        cnt = 1
    print(156, cnt)
    if cnt != 0:
        print(request.COOKIES)
        obj = redirect("/kg/index")
        obj.set_cookie("isLogin", True)
        obj.set_cookie("username", user)
        print(obj)
        return obj


    else:

        return render(request, 'kg/login.html')


def saveDB_settings_user(request,_userTableName,_user_username,_user_password):
    res=''
    print(db[userTableName].find().count())
    if db[userTableName].find().count()>0:
        res='用户表'+userTableName+'已存在，修改失败！'
        return HttpResponse(res)

    cf.set("tableName", "userTableName", _userTableName)
    cf.set("user", "user_username", _user_username)
    cf.set("user", "user_password", _user_password)
    cf.write(open(dbConfigFile, "r+"))
    res = 'saveDB_settings_user success'
    return HttpResponse(res)



