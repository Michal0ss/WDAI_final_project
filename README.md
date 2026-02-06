# Projekt Zaliczeniowy: Sklep Internetowy

Projekt zrealizowany w ramach przedmiotu **Wstęp do Aplikacji Internetowych**. Aplikacja to sklep internetowy napisany w React + Vite, z dodatkowym backendem (Express) obsługującym logowanie, opinie i zamówienia.

## Instalacja i uruchomienie

1. **Sklonuj repozytorium:**
   ```bash
   git clone https://github.com/MaciejKlepacki/projektWDAI.git
   ```

2. **Frontend — instalacja zależności i start:**
   ```bash
   npm install
   npm run dev
   ```
   Frontend będzie dostępny pod adresem podanym w terminalu.

3. **Backend — instalacja i start:**
   ```bash
   cd server
   npm install
   npm run dev
   ```
   Domyślny adres serwera: `http://localhost:4000`

## 🛠 Technologie

**Frontend:**
- React + Vite
- React Router DOM
- Lucide React
- CSS (Flexbox/Grid)

**Backend:**
- Node.js + Express
- lowdb (prosta baza JSON)
- bcrypt + JWT

## Funkcjonalności

### 1) Strona główna
- Lista produktów
- Wyszukiwarka (filtrowanie po nazwie)
- Filtrowanie po kategoriach

### 2) Szczegóły produktu
- Opis, cena, ocena, zdjęcie
- Dodawanie do koszyka
- System opinii:
  - dodawanie przez zalogowanych
  - 1 opinia na użytkownika
  - admin może usuwać opinie

### 3) Koszyk
- Podgląd produktów
- Zmiana ilości / usuwanie
- Podsumowanie kosztów
- Checkout (wymaga logowania)

### 4) Logowanie
- Logowanie oparte o backend
- Sesja po odświeżeniu (token)

### 5) Historia zamówień
- Lista zamówień z datą i statusem
- Szczegóły zamówienia

##  Konta testowe

Hasło: `password`

- `student1`, `student2` — rola użytkownik
- `teacher`, `admin` — rola admin

##  Dokumentacja API

- Postman: [docs/postman_collection.json](docs/postman_collection.json)
- OpenAPI: [docs/openapi.yaml](docs/openapi.yaml)

## Autorzy
- Michał Białas
- Maciej Klepacki
