# encoding='utf-8'
# _*_ coding:utf-8 _*_
from django.shortcuts import render, redirect
from django.http import HttpResponse, HttpResponseRedirect
from pymongo import MongoClient
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt, csrf_protect  # Add this
from bson.objectid import ObjectId
import json
from bson import json_util as jsonb
import datetime
import os
import configparser
from kg.batch import Batch

'''
#从settings文件中获取数据库配置信息
client = MongoClient(settings.CLIENT_URI)
# client = MongoClient('mongodb://localhost:32017/')
# client.admin.authenticate(settings.DB_USERNAME,settings.DB_PASSWORD,mechanism='SCRAM-SHA-1')
db = client[settings.DB_NAME]
'''



#获取配置文件中的数据库配置信息
dbConfigFile="kg/db.ini"
cf = configparser.ConfigParser()
cf.read(dbConfigFile)
DB_NAME=cf['db']['DB_NAME']
DB_HOST=cf['db']['DB_HOST']
DB_PORT=cf['db']['DB_PORT']
DB_USERNAME=cf['db']['DB_USERNAME']
DB_PASSWORD=cf['db']['DB_PASSWORD']

CLIENT_URI = 'mongodb://' +  DB_HOST + ':' + str(DB_PORT) + '/' + DB_NAME
# #连接数据库
# client = MongoClient(CLIENT_URI)
# db = client[DB_NAME]



#从settings文件中获取数据库配置信息 并连接数据库
client = MongoClient(CLIENT_URI)
# client = MongoClient('mongodb://localhost:32017/')
if DB_HOST!='localhost' and DB_HOST !='127.0.0.1': #远程服务器需认证
    client.admin.authenticate(DB_USERNAME,DB_PASSWORD,mechanism='SCRAM-SHA-1')
db = client[DB_NAME]


# 获取配置文件中的表名、字段名

# tableName
userTableName = cf['tableName']['userTableName']
triplesTableName = cf['tableName']['triplesTableName']
entitiesTableName = cf['tableName']['entitiesTableName']
ment2entTableName = cf['tableName']['ment2entTableName']
typesTableName = cf['tableName']['typesTableName']
# [user]
user_username = cf['user']['user_username']
user_password = cf['user']['user_password']
# [triples]#
triples_s = cf['triples']['triples_s']
triples_p = cf['triples']['triples_p']
triples_o = cf['triples']['triples_o']
triples_timestamp=cf['triples']['triples_timestamp']
triples_editable = cf['triples']['triples_editable']

# [ment2ent]
ment2ent_m = cf['ment2ent']['ment2ent_m']
ment2ent_e = cf['ment2ent']['ment2ent_e']
ment2ent_strategy = cf['ment2ent']['ment2ent_strategy']
ment2ent_reason = cf['ment2ent']['ment2ent_reason']
ment2ent_timestamp=cf['ment2ent']['ment2ent_timestamp']
ment2ent_editable = cf['ment2ent']['ment2ent_editable']



# [entities]
entities_id = cf['entities']['entities_id']
entities_timestamp=cf['entities']['entities_timestamp']
entities_editable = cf['entities']['entities_editable']

# [types]
types_entity=cf['types']['types_entity']
types_type=cf['types']['types_type']
types_timestamp=cf['types']['types_timestamp']
types_editable = cf['types']['types_editable']


userTable = db[userTableName]
triplesTable = db[triplesTableName]
entitiesTable = db[entitiesTableName]
ment2entTable = db[ment2entTableName]
typesTable = db[typesTableName]


#每张表的可编辑权限




batch = Batch()

progressSession = None  # session记录进度
newProgress = True


# This skips csrf validation. Use csrf_protect to have validation
def index(request):

    ets=[]
    if triples_editable=='True':
        ets.append('triples')
    if entities_editable=='True':
        ets.append('entities')
    if ment2ent_editable=='True':
        ets.append('ment2ent')
    if types_editable=='True':
        ets.append('types')

    return render(request, "kg/index.html",{"ets":ets})


def temp(request):
    return render(request, "kg/temp.html")


