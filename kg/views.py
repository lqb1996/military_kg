# encoding='utf-8'
# _*_ coding:utf-8 _*_
from django.shortcuts import render, redirect
from django.http import HttpResponse, HttpResponseRedirect
from pymongo import MongoClient
from django.conf import settings
# from django.views.decorators.csrf import csrf_exempt, csrf_protect  # Add this
from bson.objectid import ObjectId
from dwebsocket.decorators import accept_websocket,require_websocket
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
from script.百科知识抽取 import parseFramework_ex as parseFramework
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
    return render(request, "kg/index.html")


def minStructure(request):
    return render(request, "kg/minStructure.html")


def expressLearn(request):
    return render(request, "kg/知识抽取结果.html")


def mixed(request):
    ms = mul_res.django_return()
    ms = [i for i in ms if i != None]
    return render(request, "kg/mixed.html", {'ms': ms})


def non_ner(request):
    return render(request, "kg/non_ner.html")


def vector(request):
    return render(request, "kg/vector.html")


# @accept_websocket
def half_structure_equ(request):
    # if request.is_websocket():
    #     request.websocket.send('下载完成'.encode('utf-8'))
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


def get_mixed(request):
    ms = mul_res.django_return()
    ms = [i for i in ms if i != None]
    ms = json.dumps({'ms': ms}, ensure_ascii=False)
    return HttpResponse(ms)


