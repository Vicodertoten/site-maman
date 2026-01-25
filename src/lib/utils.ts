/**
 * Utilitaires pour les médias et URLs
 */

/**
 * Convertit une URL YouTube ou Vimeo en URL d'embed
 */
export function getEmbedUrl(url: string): string {
  if (!url) return '';

  // YouTube
  const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const youtubeMatch = url.match(youtubeRegex);
  if (youtubeMatch) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
  }

  // Vimeo
  const vimeoRegex = /vimeo\.com\/(\d+)/;
  const vimeoMatch = url.match(vimeoRegex);
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }

  // Retourner l'URL telle quelle si ce n'est pas YouTube ou Vimeo
  return url;
}

/**
 * Formate un numéro de téléphone pour l'affichage
 */
export function formatPhoneNumber(phone: string): string {
  if (!phone) return '';
  // Supprime tous les caractères non numériques sauf +
  const cleaned = phone.replace(/[^\d+]/g, '');
  // Format belge: +32 478 44 40 65
  if (cleaned.startsWith('+32')) {
    const match = cleaned.match(/^\+32(\d{3})(\d{2})(\d{2})(\d{2})$/);
    if (match) {
      return `+32 ${match[1]} ${match[2]} ${match[3]} ${match[4]}`;
    }
  }
  return cleaned;
}