def settings(request):




    server={'DB_NAME':DB_NAME,'DB_HOST':DB_HOST,'DB_PORT':DB_PORT,'DB_USERNAME':DB_USERNAME,'DB_PASSWORD':DB_PASSWORD}
    user={'userTableName':userTableName,'user_username':user_username,'user_password':user_password}
    triples={'triplesTableName':triplesTableName,'triples_s':triples_s,'triples_p':triples_p,'triples_o':triples_o,
             'triples_timestamp':triples_timestamp,'triples_editable':triples_editable}
    ment2ent={'ment2entTableName':ment2entTableName,'ment2ent_m':ment2ent_m,'ment2ent_e':ment2ent_e,'ment2ent_strategy':ment2ent_strategy,
              'ment2ent_reason':ment2ent_reason,'ment2ent_timestamp':ment2ent_timestamp,'ment2ent_editable':ment2ent_editable}
    entities={'entitiesTableName':entitiesTableName,'entities_id':entities_id,'entities_timestamp':entities_timestamp,'entities_editable':entities_editable}
    types={'typesTableName':typesTableName,'types_entity':types_entity,'types_type':types_type,'types_timestamp':types_timestamp,
           'types_editable':types_editable}
    print(148,server)
    res={'server':server,'user':user,'triples':triples,'ment2ent':ment2ent,'entities':entities,'types':types}






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


def add_choice(request, s, p, o):
    # 没有href的o,无需验证是否在entities表中
    res = {'s': "false", 'o': "false", 'add': 'true'}
    o = o.replace("*****", "/")  # 将/恢复

    if triplesTable.find({triples_s: s, triples_p: p, triples_o: o}).count() >= 1:
        res['add'] = 'false'
        return HttpResponse(jsonb.dumps((res)))
        # 验证o中href的值存在于entities表中
    if o.find("href") != -1:
        # 截取双引号中的值 即href的值
        ld = o.index('="')
        rd = o.index('">')
        ent = o[ld + 2:rd]
        cnt = entitiesTable.find({entities_id: ent}).count()
        # 如果entity表中无entity 返回错误信息
        if cnt == 0:
            res['o'] = 'true'
            entitiesTable.insert({entities_id: ent, entities_timestamp: datetime.datetime.now()})

    triplesTable.insert({triples_s: s, triples_p: p, triples_o: o, triples_timestamp: datetime.datetime.now()})
    # 新增一个triples，如果s不存在，也需要加入到entities表中

    cnt = entitiesTable.find({entities_id: s}).count()  # models.Entities.objects.filter(_id=s).count()

    # 如果entity表中无entity 在entity表中增加
    if cnt == 0:
        res['s'] = 'true'
        entitiesTable.insert({entities_id: s, entities_timestamp: datetime.datetime.now()})

    return HttpResponse(jsonb.dumps((res)))


@csrf_exempt
def login(request):
    user = request.POST.get('user')
    pwd = request.POST.get('pwd')
    print(user, pwd)
    cnt = userTable.find({user_username: user, user_password: pwd}).count()
    print(156,cnt)
    if cnt != 0:
        print(request.COOKIES)
        obj = redirect("/kg/index")
        obj.set_cookie("isLogin", True)
        obj.set_cookie("username", user)
        print(obj)
        return obj


    else:

        return render(request, 'kg/login.html')


def remove(request, nid):
    triplesTable.delete_one({'_id': ObjectId(nid)})
    return HttpResponse("delete success")


def modify(request, id, s, p, o):
    o = o.replace("*****", "/")  # 将/恢复

    # 验证o中href的值存在于entities表中
    if o.find("href") != -1:
        # 截取双引号中的值 即href的值
        ld = o.index('="')
        rd = o.index('">')
        ent = o[ld + 2:rd]

        cnt = entitiesTable.find({entities_id: ent}).count()
        # 如果entity表中无entity 返回错误信息
        if cnt == 0:
            return HttpResponse(ent + "不存在于entities表中")

    num = triplesTable.find({triples_s: s, triples_p: p, triples_o: o}).count()

    if num != 0:
        return HttpResponse("already exist")

    triple = triplesTable.find_one({'_id': ObjectId(id)})
    triple[triples_s] = s
    triple[triples_p] = p
    triple[triples_o] = o
    # models.Triples.objects.filter(id=id).update(s=s, p=p, o=o)
    triplesTable.update_one({'_id': ObjectId(id)}, {'$set': triple})
    return HttpResponse("modify success")


