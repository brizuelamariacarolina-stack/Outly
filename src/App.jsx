import { useState, useRef, useEffect } from "react";

// ─── i18n ─────────────────────────────────────────────────────────────────────
const LANGS = {
  en: { flag:"🇬🇧", label:"English" },
  es: { flag:"🇪🇸", label:"Español" },
  pt: { flag:"🇧🇷", label:"Português" },
  fr: { flag:"🇫🇷", label:"Français" },
  de: { flag:"🇩🇪", label:"Deutsch" },
  it: { flag:"🇮🇹", label:"Italiano" },
  ja: { flag:"🇯🇵", label:"日本語" },
  zh: { flag:"🇨🇳", label:"中文" },
};

const T18 = {
  en: {
    appName:"Outly", appTag:"AI",
    nav: { scan:"Scan", wardrobe:"Wardrobe", profile:"My Profile", celeb:"Inspiration", trip:"Trip", salir:"Go Out" },
    home: { tagline:"Your personal AI wardrobe", headline1:"Your style,", headline2:"elevated", sub:"Scan your clothes, discover your colour palette, replicate your favourite style icons and plan trips outfit by outfit.", start:"Get started — Scan my clothes", viewWardrobe:"View my wardrobe" },
    homeCards: [["Scan AI","Record your wardrobe and AI detects every item"],["Image Profile","Colour palette & silhouettes for your body type"],["Celeb Style","Replicate looks from Zendaya, Kim K, Hailey & more"],["Virtual Wardrobe","All your clothes catalogued and organised"],["Trip Planner","Day-by-day outfits with real weather"],["Multi-person","Plan for the whole family or group"]],
    scan: { cat:"Catalogue items", title:"Scan clothes", uploadTitle:"Upload wardrobe video", uploadDesc:"Record a slow walkthrough of your wardrobe (30–90 sec)", tips:"Tips for best results", tip1:"Move the camera slowly", tip2:"Good lighting, no backlight", tip3:"Briefly open folded items", tip4:"You can upload multiple videos", manualTitle:"Add manually", manualDesc:'"Black cotton t-shirt"', addBtn:"+ Add to wardrobe", viewWardrobe:"View my wardrobe", analyzing:"Analysing your video...", extracting:"Extracting frames...", analysing:"frames. Analysing with AI...", done:"items detected.", reviewTitle:"Detected items", reviewSub:"Review the list and uncheck anything incorrect. Add anything missing below.", missingTitle:"Missing something?", confirmBtn:"Confirm items →", scanAnother:"Scan another video" },
    wardrobe: { cat:"Your collection", title:"Wardrobe", addBtn:"+ Add clothes", tripBtn:"Plan a trip →", empty:"Your wardrobe is empty", emptySub:"Scan your clothes to get started", scanBtn:"Scan clothes", noCategory:"Uncategorised" },
    profile: { cat:"Personalised advice", title:"My image profile", bodyType:"Body type", skinTone:"Skin tone", hairColor:"Hair colour", eyeColor:"Eye colour", generateBtn:"Generate my image analysis →", generating:"Analysing your image...", working:"Your personal image consultant is working...", yourPalette:"Your palette", season:"Season", favours:"✓ Favours you", avoid:"✗ Better avoid", yourSilhouette:"Your silhouette", yes:"✓ Yes", no:"✗ No", personalTips:"Personal tips", wardrobeAdvice:"Wardrobe advice" },
    celeb: { cat:"Style inspiration", title:"Celebrity inspiration", sub:"Choose your style icon and AI replicates their most iconic looks with clothes you already own.", analyseBtn:"Replicate style of", analysing:"Analysing looks...", noWardrobe:"No clothes loaded — generic suggestions will be made", analysingSub:"Analysing style and matching with your wardrobe...", celebVersion:"How", wouldWear:"would wear it", yourVersion:"Your version — with what you have", keyPiece:"🔑 Key piece", complete:"🛍️ Complete the look" },
    trip: { cat:"Planner", title:"Trip", destination:"Destination", departure:"Departure date", return:"Return date", people:"People", activities:"Activities", nightOut:"Any nights out? (bars, clubs, formal dinners)", generateBtn:"Generate plan with weather & outfits →", loading:"Preparing your trip...", loadingSub:"Checking weather · Analysing wardrobe · Building outfits", forecast:"Forecast", planLabel:"Outfit plan", modify:"← Modify", viewWardrobe:"View wardrobe", day:"Day", night:"Night", noWardrobe:"No clothes loaded — generic suggestions will be made" },
    salir: { cat:"Dress code advisor", title:"Go Out", sub:"Search any bar, restaurant, club or venue and AI analyses the dress code and builds your outfit.", placeholder:"e.g. Nobu London, Berghain Berlin, Cipriani NYC...", cityPlaceholder:"City (optional, improves accuracy)", searchBtn:"Analyse dress code & outfit →", searching:"Analysing venue...", searchingSub:"Looking up dress code and building your outfit...", recentTitle:"Recent searches", dressCode:"Dress code", required:"Required", notRequired:"Not required", reservation:"Reservation", needed:"Needed", notNeeded:"Not needed", howToBook:"How to book", mustAvoid:"Must avoid", dayOutfit:"Day outfit", nightOutfit:"Night outfit", missing:"Missing pieces", insider:"Insider tip", notApplicable:"Not applicable for this venue", noWardrobe:"No clothes loaded — generic suggestions will be made", emptyTitle:"Search a venue to get started", emptySub:"Type any bar, restaurant or club name above" },
    cats: ["Tops","Trousers","Dresses/Skirts","Coats","Footwear","Accessories","Sportswear","Underwear"],
    colors: ["Black","White","Grey","Blue","Red","Green","Pink","Beige","Brown","Multicolor"],
    occasions: ["Work","Casual","Formal","Night out","Sport","Beach","Special event"],
    activities: ["Sightseeing","Work/meetings","Beach/pool","Hiking","Restaurants","Shopping","Sport","Museums"],
    bodyTypes: [{ id:"hourglass",label:"Hourglass",desc:"Balanced shoulders & hips, defined waist",emoji:"⌛" },{ id:"pear",label:"Pear",desc:"Hips wider than shoulders",emoji:"🍐" },{ id:"apple",label:"Apple",desc:"More volume in torso & abdomen",emoji:"🍎" },{ id:"rectangle",label:"Rectangle",desc:"Similar shoulders, waist & hips",emoji:"▬" },{ id:"inverted",label:"Inverted triangle",desc:"Shoulders wider than hips",emoji:"🔺" }],
    skinTones: [{ id:"fair",label:"Fair",hex:"#FDDBB4" },{ id:"light",label:"Light",hex:"#E8B88A" },{ id:"medium",label:"Medium",hex:"#C68642" },{ id:"olive",label:"Olive",hex:"#8D5524" },{ id:"tan",label:"Tan",hex:"#6B3A2A" },{ id:"deep",label:"Deep",hex:"#3D1A0E" }],
    hairColors: ["Blonde","Light brown","Dark brown","Black","Red","Grey/Silver","Dyed/Fantasy"],
    eyeColors: ["Brown","Green","Blue","Grey","Hazel","Black"],
    dressLevels: { "casual":"Casual","smart casual":"Smart Casual","business casual":"Business Casual","cocktail":"Cocktail","formal":"Formal","black tie":"Black Tie" },
  },
  es: {
    appName:"Outly", appTag:"AI",
    nav: { scan:"Escanear", wardrobe:"Vestidor", profile:"Mi Perfil", celeb:"Inspiración", trip:"Viaje", salir:"Salir" },
    home: { tagline:"Tu estilista personal con IA", headline1:"Tu estilo,", headline2:"elevado", sub:"Escaneá tu ropa, descubrí tu paleta de colores, copiá el estilo de tus íconos favoritos y planificá viajes outfit por outfit.", start:"Empezar — Escanear mi ropa", viewWardrobe:"Ver mi vestidor" },
    homeCards: [["Escaneo IA","Grabá tu placard y la IA detecta cada prenda"],["Perfil de imagen","Paleta de colores y siluetas para tu tipo de cuerpo"],["Estilo celeb","Replicá looks de Zendaya, Kim K, Hailey y más"],["Vestidor virtual","Toda tu ropa catalogada y organizada"],["Planificador de viaje","Outfits día por día con clima real"],["Multi-persona","Para toda la familia o grupo"]],
    scan: { cat:"Catalogar prendas", title:"Escanear ropa", uploadTitle:"Subir video del placard", uploadDesc:"Grabá un recorrido lento de 30–90 segundos", tips:"Tips para mejor resultado", tip1:"Moví la cámara lento", tip2:"Buena iluminación, sin contraluz", tip3:"Abrí prendas dobladas brevemente", tip4:"Podés hacer varios videos", manualTitle:"Agregar manualmente", manualDesc:'"Remera negra de algodón"', addBtn:"+ Agregar al vestidor", viewWardrobe:"Ver mi vestidor", analyzing:"Analizando tu video...", extracting:"Extrayendo frames...", analysing:"frames. Analizando con IA...", done:"prendas detectadas.", reviewTitle:"Prendas detectadas", reviewSub:"Revisá la lista y destildá lo que no es correcto. Agregá lo que faltó abajo.", missingTitle:"¿Faltó alguna?", confirmBtn:"Confirmar prendas →", scanAnother:"Escanear otro video" },
    wardrobe: { cat:"Tu colección", title:"Vestidor", addBtn:"+ Agregar ropa", tripBtn:"Planificar viaje →", empty:"Tu vestidor está vacío", emptySub:"Escaneá tu ropa para empezar", scanBtn:"Escanear ropa", noCategory:"Sin categoría" },
    profile: { cat:"Asesoría personalizada", title:"Mi perfil de imagen", bodyType:"Tipo de cuerpo", skinTone:"Tono de piel", hairColor:"Color de pelo", eyeColor:"Color de ojos", generateBtn:"Generar mi análisis de imagen →", generating:"Analizando tu imagen...", working:"Tu asesora de imagen personal está trabajando...", yourPalette:"Tu paleta", season:"Estación", favours:"✓ Te favorecen", avoid:"✗ Mejor evitar", yourSilhouette:"Tu silueta", yes:"✓ Sí", no:"✗ No", personalTips:"Tips personales", wardrobeAdvice:"Consejo para tu vestidor" },
    celeb: { cat:"Estilo inspiracional", title:"Inspiración famosas", sub:"Elegí tu ícono de estilo y la IA replica sus looks más icónicos con la ropa que ya tenés.", analyseBtn:"Replicar estilo de", analysing:"Analizando looks...", noWardrobe:"Sin ropa cargada — se sugerirán prendas genéricas", analysingSub:"Analizando el estilo y combinando con tu ropa...", celebVersion:"Como lo llevaría", wouldWear:"", yourVersion:"Tu versión — con lo que tenés", keyPiece:"🔑 Pieza clave", complete:"🛍️ Completarlo" },
    trip: { cat:"Planificador", title:"Viaje", destination:"Destino", departure:"Fecha de salida", return:"Fecha de regreso", people:"Personas", activities:"Actividades", nightOut:"¿Hay salidas nocturnas? (bares, boliches, cenas formales)", generateBtn:"Generar plan con clima y outfits →", loading:"Preparando tu viaje...", loadingSub:"Consultando clima · Analizando tu ropa · Armando outfits", forecast:"Pronóstico", planLabel:"Plan de outfits", modify:"← Modificar", viewWardrobe:"Ver vestidor", day:"Día", night:"Noche", noWardrobe:"Sin ropa cargada — se sugerirán prendas genéricas" },
    salir: { cat:"Asesor de dress code", title:"Salir", sub:"Buscá cualquier bar, restaurante, boliche o lugar y la IA analiza el dress code y arma tu outfit.", placeholder:"Ej: Nobu Buenos Aires, Crobar, Carne Buenos Aires...", cityPlaceholder:"Ciudad (opcional, mejora la precisión)", searchBtn:"Analizar dress code y outfit →", searching:"Analizando el lugar...", searchingSub:"Buscando dress code y armando tu outfit...", recentTitle:"Búsquedas recientes", dressCode:"Dress code", required:"Requerido", notRequired:"No requerido", reservation:"Reserva", needed:"Necesaria", notNeeded:"No necesaria", howToBook:"Cómo reservar", mustAvoid:"No usar", dayOutfit:"Outfit de día", nightOutfit:"Outfit de noche", missing:"Prendas que faltan", insider:"Dato insider", notApplicable:"No aplica para este lugar", noWardrobe:"Sin ropa cargada — se sugerirán prendas genéricas", emptyTitle:"Buscá un lugar para empezar", emptySub:"Escribí el nombre de cualquier bar, restaurante o boliche" },
    cats: ["Tops","Pantalones","Vestidos/Faldas","Abrigos","Calzado","Accesorios","Deportiva","Ropa Interior"],
    colors: ["Negro","Blanco","Gris","Azul","Rojo","Verde","Rosa","Beige","Marrón","Multicolor"],
    occasions: ["Trabajo","Casual","Formal","Salida nocturna","Deporte","Playa","Evento especial"],
    activities: ["Turismo","Trabajo/reuniones","Playa","Senderismo","Restaurantes","Compras","Deporte","Museos"],
    bodyTypes: [{ id:"hourglass",label:"Reloj de arena",desc:"Hombros y caderas equilibrados, cintura marcada",emoji:"⌛" },{ id:"pear",label:"Pera",desc:"Caderas más anchas que hombros",emoji:"🍐" },{ id:"apple",label:"Manzana",desc:"Más volumen en torso y abdomen",emoji:"🍎" },{ id:"rectangle",label:"Rectángulo",desc:"Hombros, cintura y caderas similares",emoji:"▬" },{ id:"inverted",label:"Triángulo invertido",desc:"Hombros más anchos que caderas",emoji:"🔺" }],
    skinTones: [{ id:"fair",label:"Clara",hex:"#FDDBB4" },{ id:"light",label:"Media clara",hex:"#E8B88A" },{ id:"medium",label:"Media",hex:"#C68642" },{ id:"olive",label:"Oliva",hex:"#8D5524" },{ id:"tan",label:"Morena",hex:"#6B3A2A" },{ id:"deep",label:"Oscura",hex:"#3D1A0E" }],
    hairColors: ["Rubio","Castaño claro","Castaño oscuro","Negro","Pelirrojo","Gris/Plateado","Teñido/Fantasía"],
    eyeColors: ["Marrones","Verdes","Azules","Grises","Avellana","Negros"],
    dressLevels: { "casual":"Casual","smart casual":"Smart Casual","business casual":"Business Casual","cocktail":"Cóctel","formal":"Formal","black tie":"Black Tie" },
  },
  pt: {
    appName:"Outly", appTag:"AI",
    nav: { scan:"Escanear", wardrobe:"Guarda-roupa", profile:"Meu Perfil", celeb:"Inspiração", trip:"Viagem", salir:"Sair" },
    home: { tagline:"Seu estilista pessoal com IA", headline1:"Seu estilo,", headline2:"elevado", sub:"Digitalize suas roupas, descubra sua paleta de cores, copie o estilo dos seus ícones favoritos e planeje viagens outfit por outfit.", start:"Começar — Digitalizar minhas roupas", viewWardrobe:"Ver meu guarda-roupa" },
    homeCards: [["IA Scan","Grave seu guarda-roupa e a IA detecta cada peça"],["Perfil de imagem","Paleta de cores e silhuetas para seu tipo de corpo"],["Estilo celeb","Replique looks de Zendaya, Kim K, Hailey e mais"],["Guarda-roupa virtual","Todas as suas roupas catalogadas e organizadas"],["Planejador de viagem","Outfits dia a dia com clima real"],["Multi-pessoa","Para toda a família ou grupo"]],
    scan: { cat:"Catalogar peças", title:"Escanear roupas", uploadTitle:"Enviar vídeo do guarda-roupa", uploadDesc:"Grave um percurso lento de 30–90 seg", tips:"Dicas para melhores resultados", tip1:"Mova a câmera lentamente", tip2:"Boa iluminação, sem contraluz", tip3:"Abra brevemente peças dobradas", tip4:"Pode enviar vários vídeos", manualTitle:"Adicionar manualmente", manualDesc:'"Camiseta preta de algodão"', addBtn:"+ Adicionar ao guarda-roupa", viewWardrobe:"Ver guarda-roupa", analyzing:"Analisando seu vídeo...", extracting:"Extraindo frames...", analysing:"frames. Analisando com IA...", done:"peças detectadas.", reviewTitle:"Peças detectadas", reviewSub:"Revise a lista e desmarque o que não está correto. Adicione o que faltou abaixo.", missingTitle:"Faltou alguma?", confirmBtn:"Confirmar peças →", scanAnother:"Escanear outro vídeo" },
    wardrobe: { cat:"Sua coleção", title:"Guarda-roupa", addBtn:"+ Adicionar roupas", tripBtn:"Planejar viagem →", empty:"Seu guarda-roupa está vazio", emptySub:"Digitalize suas roupas para começar", scanBtn:"Escanear roupas", noCategory:"Sem categoria" },
    profile: { cat:"Consultoria personalizada", title:"Meu perfil de imagem", bodyType:"Tipo de corpo", skinTone:"Tom de pele", hairColor:"Cor do cabelo", eyeColor:"Cor dos olhos", generateBtn:"Gerar minha análise de imagem →", generating:"Analisando sua imagem...", working:"Sua consultora de imagem pessoal está trabalhando...", yourPalette:"Sua paleta", season:"Estação", favours:"✓ Te favorecem", avoid:"✗ Melhor evitar", yourSilhouette:"Sua silhueta", yes:"✓ Sim", no:"✗ Não", personalTips:"Dicas pessoais", wardrobeAdvice:"Conselho para seu guarda-roupa" },
    celeb: { cat:"Estilo inspiracional", title:"Inspiração de famosas", sub:"Escolha seu ícone de estilo e a IA replica seus looks mais icônicos com as roupas que você já tem.", analyseBtn:"Replicar estilo de", analysing:"Analisando looks...", noWardrobe:"Sem roupas carregadas — sugestões genéricas serão feitas", analysingSub:"Analisando estilo e combinando com seu guarda-roupa...", celebVersion:"Como", wouldWear:"usaria", yourVersion:"Sua versão — com o que você tem", keyPiece:"🔑 Peça-chave", complete:"🛍️ Completar o look" },
    trip: { cat:"Planejador", title:"Viagem", destination:"Destino", departure:"Data de saída", return:"Data de volta", people:"Pessoas", activities:"Atividades", nightOut:"Haverá saídas noturnas? (bares, baladas, jantares formais)", generateBtn:"Gerar plano com clima e outfits →", loading:"Preparando sua viagem...", loadingSub:"Verificando clima · Analisando roupas · Criando outfits", forecast:"Previsão", planLabel:"Plano de outfits", modify:"← Modificar", viewWardrobe:"Ver guarda-roupa", day:"Dia", night:"Noite", noWardrobe:"Sem roupas — sugestões genéricas serão feitas" },
    salir: { cat:"Consultor de dress code", title:"Sair", sub:"Pesquise qualquer bar, restaurante, clube ou local e a IA analisa o dress code e monta seu outfit.", placeholder:"Ex: Nobu São Paulo, D-Edge, Spot...", cityPlaceholder:"Cidade (opcional, melhora a precisão)", searchBtn:"Analisar dress code e outfit →", searching:"Analisando o local...", searchingSub:"Pesquisando dress code e montando seu outfit...", recentTitle:"Pesquisas recentes", dressCode:"Dress code", required:"Obrigatório", notRequired:"Não obrigatório", reservation:"Reserva", needed:"Necessária", notNeeded:"Não necessária", howToBook:"Como reservar", mustAvoid:"Não usar", dayOutfit:"Outfit do dia", nightOutfit:"Outfit da noite", missing:"Peças faltando", insider:"Dica insider", notApplicable:"Não aplicável para este local", noWardrobe:"Sem roupas — sugestões genéricas serão feitas", emptyTitle:"Pesquise um local para começar", emptySub:"Digite o nome de qualquer bar, restaurante ou clube" },
    cats: ["Tops","Calças","Vestidos/Saias","Casacos","Calçados","Acessórios","Esportivo","Roupas Íntimas"],
    colors: ["Preto","Branco","Cinza","Azul","Vermelho","Verde","Rosa","Bege","Marrom","Multicolor"],
    occasions: ["Trabalho","Casual","Formal","Saída noturna","Esporte","Praia","Evento especial"],
    activities: ["Turismo","Trabalho/reuniões","Praia/piscina","Caminhada","Restaurantes","Compras","Esporte","Museus"],
    bodyTypes: [{ id:"hourglass",label:"Ampulheta",desc:"Ombros e quadris equilibrados, cintura definida",emoji:"⌛" },{ id:"pear",label:"Pêra",desc:"Quadris mais largos que ombros",emoji:"🍐" },{ id:"apple",label:"Maçã",desc:"Mais volume no torso e abdômen",emoji:"🍎" },{ id:"rectangle",label:"Retângulo",desc:"Ombros, cintura e quadris similares",emoji:"▬" },{ id:"inverted",label:"Triângulo invertido",desc:"Ombros mais largos que quadris",emoji:"🔺" }],
    skinTones: [{ id:"fair",label:"Clara",hex:"#FDDBB4" },{ id:"light",label:"Média clara",hex:"#E8B88A" },{ id:"medium",label:"Média",hex:"#C68642" },{ id:"olive",label:"Oliva",hex:"#8D5524" },{ id:"tan",label:"Morena",hex:"#6B3A2A" },{ id:"deep",label:"Escura",hex:"#3D1A0E" }],
    hairColors: ["Loiro","Castanho claro","Castanho escuro","Preto","Ruivo","Grisalho/Prata","Tingido/Fantasia"],
    eyeColors: ["Castanhos","Verdes","Azuis","Cinzas","Avelã","Pretos"],
    dressLevels: { "casual":"Casual","smart casual":"Smart Casual","business casual":"Business Casual","cocktail":"Coquetel","formal":"Formal","black tie":"Black Tie" },
  },
  fr: {
    appName:"Outly", appTag:"AI",
    nav: { scan:"Scanner", wardrobe:"Dressing", profile:"Mon Profil", celeb:"Inspiration", trip:"Voyage", salir:"Sortir" },
    home: { tagline:"Votre styliste personnelle IA", headline1:"Votre style,", headline2:"élevé", sub:"Scannez vos vêtements, découvrez votre palette de couleurs, copiez le style de vos icônes préférées et planifiez des voyages tenue par tenue.", start:"Commencer — Scanner mes vêtements", viewWardrobe:"Voir mon dressing" },
    homeCards: [["IA Scanner","Filmez votre dressing et l'IA détecte chaque pièce"],["Profil d'image","Palette de couleurs et silhouettes pour votre morphologie"],["Style célébrité","Répliquez les looks de Zendaya, Kim K, Hailey et plus"],["Dressing virtuel","Tous vos vêtements catalogués et organisés"],["Planificateur voyage","Tenues jour par jour avec météo réelle"],["Multi-personne","Pour toute la famille ou le groupe"]],
    scan: { cat:"Cataloguer les pièces", title:"Scanner les vêtements", uploadTitle:"Télécharger la vidéo du dressing", uploadDesc:"Filmez un parcours lent de 30–90 sec", tips:"Conseils pour de meilleurs résultats", tip1:"Bougez la caméra lentement", tip2:"Bonne lumière, sans contre-jour", tip3:"Ouvrez brièvement les pièces pliées", tip4:"Vous pouvez envoyer plusieurs vidéos", manualTitle:"Ajouter manuellement", manualDesc:'"T-shirt noir en coton"', addBtn:"+ Ajouter au dressing", viewWardrobe:"Voir mon dressing", analyzing:"Analyse de votre vidéo...", extracting:"Extraction des images...", analysing:"images. Analyse IA...", done:"pièces détectées.", reviewTitle:"Pièces détectées", reviewSub:"Vérifiez la liste et décochez ce qui est incorrect. Ajoutez ce qui manque ci-dessous.", missingTitle:"Il manque quelque chose?", confirmBtn:"Confirmer les pièces →", scanAnother:"Scanner une autre vidéo" },
    wardrobe: { cat:"Votre collection", title:"Dressing", addBtn:"+ Ajouter des vêtements", tripBtn:"Planifier un voyage →", empty:"Votre dressing est vide", emptySub:"Scannez vos vêtements pour commencer", scanBtn:"Scanner les vêtements", noCategory:"Sans catégorie" },
    profile: { cat:"Conseils personnalisés", title:"Mon profil d'image", bodyType:"Morphologie", skinTone:"Teint", hairColor:"Couleur de cheveux", eyeColor:"Couleur des yeux", generateBtn:"Générer mon analyse d'image →", generating:"Analyse de votre image...", working:"Votre conseillère d'image personnelle travaille...", yourPalette:"Votre palette", season:"Saison", favours:"✓ Vous avantage", avoid:"✗ Mieux éviter", yourSilhouette:"Votre silhouette", yes:"✓ Oui", no:"✗ Non", personalTips:"Conseils personnels", wardrobeAdvice:"Conseil pour votre dressing" },
    celeb: { cat:"Style inspirationnel", title:"Inspiration célébrités", sub:"Choisissez votre icône de style et l'IA réplique ses looks les plus emblématiques avec vos vêtements.", analyseBtn:"Répliquer le style de", analysing:"Analyse des looks...", noWardrobe:"Pas de vêtements chargés — suggestions génériques", analysingSub:"Analyse du style et correspondance avec votre dressing...", celebVersion:"Comment", wouldWear:"le porterait", yourVersion:"Votre version — avec ce que vous avez", keyPiece:"🔑 Pièce clé", complete:"🛍️ Compléter le look" },
    trip: { cat:"Planificateur", title:"Voyage", destination:"Destination", departure:"Date de départ", return:"Date de retour", people:"Personnes", activities:"Activités", nightOut:"Des soirées prévues? (bars, clubs, dîners formels)", generateBtn:"Générer le plan avec météo et tenues →", loading:"Préparation de votre voyage...", loadingSub:"Vérification météo · Analyse dressing · Création tenues", forecast:"Prévisions", planLabel:"Plan de tenues", modify:"← Modifier", viewWardrobe:"Voir dressing", day:"Jour", night:"Soir", noWardrobe:"Pas de vêtements — suggestions génériques" },
    salir: { cat:"Conseiller dress code", title:"Sortir", sub:"Recherchez n'importe quel bar, restaurant, club ou lieu et l'IA analyse le dress code et crée votre tenue.", placeholder:"Ex: Nobu Paris, Moulin Rouge, L'Avenue...", cityPlaceholder:"Ville (optionnel, améliore la précision)", searchBtn:"Analyser dress code et tenue →", searching:"Analyse du lieu...", searchingSub:"Recherche dress code et création de votre tenue...", recentTitle:"Recherches récentes", dressCode:"Dress code", required:"Requis", notRequired:"Non requis", reservation:"Réservation", needed:"Nécessaire", notNeeded:"Non nécessaire", howToBook:"Comment réserver", mustAvoid:"À éviter", dayOutfit:"Tenue de jour", nightOutfit:"Tenue de soir", missing:"Pièces manquantes", insider:"Conseil insider", notApplicable:"Non applicable pour ce lieu", noWardrobe:"Pas de vêtements — suggestions génériques", emptyTitle:"Recherchez un lieu pour commencer", emptySub:"Saisissez le nom de n'importe quel bar, restaurant ou club" },
    cats: ["Hauts","Pantalons","Robes/Jupes","Manteaux","Chaussures","Accessoires","Sport","Sous-vêtements"],
    colors: ["Noir","Blanc","Gris","Bleu","Rouge","Vert","Rose","Beige","Marron","Multicolore"],
    occasions: ["Travail","Casual","Formel","Soirée","Sport","Plage","Événement spécial"],
    activities: ["Tourisme","Travail/réunions","Plage/piscine","Randonnée","Restaurants","Shopping","Sport","Musées"],
    bodyTypes: [{ id:"hourglass",label:"Sablier",desc:"Épaules et hanches équilibrées, taille marquée",emoji:"⌛" },{ id:"pear",label:"Poire",desc:"Hanches plus larges que les épaules",emoji:"🍐" },{ id:"apple",label:"Pomme",desc:"Plus de volume dans le torse et abdomen",emoji:"🍎" },{ id:"rectangle",label:"Rectangle",desc:"Épaules, taille et hanches similaires",emoji:"▬" },{ id:"inverted",label:"Triangle inversé",desc:"Épaules plus larges que les hanches",emoji:"🔺" }],
    skinTones: [{ id:"fair",label:"Claire",hex:"#FDDBB4" },{ id:"light",label:"Moyenne claire",hex:"#E8B88A" },{ id:"medium",label:"Moyenne",hex:"#C68642" },{ id:"olive",label:"Olive",hex:"#8D5524" },{ id:"tan",label:"Bronzée",hex:"#6B3A2A" },{ id:"deep",label:"Foncée",hex:"#3D1A0E" }],
    hairColors: ["Blond","Châtain clair","Châtain foncé","Noir","Roux","Gris/Argenté","Coloré/Fantaisie"],
    eyeColors: ["Marrons","Verts","Bleus","Gris","Noisette","Noirs"],
    dressLevels: { "casual":"Décontracté","smart casual":"Smart Casual","business casual":"Business Casual","cocktail":"Cocktail","formal":"Formel","black tie":"Black Tie" },
  },
  de: {
    appName:"Outly", appTag:"AI",
    nav: { scan:"Scannen", wardrobe:"Kleiderschrank", profile:"Mein Profil", celeb:"Inspiration", trip:"Reise", salir:"Ausgehen" },
    home: { tagline:"Ihr persönlicher KI-Stylist", headline1:"Dein Stil,", headline2:"erhoben", sub:"Scannen Sie Ihre Kleidung, entdecken Sie Ihre Farbpalette, kopieren Sie den Stil Ihrer Lieblingsikonen und planen Sie Reisen Outfit für Outfit.", start:"Loslegen — Meine Kleidung scannen", viewWardrobe:"Meinen Kleiderschrank ansehen" },
    homeCards: [["KI Scan","Filmen Sie Ihren Kleiderschrank und KI erkennt jedes Teil"],["Bildprofil","Farbpalette & Silhouetten für Ihren Körpertyp"],["Promi-Stil","Replizieren Sie Looks von Zendaya, Kim K, Hailey und mehr"],["Virtueller Kleiderschrank","Alle Kleidungsstücke katalogisiert und organisiert"],["Reiseplaner","Tagesoutfits mit echtem Wetter"],["Mehrpersonen","Für die ganze Familie oder Gruppe"]],
    scan: { cat:"Kleidungsstücke katalogisieren", title:"Kleidung scannen", uploadTitle:"Kleiderschrankvideo hochladen", uploadDesc:"Nehmen Sie einen langsamen Durchgang von 30–90 Sek. auf", tips:"Tipps für beste Ergebnisse", tip1:"Kamera langsam bewegen", tip2:"Gutes Licht, kein Gegenlicht", tip3:"Gefaltete Teile kurz auffalten", tip4:"Mehrere Videos möglich", manualTitle:"Manuell hinzufügen", manualDesc:'"Schwarzes Baumwoll-T-Shirt"', addBtn:"+ Zum Kleiderschrank hinzufügen", viewWardrobe:"Kleiderschrank ansehen", analyzing:"Ihr Video wird analysiert...", extracting:"Frames werden extrahiert...", analysing:"Frames. KI-Analyse...", done:"Kleidungsstücke erkannt.", reviewTitle:"Erkannte Kleidungsstücke", reviewSub:"Überprüfen Sie die Liste und deaktivieren Sie Falsches. Fügen Sie Fehlendes unten hinzu.", missingTitle:"Etwas fehlt?", confirmBtn:"Kleidungsstücke bestätigen →", scanAnother:"Weiteres Video scannen" },
    wardrobe: { cat:"Ihre Kollektion", title:"Kleiderschrank", addBtn:"+ Kleidung hinzufügen", tripBtn:"Reise planen →", empty:"Ihr Kleiderschrank ist leer", emptySub:"Scannen Sie Ihre Kleidung, um zu beginnen", scanBtn:"Kleidung scannen", noCategory:"Ohne Kategorie" },
    profile: { cat:"Persönliche Beratung", title:"Mein Bildprofil", bodyType:"Körpertyp", skinTone:"Hautton", hairColor:"Haarfarbe", eyeColor:"Augenfarbe", generateBtn:"Meine Bildanalyse generieren →", generating:"Ihr Bild wird analysiert...", working:"Ihre persönliche Bildberaterin arbeitet...", yourPalette:"Ihre Palette", season:"Jahreszeit", favours:"✓ Vorteilhaft", avoid:"✗ Besser vermeiden", yourSilhouette:"Ihre Silhouette", yes:"✓ Ja", no:"✗ Nein", personalTips:"Persönliche Tipps", wardrobeAdvice:"Kleiderschrankrat" },
    celeb: { cat:"Stil-Inspiration", title:"Promi-Inspiration", sub:"Wählen Sie Ihre Stilikone und KI repliziert ihre ikonischsten Looks mit Ihrer vorhandenen Kleidung.", analyseBtn:"Stil replizieren von", analysing:"Looks werden analysiert...", noWardrobe:"Keine Kleidung geladen — generische Vorschläge", analysingSub:"Stil analysieren und mit Ihrem Kleiderschrank abgleichen...", celebVersion:"Wie", wouldWear:"es tragen würde", yourVersion:"Ihre Version — mit dem was Sie haben", keyPiece:"🔑 Schlüsselstück", complete:"🛍️ Look vervollständigen" },
    trip: { cat:"Planer", title:"Reise", destination:"Reiseziel", departure:"Abreisedatum", return:"Rückreisedatum", people:"Personen", activities:"Aktivitäten", nightOut:"Ausgehen geplant? (Bars, Clubs, formelle Abendessen)", generateBtn:"Plan mit Wetter & Outfits generieren →", loading:"Ihre Reise wird vorbereitet...", loadingSub:"Wetter prüfen · Kleidung analysieren · Outfits erstellen", forecast:"Wettervorhersage", planLabel:"Outfit-Plan", modify:"← Ändern", viewWardrobe:"Kleiderschrank ansehen", day:"Tag", night:"Abend", noWardrobe:"Keine Kleidung — generische Vorschläge" },
    salir: { cat:"Dresscode-Berater", title:"Ausgehen", sub:"Suchen Sie eine Bar, ein Restaurant oder einen Club und KI analysiert den Dresscode und erstellt Ihr Outfit.", placeholder:"z.B. Nobu München, Berghain, Tantris...", cityPlaceholder:"Stadt (optional, verbessert Genauigkeit)", searchBtn:"Dresscode & Outfit analysieren →", searching:"Ort wird analysiert...", searchingSub:"Dresscode suchen und Outfit erstellen...", recentTitle:"Letzte Suchen", dressCode:"Dresscode", required:"Erforderlich", notRequired:"Nicht erforderlich", reservation:"Reservierung", needed:"Erforderlich", notNeeded:"Nicht erforderlich", howToBook:"Wie zu buchen", mustAvoid:"Zu vermeiden", dayOutfit:"Tages-Outfit", nightOutfit:"Abend-Outfit", missing:"Fehlende Teile", insider:"Insider-Tipp", notApplicable:"Nicht anwendbar", noWardrobe:"Keine Kleidung — generische Vorschläge", emptyTitle:"Suchen Sie einen Ort zum Starten", emptySub:"Geben Sie den Namen einer Bar, eines Restaurants oder Clubs ein" },
    cats: ["Oberteile","Hosen","Kleider/Röcke","Mäntel","Schuhe","Accessoires","Sportkleidung","Unterwäsche"],
    colors: ["Schwarz","Weiß","Grau","Blau","Rot","Grün","Rosa","Beige","Braun","Mehrfarbig"],
    occasions: ["Arbeit","Casual","Formal","Abend","Sport","Strand","Besonderer Anlass"],
    activities: ["Sightseeing","Arbeit/Meetings","Strand/Pool","Wandern","Restaurants","Shopping","Sport","Museen"],
    bodyTypes: [{ id:"hourglass",label:"Sanduhr",desc:"Ausgeglichene Schultern & Hüften, definierte Taille",emoji:"⌛" },{ id:"pear",label:"Birne",desc:"Hüften breiter als Schultern",emoji:"🍐" },{ id:"apple",label:"Apfel",desc:"Mehr Volumen in Torso und Bauch",emoji:"🍎" },{ id:"rectangle",label:"Rechteck",desc:"Ähnliche Schultern, Taille und Hüften",emoji:"▬" },{ id:"inverted",label:"Umgekehrtes Dreieck",desc:"Schultern breiter als Hüften",emoji:"🔺" }],
    skinTones: [{ id:"fair",label:"Hell",hex:"#FDDBB4" },{ id:"light",label:"Hellmittel",hex:"#E8B88A" },{ id:"medium",label:"Mittel",hex:"#C68642" },{ id:"olive",label:"Oliv",hex:"#8D5524" },{ id:"tan",label:"Gebräunt",hex:"#6B3A2A" },{ id:"deep",label:"Dunkel",hex:"#3D1A0E" }],
    hairColors: ["Blond","Hellbraun","Dunkelbraun","Schwarz","Rot","Grau/Silber","Gefärbt/Fantasy"],
    eyeColors: ["Braun","Grün","Blau","Grau","Haselnuss","Schwarz"],
    dressLevels: { "casual":"Casual","smart casual":"Smart Casual","business casual":"Business Casual","cocktail":"Cocktail","formal":"Formal","black tie":"Black Tie" },
  },
  it: {
    appName:"Outly", appTag:"AI",
    nav: { scan:"Scansiona", wardrobe:"Guardaroba", profile:"Il Mio Profilo", celeb:"Ispirazione", trip:"Viaggio", salir:"Uscire" },
    home: { tagline:"La tua stilista personale con IA", headline1:"Il tuo stile,", headline2:"elevato", sub:"Scansiona i tuoi vestiti, scopri la tua palette di colori, copia lo stile delle tue icone preferite e pianifica viaggi outfit per outfit.", start:"Inizia — Scansiona i miei vestiti", viewWardrobe:"Vedi il mio guardaroba" },
    homeCards: [["Scansione IA","Filma il tuo guardaroba e l'IA rileva ogni capo"],["Profilo immagine","Palette colori e silhouette per il tuo tipo di corpo"],["Stile celeb","Replica i look di Zendaya, Kim K, Hailey e altri"],["Guardaroba virtuale","Tutti i tuoi vestiti catalogati e organizzati"],["Pianificatore viaggio","Outfit giorno per giorno con meteo reale"],["Multi-persona","Per tutta la famiglia o il gruppo"]],
    scan: { cat:"Catalogare capi", title:"Scansiona vestiti", uploadTitle:"Carica video del guardaroba", uploadDesc:"Registra un percorso lento di 30–90 sec", tips:"Consigli per i migliori risultati", tip1:"Muovi la fotocamera lentamente", tip2:"Buona illuminazione, senza controluce", tip3:"Apri brevemente i capi piegati", tip4:"Puoi caricare più video", manualTitle:"Aggiungi manualmente", manualDesc:'"T-shirt nera di cotone"', addBtn:"+ Aggiungi al guardaroba", viewWardrobe:"Vedi guardaroba", analyzing:"Analisi del tuo video...", extracting:"Estrazione frame...", analysing:"frame. Analisi con IA...", done:"capi rilevati.", reviewTitle:"Capi rilevati", reviewSub:"Controlla l'elenco e deseleziona ciò che non è corretto. Aggiungi ciò che manca.", missingTitle:"Manca qualcosa?", confirmBtn:"Conferma capi →", scanAnother:"Scansiona un altro video" },
    wardrobe: { cat:"La tua collezione", title:"Guardaroba", addBtn:"+ Aggiungi vestiti", tripBtn:"Pianifica viaggio →", empty:"Il tuo guardaroba è vuoto", emptySub:"Scansiona i tuoi vestiti per iniziare", scanBtn:"Scansiona vestiti", noCategory:"Senza categoria" },
    profile: { cat:"Consulenza personalizzata", title:"Il mio profilo immagine", bodyType:"Tipo di corpo", skinTone:"Tono della pelle", hairColor:"Colore capelli", eyeColor:"Colore occhi", generateBtn:"Genera la mia analisi immagine →", generating:"Analisi della tua immagine...", working:"La tua consulente di immagine personale sta lavorando...", yourPalette:"La tua palette", season:"Stagione", favours:"✓ Ti valorizza", avoid:"✗ Meglio evitare", yourSilhouette:"La tua silhouette", yes:"✓ Sì", no:"✗ No", personalTips:"Consigli personali", wardrobeAdvice:"Consiglio per il tuo guardaroba" },
    celeb: { cat:"Stile ispirazionale", title:"Ispirazione celebrity", sub:"Scegli la tua icona di stile e l'IA replica i suoi look più iconici con i vestiti che hai già.", analyseBtn:"Replica lo stile di", analysing:"Analisi look...", noWardrobe:"Nessun vestito caricato — suggerimenti generici", analysingSub:"Analisi stile e abbinamento con il tuo guardaroba...", celebVersion:"Come lo indosserebbe", wouldWear:"", yourVersion:"La tua versione — con quello che hai", keyPiece:"🔑 Pezzo chiave", complete:"🛍️ Completa il look" },
    trip: { cat:"Pianificatore", title:"Viaggio", destination:"Destinazione", departure:"Data partenza", return:"Data ritorno", people:"Persone", activities:"Attività", nightOut:"Uscite serali previste? (bar, club, cene formali)", generateBtn:"Genera piano con meteo e outfit →", loading:"Preparazione del tuo viaggio...", loadingSub:"Controllo meteo · Analisi vestiti · Creazione outfit", forecast:"Previsioni", planLabel:"Piano outfit", modify:"← Modifica", viewWardrobe:"Vedi guardaroba", day:"Giorno", night:"Sera", noWardrobe:"Nessun vestito — suggerimenti generici" },
    salir: { cat:"Consulente dress code", title:"Uscire", sub:"Cerca qualsiasi bar, ristorante, club o locale e l'IA analizza il dress code e crea il tuo outfit.", placeholder:"Es: Nobu Milano, Armani/Privé, Langosteria...", cityPlaceholder:"Città (opzionale, migliora la precisione)", searchBtn:"Analizza dress code e outfit →", searching:"Analisi del locale...", searchingSub:"Ricerca dress code e creazione outfit...", recentTitle:"Ricerche recenti", dressCode:"Dress code", required:"Obbligatorio", notRequired:"Non obbligatorio", reservation:"Prenotazione", needed:"Necessaria", notNeeded:"Non necessaria", howToBook:"Come prenotare", mustAvoid:"Da evitare", dayOutfit:"Outfit giorno", nightOutfit:"Outfit sera", missing:"Capi mancanti", insider:"Consiglio insider", notApplicable:"Non applicabile per questo locale", noWardrobe:"Nessun vestito — suggerimenti generici", emptyTitle:"Cerca un locale per iniziare", emptySub:"Inserisci il nome di qualsiasi bar, ristorante o club" },
    cats: ["Top","Pantaloni","Vestiti/Gonne","Cappotti","Calzature","Accessori","Sportivo","Biancheria"],
    colors: ["Nero","Bianco","Grigio","Blu","Rosso","Verde","Rosa","Beige","Marrone","Multicolore"],
    occasions: ["Lavoro","Casual","Formale","Serata","Sport","Spiaggia","Evento speciale"],
    activities: ["Turismo","Lavoro/riunioni","Spiaggia/piscina","Escursionismo","Ristoranti","Shopping","Sport","Musei"],
    bodyTypes: [{ id:"hourglass",label:"Clessidra",desc:"Spalle e fianchi equilibrati, vita definita",emoji:"⌛" },{ id:"pear",label:"Pera",desc:"Fianchi più larghi delle spalle",emoji:"🍐" },{ id:"apple",label:"Mela",desc:"Più volume nel torso e addome",emoji:"🍎" },{ id:"rectangle",label:"Rettangolo",desc:"Spalle, vita e fianchi simili",emoji:"▬" },{ id:"inverted",label:"Triangolo invertito",desc:"Spalle più larghe dei fianchi",emoji:"🔺" }],
    skinTones: [{ id:"fair",label:"Chiara",hex:"#FDDBB4" },{ id:"light",label:"Media chiara",hex:"#E8B88A" },{ id:"medium",label:"Media",hex:"#C68642" },{ id:"olive",label:"Olivastra",hex:"#8D5524" },{ id:"tan",label:"Abbronzata",hex:"#6B3A2A" },{ id:"deep",label:"Scura",hex:"#3D1A0E" }],
    hairColors: ["Biondo","Castano chiaro","Castano scuro","Nero","Rosso","Grigio/Argento","Tinto/Fantasy"],
    eyeColors: ["Marroni","Verdi","Azzurri","Grigi","Nocciola","Neri"],
    dressLevels: { "casual":"Casual","smart casual":"Smart Casual","business casual":"Business Casual","cocktail":"Cocktail","formal":"Formale","black tie":"Black Tie" },
  },
  ja: {
    appName:"Outly", appTag:"AI",
    nav: { scan:"スキャン", wardrobe:"ワードローブ", profile:"マイプロフィール", celeb:"インスピレーション", trip:"旅行", salir:"お出かけ" },
    home: { tagline:"あなたのAIパーソナルスタイリスト", headline1:"あなたのスタイル,", headline2:"進化する", sub:"服をスキャンして、カラーパレットを発見し、お気に入りのアイコンのスタイルを真似て、旅行をコーディネートしましょう。", start:"始める — 服をスキャン", viewWardrobe:"ワードローブを見る" },
    homeCards: [["AIスキャン","クローゼットを撮影するとAIが自動で検出"],["イメージ診断","体型に合った色とシルエットを提案"],["セレブスタイル","Zendaya, Kim K, Haileyなどのルックを再現"],["バーチャルワードローブ","全ての服をカタログ化・整理"],["旅行プランナー","実際の天気で日々のコーディネート"],["複数人","家族やグループでも使える"]],
    scan: { cat:"アイテムをカタログ化", title:"服をスキャン", uploadTitle:"クローゼットの動画をアップロード", uploadDesc:"30〜90秒のゆっくりした動画を撮影", tips:"より良い結果のためのヒント", tip1:"カメラをゆっくり動かす", tip2:"明るい場所で撮影", tip3:"折りたたんだ服は広げて見せる", tip4:"複数の動画もOK", manualTitle:"手動で追加", manualDesc:'"黒いコットンTシャツ"', addBtn:"+ ワードローブに追加", viewWardrobe:"ワードローブを見る", analyzing:"動画を分析中...", extracting:"フレームを抽出中...", analysing:"フレーム。AI分析中...", done:"アイテムを検出しました。", reviewTitle:"検出されたアイテム", reviewSub:"リストを確認して、間違いのチェックを外してください。不足しているものを下に追加してください。", missingTitle:"足りないものは?", confirmBtn:"アイテムを確定 →", scanAnother:"別の動画をスキャン" },
    wardrobe: { cat:"あなたのコレクション", title:"ワードローブ", addBtn:"+ 服を追加", tripBtn:"旅行を計画 →", empty:"ワードローブが空です", emptySub:"服をスキャンして始めましょう", scanBtn:"服をスキャン", noCategory:"カテゴリなし" },
    profile: { cat:"パーソナルアドバイス", title:"マイイメージプロフィール", bodyType:"体型", skinTone:"肌の色", hairColor:"髪の色", eyeColor:"目の色", generateBtn:"イメージ分析を生成 →", generating:"イメージを分析中...", working:"パーソナルイメージコンサルタントが作業中...", yourPalette:"あなたのパレット", season:"シーズン", favours:"✓ 似合う色", avoid:"✗ 避けた方がいい", yourSilhouette:"あなたのシルエット", yes:"✓ はい", no:"✗ いいえ", personalTips:"パーソナルアドバイス", wardrobeAdvice:"ワードローブへのアドバイス" },
    celeb: { cat:"スタイルインスピレーション", title:"セレブインスピレーション", sub:"スタイルアイコンを選ぶと、AIがあなたの服で同じルックを再現します。", analyseBtn:"スタイルを再現：", analysing:"ルックを分析中...", noWardrobe:"服が未登録 — 一般的な提案をします", analysingSub:"スタイルを分析してワードローブと照合中...", celebVersion:"が着るなら", wouldWear:"", yourVersion:"あなたのバージョン — 手持ちの服で", keyPiece:"🔑 キーピース", complete:"🛍️ ルックを完成させる" },
    trip: { cat:"プランナー", title:"旅行", destination:"目的地", departure:"出発日", return:"帰国日", people:"人数", activities:"アクティビティ", nightOut:"夜の外出はありますか？（バー、クラブ、フォーマルディナー）", generateBtn:"天気とコーディネートのプランを生成 →", loading:"旅行の準備中...", loadingSub:"天気確認 · ワードローブ分析 · コーディネート作成", forecast:"天気予報", planLabel:"コーディネートプラン", modify:"← 修正", viewWardrobe:"ワードローブを見る", day:"昼", night:"夜", noWardrobe:"服が未登録 — 一般的な提案" },
    salir: { cat:"ドレスコードアドバイザー", title:"お出かけ", sub:"バー、レストラン、クラブを検索すると、AIがドレスコードを分析してコーディネートを提案します。", placeholder:"例：ノブ東京、WOMB、ゴードンラムゼイ...", cityPlaceholder:"都市（任意、精度向上）", searchBtn:"ドレスコード＆コーディネートを分析 →", searching:"会場を分析中...", searchingSub:"ドレスコードを調べてコーディネートを作成中...", recentTitle:"最近の検索", dressCode:"ドレスコード", required:"必須", notRequired:"不要", reservation:"予約", needed:"必要", notNeeded:"不要", howToBook:"予約方法", mustAvoid:"NGアイテム", dayOutfit:"デイコーデ", nightOutfit:"ナイトコーデ", missing:"不足しているアイテム", insider:"インサイダーヒント", notApplicable:"この会場には該当しません", noWardrobe:"服が未登録 — 一般的な提案", emptyTitle:"会場を検索して始めましょう", emptySub:"バー、レストラン、クラブの名前を入力してください" },
    cats: ["トップス","パンツ","ワンピース/スカート","コート","シューズ","アクセサリー","スポーツウェア","インナー"],
    colors: ["ブラック","ホワイト","グレー","ブルー","レッド","グリーン","ピンク","ベージュ","ブラウン","マルチカラー"],
    occasions: ["仕事","カジュアル","フォーマル","夜の外出","スポーツ","ビーチ","特別なイベント"],
    activities: ["観光","仕事/会議","ビーチ/プール","ハイキング","レストラン","ショッピング","スポーツ","美術館"],
    bodyTypes: [{ id:"hourglass",label:"砂時計型",desc:"肩とヒップのバランスが良く、くびれがある",emoji:"⌛" },{ id:"pear",label:"洋梨型",desc:"肩より腰回りが広い",emoji:"🍐" },{ id:"apple",label:"リンゴ型",desc:"胴体とお腹にボリューム",emoji:"🍎" },{ id:"rectangle",label:"長方形型",desc:"肩、ウエスト、ヒップが同程度",emoji:"▬" },{ id:"inverted",label:"逆三角形",desc:"肩幅がヒップより広い",emoji:"🔺" }],
    skinTones: [{ id:"fair",label:"明るい",hex:"#FDDBB4" },{ id:"light",label:"やや明るい",hex:"#E8B88A" },{ id:"medium",label:"普通",hex:"#C68642" },{ id:"olive",label:"オリーブ",hex:"#8D5524" },{ id:"tan",label:"日焼け",hex:"#6B3A2A" },{ id:"deep",label:"濃い",hex:"#3D1A0E" }],
    hairColors: ["ブロンド","ライトブラウン","ダークブラウン","ブラック","レッド","グレー/シルバー","染め/ファンタジー"],
    eyeColors: ["ブラウン","グリーン","ブルー","グレー","ヘーゼル","ブラック"],
    dressLevels: { "casual":"カジュアル","smart casual":"スマートカジュアル","business casual":"ビジネスカジュアル","cocktail":"カクテル","formal":"フォーマル","black tie":"ブラックタイ" },
  },
  zh: {
    appName:"Outly", appTag:"AI",
    nav: { scan:"扫描", wardrobe:"衣橱", profile:"我的档案", celeb:"灵感", trip:"旅行", salir:"外出" },
    home: { tagline:"您的AI私人造型师", headline1:"您的风格,", headline2:"升华", sub:"扫描您的衣物，发现您的色彩搭配，模仿您喜爱的时尚偶像，并逐套规划旅行穿搭。", start:"开始 — 扫描我的衣物", viewWardrobe:"查看我的衣橱" },
    homeCards: [["AI扫描","录制衣橱视频，AI自动识别每件衣物"],["形象档案","根据体型推荐色彩搭配和轮廓"],["明星风格","复制Zendaya、Kim K、Hailey等人的造型"],["虚拟衣橱","所有衣物分类整理"],["旅行规划","结合真实天气制定每日穿搭"],["多人模式","适合全家或团队使用"]],
    scan: { cat:"分类整理", title:"扫描衣物", uploadTitle:"上传衣橱视频", uploadDesc:"录制30-90秒的慢速浏览视频", tips:"最佳结果小贴士", tip1:"缓慢移动摄像头", tip2:"光线充足，避免逆光", tip3:"短暂展开折叠的衣物", tip4:"可以上传多个视频", manualTitle:"手动添加", manualDesc:'"黑色棉质T恤"', addBtn:"+ 添加到衣橱", viewWardrobe:"查看衣橱", analyzing:"正在分析您的视频...", extracting:"正在提取帧...", analysing:"帧。AI分析中...", done:"件衣物已检测到。", reviewTitle:"已检测到的衣物", reviewSub:"检查列表，取消勾选不正确的项目。在下方添加遗漏的内容。", missingTitle:"遗漏了什么？", confirmBtn:"确认衣物 →", scanAnother:"扫描另一个视频" },
    wardrobe: { cat:"您的收藏", title:"衣橱", addBtn:"+ 添加衣物", tripBtn:"规划旅行 →", empty:"您的衣橱是空的", emptySub:"扫描您的衣物开始使用", scanBtn:"扫描衣物", noCategory:"未分类" },
    profile: { cat:"个性化建议", title:"我的形象档案", bodyType:"体型", skinTone:"肤色", hairColor:"发色", eyeColor:"眼色", generateBtn:"生成我的形象分析 →", generating:"正在分析您的形象...", working:"您的私人形象顾问正在工作...", yourPalette:"您的色彩搭配", season:"季节", favours:"✓ 适合您", avoid:"✗ 建议避免", yourSilhouette:"您的轮廓", yes:"✓ 是", no:"✗ 否", personalTips:"个人建议", wardrobeAdvice:"衣橱建议" },
    celeb: { cat:"风格灵感", title:"明星灵感", sub:"选择您的风格偶像，AI将用您已有的衣物复制她们最标志性的造型。", analyseBtn:"复制风格：", analysing:"正在分析造型...", noWardrobe:"未加载衣物 — 将提供通用建议", analysingSub:"正在分析风格并与您的衣橱匹配...", celebVersion:"的穿法", wouldWear:"", yourVersion:"您的版本 — 用您现有的衣物", keyPiece:"🔑 关键单品", complete:"🛍️ 完成这个造型" },
    trip: { cat:"规划师", title:"旅行", destination:"目的地", departure:"出发日期", return:"返回日期", people:"人数", activities:"活动", nightOut:"有夜间外出计划吗？（酒吧、俱乐部、正式晚宴）", generateBtn:"生成天气与穿搭计划 →", loading:"正在准备您的旅行...", loadingSub:"查询天气 · 分析衣橱 · 制定穿搭", forecast:"天气预报", planLabel:"穿搭计划", modify:"← 修改", viewWardrobe:"查看衣橱", day:"白天", night:"晚上", noWardrobe:"未加载衣物 — 通用建议" },
    salir: { cat:"着装规范顾问", title:"外出", sub:"搜索任何酒吧、餐厅、俱乐部或场所，AI将分析着装要求并为您搭配服装。", placeholder:"例：北京Nobu、上海TAXX、Ultraviolet...", cityPlaceholder:"城市（可选，提高准确性）", searchBtn:"分析着装规范和搭配 →", searching:"正在分析场所...", searchingSub:"查找着装规范并制定您的搭配...", recentTitle:"最近搜索", dressCode:"着装规范", required:"必须", notRequired:"不必须", reservation:"预订", needed:"需要", notNeeded:"不需要", howToBook:"如何预订", mustAvoid:"必须避免", dayOutfit:"白天穿搭", nightOutfit:"晚上穿搭", missing:"缺少的单品", insider:"内部提示", notApplicable:"不适用于此场所", noWardrobe:"未加载衣物 — 通用建议", emptyTitle:"搜索场所开始使用", emptySub:"输入任何酒吧、餐厅或俱乐部的名称" },
    cats: ["上衣","裤子","连衣裙/裙子","外套","鞋履","配件","运动服","内衣"],
    colors: ["黑色","白色","灰色","蓝色","红色","绿色","粉色","米色","棕色","多色"],
    occasions: ["工作","休闲","正式","夜间外出","运动","海滩","特殊活动"],
    activities: ["观光","工作/会议","海滩/游泳池","徒步","餐厅","购物","运动","博物馆"],
    bodyTypes: [{ id:"hourglass",label:"沙漏型",desc:"肩部和臀部均衡，腰部明显",emoji:"⌛" },{ id:"pear",label:"梨型",desc:"臀部比肩部宽",emoji:"🍐" },{ id:"apple",label:"苹果型",desc:"躯干和腹部较丰满",emoji:"🍎" },{ id:"rectangle",label:"长方型",desc:"肩部、腰部和臀部相近",emoji:"▬" },{ id:"inverted",label:"倒三角型",desc:"肩部比臀部宽",emoji:"🔺" }],
    skinTones: [{ id:"fair",label:"白皙",hex:"#FDDBB4" },{ id:"light",label:"偏白",hex:"#E8B88A" },{ id:"medium",label:"中等",hex:"#C68642" },{ id:"olive",label:"橄榄色",hex:"#8D5524" },{ id:"tan",label:"小麦色",hex:"#6B3A2A" },{ id:"deep",label:"深色",hex:"#3D1A0E" }],
    hairColors: ["金发","浅棕","深棕","黑色","红发","灰/银色","染发"],
    eyeColors: ["棕色","绿色","蓝色","灰色","榛色","黑色"],
    dressLevels: { "casual":"休闲","smart casual":"休闲正装","business casual":"商务休闲","cocktail":"鸡尾酒","formal":"正式","black tie":"黑领结" },
  },
};

