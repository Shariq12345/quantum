from polygon import RESTClient
polygon_client = RESTClient(api_key="jCQvtKFC39SWJprdqxyiXFpac9UHB9K1")

aggs = polygon_client.get_aggs(ticker="AAPL", multiplier=1, timespan="day", from_="2023-01-01", to="2023-12-31")
print(aggs[0].__dict__)