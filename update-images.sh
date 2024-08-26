COMPOSE_FILE="docker-compose.yml"

# Fonction pour afficher un message d'information
log() {
  echo "[INFO] $1"
}

log "Mise à jour des images Docker..."

cd "$(dirname "$COMPOSE_FILE")" || exit

log "Tirage des dernières images Docker..."
docker-compose pull

log "Arrêt et suppression des conteneurs existants..."
docker-compose down

log "Création et démarrage des conteneurs avec les nouvelles images..."
docker-compose up -d --build

log "Mise à jour et démarrage des conteneurs terminés."

# chmod +x update-images.sh
# ./update-images.sh