// ─── AI helper ────────────────────────────────────────────────────────────────
const AI = async (messages, system = "", maxTokens = 1400) => {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: maxTokens, system, messages }),
  });
  const d = await res.json();
  return d.content?.[0]?.text || "";
};
const toJSON = (raw) => { try { return JSON.parse(raw.replace(/```json|```/g, "").trim()); } catch { return null; } };

// ─── extract video frames ─────────────────────────────────────────────────────
const extractFrames = (file, count = 12) =>
  new Promise((resolve) => {
    const video = document.createElement("video");
    video.src = URL.createObjectURL(file);
    video.muted = true; video.playsInline = true;
    video.addEventListener("loadedmetadata", () => {
      const dur = video.duration;
      const times = Array.from({ length: count }, (_, i) => (i * dur) / count);
      const frames = []; const canvas = document.createElement("canvas");
      canvas.width = 480; canvas.height = 270; const ctx = canvas.getContext("2d");
      let idx = 0;
      const next = () => { if (idx >= times.length) { resolve(frames); return; } video.currentTime = times[idx]; };
      video.addEventListener("seeked", () => { ctx.drawImage(video, 0, 0, 480, 270); frames.push(canvas.toDataURL("image/jpeg", 0.7).split(",")[1]); idx++; next(); });
      next();
    });
    video.load();
  });

