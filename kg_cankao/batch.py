#encoding='utf-8'
from datetime import datetime
import time
from bson import json_util as jsonb
from pymongo import MongoClient
from django.conf import settings
import configparser
# import sys
# sys.stdout = io.TextIOWrapper(sys.stdout.buffer,encoding='gb18030')
'''
client = MongoClient(settings.CLIENT_URI)
# client = MongoClient('mongodb://localhost:32017/')
# client.admin.authenticate(settings.DB_USERNAME,settings.DB_PASSWORD,mechanism='SCRAM-SHA-1')
db = client[settings.DB_NAME]
'''



#获取配置文件中的数据库配置信息

cf = configparser.ConfigParser()
cf.read("kg/db.ini")
DB_NAME=cf['db']['DB_NAME']
DB_HOST=cf['db']['DB_HOST']
DB_PORT=cf['db']['DB_PORT']
DB_USERNAME=cf['db']['DB_USERNAME']
DB_PASSWORD=cf['db']['DB_PASSWORD']
CLIENT_URI = 'mongodb://' +  DB_HOST + ':' + str(DB_PORT) + '/' + DB_NAME
#连接数据库
client = MongoClient(CLIENT_URI)
if DB_HOST!='localhost' and DB_HOST !='127.0.0.1': #远程服务器需认证
    client.admin.authenticate(DB_USERNAME, DB_PASSWORD, mechanism='SCRAM-SHA-1')
db = client[DB_NAME]



#tableName
userTableName=cf['tableName']['userTableName']
triplesTableName=cf['tableName']['triplesTableName']
entitiesTableName=cf['tableName']['entitiesTableName']
ment2entTableName=cf['tableName']['ment2entTableName']
typesTableName=cf['tableName']['typesTableName']

user_username=cf['user']['user_username']
user_password=cf['user']['user_password']
# [triples]#
triples_s=cf['triples']['triples_s']
triples_p=cf['triples']['triples_p']
triples_o=cf['triples']['triples_o']
triples_timestamp=cf['triples']['triples_timestamp']
# [ment2ent]
ment2ent_m=cf['ment2ent']['ment2ent_m']
ment2ent_e=cf['ment2ent']['ment2ent_e']
ment2ent_strategy=cf['ment2ent']['ment2ent_strategy']
ment2ent_reason=cf['ment2ent']['ment2ent_reason']
ment2ent_timestamp=cf['ment2ent']['ment2ent_timestamp']
# [entities]
entities_id=cf['entities']['entities_id']
entities_timestamp=cf['entities']['entities_timestamp']

# [types]
types_entity=cf['types']['types_entity']
types_type=cf['types']['types_type']
types_timestamp=cf['types']['types_timestamp']
#table
userTable=db[userTableName]
triplesTable=db[triplesTableName]
entitiesTable=db[entitiesTableName]
ment2entTable=db[ment2entTableName]
typesTable=db[typesTableName]









