import fetch from 'node-fetch';

class CaddyClient {
  private baseUrl = 'http://localhost:2019';

  getId = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`${this.baseUrl}/id/${id}`);
      return res.ok;
    } catch {
      return false;
    }
  };

  addRoute = async (route: {
    '@id': string;
    match: any;
    handle: any;
  }): Promise<any> => {
    const isIdExist = await this.getId(route['@id']);
    if (isIdExist) {
      await this.updateId(route['@id'], route);
      return;
    }

    const res = await fetch(
      `${this.baseUrl}/config/apps/http/servers/srv0/routes/0`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(route),
      }
    );
    return res.ok;
  };

  updateId = async (id: string, update: object): Promise<any> => {
    const res = await fetch(`${this.baseUrl}/id/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(update),
    });
    return res.ok;
  };

  deleteId = async (id: string): Promise<any> => {
    const res = await fetch(`${this.baseUrl}/id/${id}`, {
      method: 'DELETE',
    });
    return res.json();
  };
}

export default CaddyClient;
