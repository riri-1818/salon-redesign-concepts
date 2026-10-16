// Lode Pies & Pastries のデータ。今のサイト（Visit us・Order、2026-10-16 取得）のとおり。hours は月〜日、分（480＝8:00）。null は休み。綴りだけ直した（additon）。
const STORES = [{"id": "surry", "name": "Surry Hills", "addr": "487 Crown St, Surry Hills NSW 2010", "short": "487 Crown St", "hours": [[480, 900], [480, 900], [480, 900], [480, 900], [480, 900], [480, 900], [480, 900]]}, {"id": "cbd", "name": "Sydney CBD", "addr": "Shop CQT.05B, 33 Pitt St, Sydney NSW 2000", "short": "33 Pitt St", "hours": [[480, 900], [480, 900], [480, 900], [480, 900], [480, 900], null, null]}, {"id": "north", "name": "North Sydney", "addr": "Tenancy 2, 73 Miller St, North Sydney NSW 2060", "short": "73 Miller St", "hours": [[480, 900], [480, 900], [480, 900], [480, 900], [480, 900], null, null]}, {"id": "rozelle", "name": "Rozelle", "addr": "Shop A4/120 Terry St, Rozelle NSW 2039", "short": "120 Terry St", "hours": [[420, 900], [420, 900], [420, 900], [420, 900], [420, 900], [420, 900], [420, 900]], "phone": "(02) 9818 7289", "sourdough": true}, {"id": "chatswood", "name": "Chatswood", "addr": "345 Victoria Ave, Chatswood NSW 2067", "short": "345 Victoria Ave", "hours": [[480, 1020], [480, 1020], [480, 1020], [480, 1020], [480, 1020], [480, 1020], [480, 1020]], "sourdough": true}];
const FOOD = [
 {
  "name": "Wagyu Beef & Mushroom Pie",
  "desc": "Blackmore wagyu beef, mushroom and red wine sauce.",
  "price": "$14.50",
  "g": "pies",
  "img": "m00"
 },
 {
  "name": "PAC 2.0",
  "desc": "Chocolate croissant. Dark Chocolate cocoa barry from France",
  "price": "$10.00",
  "g": "pastry",
  "img": "m01"
 },
 {
  "name": "Ah-Mund Maverick",
  "desc": "Almond frangipani and orange marmalade.",
  "price": "$11.00",
  "g": "pastry",
  "img": "m02"
 },
 {
  "name": "Bolognese pie",
  "desc": "Wagyu beef Bolognese, mozzarella and bechamel sauce.",
  "price": "$14.50",
  "g": "pies",
  "img": "m03"
 },
 {
  "name": "Plain croissant",
  "desc": "Best croissant in the hood!",
  "price": "$7.00",
  "g": "pastry",
  "img": "m04"
 },
 {
  "name": "Pistachio X",
  "desc": "Croissant dough, pistachio cream and caramelised pistachio.",
  "price": "$12.00",
  "g": "pastry",
  "img": "m05"
 },
 {
  "name": "Sausage roll",
  "desc": "Pork sausage roll",
  "price": "$9.00",
  "g": "pies",
  "img": "m06"
 },
 {
  "name": "Bombolone",
  "desc": "Fried doughnut filled with vanilla custard",
  "price": "$7.00",
  "g": "sweet",
  "img": "m07"
 },
 {
  "name": "Mango Meringue Bombolone",
  "desc": "Fried Italian style doughnut filled with mango custard and passionfruit meringue",
  "price": "$8.00",
  "g": "sweet"
 },
 {
  "name": "LoDe Choc Chip Cookie",
  "desc": "A true crowd pleaser. Our everyday winner!",
  "price": "$7.00",
  "g": "sweet"
 },
 {
  "name": "Let's Apple Krumble",
  "desc": "New addition to our daily line-up! Layers of apple our way and crumble that will keep you coming back.",
  "price": "$12.00",
  "g": "sweet"
 },
 {
  "name": "Cruffin Queen",
  "desc": "Amore! Filled with creamy hazelnut and salted caramel praline.",
  "price": "$12.00",
  "g": "pastry"
 },
 {
  "name": "Celebration Pastry Box",
  "desc": "Pre-Order and Pick-Up! This week's box contains... Bombolone with Vanilla Custard LoDe Cookie Pistachio Croissant Let's Apple Krumble Tart",
  "price": "$35.00",
  "g": "box"
 },
 {
  "name": "Ricky’s Raspberry Tart",
  "desc": "Fresh raspberry tart - perfection",
  "price": "$14.00",
  "g": "sweet"
 },
 {
  "name": "Banana Drama",
  "desc": "Banana bread the LoDe way!",
  "price": "$10.00",
  "g": "sweet"
 },
 {
  "name": "Moroccan Lamb Sausage Roll",
  "desc": "Dad's day special",
  "price": "$9.50",
  "g": "pies"
 }
];
const DRINKS = [
 {
  "name": "Chai latte",
  "desc": "Indulge in the rich and aromatic blend of spices with our exquisite Chai Latte. Elevate your beverage experience with the perfect balance of black tea, spices, and frothy milk, creating a comforting and invigorating drink that will leave you craving for more.",
  "price": "$5.00 - $5.50",
  "matcha": false
 },
 {
  "name": "Long Black",
  "desc": "Indulge in the rich and bold flavor of a Long Black coffee, a favorite among coffee enthusiasts. With its intense aroma and smooth taste, this beverage is sure to elevate your coffee experience to new heights.",
  "price": "$4.50 - $5.50",
  "matcha": false
 },
 {
  "name": "Cappuccino",
  "desc": "Indulge in the perfection of a classic cappuccino with its creamy texture, rich flavor, and aromatic taste. Elevate your coffee experience with every sip of this expertly crafted beverage.",
  "price": "$5.00 - $6.00",
  "matcha": false
 },
 {
  "name": "Brew",
  "desc": "Indulge in the smooth flavor and refreshing taste of our Cold Brew. Savor the richness and enjoy a truly satisfying experience with every sip. Elevate your beverage game with our premium Cold Brew today!",
  "price": "$7.50",
  "matcha": false
 },
 {
  "name": "Espresso",
  "desc": "Experience the bold flavor and rich aroma of our premium espresso. With its quick brewing time, you can enjoy a delicious cup of espresso in no time. Elevate your coffee experience with our exceptional espresso blend.",
  "price": "$4.50 - $5.50",
  "matcha": false
 },
 {
  "name": "Flat white",
  "desc": "Indulge in the perfect balance of a flat white with its creamy texture and rich flavor. Experience the ultimate coffee delight that is sure to elevate your coffee experience.",
  "price": "$5.00 - $6.00",
  "matcha": false
 },
 {
  "name": "Hot Chocolate",
  "desc": "Experience the rich flavor, creamy texture, and comforting warmth of our exquisite hot chocolate. Indulge in a moment of pure delight with each soothing sip. Enjoy our premium hot chocolate blend.",
  "price": "$5.00 - $5.50",
  "matcha": false
 },
 {
  "name": "Ice coffee",
  "desc": "",
  "price": "$7.00 - $8.00",
  "matcha": false
 },
 {
  "name": "Tea",
  "desc": "",
  "price": "$5.00",
  "matcha": false
 },
 {
  "name": "Latte",
  "desc": "Indulge in the luxurious experience of a latte with its creamy texture, rich flavor, and aromatic blend. Savor every sip of this expertly crafted beverage that is sure to elevate your coffee-drinking moments.",
  "price": "$5.00 - $6.00",
  "matcha": false
 },
 {
  "name": "Macchiato",
  "desc": "Indulge in the perfect balance and velvety foam with our Macchiato. Savor the bold flavors that will elevate your coffee experience to new heights. Treat yourself to a luxurious moment of pure coffee bliss today.",
  "price": "$4.50",
  "matcha": false
 },
 {
  "name": "Matcha Latte",
  "desc": "Experience the powerful blend of antioxidant-rich goodness and deliciously creamy flavor with our energizing Matcha Latte. Indulge in this invigorating beverage that will elevate your day with every sip.",
  "price": "$6.00 - $7.50",
  "matcha": true
 },
 {
  "name": "Mocha",
  "desc": "Indulge in the rich and aromatic experience of our energizing Mocha blend. With a perfect balance of flavors, this beverage is sure to awaken your senses and invigorate your day. Treat yourself to a cup of our premium Mocha today!",
  "price": "$5.00 - $6.00",
  "matcha": false
 },
 {
  "name": "Piccolo",
  "desc": "Indulge in the rich and robust flavors of Piccolo Coffee. Crafted with precision and passion, each sip of Piccolo Coffee is a journey of exquisite taste and aroma.",
  "price": "$4.50",
  "matcha": false
 },
 {
  "name": "Iced Strawberry Matcha latte",
  "desc": "Strawberry puree and premium matcha latte",
  "price": "$9.50",
  "matcha": true
 },
 {
  "name": "Iced Matcha",
  "desc": "Premium matcha latte",
  "price": "$8.00",
  "matcha": true
 },
 {
  "name": "Iced Mango Matcha",
  "desc": "Mango puree and premium matcha latte",
  "price": "$9.00",
  "matcha": true
 },
 {
  "name": "Iced Tiramisu latte",
  "desc": "Mascarpone foam, Iced latte, Cocoa powder, Lady finger biscuit,",
  "price": "$9.80",
  "matcha": false
 },
 {
  "name": "Magic",
  "desc": "Indulge in the magic flavors of LoDe Coffee. Crafted with precision and passion, each sip of our coffee is a journey of exquisite taste and aroma.",
  "price": "$5.00",
  "matcha": false
 }
];
const ORDER = "https://www.lodepies.com/s/order";
