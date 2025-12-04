#!/bin/bash

# Script pour télécharger une musique samba brésilienne libre de droits
# et la placer dans le dossier public/

echo "🎵 Téléchargement de la musique samba brésilienne..."

# Créer le dossier public s'il n'existe pas
mkdir -p public

# Télécharger depuis Pixabay (musique libre de droits)
# Note: Cette URL peut changer, vérifiez sur pixabay.com
curl -L "https://cdn.pixabay.com/download/audio/2022/03/15/audio_404793.mp3" \
  -o public/samba-music.mp3 \
  --fail --silent --show-error

if [ $? -eq 0 ]; then
  echo "✅ Musique samba téléchargée avec succès dans public/samba-music.mp3"
  echo "📁 Taille du fichier: $(du -h public/samba-music.mp3 | cut -f1)"
else
  echo "❌ Échec du téléchargement automatique"
  echo ""
  echo "📥 Téléchargement manuel:"
  echo "   1. Allez sur https://pixabay.com/music/search/samba/"
  echo "   2. Téléchargez un fichier MP3 de samba"
  echo "   3. Nommez-le samba-music.mp3"
  echo "   4. Placez-le dans le dossier public/"
  echo ""
  echo "Ou utilisez cette commande:"
  echo "   wget -O public/samba-music.mp3 [URL_DU_FICHIER_MP3]"
fi



