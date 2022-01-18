Cycle Logical - Store Inventory

Bikes - Mountain
    Bike A
        descrip
        manufacturer
        category Bikes
        category Bikes --> Mountain
        price
        number-in-stock
        made in
        size
        URL
    Bike B
        Giant
    Bike C
    Bike D
        Rocky Mountain
    Bike E
        Trek
Bikes - Road
    Bike A
    Bike B
Tires
    
Safety
    helmets
    gloves
Misc
    gloves
    Camelbak
    water bottles

---
Category
Item
Manufacturer
Made In

## Models

**Item**
name: String
manufacturer: Manufacturer[1]
made_in: Made In[1]
description: String
category: Category[1..*]
price: Number
number_in_stock: Number
URL: String

**Manufacturer**
name: String
established: Date
description: String
URL: String

**Made In**
name: String
URL: String

**Category**
name: String
URL: String

