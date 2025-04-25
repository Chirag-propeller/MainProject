// utils/api.ts or directly inside a component
export async function createCampaign(data: any) {
    try {
        console.log("reached api.ts", data);
      const response = await fetch('/api/createCampaign/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Unknown error');
  
      return result;
    } catch (error) {
      console.error('Error creating campaign:', error);
      throw error;
    }
  }
  