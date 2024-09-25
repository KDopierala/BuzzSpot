// lib/api-client.ts
const apiClient = {
    async get(url: string, headers?: HeadersInit) {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(headers || {}), // Dodaj dodatkowe nagłówki, jeśli są
          },
        });
    
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
    
        return response.json(); // Parsuj odpowiedź jako JSON
      },

      async post(url: string, body: object, headers?: HeadersInit) {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(headers || {}), // Dodaj dodatkowe nagłówki, jeśli są
          },
          body: JSON.stringify(body),
        });
    
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
    
        return response.json(); // Parsuj odpowiedź jako JSON, jeśli to możliwe
      },
  
    async delete(url: string, body: object) {
        const response = await fetch(url, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        });
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
    
        if (response.status === 204) {
          return; 
        }
    
        return response.json(); 
      },
  
  };
  
  export default apiClient;
  