def non_structure(request):
    # non_structure_content = Non.get_data()
    non_structure_content = """根据美军透露的最新消息指出，驻防珍珠港的美军「{普}{雷}{贝}{尔}{」}{号}{导}{弹}{驱}{逐}{舰}，即将成为美国海军中第一艘装备高能激光武器的现役战舰\n美媒则称，美军之所以优先在西太平洋地区部署激光武器，是希望能用它来拦截中国和俄罗斯的巡航导弹\n美国海军陆战队负责人巴克斯艾尔少将近日透露，隶属太平洋舰队的「{普}{雷}{贝}{尔}」{号}{导}{弹}{驱}{逐}{舰}将在{2}{0}{2}{1}{年}配备HELIOS系列激光武器，这款武器能够取代原本的20毫米方阵近程防御火炮系统，成为美军拦截来袭导弹的「最后一道防线」\n军方告诉路透社，此次自由航行任务，美军舰进入{黄}{岩}{岛}12海里以内\n美国军方发言人对路透表示，美国驱逐舰{普}{雷}{贝}{尔}号（DDG-88）执行了此次行动\n这是一个月来，美国第三次派遣{普}{雷}{贝}{尔}号赴{南}{海}水域执行挑衅任务：{5}{月}{6}{日}，美国海军{普}{雷}{贝}{尔}号、钟云号驱逐舰曾擅自进入中国{南}{海}岛礁邻近海域\n而{4}{月}{2}{8}{日}，{普}{雷}{贝}{尔}号曾经擅创{赤}{瓜}{礁}地区12海里内执行挑衅任务\n美国海军{普}{雷}{贝}{尔}号（DDG-88）{黄}{岩}{岛}自古是中国固有领土，美舰进入我领土12海里范围海域，居然叫嚣依据国际法维护水路通道\n况且，美国并非《联合国海洋法公约》签约国，却张嘴闭嘴国际法\n据了解，这艘美国导弹驱逐舰{普}{雷}{贝}{尔}号曾经与另一艘导弹驱逐舰钟云号在{5}{月}{6}{日}闯入了中国{南}{沙}岛礁南熏礁和{赤}{瓜}{礁}12海里范围内\n同一天，中国外交部发言人耿爽就此次两艘美舰闯入中国{南}{沙}海域一事回应指出，{5}{月}{6}{日}，美国军舰未经中国政府的允许，擅自进入了中国{南}{沙}{群}{岛}{南}{薰}{礁}和{赤}{瓜}{礁}邻近海域\n中国海军依法对美舰进行了识别查证，并予以警告驱离\n耿爽强调，美方军舰有关行为侵犯了中国主权，破坏了有关海域的和平、安全和良好秩序\n中方对此表示强烈不满和坚决反对\n当前在中国和东盟国家不断努力下，{南}{海}形势不断趋稳向好\n在这种情况下，中方敦促美方停止此类挑衅行为，尊重中国的主权和安全利益，尊重地区国家维护{南}{海}和平稳定的努力\n对于美舰近期频繁来{南}{海}挑衅一事，蓬佩奥非常自鸣得意，叫嚣在{南}{海}保持军事存在，对美国的经济增长非常重要\n对于中国军事崛起一事，蓬佩奥最后警告称，在这场较量中，美国人姗姗来迟，现在正为此付出代价\n彭博社也指出，这已是美舰{2}{0}{1}{9}{年}在{南}{海}的第三次挑衅\n今年以来，美国已在{南}{海}开展了至少三次所谓航行自由行动，而{2}{0}{1}{8}{年}全年的类似公开报道为五次\n6日，外交部发言人耿爽就此次两艘美舰闯入中国{南}{沙}海域一事回应指出，{5}{月}{6}{日}，美国军舰未经中国政府的允许，擅自进入了中国{南}{沙}{群}{岛}{南}{薰}{礁}和{赤}{瓜}{礁}邻近海域\n中国海军依法对美舰进行了识别查证，并予以警告驱离\n钟云号的武器系统包括两具K41储值发射系统、一具5寸口径的快速炮、两具三管鱼雷发射器，舰上还装备了90具垂直发射系统，能够发射{战}{斧}巡航导弹和反舰鱼叉导弹等，{海}{麻}{雀}导弹取代了原先装备的密集阵近空防御系统\n同时舰上装备了两艘{S}{H}{-}{6}{0}{海}{鹰}直升机\n钟云号装备了90具垂直发射系统，能够发射{战}{斧}巡弋导弹和反舰鱼叉导弹等\n舰上装备有多种最先进的进攻和防御系统，以满足美国海军在21世纪作战的需求\n舰上装备了改进型声纳和雷达系统、数字模块化电台\nSPY-1D(V)雷达具备自动的自适应雷达模式控制能力和更加强大的抗电子干扰能力，提高在濒海环境中的作战效能\nAN/SQQ-89水下作战系统，增强舰艇执行多种任务的能力，可为航空母舰和远征打击群提供远程猎雷能力，提高舰艇各组的协同作战能力\n舰上还装备了两艘{S}{H}{-}{6}{0}直升机，{海}{麻}{雀}导弹取代了原先装备的密集阵近空防御系统\n舰名由来近期，美国军舰多次擅闯{南}{海}，被解放军警告驱离\n今年{2}{月}{1}{1}{日}，美国斯普鲁恩斯号和{普}{雷}{贝}{尔}号军舰，未经中国政府允许，擅自进入中国{南}{沙}{群}{岛}{仁}{爱}{礁}和{美}{济}{礁}邻近海域\n当时，中国海军依法对美舰进行了识别查证，并且予以了警告驱离\n外交部发言人华春莹当天对此表示，美方军舰的有关行为侵犯中国的主权，破坏有关海域的和平、安全和良好秩序\n中方对此表示强烈的不满和坚决的反对\n中国对{南}{沙}{群}{岛}及其附近海域拥有无可争辩的主权，中方一向尊重和维护各国依据国际法在{南}{海}享有的航行与飞越自由\n但是坚决反对任何国家假借航行与飞越自由之名，损害沿岸国主权和安全\n华春莹表示，{2}{月}{1}{1}{日}，美国斯普鲁恩斯号和{普}{雷}{贝}{尔}号军舰未经中国政府允许，擅自进入中国{南}{沙}{群}{岛}{仁}{爱}{礁}和{美}{济}{礁}邻近海域\n中国海军依法对美舰进行识别查证，并予以警告驱离\n美方军舰有关行为侵犯中国主权，破坏有关海域的和平、安全和良好秩序\n中方对此表示强烈不满和坚决反对\n华春莹指出，中国对包括{仁}{爱}{礁}、{美}{济}{礁}在内的{南}{沙}{群}{岛}及其附近海域拥有无可争辩的主权\n中方一向尊重和维护各国依据国际法在{南}{海}享有的航行与飞越自由，但坚决反对任何国家假借航行与飞越自由之名，损害沿岸国主权和安全\n美国智库、国家利益中心防务研究总监卡齐亚尼斯在去年就曾表示，美国海军在{2}{0}{2}{0}{年}将失去对华作战优势，而这一论点就是基于中国拥有的东风系列提出的\n同时美海军专家詹姆斯·克拉斯卡也表示，中国的{东}{风}{-}{2}{1}D无法拦截，一发就可以贯穿14层的航母\n但即便是再高功率的高能激光武器，其一次也只能对抗一个目标\n如果再计算上灼伤摧毁的时间，激光武器在面对多弹头的{东}{风}{-}{2}{1}D时，就有些相形见绌了\n而这次中国火箭军一下竖起了10枚，没理由不让人感到胆寒的\n（智忠）当然，美国人在今年的鸿门宴上可能会感受到东南亚国家对中国态度的变化\n作为鸿门宴的地理位置上的东道主，新加坡曾经有一段时间跟中国闹别扭，现在已经幡然悔悟\n此外，舆论还关心，日本、欧洲这些美国的小兄弟，会不会在香会上帮腔煽风点火\n他预计，到{2}{0}{3}{0}{年}，中国海军舰艇数量将多达560艘以上\n最离谱的是，他说中国在{南}{海}修建了7个人工岛，其中3个人工岛屿面积和珍珠港一样大，可以容纳航空母舰打击群，还修建了长达三千米的飞机跑道\n但我们很少看到媒体报道说，中国在{南}{海}建造了3个珍珠港\n当前，美国政府对中国进行极限施压，在贸易政策和政治外交上，中美正在激烈地掰手腕\n美国人很清楚，越是在这个时候，越是要管控住军事冲突风险\n与中国这样的大国陷入战争，这也绝对不是美国想要的\n美军参联会主席邓福德上将说，中美两国军方都在努力，使得两军关系成为两国关系的稳定力量\n鉴于美中两国军事对抗的可能性正在增加，他希望能够建立两军直接对话机制，以化解随时可能发生的武力冲突\n同时，中方支持中国企业拿起法律武器，捍卫自己的正当权利\n问：据报道，美国总统特朗普17日表示，美国和中国实际上已经有一份协议，但中方破坏了协议\n请问中方对此有何评论？问：据美方消息，美国军舰在{黄}{岩}{岛}附近行动\n请问中方是否派军舰对美方舰船进行识别并予以驱离？答：根据我掌握的情况，北京时间{5}{月}{2}{0}{日}上午，美国军舰{普}{雷}{贝}{尔}号未经中国政府允许，擅自进入中国{黄}{岩}{岛}邻近海域\n中国海军依法对美舰进行了识别查证，并予以警告驱离\n我必须再次强调，美方军舰有关行为侵犯了中国主权，破坏了有关海域的和平、安全和良好秩序\n中方对此坚决反对\n事实上，中国高度重视知识产权保护，从没有强制外方转让技术的政策\n在历史的不同时期，中国同各国开展的相互投资和技术转让是市场主体自愿合作的结果，本质上是一种双赢的合作\n我们会一如既往地欢迎包括欧洲企业在内的各国企业搭乘中国发展的顺风车，通过合作共享发展机遇，实现互利共赢\n同时我必须强调，无论是欧洲国家还是其他国家的企业，如果他们确实有这样的关切，并且能够提供实实在在的证据，只要这些关切是合理的、关切的事情是真实存在的，相信是完全能够解决的，因为中国的相关法律规定非常明确\n但同时，我们反对在无法提供事实依据的情况下凭空捏造\n据路透社报道，S{S}{J}-100客机此前就曾发生过事故，安全问题曾引起关注\n{2}{0}{1}{2}{年}{5}{月}，一架S{S}{J}-100在印尼进行展示飞行时坠毁，包括8名机组人员在内的45人全部遇难\n调查认为，飞行员人为失误是事故主要原因\n去年{7}{月}{1}{2}{日}，一架S{S}{J}-100客机在莫斯科附近进行试飞时，因为飞机右侧起落架没有完全展开，飞行员在飞机燃料耗尽后，在跑道上硬着陆，飞机轻微损伤\n事故发生后，俄罗斯紧急情况部表示，俄方暂无计划停飞S{S}{J}-100客机\n"""
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


