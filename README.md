iPhone-avail
=========
---
This program checks periodically for iPhone 6 preorder availability given stores and models

  - Supports multiple iPhone models
  - Suports  stores in 12 countries
 

How to use it
---

```sh 
./iPhone-avail.py [-h] -s stores [store ...] -i iPhone [iPhone ...]
                       [-d delay (in seconds)]
```

The store is the actual name, for example 'Passeig de Gràcia' in Barcelona.  
The iPhone format is as follows: 
```sh
[version (6/6+)]-[size (6/64/128)]-[color (Go,Si,Sp)]
```
Colors:  

  - Go : Gold
  - Si : Silver
  - Sp : Space Gray  

For example 6+-128-Sp is an iPhone 6 128GB Space Gray

Examples
---
Checking for iPhone 6 64GB Space Gray in the Covent Garden store in London:
```sh
./iPhone-avail.py -stores 'Covent Garden' -iPhones 6-64-Sp 
```
Checking for iPhone 6+ 16 and 64GB Gold and Silver in Covent Garden and Victoria Square stores every second:
```sh
./iPhone-avail.py -stores 'Covent Garden' 'Victoria Square' -iPhones 6+-16-Go 6+-64-Si -delay 1
```

Work in progress
---
Currently the progran only prints when the iPhone is listed as available, work needs to be done to add email alarm suport or telegram messages via telegram client.
