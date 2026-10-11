# Validador de Autenticidade de Documento

Portal de verificação de autenticidade de documentos em **Português do Brasil (`pt-BR`)**, desenvolvido estritamente conforme o fluxo e capturas de tela de referência, com suporte integrado a tradução multilíngue via Google Translate (incluindo Inglês, Urdu e outros idiomas).

---

## 🌐 Suporte a Idiomas & Tradução
- **Idioma Padrão:** Português do Brasil (`pt-BR`).
- **Tradução Dinâmica:** Integração oficial com a ferramenta do Google Translate.
- **Seletores Rápidos:** Botões de acesso direto na barra superior:
  - 🇧🇷 **Português** (Original da referência)
  - 🇬🇧 **English**
  - 🇵🇰 **اردو (Urdu)**
  - Menu suspenso para mais de 100 idiomas adicionais.
- **Preservação de Dados:** Códigos verificadores e dados nominais do titular possuem a tag `notranslate` para evitar distorções nas consultas.

---

## 🚀 Como Executar Localmente

### Opção 1: Abrir Diretamente no Navegador
Dê um duplo clique no arquivo [`index.html`](file:///d:/US%20Client/visa-verification-demo/index.html) ou abra com qualquer navegador moderno.

### Opção 2: Servidor HTTP Local (Python)
Execute no terminal da pasta:
```bash
python -m http.server 8080
```
Em seguida, acesse: `http://localhost:8080`

### Opção 3: Executar Testes Automatizados (Node.js)
```bash
node test_suite.js
```

---

## 📋 Registro de Validação Configurado

| Campo (pt-BR) | Valor Cadastrado |
| :--- | :--- |
| **Situação** | `Válido até: 18 de junho de 2028` |
| **Código** | `1da556d388c046ec8d3379e1b5cf772f` |
| **Nome** | `SHARIFULLAH` |
| **Sobrenome** | `HAMDARD` |
| **RNM** | `B269953J` |
| **Data de nascimento** | `29/02/2004` |
| **Nacionalidade** | `Afghanistan` |

---

## 📌 Estrutura e Conformidade com as Capturas

1. **Página de Pesquisa:**
   - Brasão oficial centralizado (`Logo/logo.jpeg`).
   - Título: `Validador de autenticidade de documento`.
   - Campo com rótulo `Código Verificador` pré-preenchido com `1da556d388c046ec8d3379e1b5cf772f`.
   - Botões lado a lado: `Validar` e `Limpar`.
2. **Modal Intermediário:**
   - Caixa escura com texto `Aguarde...` conforme vídeo.
3. **Página de Resultado:**
   - Fundo cinza claro (`#e9ecef`).
   - Título centralizado: `Documento autêntico`.
   - Subtítulo alinhado à esquerda: `Dados do documento`.
   - Campos com rótulos em negrito e valores alinhados à esquerda.
   - Botão azul centralizado com ícone e texto `Voltar`.
4. **Aviso Institucional:**
   - Identificação transparente de demonstração para consultoria privada sem afiliação estatal.
