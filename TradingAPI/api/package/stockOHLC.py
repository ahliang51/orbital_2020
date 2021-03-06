#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Sat Jun 13 14:07:51 2020

@author: lundypang

##### Start of Stock OHLC DATA ###########
# Parameters:
# ticker - symbol should follow yahoo signals.
# interval - 1, 5, 15, 30, 60, D, W, M
# startDate - Follow dd/mm/yyyy format
# endDate - same  as start Date should be left blank if defaulted to today

"""

import time
import json
import requests
import numpy as np
import pandas as pd

from ..Tech_indicator.ADX import ADX
from ..Tech_indicator.EMA import EMA
from ..Tech_indicator.MACD import MACD
from ..Tech_indicator.RSI import RSI
from ..Tech_indicator.OBV import OBV
from ..Tech_indicator.Slope import slope

# from ..Tech_indicator.RSI import RSI
from ..Others.timeConversion import unix_Date, date_Unix


def stockOHLC(bar_data, token):
    bar = bar_data
    Symbol = bar['ticker']
    resolution = str(bar['interval'])  # 1,5 etc etc
    t_Start = str(date_Unix(bar['startDate']))  # start time
    if (date_Unix(bar['endDate'])+4314000) > int(time.time()):
        t_End = str(int(time.time()))
    else:
        t_End = str(date_Unix(bar['endDate'])+4314000)
    URL2 = 'https://finnhub.io/api/v1/stock/candle?symbol='+Symbol + \
        '&resolution='+resolution+'&from='+t_Start+'&to='+t_End+'&token='+token
    # print(url)
    URL= 'https://finnhub.io/api/v1/quote?symbol='+Symbol+'&token='+token

    r = requests.get(URL)
    r_json = r.json()
    try:
        # r_Open = np.array(r_json['o'])
        # r_High = np.array(r_json['h'])
        # r_Low = np.array(r_json['l'])
        # r_Close = np.array(r_json['c'])
        # r_time = np.array(r_json['t'])
        # df2 = pd.DataFrame(r_time, columns=['Time'])
        # df2['date'] = df2['Time'].apply(lambda x: unix_Date(x))
        # r_vol = np.array(r_json['v'])
        # df = pd.DataFrame(r_Open, columns=['open'])
        # df['High'] = r_High
        # df['Low'] = r_Low
        # df['Close'] = r_Close
        # df['Volume'] = r_vol
        # df['Date'] = df2['date']
        # df.columns = ['open', 'high', 'low', 'close', 'volume', 'date']
        # df['RSI'] = RSI(df, 14)
        # # MACD
        # # df = MACD(df)
        # df["MA_20"] = EMA(df, 20)
        # df["ADX"] = ADX(df, 20)
        # df["OBV"] = OBV(df)
        # df["slope"] = slope(df)
        
        # return json.dumps(json.loads(df.to_json(orient='records')), indent=2)
        return json.dumps({
            'success': True,
            'data': r_json['c']
        })
    except:
        return json.dumps({
            'success': False,
            'message': "The data you have requested are currently unavailable."
        })
##### End of Stock OHLC DATA ###########