def add(request, s, p, o):
    # 没有href的o,无需验证是否在entities表中

    o = o.replace("*****", "/")  # 将/恢复
    print(111, o)
    # 验证o中href的值存在于entities表中
    if o.find("href") != -1:
        # 截取双引号中的值 即href的值
        ld = o.index('="')
        rd = o.index('">')
        ent = o[ld + 2:rd]
        cnt = entitiesTable.find({entities_id: ent}).count()
        # 如果entity表中无entity 返回错误信息
        if cnt == 0:
            return HttpResponse(ent + "不存在于entities表中")

    num = triplesTable.find({triples_s: s, triples_p: p, triples_o: o}).count()

    if num != 0:
        return HttpResponse("already exist")

    triplesTable.insert({triples_s: s, triples_p: p, triples_o: o, triples_timestamp: datetime.datetime.now()})
    # 新增一个triples，如果s不存在，也需要加入到entities表中

    cnt = entitiesTable.find({entities_id: s}).count()  # models.Entities.objects.filter(_id=s).count()
    res = "add triple:" + s + "," + p + "," + o
    # 如果entity表中无entity 在entity表中增加
    if cnt == 0:
        entitiesTable.insert({entities_id: s, entities_timestamp: datetime.datetime.now()})
        res += "  and add entity:" + s

    return HttpResponse(res)


def query_auto(request, s):
    print("query_auto" + s)

    if triples_editable !='True':
        return HttpResponse('non-editable')
    post = triplesTable.find({triples_s: s})
    jsonStr = jsonb.dumps(list(post))
    return HttpResponse(jsonStr)


# ___________________________________________________________________________________________
def query_auto_entity(request, s):
    print("query_auto_entity" + s)

    if entities_editable !='True':
        return HttpResponse('non-editable')


    posts = entitiesTable
    post = posts.find({entities_id: s})

    jsonStr = jsonb.dumps(list(post))
    # print(160,jsonStr)

    # print(169,list(posts))
    # jsObj = json.dumps(list(post))
    #
    # # print(name_emb)
    # print(jsObj)

    # 如果entity表中无entity_s ,ment2ent和triple有entity_s，则删除这两张表中entity、subject字段为s的记录
    # cnt = models.Entities.objects.filter(_id=s).count()
    # #
    # exist=True
    #
    # if cnt == 0:
    #     exist=False
    #     es = models.Ment2ent.objects.filter(e=s)
    #     for e in es:
    #         e.delete()
    #     ts = models.Triples.objects.filter(s=s)
    #     for t in ts:
    #         t.delete()

    return HttpResponse(jsonStr)


def query_entity_all(request):
    if entities_editable !='True':
        return HttpResponse('non-editable')


    posts = entitiesTable
    post = posts.find()
    jsonStr = jsonb.dumps(list(post))
    return HttpResponse(jsonStr)


def remove_entity(request, nid):
    entitiesTable.delete_one({'_id': nid})
    # 删除entities表中的 entity,会把其他表中所有的entity一起删除
    triplesTable.delete_many({triples_s: nid})
    ment2entTable.delete_many({ment2ent_e: nid})
    return HttpResponse("delete success")


def add_entity(request, s):
    num = entitiesTable.find({entities_id: s}).count()

    if num != 0:
        return HttpResponse("already exist")

    entitiesTable.insert({entities_id: s, entities_timestamp: datetime.datetime.now()})
    return HttpResponse("add success")


# ____________________________________________________________________________________
def query_auto_ment2ent(request, s):
    if ment2ent_editable !='True':
        return HttpResponse('non-editable')

    post = ment2entTable.find({ment2ent_m: s})
    jsonStr = jsonb.dumps(list(post))

    return HttpResponse(jsonStr)


def query_auto_ment2ent_entity(request, s):
    if ment2ent_editable !='True':
        return HttpResponse('non-editable')

    post = ment2entTable.find({ment2ent_e: s})
    jsonStr = jsonb.dumps(list(post))
    return HttpResponse(jsonStr)


