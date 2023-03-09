import csv
import numpy as np
import pandas as pd
import sys

_date = sys.argv[-1]
# Naming convention: []_l for longitunial; []_i for index

# Change csv file in " " to latest updated data
data_state_l = pd.read_csv("state-longi-{}.csv".format(_date))
data_city_l = pd.read_csv("city-longi-{}.csv".format(_date))
data_state_i = pd.read_csv("state-index-{}.csv".format(_date))
data_city_i = pd.read_csv("city-index-{}.csv".format(_date))

# Assign csv content to dataframe
df_l = pd.DataFrame(data_state_l)
df2_l = pd.DataFrame(data_city_l)
df_i = data_state_i.append(data_city_i)

# Group states per region
ne = ['ME', 'VT', 'NH', 'MA', 'RI', 'CT', 'NY', 'PA', 'NJ', 'DE', 'MD', 'DC']
mw = ['MI', 'OH', 'IN', 'KY', 'MN', 'WI', 'IA', 'IL', 'MO']
central = ['MT', 'ID', 'WY', 'ND', 'SD', 'NE', 'KS', 'OK', 'AR', 'MS', 'NM', 'CO', 'UT', 'NV']
south = ['LA', 'TX', 'WV', 'VA', 'TN', 'NC', 'SC', 'GA', 'AL', 'FL']
west = ['WA', 'OR', 'CA', 'AZ', 'AK', 'HI']
carib = ['PR', 'VI']

# Calculate average for US and regions
df_l['avg_USA'] = df_l.mean(axis=1)
df_l['Northeast'] = df_l[ne].mean(axis=1)
df_l['Midwest'] = df_l[mw].mean(axis=1)
df_l['Central'] = df_l[central].mean(axis=1)
df_l['South'] = df_l[south].mean(axis=1)
df_l['West'] = df_l[west].mean(axis=1)
df_l['Caribbean'] = df_l[carib].mean(axis=1)

# Replace underscore in city names
for col_name in df2_l.columns:
    df_l[col_name.replace("_", " ")] = df2_l[col_name]

# Generate  6 CSV files for latest data (do not change names)
data_state_l.to_csv("longitudinal_state_latest.csv", index=False)
data_city_l.to_csv("longitudinal_city_latest.csv", index=False)
df_l.to_csv("longitudinal_compiled.csv", index=False)
data_state_i.to_csv("index_state_latest.csv", index=False)
data_city_i.to_csv("index_city_latest.csv", index=False)
df_i.to_csv("index_compiled.csv", index=False)
