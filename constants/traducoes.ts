// =====================================================================
// TRADUÇÕES DO APP
// Chave = texto original em português (exatamente como aparece na tela)
// Valor = [inglês, espanhol]
//
// Para traduzir um texto novo, é só adicionar uma linha aqui.
// Texto que não estiver neste arquivo continua aparecendo em português.
// =====================================================================

export type Idioma = "pt" | "en" | "es";

export const IDIOMAS: { codigo: Idioma; nome: string; bandeira: string }[] = [
  { codigo: "pt", nome: "Português", bandeira: "🇧🇷" },
  { codigo: "en", nome: "English", bandeira: "🇺🇸" },
  { codigo: "es", nome: "Español", bandeira: "🇪🇸" },
];

const DICIONARIO: Record<string, [string, string]> = {
  // ---------- Navegação / menu ----------
  Experiências: ["Experiences", "Experiencias"],
  Pacotes: ["Packages", "Paquetes"],
  Hospedagens: ["Stays", "Alojamientos"],
  Produtos: ["Products", "Productos"],
  Categorias: ["Categories", "Categorías"],
  Início: ["Home", "Inicio"],
  Home: ["Home", "Inicio"],
  Favoritos: ["Favorites", "Favoritos"],
  Cupons: ["Coupons", "Cupones"],
  Blog: ["Blog", "Blog"],
  Perfil: ["Profile", "Perfil"],
  Cadastro: ["Sign up", "Registro"],
  Configurações: ["Settings", "Configuración"],
  Contato: ["Contact", "Contacto"],
  Sobre: ["About", "Acerca de"],
  Sair: ["Log out", "Salir"],
  Carrinho: ["Cart", "Carrito"],
  "Explore a Immersia": ["Explore Immersia", "Explora Immersia"],

  // ---------- Blog ----------
  "Selecione um Estado": ["Select a State", "Selecciona un Estado"],
  "Todos os estados": ["All states", "Todos los estados"],
  "Selecione um Município": ["Select a City", "Selecciona un Municipio"],
  "Todos os municípios": ["All cities", "Todos los municipios"],
  "Selecione o Estado:": ["Select the State:", "Selecciona el Estado:"],
  "Selecione o município:": ["Select the city:", "Selecciona el municipio:"],
  "Selecione um estado primeiro": [
    "Select a state first",
    "Selecciona un estado primero",
  ],
  "Limpar Filtros": ["Clear Filters", "Limpiar Filtros"],
  Destaque: ["Featured", "Destacado"],
  "Ler mais": ["Read more", "Leer más"],
  "Nenhum artigo encontrado": [
    "No articles found",
    "No se encontraron artículos",
  ],
  "Tente ajustar os filtros para ver mais resultados.": [
    "Try adjusting the filters to see more results.",
    "Intenta ajustar los filtros para ver más resultados.",
  ],
  "Os Segredos de Campos do Jordão": [
    "The Secrets of Campos do Jordão",
    "Los Secretos de Campos do Jordão",
  ],
  "Descubra as belezas escondidas da Suíça Brasileira...": [
    "Discover the hidden beauty of the Brazilian Switzerland...",
    "Descubre las bellezas escondidas de la Suiza Brasileña...",
  ],
  "Praias Paradisíacas de Búzios": [
    "Paradise Beaches of Búzios",
    "Playas Paradisíacas de Búzios",
  ],
  "Conheça as 23 praias que fazem de Búzios um destino único...": [
    "Meet the 23 beaches that make Búzios a unique destination...",
    "Conoce las 23 playas que hacen de Búzios un destino único...",
  ],
  "As Dunas de Natal": ["The Dunes of Natal", "Las Dunas de Natal"],
  "Aventura e beleza natural nas famosas dunas do Rio Grande do Norte...": [
    "Adventure and natural beauty in the famous dunes of Rio Grande do Norte...",
    "Aventura y belleza natural en las famosas dunas de Río Grande do Norte...",
  ],
  "Tranquilidade em Gonçalves": [
    "Tranquility in Gonçalves",
    "Tranquilidad en Gonçalves",
  ],
  "Um refúgio na Serra da Mantiqueira para quem busca paz...": [
    "A retreat in the Mantiqueira Mountains for those seeking peace...",
    "Un refugio en la Sierra de la Mantiqueira para quien busca paz...",
  ],
  "Paraíso em Porto de Galinhas": [
    "Paradise in Porto de Galinhas",
    "Paraíso en Porto de Galinhas",
  ],
  "Piscinas naturais e águas cristalinas no litoral pernambucano...": [
    "Natural pools and crystal-clear waters on the Pernambuco coast...",
    "Piscinas naturales y aguas cristalinas en el litoral de Pernambuco...",
  ],
  "Cultura Paulistana": ["São Paulo Culture", "Cultura Paulistana"],
  "Museus, teatros e a vibrante vida cultural da maior cidade do Brasil...": [
    "Museums, theaters and the vibrant cultural life of Brazil's largest city...",
    "Museos, teatros y la vibrante vida cultural de la mayor ciudad de Brasil...",
  ],
  "Voltar para o Blog": ["Back to Blog", "Volver al Blog"],
  "Próximo Artigo: Praias de Búzios": [
    "Next Article: Beaches of Búzios",
    "Próximo Artículo: Playas de Búzios",
  ],

  // ---------- Cupons ----------
  "Desconto de 10% em qualquer pacote": [
    "10% off any package",
    "10% de descuento en cualquier paquete",
  ],
  "R$ 80 de desconto em hospedagens": [
    "R$ 80 off stays",
    "R$ 80 de descuento en alojamientos",
  ],
  "15% off em experiências": [
    "15% off experiences",
    "15% de descuento en experiencias",
  ],
  "300 milhas extras por viagem": [
    "300 extra miles per trip",
    "300 millas extra por viaje",
  ],
  Milhas: ["Miles", "Millas"],
  "5% de desconto na primeira compra": [
    "5% off your first purchase",
    "5% de descuento en la primera compra",
  ],
  "Primeira Compra": ["First Purchase", "Primera Compra"],
  "R$ 100 de desconto em pacotes de verão": [
    "R$ 100 off summer packages",
    "R$ 100 de descuento en paquetes de verano",
  ],
  Verão: ["Summer", "Verano"],
  "20% off para grupos acima de 4 pessoas": [
    "20% off for groups of more than 4 people",
    "20% de descuento para grupos de más de 4 personas",
  ],
  Grupos: ["Groups", "Grupos"],
  "R$ 50 de desconto em reservas de última hora": [
    "R$ 50 off last-minute bookings",
    "R$ 50 de descuento en reservas de último minuto",
  ],
  "Última Hora": ["Last Minute", "Último Minuto"],
  "Cupom Immersian": ["Immersian Coupon", "Cupón Immersian"],
  "Sucesso!": ["Success!", "¡Éxito!"],
  "Cupom compartilhado! Use no momento da compra.": [
    "Coupon shared! Use it at checkout.",
    "¡Cupón compartido! Úsalo al momento de la compra.",
  ],
  Erro: ["Error", "Error"],
  "Não foi possível compartilhar o cupom": [
    "Could not share the coupon",
    "No fue posible compartir el cupón",
  ],
  "Cupom resgatado!": ["Coupon redeemed!", "¡Cupón canjeado!"],
  "Aplique o código na hora do pagamento.": [
    "Apply the code at payment.",
    "Aplica el código al momento del pago.",
  ],
  "cupom disponível": ["coupon available", "cupón disponible"],
  "cupons disponíveis": ["coupons available", "cupones disponibles"],
  "Buscar cupom...": ["Search coupon...", "Buscar cupón..."],
  OFF: ["OFF", "DTO"],
  "Mínimo:": ["Minimum:", "Mínimo:"],
  "Válido até:": ["Valid until:", "Válido hasta:"],
  "✅ Usado": ["✅ Used", "✅ Usado"],
  Resgatar: ["Redeem", "Canjear"],
  "Nenhum cupom encontrado": ["No coupons found", "No se encontraron cupones"],
  "Tente outra busca ou categoria": [
    "Try another search or category",
    "Prueba otra búsqueda o categoría",
  ],
  "Como usar:": ["How to use:", "Cómo usar:"],
  "1. Toque no código do cupom para compartilhar": [
    "1. Tap the coupon code to share it",
    "1. Toca el código del cupón para compartirlo",
  ],
  '2. Clique em "Resgatar" para ativar o cupom': [
    '2. Click "Redeem" to activate the coupon',
    '2. Haz clic en "Canjear" para activar el cupón',
  ],
  "3. Use o código no momento da sua compra": [
    "3. Use the code at checkout",
    "3. Usa el código al momento de tu compra",
  ],
  "4. Cada cupom pode ser usado apenas uma vez": [
    "4. Each coupon can only be used once",
    "4. Cada cupón solo puede usarse una vez",
  ],

  // ---------- Experiências / Hospedagens / Pacotes ----------
  "Não foi possível carregar as experiências": [
    "Could not load experiences",
    "No fue posible cargar las experiencias",
  ],
  "Experiência adicionada aos favoritos!": [
    "Experience added to favorites!",
    "¡Experiencia añadida a favoritos!",
  ],
  "Experiência removida dos favoritos!": [
    "Experience removed from favorites!",
    "¡Experiencia eliminada de favoritos!",
  ],
  "Quantidade indisponível em estoque": [
    "Quantity not available in stock",
    "Cantidad no disponible en stock",
  ],
  "Continuar Comprando": ["Continue Shopping", "Seguir Comprando"],
  "Ver Carrinho": ["View Cart", "Ver Carrito"],
  "Data não disponível": ["Date not available", "Fecha no disponible"],
  "vagas disponíveis": ["spots available", "plazas disponibles"],
  "Categoria:": ["Category:", "Categoría:"],
  Experiência: ["Experience", "Experiencia"],
  Descrição: ["Description", "Descripción"],
  "Criado em:": ["Created on:", "Creado el:"],
  "Vagas desejadas:": ["Spots wanted:", "Plazas deseadas:"],
  "Total:": ["Total:", "Total:"],
  "Adicionar ao Carrinho": ["Add to Cart", "Añadir al Carrito"],
  EXPERIÊNCIAS: ["EXPERIENCES", "EXPERIENCIAS"],
  "Buscar experiências...": ["Search experiences...", "Buscar experiencias..."],
  "Acesso Necessário": ["Access Required", "Acceso Necesario"],
  "Faça login para continuar com essa ação.": [
    "Log in to continue with this action.",
    "Inicia sesión para continuar con esta acción.",
  ],
  "Fazer Login": ["Log In", "Iniciar Sesión"],
  Cancelar: ["Cancel", "Cancelar"],
  Pacote: ["Package", "Paquete"],
  Hospedagem: ["Stay", "Alojamiento"],
  "Remover favorito": ["Remove favorite", "Quitar favorito"],
  "Deseja realmente remover este item dos favoritos?": [
    "Do you really want to remove this item from favorites?",
    "¿Realmente deseas quitar este elemento de favoritos?",
  ],
  Remover: ["Remove", "Quitar"],
  Sucesso: ["Success", "Éxito"],
  "Item removido dos favoritos!": [
    "Item removed from favorites!",
    "¡Elemento eliminado de favoritos!",
  ],
  "item salvo": ["saved item", "elemento guardado"],
  "itens salvos": ["saved items", "elementos guardados"],
  avaliações: ["reviews", "valoraciones"],
  "RESERVAR AGORA": ["BOOK NOW", "RESERVAR AHORA"],
  "Nenhum favorito ainda": ["No favorites yet", "Aún no hay favoritos"],
  "Explore nossos destinos e adicione seus lugares favoritos clicando no coração ♥":
    [
      "Explore our destinations and add your favorite places by tapping the heart ♥",
      "Explora nuestros destinos y añade tus lugares favoritos tocando el corazón ♥",
    ],
  "Não foi possível carregar as hospedagens": [
    "Could not load stays",
    "No fue posible cargar los alojamientos",
  ],
  "Selecionar data": ["Select date", "Seleccionar fecha"],
  "Hospedagem adicionada aos favoritos!": [
    "Stay added to favorites!",
    "¡Alojamiento añadido a favoritos!",
  ],
  "Hospedagem removida dos favoritos!": [
    "Stay removed from favorites!",
    "¡Alojamiento eliminado de favoritos!",
  ],
  "Selecione as datas de check-in e check-out": [
    "Select check-in and check-out dates",
    "Selecciona las fechas de check-in y check-out",
  ],
  "A data de check-out deve ser após o check-in": [
    "The check-out date must be after check-in",
    "La fecha de check-out debe ser posterior al check-in",
  ],
  "Quantidade de diárias indisponível": [
    "Number of nights not available",
    "Cantidad de noches no disponible",
  ],
  Atenção: ["Attention", "Atención"],
  "Selecione as datas de check-in e check-out para continuar.": [
    "Select check-in and check-out dates to continue.",
    "Selecciona las fechas de check-in y check-out para continuar.",
  ],
  "/ diária": ["/ night", "/ noche"],
  "Selecione o Check-in": ["Select Check-in", "Selecciona el Check-in"],
  "Selecione o Check-out": ["Select Check-out", "Selecciona el Check-out"],
  "Disponibilidade:": ["Availability:", "Disponibilidad:"],
  "Selecione as datas da sua estadia": [
    "Select your stay dates",
    "Selecciona las fechas de tu estancia",
  ],
  "Check-in": ["Check-in", "Check-in"],
  "Check-out": ["Check-out", "Check-out"],
  diária: ["night", "noche"],
  diárias: ["nights", "noches"],
  "de estadia": ["of stay", "de estancia"],
  "Acomodação:": ["Accommodation:", "Alojamiento:"],
  "Sobre o espaço": ["About the space", "Sobre el espacio"],
  "Anunciado em:": ["Listed on:", "Publicado el:"],
  "Total da estadia:": ["Stay total:", "Total de la estancia:"],
  HOSPEDAGENS: ["STAYS", "ALOJAMIENTOS"],
  "Buscar hospedagens...": ["Search stays...", "Buscar alojamientos..."],
  "Pacote adicionado aos favoritos!": [
    "Package added to favorites!",
    "¡Paquete añadido a favoritos!",
  ],
  "Pacote removido dos favoritos!": [
    "Package removed from favorites!",
    "¡Paquete eliminado de favoritos!",
  ],
  "Faça login para favoritar": [
    "Log in to add favorites",
    "Inicia sesión para añadir favoritos",
  ],
  "Você precisa estar logado para salvar pacotes nos favoritos.": [
    "You need to be logged in to save packages to favorites.",
    "Debes iniciar sesión para guardar paquetes en favoritos.",
  ],
  "Você precisa estar logado para salvar experiências nos favoritos.": [
    "You need to be logged in to save experiences to favorites.",
    "Debes iniciar sesión para guardar experiencias en favoritos.",
  ],
  PACOTES: ["PACKAGES", "PAQUETES"],
  "Buscar pacotes...": ["Search packages...", "Buscar paquetes..."],
  "Nenhum pacote encontrado": [
    "No packages found",
    "No se encontraron paquetes",
  ],
  "5 dias": ["5 days", "5 días"],
  "6 dias": ["6 days", "6 días"],
  "4 dias": ["4 days", "4 días"],
  "3 dias": ["3 days", "3 días"],

  // ---------- Home ----------
  "Digite o nome de uma cidade": [
    "Enter a city name",
    "Escribe el nombre de una ciudad",
  ],
  "Não foi possível abrir o mapa": [
    "Could not open the map",
    "No fue posible abrir el mapa",
  ],
  "Primeiro digite uma cidade": [
    "Enter a city first",
    "Primero escribe una ciudad",
  ],
  "Digite uma cidade": ["Enter a city", "Escribe una ciudad"],
  "Digite o nome da cidade": [
    "Enter the city name",
    "Escribe el nombre de la ciudad",
  ],
  "Ex: Rio de Janeiro, Salvador, Gramado...": [
    "E.g.: Rio de Janeiro, Salvador, Gramado...",
    "Ej.: Río de Janeiro, Salvador, Gramado...",
  ],
  "Buscar cidade": ["Search city", "Buscar ciudad"],
  "Cidade selecionada:": ["Selected city:", "Ciudad seleccionada:"],
  "O que você quer fazer em": [
    "What do you want to do in",
    "¿Qué quieres hacer en",
  ],
  Restaurantes: ["Restaurants", "Restaurantes"],
  Hotéis: ["Hotels", "Hoteles"],
  Praias: ["Beaches", "Playas"],
  Parques: ["Parks", "Parques"],
  Museus: ["Museums", "Museos"],
  Shoppings: ["Malls", "Centros comerciales"],
  Bares: ["Bars", "Bares"],
  "Pontos Turísticos": ["Tourist Attractions", "Puntos Turísticos"],
  "Ver tudo em": ["See all in", "Ver todo en"],
  "Sugestões:": ["Suggestions:", "Sugerencias:"],
  "Visite o Rio de Janeiro": ["Visit Rio de Janeiro", "Visita Río de Janeiro"],
  "Até 30% OFF": ["Up to 30% OFF", "Hasta 30% DTO"],
  Reserve: ["Book", "Reserva"],
  "Pacotes Completos": ["Complete Packages", "Paquetes Completos"],
  "Hospedagem + Voo": ["Stay + Flight", "Alojamiento + Vuelo"],
  "Ver ofertas": ["See offers", "Ver ofertas"],
  "Viagens em Grupo": ["Group Trips", "Viajes en Grupo"],
  "Descontos especiais": ["Special discounts", "Descuentos especiales"],
  "Saiba mais": ["Learn more", "Saber más"],
  "SAIBA MAIS": ["LEARN MORE", "SABER MÁS"],
  "Conheça o que oferecemos:": [
    "Discover what we offer:",
    "Conoce lo que ofrecemos:",
  ],
  "Experiências próximas de você:": [
    "Experiences near you:",
    "Experiencias cerca de ti:",
  ],
  "Promoções da semana": ["Deals of the week", "Ofertas de la semana"],

  // ---------- Perfil / menu do perfil ----------
  "Editar Perfil": ["Edit Profile", "Editar Perfil"],
  "Atualize seus dados cadastrais e senha": [
    "Update your account details and password",
    "Actualiza tus datos de registro y contraseña",
  ],
  Suporte: ["Support", "Soporte"],
  "Termos e Privacidade": ["Terms and Privacy", "Términos y Privacidad"],
  "Meus Favoritos": ["My Favorites", "Mis Favoritos"],
  "Minhas Reservas": ["My Bookings", "Mis Reservas"],
  "Cadastrar Produto": ["Add Product", "Registrar Producto"],
  "Adicione um novo produto": ["Add a new product", "Añade un nuevo producto"],
  "Minhas Hospedagens": ["My Stays", "Mis Alojamientos"],
  "Meus Ganhos": ["My Earnings", "Mis Ganancias"],
  "Gerenciar Usuários": ["Manage Users", "Gestionar Usuarios"],
  "Relatórios Gerais": ["General Reports", "Informes Generales"],
  "Meu Perfil": ["My Profile", "Mi Perfil"],
  "Usuário Immersia": ["Immersia User", "Usuario Immersia"],
  Opções: ["Options", "Opciones"],
  "Sair da conta": ["Log out of account", "Cerrar sesión"],

  // ---------- Novo post (blog) ----------
  "O título é obrigatório.": [
    "The title is required.",
    "El título es obligatorio.",
  ],
  "O resumo é obrigatório.": [
    "The summary is required.",
    "El resumen es obligatorio.",
  ],
  "O conteúdo é obrigatório.": [
    "The content is required.",
    "El contenido es obligatorio.",
  ],
  "Selecione um estado.": ["Select a state.", "Selecciona un estado."],
  "Selecione uma cidade.": ["Select a city.", "Selecciona una ciudad."],
  "Post publicado com sucesso!": [
    "Post published successfully!",
    "¡Publicación realizada con éxito!",
  ],
  OK: ["OK", "OK"],
  "Não foi possível salvar o post.": [
    "Could not save the post.",
    "No fue posible guardar la publicación.",
  ],
  "Selecione uma Cidade": ["Select a City", "Selecciona una Ciudad"],
  "Novo Post": ["New Post", "Nueva Publicación"],
  Publicar: ["Publish", "Publicar"],
  "Título *": ["Title *", "Título *"],
  "Digite o título do post": [
    "Enter the post title",
    "Escribe el título de la publicación",
  ],
  "Resumo *": ["Summary *", "Resumen *"],
  "Digite um resumo do post": [
    "Enter a post summary",
    "Escribe un resumen de la publicación",
  ],
  "Conteúdo *": ["Content *", "Contenido *"],
  "Digite o conteúdo completo do post": [
    "Enter the full post content",
    "Escribe el contenido completo de la publicación",
  ],
  "Estado *": ["State *", "Estado *"],
  "Cidade *": ["City *", "Ciudad *"],
  Imagem: ["Image", "Imagen"],
  "Adicione uma imagem": ["Add an image", "Añade una imagen"],
  "(Funcionalidade em breve)": [
    "(Feature coming soon)",
    "(Funcionalidad próximamente)",
  ],

  // ---------- Cadastro de produto ----------
  "Acesso Negado": ["Access Denied", "Acceso Denegado"],
  "Você precisa estar logado para cadastrar.": [
    "You need to be logged in to register.",
    "Debes iniciar sesión para registrarte.",
  ],
  "Ir para Login": ["Go to Login", "Ir a Iniciar Sesión"],
  "Campos obrigatórios": ["Required fields", "Campos obligatorios"],
  "Por favor, preencha Nome, Descrição, Preço e insira ao menos uma Imagem válida.":
    [
      "Please fill in Name, Description, Price and add at least one valid Image.",
      "Por favor, completa Nombre, Descripción, Precio e inserta al menos una Imagen válida.",
    ],
  "Sessão inválida. Faça login novamente.": [
    "Invalid session. Please log in again.",
    "Sesión inválida. Inicia sesión nuevamente.",
  ],
  "Sua experiência foi cadastrada perfeitamente.": [
    "Your experience was registered successfully.",
    "Tu experiencia fue registrada perfectamente.",
  ],
  "Erro ao cadastrar": ["Registration error", "Error al registrar"],
  "Verifique os dados ou a conexão com o servidor.": [
    "Check the data or the server connection.",
    "Verifica los datos o la conexión con el servidor.",
  ],
  "Novo Produto": ["New Product", "Nuevo Producto"],
  "Tipo de Cadastro": ["Registration Type", "Tipo de Registro"],
  "Título do Anúncio *": ["Listing Title *", "Título del Anuncio *"],
  "Ex: Passeio de Balão ao Entardecer": [
    "E.g.: Sunset Balloon Ride",
    "Ej.: Paseo en Globo al Atardecer",
  ],
  Categoria: ["Category", "Categoría"],
  "Ex: Natureza": ["E.g.: Nature", "Ej.: Naturaleza"],
  "Preço (R$) *": ["Price (R$) *", "Precio (R$) *"],
  Localização: ["Location", "Ubicación"],
  "Cidade - UF": ["City - State", "Ciudad - Estado"],
  "Duração / Vagas": ["Duration / Spots", "Duración / Plazas"],
  "Ex: 3 horas": ["E.g.: 3 hours", "Ej.: 3 horas"],
  "Vagas Disponíveis em Estoque": [
    "Spots Available in Stock",
    "Plazas Disponibles en Stock",
  ],
  "Ex: 10": ["E.g.: 10", "Ej.: 10"],
  "URLs das Imagens *": ["Image URLs *", "URLs de las Imágenes *"],
  "Adicionar Foto": ["Add Photo", "Añadir Foto"],
  "Descrição Detalhada *": [
    "Detailed Description *",
    "Descripción Detallada *",
  ],
  "Conte detalhes sobre o que torna essa vivência única...": [
    "Tell us what makes this experience unique...",
    "Cuenta detalles sobre lo que hace única esta vivencia...",
  ],
  "O que está incluso? (Opcional)": [
    "What's included? (Optional)",
    "¿Qué está incluido? (Opcional)",
  ],
  "Ex: Almoço, Equipamentos, Guia Local": [
    "E.g.: Lunch, Equipment, Local Guide",
    "Ej.: Almuerzo, Equipos, Guía Local",
  ],
  "O que NÃO está incluso? (Opcional)": [
    "What's NOT included? (Optional)",
    "¿Qué NO está incluido? (Opcional)",
  ],
  "Ex: Transporte até o local, bebidas": [
    "E.g.: Transport to the venue, drinks",
    "Ej.: Transporte hasta el lugar, bebidas",
  ],

  // ---------- Login / Cadastro ----------
  "Preencha todos os campos!": [
    "Fill in all fields!",
    "¡Completa todos los campos!",
  ],
  "Cadastro realizado com sucesso!": [
    "Registration completed successfully!",
    "¡Registro realizado con éxito!",
  ],
  "Erro desconhecido ao conectar ao servidor.": [
    "Unknown error connecting to the server.",
    "Error desconocido al conectar con el servidor.",
  ],
  "Erro no Cadastro": ["Registration Error", "Error en el Registro"],
  "Criar conta": ["Create account", "Crear cuenta"],
  "Cadastre-se para começar": [
    "Sign up to get started",
    "Regístrate para comenzar",
  ],
  "Quero me cadastrar como:": [
    "I want to sign up as:",
    "Quiero registrarme como:",
  ],
  "👤 Cliente": ["👤 Customer", "👤 Cliente"],
  "🏠 Anfitrião": ["🏠 Host", "🏠 Anfitrión"],
  "Nome completo": ["Full name", "Nombre completo"],
  "Seu nome completo": ["Your full name", "Tu nombre completo"],
  Email: ["Email", "Correo"],
  "seu@email.com": ["your@email.com", "tu@correo.com"],
  CPF: ["CPF (Tax ID)", "CPF (ID fiscal)"],
  "Data de nascimento": ["Date of birth", "Fecha de nacimiento"],
  "DD/MM/AAAA": ["DD/MM/YYYY", "DD/MM/AAAA"],
  Senha: ["Password", "Contraseña"],
  "Confirmar senha": ["Confirm password", "Confirmar contraseña"],
  "Já tem uma conta?": ["Already have an account?", "¿Ya tienes una cuenta?"],
  "Fazer login": ["Log in", "Iniciar sesión"],
  "Erro de conexão com o servidor.": [
    "Server connection error.",
    "Error de conexión con el servidor.",
  ],
  "Erro no Acesso": ["Access Error", "Error de Acceso"],
  "Social Login": ["Social Login", "Inicio de sesión social"],
  "Bem-vindo de volta!": ["Welcome back!", "¡Bienvenido de nuevo!"],
  "Faça login para continuar": [
    "Log in to continue",
    "Inicia sesión para continuar",
  ],
  "Esqueceu a senha?": ["Forgot your password?", "¿Olvidaste tu contraseña?"],
  "ou continue com": ["or continue with", "o continúa con"],
  "Não tem uma conta?": ["Don't have an account?", "¿No tienes una cuenta?"],
  "Cadastre-se": ["Sign up", "Regístrate"],
  Login: ["Log in", "Iniciar sesión"],

  // ---------- Carrinho ----------
  "Caneca Personalizada": ["Custom Mug", "Taza Personalizada"],
  "Porta-retrato vídeo": ["Video photo frame", "Portarretratos de video"],
  "Chaveiro com TAG": ["Keychain with TAG", "Llavero con TAG"],
  "Blusa Personalizada": ["Custom Shirt", "Blusa Personalizada"],
  "Digite um código de cupom": [
    "Enter a coupon code",
    "Escribe un código de cupón",
  ],
  "Faça login para usar um cupom": [
    "Log in to use a coupon",
    "Inicia sesión para usar un cupón",
  ],
  "Cupom inválido.": ["Invalid coupon.", "Cupón inválido."],
  "Código inválido. Tente novamente.": [
    "Invalid code. Please try again.",
    "Código inválido. Inténtalo de nuevo.",
  ],
  "Carrinho vazio": ["Empty cart", "Carrito vacío"],
  "Adicione itens ao carrinho antes de finalizar.": [
    "Add items to the cart before checking out.",
    "Añade artículos al carrito antes de finalizar.",
  ],
  "Faça login": ["Log in", "Inicia sesión"],
  "Você precisa estar logado para finalizar a compra.": [
    "You need to be logged in to complete the purchase.",
    "Debes iniciar sesión para finalizar la compra.",
  ],
  "Ir para login": ["Go to login", "Ir a iniciar sesión"],
  "Detalhamento do pedido": ["Order breakdown", "Desglose del pedido"],
  Subtotal: ["Subtotal", "Subtotal"],
  "Desconto (": ["Discount (", "Descuento ("],
  "Taxa da Plataforma": ["Platform Fee", "Tarifa de la Plataforma"],
  "A taxa de serviço cobre o suporte, manutenção e segurança do aplicativo.": [
    "The service fee covers the app's support, maintenance and security.",
    "La tarifa de servicio cubre el soporte, mantenimiento y seguridad de la aplicación.",
  ],
  Total: ["Total", "Total"],
  Entendi: ["Got it", "Entendido"],
  CARRINHO: ["CART", "CARRITO"],
  "Produtos (": ["Products (", "Productos ("],
  Limpar: ["Clear", "Limpiar"],
  "Seu carrinho está vazio": ["Your cart is empty", "Tu carrito está vacío"],
  "Que tal explorar nossas ofertas?": [
    "How about exploring our offers?",
    "¿Qué tal explorar nuestras ofertas?",
  ],
  até: ["until", "hasta"],
  "noite(s)": ["night(s)", "noche(s)"],
  "Você também pode gostar": ["You may also like", "También te puede gustar"],
  "Resumo do Pedido": ["Order Summary", "Resumen del Pedido"],
  "Código do cupom": ["Coupon code", "Código del cupón"],
  Aplicar: ["Apply", "Aplicar"],
  "% OFF": ["% OFF", "% DTO"],
  Desconto: ["Discount", "Descuento"],
  "Ver detalhamento do pedido": [
    "View order breakdown",
    "Ver desglose del pedido",
  ],
  "ou em até 12x de": ["or up to 12x of", "o hasta 12x de"],
  "sem juros": ["interest-free", "sin intereses"],
  "Finalizar Compra": ["Checkout", "Finalizar Compra"],
  "🔒 Compra segura": ["🔒 Secure purchase", "🔒 Compra segura"],
  "🔄 Pagamento protegido": ["🔄 Protected payment", "🔄 Pago protegido"],

  // ---------- Pagamento ----------
  PIX: ["PIX", "PIX"],
  Pix: ["Pix", "Pix"],
  "Cartão de Crédito": ["Credit Card", "Tarjeta de Crédito"],
  "Cartão de crédito": ["Credit card", "Tarjeta de crédito"],
  "Cartão de débito": ["Debit card", "Tarjeta de débito"],
  "Boleto Bancário": ["Bank Slip (Boleto)", "Boleto Bancario"],
  Boleto: ["Boleto", "Boleto"],
  "Carregando...": ["Loading...", "Cargando..."],
  "Adicione itens ao carrinho antes de pagar.": [
    "Add items to the cart before paying.",
    "Añade artículos al carrito antes de pagar.",
  ],
  "Escolha uma forma de pagamento.": [
    "Choose a payment method.",
    "Elige una forma de pago.",
  ],
  "Pagamento aprovado!": ["Payment approved!", "¡Pago aprobado!"],
  "Sua compra foi confirmada com sucesso.": [
    "Your purchase was successfully confirmed.",
    "Tu compra fue confirmada con éxito.",
  ],
  "Ver minhas reservas": ["View my bookings", "Ver mis reservas"],
  "Erro ao processar o pagamento. Tente novamente.": [
    "Error processing payment. Please try again.",
    "Error al procesar el pago. Inténtalo de nuevo.",
  ],
  "Erro no pagamento": ["Payment error", "Error en el pago"],
  "Não há itens para pagar": [
    "There are no items to pay for",
    "No hay artículos para pagar",
  ],
  "Voltar pro carrinho": ["Back to cart", "Volver al carrito"],
  Pagamento: ["Payment", "Pago"],
  "Resumo do pedido": ["Order summary", "Resumen del pedido"],
  "Quantidade:": ["Quantity:", "Cantidad:"],
  "Forma de pagamento": ["Payment method", "Forma de pago"],
  "O total acima já inclui a taxa da plataforma.": [
    "The total above already includes the platform fee.",
    "El total anterior ya incluye la tarifa de la plataforma.",
  ],
  "Pagamento simulado para fins de teste — nenhuma cobrança real será feita.": [
    "Simulated payment for testing purposes — no real charge will be made.",
    "Pago simulado con fines de prueba — no se realizará ningún cargo real.",
  ],
  "Confirmar pagamento ·": ["Confirm payment ·", "Confirmar pago ·"],

  // ---------- Concluído ----------
  CONCLUÍDO: ["COMPLETED", "COMPLETADO"],
  "Compra Finalizada!": ["Purchase Completed!", "¡Compra Finalizada!"],
  "Obrigado por comprar com a": [
    "Thank you for shopping with",
    "Gracias por comprar con",
  ],
  "! Sua viagem dos sonhos está mais perto.": [
    "! Your dream trip is getting closer.",
    "¡ Tu viaje soñado está más cerca.",
  ],
  "Um e-mail de confirmação foi enviado para seu endereço.": [
    "A confirmation email was sent to your address.",
    "Se envió un correo de confirmación a tu dirección.",
  ],
  "Detalhes do Pedido": ["Order Details", "Detalles del Pedido"],
  "🎯 Desconto (": ["🎯 Discount (", "🎯 Descuento ("],
  "Pagamento via:": ["Payment via:", "Pago mediante:"],
  "Voltar para Home": ["Back to Home", "Volver al Inicio"],

  // ---------- Configurações ----------
  Preferências: ["Preferences", "Preferencias"],
  Notificações: ["Notifications", "Notificaciones"],
  "Modo Escuro": ["Dark Mode", "Modo Oscuro"],
  "Preferências de Exibição": [
    "Display Preferences",
    "Preferencias de Visualización",
  ],
  Idioma: ["Language", "Idioma"],
  Privacidade: ["Privacy", "Privacidad"],
  "Política de Privacidade": ["Privacy Policy", "Política de Privacidad"],
  "Escolha o idioma": ["Choose the language", "Elige el idioma"],
  Fechar: ["Close", "Cerrar"],

  // ---------- Contato ----------
  "E-mail": ["Email", "Correo electrónico"],
  Telefone: ["Phone", "Teléfono"],
  WhatsApp: ["WhatsApp", "WhatsApp"],
  Instagram: ["Instagram", "Instagram"],
  "Por favor, informe seu nome": [
    "Please enter your name",
    "Por favor, ingresa tu nombre",
  ],
  "Por favor, informe um e-mail válido": [
    "Please enter a valid email",
    "Por favor, ingresa un correo válido",
  ],
  "Por favor, escreva sua mensagem": [
    "Please write your message",
    "Por favor, escribe tu mensaje",
  ],
  "Mensagem Enviada!": ["Message Sent!", "¡Mensaje Enviado!"],
  "Agradecemos seu contato. Responderemos em breve.": [
    "Thank you for contacting us. We will reply soon.",
    "Gracias por contactarnos. Responderemos pronto.",
  ],
  "Não foi possível enviar sua mensagem. Tente novamente.": [
    "Could not send your message. Please try again.",
    "No fue posible enviar tu mensaje. Inténtalo de nuevo.",
  ],
  "Fale Conosco": ["Contact Us", "Contáctanos"],
  "Estamos aqui para ajudar! Escolha uma das opções abaixo ou envie uma mensagem.":
    [
      "We're here to help! Choose one of the options below or send a message.",
      "¡Estamos aquí para ayudar! Elige una de las opciones o envía un mensaje.",
    ],
  "Envie uma mensagem": ["Send a message", "Envía un mensaje"],
  "Seu nome": ["Your name", "Tu nombre"],
  "Seu e-mail": ["Your email", "Tu correo"],
  "Sua mensagem": ["Your message", "Tu mensaje"],
  "Enviar mensagem": ["Send message", "Enviar mensaje"],

  // ---------- Editar perfil ----------
  "Sessão expirada. Faça login novamente.": [
    "Session expired. Please log in again.",
    "Sesión expirada. Inicia sesión nuevamente.",
  ],
  "Não foi possível carregar seus dados.": [
    "Could not load your data.",
    "No fue posible cargar tus datos.",
  ],
  "Os campos Nome e E-mail são obrigatórios.": [
    "The Name and Email fields are required.",
    "Los campos Nombre y Correo son obligatorios.",
  ],
  "Perfil atualizado com sucesso!": [
    "Profile updated successfully!",
    "¡Perfil actualizado con éxito!",
  ],
  "Falha ao atualizar os dados.": [
    "Failed to update the data.",
    "Error al actualizar los datos.",
  ],
  "Dados Pessoais": ["Personal Data", "Datos Personales"],
  "Nome Completo": ["Full Name", "Nombre Completo"],
  "Digite seu nome": ["Enter your name", "Escribe tu nombre"],
  "seu-email@exemplo.com": ["your-email@example.com", "tu-correo@ejemplo.com"],
  "Telefone / WhatsApp": ["Phone / WhatsApp", "Teléfono / WhatsApp"],
  "Salvar Alterações": ["Save Changes", "Guardar Cambios"],

  // ---------- Recuperar senha ----------
  "Digite seu e-mail para recuperar a senha.": [
    "Enter your email to recover your password.",
    "Escribe tu correo para recuperar la contraseña.",
  ],
  "Digite um e-mail válido.": [
    "Enter a valid email.",
    "Escribe un correo válido.",
  ],
  "✅ E-mail enviado!": ["✅ Email sent!", "✅ ¡Correo enviado!"],
  "Não foi possível enviar o e-mail. Tente novamente.": [
    "Could not send the email. Please try again.",
    "No fue posible enviar el correo. Inténtalo de nuevo.",
  ],
  "Digite o código de verificação enviado para seu e-mail.": [
    "Enter the verification code sent to your email.",
    "Escribe el código de verificación enviado a tu correo.",
  ],
  "O código deve ter pelo menos 6 dígitos.": [
    "The code must have at least 6 digits.",
    "El código debe tener al menos 6 dígitos.",
  ],
  "✅ Código verificado!": ["✅ Code verified!", "✅ ¡Código verificado!"],
  "Agora você pode criar uma nova senha.": [
    "You can now create a new password.",
    "Ahora puedes crear una nueva contraseña.",
  ],
  "Não foi possível verificar o código. Tente novamente.": [
    "Could not verify the code. Please try again.",
    "No fue posible verificar el código. Inténtalo de nuevo.",
  ],
  "✅ Código reenviado!": ["✅ Code resent!", "✅ ¡Código reenviado!"],
  "Não foi possível reenviar o código.": [
    "Could not resend the code.",
    "No fue posible reenviar el código.",
  ],
  "Digite sua nova senha.": [
    "Enter your new password.",
    "Escribe tu nueva contraseña.",
  ],
  "A senha deve ter pelo menos 6 caracteres.": [
    "The password must have at least 6 characters.",
    "La contraseña debe tener al menos 6 caracteres.",
  ],
  "As senhas não coincidem.": [
    "Passwords do not match.",
    "Las contraseñas no coinciden.",
  ],
  "✅ Senha redefinida!": [
    "✅ Password reset!",
    "✅ ¡Contraseña restablecida!",
  ],
  "Sua senha foi alterada com sucesso. Faça login com sua nova senha.": [
    "Your password was changed successfully. Log in with your new password.",
    "Tu contraseña fue cambiada con éxito. Inicia sesión con tu nueva contraseña.",
  ],
  "Não foi possível redefinir a senha. Tente novamente.": [
    "Could not reset the password. Please try again.",
    "No fue posible restablecer la contraseña. Inténtalo de nuevo.",
  ],
  "Recuperar Senha": ["Recover Password", "Recuperar Contraseña"],
  "Digite seu e-mail cadastrado e enviaremos um código de verificação para redefinir sua senha.":
    [
      "Enter your registered email and we'll send a verification code to reset your password.",
      "Escribe tu correo registrado y enviaremos un código de verificación para restablecer tu contraseña.",
    ],
  "Digite seu e-mail": ["Enter your email", "Escribe tu correo"],
  "Enviar código": ["Send code", "Enviar código"],
  "Voltar para o login": ["Back to login", "Volver al inicio de sesión"],
  "Código de Verificação": ["Verification Code", "Código de Verificación"],
  "Digite o código de 6 dígitos enviado para": [
    "Enter the 6-digit code sent to",
    "Escribe el código de 6 dígitos enviado a",
  ],
  "Código de verificação": ["Verification code", "Código de verificación"],
  "Digite o código": ["Enter the code", "Escribe el código"],
  "Verificar código": ["Verify code", "Verificar código"],
  "Não recebeu o código? Reenviar": [
    "Didn't receive the code? Resend",
    "¿No recibiste el código? Reenviar",
  ],
  Voltar: ["Back", "Volver"],
  "Nova Senha": ["New Password", "Nueva Contraseña"],
  "Crie uma nova senha para sua conta. Use pelo menos 6 caracteres.": [
    "Create a new password for your account. Use at least 6 characters.",
    "Crea una nueva contraseña para tu cuenta. Usa al menos 6 caracteres.",
  ],
  "Nova senha": ["New password", "Nueva contraseña"],
  "Digite sua nova senha": [
    "Enter your new password",
    "Escribe tu nueva contraseña",
  ],
  "Confirme sua nova senha": [
    "Confirm your new password",
    "Confirma tu nueva contraseña",
  ],
  "Redefinir senha": ["Reset password", "Restablecer contraseña"],
  "Recuperação segura": ["Secure recovery", "Recuperación segura"],

  // ---------- Reserva / produto / blog artigo ----------
  "Por favor, selecione as datas de check-in e check-out.": [
    "Please select check-in and check-out dates.",
    "Por favor, selecciona las fechas de check-in y check-out.",
  ],
  "Reserva Confirmada!": ["Booking Confirmed!", "¡Reserva Confirmada!"],
  "Sobre a Experiência": ["About the Experience", "Sobre la Experiencia"],
  "O Que Está Incluso": ["What's Included", "Qué Está Incluido"],
  Investimento: ["Investment", "Inversión"],
  "(por pessoa)": ["(per person)", "(por persona)"],
  "CHECK-IN:": ["CHECK-IN:", "CHECK-IN:"],
  "CHECK-OUT:": ["CHECK-OUT:", "CHECK-OUT:"],
  "HÓSPEDES:": ["GUESTS:", "HUÉSPEDES:"],
  RESERVAR: ["BOOK", "RESERVAR"],
  "Remover dos favoritos": ["Remove from favorites", "Quitar de favoritos"],
  "Adicionar aos favoritos": ["Add to favorites", "Añadir a favoritos"],
  "Selecionar hóspedes": ["Select guests", "Seleccionar huéspedes"],

  // ---------- Loja ----------
  Canecas: ["Mugs", "Tazas"],
  Chaveiros: ["Keychains", "Llaveros"],
  "Porta-Retratos": ["Photo Frames", "Portarretratos"],
  Imãs: ["Magnets", "Imanes"],
  Camisetas: ["T-shirts", "Camisetas"],
  "Adicione alguns itens ao carrinho!": [
    "Add some items to the cart!",
    "¡Añade algunos artículos al carrito!",
  ],
  "🛒 Compra finalizada!": ["🛒 Purchase completed!", "🛒 ¡Compra finalizada!"],
  "🛒 Loja Immercia": ["🛒 Immercia Store", "🛒 Tienda Immercia"],
  "Produtos exclusivos": ["Exclusive products", "Productos exclusivos"],
  "Limpar Carrinho": ["Clear Cart", "Vaciar Carrito"],
  "Nenhum produto nesta categoria": [
    "No products in this category",
    "Ningún producto en esta categoría",
  ],
  "Seu Carrinho": ["Your Cart", "Tu Carrito"],
  "Nenhum item adicionado": ["No items added", "Ningún artículo añadido"],
  Produto: ["Product", "Producto"],
  "🛒 Adicionado!": ["🛒 Added!", "🛒 ¡Añadido!"],
  "✅ Sucesso!": ["✅ Success!", "✅ ¡Éxito!"],
  "Avaliação enviada com sucesso! Obrigado pelo seu feedback.": [
    "Review submitted successfully! Thank you for your feedback.",
    "¡Valoración enviada con éxito! Gracias por tus comentarios.",
  ],
  "pessoas acharam útil": [
    "people found this helpful",
    "personas lo encontraron útil",
  ],
  "Útil?": ["Helpful?", "¿Útil?"],
  "Porta Retrato Inteligente": [
    "Smart Photo Frame",
    "Portarretratos Inteligente",
  ],
  "Tecnologia NFC integrada": [
    "Built-in NFC technology",
    "Tecnología NFC integrada",
  ],
  "Tela 3D com efeito holográfico": [
    "3D screen with holographic effect",
    "Pantalla 3D con efecto holográfico",
  ],
  "Bateria de longa duração": [
    "Long-lasting battery",
    "Batería de larga duración",
  ],
  "Atualizações automáticas": [
    "Automatic updates",
    "Actualizaciones automáticas",
  ],
  "Conexão Wi-Fi": ["Wi-Fi connection", "Conexión Wi-Fi"],
  "App para personalização": [
    "Customization app",
    "Aplicación de personalización",
  ],
  "Em estoque": ["In stock", "En stock"],
  "Frete grátis": ["Free shipping", "Envío gratis"],
  "Garantia 12 meses": ["12-month warranty", "Garantía de 12 meses"],
  "Adicionar ao carrinho": ["Add to cart", "Añadir al carrito"],
  "Avaliações dos clientes": [
    "Customer reviews",
    "Valoraciones de los clientes",
  ],
  "Avaliar produto": ["Rate product", "Valorar producto"],
  "Escreva sua avaliação": ["Write your review", "Escribe tu valoración"],
  "Nome:": ["Name:", "Nombre:"],
  "Nota:": ["Rating:", "Nota:"],
  "Comentário:": ["Comment:", "Comentario:"],
  "Conte sua experiência com o produto...": [
    "Tell us about your experience with the product...",
    "Cuéntanos tu experiencia con el producto...",
  ],
  "Enviar avaliação": ["Submit review", "Enviar valoración"],
  "Carregar mais avaliações": ["Load more reviews", "Cargar más valoraciones"],
  "Vista frontal": ["Front view", "Vista frontal"],
  "Vista lateral": ["Side view", "Vista lateral"],
  Detalhe: ["Detail", "Detalle"],
  "Em uso": ["In use", "En uso"],

  // ---------- Reservas / ganhos / hospedagens do anfitrião ----------
  Pendente: ["Pending", "Pendiente"],
  Confirmada: ["Confirmed", "Confirmada"],
  Cancelada: ["Cancelled", "Cancelada"],
  "Você precisa estar logado para ver seus ganhos.": [
    "You need to be logged in to see your earnings.",
    "Debes iniciar sesión para ver tus ganancias.",
  ],
  "Não foi possível carregar seus ganhos.": [
    "Could not load your earnings.",
    "No fue posible cargar tus ganancias.",
  ],
  "Valor da reserva": ["Booking amount", "Valor de la reserva"],
  "Sua taxa": ["Your fee", "Tu tarifa"],
  "Você recebe": ["You receive", "Recibes"],
  "Total líquido recebido": ["Total net received", "Total neto recibido"],
  "reserva(s) confirmada(s) ou concluída(s)": [
    "confirmed or completed booking(s)",
    "reserva(s) confirmada(s) o completada(s)",
  ],
  "Total bruto": ["Gross total", "Total bruto"],
  "Extrato de reservas": ["Booking statement", "Extracto de reservas"],
  "Você ainda não recebeu nenhuma reserva": [
    "You haven't received any bookings yet",
    "Aún no has recibido ninguna reserva",
  ],
  "Não foi possível carregar suas hospedagens.": [
    "Could not load your stays.",
    "No fue posible cargar tus alojamientos.",
  ],
  "Faça login para ver suas hospedagens.": [
    "Log in to see your stays.",
    "Inicia sesión para ver tus alojamientos.",
  ],
  "Você ainda não possui nenhuma hospedagem cadastrada.": [
    "You don't have any stays registered yet.",
    "Aún no tienes ningún alojamiento registrado.",
  ],
  "Anunciar Hospedagem": ["List a Stay", "Anunciar Alojamiento"],
  "Você precisa estar logado para ver suas reservas.": [
    "You need to be logged in to see your bookings.",
    "Debes iniciar sesión para ver tus reservas.",
  ],
  "Não foi possível carregar suas reservas.": [
    "Could not load your bookings.",
    "No fue posible cargar tus reservas.",
  ],
  "Código:": ["Code:", "Código:"],
  "Você ainda não fez nenhuma reserva": [
    "You haven't made any bookings yet",
    "Aún no has hecho ninguna reserva",
  ],
  "Explorar produtos": ["Explore products", "Explorar productos"],

  // ---------- Relatórios ----------
  "Codigo Reserva": ["Booking Code", "Código de Reserva"],
  "Email Cliente": ["Customer Email", "Correo del Cliente"],
  "Gasto do Cliente": ["Customer Spend", "Gasto del Cliente"],
  "Taxa da Plataforma (10%)": [
    "Platform Fee (10%)",
    "Tarifa de la Plataforma (10%)",
  ],
  "Taxa do Produto (3%)": ["Product Fee (3%)", "Tarifa del Producto (3%)"],
  "Valor Repassado ao Anfitriao": [
    "Amount Paid to Host",
    "Valor Transferido al Anfitrión",
  ],
  "Não foi possível carregar o relatório.": [
    "Could not load the report.",
    "No fue posible cargar el informe.",
  ],
  "Sem dados": ["No data", "Sin datos"],
  "Não há reservas nesse período pra exportar.": [
    "There are no bookings in this period to export.",
    "No hay reservas en este período para exportar.",
  ],
  "Salvar relatório financeiro": [
    "Save financial report",
    "Guardar informe financiero",
  ],
  "Arquivo gerado": ["File generated", "Archivo generado"],
  "Erro ao gerar arquivo": [
    "Error generating file",
    "Error al generar el archivo",
  ],
  "Tente novamente.": ["Please try again.", "Inténtalo de nuevo."],
  "Relatório Financeiro": ["Financial Report", "Informe Financiero"],
  "Total que ENTRA (taxas)": ["Total IN (fees)", "Total que ENTRA (tarifas)"],
  "Total que SAI (repasses aos anfitriões)": [
    "Total OUT (payouts to hosts)",
    "Total que SALE (pagos a anfitriones)",
  ],
  Detalhamento: ["Breakdown", "Desglose"],
  "Total gasto pelos clientes": [
    "Total spent by customers",
    "Total gastado por los clientes",
  ],
  "Taxa da plataforma (10% · cliente)": [
    "Platform fee (10% · customer)",
    "Tarifa de la plataforma (10% · cliente)",
  ],
  "Taxa do produto (3% · anfitrião)": [
    "Product fee (3% · host)",
    "Tarifa del producto (3% · anfitrión)",
  ],
  "Reservas consideradas": ["Bookings considered", "Reservas consideradas"],
  "Baixar relatório (CSV)": [
    "Download report (CSV)",
    "Descargar informe (CSV)",
  ],
  "O arquivo inclui todas as reservas confirmadas ou concluídas, com valores individuais de cada uma.":
    [
      "The file includes all confirmed or completed bookings, with individual amounts for each.",
      "El archivo incluye todas las reservas confirmadas o completadas, con los valores individuales de cada una.",
    ],

  // ---------- Sair ----------
  "Sair da Conta": ["Log Out", "Cerrar Sesión"],
  "Tem certeza que deseja sair? Você precisará fazer login novamente para acessar sua conta.":
    [
      "Are you sure you want to log out? You will need to log in again to access your account.",
      "¿Seguro que deseas salir? Deberás iniciar sesión nuevamente para acceder a tu cuenta.",
    ],
  "Não foi possível sair. Tente novamente.": [
    "Could not log out. Please try again.",
    "No fue posible salir. Inténtalo de nuevo.",
  ],
  "Limpar Dados Locais": ["Clear Local Data", "Borrar Datos Locales"],
  "Isso removerá todos os dados salvos no dispositivo. Tem certeza?": [
    "This will remove all data saved on the device. Are you sure?",
    "Esto eliminará todos los datos guardados en el dispositivo. ¿Estás seguro?",
  ],
  "Dados locais removidos com sucesso!": [
    "Local data removed successfully!",
    "¡Datos locales eliminados con éxito!",
  ],
  "Deseja sair do aplicativo?": [
    "Do you want to leave the app?",
    "¿Deseas salir de la aplicación?",
  ],
  "Ao sair, você será redirecionado para a tela de login e precisará inserir suas credenciais novamente.":
    [
      "When you log out, you will be redirected to the login screen and will need to enter your credentials again.",
      "Al salir, serás redirigido a la pantalla de inicio de sesión y deberás ingresar tus credenciales nuevamente.",
    ],
  "Limpar dados locais": ["Clear local data", "Borrar datos locales"],
  "Suas informações pessoais permanecem seguras mesmo após sair.": [
    "Your personal information remains safe even after logging out.",
    "Tu información personal permanece segura incluso después de salir.",
  ],

  // ---------- Sobre ----------
  "Sobre Nós": ["About Us", "Sobre Nosotros"],
  Apresenta: ["Presents", "Presenta"],
  "Sobre o Projeto": ["About the Project", "Sobre el Proyecto"],
  "Nossa Missão": ["Our Mission", "Nuestra Misión"],
  "Nossos Valores": ["Our Values", "Nuestros Valores"],
  Sustentabilidade: ["Sustainability", "Sostenibilidad"],
  "Turismo responsável que preserva o meio ambiente": [
    "Responsible tourism that preserves the environment",
    "Turismo responsable que preserva el medio ambiente",
  ],
  "Cultura Local": ["Local Culture", "Cultura Local"],
  "Valorização das tradições e comunidades": [
    "Appreciation of traditions and communities",
    "Valorización de las tradiciones y comunidades",
  ],
  Segurança: ["Safety", "Seguridad"],
  "Experiências seguras e confiáveis": [
    "Safe and reliable experiences",
    "Experiencias seguras y confiables",
  ],
  Autenticidade: ["Authenticity", "Autenticidad"],
  "Experiências genuinamente brasileiras": [
    "Genuinely Brazilian experiences",
    "Experiencias genuinamente brasileñas",
  ],
  "O que Oferecemos": ["What We Offer", "Lo que Ofrecemos"],
  "Experiências Únicas:": ["Unique Experiences:", "Experiencias Únicas:"],
  "Atividades exclusivas e imersivas": [
    "Exclusive and immersive activities",
    "Actividades exclusivas e inmersivas",
  ],
  "Hospedagens Selecionadas:": [
    "Selected Stays:",
    "Alojamientos Seleccionados:",
  ],
  "Hotéis e pousadas com alma brasileira": [
    "Hotels and inns with a Brazilian soul",
    "Hoteles y posadas con alma brasileña",
  ],
  "Pacotes Completos:": ["Complete Packages:", "Paquetes Completos:"],
  "Roteiros planejados para você": [
    "Itineraries planned for you",
    "Itinerarios planificados para ti",
  ],
  "Destinos por Todo Brasil:": [
    "Destinations All Over Brazil:",
    "Destinos por Todo Brasil:",
  ],
  "De Norte a Sul": ["From North to South", "De Norte a Sur"],
  "Nossos Diferenciais": ["Our Differentials", "Nuestros Diferenciales"],
  "Atendimento personalizado 24/7": [
    "Personalized support 24/7",
    "Atención personalizada 24/7",
  ],
  "Guias locais especializados": [
    "Specialized local guides",
    "Guías locales especializados",
  ],
  "Roteiros exclusivos e sob medida": [
    "Exclusive, tailor-made itineraries",
    "Itinerarios exclusivos y a medida",
  ],
  "Parcerias com comunidades locais": [
    "Partnerships with local communities",
    "Alianzas con comunidades locales",
  ],
  "Compromisso com a sustentabilidade": [
    "Commitment to sustainability",
    "Compromiso con la sostenibilidad",
  ],
  "Descubra o Brasil de verdade": [
    "Discover the real Brazil",
    "Descubre el Brasil de verdad",
  ],

  // ---------- Termos (títulos) ----------
  "DOCUMENTOS LEGAIS": ["LEGAL DOCUMENTS", "DOCUMENTOS LEGALES"],
  "Termos de Uso": ["Terms of Use", "Términos de Uso"],
  "TERMOS DE USO — IMMERSIA": [
    "TERMS OF USE — IMMERSIA",
    "TÉRMINOS DE USO — IMMERSIA",
  ],
  "POLÍTICA DE PRIVACIDADE": ["PRIVACY POLICY", "POLÍTICA DE PRIVACIDAD"],
  "1. SOBRE A IMMERSIA": ["1. ABOUT IMMERSIA", "1. SOBRE IMMERSIA"],
  "2. CADASTRO DO USUÁRIO": ["2. USER REGISTRATION", "2. REGISTRO DEL USUARIO"],
  "3. SERVIÇOS OFERECIDOS": ["3. SERVICES OFFERED", "3. SERVICIOS OFRECIDOS"],
  "4. PAGAMENTOS": ["4. PAYMENTS", "4. PAGOS"],
  "5. CANCELAMENTOS E REEMBOLSOS": [
    "5. CANCELLATIONS AND REFUNDS",
    "5. CANCELACIONES Y REEMBOLSOS",
  ],
  "6. RESPONSABILIDADES DA IMMERSIA": [
    "6. IMMERSIA'S RESPONSIBILITIES",
    "6. RESPONSABILIDADES DE IMMERSIA",
  ],
  "7. RESPONSABILIDADES DOS PARCEIROS": [
    "7. PARTNERS' RESPONSIBILITIES",
    "7. RESPONSABILIDADES DE LOS SOCIOS",
  ],
  "8. CONDUTA DO USUÁRIO": ["8. USER CONDUCT", "8. CONDUCTA DEL USUARIO"],
  "9. PROPRIEDADE INTELECTUAL": [
    "9. INTELLECTUAL PROPERTY",
    "9. PROPIEDAD INTELECTUAL",
  ],
  "10. LEGISLAÇÃO E FORO": [
    "10. GOVERNING LAW AND JURISDICTION",
    "10. LEGISLACIÓN Y FUERO",
  ],
  "1. DADOS COLETADOS": ["1. DATA COLLECTED", "1. DATOS RECOPILADOS"],
  "2. FINALIDADES DO USO DOS DADOS": [
    "2. PURPOSES OF DATA USE",
    "2. FINALIDADES DEL USO DE LOS DATOS",
  ],
  "3. COMPARTILHAMENTO DE DADOS": [
    "3. DATA SHARING",
    "3. COMPARTICIÓN DE DATOS",
  ],
  "4. ARMAZENAMENTO E SEGURANÇA": [
    "4. STORAGE AND SECURITY",
    "4. ALMACENAMIENTO Y SEGURIDAD",
  ],
  "5. SEUS DIREITOS (LGPD)": [
    "5. YOUR RIGHTS (LGPD)",
    "5. TUS DERECHOS (LGPD)",
  ],
  "6. CENTRAL DE ATENDIMENTO": ["6. SUPPORT CENTER", "6. CENTRO DE ATENCIÓN"],
  "Dados Cadastrais:": ["Registration Data:", "Datos de Registro:"],
  "Dados de Pagamento:": ["Payment Data:", "Datos de Pago:"],
  "Dados de Navegação:": ["Browsing Data:", "Datos de Navegación:"],

  // ---------- Usuários (admin) ----------
  "Não foi possível carregar a lista de usuários.": [
    "Could not load the user list.",
    "No fue posible cargar la lista de usuarios.",
  ],
  "Confirmar Exclusão": ["Confirm Deletion", "Confirmar Eliminación"],
  Excluir: ["Delete", "Eliminar"],
  "Usuário removido com sucesso.": [
    "User removed successfully.",
    "Usuario eliminado con éxito.",
  ],
  "Falha ao deletar a conta do usuário.": [
    "Failed to delete the user account.",
    "Error al eliminar la cuenta del usuario.",
  ],
  "Gerenciar Contas": ["Manage Accounts", "Gestionar Cuentas"],
  "Nenhum usuário cadastrado.": [
    "No registered users.",
    "Ningún usuario registrado.",
  ],
};

