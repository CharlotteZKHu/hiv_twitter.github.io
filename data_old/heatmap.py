import csv
import json
import numpy as np
import pandas as pd

data = pd.read_csv("index_state_latest.csv")

df = pd.DataFrame(data)

df.columns = ['id', 'mobility_before_distancing','mobility_after_distancing','value','median_reduction','median_seasonal_reduction','num_users','num_records']

df['id'] = 'US-' + df['id'].astype(str)

j = df.to_json(orient='records')
jsonfile = open('state-index.json', 'w')
jsonfile.write(j)
