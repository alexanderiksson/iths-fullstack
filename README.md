# ITHS Fullstack labb 3, socialt nätverk

Detta är en sociala media app byggd so del av slutprojektet i kursen fullstackutveckling. Den erbjuder funktioner som användarautentisering, skapa inlägg, följa användare, gilla och kommentera inlägg samt profilhantering.

## Funktioner

-   **Användarautentisering**

    -   Registrering och inloggning med JWT-tokens
    -   Säker lösenordshantering (hashning)
    -   Skyddade sidor

-   **Profilhantering**

    -   Uppdatera användarnamn
    -   Ladda upp profilbild
    -   Visa följare och följda konton
    -   Radera konto

-   **Sociala funktioner**

    -   Skapa inlägg
    -   Gilla och kommentera inlägg
    -   Följ/avfölj andra användare
    -   Personligt flöde baserat på följda
    -   Sök efter användare

-   **Responsiv design**
    -   Modernt gränssnitt med Tailwind CSS
    -   Fungerar på både dator och mobil

## Tech stack

### Frontend

-   React
-   TypeScript
-   Tailwind
-   Axios

### Backend (Server)

-   Node.js med Express
-   TypeScript
-   PostgreSQL
-   JWT för autentisering
-   bcrypt för lösenordshashning
-   Cloudinary för bildlagring
-   Multer för filuppladdning

## Kom igång

1. Klona repot

    ```bash
    git clone https://github.com/yourusername/iths-fullstack.git
    cd iths-fullstack
    ```

2. Installera beroenden

    ```bash

    # Installera klient-beroenden
    cd client
    npm install

    # Installera server-beroenden
    cd ../server
    npm install
    ```

3. Skapa miljövariabler
   Skapa en .env-fil i server-mappen med följande variabler:

    ```
    JWT_SECRET
    PGURI
    CLOUDINARY_CLOUD_NAME
    CLOUDINARY_API_KEY
    CLOUDINARY_API_SECRET
    ```

4. Skapa databasen

-   Skapa en PostgreSQL-databas
-   Kör schema.sql för att skapa tabellerna

5. Starta utvecklingsservrarna

    ```bash
    # Starta backend-servern
    cd server
    npm run dev

    # I en ny terminal, starta frontend
    cd client
    npm run dev
    ```

## Produktion

För att bygga och köra applikationen i produktion:

```bash
# Bygg både frontend och backend
npm run build

# Starta produktionsservern
npm start
```
