// Social Media API Integration
const SOCIAL_CONFIG = {
  instagram: {
      token: 'IG_ACCESS_TOKEN',
      apiUrl: 'https://graph.instagram.com/me/media',
      fields: 'id,caption,media_url,permalink,timestamp'
  },
  facebook: {
      token: 'FB_ACCESS_TOKEN',
      apiUrl: 'https://graph.facebook.com/v19.0/',
      fields: 'name,description,cover,start_time,end_time'
  }
};

// Fetch Social Events
async function fetchSocialEvents(platform) {
  try {
      const config = SOCIAL_CONFIG[platform];
      const url = `${config.apiUrl}?fields=${config.fields}&access_token=${config.token}`;
      
      const response = await fetch(url);
      if(!response.ok) throw new Error(`${platform} API error`);
      
      return await response.json();
  } catch (error) {
      console.error(`${platform} Error:`, error);
      return { data: [] };
  }
}

// Render Events to DOM
function renderSocialEvents(events, platform) {
  const container = document.getElementById('social-events-grid');
  if(!container) return;

  events.forEach(event => {
      const eventCard = createEventCard(event, platform);
      container.appendChild(eventCard);
  });
}

function createEventCard(eventData, platform) {
  const card = document.createElement('div');
  card.className = 'event-card reveal-on-scroll';
  
  const content = `
      <div class="event-media">
          ${getMediaContent(eventData, platform)}
      </div>
      <div class="event-info">
          <h3>${eventData.name || eventData.caption?.substring(0, 50) || 'Evento'}</h3>
          <p class="event-date">${formatDate(eventData.timestamp || eventData.start_time)}</p>
          <a href="${getEventLink(eventData, platform)}" target="_blank" class="event-link">
              Vedi su ${platform.charAt(0).toUpperCase() + platform.slice(1)}
          </a>
      </div>
  `;
  
  card.innerHTML = content;
  return card;
}

// Helper Functions
function getMediaContent(data, platform) {
  if(platform === 'instagram') {
      return `<img src="${data.media_url}" alt="${data.caption}" class="event-image">`;
  }
  if(platform === 'facebook' && data.cover) {
      return `<img src="${data.cover.source}" alt="${data.name}" class="event-image">`;
  }
  return '<div class="media-placeholder"></div>';
}

function formatDate(isoString) {
  const options = { weekday: 'long', day: 'numeric', month: 'long' };
  return new Date(isoString).toLocaleDateString('it-IT', options);
}

function getEventLink(data, platform) {
  return platform === 'instagram' 
      ? data.permalink 
      : `https://facebook.com/events/${data.id}`;
}

// Initialize Social Feed
document.addEventListener('DOMContentLoaded', async () => {
  try {
      const [instagramEvents, facebookEvents] = await Promise.all([
          fetchSocialEvents('instagram'),
          fetchSocialEvents('facebook')
      ]);
      
      renderSocialEvents(instagramEvents.data, 'instagram');
      renderSocialEvents(facebookEvents.data, 'facebook');
  } catch (error) {
      console.error('Social Feed Error:', error);
  }
});