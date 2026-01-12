# Налаштування Git для проєкту

Створені допоміжні файли:
- `.gitignore` — ігнорує тимчасові, IDE та артефакти збірки
- `.gitattributes` — нормалізація кінців рядків та бінарних файлів

Кроки для ініціалізації локального репозиторію (PowerShell):

```powershell
cd path\to\cardastika
git init
git branch -M main
git add .
git commit -m "Initial import"
# (опціонально) додати віддалений репозиторій
git remote add origin https://github.com/yourname/yourrepo.git
git push -u origin main
```

Рекомендації:
- Перед комітом перегляньте `.gitignore` і додайте записи для специфічних файлів, які не повинні потрапляти в репозиторій.
- Не зберігайте секрети в коді; використовуйте `.env` і додайте його в `.gitignore`.
- Якщо хочете, я можу виконати ініціалізацію git локально — дайте дозвіл.
