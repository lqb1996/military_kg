#encoding='utf-8'
from datetime import datetime
import time
from bson import json_util as jsonb
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



class Batch:
    def _init_():
        pass


if __name__ == "__main__":
     batch=Batch()
     res=batch.getLink('王志雄')
     if res[0]:
         print(res[1])
    # print(batch.insertEntity(entitiesTable,'C:\\Users\\lina\\Desktop\\entities.txt'))
