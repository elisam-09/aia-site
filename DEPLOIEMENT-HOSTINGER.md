# Déploiement sur un VPS Hostinger — guide pas à pas

Objectif : mettre le site (avec le portail admin) en ligne de façon permanente sur un
**VPS Hostinger Ubuntu**. Compte ~30–45 min la première fois.

> Prérequis : un **VPS Hostinger KVM, Ubuntu 24.04 LTS** (voir le README pour le choix).
> Tu auras reçu **l'adresse IP** et un **mot de passe root** (ou une clé SSH).
>
> Les commandes se lancent depuis **le Terminal de ton Mac**. Remplace `IP_DU_VPS`,
> `aia-ci.org` et `TON_EMAIL` par tes valeurs.

---

## 1. Se connecter au serveur

```bash
ssh root@IP_DU_VPS
```
(La première fois, tape `yes` pour accepter l'empreinte, puis le mot de passe root.)

## 2. Préparer le serveur (à faire une fois)

```bash
# Mises à jour + outils de base
apt update && apt -y upgrade
apt install -y git build-essential python3 ufw

# Node.js 22 (LTS)
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt install -y nodejs

# Caddy (reverse-proxy + HTTPS automatique)
apt install -y debian-keyring debian-archive-keyring apt-transport-https curl
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | tee /etc/apt/sources.list.d/caddy-stable.list
apt update && apt install -y caddy

# Pare-feu : autoriser SSH + web
ufw allow OpenSSH && ufw allow 80 && ufw allow 443 && ufw --force enable

# Un utilisateur dédié (on n'exécute pas le site en root)
adduser --disabled-password --gecos "" aia
```

## 3. Récupérer le code (dépôt privé)

Le dépôt est privé : on crée une **clé de déploiement en lecture seule**.

```bash
su - aia
ssh-keygen -t ed25519 -C "vps-aia" -f ~/.ssh/aia_deploy -N ""
cat ~/.ssh/aia_deploy.pub
```
Copie la ligne affichée, et sur GitHub : **dépôt `aia-site` → Settings → Deploy keys →
Add deploy key** (lecture seule, sans write). Puis, toujours en tant qu'utilisateur `aia` :

```bash
cat >> ~/.ssh/config <<'EOF'
Host github.com
  IdentityFile ~/.ssh/aia_deploy
  IdentitiesOnly yes
EOF
git clone git@github.com:elisam-09/aia-site.git
cd aia-site
```

## 4. Installer, construire, créer le 1ᵉʳ admin

```bash
npm ci
npm run build
mkdir -p data/uploads
DATABASE_PATH=data/aia.db npm run admin:creer     # crée ton compte administrateur
exit                                              # revient en root pour la suite
```

## 5. Lancer le site en service permanent

```bash
cp /home/aia/aia-site/deploy/aia.service /etc/systemd/system/aia.service
systemctl daemon-reload
systemctl enable --now aia
systemctl status aia --no-pager        # doit afficher "active (running)"
```
Le site tourne maintenant en local sur le port 4321.

## 6. Exposer en HTTPS avec Caddy

Édite `/etc/caddy/Caddyfile` (mets ton domaine) — un modèle est fourni dans
`/home/aia/aia-site/deploy/Caddyfile` :

```bash
cp /home/aia/aia-site/deploy/Caddyfile /etc/caddy/Caddyfile
nano /etc/caddy/Caddyfile      # remplace aia-ci.org par ton domaine
systemctl reload caddy
```

## 7. Pointer le domaine

Chez ton registraire (ou dans Hostinger si le domaine y est), crée un enregistrement
**A** : `aia-ci.org → IP_DU_VPS` (et un `www` en A vers la même IP). Sous quelques
minutes à quelques heures, Caddy génère le **HTTPS automatiquement**. Le site est en
ligne sur `https://aia-ci.org`, le portail sur `/admin`.

> Pas encore de domaine ? Teste d'abord via `http://IP_DU_VPS` en décommentant le bloc
> `:80` du Caddyfile (le HTTPS nécessite un domaine).

N'oublie pas de mettre l'URL définitive dans `astro.config.mjs` (champ `site`) et
`public/robots.txt`, puis refais l'étape de mise à jour ci-dessous.

---

## Sauvegardes (important)

Toutes les données sont dans `/home/aia/aia-site/data/`. Sauvegarde hebdomadaire
automatique de la base :

```bash
# En tant que aia — programme une copie chaque dimanche à 3 h
( crontab -l 2>/dev/null; echo '0 3 * * 0 sqlite3 /home/aia/aia-site/data/aia.db ".backup /home/aia/aia-site/data/sauvegarde-$(date +\%F).db"' ) | crontab -
```
(Installe l'outil si besoin : `apt install -y sqlite3`.) Récupère de temps en temps une
copie sur ton Mac : `scp aia@IP_DU_VPS:/home/aia/aia-site/data/sauvegarde-*.db .`

## Mettre à jour le site (après un changement de code)

```bash
su - aia
cd aia-site && git pull && npm ci && npm run build && exit
systemctl restart aia
```

## En cas de souci

- Voir les logs du site : `journalctl -u aia -n 100 --no-pager`
- Voir les logs de Caddy : `journalctl -u caddy -n 100 --no-pager`
- Redémarrer : `systemctl restart aia` (site) / `systemctl reload caddy` (HTTPS/proxy)
