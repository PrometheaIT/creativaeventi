class SocialAPI {
  static async fetchFacebookEvents() {
      const config = {
          useExamples: true, // Imposta a false per usare le API reali
          exampleDataPath: 'assets/img/events/event-', // Percorso immagini di esempio
          facebook: {
              accessToken: 'TUO_ACCESS_TOKEN_FB',
              pageId: 'ID_PAGINA_FB',
              fields: 'name,description,start_time,cover'
          },
          instagram: {
              accessToken: 'TUO_ACCESS_TOKEN_IG',
              userId: 'ID_UTENTE_IG',
              fields: 'caption,media_url,timestamp'
          }
      };

      if (config.useExamples) {
          // Dati di esempio con immagini locali
          return Array.from({length: 6}, (_, i) => ({
              id: i+1,
              title: `Evento ${i+1}`,
              date: new Date().toLocaleDateString('it-IT'),
              image: `${config.exampleDataPath}${i+1}.jpg`,
              description: `Descrizione esempio evento ${i+1}`
          }));
      }

      try {
          // API Reale Facebook
          const fbResponse = await fetch(
              `https://graph.facebook.com/v19.0/${config.facebook.pageId}/events?` +
              `access_token=${config.facebook.accessToken}&fields=${config.facebook.fields}`
          );
          
          const fbData = await fbResponse.json();
          return fbData.data.map(event => ({
              id: event.id,
              title: event.name,
              date: new Date(event.start_time).toLocaleDateString('it-IT'),
              image: event.cover?.source || 'assets/img/fallback.jpg',
              description: event.description
          }));
      } catch (error) {
          console.error('Facebook API Error:', error);
          return this.getExampleData();
      }
  }

  // Aggiungi metodo simile per Instagram se necessario
}