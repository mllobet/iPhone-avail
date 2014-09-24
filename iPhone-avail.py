import argparse
import time
import sys
from collections import defaultdict

import requests

import constants as c


STORES = {}


def set_up_stores():
    print "Initializing stores"
    for url in c.urls:
        r = requests.get(url + "stores.json")
        r = r.json()
        if 'stores' not in r:
            continue
        stores = r['stores']
        for store in stores:
            if store['storeEnabled']:
                STORES[store['storeName']] = (store['storeNumber'], url)
                
    print "Done!"


def get_long_name(iphone):
    name = c.iphone_name[iphone].split('-')
    if name[-1] == "Si":
        color = "Silver"
    elif name[-1] == "Go":
        color = "Gold"
    else:
        color = "Space Gray"
    return "iPhone {0} {1}GB {2}".format(name[0], name[1], color)


def get_availability(urls):
    """ Gets the availability of all iphones given a list of preorder site urls. Result is in a defaultdict, one entry
    per iPhone, every enty contains a dictionary with store : availability """
    availability = defaultdict(dict)
    for url in urls:
        r = requests.get(url + "availability.json").json()
        for store in r:
            if store == 'updated':
                continue
            for iphone in c.iphones:
                availability[iphone][store] = r[store][iphone]

    return availability


def print_found(availability, iphones, stores):
    for iphone in iphones:
        iphone = c.r_iphone_name[iphone]
        for store_name in stores:
            store = STORES[store_name][0]
            if availability[iphone][store] is True:
                print get_long_name(iphone) + " found in " + store_name


def pool_and_notify(urls, iphones, stores):
    availability = get_availability(urls)
    print_found(availability, iphones, stores)


def run(stores, iphones, delay):
    set_up_stores()

    urls = set()
    # get urls to cover given stores
    for store in stores:
        if store not in STORES:
            print "{} not found in Apple's stores :(".format(store)
            sys.exit(-1)
        else:
            urls.add(STORES[store][1])

    urls = list(urls)
    while True:
        pool_and_notify(urls, iphones, stores)
        time.sleep(delay)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Checks if a given iPhone in a country and store can be preordered")
    parser.add_argument('-s', '--stores', help="the names of the stores to check iPhones on", nargs='+', required=True)
    parser.add_argument('-i', '--iPhones', help="the iphones to check for in the following format: [version (6/6+)]-"
                                                "[size (6/64/128)]-[color (Go,Si,Sp)]", nargs='+', required=True)
    parser.add_argument('-d', '--delay', help="pooling delay in seconds", default=300)

    args = parser.parse_args(sys.argv[1:])
    print args.stores
    run(args.stores, args.iPhones, args.delay)
