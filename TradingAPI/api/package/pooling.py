#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Sat Jun 13 19:01:47 2020

@author: lundypang
"""

import json
import requests
import pandas as pd
from bs4 import BeautifulSoup


def instrumentPool():
    temp_dir = {}
    url = "https://finance.yahoo.com/quote/%5EDJI/components?p=%5EDJI"
    page = requests.get(url)
    page_content = page.content
    # defining HTML Elements to look out for
    soup = BeautifulSoup(page_content, 'html.parser')
    tabl = soup.find_all(
        "table", {"class": "W(100%) M(0) BdB Bdc($seperatorColor)"})
    for t in tabl:
        rows = t.find_all(
            "tr", {"class": "BdT Bdc($seperatorColor) Ta(end) Fz(s)"})
        for row in rows:
            if len(row.get_text(separator='|').split("|")[0:2]) > 1:
                # retrieve the symbol name in dictionary form
                temp_dir[row.get_text(separator='|').split(
                    "|")[0]] = row.get_text(separator='|').split("|")[1]
    df = pd.DataFrame.from_dict(temp_dir, orient='index')
    df.reset_index(inplace=True)
    df.columns = ["ticker", "ticker_name"]
    df["instrument"] = "stock"
    print(df)
    
    # Forex
    df2 = pd.DataFrame([["OANDA:EURUSD", "EUR/USD", "forex"],
                        ["OANDA:USDJPY", "USD/JPY", "forex"],
                        ["OANDA:GBPUSD", "GBP_USD", "forex"],
                        ["OANDA:USDCHF", "USD/CHF", "forex"]], columns=["ticker", "ticker_name", "instrument"])
    df = df.append(df2)
    return json.dumps(json.loads(df.to_json(orient='records')), indent=2)


def timePool():
    df2 = pd.DataFrame([["1 min", "1"],
                        ["5 min", "5"],
                        ["15 min", "15"],
                        ["30 min", "30"],
                        ["60 min", "60"],
                        ["Daily", "D"],
                        ["Weekly", "W"],
                        ["Monthly", "M"]], columns=["display", "value"])
    return json.dumps(json.loads(df2.to_json(orient='records')), indent=2)