// ─── design tokens ────────────────────────────────────────────────────────────
const C = {
  bg:"#fdf8f5", surface:"#fff", border:"#ecdfe0",
  rose:"#d4a0b0", roseLight:"#f2d4dd",
  mint:"#b8d8c8", mintLight:"#e0f0e8",
  lilac:"#c8b4d8", lilacLight:"#ede0f5",
  peach:"#f0c8a0", peachLight:"#faeade",
  sky:"#a8cce0", skyLight:"#e0f0fa",
  text:"#3d2c30", muted:"#a08888",
  font:"'Cormorant Garamond', Georgia, serif",
  sans:"'DM Sans', sans-serif",
};

const globalCss = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:#fdf8f5}::-webkit-scrollbar-thumb{background:#e8d0d8}
  body{background:#fdf8f5}
  @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}
  .fadeUp{animation:fadeUp 0.35s ease forwards}
  .tag{display:inline-block;padding:3px 10px;border-radius:20px;background:#f5edef;border:1px solid #ecdfe0;font-size:11px;color:#a08888;margin:2px;font-family:'DM Sans',sans-serif}
  .tag.rose{border-color:#d4a0b066;color:#c07888;background:#f2d4dd55}
  .chip{display:inline-block;padding:5px 12px;border-radius:20px;background:#faeade;border:1px solid #f0c8a0;font-family:'DM Sans',sans-serif;font-size:12px;color:#8a5840;margin:3px}
  .chip.night{background:#ede0f5;border-color:#c8b4d8;color:#6a4880}
  .nav-item{background:none;border:none;color:#c0a0a8;font-family:'DM Sans',sans-serif;font-size:11px;font-weight:500;letter-spacing:1.5px;text-transform:uppercase;cursor:pointer;padding:7px 12px;transition:all 0.2s;position:relative}
  .nav-item.active{color:#c07888}.nav-item.active::after{content:'';position:absolute;bottom:-1px;left:12px;right:12px;height:2px;background:#d4a0b0;border-radius:2px}
  .nav-item:hover{color:#d4a0b0}
  .btn{border:none;cursor:pointer;font-family:'DM Sans',sans-serif;font-weight:500;transition:all 0.2s}
  .btn-rose{background:#d4a0b0;color:#fff;padding:12px 28px;border-radius:10px;font-size:13px}
  .btn-rose:hover{background:#c07888}.btn-rose:disabled{background:#e8d8dc;color:#c0a8b0;cursor:not-allowed}
  .btn-soft{background:#f5edef;color:#3d2c30;padding:11px 22px;border-radius:10px;font-size:13px;border:1px solid #ecdfe0}
  .btn-soft:hover{border-color:#d4a0b0;color:#c07888}
  .btn-pill{background:none;color:#a08888;padding:7px 16px;border-radius:20px;font-size:12px;border:1px solid #ecdfe0}
  .btn-pill.sel{background:#f2d4dd;color:#c07888;border-color:#d4a0b0}
  .btn-pill:hover{border-color:#d4a0b0;color:#c07888}
  .inp{background:#fdf8f5;border:1px solid #ecdfe0;border-radius:10px;padding:11px 14px;font-family:'DM Sans',sans-serif;font-size:13px;color:#3d2c30;width:100%;outline:none;transition:border 0.2s}
  .inp:focus{border-color:#d4a0b0;box-shadow:0 0 0 3px #f2d4dd44}
  .inp option{background:#fff}
  .card{background:#fff;border:1px solid #ecdfe0;border-radius:16px;padding:24px;box-shadow:0 2px 10px #d4a0b00a}
  .lbl{font-family:'DM Sans',sans-serif;font-size:10px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#c0a0a8;display:block;margin-bottom:10px}
  .divider{width:32px;height:2px;background:linear-gradient(90deg,#d4a0b0,#c8b4d8);border-radius:2px;margin:10px 0 24px}
  .dot{width:8px;height:8px;border-radius:50%;background:#d4a0b0;animation:pulse 1.2s ease-in-out infinite}
  .badge{display:inline-flex;align-items:center;justify-content:center;width:18px;height:18px;border-radius:50%;background:#d4a0b0;color:#fff;font-size:9px;font-weight:700;margin-left:5px}
  .lang-btn{background:none;border:1px solid #ecdfe0;border-radius:8px;padding:5px 10px;font-family:'DM Sans',sans-serif;font-size:12px;cursor:pointer;color:#a08888;transition:all 0.2s;display:flex;align-items:center;gap:5px}
  .lang-btn:hover,.lang-btn.active{border-color:#d4a0b0;color:#c07888;background:#fdf0f2}
  .dress-badge{display:inline-block;padding:4px 14px;border-radius:20px;font-family:'DM Sans',sans-serif;font-size:12px;font-weight:600;letter-spacing:0.5px}
`;

const DRESS_COLORS = {
  "casual":{ bg:"#e8f5e9", color:"#2e7d32" },
  "smart casual":{ bg:"#e3f2fd", color:"#1565c0" },
  "business casual":{ bg:"#fff8e1", color:"#f57f17" },
  "cocktail":{ bg:"#f3e5f5", color:"#6a1b9a" },
  "formal":{ bg:"#fce4ec", color:"#880e4f" },
  "black tie":{ bg:"#263238", color:"#eceff1" },
};

// ─── detect browser language ──────────────────────────────────────────────────
const detectLang = () => {
  const l = (navigator.language || navigator.languages?.[0] || "en").slice(0, 2).toLowerCase();
  return T18[l] ? l : "en";
};

// ─── main app ─────────────────────────────────────────────────────────────────
export default function App() {
  const [lang, setLang] = useState(detectLang);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const t = T18[lang];

  const [screen, setScreen] = useState("home");
  const [wardrobe, setWardrobe] = useState([]);

  // scan
  const [scanStep, setScanStep] = useState("upload");
  const [scanProgress, setScanProgress] = useState(0);
  const [scanLog, setScanLog] = useState([]);
  const [detected, setDetected] = useState([]);
  const [manualItem, setManualItem] = useState({ name:"", category:"", color:"" });
  const videoRef = useRef();

  // profile
  const [profile, setProfile] = useState({ bodyType:"", skinTone:"", hairColor:"", eyeColor:"" });
  const [profileResult, setProfileResult] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

  // celeb
  const [celeb, setCeleb] = useState(null);
  const [celebResult, setCelebResult] = useState(null);
  const [celebLoading, setCelebLoading] = useState(false);

  const CELEBRITIES = [
    { id:"zendaya", name:"Zendaya", style:"Avant-garde, experimental, haute couture", emoji:"⭐" },
    { id:"hailey", name:"Hailey Bieber", style:"Minimal chic, street style, neutral tones", emoji:"🤍" },
    { id:"kim", name:"Kim Kardashian", style:"Body-con, monochromatic, sculpted", emoji:"🖤" },
    { id:"bella", name:"Bella Hadid", style:"Y2K, retro, underground fashion", emoji:"🔥" },
    { id:"olivia", name:"Olivia Rodrigo", style:"Punk, indie, eclectic, dark feminine", emoji:"🎸" },
    { id:"beyonce", name:"Beyoncé", style:"Powerful, glamour, statement looks", emoji:"👑" },
    { id:"kendall", name:"Kendall Jenner", style:"Model off-duty, clean girl, understated", emoji:"✨" },
    { id:"sydney", name:"Sydney Sweeney", style:"Coquette, vintage, feminine", emoji:"🌸" },
  ];

  // trip
  const [tripStep, setTripStep] = useState("form");
  const [tripForm, setTripForm] = useState({ destination:"", startDate:"", endDate:"", people:1, activities:[], nightOut:false });
  const [weatherDays, setWeatherDays] = useState([]);
  const [tripPlan, setTripPlan] = useState([]);
  const [tripLoading, setTripLoading] = useState(false);

  // salir
  const [salirQuery, setSalirQuery] = useState("");
  const [salirCity, setSalirCity] = useState("");
  const [salirResult, setSalirResult] = useState(null);
  const [salirLoading, setSalirLoading] = useState(false);
  const [salirHistory, setSalirHistory] = useState([]);

  // ── scan ──
  const handleVideoUpload = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    setScanStep("processing"); setScanProgress(0); setScanLog([t.scan.extracting]);
    let frames;
    try { frames = await extractFrames(file, 12); }
    catch { setScanLog(l => [...l, "Error. Try another video."]); return; }
    setScanLog(l => [...l, `${frames.length} ${t.scan.analysing}`]);
    setScanProgress(20);
    const allItems = [];
    for (let i = 0; i < frames.length; i += 4) {
      const batch = frames.slice(i, i + 4);
      const content = [
        ...batch.map(b => ({ type:"image", source:{ type:"base64", media_type:"image/jpeg", data:b } })),
        { type:"text", text:'Identify every clothing item visible. Respond ONLY with valid JSON, no markdown:\n{"items":[{"name":"White cotton t-shirt","category":"Tops","color":"White","season":"Summer"}]}' }
      ];
      try {
        const raw = await AI([{ role:"user", content }], "Clothing detector. Only valid JSON, no text, no markdown.", 700);
        const p = toJSON(raw); if (p?.items) allItems.push(...p.items);
      } catch {}
      setScanProgress(20 + Math.round(((i + 4) / frames.length) * 70));
    }
    const seen = new Set();
    const unique = allItems.filter(item => { const k = item.name?.toLowerCase().trim(); if (!k || seen.has(k)) return false; seen.add(k); return true; });
    setScanLog(l => [...l, `✓ ${unique.length} ${t.scan.done}`]);
    setScanProgress(100);
    setDetected(unique.map((item, i) => ({ ...item, id: Date.now() + i, selected: true })));
    setScanStep("review");
  };

  const confirmWardrobe = () => {
    setWardrobe(w => [...w, ...detected.filter(i => i.selected)]);
    setDetected([]); setScanStep("upload"); setScanProgress(0); setScanLog([]);
    setScreen("wardrobe");
  };

  // ── profile ──
  const generateProfile = async () => {
    if (!profile.bodyType || !profile.skinTone) return;
    setProfileLoading(true);
    const skinLabel = t.skinTones.find(s => s.id === profile.skinTone)?.label || profile.skinTone;
    const bodyLabel = t.bodyTypes.find(b => b.id === profile.bodyType)?.label || profile.bodyType;
    const prompt = `Person profile:
- Body type: ${bodyLabel}
- Skin tone: ${skinLabel}
- Hair: ${profile.hairColor}
- Eyes: ${profile.eyeColor}

Generate a complete image analysis. Only JSON, no markdown:
{"palette":{"title":"creative palette name","season":"spring/summer/autumn/winter","description":"brief colorimetry description","bestColors":[{"name":"Terracotta","hex":"#C4622D","why":"enhances your warm skin tone"}],"avoidColors":[{"name":"Neon yellow","hex":"#FFFF00","why":"washes out your natural tone"}]},"silhouette":{"description":"body type analysis","tops":{"love":["V-neck","Structured shoulders"],"avoid":["Boat neck","Cropped without waist"]},"bottoms":{"love":["High-waist jeans","Palazzo"],"avoid":["Leggings without tunic"]},"dresses":{"love":["Wrap dress","Midi with waist"],"avoid":["Tube without waist"]},"tips":["tip 1","tip 2","tip 3"]},"wardrobeAdvice":"short personalised advice paragraph"}`;
    const raw = await AI([{ role:"user", content:prompt }], "You are a certified professional image consultant. You know colorimetry (seasonal system), morphology and styling. Respond ONLY with valid JSON.", 1800);
    setProfileResult(toJSON(raw));
    setProfileLoading(false);
  };

  // ── celeb ──
  const generateCelebInspo = async () => {
    if (!celeb) return;
    setCelebLoading(true);
    const celebData = CELEBRITIES.find(c => c.id === celeb);
    const clothesList = wardrobe.length > 0
      ? wardrobe.map(i => `- ${i.name}${i.category ? ` (${i.category})` : ""}${i.color ? `, ${i.color}` : ""}`).join("\n")
      : "(no clothes loaded — suggest generic combinations)";
    const prompt = `Style icon: ${celebData.name}
Characteristic style: ${celebData.style}
User's available clothes:\n${clothesList}

Create 4 iconic ${celebData.name} looks and how to replicate them. JSON only, no markdown:
{"celeb":"${celebData.name}","styleEssence":"short phrase capturing their aesthetic essence","looks":[{"lookName":"iconic look name","occasion":"occasion","celebVersion":"description of how ${celebData.name} would wear it","yourVersion":["piece1","piece2","accessory"],"yourVersionNote":"how to adapt with available clothes","keyPiece":"the defining piece of this look","missingPiece":"what to buy to complete it (optional)"}]}`;
    const raw = await AI([{ role:"user", content:prompt }], "You are an expert fashion stylist. You know each celebrity's style in detail. You help replicate iconic looks with accessible clothing. Only valid JSON.", 1800);
    setCelebResult(toJSON(raw));
    setCelebLoading(false);
  };

  // ── trip ──
  const calcDays = () => {
    if (!tripForm.startDate || !tripForm.endDate) return 0;
    return Math.max(1, Math.round((new Date(tripForm.endDate) - new Date(tripForm.startDate)) / 86400000) + 1);
  };
  const startTrip = async () => {
    if (!tripForm.destination || !tripForm.startDate || !tripForm.endDate) return;
    setTripLoading(true); setTripStep("loading");
    const wRaw = await AI([{ role:"user", content:`Destination: ${tripForm.destination}\nDates: ${tripForm.startDate} to ${tripForm.endDate}\nRealistic day-by-day forecast. Only JSON:\n{"days":[{"date":"YYYY-MM-DD","tempMax":25,"tempMin":18,"conditionEn":"Sunny","emoji":"☀️"}]}` }], "Weather service. Only valid JSON.", 600);
    const wData = toJSON(wRaw); const days = wData?.days || [];
    setWeatherDays(days);
    const clothesList = wardrobe.map(i => `- ${i.name} (${i.category||""}, ${i.color||""})`).join("\n") || "(no clothes — suggest generics)";
    const weatherSummary = days.map(d => `${d.date}: ${d.conditionEn}, ${d.tempMax}°/${d.tempMin}°`).join("\n");
    const oRaw = await AI([{ role:"user", content:`TRIP: ${tripForm.destination} · ${calcDays()} days · ${tripForm.people} person(s)\nActivities: ${tripForm.activities.join(", ")||"general"}\nNights out: ${tripForm.nightOut?"Yes":"No"}\nWEATHER:\n${weatherSummary}\nCLOTHES:\n${clothesList}\nDay-by-day outfit plan. Only JSON:\n{"days":[{"date":"YYYY-MM-DD","dayLabel":"Day 1 — Mon 10 Jun","morning":{"occasion":"Sightseeing","outfit":["White t-shirt","Blue jeans"],"tip":"Comfortable for walking"},"evening":{"occasion":"Dinner","outfit":["Black shirt","Beige trousers"],"tip":"Smart but relaxed"}}]}` }], "Travel stylist. Only valid JSON.", 2500);
    const oData = toJSON(oRaw); setTripPlan(oData?.days || []);
    setTripLoading(false); setTripStep("result");
  };

  // ── salir ──
  const searchPlace = async () => {
    if (!salirQuery.trim()) return;
    setSalirLoading(true); setSalirResult(null);
    const clothesList = wardrobe.length > 0
      ? wardrobe.map(i => `- ${i.name}${i.category ? ` (${i.category})` : ""}${i.color ? `, ${i.color}` : ""}`).join("\n")
      : "(no clothes loaded — suggest generic items)";
    const prompt = `Venue: "${salirQuery}"${salirCity ? ` in ${salirCity}` : ""}
User's clothes:\n${clothesList}

Analyse this venue and build the ideal outfit. Respond ONLY with JSON, no markdown:
{"placeName":"official venue name","placeType":"type (restaurant/bar/club/rooftop/beach club/etc)","city":"city and country","vibe":"one-sentence atmosphere description","dressCode":{"level":"casual|smart casual|business casual|cocktail|formal|black tie","description":"what people typically wear there","required":true,"reservationRequired":true,"reservationNote":"how to book or relevant note (can be null)","mustAvoid":["trainers","beachwear"]},"outfitDay":{"applicable":false},"outfitNight":{"applicable":true,"outfit":["piece1 from wardrobe","piece2","accessory"],"tip":"specific style tip for this venue","alternatives":["alternative if missing piece"]},"missingPieces":["what you would buy to go perfectly"],"insiderTip":"fun fact or insider advice about the venue"}`;
    const raw = await AI([{ role:"user", content:prompt }], "You are a luxury stylist and concierge with global dress code knowledge. You know the world's best bars, restaurants, clubs, and venues and their dress codes. You adapt outfits to the user's available clothing. Only valid JSON.", 1600);
    const parsed = toJSON(raw);
    if (parsed) {
      setSalirResult(parsed);
      setSalirHistory(h => [{ query:salirQuery, city:salirCity, result:parsed, id:Date.now() }, ...h.slice(0, 4)]);
    }
    setSalirLoading(false);
  };

  // ── render helpers ──
  const PageHeader = ({ cat, title }) => (
    <div style={{ marginBottom:36 }}>
      <div style={{ fontFamily:C.sans, fontSize:10, letterSpacing:3, color:C.rose, textTransform:"uppercase" }}>{cat}</div>
      <h1 style={{ fontFamily:C.font, fontSize:36, fontStyle:"italic", fontWeight:400, marginTop:6, color:C.text }}>{title}</h1>
      <div className="divider" />
    </div>
  );

  const LoadingDots = ({ label }) => (
    <div style={{ display:"flex", gap:8, alignItems:"center", padding:"12px 0" }}>
      {[0,1,2].map(i => <div key={i} className="dot" style={{ animationDelay:`${i*0.2}s` }} />)}
      {label && <span style={{ fontSize:12, color:C.muted, marginLeft:8 }}>{label}</span>}
    </div>
  );

  const SCREENS_NAV = [
    ["scan", t.nav.scan],["wardrobe", t.nav.wardrobe],["profile", t.nav.profile],
    ["celeb", t.nav.celeb],["trip", t.nav.trip],["salir", t.nav.salir],
  ];

  return (
    <div style={{ minHeight:"100vh", background:C.bg, color:C.text, fontFamily:C.sans }}>
      <style>{globalCss}</style>

      {/* ── HEADER ── */}
      <header style={{ background:"#fffaf8ee", backdropFilter:"blur(12px)", borderBottom:`1px solid ${C.border}`, position:"sticky", top:0, zIndex:100, padding:"0 20px" }}>
        <div style={{ maxWidth:1060, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between", height:58 }}>
          <div onClick={() => setScreen("home")} style={{ cursor:"pointer", display:"flex", alignItems:"baseline", gap:6 }}>
            <span style={{ fontFamily:C.font, fontSize:20, fontStyle:"italic", color:C.text }}>{t.appName}</span>
            <span style={{ fontFamily:C.sans, fontSize:9, letterSpacing:3, color:C.rose, textTransform:"uppercase" }}>{t.appTag}</span>
          </div>
          <nav style={{ display:"flex", gap:0 }}>
            {SCREENS_NAV.map(([s, label]) => (
              <button key={s} className={`nav-item ${screen===s?"active":""}`} onClick={() => setScreen(s)}>
                {label}
                {s==="wardrobe" && wardrobe.length > 0 && <span className="badge">{wardrobe.length}</span>}
              </button>
            ))}
          </nav>
          {/* Language selector */}
          <div style={{ position:"relative" }}>
            <button className={`lang-btn ${showLangMenu?"active":""}`} onClick={() => setShowLangMenu(v => !v)}>
              <span>{LANGS[lang].flag}</span>
              <span style={{ fontSize:10, letterSpacing:1 }}>{lang.toUpperCase()}</span>
              <span style={{ fontSize:9 }}>▾</span>
            </button>
            {showLangMenu && (
              <div style={{ position:"absolute", right:0, top:"calc(100% + 8px)", background:"#fff", border:`1px solid ${C.border}`, borderRadius:12, padding:8, minWidth:160, boxShadow:"0 8px 24px #d4a0b020", zIndex:200 }}>
                {Object.entries(LANGS).map(([code, { flag, label }]) => (
                  <button key={code} onClick={() => { setLang(code); setShowLangMenu(false); }}
                    style={{ display:"flex", alignItems:"center", gap:10, width:"100%", background:lang===code?"#f2d4dd":"none", border:"none", padding:"8px 12px", borderRadius:8, cursor:"pointer", fontFamily:C.sans, fontSize:13, color:lang===code?"#c07888":C.text, fontWeight:lang===code?600:400 }}>
                    <span style={{ fontSize:16 }}>{flag}</span>{label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      <div style={{ maxWidth:1060, margin:"0 auto", padding:"40px 20px" }} onClick={() => showLangMenu && setShowLangMenu(false)}>

        {/* ══ HOME ══════════════════════════════════════════════════════════════ */}
        {screen==="home" && (
          <div className="fadeUp" style={{ textAlign:"center", padding:"60px 0 80px" }}>
            <div style={{ fontFamily:C.sans, fontSize:10, letterSpacing:4, color:C.rose, textTransform:"uppercase", marginBottom:20 }}>{t.home.tagline}</div>
            <h1 style={{ fontFamily:C.font, fontSize:52, fontWeight:400, fontStyle:"italic", lineHeight:1.1, marginBottom:20, color:C.text }}>
              {t.home.headline1}<br />{t.home.headline2}
            </h1>
            <div style={{ width:1, height:56, background:`linear-gradient(${C.rose}, transparent)`, margin:"0 auto 24px" }} />
            <p style={{ fontSize:15, color:C.muted, maxWidth:460, margin:"0 auto 52px", lineHeight:1.8 }}>{t.home.sub}</p>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14, maxWidth:720, margin:"0 auto 48px" }}>
              {t.homeCards.map(([title,desc], i) => {
                const bgs = [C.roseLight, C.lilacLight, C.peachLight, C.mintLight, C.skyLight, "#fef4e8"];
                const icons = ["◈","◉","★","▦","◎","✦"];
                return (
                  <div key={i} style={{ background:bgs[i], border:`1px solid ${C.border}`, borderRadius:14, padding:"20px 18px", textAlign:"left" }}>
                    <div style={{ fontFamily:C.font, fontSize:22, color:C.rose, marginBottom:10 }}>{icons[i]}</div>
                    <div style={{ fontWeight:600, fontSize:13, marginBottom:6, color:C.text }}>{title}</div>
                    <div style={{ fontSize:12, color:C.muted, lineHeight:1.6 }}>{desc}</div>
                  </div>
                );
              })}
            </div>
            <button className="btn btn-rose" onClick={() => setScreen("scan")} style={{ fontSize:14, padding:"14px 40px", borderRadius:10 }}>{t.home.start}</button>
            {wardrobe.length > 0 && <div style={{ marginTop:14 }}>
              <button className="btn-pill btn" onClick={() => setScreen("wardrobe")} style={{ borderRadius:10 }}>{t.home.viewWardrobe} ({wardrobe.length})</button>
            </div>}
          </div>
        )}

        {/* ══ SCAN ══════════════════════════════════════════════════════════════ */}
        {screen==="scan" && (
          <div className="fadeUp">
            <PageHeader cat={t.scan.cat} title={t.scan.title} />
            {scanStep==="upload" && (
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
                <div>
                  <div className="card" style={{ border:`1px dashed ${C.border}`, textAlign:"center", padding:40, cursor:"pointer" }} onClick={() => videoRef.current.click()}>
                    <div style={{ fontSize:36, marginBottom:16 }}>📹</div>
                    <div style={{ fontFamily:C.font, fontSize:18, fontStyle:"italic", marginBottom:8, color:C.text }}>{t.scan.uploadTitle}</div>
                    <div style={{ fontSize:12, color:C.muted, lineHeight:1.7 }}>{t.scan.uploadDesc}</div>
                    <input ref={videoRef} type="file" accept="video/*" style={{ display:"none" }} onChange={handleVideoUpload} />
                  </div>
                  <div className="card" style={{ marginTop:16, background:C.peachLight, border:`1px solid ${C.peach}` }}>
                    <div style={{ fontWeight:600, fontSize:12, color:"#8a5840", marginBottom:10 }}>💡 {t.scan.tips}</div>
                    <ul style={{ fontSize:12, color:C.muted, lineHeight:2.2, paddingLeft:16 }}>
                      {[t.scan.tip1, t.scan.tip2, t.scan.tip3, t.scan.tip4].map((tip,i) => <li key={i}>{tip}</li>)}
                    </ul>
                  </div>
                </div>
                <div>
                  <div className="card">
                    <div style={{ fontFamily:C.font, fontSize:18, fontStyle:"italic", marginBottom:18, color:C.text }}>{t.scan.manualTitle}</div>
                    <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                      <div>
                        <label className="lbl">Description</label>
                        <input className="inp" placeholder={t.scan.manualDesc} value={manualItem.name} onChange={e => setManualItem(m => ({ ...m, name:e.target.value }))} onKeyDown={e => { if (e.key==="Enter" && manualItem.name) { setWardrobe(w => [...w, { ...manualItem, id:Date.now() }]); setManualItem({ name:"", category:"", color:"" }); }}} />
                      </div>
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                        <div>
                          <label className="lbl">{t.profile.bodyType.includes("body") || lang==="en" ? "Category" : "Catégorie"}</label>
                          <select className="inp" value={manualItem.category} onChange={e => setManualItem(m => ({ ...m, category:e.target.value }))}>
                            <option value="">—</option>{t.cats.map(c => <option key={c}>{c}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="lbl">{t.colors[0]==="Black"?"Color":"Colour"}</label>
                          <select className="inp" value={manualItem.color} onChange={e => setManualItem(m => ({ ...m, color:e.target.value }))}>
                            <option value="">—</option>{t.colors.map(c => <option key={c}>{c}</option>)}
                          </select>
                        </div>
                      </div>
                      <button className="btn btn-rose" onClick={() => { if (!manualItem.name) return; setWardrobe(w => [...w, { ...manualItem, id:Date.now() }]); setManualItem({ name:"", category:"", color:"" }); }} disabled={!manualItem.name}>{t.scan.addBtn}</button>
                    </div>
                    {wardrobe.length > 0 && <div style={{ marginTop:16, paddingTop:16, borderTop:`1px solid ${C.border}`, fontSize:12, color:C.muted }}>
                      {wardrobe.length} items · <button className="btn" style={{ background:"none", color:C.rose, fontSize:12, border:"none", cursor:"pointer", padding:0 }} onClick={() => setScreen("wardrobe")}>{t.scan.viewWardrobe} →</button>
                    </div>}
                  </div>
                </div>
              </div>
            )}
            {scanStep==="processing" && (
              <div className="card" style={{ textAlign:"center", padding:56 }}>
                <div style={{ fontSize:32, marginBottom:20 }}>🔍</div>
                <div style={{ fontFamily:C.font, fontSize:22, fontStyle:"italic", marginBottom:20, color:C.text }}>{t.scan.analyzing}</div>
                <div style={{ background:C.border, borderRadius:20, height:4, maxWidth:300, margin:"0 auto 28px", overflow:"hidden" }}>
                  <div style={{ background:C.rose, height:"100%", width:`${scanProgress}%`, borderRadius:20, transition:"width 0.6s" }} />
                </div>
                {scanLog.map((l, i) => <div key={i} style={{ fontSize:12, color:i===scanLog.length-1?C.muted:"#c0b0b4", marginBottom:4 }}>{l}</div>)}
              </div>
            )}
            {scanStep==="review" && (
              <div>
                <div className="card" style={{ background:C.mintLight, border:`1px solid ${C.mint}`, marginBottom:20 }}>
                  <div style={{ fontWeight:600, fontSize:14, color:"#3a7a5a", marginBottom:4 }}>✓ {t.scan.reviewTitle} — {detected.length} {t.scan.done}</div>
                  <div style={{ fontSize:12, color:"#5a9a7a" }}>{t.scan.reviewSub}</div>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"3fr 2fr", gap:20 }}>
                  <div className="card">
                    <div style={{ fontFamily:C.font, fontSize:18, fontStyle:"italic", marginBottom:16, color:C.text }}>{t.scan.reviewTitle}</div>
                    <div style={{ display:"flex", flexDirection:"column", gap:8, maxHeight:380, overflowY:"auto" }}>
                      {detected.map(item => (
                        <div key={item.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 14px", background:item.selected?C.roseLight:"#faf7f8", borderRadius:8, border:`1px solid ${item.selected?C.rose+"55":C.border}`, opacity:item.selected?1:0.45, transition:"all 0.2s" }}>
                          <input type="checkbox" checked={item.selected} onChange={() => setDetected(d => d.map(i => i.id===item.id?{...i,selected:!i.selected}:i))} style={{ cursor:"pointer", accentColor:C.rose }} />
                          <div style={{ flex:1 }}>
                            <div style={{ fontSize:13, fontWeight:500, color:C.text }}>{item.name}</div>
                            <div style={{ marginTop:4 }}>
                              {item.category && <span className="tag">{item.category}</span>}
                              {item.color && <span className="tag">{item.color}</span>}
                            </div>
                          </div>
                          <button onClick={() => setDetected(d => d.filter(i => i.id!==item.id))} style={{ background:"none", border:"none", color:C.border, cursor:"pointer", fontSize:18 }}>×</button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="card" style={{ marginBottom:16 }}>
                      <div style={{ fontFamily:C.font, fontSize:16, fontStyle:"italic", marginBottom:14, color:C.text }}>{t.scan.missingTitle}</div>
                      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                        <input className="inp" placeholder={t.scan.manualDesc} value={manualItem.name} onChange={e => setManualItem(m => ({ ...m, name:e.target.value }))} />
                        <select className="inp" value={manualItem.category} onChange={e => setManualItem(m => ({ ...m, category:e.target.value }))}>
                          <option value="">—</option>{t.cats.map(c => <option key={c}>{c}</option>)}
                        </select>
                        <select className="inp" value={manualItem.color} onChange={e => setManualItem(m => ({ ...m, color:e.target.value }))}>
                          <option value="">—</option>{t.colors.map(c => <option key={c}>{c}</option>)}
                        </select>
                        <button className="btn btn-soft" onClick={() => { setDetected(d => [...d, { ...manualItem, id:Date.now(), selected:true }]); setManualItem({ name:"", category:"", color:"" }); }}>+ Add</button>
                      </div>
                    </div>
                    <button className="btn btn-rose" style={{ width:"100%", padding:14 }} onClick={confirmWardrobe}>
                      {t.scan.confirmBtn.replace("items", `${detected.filter(i=>i.selected).length}`)} {detected.filter(i=>i.selected).length} →
                    </button>
                    <button className="btn btn-soft" style={{ width:"100%", marginTop:10 }} onClick={() => { setScanStep("upload"); setDetected([]); }}>{t.scan.scanAnother}</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══ WARDROBE ══════════════════════════════════════════════════════════ */}
        {screen==="wardrobe" && (
          <div className="fadeUp">
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:36 }}>
              <div>
                <div style={{ fontFamily:C.sans, fontSize:10, letterSpacing:3, color:C.rose, textTransform:"uppercase" }}>{t.wardrobe.cat}</div>
                <h1 style={{ fontFamily:C.font, fontSize:36, fontStyle:"italic", fontWeight:400, marginTop:6, color:C.text }}>{t.wardrobe.title}</h1>
                <div className="divider" />
              </div>
              <div style={{ display:"flex", gap:10, marginTop:12 }}>
                <button className="btn btn-soft" onClick={() => setScreen("scan")}>{t.wardrobe.addBtn}</button>
                {wardrobe.length > 0 && <button className="btn btn-rose" onClick={() => setScreen("trip")}>{t.wardrobe.tripBtn}</button>}
              </div>
            </div>
            {wardrobe.length===0 ? (
              <div className="card" style={{ textAlign:"center", padding:64 }}>
                <div style={{ fontFamily:C.font, fontSize:22, fontStyle:"italic", color:C.muted, marginBottom:16 }}>{t.wardrobe.empty}</div>
                <div style={{ fontSize:13, color:C.muted, marginBottom:24 }}>{t.wardrobe.emptySub}</div>
                <button className="btn btn-rose" onClick={() => setScreen("scan")}>{t.wardrobe.scanBtn}</button>
              </div>
            ) : (
              <div>
                {[...t.cats, ""].map(cat => {
                  const items = cat ? wardrobe.filter(i => i.category===cat) : wardrobe.filter(i => !i.category);
                  if (!items.length) return null;
                  return (
                    <div key={cat||"nc"} style={{ marginBottom:28 }}>
                      <div style={{ fontFamily:C.sans, fontSize:10, letterSpacing:2, textTransform:"uppercase", color:C.muted, marginBottom:12, paddingBottom:8, borderBottom:`1px solid ${C.border}` }}>
                        {cat||t.wardrobe.noCategory} <span style={{ color:C.rose }}>·</span> {items.length}
                      </div>
                      <div style={{ display:"flex", flexWrap:"wrap", gap:10 }}>
                        {items.map(item => (
                          <div key={item.id} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:"11px 16px", display:"flex", alignItems:"center", gap:10 }}>
                            <div>
                              <div style={{ fontSize:13, color:C.text }}>{item.name}</div>
                              {item.color && <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>{item.color}</div>}
                            </div>
                            <button onClick={() => setWardrobe(w => w.filter(i => i.id!==item.id))} style={{ background:"none", border:"none", color:C.border, cursor:"pointer", fontSize:16, marginLeft:4 }}>×</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ══ PROFILE ══════════════════════════════════════════════════════════ */}
        {screen==="profile" && (
          <div className="fadeUp">
            <PageHeader cat={t.profile.cat} title={t.profile.title} />
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginBottom:24 }}>
              <div className="card">
                <label className="lbl">{t.profile.bodyType}</label>
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {t.bodyTypes.map(bt => (
                    <div key={bt.id} onClick={() => setProfile(p => ({ ...p, bodyType:bt.id }))}
                      style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 14px", borderRadius:10, border:`1px solid ${profile.bodyType===bt.id?C.rose:C.border}`, background:profile.bodyType===bt.id?C.roseLight:"transparent", cursor:"pointer", transition:"all 0.2s" }}>
                      <span style={{ fontSize:20 }}>{bt.emoji}</span>
                      <div>
                        <div style={{ fontSize:13, fontWeight:500, color:C.text }}>{bt.label}</div>
                        <div style={{ fontSize:11, color:C.muted }}>{bt.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
                <div className="card">
                  <label className="lbl">{t.profile.skinTone}</label>
                  <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
                    {t.skinTones.map(s => (
                      <div key={s.id} onClick={() => setProfile(p => ({ ...p, skinTone:s.id }))} style={{ textAlign:"center", cursor:"pointer" }}>
                        <div style={{ width:40, height:40, borderRadius:"50%", background:s.hex, border:`2px solid ${profile.skinTone===s.id?C.rose:"transparent"}`, margin:"0 auto 4px", transition:"border 0.2s" }} />
                        <div style={{ fontSize:10, color:profile.skinTone===s.id?C.rose:C.muted }}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="card">
                  <label className="lbl">{t.profile.hairColor}</label>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                    {t.hairColors.map(h => <button key={h} className={`btn btn-pill ${profile.hairColor===h?"sel":""}`} onClick={() => setProfile(p => ({ ...p, hairColor:h }))}>{h}</button>)}
                  </div>
                </div>
                <div className="card">
                  <label className="lbl">{t.profile.eyeColor}</label>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                    {t.eyeColors.map(e => <button key={e} className={`btn btn-pill ${profile.eyeColor===e?"sel":""}`} onClick={() => setProfile(p => ({ ...p, eyeColor:e }))}>{e}</button>)}
                  </div>
                </div>
              </div>
            </div>
            <button className="btn btn-rose" onClick={generateProfile} disabled={!profile.bodyType || !profile.skinTone || profileLoading} style={{ marginBottom:32, padding:"13px 36px", fontSize:14 }}>
              {profileLoading ? t.profile.generating : t.profile.generateBtn}
            </button>
            {profileLoading && <LoadingDots label={t.profile.working} />}
            {profileResult && (
              <div className="fadeUp">
                <div className="card" style={{ marginBottom:20 }}>
                  <div style={{ fontFamily:C.sans, fontSize:10, letterSpacing:2, color:C.rose, textTransform:"uppercase", marginBottom:6 }}>{t.profile.yourPalette}</div>
                  <div style={{ fontFamily:C.font, fontSize:24, fontStyle:"italic", color:C.text }}>{profileResult.palette?.title}</div>
                  <div style={{ fontSize:12, color:C.muted, marginTop:4, marginBottom:16 }}>{t.profile.season}: {profileResult.palette?.season}</div>
                  <p style={{ fontSize:13, color:C.muted, lineHeight:1.8, marginBottom:24 }}>{profileResult.palette?.description}</p>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
                    <div>
                      <div style={{ fontSize:11, fontWeight:600, letterSpacing:1.5, textTransform:"uppercase", color:"#5a9a6a", marginBottom:12 }}>{t.profile.favours}</div>
                      {profileResult.palette?.bestColors?.map((c, i) => (
                        <div key={i} style={{ display:"flex", alignItems:"center", gap:12, marginBottom:10 }}>
                          <div style={{ width:32, height:32, borderRadius:6, background:c.hex, flexShrink:0, border:`1px solid ${C.border}` }} />
                          <div><div style={{ fontSize:13, color:C.text }}>{c.name}</div><div style={{ fontSize:11, color:C.muted }}>{c.why}</div></div>
                        </div>
                      ))}
                    </div>
                    <div>
                      <div style={{ fontSize:11, fontWeight:600, letterSpacing:1.5, textTransform:"uppercase", color:"#b07878", marginBottom:12 }}>{t.profile.avoid}</div>
                      {profileResult.palette?.avoidColors?.map((c, i) => (
                        <div key={i} style={{ display:"flex", alignItems:"center", gap:12, marginBottom:10 }}>
                          <div style={{ width:32, height:32, borderRadius:6, background:c.hex, flexShrink:0, border:`1px solid ${C.border}`, filter:"grayscale(30%)" }} />
                          <div><div style={{ fontSize:13, color:C.muted }}>{c.name}</div><div style={{ fontSize:11, color:"#c0a8a8" }}>{c.why}</div></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="card" style={{ marginBottom:20 }}>
                  <div style={{ fontFamily:C.font, fontSize:22, fontStyle:"italic", color:C.text, marginBottom:8 }}>{t.profile.yourSilhouette}</div>
                  <p style={{ fontSize:13, color:C.muted, lineHeight:1.8, marginBottom:24 }}>{profileResult.silhouette?.description}</p>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:16, marginBottom:20 }}>
                    {[["Tops", profileResult.silhouette?.tops, C.roseLight], ["Bottoms", profileResult.silhouette?.bottoms, C.mintLight], ["Dresses", profileResult.silhouette?.dresses, C.lilacLight]].map(([label, data, bg]) => data && (
                      <div key={label} style={{ background:bg, borderRadius:10, padding:16, border:`1px solid ${C.border}` }}>
                        <div style={{ fontSize:11, fontWeight:600, letterSpacing:1.5, textTransform:"uppercase", color:C.rose, marginBottom:12 }}>{label}</div>
                        <div style={{ fontSize:11, color:"#5a9a6a", marginBottom:6 }}>{t.profile.yes}</div>
                        {data.love?.map((l, i) => <div key={i} style={{ fontSize:12, color:C.text, marginBottom:3 }}>· {l}</div>)}
                        <div style={{ fontSize:11, color:"#b07878", marginTop:10, marginBottom:6 }}>{t.profile.no}</div>
                        {data.avoid?.map((a, i) => <div key={i} style={{ fontSize:12, color:C.muted, marginBottom:3 }}>· {a}</div>)}
                      </div>
                    ))}
                  </div>
                  <div style={{ background:C.peachLight, borderRadius:10, padding:16, border:`1px solid ${C.peach}` }}>
                    <div style={{ fontSize:11, fontWeight:600, letterSpacing:1.5, textTransform:"uppercase", color:"#8a5840", marginBottom:12 }}>{t.profile.personalTips}</div>
                    {profileResult.silhouette?.tips?.map((tip, i) => (
                      <div key={i} style={{ fontSize:13, color:C.text, marginBottom:8, paddingLeft:16, position:"relative" }}>
                        <span style={{ position:"absolute", left:0, color:C.rose }}>·</span>{tip}
                      </div>
                    ))}
                  </div>
                </div>
                {profileResult.wardrobeAdvice && (
                  <div className="card" style={{ background:C.mintLight, border:`1px solid ${C.mint}` }}>
                    <div style={{ fontFamily:C.font, fontSize:16, fontStyle:"italic", color:"#3a7a5a", marginBottom:10 }}>{t.profile.wardrobeAdvice}</div>
                    <p style={{ fontSize:13, color:C.text, lineHeight:1.9 }}>{profileResult.wardrobeAdvice}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ══ CELEB ════════════════════════════════════════════════════════════ */}
        {screen==="celeb" && (
          <div className="fadeUp">
            <PageHeader cat={t.celeb.cat} title={t.celeb.title} />
            <p style={{ fontSize:13, color:C.muted, maxWidth:500, marginBottom:28 }}>{t.celeb.sub}</p>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:28 }}>
              {CELEBRITIES.map(c => (
                <div key={c.id} onClick={() => { setCeleb(c.id); setCelebResult(null); }}
                  style={{ background:celeb===c.id?C.roseLight:C.surface, border:`1px solid ${celeb===c.id?C.rose:C.border}`, borderRadius:12, padding:"18px 14px", cursor:"pointer", textAlign:"center", transition:"all 0.2s" }}>
                  <div style={{ fontSize:28, marginBottom:8 }}>{c.emoji}</div>
                  <div style={{ fontSize:14, fontWeight:600, color:celeb===c.id?"#c07888":C.text, marginBottom:4 }}>{c.name}</div>
                  <div style={{ fontSize:10, color:C.muted, lineHeight:1.5 }}>{c.style}</div>
                </div>
              ))}
            </div>
            {celeb && (
              <div style={{ marginBottom:32 }}>
                <button className="btn btn-rose" onClick={generateCelebInspo} disabled={celebLoading} style={{ padding:"13px 36px", fontSize:14 }}>
                  {celebLoading ? t.celeb.analysing : `${t.celeb.analyseBtn} ${CELEBRITIES.find(c => c.id===celeb)?.name} →`}
                </button>
                {wardrobe.length===0 && <span style={{ fontSize:12, color:C.muted, marginLeft:16 }}>{t.celeb.noWardrobe}</span>}
              </div>
            )}
            {celebLoading && <LoadingDots label={t.celeb.analysingSub} />}
            {celebResult && (
              <div className="fadeUp">
                <div style={{ marginBottom:24 }}>
                  <div style={{ fontFamily:C.font, fontSize:28, fontStyle:"italic", color:C.text }}>{celebResult.celeb}</div>
                  <div style={{ fontSize:13, color:C.rose, marginTop:4, fontStyle:"italic" }}>"{celebResult.styleEssence}"</div>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                  {celebResult.looks?.map((look, i) => (
                    <div key={i} className="card" style={{ borderTop:`3px solid ${C.rose}` }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
                        <div>
                          <div style={{ fontFamily:C.font, fontSize:18, fontStyle:"italic", color:C.text }}>{look.lookName}</div>
                          <div className="tag rose" style={{ marginTop:6 }}>{look.occasion}</div>
                        </div>
                        <div style={{ fontFamily:C.font, fontSize:28, color:C.border }}>0{i+1}</div>
                      </div>
                      <div style={{ marginBottom:16 }}>
                        <div style={{ fontSize:10, fontWeight:600, letterSpacing:1.5, textTransform:"uppercase", color:C.muted, marginBottom:8 }}>
                          {t.celeb.celebVersion} {celebResult.celeb} {t.celeb.wouldWear}
                        </div>
                        <p style={{ fontSize:12, color:C.muted, lineHeight:1.8 }}>{look.celebVersion}</p>
                      </div>
                      <div style={{ background:C.lilacLight, borderRadius:10, padding:14, marginBottom:12, border:`1px solid ${C.lilac}` }}>
                        <div style={{ fontSize:10, fontWeight:600, letterSpacing:1.5, textTransform:"uppercase", color:"#6a4880", marginBottom:10 }}>{t.celeb.yourVersion}</div>
                        <div style={{ display:"flex", flexWrap:"wrap", marginBottom:10 }}>
                          {look.yourVersion?.map((p, j) => <span key={j} className="chip">{p}</span>)}
                        </div>
                        <p style={{ fontSize:12, color:C.muted, lineHeight:1.7 }}>{look.yourVersionNote}</p>
                      </div>
                      <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                        <div style={{ background:C.mintLight, borderRadius:8, padding:"8px 12px", flex:1, border:`1px solid ${C.mint}` }}>
                          <div style={{ fontSize:10, color:"#3a7a5a", marginBottom:3 }}>{t.celeb.keyPiece}</div>
                          <div style={{ fontSize:12, color:C.text }}>{look.keyPiece}</div>
                        </div>
                        {look.missingPiece && (
                          <div style={{ background:C.peachLight, borderRadius:8, padding:"8px 12px", flex:1, border:`1px solid ${C.peach}` }}>
                            <div style={{ fontSize:10, color:"#8a5840", marginBottom:3 }}>{t.celeb.complete}</div>
                            <div style={{ fontSize:12, color:C.muted }}>{look.missingPiece}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══ TRIP ══════════════════════════════════════════════════════════════ */}
        {screen==="trip" && (
          <div className="fadeUp">
            <PageHeader cat={t.trip.cat} title={t.trip.title} />
            {tripStep==="form" && (
              <div style={{ maxWidth:660 }}>
                <div className="card" style={{ marginBottom:20 }}>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:16, marginBottom:20 }}>
                    <div style={{ gridColumn:"1 / -1" }}>
                      <label className="lbl">{t.trip.destination}</label>
                      <input className="inp" placeholder="Barcelona, Spain" value={tripForm.destination} onChange={e => setTripForm(f => ({ ...f, destination:e.target.value }))} />
                    </div>
                    <div><label className="lbl">{t.trip.departure}</label><input className="inp" type="date" value={tripForm.startDate} onChange={e => setTripForm(f => ({ ...f, startDate:e.target.value }))} /></div>
                    <div><label className="lbl">{t.trip.return}</label><input className="inp" type="date" value={tripForm.endDate} onChange={e => setTripForm(f => ({ ...f, endDate:e.target.value }))} /></div>
                    <div><label className="lbl">{t.trip.people}</label><input className="inp" type="number" min="1" max="10" value={tripForm.people} onChange={e => setTripForm(f => ({ ...f, people:parseInt(e.target.value)||1 }))} /></div>
                  </div>
                  {calcDays() > 0 && (
                    <div style={{ background:C.roseLight, border:`1px solid ${C.rose}`, borderRadius:10, padding:"10px 16px", marginBottom:20, fontSize:13, color:"#c07888" }}>
                      ✈️ {calcDays()} days · {tripForm.people} person{tripForm.people>1?"s":""}
                    </div>
                  )}
                  <div style={{ marginBottom:20 }}>
                    <label className="lbl">{t.trip.activities}</label>
                    <div style={{ display:"flex", flexWrap:"wrap" }}>
                      {t.activities.map(a => (
                        <button key={a} className={`btn btn-pill ${tripForm.activities.includes(a)?"sel":""}`} style={{ margin:3 }}
                          onClick={() => setTripForm(f => ({ ...f, activities:f.activities.includes(a)?f.activities.filter(x=>x!==a):[...f.activities,a] }))}>{a}</button>
                      ))}
                    </div>
                  </div>
                  <label style={{ display:"flex", alignItems:"center", gap:12, cursor:"pointer", marginBottom:24 }}>
                    <input type="checkbox" checked={tripForm.nightOut} onChange={e => setTripForm(f => ({ ...f, nightOut:e.target.checked }))} style={{ width:18, height:18, accentColor:C.rose }} />
                    <span style={{ fontSize:14, color:C.muted }}>{t.trip.nightOut}</span>
                  </label>
                  <button className="btn btn-rose" onClick={startTrip} disabled={!tripForm.destination||!tripForm.startDate||!tripForm.endDate} style={{ padding:"13px 36px", fontSize:14 }}>{t.trip.generateBtn}</button>
                  {wardrobe.length===0 && <div style={{ fontSize:12, color:"#e67e22", marginTop:10 }}>⚠️ {t.trip.noWardrobe}</div>}
                </div>
              </div>
            )}
            {tripStep==="loading" && (
              <div className="card" style={{ textAlign:"center", padding:64 }}>
                <div style={{ fontFamily:C.font, fontSize:24, fontStyle:"italic", color:C.text, marginBottom:20 }}>{t.trip.loading}</div>
                <LoadingDots />
                <div style={{ fontSize:12, color:C.muted, marginTop:8 }}>{t.trip.loadingSub}</div>
              </div>
            )}
            {tripStep==="result" && (
              <div>
                {weatherDays.length > 0 && (
                  <div className="card" style={{ marginBottom:20, padding:"18px 20px" }}>
                    <div style={{ fontFamily:C.sans, fontSize:10, letterSpacing:2, color:C.rose, textTransform:"uppercase", marginBottom:14 }}>{t.trip.forecast} · {tripForm.destination}</div>
                    <div style={{ display:"flex", gap:10, overflowX:"auto", paddingBottom:4 }}>
                      {weatherDays.map(day => (
                        <div key={day.date} style={{ minWidth:76, textAlign:"center", background:C.roseLight, borderRadius:10, padding:"12px 8px", border:`1px solid ${C.border}` }}>
                          <div style={{ fontSize:22, marginBottom:4 }}>{day.emoji}</div>
                          <div style={{ fontSize:10, color:C.muted, marginBottom:4 }}>{new Date(day.date+"T12:00:00").toLocaleDateString(lang, { weekday:"short", day:"numeric" })}</div>
                          <div style={{ fontSize:14, fontWeight:600, color:C.text }}>{day.tempMax}°</div>
                          <div style={{ fontSize:11, color:C.muted }}>{day.tempMin}°</div>
                          <div style={{ fontSize:9, color:C.muted, marginTop:3 }}>{day.conditionEn}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {tripPlan.length > 0 && (
                  <div>
                    <div style={{ fontFamily:C.sans, fontSize:10, letterSpacing:2, color:C.rose, textTransform:"uppercase", marginBottom:16 }}>
                      {t.trip.planLabel} · {tripForm.people} person{tripForm.people>1?"s":""}
                    </div>
                    {tripPlan.map((day, i) => {
                      const w = weatherDays.find(x => x.date===day.date);
                      return (
                        <div key={i} className="card" style={{ marginBottom:16, borderLeft:`3px solid ${C.rose}` }}>
                          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                            <div style={{ fontFamily:C.font, fontSize:20, fontStyle:"italic", color:C.text }}>{day.dayLabel||`Day ${i+1}`}</div>
                            {w && <div style={{ fontSize:13, color:C.muted }}>{w.emoji} {w.tempMax}°/{w.tempMin}° · {w.conditionEn}</div>}
                          </div>
                          <div style={{ display:"grid", gridTemplateColumns:day.evening?"1fr 1fr":"1fr", gap:14 }}>
                            {day.morning && (
                              <div style={{ background:C.peachLight, borderRadius:10, padding:16, border:`1px solid ${C.peach}` }}>
                                <div style={{ fontSize:10, fontWeight:600, letterSpacing:1.5, textTransform:"uppercase", color:"#8a5840", marginBottom:10 }}>☀️ {t.trip.day} · {day.morning.occasion}</div>
                                <div style={{ display:"flex", flexWrap:"wrap", marginBottom:10 }}>{day.morning.outfit?.map((p,j) => <span key={j} className="chip">{p}</span>)}</div>
                                {day.morning.tip && <div style={{ fontSize:11, color:C.muted, fontStyle:"italic" }}>💡 {day.morning.tip}</div>}
                              </div>
                            )}
                            {day.evening && (
                              <div style={{ background:C.lilacLight, borderRadius:10, padding:16, border:`1px solid ${C.lilac}` }}>
                                <div style={{ fontSize:10, fontWeight:600, letterSpacing:1.5, textTransform:"uppercase", color:"#6a4880", marginBottom:10 }}>🌙 {t.trip.night} · {day.evening.occasion}</div>
                                <div style={{ display:"flex", flexWrap:"wrap", marginBottom:10 }}>{day.evening.outfit?.map((p,j) => <span key={j} className="chip night">{p}</span>)}</div>
                                {day.evening.tip && <div style={{ fontSize:11, color:C.muted, fontStyle:"italic" }}>💡 {day.evening.tip}</div>}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                <div style={{ display:"flex", gap:12, marginTop:8 }}>
                  <button className="btn btn-soft" onClick={() => { setTripStep("form"); setTripPlan([]); setWeatherDays([]); }}>{t.trip.modify}</button>
                  <button className="btn btn-rose" onClick={() => setScreen("wardrobe")}>{t.trip.viewWardrobe}</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══ GO OUT / SALIR ════════════════════════════════════════════════════ */}
        {screen==="salir" && (
          <div className="fadeUp">
            <PageHeader cat={t.salir.cat} title={t.salir.title} />
            <p style={{ fontSize:13, color:C.muted, maxWidth:560, marginBottom:28, lineHeight:1.7 }}>{t.salir.sub}</p>

            {/* search bar */}
            <div className="card" style={{ marginBottom:24 }}>
              <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:12, marginBottom:12 }}>
                <div>
                  <label className="lbl">Venue</label>
                  <input className="inp" style={{ fontSize:14 }} placeholder={t.salir.placeholder} value={salirQuery} onChange={e => setSalirQuery(e.target.value)}
                    onKeyDown={e => e.key==="Enter" && searchPlace()} />
                </div>
                <div>
                  <label className="lbl">City</label>
                  <input className="inp" placeholder={t.salir.cityPlaceholder} value={salirCity} onChange={e => setSalirCity(e.target.value)}
                    onKeyDown={e => e.key==="Enter" && searchPlace()} />
                </div>
              </div>
              <button className="btn btn-rose" onClick={searchPlace} disabled={!salirQuery.trim()||salirLoading} style={{ padding:"13px 28px", fontSize:13 }}>
                {salirLoading ? t.salir.searching : t.salir.searchBtn}
              </button>
              {wardrobe.length===0 && <span style={{ fontSize:12, color:C.muted, marginLeft:16 }}>{t.salir.noWardrobe}</span>}
            </div>

            {/* recent searches */}
            {salirHistory.length > 0 && !salirResult && !salirLoading && (
              <div style={{ marginBottom:28 }}>
                <div style={{ fontFamily:C.sans, fontSize:10, letterSpacing:2, color:C.rose, textTransform:"uppercase", marginBottom:14 }}>{t.salir.recentTitle}</div>
                <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                  {salirHistory.map(h => (
                    <button key={h.id} className="btn btn-pill" onClick={() => { setSalirQuery(h.query); setSalirCity(h.city); setSalirResult(h.result); }} style={{ padding:"8px 16px" }}>
                      {h.result.placeName || h.query}
                      {h.city && <span style={{ color:C.muted, marginLeft:4 }}>· {h.city}</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {salirLoading && (
              <div className="card" style={{ textAlign:"center", padding:56 }}>
                <div style={{ fontSize:32, marginBottom:20 }}>🔍</div>
                <div style={{ fontFamily:C.font, fontSize:22, fontStyle:"italic", marginBottom:16, color:C.text }}>{t.salir.searching}</div>
                <LoadingDots label={t.salir.searchingSub} />
              </div>
            )}

            {!salirResult && !salirLoading && salirHistory.length===0 && (
              <div className="card" style={{ textAlign:"center", padding:64 }}>
                <div style={{ fontSize:40, marginBottom:16, opacity:0.4 }}>🍸</div>
                <div style={{ fontFamily:C.font, fontSize:20, fontStyle:"italic", color:C.muted, marginBottom:8 }}>{t.salir.emptyTitle}</div>
                <div style={{ fontSize:13, color:C.muted }}>{t.salir.emptySub}</div>
              </div>
            )}

            {salirResult && !salirLoading && (
              <div className="fadeUp">
                {/* venue header */}
                <div className="card" style={{ marginBottom:20, borderTop:`3px solid ${C.rose}` }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
                    <div>
                      <div style={{ fontFamily:C.font, fontSize:28, fontStyle:"italic", color:C.text }}>{salirResult.placeName}</div>
                      <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginTop:8 }}>
                        <span className="tag">{salirResult.placeType}</span>
                        <span className="tag">{salirResult.city}</span>
                      </div>
                    </div>
                    {salirResult.dressCode?.level && (() => {
                      const dc = DRESS_COLORS[salirResult.dressCode.level] || { bg:C.roseLight, color:"#c07888" };
                      const label = t.dressLevels[salirResult.dressCode.level] || salirResult.dressCode.level;
                      return <span className="dress-badge" style={{ background:dc.bg, color:dc.color }}>{label}</span>;
                    })()}
                  </div>
                  {salirResult.vibe && <p style={{ fontSize:13, color:C.muted, lineHeight:1.7, fontStyle:"italic" }}>"{salirResult.vibe}"</p>}
                </div>

                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginBottom:20 }}>
                  {/* dress code details */}
                  <div className="card">
                    <div style={{ fontFamily:C.sans, fontSize:10, letterSpacing:2, color:C.rose, textTransform:"uppercase", marginBottom:14 }}>{t.salir.dressCode}</div>
                    <p style={{ fontSize:13, color:C.text, lineHeight:1.8, marginBottom:16 }}>{salirResult.dressCode?.description}</p>
                    <div style={{ display:"flex", gap:10, marginBottom:16 }}>
                      <div style={{ flex:1, background:salirResult.dressCode?.required?C.roseLight:"#f0fff4", borderRadius:8, padding:"10px 14px", border:`1px solid ${salirResult.dressCode?.required?C.rose:C.mint}` }}>
                        <div style={{ fontSize:10, fontWeight:600, letterSpacing:1, textTransform:"uppercase", color:salirResult.dressCode?.required?"#c07888":"#3a7a5a", marginBottom:4 }}>{t.salir.dressCode}</div>
                        <div style={{ fontSize:13, fontWeight:600, color:salirResult.dressCode?.required?"#c07888":"#3a7a5a" }}>
                          {salirResult.dressCode?.required ? t.salir.required : t.salir.notRequired}
                        </div>
                      </div>
                      <div style={{ flex:1, background:salirResult.dressCode?.reservationRequired?C.skyLight:"#f0fff4", borderRadius:8, padding:"10px 14px", border:`1px solid ${salirResult.dressCode?.reservationRequired?C.sky:C.mint}` }}>
                        <div style={{ fontSize:10, fontWeight:600, letterSpacing:1, textTransform:"uppercase", color:salirResult.dressCode?.reservationRequired?"#1a6a8a":"#3a7a5a", marginBottom:4 }}>{t.salir.reservation}</div>
                        <div style={{ fontSize:13, fontWeight:600, color:salirResult.dressCode?.reservationRequired?"#1a6a8a":"#3a7a5a" }}>
                          {salirResult.dressCode?.reservationRequired ? t.salir.needed : t.salir.notNeeded}
                        </div>
                      </div>
                    </div>
                    {salirResult.dressCode?.reservationNote && (
                      <div style={{ background:C.skyLight, borderRadius:8, padding:"10px 14px", marginBottom:16, border:`1px solid ${C.sky}` }}>
                        <div style={{ fontSize:10, fontWeight:600, letterSpacing:1, textTransform:"uppercase", color:"#1a6a8a", marginBottom:4 }}>{t.salir.howToBook}</div>
                        <div style={{ fontSize:12, color:C.text }}>{salirResult.dressCode.reservationNote}</div>
                      </div>
                    )}
                    {salirResult.dressCode?.mustAvoid?.length > 0 && (
                      <div>
                        <div style={{ fontSize:10, fontWeight:600, letterSpacing:1.5, textTransform:"uppercase", color:"#b07878", marginBottom:8 }}>{t.salir.mustAvoid}</div>
                        <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                          {salirResult.dressCode.mustAvoid.map((item, i) => (
                            <span key={i} style={{ display:"inline-block", padding:"3px 10px", background:"#fce4ec", border:"1px solid #f8bbd9", borderRadius:20, fontSize:11, color:"#880e4f" }}>✗ {item}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* insider tip */}
                  <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
                    {salirResult.insiderTip && (
                      <div className="card" style={{ background:C.peachLight, border:`1px solid ${C.peach}`, flex:"0 0 auto" }}>
                        <div style={{ fontSize:10, fontWeight:600, letterSpacing:1.5, textTransform:"uppercase", color:"#8a5840", marginBottom:8 }}>{t.salir.insider}</div>
                        <p style={{ fontSize:13, color:C.text, lineHeight:1.8 }}>{salirResult.insiderTip}</p>
                      </div>
                    )}
                    {salirResult.missingPieces?.length > 0 && (
                      <div className="card" style={{ background:C.skyLight, border:`1px solid ${C.sky}` }}>
                        <div style={{ fontSize:10, fontWeight:600, letterSpacing:1.5, textTransform:"uppercase", color:"#1a6a8a", marginBottom:10 }}>🛍️ {t.salir.missing}</div>
                        {salirResult.missingPieces.map((p, i) => (
                          <div key={i} style={{ fontSize:13, color:C.text, marginBottom:6, paddingLeft:14, position:"relative" }}>
                            <span style={{ position:"absolute", left:0, color:C.sky }}>·</span>{p}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* outfits */}
                <div style={{ display:"grid", gridTemplateColumns:salirResult.outfitDay?.applicable&&salirResult.outfitNight?.applicable?"1fr 1fr":"1fr", gap:16, marginBottom:20 }}>
                  {salirResult.outfitDay?.applicable && (
                    <div className="card" style={{ background:C.peachLight, border:`1px solid ${C.peach}` }}>
                      <div style={{ fontSize:10, fontWeight:600, letterSpacing:1.5, textTransform:"uppercase", color:"#8a5840", marginBottom:14 }}>☀️ {t.salir.dayOutfit}</div>
                      <div style={{ display:"flex", flexWrap:"wrap", marginBottom:12 }}>
                        {salirResult.outfitDay.outfit?.map((p, i) => <span key={i} className="chip">{p}</span>)}
                      </div>
                      {salirResult.outfitDay.tip && <div style={{ fontSize:12, color:C.muted, fontStyle:"italic" }}>💡 {salirResult.outfitDay.tip}</div>}
                      {salirResult.outfitDay.alternatives?.length > 0 && (
                        <div style={{ marginTop:12, paddingTop:12, borderTop:`1px solid ${C.peach}` }}>
                          {salirResult.outfitDay.alternatives.map((a, i) => <div key={i} style={{ fontSize:11, color:C.muted }}>↪ {a}</div>)}
                        </div>
                      )}
                    </div>
                  )}
                  {salirResult.outfitNight?.applicable && (
                    <div className="card" style={{ background:C.lilacLight, border:`1px solid ${C.lilac}` }}>
                      <div style={{ fontSize:10, fontWeight:600, letterSpacing:1.5, textTransform:"uppercase", color:"#6a4880", marginBottom:14 }}>🌙 {t.salir.nightOutfit}</div>
                      <div style={{ display:"flex", flexWrap:"wrap", marginBottom:12 }}>
                        {salirResult.outfitNight.outfit?.map((p, i) => <span key={i} className="chip night">{p}</span>)}
                      </div>
                      {salirResult.outfitNight.tip && <div style={{ fontSize:12, color:C.muted, fontStyle:"italic" }}>💡 {salirResult.outfitNight.tip}</div>}
                      {salirResult.outfitNight.alternatives?.length > 0 && (
                        <div style={{ marginTop:12, paddingTop:12, borderTop:`1px solid ${C.lilac}` }}>
                          {salirResult.outfitNight.alternatives.map((a, i) => <div key={i} style={{ fontSize:11, color:C.muted }}>↪ {a}</div>)}
                        </div>
                      )}
                    </div>
                  )}
                  {!salirResult.outfitDay?.applicable && !salirResult.outfitNight?.applicable && (
                    <div className="card" style={{ textAlign:"center", padding:32 }}>
                      <div style={{ fontSize:13, color:C.muted }}>{t.salir.notApplicable}</div>
                    </div>
                  )}
                </div>

                <button className="btn btn-soft" onClick={() => { setSalirResult(null); setSalirQuery(""); setSalirCity(""); }}>← New search</button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
