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
