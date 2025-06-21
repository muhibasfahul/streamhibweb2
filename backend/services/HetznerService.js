const axios = require('axios');

class HetznerService {
  constructor() {
    this.apiToken = process.env.HETZNER_API_TOKEN;
    this.baseURL = 'https://api.hetzner.cloud/v1';
    this.headers = {
      'Authorization': `Bearer ${this.apiToken}`,
      'Content-Type': 'application/json'
    };
  }

  async createServer(config) {
    try {
      const response = await axios.post(`${this.baseURL}/servers`, {
        name: config.name,
        server_type: config.serverType || 'cx11',
        image: config.image || 'ubuntu-20.04',
        ssh_keys: config.sshKeys || [],
        user_data: config.userData || ''
      }, { headers: this.headers });

      return response.data;
    } catch (error) {
      console.error('Hetzner API error:', error.response?.data || error.message);
      throw error;
    }
  }

  async getServers() {
    try {
      const response = await axios.get(`${this.baseURL}/servers`, {
        headers: this.headers
      });
      return response.data;
    } catch (error) {
      console.error('Hetzner API error:', error.response?.data || error.message);
      throw error;
    }
  }

  async deleteServer(serverId) {
    try {
      const response = await axios.delete(`${this.baseURL}/servers/${serverId}`, {
        headers: this.headers
      });
      return response.data;
    } catch (error) {
      console.error('Hetzner API error:', error.response?.data || error.message);
      throw error;
    }
  }
}

module.exports = {
  HetznerService: new HetznerService()
};