// ---------------------------------------------------------------------
// Textos com partes dinâmicas (números, nomes, e-mails...).
// $1, $2... recebem os trechos capturados pela expressão.
// ---------------------------------------------------------------------
const PADROES: { regex: RegExp; en: string; es: string }[] = [
  {
    regex: /^Mostrando todos os (\d+) artigos$/,
    en: "Showing all $1 articles",
    es: "Mostrando los $1 artículos",
  },
  {
    regex: /^(\d+) artigo\(s\) encontrado\(s\)$/,
    en: "$1 article(s) found",
    es: "$1 artículo(s) encontrado(s)",
  },
  {
    regex: /^(\d+) vaga\(s\) de "([\s\S]+)" adicionada\(s\)!$/,
    en: '$1 spot(s) of "$2" added!',
    es: '¡$1 plaza(s) de "$2" añadida(s)!',
  },
  {
    regex:
      /^(\d+) diária\(s\) de "([\s\S]+?)" adicionada\(s\)!\s*Check-in: ([\s\S]*?)\s*Check-out: ([\s\S]*)$/,
    en: '$1 night(s) of "$2" added!\nCheck-in: $3\nCheck-out: $4',
    es: '¡$1 noche(s) de "$2" añadida(s)!\nCheck-in: $3\nCheck-out: $4',
  },
  {
    regex: /^Cupom aplicado com sucesso! ([\d.,]+)% de desconto$/,
    en: "Coupon applied successfully! $1% off",
    es: "¡Cupón aplicado con éxito! $1% de descuento",
  },
  {
    regex:
      /^Enviamos um código de verificação para ([\s\S]+)\. Verifique sua caixa de entrada\.$/,
    en: "We sent a verification code to $1. Check your inbox.",
    es: "Enviamos un código de verificación a $1. Revisa tu bandeja de entrada.",
  },
  {
    regex: /^Um novo código foi enviado para ([\s\S]+)\.$/,
    en: "A new code was sent to $1.",
    es: "Se envió un nuevo código a $1.",
  },
  {
    regex: /^Sua reserva para (\d+) cliente\(s\) foi realizada com sucesso!$/,
    en: "Your booking for $1 guest(s) was completed successfully!",
    es: "¡Tu reserva para $1 cliente(s) fue realizada con éxito!",
  },
  {
    regex: /^Login com ([\s\S]+) em desenvolvimento$/,
    en: "Login with $1 is under development",
    es: "Inicio de sesión con $1 en desarrollo",
  },
  {
    regex: /^Deseja realmente excluir permanentemente a conta de ([\s\S]+)\?$/,
    en: "Do you really want to permanently delete $1's account?",
    es: "¿Realmente deseas eliminar permanentemente la cuenta de $1?",
  },
  {
    regex:
      /^Tem certeza que deseja apagar permanentemente a conta de ([\s\S]+)\? Esta ação não pode ser desfeita\.$/,
    en: "Are you sure you want to permanently delete $1's account? This action cannot be undone.",
    es: "¿Seguro que deseas eliminar permanentemente la cuenta de $1? Esta acción no se puede deshacer.",
  },
  {
    regex: /^(\d+)x Porta Retrato Inteligente adicionado ao carrinho\.$/,
    en: "$1x Smart Photo Frame added to the cart.",
    es: "$1x Portarretratos Inteligente añadido al carrito.",
  },
  {
    regex: /^Arquivo salvo em: ([\s\S]+)$/,
    en: "File saved at: $1",
    es: "Archivo guardado en: $1",
  },
  {
    regex: /^Total: R\$ ([\s\S]+)\s*Obrigado pela sua compra!$/,
    en: "Total: R$ $1\nThank you for your purchase!",
    es: "Total: R$ $1\n¡Gracias por tu compra!",
  },
  {
    regex: /^Ver detalhes de ([\s\S]+)$/,
    en: "View details of $1",
    es: "Ver detalles de $1",
  },
  {
    regex:
      /^Cupom ([\s\S]+?)\s*Desconto: ([\s\S]+?)\s*Aproveite no Immersian!$/,
    en: "Coupon $1\nDiscount: $2\nEnjoy it on Immersian!",
    es: "Cupón $1\nDescuento: $2\n¡Aprovecha en Immersian!",
  },
  {
    regex: /^Link da imagem (\d+)$/,
    en: "Image link $1",
    es: "Enlace de la imagen $1",
  },
  {
    regex: /^Valor por pessoa: (R\$ [\d.,]+)$/,
    en: "Price per person: $1",
    es: "Valor por persona: $1",
  },
  { regex: /^(\d+) avaliações$/, en: "$1 reviews", es: "$1 valoraciones" },
  {
    regex: /^\((\d+) avaliações\)$/,
    en: "($1 reviews)",
    es: "($1 valoraciones)",
  },
  {
    regex:
      /^(\d+) de (Janeiro|Fevereiro|Março|Abril|Maio|Junho|Julho|Agosto|Setembro|Outubro|Novembro|Dezembro), (\d{4})$/,
    en: "$2 $1, $3",
    es: "$1 de $2, $3",
  },
];

