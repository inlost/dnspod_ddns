# Dnspod DDNS

a js script for Dnspod DDNS

## Qick Start

[get Dnspod token](https://support.dnspod.cn/Kb/showarticle/tsid/227)

```bash
git clone git@github.com:inlost/dnspod_ddns.git
cd dnspod_ddns
chmod u+x dnspod.js
./dnspod.js $token $domain $ip(option){:target="_blank"}

#example
./dnspod.js 1666,1f3480b4620335639 ddns.cloudlii.com 5.5.5.4
#or
./dnspod.js 1666,1f3480b4620335639 ddns.cloudlii.com
```