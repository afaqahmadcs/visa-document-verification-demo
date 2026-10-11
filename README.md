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

## 📌 Especificações e Fluxo

1. **Página de Pesquisa:**
   - Brasão oficial centralizado (`Logo/logo.jpeg`).
   - Título: `Validador de autenticidade de documento`.
   - Campo de entrada com rótulo `Código Verificador` e placeholder `Digite o código verificador`.
   - O campo inicia completamente vazio no carregamento da página.
   - O usuário digita ou cola manualmente o código.
   - Botões lado a lado: `Validar` e `Limpar`.
   - Se o campo estiver vazio ao clicar em **Validar**, exibe mensagem: `Por favor, informe o código verificador.`
   - O botão **Limpar** limpa o campo de entrada e devolve o foco.
2. **Modal de Carregamento:**
   - Caixa escura com texto `Aguarde...` conforme referência.
3. **Página de Resultado:**
   - Fundo cinza claro (`#e9ecef`).
   - Título centralizado: `Documento autêntico`.
   - Subtítulo alinhado à esquerda: `Dados do documento`.
   - Campos com rótulos em negrito e valores com peso regular.
   - Botão azul centralizado com ícone e texto `Voltar`.
4. **Sem Conteúdo Adicional:**
   - Sem cabeçalhos ou rodapés desnecessários, sem seletores de idioma ou widgets de tradução.
