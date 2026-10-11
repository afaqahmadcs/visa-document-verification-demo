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
| **Situacao** | `Valido até: 17/08/2025` |
| **Código** | `1da556d388c046ec8d3379e1b5cf772f` |
| **Nome** | `MOHAMMAD HAKIM` |
| **Sobrenome** | `WAZIRI` |
| **RNM** | `F907916R` |
| **Data de nascimento** | `01/05/1987` |
| **Nacionalidade** | `Afeganistão` |

---

## 📌 Especificações e Fluxo

1. **Página de Pesquisa (Layout Mobile):**
   - Brasão oficial centralizado (`Logo/logo.jpeg`).
   - Título em duas linhas: `Validador de autenticidade`<br>`de documento`.
   - Campo de entrada com rótulo `Código Verificador` e máscara `________-____-____-____-____________`.
   - O campo inicia vazio e formata automaticamente com hífens (8-4-4-4-12) conforme a digitação.
   - Botões centralizados lado a lado: `Validar` (azul) e `Limpar` (cinza claro).
   - Se o campo estiver vazio ao clicar em **Validar**, exibe mensagem: `Por favor, informe o código verificador.`
   - O botão **Limpar** limpa o campo de entrada e devolve o foco.
2. **Modal de Carregamento:**
   - Caixa escura com texto `Aguarde...` conforme referência.
3. **Página de Resultado:**
   - Fundo idêntico à referência mobile.
   - Título centralizado: `Documento autêntico`.
   - Subtítulo alinhado à esquerda: `Dados do documento`.
   - Campos com rótulos e valores alinhados à esquerda (incluindo `Situacao: Valido até: 17/08/2025`).
   - Botão cinza claro centralizado: `Voltar`.
4. **Sem Conteúdo Adicional:**
   - Sem cabeçalhos ou rodapés desnecessários, sem seletores de idioma ou widgets de tradução.
