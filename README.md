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
                       [-d delay]
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


Work in progress
---
Currently the progran only prints when the iPhone is listed as available, work needs to be done to add email alarm suport or telegram messages via telegram client.
