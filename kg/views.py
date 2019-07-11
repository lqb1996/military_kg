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
    non_structure_content = """根据美军透露的最新消息指出，驻防珍珠港的美军{「普雷贝尔」号导弹驱逐舰}，即将成为美国海军中第一艘装备高能激光武器的现役战舰
美媒则称，美军之所以优先在西太平洋地区部署激光武器，是希望能用它来拦截中国和俄罗斯的巡航导弹
美国海军陆战队负责人巴克斯艾尔少将近日透露，隶属太平洋舰队的「{普雷贝尔}」{号导弹驱逐舰}将在{2021年}配备HELIOS系列激光武器，这款武器能够取代原本的20毫米方阵近程防御火炮系统，成为美军拦截来袭导弹的「最后一道防线」
军方告诉路透社，此次自由航行任务，美军舰进入{黄岩岛}12海里以内
美国军方发言人对路透表示，美国驱逐舰{普雷贝尔}号（DDG-88）执行了此次行动
这是一个月来，美国第三次派遣{普雷贝尔}号赴{南海}水域执行挑衅任务：{5月6日}，美国海军{普雷贝尔}号、钟云号驱逐舰曾擅自进入中国{南海}岛礁邻近海域
而{4月28日}，{普雷贝尔}号曾经擅创{赤瓜礁}地区12海里内执行挑衅任务
美国海军{普雷贝尔}号（DDG-88）{黄岩岛}自古是中国固有领土，美舰进入我领土12海里范围海域，居然叫嚣依据国际法维护水路通道
况且，美国并非《联合国海洋法公约》签约国，却张嘴闭嘴国际法
据了解，这艘美国导弹驱逐舰{普雷贝尔}号曾经与另一艘导弹驱逐舰钟云号在{5月6日}闯入了中国{南沙}岛礁南熏礁和{赤瓜礁}12海里范围内
同一天，中国外交部发言人耿爽就此次两艘美舰闯入中国{南沙}海域一事回应指出，{5月6日}，美国军舰未经中国政府的允许，擅自进入了中国{南沙群岛南薰礁}和{赤瓜礁}邻近海域
中国海军依法对美舰进行了识别查证，并予以警告驱离
耿爽强调，美方军舰有关行为侵犯了中国主权，破坏了有关海域的和平、安全和良好秩序
中方对此表示强烈不满和坚决反对
当前在中国和东盟国家不断努力下，{南海}形势不断趋稳向好
在这种情况下，中方敦促美方停止此类挑衅行为，尊重中国的主权和安全利益，尊重地区国家维护{南海}和平稳定的努力
对于美舰近期频繁来{南海}挑衅一事，蓬佩奥非常自鸣得意，叫嚣在{南海}保持军事存在，对美国的经济增长非常重要
对于中国军事崛起一事，蓬佩奥最后警告称，在这场较量中，美国人姗姗来迟，现在正为此付出代价
彭博社也指出，这已是美舰{2019年}在{南海}的第三次挑衅
今年以来，美国已在{南海}开展了至少三次所谓航行自由行动，而{2018年}全年的类似公开报道为五次
6日，外交部发言人耿爽就此次两艘美舰闯入中国{南沙}海域一事回应指出，{5月6日}，美国军舰未经中国政府的允许，擅自进入了中国{南沙群岛南薰礁}和{赤瓜礁}邻近海域
中国海军依法对美舰进行了识别查证，并予以警告驱离
钟云号的武器系统包括两具K41储值发射系统、一具5寸口径的快速炮、两具三管鱼雷发射器，舰上还装备了90具垂直发射系统，能够发射{战斧}巡航导弹和反舰鱼叉导弹等，{海麻雀}导弹取代了原先装备的密集阵近空防御系统
同时舰上装备了两艘{SH-60海鹰}直升机
钟云号装备了90具垂直发射系统，能够发射{战斧}巡弋导弹和反舰鱼叉导弹等
舰上装备有多种最先进的进攻和防御系统，以满足美国海军在21世纪作战的需求
舰上装备了改进型声纳和雷达系统、数字模块化电台
SPY-1D(V)雷达具备自动的自适应雷达模式控制能力和更加强大的抗电子干扰能力，提高在濒海环境中的作战效能
AN/SQQ-89水下作战系统，增强舰艇执行多种任务的能力，可为航空母舰和远征打击群提供远程猎雷能力，提高舰艇各组的协同作战能力
舰上还装备了两艘{SH-60}直升机，{海麻雀}导弹取代了原先装备的密集阵近空防御系统
舰名由来近期，美国军舰多次擅闯{南海}，被解放军警告驱离
今年{2月11日}，美国斯普鲁恩斯号和{普雷贝尔}号军舰，未经中国政府允许，擅自进入中国{南沙群岛仁爱礁}和{美济礁}邻近海域
当时，中国海军依法对美舰进行了识别查证，并且予以了警告驱离
外交部发言人华春莹当天对此表示，美方军舰的有关行为侵犯中国的主权，破坏有关海域的和平、安全和良好秩序
中方对此表示强烈的不满和坚决的反对
中国对{南沙群岛}及其附近海域拥有无可争辩的主权，中方一向尊重和维护各国依据国际法在{南海}享有的航行与飞越自由
但是坚决反对任何国家假借航行与飞越自由之名，损害沿岸国主权和安全
华春莹表示，{2月11日}，美国斯普鲁恩斯号和{普雷贝尔}号军舰未经中国政府允许，擅自进入中国{南沙群岛仁爱礁}和{美济礁}邻近海域
中国海军依法对美舰进行识别查证，并予以警告驱离
美方军舰有关行为侵犯中国主权，破坏有关海域的和平、安全和良好秩序
中方对此表示强烈不满和坚决反对
华春莹指出，中国对包括{仁爱礁}、{美济礁}在内的{南沙群岛}及其附近海域拥有无可争辩的主权
中方一向尊重和维护各国依据国际法在{南海}享有的航行与飞越自由，但坚决反对任何国家假借航行与飞越自由之名，损害沿岸国主权和安全
美国智库、国家利益中心防务研究总监卡齐亚尼斯在去年就曾表示，美国海军在{2020年}将失去对华作战优势，而这一论点就是基于中国拥有的东风系列提出的
同时美海军专家詹姆斯·克拉斯卡也表示，中国的{东风-21}D无法拦截，一发就可以贯穿14层的航母
但即便是再高功率的高能激光武器，其一次也只能对抗一个目标
如果再计算上灼伤摧毁的时间，激光武器在面对多弹头的{东风-21}D时，就有些相形见绌了
而这次中国火箭军一下竖起了10枚，没理由不让人感到胆寒的
（智忠）当然，美国人在今年的鸿门宴上可能会感受到东南亚国家对中国态度的变化
作为鸿门宴的地理位置上的东道主，新加坡曾经有一段时间跟中国闹别扭，现在已经幡然悔悟
此外，舆论还关心，日本、欧洲这些美国的小兄弟，会不会在香会上帮腔煽风点火
他预计，到{2030年}，中国海军舰艇数量将多达560艘以上
最离谱的是，他说中国在{南海}修建了7个人工岛，其中3个人工岛屿面积和珍珠港一样大，可以容纳航空母舰打击群，还修建了长达三千米的飞机跑道
但我们很少看到媒体报道说，中国在{南海}建造了3个珍珠港
当前，美国政府对中国进行极限施压，在贸易政策和政治外交上，中美正在激烈地掰手腕
美国人很清楚，越是在这个时候，越是要管控住军事冲突风险
与中国这样的大国陷入战争，这也绝对不是美国想要的
美军参联会主席邓福德上将说，中美两国军方都在努力，使得两军关系成为两国关系的稳定力量
鉴于美中两国军事对抗的可能性正在增加，他希望能够建立两军直接对话机制，以化解随时可能发生的武力冲突
同时，中方支持中国企业拿起法律武器，捍卫自己的正当权利
问：据报道，美国总统特朗普17日表示，美国和中国实际上已经有一份协议，但中方破坏了协议
请问中方对此有何评论？问：据美方消息，美国军舰在{黄岩岛}附近行动
请问中方是否派军舰对美方舰船进行识别并予以驱离？答：根据我掌握的情况，北京时间{5月20日}上午，美国军舰{普雷贝尔}号未经中国政府允许，擅自进入中国{黄岩岛}邻近海域
中国海军依法对美舰进行了识别查证，并予以警告驱离
我必须再次强调，美方军舰有关行为侵犯了中国主权，破坏了有关海域的和平、安全和良好秩序
中方对此坚决反对
事实上，中国高度重视知识产权保护，从没有强制外方转让技术的政策
在历史的不同时期，中国同各国开展的相互投资和技术转让是市场主体自愿合作的结果，本质上是一种双赢的合作
我们会一如既往地欢迎包括欧洲企业在内的各国企业搭乘中国发展的顺风车，通过合作共享发展机遇，实现互利共赢
同时我必须强调，无论是欧洲国家还是其他国家的企业，如果他们确实有这样的关切，并且能够提供实实在在的证据，只要这些关切是合理的、关切的事情是真实存在的，相信是完全能够解决的，因为中国的相关法律规定非常明确
但同时，我们反对在无法提供事实依据的情况下凭空捏造
据路透社报道，S{SJ}-100客机此前就曾发生过事故，安全问题曾引起关注
{2012年5月}，一架S{SJ}-100在印尼进行展示飞行时坠毁，包括8名机组人员在内的45人全部遇难
调查认为，飞行员人为失误是事故主要原因
去年{7月12日}，一架S{SJ}-100客机在莫斯科附近进行试飞时，因为飞机右侧起落架没有完全展开，飞行员在飞机燃料耗尽后，在跑道上硬着陆，飞机轻微损伤
事故发生后，俄罗斯紧急情况部表示，俄方暂无计划停飞S{SJ}-100客机"""

    ets['name'] = name
    ets['pro'] = pro
    ets['selection'] = selection
    ets['non_structure_content'] = non_structure_content

    return render(request, "kg/index.html", {"ets": ets})


