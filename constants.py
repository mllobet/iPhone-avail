iphones = (u'MG472QL/A',
           u'MG482QL/A',
           u'MG492QL/A',
           u'MG4A2QL/A',
           u'MG4C2QL/A',
           u'MG4E2QL/A',
           u'MG4F2QL/A',
           u'MG4H2QL/A',
           u'MG4J2QL/A',
           u'MGA82QL/A',
           u'MGA92QL/A',
           u'MGAA2QL/A',
           u'MGAC2QL/A',
           u'MGAE2QL/A',
           u'MGAF2QL/A',
           u'MGAH2QL/A',
           u'MGAJ2QL/A',
           u'MGAK2QL/A')

iphone_name = {u'MG472QL/A': "6-16-Si",
               u'MG482QL/A': "6-16-Go",
               u'MG492QL/A': "6-16-Sp",
               u'MG4A2QL/A': "6-128-Si",
               u'MG4C2QL/A': "6-128-Go",
               u'MG4E2QL/A': "6-128-Sp",
               u'MG4F2QL/A': "6-64-Si",
               u'MG4H2QL/A': "6-64-Go",
               u'MG4J2QL/A': "6-64-Sp",
               u'MGA82QL/A': "6+-16-Si",
               u'MGA92QL/A': "6+-16-Go",
               u'MGAA2QL/A': "6+-16-Sp",
               u'MGAC2QL/A': "6+-128-Si",
               u'MGAE2QL/A': "6+-128-Go",
               u'MGAF2QL/A': "6+-128-Sp",
               u'MGAH2QL/A': "6+-64-Si",
               u'MGAJ2QL/A': "6+-64-Go",
               u'MGAK2QL/A': "6+-64-Sp"}

r_iphone_name = {iphone_name[x]: x for x in iphone_name}


country_sites = ("/JP/ja_JP/",
                 "/FR/fr_FR/",
                 "/AU/en_AU/",
                 "/ES/es_ES/",
                 "/HK/zh_HK/",
                 "/CH/de_CH/",
                 "/GB/en_GB/",
                 "/DE/de_DE/",
                 "/CA/en_CA/",
                 "/NL/nl_NL/",
                 "/TR/tr_TR/",
                 "/SE/sv_SE/",
                 "/IT/it_IT/")

site_url = "https://reserve.cdn-apple.com"
urls = [site_url + country_site + "reserve/iPhone/" for country_site in country_sites]
