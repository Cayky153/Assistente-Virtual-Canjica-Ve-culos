<p align="center">
  <img src="frontend/public/canjicaveiculos.jpg" alt="Canjica Veículos" width="150" style="border-radius: 50%"/>
</p>

# 🚗 Assistente Virtual - Canjica Veículos

> Assistente virtual inteligente para atendimento automatizado de clientes de uma loja de veículos, com integração ao estoque em tempo real via Google Sheets e IA conversacional via Gemini.

![Interface do Assistente](https://img.shields.io/badge/Status-Online-brightgreen) ![Node.js](https://img.shields.io/badge/Node.js-Express-green) ![React](https://img.shields.io/badge/Frontend-React-blue) ![Gemini](https://img.shields.io/badge/IA-Gemini%202.5-orange)

---

## 📖 Sobre o Projeto

A **Canjica Veículos** é uma loja de carros e motos presente na Avenida Leste Oeste 6063, Fortaleza-CE. O problema era simples: o atendimento pelo WhatsApp era lento e inconsistente pela falta de tempo disponível para responder clientes.

A solução foi um **assistente virtual com IA**, capaz de:
- Responder dúvidas sobre o estoque de veículos em tempo real
- Apresentar carros e motos disponíveis com detalhes completos
- Encaminhar o cliente para um vendedor humano quando necessário
- Manter uma persona de vendedora amigável e profissional

O projeto foi desenvolvido como **projeto final do Curso de Ia Generativa Geração Tech**, e embora o plano original fosse a integração com o WhatsApp Business (que foi impedida por pendências de verificação da conta Meta), o sistema foi adaptado para funcionar como uma interface web de chat, mantendo toda a robustez do backend, com a implementação do Whatsapp sendo realizada futuramente.

---

## ✨ Funcionalidades

- 💬 **Chat em tempo real** com IA treinada para vender veículos
- 🚗 **Consulta de estoque** integrada ao Google Sheets em tempo real
- 🧠 **Histórico de conversa** por usuário, com limpeza automática a cada 24h
- ⚡ **Cache de estoque** com atualização a cada 60 segundos para melhor performance
- 🌙 **Modo escuro/claro**
- 🔗 Webhooks da Meta configurados (prontos para integração WhatsApp futura)

---

## 🛠️ Tecnologias

| Camada | Tecnologia |
|---|---|
| Frontend | React + Vite |
| Backend | Node.js + Express |
| IA | Google Gemini 2.5 Flash |
| Estoque | Google Sheets API v4 |
| Autenticação Google | Service Account (OAuth2) |
| Deploy Backend | Render |
| Mensageria (futuro) | WhatsApp Cloud API (Meta) |

---

## 🏗️ Arquitetura e Estrutura de Arquivos

```
├── backend/
│   └── src/
│       ├── config/
│       │   ├── iaConfig/
│       │   │   ├── iaConfig.js             # Configurações do modelo Gemini
│       │   │   └── systemInstructions.js   # Prompt de sistema da IA (172 linhas de persona)
│       │   ├── appConfig.js                # Configurações gerais da aplicação
│       │   ├── envConfig.js                # Validação das variáveis de ambiente
│       │   ├── estoqueConfig.js            # Configuração da autenticação Google Sheets
│       │   └── whatsappConfig.js           # Configuração da API do WhatsApp
│       ├── controllers/
│       │   ├── chatControllers.js          # Controlador do endpoint de chat
│       │   └── webhookControllers.js       # Controladores dos webhooks da Meta
│       ├── routes/
│       │   ├── chatRoutes.js               # Rota POST /digiteseuprompt
│       │   └── webhooks.js                 # Rotas GET e POST /webhook
│       ├── services/
│       │   ├── estoqueService.js           # Consulta ao Google Sheets + cache
│       │   ├── historicoService.js         # Gerenciamento de histórico por usuário
│       │   ├── iaService.js                # Integração com Gemini + function calling
│       │   ├── messageTrackerService.js    # Rastreamento de mensagens
│       │   └── whatsappService.js          # Envio de mensagens WhatsApp (futuro)
│       ├── app.js                          # Configuração do Express
│       └── server.js                       # Entry point do servidor
│
├── frontend/
│   ├── public/
│   │   ├── canjicaveiculos.jpg             # Logo da loja
│   │   ├── favicon.svg
│   │   └── icons.svg
│   └── src/
│       ├── api/
│       │   └── api.js                      # Comunicação com o backend
│       ├── components/
│       │   ├── Chat.jsx                    # Componente principal do chat
│       │   ├── InputBox.jsx                # Campo de entrada de texto
│       │   ├── Message.jsx                 # Componente de mensagem individual
│       │   └── ThemeButton.jsx             # Botão de alternar tema claro/escuro
│       ├── App.jsx                         # Root com controle de tema
│       └── index.css                       # Estilos globais
│
├── .gitignore
└── README.md
```

---

## 🧠 Como a IA Funciona

A IA utiliza **Function Calling** do Gemini para consultar o estoque somente quando necessário:

1. Usuário envia uma mensagem
2. O Gemini analisa se precisa consultar o estoque
3. Se sim, chama a função `getEstoque` que busca os dados do Google Sheets
4. A resposta é montada com os dados reais e enviada ao usuário
5. Todo o histórico da conversa é mantido por `userId`, separado por usuário

A persona da IA foi construída com a técnica **ICEF** (Instrução, Contexto, Exemplos e Fluxo), com regras explícitas do que ela deve e não deve fazer (ex: não fechar negócios, não falar sobre financiamentos).

---

## 🌐 API — Rotas do Backend

**Backend em produção:** `https://assistente-virtual-canjica-ve-culos.onrender.com`

---

### `POST /digiteseuprompt`
Envia uma mensagem para a IA e recebe a resposta.

**Body:**
```json
{
  "prompt": "Vocês têm Toyota Corolla?",
  "userId": "user-123"
}
```

**Resposta:**
```json
{
  "reply": "Sim! Temos um Toyota Corolla Cross 2023, automático, prata, 11.000 km por R$ 165.000. Gostaria de mais detalhes ou prefere falar com um vendedor?"
}
```

| Campo | Tipo | Descrição |
|---|---|---|
| `prompt` | string | Mensagem do usuário (máx. 2000 caracteres) |
| `userId` | string | Identificador único do usuário para manter histórico |

---

### `GET /webhook`
Endpoint de verificação do webhook da Meta. Usado durante a configuração do WhatsApp Business API para validar o servidor.

**Query params esperados pela Meta:**
```
hub.mode=subscribe
hub.verify_token=SEU_TOKEN
hub.challenge=CHALLENGE_STRING
```

Se o `verify_token` bater com o `VERIFY_TOKEN` do ambiente, responde com o `hub.challenge`.

---

### `POST /webhook`
Recebe eventos do WhatsApp Cloud API (mensagens recebidas, status de entrega, etc).

**Body (exemplo de mensagem recebida):**
```json
{
  "object": "whatsapp_business_account",
  "entry": [{
    "changes": [{
      "value": {
        "messages": [{
          "from": "5585999999999",
          "text": { "body": "Olá, tem Civic?" }
        }]
      }
    }]
  }]
}
```

---

## 🚀 Como Rodar Localmente

### Pré-requisitos
- Node.js 18+
- Planilha Google Sheets com as abas `Carros` e `Motos`

### Frontend

O backend já está rodando em produção no Render, então basta rodar o frontend:

```bash
cd frontend
npm install
npm run dev
```

Acesse em: `http://localhost:5173`

### Backend (opcional, para desenvolvimento local)

```bash
cd backend/src
npm install
```

Crie um arquivo `.env` na raiz do backend com as seguintes variáveis:

```env
GEMINI_API_KEY=sua_chave_gemini
GOOGLE_CLIENT_EMAIL=sua_service_account@projeto.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----
SPREADSHEET_ID=id_da_sua_planilha
VERIFY_TOKEN=token_verificacao_meta
WHATSAPP_TOKEN=token_whatsapp_meta
```

```bash
node server.js
```

---

## 📊 Estrutura da Planilha Google Sheets

A planilha deve ter duas abas: **Carros** e **Motos**, com as colunas a partir da linha 3 (as duas primeiras são título e cabeçalho):

| Coluna | Campo |
|---|---|
| A | Marca |
| B | Modelo |
| C | Câmbio |
| D | Ano |
| E | Valor |
| F | Cor |
| G | Status |
| H | Quilometragem |

---

## 🔮 Próximos Passos

- [ ] Verificação da conta Business Meta concluída
- [ ] Integração completa com WhatsApp Business API
- [ ] Substituição dos veículos placeholder pelo estoque real da loja
- [ ] Painel administrativo para o dono da loja
- [ ] Notificações para o vendedor quando um cliente solicitar contato

---

## 👨‍💻 Desenvolvedor

Desenvolvido por **Cayky**, estudante de Sistemas e Mídias Digitas na Universidade Federal do Ceará(UFC), como projeto final do **Geração Tech**.


> *"Embora não tenha conseguido entregar da forma que almejava por fatores fora do meu controle, saí desse projeto como um desenvolvedor mais experiente — com conhecimentos em arquitetura de software, IA generativa, integração com APIs externas e webhooks. Foi uma das experiências mais enriquecedoras do meu aprendizado."*

---

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais no programa Geração Tech.