class Batch:
    upload_progress=0

    def getEntityLink(self,s):
        es =entitiesTable.find({entities_id:s})
        cnt = es.count()
        if cnt==0:
            return False,''
        else:
            return True,s


    def getMent2EntLink(self,s):
        mes = ment2entTable.find({ment2ent_m: s})
        cnt = mes.count()
        if cnt == 0:
            return False,''
        else:
            link=set()
            for me in mes:
                e=me[ment2ent_e]
                link.add(e)
            return True, link
    def getLink(self,s):
        eres=self.getEntityLink(s)
        mres=self.getMent2EntLink(s)
        if eres[0]==False and mres[0]==False:
            return False,[]
        else:
            link=set()
            if eres[0]==True:
                link.add(eres[1])
            if mres[0]==True:
                for i in mres[1]:
                    link.add(i)
            return True,link



    def insertTriple(self,triplesTable,entitiesTable,file,session):
        # print(99,session,session['progress'])
        spDict = {} #重复数据按sp分组显示 ，数据库里重复的对象也要显示
                    #key为s+' '+p格式
                    #eg {'key': {'base':['a','b','c'],'file':['a','b','c']},...}
        path1 = file


        exists = []

        needLink=[]
        needLink_s=[] #s需要link的单独生成表格 让用户先处理
        relationNum=0
        entityNum=0

        nows = ''
        nowList = []  # 存放包含link信息的三元组

        count = 0
        totLine =0
        for index, line in enumerate(open(path1, 'r', encoding="utf-8")):
            totLine += 1
        # print(totLine)
        se = set()
        with open(path1, 'r', encoding="utf-8-sig") as f1:

            for line in f1:
                try:
                    count += 1
                    buffer=line.rstrip().split("\t")
                    #通过相邻的s建立字典，以list形式

                    if len(buffer)!=3:
                        return '非三元组！'
                    s,p,o = line.rstrip().split("\t")
                    # print(82,s,p,o)
                    lpre = len(se)

                    se.add(line)
                    lnext = len(se)
                    if lpre == lnext:  # 文件内重复
                        exists.append({'lineNo': count, triples_s: s, triples_p: p, triples_o: o})
                    # continue
                    else:#数据库内判重以及链接

                        if count==1:
                            # s=s[1:] #生成的文件开头有一个乱码
                            nows=s
                        tps = triplesTable.find({triples_s: s, triples_p: p})
                        num = tps.count()
                        if num == 0:
                            tt = datetime.now()

                            # 若无需链接，直接插入
                            sre=self.getLink(s)
                            ore=self.getLink(o)

                            #所有数据都需链接(s无link的）
                            if sre[0]==False:
                                sre=True,[]
                            if sre[0]==False and ore[0]==False:

                                pass
                            #需要链接，添加到链接信息
                            else:
                                if s==nows:
                                    slink=[]
                                    olink=[]
                                    if sre[0]:
                                        slink=sre[1]
                                    if ore[0]:
                                        olink=ore[1]

                                    nowList.append({'lineNo': count, "s": s, "p": p, "o": o,'slink':slink,'olink':olink})
                                else:
                                    #新的一组字典
                                    if len(nowList)!=0:
                                        #s无link 先处理
                                        if len(nowList[0]['slink'])==0 :
                                            needLink_s.append(nowList)
                                        else:
                                            needLink.append(nowList)
                                    nows=s
                                    nowList=[]

                                    slink = []
                                    olink = []
                                    if sre[0]:
                                        slink = sre[1]
                                    if ore[0]:
                                        olink = ore[1]
                                    nowList.append(
                                        {'lineNo': count, "s": s, "p": p, "o": o, 'slink': slink, 'olink': olink})

                        elif num >= 1:
                            if triplesTable.find({triples_s: s, triples_p: p,triples_o:o}).count() >=1:
                                exists.append({'lineNo': count, "s": s, "p": p, "o": o})
                            else:
                                # 删除策略值小的数据数据，更新
                                # objectId判等有问题
                                # if op.eq(tmid,tid)==False: #当前修改的数据和查到的<mention,entity>不是一条数据
                                #        m2e.delete()
                                # print(95,me)
                                key=s+'*****'+p
                                if key in spDict:
                                    dict=spDict[key]
                                else :
                                    dict={'base':[],'file':[]}

                                #获取获取s,o的链接slink,olink
                                sre = self.getLink(s)
                                ore = self.getLink(o)
                                olink = []
                                slink = []
                                if sre[0]:
                                    slink = sre[1]
                                if ore[0]:
                                    olink = ore[1]

                                if len(dict['base'])==0 :  #即s,p第一次查询到待用户操作数据
                                   for tp in tps:
                                       dict['base'].append({'lineNo': count,'o':tp['o']})#?

                                dict['file'].append({'lineNo': count,'o':o,'slink':slink,'olink':olink})
                                spDict[key] = dict

                except Exception as err2:
                    print("error f2 {}:{}".format(line, err2))
                session['progress']=count/totLine#记录进度
            #加入最后一组字典
            if len(nowList)!=0 and len(nowList[0]['slink']) == 0:
                needLink_s.append(nowList)
            else:
                needLink.append(nowList)

        existsStr = jsonb.dumps(list(exists))
        spDictStr=jsonb.dumps(spDict)
        needLinkStr=jsonb.dumps(needLink)
        needLinkStr_s = jsonb.dumps(needLink_s)

        res = [{'exists': existsStr, 'choices': spDictStr,'needLink':needLinkStr,'needLink_s':needLinkStr_s,'entityNum':entityNum,'relationNum':relationNum}]

        jsonStr = jsonb.dumps(list(res))
        #print(jsonStr)
        return jsonStr

    def insertTripleNoLink(self,file,session):
        count = 0
        totLine = 0
        exists=[]
        entityNum=0
        tripleNum=0
        se=set()
        insert_statement_list = []
        for index, line in enumerate(open(file, 'r', encoding="utf-8")):
            totLine += 1
        # print(totLine)
        with open(file, 'r', encoding="utf-8-sig") as f1:

            for line in f1:
                try:
                    count += 1
                    line = line.rstrip()
                    buffer = line.rstrip().split("\t")
                    if len(buffer) != 3:
                        return '非三元组！'
                    s, p, o = line.rstrip().split("\t")
                    lpre = len(se)

                    se.add(line)
                    lnext = len(se)
                    if lpre == lnext:  # 文件内重复
                        exists.append({'lineNo': count, triples_s: s, triples_p: p,triples_o:o})
                    # continue
                    else:
                    # 在数据库中进行查重
                        num = triplesTable.find({triples_s: s, triples_p: p,triples_o:o}).count()
                        if num == 0:
                            tt = datetime.now()
                            insert_statement_list.append({triples_s: s, triples_p: p,triples_o:o, triples_timestamp: tt})
                            tripleNum += 1

                            #关联entity与s
                            cnt = entitiesTable.find({entities_id: s}).count()
                            if cnt == 0:
                                # print("add entity by ment2ent:" + e)
                                entitiesTable.insert({entities_id: s, entities_timestamp: datetime.now()})
                                entityNum += 1

                            #关联entity与oe
                            if o.find("href") != -1:
                            # 截取双引号中的值 即href的值
                                ld = o.index('="')
                                rd = o.index('">')
                                # print(ld,rd)
                                ent = o[ld + 2:rd]
                                cnt = entitiesTable.find({entities_id: ent}).count()

                                if cnt == 0:
                                   entitiesTable.insert({entities_id: ent, entities_timestamp: tt})
                                   entityNum+=1



                            # 批量插入
                            if tripleNum % 1000 == 0:
                                if len(insert_statement_list) != 0:
                                    triplesTable.insert_many(insert_statement_list)
                                insert_statement_list = []
                                print(count, time.ctime())


                        elif num >= 1:
                                exists.append({'lineNo': count, triples_s: s, triples_p: p,triples_o:o})

                except Exception as err2:
                    print("error f2 {}:{}".format(line, err2))
                session['progress'] = count / totLine  # 记录进度
        if len(insert_statement_list) != 0:
                triplesTable.insert_many(insert_statement_list)

        existsStr = jsonb.dumps(list(exists))
        res = [{'exists': existsStr, 'entityNum': entityNum, 'tripleNum': tripleNum}]

        jsonStr = jsonb.dumps(list(res))
        return jsonStr





    '''def insertEntity(self,entitiesTable,file):
        count = 0
        entity_mention_dict = {}
        path1 = file

        count = 0
        insert_statement_list = []
        exists=[]
        entityNum=0
        with open(path1, 'r', encoding="utf-8") as f1:
            for line1 in f1:
                try:
                    count += 1

                    buffer = line1.rstrip().split("\t")
                    # print(buffer)
                    # print(len(buffer))
                    if len(buffer) >1:
                        return '输入数据不合法！'
                    entity= line1.rstrip()
                    num=entitiesTable.find({entities_id:entity}).count()
                    if num==0:
                        tt = datetime.now()
                        entitiesTable.insert({entities_id: entity,entities_timestamp: tt})
                        entityNum+=1
                    elif num>=1:
                        exists.append({'lineNo':count,'entity':entity})



                except Exception as err2:
                     print("error f2 {}:{}".format(line1, err2))
        existsStr = jsonb.dumps(list(exists))
        res = [{'exists': existsStr,  'entityNum': entityNum}]
        jsonStr = jsonb.dumps(list(res))
        # print(jsonStr)
        return jsonStr'''

    def insertEntity(self,entitiesTable, file,session):
        path1 = file
        count = 0
        insert_statement_list = []
        exists = []
        entityNum = 0
        totLine = 0
        for index, line in enumerate(open(path1, 'r', encoding="utf-8")):
            totLine += 1
        with open(path1, 'r', encoding="utf-8-sig") as f1:
            print('批量导入entities...')
            se = set()
            for line1 in f1:
                try:
                    count += 1  # 行号
                    buffer = line1.rstrip().split("\t")
                    print(buffer)
                    if len(buffer) > 1:
                        return '输入数据不合法！'
                    entity = line1.rstrip()
                    # if count==1 :
                    #   entity=entity[1:]
                    lpre = len(se)
                    se.add(entity)
                    lnext = len(se)
                    if lpre == lnext:  # 文件内重复
                        exists.append({'lineNo': count, 'entity': entity})
                        # continue
                    else:
                        # 在数据库中进行查重
                        num = entitiesTable.find({entities_id: entity}).count()
                        if num == 0:
                            tt = datetime.now()
                            insert_statement_list.append({entities_id: entity, entities_timestamp: tt})
                            # entitiesTable.insert({entities_id: entity, entities_timestamp: tt})
                            entityNum += 1

                            # 批量插入
                            if entityNum % 1000 == 0:
                                if len(insert_statement_list) != 0:
                                    entitiesTable.insert_many(insert_statement_list)
                                insert_statement_list = []
                                print(count, time.ctime())


                        elif num >= 1:
                            exists.append({'lineNo': count, 'entity': entity})

                except Exception as err2:
                    print("error f2 {}:{}".format(line1, err2))
                session['progress'] = count / totLine  # 记录进度
        if len(insert_statement_list) != 0:
            entitiesTable.insert_many(insert_statement_list)
        existsStr = jsonb.dumps(list(exists))
        res = [{'exists': existsStr, 'entityNum': entityNum}]
        jsonStr = jsonb.dumps(list(res))
        # print(jsonStr)
        return jsonStr

    '''def insertMent2ent(self,ment2entTable,entitiesTable,file):
        count = 0
        entity_mention_dict = {}
        path1 = file

        count = 0
        exists=[]
        updates=[]
        entityNum=0
        ment2entNum=0
        with open(path1, 'r', encoding="utf-8") as f1:
            for line1 in f1:
                try:
                    count += 1
                    buffer = line1.rstrip().split("\t")
                    print(170,buffer)
                    print(len(buffer))
                    if len(buffer) != 4 :
                        return '非四元组！'
                    m, e, strategy, reason = line1.rstrip().split("\t")
                    mes=ment2entTable.find({ment2ent_m:m,ment2ent_e:e})
                    num=mes.count()
                    if num==0:

                        tt = datetime.now()
                        ment2entTable.insert({ment2ent_m:m,ment2ent_e:e,ment2ent_strategy:strategy,ment2ent_reason:reason,ment2ent_timestamp: tt})
                        ment2entNum+=1
                        cnt = entitiesTable.find({entities_id: e}).count()
                        if cnt == 0:
                            # print("add entity by ment2ent:" + e)
                            entitiesTable.insert({entities_id: e, entities_timestamp: datetime.now()})
                            entityNum+=1
                    elif num==1:
                        me=mes[0]
                        print(me)
                        if me[ment2ent_strategy]==strategy and me[ment2ent_reason]==reason:
                            exists.append({'lineNo':count,'m': m, 'e': e, 'strategy': strategy, 'reason': reason})
                        elif int(me[ment2ent_strategy]) >= int(strategy):
                            # 删除策略值小的数据数据，更新
                            # objectId判等有问题
                            # if op.eq(tmid,tid)==False: #当前修改的数据和查到的<mention,entity>不是一条数据
                            #        m2e.delete()
                            # print(95,me)
                            updates.append({'lineNo':count,'m': m, 'e': e, 'preStrategy': me['strategy'], 'preReason': me['reason'], 'strategy': strategy, 'reason': reason})
                            # print(96)
                            tt = datetime.now()
                            ment2entTable.update_one({ment2ent_m:m,ment2ent_e:e}, {
                                '$set': {ment2ent_m:m,ment2ent_e:e,ment2ent_strategy:strategy,ment2ent_reason:reason,ment2ent_timestamp: tt}})
                    # elif num>1:




                except Exception as err2:
                     print("error f2 {}:{}".format(line1, err2))
        print(exists)
        print(updates)
        existsStr=jsonb.dumps(list(exists))
        updatesStr=jsonb.dumps(list(updates))
        print(112,existsStr)
        print(113,updatesStr)
        res=[{'exists':existsStr,'updates':updatesStr,'entityNum':entityNum,'ment2entNum':ment2entNum}]

        jsonStr = jsonb.dumps(list(res))
        print(jsonStr)
        return jsonStr'''

    def insertMent2ent(self,ment2entTable, entitiesTable, file,session):
        count = 0
        path1 = file

        count = 0
        exists = []

        entityNum = 0
        ment2entNum = 0
        # se = set()  # 利用set()文件内去重
        insert_statement_list = []

        totLine = 0
        for index, line in enumerate(open(path1, 'r', encoding="utf-8")):
            totLine += 1
        with open(path1, 'r', encoding="utf-8-sig") as f1:
            se = set()  # 利用set()文件内去重 ？？？若定义为set变量 set()函数不可用
            for line1 in f1:

                try:
                    count += 1
                    buffer = line1.rstrip().split("\t")

                    if len(buffer) != 2:
                        return '非二元组！'
                    m, e = line1.rstrip().split("\t")
                    # if count == 1:
                    #     m = m[1:] #开头第一行有个乱码
                    me = m + '*****' + e

                    lpre = len(se)

                    se.add(me)
                    lnext = len(se)
                    if lpre == lnext:  # 文件内重复
                        exists.append({'lineNo': count, ment2ent_m: m, ment2ent_e: e})
                        # continue
                    else:
                        # 在数据库中进行查重
                        num = ment2entTable.find({ment2ent_m: m, ment2ent_e: e}).count()
                        if num == 0:
                            tt = datetime.now()
                            insert_statement_list.append({ment2ent_m: m, ment2ent_e: e, ment2ent_timestamp: tt})
                            ment2entNum += 1

                            cnt = entitiesTable.find({entities_id: e}).count()
                            if cnt == 0:
                                # print("add entity by ment2ent:" + e)
                                entitiesTable.insert({entities_id: e, entities_timestamp: datetime.now()})
                                entityNum += 1

                            # 批量插入
                            if ment2entNum % 1000 == 0:
                                if len(insert_statement_list) != 0:
                                    ment2entTable.insert_many(insert_statement_list)
                                insert_statement_list = []
                                print(count, time.ctime())


                        elif num >= 1:
                            exists.append({'lineNo': count, ment2ent_m: m, ment2ent_e: e})

                except Exception as err2:
                    print("error f2 {}:{}".format(line1, err2))
                session['progress'] = count / totLine  # 记录进度
        if len(insert_statement_list) != 0:
            ment2entTable.insert_many(insert_statement_list)

        existsStr = jsonb.dumps(list(exists))
        res = [{'exists': existsStr, 'entityNum': entityNum, 'ment2entNum': ment2entNum}]

        jsonStr = jsonb.dumps(list(res))
        # print(jsonStr)
        return jsonStr

    def insertType(self,typesTable, entitiesTable, file,session):
        count = 0
        path1 = file

        count = 0
        exists = []

        entityNum = 0
        typeNum = 0
        # se = set()  # 利用set()文件内去重
        insert_statement_list = []

        totLine = 0
        for index, line in enumerate(open(path1, 'r', encoding="utf-8")):
            totLine += 1
        with open(path1, 'r', encoding="utf-8-sig") as f1:
            se = set()  # 利用set()文件内去重 ？？？若定义为set变量 set()函数不可用
            for line1 in f1:

                try:
                    count += 1
                    buffer = line1.rstrip().split("\t")

                    if len(buffer) != 3:
                        return '非三元组！'
                    e,_x, t = line1.rstrip().split("\t")

                    me = e + '*****' + t

                    lpre = len(se)

                    se.add(me)
                    lnext = len(se)
                    if lpre == lnext:  # 文件内重复
                        exists.append({'lineNo': count, types_entity: e,types_type: t})
                        # continue
                    else:
                        # 在数据库中进行查重
                        num = typesTable.find({types_entity: e,types_type: t}).count()
                        if num == 0:
                            tt = datetime.now()
                            insert_statement_list.append({types_entity: e,types_type: t, types_timestamp: tt})
                            typeNum += 1

                            cnt = entitiesTable.find({entities_id: e}).count()
                            if cnt == 0:
                                # print("add entity by ment2ent:" + e)
                                entitiesTable.insert({entities_id: e, entities_timestamp: datetime.now()})
                                entityNum += 1

                            # 批量插入
                            if typeNum % 1000 == 0:
                                if len(insert_statement_list) != 0:
                                    typesTable.insert_many(insert_statement_list)
                                insert_statement_list = []
                                print(count, time.ctime())


                        elif num >= 1:
                            exists.append({'lineNo': count,types_entity: e,types_type: t})

                except Exception as err2:
                    print("error f2 {}:{}".format(line1, err2))
                session['progress'] = count / totLine  # 记录进度
        if len(insert_statement_list) != 0:
            typesTable.insert_many(insert_statement_list)

        existsStr = jsonb.dumps(list(exists))
        res = [{'exists': existsStr, 'entityNum': entityNum, 'typeNum': typeNum}]

        jsonStr = jsonb.dumps(list(res))
        # print(jsonStr)
        return jsonStr




if __name__ == "__main__":
     batch=Batch()
     res=batch.getLink('王志雄')
     if res[0]:
         print(res[1])
    # print(batch.insertEntity(entitiesTable,'C:\\Users\\lina\\Desktop\\entities.txt'))
