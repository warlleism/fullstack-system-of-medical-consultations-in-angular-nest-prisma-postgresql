# Sistema de Consultas Médicas

Este projeto é uma aplicação completa para gerenciamento de consultas médicas, utilizando Angular para o front-end e NestJS com Prisma e PostgreSQL para o back-end.

## Sumário

- [Visão Geral](#visão-geral)
- [Front-End](#front-end)
  - [Visão Geral](#visão-geral-1)
  - [Configuração do Ambiente](#configuração-do-ambiente)
  - [Executando o Projeto](#executando-o-projeto)
- [Back-End](#back-end)
  - [Visão Geral](#visão-geral-2)
  - [Configuração do Ambiente](#configuração-do-ambiente-1)
  - [Executando o Projeto](#executando-o-projeto-1)
- [Contribuição](#contribuição)
- [Licença](#licença)

## Visão Geral

Este projeto é dividido em duas partes principais:

1. **Front-End**: Desenvolvido com Angular.
2. **Back-End**: Desenvolvido com NestJS, Prisma e PostgreSQL.

## Front-End

### Visão Geral

O front-end é responsável pela interface de usuário e comunicação com a API do back-end.

### Configuração do Ambiente

1. Clone o repositório:

    ```bash
    git clone https://github.com/warlleism/fullstack-system-of-medical-consultations-in-angular-nest-prisma-postgresql
    ```

2. Instale as dependências:

    ```bash
    npm install
    ```

3. Video de como entrar na plataforma
- [video]('https://github.com/user-attachments/assets/6e68e7fe-0c04-4c51-8aa3-bcc720fbabd5')

### Executando o Projeto

Para iniciar o servidor de desenvolvimento, execute:

```bash
npm start
```

## Back-End

### Visão Geral
 
O back-end é responsável por fornecer a API e gerenciar a lógica de negócios e a comunicação com o banco de dados.

### Configurações do ambiente

1. Clone o repositório:
  ```bash
  git clone https://github.com/warlleism/backend-system-of-medical-consultations-in-nest-prisma-postgresql/
  ```

2. Instale as dependências:
    ```bash
    npm install
    ```

3. Configure as variáveis de ambiente baseado no arquivo .env.example que se encontra dentro do repositorio. Crie um arquivo `.env` na raiz do projeto.


# Guia de Instalação do Docker

Este guia fornece instruções para instalar o Docker em sistemas operacionais populares. O Docker é uma plataforma para desenvolver, enviar e executar aplicativos dentro de containers.

## Sumário

- [Visão Geral](#visão-geral)
- [Instalação do Docker](#instalação-do-docker)
  - [Windows](#windows)
  - [macOS](#macos)
  - [Linux](#linux)
- [Verificação da Instalação](#verificação-da-instalação)
- [Recursos Adicionais](#recursos-adicionais)

## Visão Geral

O Docker permite criar e gerenciar containers que encapsulam aplicativos e suas dependências. Isso garante que o aplicativo funcione da mesma forma em diferentes ambientes.

## Instalação do Docker

### Windows

1. **Baixar o Docker Desktop:**

   Vá para a [página de downloads do Docker Desktop para Windows](https://www.docker.com/products/docker-desktop) e baixe o instalador.

2. **Instalar o Docker Desktop:**

   Execute o instalador baixado e siga as instruções na tela para concluir a instalação.

3. **Iniciar o Docker Desktop:**

   Após a instalação, inicie o Docker Desktop a partir do menu Iniciar. O Docker pode solicitar que você faça login com uma conta Docker. Se não tiver uma, você pode criar uma conta gratuita.

### macOS

1. **Baixar o Docker Desktop:**

   Vá para a [página de downloads do Docker Desktop para macOS](https://www.docker.com/products/docker-desktop) e baixe o instalador.

2. **Instalar o Docker Desktop:**

   Abra o arquivo `.dmg` baixado e arraste o ícone do Docker para a pasta Aplicativos.

3. **Iniciar o Docker Desktop:**

   Abra o Docker Desktop a partir da pasta Aplicativos. O Docker pode solicitar que você faça login com uma conta Docker. Se não tiver uma, você pode criar uma conta gratuita.

4 . **Executar o projeto back-end**

  ```bash
    docker-compose up --build
  ```

### Linux

Para a instalação no Linux, você pode seguir as instruções específicas para sua distribuição. Abaixo estão os passos gerais para distribuições baseadas em Debian (como Ubuntu):

1. **Atualizar o índice de pacotes:**

  ```bash
   sudo apt-get update
  ```

2. **Instalar o docker**

  ```bash
   sudo apt install docker-ce && docker
  ```

3. **Habilitar o docker caso não seja habilitado por default**

  ```bash
    sudo systemctl enable docker
  ```

4 . **Executar o projeto back-end**

```bash
  sudo docker-compose up --build
```