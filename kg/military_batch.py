import time
from bson import json_util as jsonb
import json
from datetime import datetime
from pymongo import MongoClient


def insertMent2ent(ment2entTable, entitiesTable, file):
    ment2ent_m='m'
    ment2ent_e='e'
    entities_id='_id'
    count = 0
    path1 = file

    count = 0
    exists = []

    entityNum = 0
    ment2entNum = 0
    set = set()  # 利用set()文件内去重
    insert_statement_list=[]
    with open(path1, 'r', encoding="utf-8") as f1:
        # global  set
        for line1 in f1:
            try:
                count += 1
                buffer = line1.rstrip().split("\t")
                # print(170, buffer)
                # print(len(buffer))
                if len(buffer) != 2:
                    return '非二元组！'
                m, e = line1.rstrip().split("\t")
                me=m+'*****'+e
                # print(me)
                lpre = len(set)
                set.add(me)
                lnext = len(set)
                if lpre == lnext:  # 文件内重复
                    exists.append({'lineNo': count, ment2ent_m: m, ment2ent_e: e})
                    continue
                else:
                    # 在数据库中进行查重
                    num = ment2entTable.find({ ment2ent_m: m, ment2ent_e: e}).count()
                    # print(num)
                    if num == 0:
                        tt = datetime.now()
                        insert_statement_list.append({ment2ent_m: m, ment2ent_e: e, 'timestamp': tt})
                        # entitiesTable.insert({entities_id: entity, 'timestamp': tt})
                        ment2entNum += 1
                        cnt = entitiesTable.find({entities_id: e}).count()
                        if cnt == 0:
                            # print("add entity by ment2ent:" + e)
                            entitiesTable.insert({entities_id: e, "timestamp": datetime.now()})
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
    if len(insert_statement_list) != 0:
                ment2entTable.insert_many(insert_statement_list)


    existsStr = jsonb.dumps(list(exists))
    print(112, existsStr)
    res = [{'exists': existsStr, 'entityNum': entityNum, 'ment2entNum': ment2entNum}]

    jsonStr = jsonb.dumps(list(res))
    print(jsonStr)
    return jsonStr


# set = set()  # 利用set()文件内去重


def insertEntity(entitiesTable,file):
        entities_id='_id'
        count = 0
        entity_mention_dict = {}
        path1 = file
        se = set()  # 利用set()文件内去重
        count = 0
        insert_statement_list = []
        exists=[]
        entityNum=0

        with open(path1, 'r', encoding="utf-8") as f1:
            print('批量导入entities...')
            for line1 in f1:
                # global set


                try:

                    count += 1 #行号

                    buffer = line1.rstrip().split("\t")
                    # print(buffer)
                    # print(len(buffer))
                    if len(buffer) > 1:
                        return '输入数据不合法！'
                    entity = line1.rstrip()

                    lpre = len(se)
                    se.add(entity)
                    lnext = len(se)
                    if lpre == lnext: #文件内重复
                        exists.append({'lineNo': count, 'entity': entity})
                        continue
                    else:
                        #在数据库中进行查重
                        num = entitiesTable.find({entities_id: entity}).count()
                        if num == 0:
                            tt = datetime.now()
                            insert_statement_list.append({entities_id: entity, 'timestamp': tt})
                            # entitiesTable.insert({entities_id: entity, 'timestamp': tt})
                            entityNum += 1

                            #批量插入
                            if entityNum % 1000== 0:
                                if len(insert_statement_list) != 0:
                                    entitiesTable.insert_many(insert_statement_list)
                                insert_statement_list = []
                                print(count, time.ctime())


                        elif num >= 1:
                            exists.append({'lineNo': count, 'entity': entity})







                except Exception as err2:
                     print("error f2 {}:{}".format(line1, err2))
        if len(insert_statement_list) != 0:
            entitiesTable.insert_many(insert_statement_list)
        existsStr = jsonb.dumps(list(exists))
        res = [{'exists': existsStr,  'entityNum': entityNum}]
        jsonStr = jsonb.dumps(list(res))
        # print(jsonStr)
        return jsonStr



client = MongoClient('mongodb://localhost:32017')
# client.admin.authenticate('', '', mechanism='SCRAM-SHA-1')

db = client.military_kg
entitiesTable=db.entities
ment2entTable=db.ment2ent
triples_table = db.triples
types_table=db.types
count = 0

entity_mention_dict = {}

path1 = "C:\\Users\\lina\\Desktop\\entities.txt"

# print(insertEntity(entitiesTable,path1))
path="C:\\Users\\lina\\Desktop\\shaonian\\types.txt"
# print(insertMent2ent(ment2entTable,entitiesTable,path))

