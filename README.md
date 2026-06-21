App de Adoção de Pets

Aplicativo mobile feito em React Native (Expo) com backend no Supabase, para conectar pessoas que querem adotar animais com ONGs e doadores que têm pets disponíveis.

## Tecnologias

- **Frontend**: React Native + Expo Router
- **Backend**: Supabase (PostgreSQL, Auth, Row Level Security)
- **Linguagem**: TypeScript

## Como rodar o projeto

1. Instale as dependências:
   ```
   npm install
   ```

2. Configure o arquivo `.env` na raiz do projeto com as credenciais do Supabase:
   ```
   EXPO_PUBLIC_SUPABASE_URL=sua_url_aqui
   EXPO_PUBLIC_SUPABASE_ANON_KEY=sua_chave_aqui
   ```

3. Inicie o servidor de desenvolvimento:
   ```
   npx expo start
   ```

4. Escaneie o QR code com o app **Expo Go** (Android/iOS) ou pressione `w` para abrir no navegador.

## Tutorial de uso

### 1. Criando uma conta

Ao abrir o app pela primeira vez, toque em **"Cadastre-se"** na tela de login.

Você vai escolher um de dois tipos de conta:

- **Adotante**: para quem quer encontrar e adotar um pet.
- **ONG / Doador**: para quem tem pets disponíveis para adoção.

Preencha nome, e-mail, cidade/UF (opcional) e uma senha. Ao confirmar, sua conta é criada e você já entra direto no aplicativo.

### 2. Buscando um pet (conta Adotante)

Na tela inicial (**Home**), você vê a lista de pets disponíveis para adoção.

- Use a **barra de busca** para procurar por nome.
- Toque no ícone de filtros (ao lado da busca) para refinar por **porte**, **sexo** e **idade**.
- Toque no coração em qualquer card para **favoritar** um pet — ele aparecerá na aba **Favoritos**.

### 3. Vendo detalhes e solicitando adoção

Toque em um pet para ver sua página de detalhes: fotos, idade, porte, raça, situação de saúde (vacinado, castrado, vermifugado) e descrição.

Para iniciar o processo de adoção, toque em **"Quero Adotar"**. Você pode escrever uma mensagem para o responsável pelo pet contando um pouco sobre você. Ao confirmar, a solicitação é enviada com status **"Pendente"**.

### 4. Acompanhando suas solicitações

No seu perfil, toque em **"Minhas solicitações"** para ver o status de todos os pedidos de adoção que você já fez: pendente, em análise, aprovada ou recusada.

Você também recebe uma **notificação no aplicativo** sempre que o status de uma solicitação muda. O sininho no topo da tela inicial mostra quantas notificações novas você tem.

### 5. Cadastrando um pet (conta ONG / Doador)

Se você é uma conta do tipo ONG/Doador, um botão **"+"** aparece na tela inicial. Toque nele para cadastrar um novo pet: nome, espécie, raça, porte, sexo, idade, descrição, situação de saúde, cidade/UF e (opcionalmente) uma URL de foto.

Ao salvar, o pet passa a aparecer imediatamente na lista de pets disponíveis para todos os usuários.

### 6. Gerenciando solicitações recebidas (conta ONG / Doador)

No seu perfil, toque em **"Solicitações recebidas"** para ver todos os pedidos de adoção que outras pessoas fizeram para os seus pets.

Para cada solicitação pendente, você pode **Aprovar** ou **Recusar**. Ao aprovar, o pet passa automaticamente para o status "Em processo" e some da lista de pets disponíveis. A pessoa que solicitou recebe uma notificação com a decisão.

### 7. Editando seu perfil

No seu perfil, toque em **"Editar Perfil"** (ou no ícone de lápis sobre sua foto) para atualizar nome, telefone, cidade/UF, foto e uma breve descrição sobre você.

## Estrutura do banco de dados

O banco utiliza PostgreSQL via Supabase, com as seguintes tabelas principais:

- **profiles**: dados de cada usuário (nome, contato, localização, tipo de conta)
- **ongs**: dados adicionais para contas do tipo ONG
- **animais**: pets cadastrados para adoção
- **fotos_animal**: fotos associadas a cada pet
- **favoritos**: relação entre usuários e pets favoritados
- **solicitacoes_adocao**: pedidos de adoção e seu status
- **notificacoes**: notificações in-app geradas automaticamente

Todas as tabelas possuem políticas de **Row Level Security (RLS)**, garantindo que cada usuário só acesse e modifique os dados que lhe pertencem ou que sejam públicos por natureza (como a listagem de pets). Dois **triggers no banco** geram notificações automaticamente: ao criar uma solicitação (notifica o doador) e ao alterar seu status para aprovada/recusada (notifica o solicitante).