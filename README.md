# ClosetMatch — MVP 01

Aplicativo web responsivo/PWA para montar combinações de roupas masculinas com base em:
- cor;
- formalidade;
- ocasião;
- peças existentes no armário;
- potencial de compra para maximizar novas combinações.

## Arquivos
- `index.html`
- `styles.css`
- `app.js`
- `manifest.json`
- `sw.js`

## Como testar
Abra `index.html` em um servidor local. Exemplos:

```bash
python -m http.server 8080
```

Depois acesse `http://localhost:8080`.

## Conteúdo inicial
O catálogo e as regras foram estruturados a partir das referências enviadas:
- combinações camisa + calça;
- combinações calça + sapato;
- terno + sapato;
- tons principais: azul-marinho, cinza, bege, azul-claro, oliva, marrom, preto, branco, bordô e variações.

Elementos da interface do Facebook foram deliberadamente ignorados.

## Próximas versões sugeridas
1. Upload de foto da própria roupa.
2. Reconhecimento automático de tipo e cor.
3. Cadastro de textura/padrão (liso, risca, xadrez).
4. Clima e estação do ano.
5. Dress code por evento.
6. Mala de viagem automática.
7. Ranking "custo por look novo".
8. Perfis de estilo.


## MVP 02 — Montador inteligente
- qualquer peça pode ser a âncora do look;
- ao selecionar uma calça, aparecem automaticamente camisa e sapato;
- ao selecionar uma camisa, aparecem automaticamente calça e sapato;
- ao selecionar um sapato, aparecem automaticamente camisa e calça;
- ao selecionar um terno, aparecem automaticamente camisa e sapato;
- somente alternativas compatíveis são exibidas;
- ao trocar uma alternativa, o restante do conjunto é recalculado automaticamente.

## MVP 03 — Manequim interativo
- o Montador Inteligente agora exibe um manequim estilizado com o conjunto atual (torso/terno, pernas, sapatos);
- tocar numa peça do manequim rola até o grupo de alternativas compatíveis daquela peça;
- o manequim é recalculado automaticamente a cada troca de peça, junto com o resto do conjunto.

### Correção
- `refreshAll()` era chamada mas nunca havia sido definida no MVP 02, o que interrompia a execução do script após o carregamento do Gerador e deixava as abas "Meu armário" e "O que falta" sempre vazias, além de impedir o registro do service worker e o botão de instalação do PWA. A função foi implementada.

## MVP 04 — Realismo do manequim e tema claro/escuro
- Manequim com tecido em gradiente (efeito de volume/luz), vinco na calça, lapelas e botões no terno, brilho no sapato e sombra de plinto — sem depender de geração de imagem por IA (que exigiria API paga e backend, incompatível com o deploy estático atual).
- Toggle de tema claro/escuro no topo, com paleta clara desenhada com intenção (marfim/bronze, não um "inverter cores" genérico), persistido em localStorage e aplicado antes do primeiro paint (sem flash).
- Todo o CSS foi migrado para tokens (`--surface-*`, `--accent*`, `--line*` etc.) para que o tema afete o app inteiro, não só a superfície.

### Nota sobre realismo fotográfico
Gerar uma imagem fotorrealista por combinação (como nas referências) exige uma API de geração de imagem com custo por chamada e um backend — isso rompe a arquitetura estática (GitHub → Netlify, sem servidor) do projeto atual. Fica como possível variante premium futura, não como base do app.

## MVP 05 — PWA instalável de verdade
O manifest e o service worker já existiam no export, mas incompletos: sem `icons` o Chrome/Android não oferece instalação nenhuma, e sem tratamento de iOS o Safari (que não dispara `beforeinstallprompt`) deixava o iPhone sem qualquer caminho.

- Ícones gerados em 512/192/apple-touch-icon/favicon a partir de um SVG on-brand (não são placeholders).
- `manifest.json` completo: `icons` (any + maskable), `id`, `scope`, `categories`, `lang`.
- `sw.js`: versionamento de cache (`v3`), limpeza de caches antigos no `activate` (o v2 nunca limpava — acumularia cache para sempre a cada deploy), fallback offline para `index.html` em navegação.
- Android/Chrome: botão "Instalar app" só aparece quando o navegador libera o prompt nativo (`beforeinstallprompt`).
- iOS/Safari: como não existe prompt nativo, o botão aparece direto e abre um tutorial curto (Compartilhar → Adicionar à Tela de Início).
- Se o app já estiver rodando instalado (modo standalone), nenhum botão de instalação aparece.