count = 0
insert_statement_list = []
# path1 = "E:/code/newet/data/result/all_full_predict_2018.txt"
# path1 = "E:/data/fulltype/merge/full_predict_20185.txt"
# path1 = "E:/data/fulltype/merge/test1.txt"
repeatNum=0
'''with open(path1, 'r', encoding="utf-8") as f1:
    # set=set()#组内去重
    for line1 in f1:
        try:
            e = line1.rstrip()
            lpre = len(set)
            set.add(ti)
            lnext=len(set)
            if lpre==lnext:
                    continue
                else:
                    fout.write(ti)
            count += 1
            if count % 1000 == 0:
                if len(insert_statement_list) != 0:
                    entitiesTable.insert_many(insert_statement_list)
                    # triple_table.insert_many(insert_statement_list)
                insert_statement_list = []
                print(count, time.ctime())

            # s, p, o = line1.rstrip().split("\t")
            tt = datetime.now()
            # insert_statement_list.append({"entity": s, "type": o, 'timestamp': tt})

            # insert_statement_list.append({"s": s, "p": p, "o": o, 'timestamp': tt})
            # m,e=line1.rstrip().split("\t")
            # insert_statement_list.append({"m": m, "e": e, 'timestamp': tt})
            e = line1.rstrip()
            insert_statement_list.append({ "_id": e, 'timestamp': tt})

        except Exception as err2:
            print("error f2 {}:{}".format(line1, err2))

if len(insert_statement_list) != 0:
    entitiesTable.insert_many(insert_statement_list)
'''
# path1 = "C:\\Users\\lina\\Desktop\\results_by_sxf\\triples.txt"
# with open(path1, 'r', encoding="utf-8") as f1:
#     for line1 in f1:
#         try:
#             count += 1
#             if count % 1000 == 0:
#                 if len(insert_statement_list) != 0:
#                     triples_table.insert_many(insert_statement_list)
#                 insert_statement_list = []
#                 print(count, time.ctime())
#
#             s, p, o = line1.rstrip().split("\t")
#             tt = datetime.now()
#             insert_statement_list.append({"s": s, "p": p, "o": o, 'timestamp': tt})
#
#         except Exception as err2:
#             print("error f2 {}:{}".format(line1, err2))
#
# if len(insert_statement_list) != 0:
#     triples_table.insert_many(insert_statement_list)


path1 = "C:\\Users\\lina\\Desktop\\results_by_sxf\\rank type\\ranktype.txt"
with open(path1, 'r', encoding="utf-8") as f1:
    for line1 in f1:
        try:
            count += 1
            if count % 1000 == 0:
                if len(insert_statement_list) != 0:
                    types_table.insert_many(insert_statement_list)
                insert_statement_list = []
                print(count, time.ctime())

            s, p, o = line1.rstrip().split("\t")
            tt = datetime.now()
            insert_statement_list.append({"entity": s, "type": o, 'timestamp': tt})

        except Exception as err2:
            print("error f2 {}:{}".format(line1, err2))

if len(insert_statement_list) != 0:
    types_table.insert_many(insert_statement_list)



'''
def insertType(typesTable, entitiesTable, file):
    types_entity='entity'
    types_type='type'
    entities_id='_id'
    types_timestamp='timestamp'
    entities_timestamp='timestamp'
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
    with open(path1, 'r', encoding="utf-8") as f1:
        se = set()  # 利用set()文件内去重 ？？？若定义为set变量 set()函数不可用
        for line1 in f1:

            try:
                count += 1
                buffer = line1.rstrip().split("\t")

                if len(buffer) != 3:
                    return '非三元组！'
                e, _x, t = line1.rstrip().split("\t")

                me = e + '*****' + t

                lpre = len(se)

                se.add(me)
                lnext = len(se)
                if lpre == lnext:  # 文件内重复
                    exists.append({'lineNo': count, types_entity: e, types_type: t})
                    # continue
                else:
                    # 在数据库中进行查重
                    num = typesTable.find({types_entity: e, types_type: t}).count()
                    if num == 0:
                        tt = datetime.now()
                        insert_statement_list.append({types_entity: e, types_type: t, types_timestamp: tt})
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
                        exists.append({'lineNo': count, types_entity: e, types_type: t})

            except Exception as err2:
                print("error f2 {}:{}".format(line1, err2))
            # session['progress'] = count / totLine  # 记录进度
    if len(insert_statement_list) != 0:
        typesTable.insert_many(insert_statement_list)

    existsStr = jsonb.dumps(list(exists))
    res = [{'exists': existsStr, 'entityNum': entityNum, 'typeNum': typeNum}]

    jsonStr = jsonb.dumps(list(res))
    # print(jsonStr)
    return jsonStr
'''

# insertEntity(entitiesTable,'C:\\Users\\lina\\Desktop\\results_by_sxf\\entities.txt')
# insertType(types_table, entitiesTable, 'C:\\Users\\lina\\Desktop\\results_by_sxf\\new type\\types.txt')