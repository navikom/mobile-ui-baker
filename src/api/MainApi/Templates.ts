import settings from "config/server";

export class Templates {
  url: string;

  constructor(path: string) {
    this.url = `${settings.domain}/templates/${path}`;
  }

  async fetch(body: any = {}) {
    const response = await fetch(this.url, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    try {
      return await response.text();
    } catch (e) {
      console.log("Templates fetch error: %s", e.message);
    }
  }
}