def half_structure(request):
    return 0


def half_structure_post(request):
    return 0


def non_structure(request):
    non_structure_content = """根据美军透露的最新消息指出，驻防珍珠港的美军{「普雷贝尔」号导弹驱逐舰}，即将成为美国海军中第一艘装备高能激光武器的现役战舰
    美媒则称，美军之所以优先在西太平洋地区部署激光武器，是希望能用它来拦截中国和俄罗斯的巡航导弹
    美国海军陆战队负责人巴克斯艾尔少将近日透露，隶属太平洋舰队的「{普雷贝尔}」{号导弹驱逐舰}将在{2021年}配备HELIOS系列激光武器，这款武器能够取代原本的20毫米方阵近程防御火炮系统，成为美军拦截来袭导弹的「最后一道防线」
    军方告诉路透社，此次自由航行任务，美军舰进入{黄岩岛}12海里以内
    美国军方发言人对路透表示，美国驱逐舰{普雷贝尔}号（DDG-88）执行了此次行动
    这是一个月来，美国第三次派遣{普雷贝尔}号赴{南海}水域执行挑衅任务：{5月6日}，美国海军{普雷贝尔}号、钟云号驱逐舰曾擅自进入中国{南海}岛礁邻近海域
    而{4月28日}，{普雷贝尔}号曾经擅创{赤瓜礁}地区12海里内执行挑衅任务
    美国海军{普雷贝尔}号（DDG-88）{黄岩岛}自古是中国固有领土，美舰进入我领土12海里范围海域，居然叫嚣依据国际法维护水路通道
    况且，美国并非《联合国海洋法公约》签约国，却张嘴闭嘴国际法
    据了解，这艘美国导弹驱逐舰{普雷贝尔}号曾经与另一艘导弹驱逐舰钟云号在{5月6日}闯入了中国{南沙}岛礁南熏礁和{赤瓜礁}12海里范围内
    同一天，中国外交部发言人耿爽就此次两艘美舰闯入中国{南沙}海域一事回应指出，{5月6日}，美国军舰未经中国政府的允许，擅自进入了中国{南沙群岛南薰礁}和{赤瓜礁}邻近海域
    中国海军依法对美舰进行了识别查证，并予以警告驱离
    耿爽强调，美方军舰有关行为侵犯了中国主权，破坏了有关海域的和平、安全和良好秩序
    中方对此表示强烈不满和坚决反对
    当前在中国和东盟国家不断努力下，{南海}形势不断趋稳向好
    在这种情况下，中方敦促美方停止此类挑衅行为，尊重中国的主权和安全利益，尊重地区国家维护{南海}和平稳定的努力
    对于美舰近期频繁来{南海}挑衅一事，蓬佩奥非常自鸣得意，叫嚣在{南海}保持军事存在，对美国的经济增长非常重要
    对于中国军事崛起一事，蓬佩奥最后警告称，在这场较量中，美国人姗姗来迟，现在正为此付出代价
    彭博社也指出，这已是美舰{2019年}在{南海}的第三次挑衅
    今年以来，美国已在{南海}开展了至少三次所谓航行自由行动，而{2018年}全年的类似公开报道为五次
    6日，外交部发言人耿爽就此次两艘美舰闯入中国{南沙}海域一事回应指出，{5月6日}，美国军舰未经中国政府的允许，擅自进入了中国{南沙群岛南薰礁}和{赤瓜礁}邻近海域
    中国海军依法对美舰进行了识别查证，并予以警告驱离
    钟云号的武器系统包括两具K41储值发射系统、一具5寸口径的快速炮、两具三管鱼雷发射器，舰上还装备了90具垂直发射系统，能够发射{战斧}巡航导弹和反舰鱼叉导弹等，{海麻雀}导弹取代了原先装备的密集阵近空防御系统
    同时舰上装备了两艘{SH-60海鹰}直升机
    钟云号装备了90具垂直发射系统，能够发射{战斧}巡弋导弹和反舰鱼叉导弹等
    舰上装备有多种最先进的进攻和防御系统，以满足美国海军在21世纪作战的需求
    舰上装备了改进型声纳和雷达系统、数字模块化电台
    SPY-1D(V)雷达具备自动的自适应雷达模式控制能力和更加强大的抗电子干扰能力，提高在濒海环境中的作战效能
    AN/SQQ-89水下作战系统，增强舰艇执行多种任务的能力，可为航空母舰和远征打击群提供远程猎雷能力，提高舰艇各组的协同作战能力
    舰上还装备了两艘{SH-60}直升机，{海麻雀}导弹取代了原先装备的密集阵近空防御系统
    舰名由来近期，美国军舰多次擅闯{南海}，被解放军警告驱离
    今年{2月11日}，美国斯普鲁恩斯号和{普雷贝尔}号军舰，未经中国政府允许，擅自进入中国{南沙群岛仁爱礁}和{美济礁}邻近海域
    当时，中国海军依法对美舰进行了识别查证，并且予以了警告驱离
    外交部发言人华春莹当天对此表示，美方军舰的有关行为侵犯中国的主权，破坏有关海域的和平、安全和良好秩序
    中方对此表示强烈的不满和坚决的反对
    中国对{南沙群岛}及其附近海域拥有无可争辩的主权，中方一向尊重和维护各国依据国际法在{南海}享有的航行与飞越自由
    但是坚决反对任何国家假借航行与飞越自由之名，损害沿岸国主权和安全
    华春莹表示，{2月11日}，美国斯普鲁恩斯号和{普雷贝尔}号军舰未经中国政府允许，擅自进入中国{南沙群岛仁爱礁}和{美济礁}邻近海域
    中国海军依法对美舰进行识别查证，并予以警告驱离
    美方军舰有关行为侵犯中国主权，破坏有关海域的和平、安全和良好秩序
    中方对此表示强烈不满和坚决反对
    华春莹指出，中国对包括{仁爱礁}、{美济礁}在内的{南沙群岛}及其附近海域拥有无可争辩的主权
    中方一向尊重和维护各国依据国际法在{南海}享有的航行与飞越自由，但坚决反对任何国家假借航行与飞越自由之名，损害沿岸国主权和安全
    美国智库、国家利益中心防务研究总监卡齐亚尼斯在去年就曾表示，美国海军在{2020年}将失去对华作战优势，而这一论点就是基于中国拥有的东风系列提出的
    同时美海军专家詹姆斯·克拉斯卡也表示，中国的{东风-21}D无法拦截，一发就可以贯穿14层的航母
    但即便是再高功率的高能激光武器，其一次也只能对抗一个目标
    如果再计算上灼伤摧毁的时间，激光武器在面对多弹头的{东风-21}D时，就有些相形见绌了
    而这次中国火箭军一下竖起了10枚，没理由不让人感到胆寒的
    （智忠）当然，美国人在今年的鸿门宴上可能会感受到东南亚国家对中国态度的变化
    作为鸿门宴的地理位置上的东道主，新加坡曾经有一段时间跟中国闹别扭，现在已经幡然悔悟
    此外，舆论还关心，日本、欧洲这些美国的小兄弟，会不会在香会上帮腔煽风点火
    他预计，到{2030年}，中国海军舰艇数量将多达560艘以上
    最离谱的是，他说中国在{南海}修建了7个人工岛，其中3个人工岛屿面积和珍珠港一样大，可以容纳航空母舰打击群，还修建了长达三千米的飞机跑道
    但我们很少看到媒体报道说，中国在{南海}建造了3个珍珠港
    当前，美国政府对中国进行极限施压，在贸易政策和政治外交上，中美正在激烈地掰手腕
    美国人很清楚，越是在这个时候，越是要管控住军事冲突风险
    与中国这样的大国陷入战争，这也绝对不是美国想要的
    美军参联会主席邓福德上将说，中美两国军方都在努力，使得两军关系成为两国关系的稳定力量
    鉴于美中两国军事对抗的可能性正在增加，他希望能够建立两军直接对话机制，以化解随时可能发生的武力冲突
    同时，中方支持中国企业拿起法律武器，捍卫自己的正当权利
    问：据报道，美国总统特朗普17日表示，美国和中国实际上已经有一份协议，但中方破坏了协议
    请问中方对此有何评论？问：据美方消息，美国军舰在{黄岩岛}附近行动
    请问中方是否派军舰对美方舰船进行识别并予以驱离？答：根据我掌握的情况，北京时间{5月20日}上午，美国军舰{普雷贝尔}号未经中国政府允许，擅自进入中国{黄岩岛}邻近海域
    中国海军依法对美舰进行了识别查证，并予以警告驱离
    我必须再次强调，美方军舰有关行为侵犯了中国主权，破坏了有关海域的和平、安全和良好秩序
    中方对此坚决反对
    事实上，中国高度重视知识产权保护，从没有强制外方转让技术的政策
    在历史的不同时期，中国同各国开展的相互投资和技术转让是市场主体自愿合作的结果，本质上是一种双赢的合作
    我们会一如既往地欢迎包括欧洲企业在内的各国企业搭乘中国发展的顺风车，通过合作共享发展机遇，实现互利共赢
    同时我必须强调，无论是欧洲国家还是其他国家的企业，如果他们确实有这样的关切，并且能够提供实实在在的证据，只要这些关切是合理的、关切的事情是真实存在的，相信是完全能够解决的，因为中国的相关法律规定非常明确
    但同时，我们反对在无法提供事实依据的情况下凭空捏造
    据路透社报道，S{SJ}-100客机此前就曾发生过事故，安全问题曾引起关注
    {2012年5月}，一架S{SJ}-100在印尼进行展示飞行时坠毁，包括8名机组人员在内的45人全部遇难
    调查认为，飞行员人为失误是事故主要原因
    去年{7月12日}，一架S{SJ}-100客机在莫斯科附近进行试飞时，因为飞机右侧起落架没有完全展开，飞行员在飞机燃料耗尽后，在跑道上硬着陆，飞机轻微损伤
    事故发生后，俄罗斯紧急情况部表示，俄方暂无计划停飞S{SJ}-100客机"""
    non_structure_content = json.dumps({'non_structure_content': non_structure_content}, ensure_ascii=False)
    return HttpResponse(non_structure_content)
    # return {'non_structure_content': non_structure_content}


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


@csrf_exempt
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



