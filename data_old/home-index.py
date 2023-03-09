import csv
import json
import numpy as np
import pandas as pd

data_state = pd.read_csv("index_state_latest.csv")
data_city = pd.read_csv("index_city_latest.csv")

df_s = pd.DataFrame(data_state)
df_c = pd.DataFrame(data_city)

p_s=df_s['general_reduction'].max()
q_s=df_s['general_reduction'].min()
p_c=df_c['general_reduction'].max()
q_c=df_c['general_reduction'].min()

max_col_s = df_s[df_s['general_reduction'] == p_s]
min_col_s = df_s[df_s['general_reduction'] == q_s]
max_col_c = df_c[df_c['general_reduction'] == p_c]
min_col_c = df_c[df_c['general_reduction'] == q_c]
usa = df_s[df_s['location'] == "United States"]

column_names = ["location","mobility_before_distancing","mobility_after_distancing","general_reduction","median_reduction","median_seasonal_reduction","num_users","num_records"]
df2 = pd.DataFrame(columns=df_s.columns)
df2 = pd.DataFrame(usa)
df2 = df2.append(max_col_s)
df2 = df2.append(min_col_s)
df2 = df2.append(max_col_c)
df2 = df2.append(min_col_c)

j = df2.to_json(orient='records')
jsonfile = open('home-index.json', 'w')
jsonfile.write(j)
