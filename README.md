# Projekt Zaliczeniowy: Sklep Internetowy

Projekt zrealizowany w ramach przedmiotu Wstęp do Aplikacji Internetowych. Aplikacja jest funkcjonalnym sklepem internetowym (frontend) wykorzystującym React.js oraz zewnętrzne API (FakeStoreAPI).

## 🚀 Setup Projektu (Instalacja i Uruchomienie)

Aby uruchomić projekt lokalnie, wykonaj następujące kroki:

1.  **Pobranie repozytorium:**
    ```bash
    git clone https://github.com/MaciejKlepacki/projektWDAI.git
    ```

2.  **Instalacja zależności:**
    Upewnij się, że masz zainstalowane środowisko Node.js.
    ```bash
    npm install
    ```

3.  **Uruchomienie serwera developerskiego:**
    ```bash
    npm run dev
    ```
    Aplikacja będzie dostępna pod adresem wskazanym w terminalu.

## 🛠 Użyta Technologia i Biblioteki

*   **Framework:** [React](https://react.dev/) + [Vite](https://vitejs.dev/)
*   **Routing:** [React Router DOM](https://reactrouter.com/) (obsługa nawigacji SPA)
*   **Ikony:** [Lucide React](https://lucide.dev/)
*   **API:** [FakeStoreAPI](https://fakestoreapi.com/) (dane produktów)
*   **Style:** CSS (Layout oparty na Flexbox/Grid, responsywność)

## 📋 Opis Funkcjonalności

### 1. Strona Główna (Home)
*   Wyświetlanie listy produktów pobranych z API.
*   **Wyszukiwarka:** Filtrowanie produktów po nazwie w czasie rzeczywistym.
*   **Kategorie:** Możliwość filtrowania produktów po kategoriach (pobieranych dynamicznie).

### 2. Szczegóły Produktu (Product Details)
*   Pełny opis produktu, cena, ocena, zdjęcie.
*   **Dodawanie do koszyka:** Wybór ilości (zależne od losowo generowanego stanu magazynowego).
*   **System Opinii:**
    *   Możliwość dodania opinii (gwiazdki + komentarz) tylko dla zalogowanych użytkowników.
    *   Walidacja: Użytkownik może dodać tylko jedną opinię do produktu.
    *   **Uprawnienia:** Administrator może usuwać każdą opinię, użytkownik tylko swoją.

### 3. Koszyk (Cart)
*   Podgląd dodanych produktów.
*   Zmiana ilości produktów.
*   Usuwanie produktów.
*   Podsumowanie kosztów.
*   **Checkout:** Symulacja zakupu – wymaga zalogowania. Po zakupie koszyk jest czyszczony, a zamówienie trafia do historii.

### 4. Użytkownicy i Logowanie (Mock)
Aplikacja posiada symulowany system autentykacji (dane przechowywane w Context API + localStorage).

**Dostępne konta testowe:**
*   **Student 1:** `student1` / hasło dowolne
*   **Student 2:** `student2` / hasło dowolne
*   **Nauczyciel (Admin):** `teacher` / hasło dowolne
*   **Admin:** `admin` / hasło dowolne

_Funkcjonalności dodatkowe:_
*   Zachowanie sesji po odświeżeniu strony (localStorage).
*   Przekierowanie do logowania przy próbie zakupu bez konta.

### 5. Historia Zamówień
*   Lista złożonych zamówień z datą, ID, statusem i podsumowaniem kwoty.
*   Rozwijane szczegóły każdego zamówienia (lista kupionych produktów).

## 👥 Autorzy

*   Maciej Klepacki
