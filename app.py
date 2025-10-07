import http.client

conn = http.client.HTTPConnection("10.1.64.119", 6060)
payload = ''
headers = {
  'Cookie': 'sails.sid=s%3AwNXTudpGpLlFPzxv49Wg5PVfqapNkhUJ.OrNlAI9QlWqLyAzm5DogkuFRItUD0F4Jm9vYw6jozRE'
}
conn.request("GET", "/api/v1/cube/get/dimension/?f=equipment", payload, headers)
res = conn.getresponse()
data = res.read()
print(data.decode("utf-8"))
