# Validador de Autenticidade de Documento

Portal de verificação de autenticidade de documentos em **Português do Brasil (`pt-BR`)**, desenvolvido estritamente conforme o fluxo e capturas de tela de referência.

---

## 🚀 Como Executar Localmente

### Opção 1: Abrir Diretamente no Navegador
Abra o arquivo [`index.html`](file:///d:/US%20Client/visa-verification-demo/index.html) diretamente com qualquer navegador moderno.

### Opção 2: Servidor HTTP Local (Python)
Execute no terminal da pasta:
```bash
python -m http.server 8080
```
Em seguida, acesse no navegador: `http://localhost:8080`

### Opção 3: Executar Testes Automatizados (Node.js)
```bash
node test_suite.js
```

---

## 📋 Registro de Validação

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

## 📌 Especificações e Fluxo Responsivo (Mobile & PC/Laptop)

1. **Página de Pesquisa:**
   - **Mobile:**
     - Título dividido em duas linhas conforme referência mobile: `Validador de autenticidade`<br>`de documento`.
     - Campo de busca compacto (284px de largura).
   - **PC / Laptop:**
     - Título fluido em linha única centralizado: `Validador de autenticidade de documento`.
     - Campo de busca largo (620px de largura) com foco em azul suave (`#4ba3e3`).
   - Máscara UUID automática em tempo real (8-4-4-4-12): `________-____-____-____-____________`.
   - Botões centralizados lado a lado: `Validar` (azul) e `Limpar` (cinza claro).
   - Validação imediata: Alerta se o campo estiver vazio ao clicar em **Validar**.

2. **Modal de Carregamento:**
   - Caixa escura com texto `Aguarde...` com temporização realista (~600ms).

3. **Página de Resultado do Documento:**
   - **Mobile:**
     - Layout vertical compacto (284px) com rótulo acima e valor abaixo em cada linha.
     - Botão `Voltar` cinza claro centralizado.
   - **PC / Laptop:**
     - Brasão e título principal (`Documento autêntico`) centralizados no topo.
     - Subtítulo `Dados do documento` alinhado à esquerda.
     - Grade horizontal em duas colunas: Coluna de rótulos à esquerda (em negrito) e coluna de valores à direita.
     - Botão `Voltar` cinza claro centralizado na parte inferior da tela.

4. **Sem Conteúdo Adicional:**
   - Sem cabeçalhos supérfluos, rodapés ou widgets de tradução de terceiros.

