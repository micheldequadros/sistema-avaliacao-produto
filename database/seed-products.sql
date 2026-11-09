-- Seed de desenvolvimento: 30 produtos de teste para a home (scroll infinito).
-- Rode no SQL Editor do Supabase DEPOIS da migration 20261109000000_create_products.sql.
-- Imagens: picsum.photos com seed fixa (mesma imagem sempre). Ids aleatórios de
-- 21 caracteres, como o nanoid; created_at escalonado para a ordem ser estável.

insert into public.products (id, name, description, image_url, external_link, created_at)
select
  substr(replace(gen_random_uuid()::text, '-', ''), 1, 21),
  p.name,
  p.description,
  'https://picsum.photos/seed/' || p.slug || '/800/600',
  'https://example.com/produtos/' || p.slug,
  now() - make_interval(mins => p.ord)
from (
  values
    (1,  'fone-aurora',      'Fone Aurora',             'Fone sem fio com cancelamento de ruído e 30 horas de bateria.'),
    (2,  'cafeteira-brisa',  'Cafeteira Brisa',         'Cafeteira de filtro para até 12 xícaras, com jarra térmica.'),
    (3,  'mochila-trilha',   'Mochila Trilha 28L',      'Mochila impermeável com compartimento acolchoado para notebook.'),
    (4,  'luminaria-lume',   'Luminária Lume',          'Luminária de mesa com três temperaturas de cor e dimmer.'),
    (5,  'garrafa-polar',    'Garrafa Polar 750 ml',    'Mantém a bebida gelada por 24 horas e quente por 12.'),
    (6,  'teclado-tato',     'Teclado Tato',            'Teclado mecânico compacto com switches silenciosos.'),
    (7,  'tenis-passo',      'Tênis Passo Leve',        'Tênis de corrida com amortecimento para treinos longos.'),
    (8,  'panela-ferro',     'Panela de Ferro 24 cm',   null),
    (9,  'relogio-ritmo',    'Relógio Ritmo',           'Relógio inteligente com GPS, monitor cardíaco e tela sempre ligada.'),
    (10, 'cadeira-postura',  'Cadeira Postura',         'Cadeira ergonômica com apoio lombar ajustável e braços 4D.'),
    (11, 'caixa-som-onda',   'Caixa de Som Onda',       'Caixa portátil à prova d''água com som 360 graus.'),
    (12, 'livro-receitas',   'Cozinha de Domingo',      'Livro com 120 receitas simples para a família toda.'),
    (13, 'mouse-pluma',      'Mouse Pluma',             'Mouse sem fio de 58 g com sensor de alta precisão.'),
    (14, 'tapete-yoga',      'Tapete de Yoga Raiz',     'Tapete antiderrapante de borracha natural, 5 mm.'),
    (15, 'camera-instante',  'Câmera Instante',         'Câmera instantânea com flash automático e modo selfie.'),
    (16, 'bicicleta-urbana', 'Bicicleta Urbana 7V',     'Quadro de alumínio, 7 marchas e bagageiro traseiro.'),
    (17, 'aspirador-brisa',  'Aspirador Robô Brisa',    'Mapeia a casa, desvia de obstáculos e volta sozinho para a base.'),
    (18, 'oculos-sol',       'Óculos de Sol Horizonte', 'Lentes polarizadas com proteção UV400.'),
    (19, 'jogo-tabuleiro',   'Rota das Especiarias',    'Jogo de tabuleiro de estratégia para 2 a 5 pessoas.'),
    (20, 'liquidificador',   'Liquidificador Turbo',    null),
    (21, 'kindle-folha',     'Leitor Digital Folha',    'Tela sem reflexo, luz ajustável e semanas de bateria.'),
    (22, 'barraca-vale',     'Barraca Vale 3P',         'Barraca para três pessoas, montagem em cinco minutos.'),
    (23, 'perfume-cedro',    'Perfume Cedro',           'Notas amadeiradas com toque cítrico, 100 ml.'),
    (24, 'monitor-amplo',    'Monitor Amplo 27"',       'Monitor 4K IPS com USB-C e ajuste de altura.'),
    (25, 'chaleira-gota',    'Chaleira Elétrica Gota',  'Controle de temperatura em cinco níveis para chás e café.'),
    (26, 'violao-estudio',   'Violão Estúdio',          'Violão folk com tampo maciço e captação ativa.'),
    (27, 'mala-jornada',     'Mala Jornada Média',      'Mala de casco rígido com rodas 360 graus e cadeado TSA.'),
    (28, 'planta-jiboia',    'Kit Jiboia + Vaso',       'Planta fácil de cuidar, vaso de cerâmica incluso.'),
    (29, 'carregador-fluxo', 'Carregador Fluxo 65W',    'Carrega notebook e celular ao mesmo tempo.'),
    (30, 'agenda-papel',     'Agenda Papel Pólen',      'Agenda semanal com capa dura e papel pólen 90 g.')
) as p(ord, slug, name, description);