def remove_ment2ent(request, nid):
    ment2entTable.delete_one({'_id': ObjectId(nid)})
    return HttpResponse("delete success")


def modify_ment2ent(request, id, m, e):
    num = ment2entTable.find({ment2ent_m: m, ment2ent_e: e}).count()
    if num != 0:
        return HttpResponse("数据已存在！")
    else:
        ment2entTable.update_one({'_id': ObjectId(id)}, {
            '$set': {ment2ent_m: m, ment2ent_e: e}})

    # 如果entity表中无entity 在entity表中增加
    cnt = entitiesTable.find({entities_id: e}).count()
    res = "修改成功：add ment2ent:" + m + "," + e
    if cnt == 0:
        print("add entity by ment2ent:" + e)
        entitiesTable.insert({entities_id: e, entities_timestamp: datetime.datetime.now()})
        res += "  and add entity:" + e

    return HttpResponse(res)


def add_ment2ent(request, m, e):
    # 判断数据是否已存在
    num = ment2entTable.find({ment2ent_m: m, ment2ent_e: e}).count()
    if num != 0:
        return HttpResponse("数据已存在！")
    else:
        ment2entTable.insert({ment2ent_m: m, ment2ent_e: e,
                              ment2ent_timestamp: datetime.datetime.now()})  # models.Ment2ent.objects.get(id=id).update(m=m, e=e, strategy=strategy, reason=reason)

    # 如果entity表中无entity 在entity表中增加
    cnt = entitiesTable.find({entities_id: e}).count()
    res = "添加成功：add ment2ent:" + m + "," + e
    if cnt == 0:
        print("add entity by ment2ent:" + e)
        entitiesTable.insert({entities_id: e, entities_timestamp: datetime.datetime.now()})
        res += "  and add entity:" + e
    return HttpResponse(res)


# types
# --------------------------------------------------------------------------------------------------
def query_auto_types(request, s):
    if types_editable !='True':
        return HttpResponse('non-editable')

    print("query_auto_types" + s)
    post = typesTable.find({types_entity: s})
    jsonStr = jsonb.dumps(list(post))
    return HttpResponse(jsonStr)


def remove_types(request, nid):
    typesTable.delete_one({'_id': ObjectId(nid)})
    return HttpResponse("delete success")


def modify_types(request, id, e, t):
    # num = models.types.objects.filter(m=m, e=e,strategy=strategy,reason=reason).count()
    num = typesTable.find({types_entity: e, types_type: t}).count()
    # print(num)
    if num != 0:
        return HttpResponse("数据已存在！")
    else:
        typesTable.update_one({'_id': ObjectId(id)}, {'$set': {types_entity: e,
                                                               types_type: t}})  # models.types.objects.get(id=id).update(m=m, e=e, strategy=strategy, reason=reason)

    res = 'modify'
    return HttpResponse(res)


def add_types(request, e, t):
    # 判断数据是否已存在
    num = typesTable.find({types_entity: e, types_type: t}).count()
    if num != 0:
        return HttpResponse("数据已存在！")
    else:

        typesTable.insert({types_entity: e, types_type: t,
                           types_timestamp: datetime.datetime.now()})  # models.types.objects.get(id=id).update(m=m, e=e, strategy=strategy, reason=reason)
    res = 'add_type'
    return HttpResponse(res)
#-------DB-settings----------------------------------------------------------------------
def saveDB_settings_server(request,db_name,db_host,db_port,db_username,db_password):
    cf.set("db", "DB_NAME", db_name)
    cf.set("db", "DB_HOST", db_host)
    cf.set("db", "DB_PORT", db_port)
    cf.set("db", "DB_USERNAME", db_username)
    cf.set("db", "DB_PASSWORD", db_password)

    cf.write(open(dbConfigFile, "r+"))


    res = 'saveDB_settings_server success'
    return HttpResponse(res)

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