const MESES: Record<string, [string, string]> = {
  Janeiro: ["January", "enero"],
  Fevereiro: ["February", "febrero"],
  Março: ["March", "marzo"],
  Abril: ["April", "abril"],
  Maio: ["May", "mayo"],
  Junho: ["June", "junio"],
  Julho: ["July", "julio"],
  Agosto: ["August", "agosto"],
  Setembro: ["September", "septiembre"],
  Outubro: ["October", "octubre"],
  Novembro: ["November", "noviembre"],
  Dezembro: ["December", "diciembre"],
};

const indice = (idioma: Idioma) => (idioma === "en" ? 0 : 1);

/**
 * Procura o texto no dicionário fixo do app.
 * Devolve a tradução ou null se o texto não estiver no dicionário
 * (aí ele pode ser traduzido automaticamente pelo servidor).
 * Espaços do começo e do fim são preservados.
 */
export function buscarTraducao(texto: string, idioma: Idioma): string | null {
  if (idioma === "pt" || typeof texto !== "string" || texto === "") return null;

  const partes = texto.match(/^(\s*)([\s\S]*?)(\s*)$/);
  if (!partes) return null;
  const [, inicio, miolo, fim] = partes;
  if (miolo === "") return null;

  const i = indice(idioma);

  // 1. Tradução exata (ignorando quebras de linha e espaços repetidos)
  const chave = miolo.replace(/\s+/g, " ");
  const direto = DICIONARIO[chave];
  if (direto) return inicio + direto[i] + fim;

  // 2. Textos com partes dinâmicas
  for (const p of PADROES) {
    const m = miolo.match(p.regex);
    if (m) {
      let modelo = idioma === "en" ? p.en : p.es;
      // datas por extenso: o nome do mês também é traduzido
      if (m[2] && MESES[m[2]]) {
        const mes = MESES[m[2]][i];
        modelo = modelo.replace("$2", idioma === "en" ? MESES[m[2]][0] : mes);
      }
      const resultado = modelo.replace(/\$(\d)/g, (_, n) => m[Number(n)] ?? "");
      return inicio + resultado + fim;
    }
  }

  return null;
}

/**
 * Traduz um texto usando só o dicionário fixo.
 * Se não houver tradução, devolve o texto original (em português).
 */
export function traduzirTexto(texto: string, idioma: Idioma): string {
  return buscarTraducao(texto, idioma) ?? texto;
}
