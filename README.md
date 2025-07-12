# Janaina Iara - Tosadora Profissional (Frontend)

Este é o frontend do site da Janaina Iara, configurado para ser hospedado no GitHub Pages.

## Como hospedar no GitHub Pages

1. **Crie um repositório no GitHub**
2. **Faça upload de todos os arquivos desta pasta**
3. **Ative o GitHub Pages nas configurações do repositório**
4. **Seu site estará disponível em: `https://seu-usuario.github.io/nome-do-repositorio`**

## Arquivos inclusos

- `index.html` - Página principal
- `styles.css` - Estilos CSS
- `script_github.js` - JavaScript configurado para conectar com a API do Render
- `calendar.js` - Sistema de agendamento
- `availability.json` - Dados de disponibilidade
- `perfil.jpg` - Imagem de perfil (pode ser substituída)
- `sobre_mim.jpg` - Imagem da seção sobre (pode ser substituída)

## Configuração importante

No arquivo `script_github.js`, linha 9, você precisa atualizar a URL da API:

```javascript
this.apiBaseUrl = 'https://janaina-api.onrender.com'; // SUBSTITUA pela URL do seu Render
```

Substitua `janaina-api` pelo nome que você escolher para seu serviço no Render.

## Imagens fixas

Para trocar as imagens fixas, simplesmente substitua os arquivos:
- `perfil.jpg` - Imagem principal do hero
- `sobre_mim.jpg` - Imagem da seção "Sobre Mim"

Mantenha os mesmos nomes de arquivo para que funcionem automaticamente.