def saveDB_settings_entities(request,_entitiesTableName,_entities_editable,_entities_id,_entities_timestamp):
    if entitiesTableName== _entitiesTableName and entities_id==_entities_id and entities_timestamp==_entities_timestamp:
       cf.set('entities','entities_editable',_entities_editable)
       cf.write(open(dbConfigFile, "r+"))
       res = 'saveDB_settings_entities success'
       return HttpResponse(res)
    else :
        if db[entitiesTableName].find().count() > 0:
            res = '实体表' + entitiesTableName + '已存在，修改失败！'
            return HttpResponse(res)

        cf.set("tableName", "entitiesTableName", _entitiesTableName)
        cf.set("entities", "entities_editable", _entities_editable)
        cf.set("entities", "entities_id", _entities_id)
        cf.set("entities", "entities_timestamp", _entities_timestamp)
        cf.write(open(dbConfigFile, "r+"))
        res = 'saveDB_settings_entities success'
        return HttpResponse(res)

def saveDB_settings_triples(request,_triplesTableName,_triples_editable,_triples_s,_triples_p,_triples_o,_triples_timestamp):
    if triplesTableName== _triplesTableName and triples_s==_triples_s and \
                     triples_p==_triples_p and triples_o==_triples_o and triples_timestamp==_triples_timestamp :
       cf.set('triples','triples_editable',_triples_editable)
       cf.write(open(dbConfigFile, "r+"))
       res = 'saveDB_settings_triples success'
       return HttpResponse(res)
    else :
        if db[triplesTableName].find().count() > 0:
            res = '实体表' + triplesTableName + '已存在，修改失败！'
            return HttpResponse(res)

        cf.set("tableName", "triplesTableName", _triplesTableName)
        cf.set("triples", "triples_editable", _triples_editable)
        cf.set("triples", "triples_s", _triples_s)
        cf.set("triples", "triples_p", _triples_p)
        cf.set("triples", "triples_o", _triples_o)
        cf.set("triples", "triples_timestamp", _triples_timestamp)
        cf.write(open(dbConfigFile, "r+"))
        res = 'saveDB_settings_triples success'
        return HttpResponse(res)

def saveDB_settings_ment2ent(request,_ment2entTableName,_ment2ent_editable,_ment2ent_m,_ment2ent_e,_ment2ent_timestamp):
    if ment2entTableName== _ment2entTableName and ment2ent_m==_ment2ent_m and \
                     ment2ent_e==_ment2ent_e  and ment2ent_timestamp==_ment2ent_timestamp :
       cf.set('ment2ent','ment2ent_editable',_ment2ent_editable)
       cf.write(open(dbConfigFile, "r+"))
       res = 'saveDB_settings_ment2ent success'
       return HttpResponse(res)
    else :
        if db[ment2entTableName].find().count() > 0:
            res = '实体表' + ment2entTableName + '已存在，修改失败！'
            return HttpResponse(res)

        cf.set("tableName", "ment2entTableName", _ment2entTableName)
        cf.set("ment2ent", "ment2ent_editable", _ment2ent_editable)
        cf.set("ment2ent", "ment2ent_m", _ment2ent_m)
        cf.set("ment2ent", "ment2ent_e", _ment2ent_e)
        cf.set("ment2ent", "ment2ent_timestamp", _ment2ent_timestamp)
        cf.write(open(dbConfigFile, "r+"))
        res = 'saveDB_settings_ment2ent success'
        return HttpResponse(res)


def saveDB_settings_types(request,_typesTableName,_types_editable,_types_entity,_types_type,_types_timestamp):
    if typesTableName== _typesTableName and types_entity==_types_entity and \
                     types_type==_types_type  and types_timestamp==_types_timestamp :
       cf.set('types','types_editable',_types_editable)
       cf.write(open(dbConfigFile, "r+"))
       res = 'saveDB_settings_types success'
       return HttpResponse(res)
    else :
        if db[typesTableName].find().count() > 0:
            res = '实体表' + typesTableName + '已存在，修改失败！'
            return HttpResponse(res)

        cf.set("tableName", "typesTableName", _typesTableName)
        cf.set("types", "types_editable", _types_editable)
        cf.set("types", "types_entity", _types_entity)
        cf.set("types", "types_type", _types_type)
        cf.set("types", "types_timestamp", _types_timestamp)
        cf.write(open(dbConfigFile, "r+"))
        res = 'saveDB_settings_types success'
        return HttpResponse(res)



