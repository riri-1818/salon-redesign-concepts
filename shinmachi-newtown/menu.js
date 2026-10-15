// Shinmachi Newtown のメニュー。いまのサイト（Food Menu・Drink menu、2026-10-16 取得）から生成。綴りの誤りだけ直した。RINGO MARTINI はサイトの値段が「1」のため空欄（要確認）
const FOOD = [
{
"c": "From the sea (cold)",
"n": "KINGFISH CARPACCIO, MISO CUCUMBER, ORANGE WEDGES",
"d": [],
"p": "24",
"t": []
},
{
"c": "From the sea (cold)",
"n": "SALMON TARTARE, CAPERS, DILL, PICO DE GALLO",
"d": [],
"p": "21",
"t": []
},
{
"c": "From the sea (cold)",
"n": "BLUEFIN TUNA TARTARE, PARMESAN CHEESE, JAPANESE PESTO",
"d": [],
"p": "22",
"t": []
},
{
"c": "From the sea (cold)",
"n": "OMAKASE SASHIMI",
"d": [
"BLUEFIN TUNA, KINGFISH, SALMON & SPECIAL OF THE DAY (8pcs)"
],
"p": "28",
"t": [
"GF",
"NF"
]
},
{
"c": "Meat and bird (hot)",
"n": "WAGYU TERIYAKI BEEF, LOTUS CHIPS",
"d": [],
"p": "23",
"t": [
"GF",
"NF"
]
},
{
"c": "Meat and bird (hot)",
"n": "CHICKEN KARAAGE, SHIO KOJI, LOTUS CHIPS",
"d": [],
"p": "18",
"t": [
"NF"
]
},
{
"c": "Meat and bird (hot)",
"n": "CHICKEN KATSU, PARMESAN CHEESE, JAPANESE PESTO",
"d": [],
"p": "26",
"t": []
},
{
"c": "Plant based (hot)",
"n": "SHINMACHI CORN RIBS, SEAWEED SEASONING, RICE CRACKERS",
"d": [],
"p": "17",
"t": [
"V",
"NF"
]
},
{
"c": "Plant based (hot)",
"n": "SMOKED EGGPLANT, PICKLED MISO CARROT, TERIYAKI",
"d": [],
"p": "21",
"t": [
"V",
"NF"
]
},
{
"c": "Plant based (hot)",
"n": "TOFU, TAMARI AGEDASHI, GINGER, SHALLOT, ROASTED NORI",
"d": [],
"p": "18",
"t": [
"V",
"NF"
]
},
{
"c": "Plant based (hot)",
"n": "FRIED SOY CHICKEN, SHIO KOJI, LOTUS CHIPS",
"d": [],
"p": "18",
"t": [
"V",
"NF"
]
},
{
"c": "Plant based (hot)",
"n": "EGGPLANT KATSU, MISO VINEGAR",
"d": [],
"p": "21",
"t": [
"V",
"NF"
]
},
{
"c": "Sets",
"n": "SET",
"d": [
"(PROTEIN OF YOUR CHOICE)",
"RICE, SHIO KOJI MISO SOUP",
"HOUSEMADE SIDE DISH OF THE DAY & PICKLES"
],
"p": "+10",
"t": [
"V",
"NF"
]
},
{
"c": "Sets",
"n": "CURRY SET",
"d": [
"(PROTEIN OF YOUR CHOICE)",
"HOUSEMADE CURRY, RICE",
"SHIO KOJI MISO SOUP & HOUSEMADE SIDE DISH OF THE DAY"
],
"p": "+12",
"t": [
"V",
"GF",
"NF"
]
},
{
"c": "Pork ramen",
"n": "CLASSIC TONKOTSU",
"d": [
"(SOY SAUCE BASED)",
"NOODLES, SHALLOTS, MUSHROOMS, BEAN SPROUTS, CORN, RAMEN EGG, 24HR.CHASYU"
],
"p": "24",
"t": []
},
{
"c": "Pork ramen",
"n": "CLASSIC TONKOTSU BLACK",
"d": [
"(SOY SAUCE BASED)",
"NOODLES, SHALLOTS, MUSHROOMS, BEAN SPROUTS, CORN, RAMEN EGG, 24HR.CHASYU & ROASTED GARLIC"
],
"p": "26",
"t": []
},
{
"c": "Pork ramen",
"n": "HOKKAIDO SCALLOP",
"d": [
"(MISO BASED)",
"NOODLES, SHALLOTS, MUSHROOMS, BEAN SPROUTS, CORN, RAMEN EGG, 24HR CHASYU & SCALLOP"
],
"p": "30",
"t": []
},
{
"c": "Pork ramen",
"n": "WTF SPICY",
"d": [
"(MISO BASED)",
"NOODLES, SHALLOTS, MUSHROOMS, BEAN SPROUTS, CORN, RAMEN EGG, MINCED PORK & SHIITAKE MUSHROOMS"
],
"p": "25",
"t": []
},
{
"c": "Vegan ramen",
"n": "SHINMACHI’S VEGAN SIGNATURE",
"d": [
"(SOY SAUCE BASED)",
"NOODLES, SHALLOTS, MUSHROOMS, BEAN SPROUTS, CORN, BOK CHOY, VEGAN TERIYAKI CHASYU"
],
"p": "24",
"t": []
},
{
"c": "Vegan ramen",
"n": "VEGAN TANTAN",
"d": [
"(SPICY SESAME BASED)",
"NOODLES, SHALLOTS, MUSHROOMS, BEAN SPROUTS, CORN, BOK CHOY, MISO VEGAN MINCED MEAT"
],
"p": "24",
"t": []
},
{
"c": "Vegan ramen",
"n": "VEGAN TANTAN BLACK",
"d": [
"(SPICY SESAME BASED)",
"NOODLES, SHALLOTS, MUSHROOMS, BEAN SPROUTS, CORN, BOK CHOY, MISO VEGAN MINCED MEAT & ROASTED GARLIC"
],
"p": "26",
"t": []
},
{
"c": "Vegan ramen",
"n": "VEGAN CURRY",
"d": [
"(CHILLI BASED)",
"NOODLES, SHALLOTS, MUSHROOMS, BEAN SPROUTS, CORN, BOK CHOY, TOMATO, EGGPLANT KATSU"
],
"p": "24",
"t": []
},
{
"c": "Extra",
"n": "NOODLES, 24HR. CHASYU, PORK MINCE, CHICKEN KARAAGE",
"d": [],
"p": "6",
"t": []
},
{
"c": "Extra",
"n": "MISO VEGAN MINCED MEAT, VEGAN TERIYAKI CHASYU",
"d": [],
"p": "5",
"t": []
},
{
"c": "Extra",
"n": "ROASTED GARLIC, GYOKAI POWDER, NORI, RAMEN EGG",
"d": [],
"p": "3",
"t": []
},
{
"c": "Extra",
"n": "ONSEN EGG, RICE",
"d": [],
"p": "3",
"t": []
}
];
const DRINK = [
{
"c": "Beer",
"n": "ORION PREMIUM OKINAWA CRAFT (TAP)",
"d": [],
"p": "13",
"t": []
},
{
"c": "Beer",
"n": "SAPPORO PREMIUM CRAFT (TAP)",
"d": [],
"p": "15",
"t": []
},
{
"c": "Beer",
"n": "KIRIN ICHIBAN SHIBORI (BOTTLE)",
"d": [],
"p": "9.5",
"t": []
},
{
"c": "Beer",
"n": "ASAHI 0% (CAN)",
"d": [],
"p": "12",
"t": []
},
{
"c": "Sake",
"n": "OTOKOYAMA (GLASS)",
"d": [],
"p": "10",
"t": []
},
{
"c": "Sake",
"n": "SUISHIN (GLASS)",
"d": [],
"p": "10",
"t": []
},
{
"c": "Sake",
"n": "OTOKOYAMA (CARAFE)",
"d": [],
"p": "33",
"t": []
},
{
"c": "Sake",
"n": "SUISHIN (CARAFE)",
"d": [],
"p": "33",
"t": []
},
{
"c": "Sparkling Sake",
"n": "MIO SAKE 300ML",
"d": [],
"p": "15",
"t": []
},
{
"c": "Sparkling Sake",
"n": "MIO SAKE 750ML",
"d": [],
"p": "30",
"t": []
},
{
"c": "Wine",
"n": "CHARDONNAY",
"d": [
"(HUNTER’S GLOW RESERVE)"
],
"p": "15",
"t": []
},
{
"c": "Wine",
"n": "SAUVIGNON BLANC",
"d": [
"(ZESTFUL RESERVE)"
],
"p": "14",
"t": []
},
{
"c": "Wine",
"n": "SHIRAZ",
"d": [
"(VELVET RESERVE)"
],
"p": "14",
"t": []
},
{
"c": "Wine",
"n": "PLUM WINE",
"d": [],
"p": "13",
"t": []
},
{
"c": "Highball",
"n": "GIN AND TONIC",
"d": [
"ROKU GIN, TONIC WATER"
],
"p": "16",
"t": []
},
{
"c": "Highball",
"n": "MIDNIGHT HIGHBALL",
"d": [
"SESAME INFUSED TOKI WHISKEY, COKE"
],
"p": "17",
"t": []
},
{
"c": "Highball",
"n": "WHISKEY HIGHBALL",
"d": [
"TOKI WHISKEY, SODA WATER"
],
"p": "16",
"t": []
},
{
"c": "Cocktails",
"n": "KYOTO SOUR",
"d": [
"ORANGE CREAM, TOKI WHISKEY, FRESH YUZU, SIMPLE SYRUP"
],
"p": "18",
"t": []
},
{
"c": "Cocktails",
"n": "RINGO MARTINI",
"d": [
"HAKU VODKA, APPLE JUICE, FRESH YUZU, SIMPLE SYRUP"
],
"p": "",
"t": []
},
{
"c": "Cocktails",
"n": "SEX ON THE KING ST.",
"d": [
"HAKU VODKA, ORANGE JUICE, PLUM WINE, CRANBERRY JUICE"
],
"p": "19",
"t": []
},
{
"c": "Cocktails",
"n": "TOKYO NEGRONI",
"d": [
"ROKU GIN, CAMPARI, UMESYU"
],
"p": "22",
"t": []
},
{
"c": "Cocktails",
"n": "SAMURAI OLD FASHIONED",
"d": [
"SESAME INFUSED WHISKEY, ANGOSTURA"
],
"p": "21",
"t": []
},
{
"c": "Cocktails",
"n": "NEW FASHIONED",
"d": [
"SESAME INFUSED WHISKEY, SIMPLE SYRUP, ANGOSTURA"
],
"p": "21",
"t": []
},
{
"c": "Cocktails",
"n": "YUZU SPRITZ",
"d": [
"ROKU GIN, FRESH YUZU, SIMPLE SYRUP, SPARKLING SAKE"
],
"p": "17",
"t": []
},
{
"c": "Cocktails",
"n": "MATCHA VELVET ESPRESSO",
"d": [
"MATCHA VELVET, COCONUT WATER, KAHLUA, COINTREAU"
],
"p": "18",
"t": []
},
{
"c": "Cocktails",
"n": "UME BREEZE",
"d": [
"PLUM WINE, FRESH YUZU, SODA WATER"
],
"p": "17",
"t": []
},
{
"c": "Spirits",
"n": "ROKU GIN ON ROCK",
"d": [],
"p": "14",
"t": []
},
{
"c": "Spirits",
"n": "TOKI WHISKEY ON ROCK",
"d": [],
"p": "14",
"t": []
},
{
"c": "Spirits",
"n": "HAKU VODKA ON ROCK",
"d": [],
"p": "14",
"t": []
},
{
"c": "Non-alcoholic",
"n": "ICED GENMAICHA LEMON TEA",
"d": [
"GENMAICHA GREEN TEA, FRESH YUZU JUICE, SIMPLE SYRUP"
],
"p": "11",
"t": []
},
{
"c": "Non-alcoholic",
"n": "APPLE & CINNAMON ICED TEA",
"d": [
"4HR. SOUS VIDE APPLE SYRUP, BLACK TEA, CLOUDY APPLE JUICE"
],
"p": "11",
"t": []
},
{
"c": "Non-alcoholic",
"n": "STRAWBERRY SPARKLING",
"d": [
"FRESH STRAWBERRY PUREE, FRESH YUZU, STRAWBERRY SYRUP"
],
"p": "12",
"t": []
},
{
"c": "Non-alcoholic",
"n": "MATCHA CLOUD",
"d": [
"MATCHA VELVET, FRESH COCONUT WATER, ROASTED COCONUT"
],
"p": "12",
"t": []
},
{
"c": "Non-alcoholic",
"n": "HOT GREEN TEA",
"d": [],
"p": "5",
"t": []
},
{
"c": "Non-alcoholic",
"n": "ORANGE JUICE, APPLE JUICE",
"d": [],
"p": "5",
"t": []
},
{
"c": "Non-alcoholic",
"n": "COKE, COKE ZERO, SPRITE",
"d": [],
"p": "5",
"t": []
},
{
"c": "Non-alcoholic",
"n": "SAN PELLEGRINO (250ml)",
"d": [],
"p": "6",
"t": []
}
];