def get_baike(request):
    if request.method == 'GET':
        keyword = request.GET.get('keyword', default='F-22')
        url = 'http://baike.baidu.com/item/%s' % keyword
        baike_obj = parseFramework.PARSE_FRAMEWORK()
        baike_content = baike_obj.get_page_from_url(url)
        baike_resolution = baike_obj.extractor_framework(baike_obj.get_page(baike_content, 4))
        baike_res = json.dumps({'baike_content': baike_content, 'baike_resolution': baike_resolution}, ensure_ascii=False)
        return HttpResponse(baike_res)
    return HttpResponse(0)


def baike_extract(request):
    if request.method == 'GET':
        keyword = request.GET.get('keyword', default='F-22')
        url = 'http://baike.baidu.com/item/%s' % keyword
        baike_obj = parseFramework.PARSE_FRAMEWORK()
        baike_content = baike_obj.get_page_from_url(url)
        baike_resolution = baike_obj.extractor_framework(baike_obj.get_page(baike_content, 4))
        baike_res = json.dumps({'baike_resolution': baike_resolution}, ensure_ascii=False)
        return HttpResponse(baike_res)
    return HttpResponse(0)


def baike_page(request):
    if request.method == 'GET':
        keyword = request.GET.get('page', default='F-22')
        url = 'http://baike.baidu.com/item/%s' % keyword
        baike_obj = parseFramework.PARSE_FRAMEWORK()
        baike_content = baike_obj.get_page_from_url(url)
        baike_res = json.dumps({'baike_content': baike_content}, ensure_ascii=False)
        return HttpResponse(baike_res)
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



